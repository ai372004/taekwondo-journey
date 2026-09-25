#!/usr/bin/env node
/* =====================================================================
   "Play like a kid": taps around every game on a phone (touch, Arabic),
   goes through first-time sign-up, the warm-up, a lesson, the quiz and
   every tab-bar tile — and reports errors or anything that stops reacting.
   Usage: node tests/kid-flow.mjs [outDir]
   ===================================================================== */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2] || path.join(ROOT, 'tests', 'kid-out');
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.atlas': 'text/plain', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, locale: 'ar-EG' });
const page = await ctx.newPage();
const problems = [];
page.on('pageerror', e => problems.push('JS error: ' + e.message));
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problems.push('console: ' + m.text().slice(0, 160)); });
const step = async (name, fn) => { try { await fn(); console.log('✔', name); } catch (e) { problems.push(`${name}: ${e.message.split('\n')[0]}`); console.log('✖', name, e.message.split('\n')[0]); await page.screenshot({ path: path.join(OUT, `fail-${name.replace(/\W+/g, '_')}.png`) }).catch(() => {}); } };
const active = () => page.evaluate(() => document.querySelector('.screen.active')?.id);
const clean = () => page.evaluate(() => { document.querySelectorAll('.flash-message').forEach(x => x.remove()); });

await page.goto(BASE);
await step('first visit: Arabic start screen, create a player by tapping', async () => {
  await page.waitForSelector('#start-screen:not([hidden])');
  if (await page.$('#ss-add')) { await page.tap('#ss-add'); await page.waitForTimeout(300); }
  await page.tap('#ss-name-input'); await page.keyboard.type('يوسف');
  await page.tap('.ss-char[data-ch="girl"]');
  await page.tap('#ss-go');
  await page.waitForTimeout(900);
  if ((await active()) !== 'home-screen' && (await active()) !== 'warmup-screen') throw new Error('did not reach the game, at ' + await active());
});
await clean();
await step('tab bar: every tile opens something', async () => {
  const tabs = ['train', 'play', 'mine', 'coach'];
  for (const t of tabs) {
    const n = await page.evaluate(t => TabBar.TABS.find(x => x.id === t).items.length, t);
    for (let i = 0; i < n; i++) {
      const danger = await page.evaluate(([t, i]) => { const it = TabBar.TABS.find(x => x.id === t).items[i]; return !!it.danger || /privacy|Restore|Save backup/i.test(it.en); }, [t, i]);
      if (danger) continue;
      await page.evaluate(() => { switchScreen('home'); document.querySelectorAll('.tkd-modal').forEach(x => x.remove()); });
      await page.waitForTimeout(250);
      await page.tap(`#tabbar [data-tab="${t}"]`); await page.waitForTimeout(300);
      await page.tap(`#tab-sheet-grid .tab-tile[data-i="${i}"]`); await page.waitForTimeout(700);
      const s = await active(); const modal = await page.evaluate(() => !!document.querySelector('.tkd-modal, #start-screen:not([hidden])'));
      if (!s && !modal) throw new Error(`${t}/${i} went nowhere`);
      await page.evaluate(() => { document.querySelectorAll('.tkd-modal').forEach(x => x.remove()); if (!document.getElementById('start-screen').hidden) StartScreen.enter(PlayerSystem.getCurrentPlayerId()); });
    }
  }
});
await clean();
await step('warm-up: skip through all 8 exercises', async () => {
  await page.evaluate(() => switchScreen('warmup')); await page.waitForTimeout(700);
  for (let i = 0; i < 20; i++) {
    const done = await page.evaluate(() => !document.getElementById('warmup-complete').hidden);
    if (done) break;
    const rest = await page.evaluate(() => !document.getElementById('wu2-rest').hidden);
    await page.tap(rest ? '#wu2-rest-skip' : '#warmup-next-btn').catch(() => {});
    await page.waitForTimeout(350);
  }
  if (!(await page.evaluate(() => !document.getElementById('warmup-complete').hidden))) throw new Error('warm-up never finished');
  await page.screenshot({ path: path.join(OUT, 'warmup-done.png') });
});
await clean();
await step('lesson: tap Next through the 5 phases to the video', async () => {
  await page.evaluate(() => { GameStateInstance.currentSkill = 'apchagi'; switchScreen('learning'); }); await page.waitForTimeout(700);
  for (let i = 0; i < 5; i++) { await page.tap('#phase-next-btn'); await page.waitForTimeout(400); }
  if (!(await page.evaluate(() => !!document.querySelector('.learning-steps video, .learning-steps .video-wrapper, .learning-steps iframe')))) throw new Error('no video step');
});
await clean();
const GAMES = ['form-control', 'puzzle', 'performance', 'action', 'error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'quiz'];
for (const g of GAMES) {
  await step(`game ${g}: 30 random kid taps`, async () => {
    await page.evaluate(g => { document.querySelectorAll('.tkd-modal').forEach(x => x.remove()); GameStateInstance.currentSkill = 'apchagi'; switchScreen(g); }, g);
    await page.waitForTimeout(1300);
    let taps = 0;
    for (let i = 0; i < 30; i++) {
      if ((await active()) !== `${g}-screen`) break;          // finished → winner screen etc.
      const target = await page.evaluate(() => {
        const scr = document.querySelector('.screen.active');
        const els = [...scr.querySelectorAll('button:not([disabled]), [role=button], canvas, .control-point, [data-eh-zone], .puzzle-piece, .option, .perf-option')]
          .filter(e => { const r = e.getBoundingClientRect(); const t = e.textContent || ''; return r.width > 8 && r.height > 8 && r.top < innerHeight - 80 && r.bottom > 0 && !/ارجع|رجوع|الرئيسية|الألعاب$/.test(t.trim()); });
        if (!els.length) return null;
        const e = els[Math.floor(Math.random() * els.length)]; const r = e.getBoundingClientRect();
        return { x: r.left + r.width * (0.3 + Math.random() * 0.4), y: r.top + r.height * (0.3 + Math.random() * 0.4) };
      });
      if (!target) { await page.evaluate(() => window.scrollBy(0, 250)); continue; }
      await page.touchscreen.tap(target.x, target.y); taps++;
      await page.waitForTimeout(260);
    }
    await page.screenshot({ path: path.join(OUT, `game-${g}.png`) });
    if (taps < 5 && (await active()) === `${g}-screen`) throw new Error(`only ${taps} things to tap`);
  });
  await clean();
}
await step('duel: two kids tap their pads', async () => {
  await page.evaluate(() => { const cur = PlayerSystem.getCurrentPlayerId(); if (PlayerSystem.getPlayers().length < 2) { PlayerSystem.createOrSelectPlayer('مريم', 'girl'); PlayerSystem.selectPlayer(cur); } switchScreen('versus'); });
  await page.waitForTimeout(800);
  const ok = await page.evaluate(() => { const ps = PlayerSystem.getPlayers(); if (ps.length < 2) return false; Versus.startMatch(ps[0], ps[1], 'apchagi'); return true; });
  if (!ok) return;
  await page.evaluate(() => document.querySelector('.vs-pads').scrollIntoView({ block: 'center' }));
  await page.waitForFunction(() => Versus.state === 'open', null, { timeout: 30000 });
  const r = await page.evaluate(() => { const b = document.querySelector('.vs-pad.p1').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
  await page.touchscreen.tap(r.x, r.y); await page.waitForTimeout(900);
  if (!(await page.evaluate(() => Versus.score[0] + Versus.score[1] > 0))) throw new Error('tapping a pad did nothing');
});
await browser.close(); server.close();
fs.writeFileSync(path.join(OUT, 'problems.json'), JSON.stringify(problems, null, 1));
console.log(problems.length ? `\n${problems.length} problem(s):\n- ` + problems.join('\n- ') : '\nno problems');
process.exit(problems.length ? 1 : 0);
