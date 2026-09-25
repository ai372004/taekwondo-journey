#!/usr/bin/env node
/* =====================================================================
   Animation performance probe: opens each animated screen on a phone-sized
   viewport with the CPU slowed 4× (a mid-range Android), watches 3 s of
   frames and reports: fps, dropped frames (>34 ms), worst frame and how
   much main-thread time went to script / style / layout / paint per second.
   Usage: node tests/perf.mjs [screen,screen…]      (needs Playwright)
   ===================================================================== */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.atlas': 'text/plain', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;

const SCREENS = (process.argv[2] || 'home,learning,warmup,games,sparring-duel,heavy-bag,board-break,phase-rhythm,action,form-control,quiz-blast,winner,trophy-room').split(',');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'ar-EG' });
const page = await ctx.newPage();
await page.addInitScript(() => {
  localStorage.setItem('taekwondoJourneyLangChosen', 'perf');
  localStorage.setItem('taekwondoJourneyPrefs', JSON.stringify({ currentLanguage: 'ar', soundEnabled: false }));
  localStorage.setItem('taekwondoJourneyPlayers', JSON.stringify([{ id: 'p1', name: 'عمر', createdAt: 1, character: 'boy' }]));
  localStorage.setItem('taekwondoJourneyCurrentPlayer', 'p1');
  localStorage.setItem('taekwondoJourneyWelcome:p1', 'true');
  localStorage.setItem('taekwondoJourneyHints:p1', JSON.stringify(['home','skill-menu','warmup','learning','games','form-control','puzzle','performance','action','error-hunt','quiz-blast','board-break','paddle-reflex','phase-rhythm','sparring-duel','balance-hold','heavy-bag','quiz','versus','league','coach','profile','players','curriculum','dashboard','trophy-room','report']));
});
await page.goto(BASE);
await page.waitForFunction(() => typeof StartScreen !== 'undefined');
await page.waitForTimeout(600);
await page.tap('.ss-card[data-pid="p1"]');
await page.waitForTimeout(1200);
if (process.env.PERF_PATCH) await page.evaluate(process.env.PERF_PATCH);
const cdp = await ctx.newCDPSession(page);
await cdp.send('Performance.enable');
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));

const rows = [];
for (const s of SCREENS) {
  await page.evaluate((x) => { if (x === 'winner') WinnerSystem.show('form-control', 92, TKD.gs(), false); else switchScreen(x); }, s);
  await page.waitForTimeout(1500);
  await page.evaluate(() => { window.TKDHints?.hide(); document.querySelectorAll('.tkd-modal').forEach(m => m.remove()); });
  // some games only animate once started
  await page.evaluate(() => { document.querySelector('.screen.active [data-start], .screen.active .ag-start, .screen.active #wu2-start')?.click(); });
  await page.waitForTimeout(500);
  const m0 = await metrics();
  const fr = await page.evaluate(() => new Promise(res => {
    const d = []; let last = performance.now(); const end = last + 3000;
    const f = (t) => { d.push(t - last); last = t; if (t < end) requestAnimationFrame(f); else res(d); };
    requestAnimationFrame(f);
  }));
  const m1 = await metrics();
  const secs = (m1.Timestamp - m0.Timestamp) || 3;
  const per = k => Math.round(1000 * ((m1[k] || 0) - (m0[k] || 0)) / secs);
  const dropped = fr.filter(x => x > 34).length;
  rows.push({ screen: s, fps: Math.round(fr.length / 3), dropped, worst: Math.round(Math.max(...fr)),
    script: per('ScriptDuration'), style: per('RecalcStyleDuration'), layout: per('LayoutDuration'), task: per('TaskDuration'),
    anims: await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length) });
}
console.table(rows);
fs.writeFileSync(path.join(ROOT, 'tests', 'perf-last.json'), JSON.stringify(rows, null, 1));
await browser.close(); server.close();
