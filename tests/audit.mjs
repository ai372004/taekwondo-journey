#!/usr/bin/env node
/* =====================================================================
   Kid-style audit: opens every screen on a small phone, a big phone and a
   tablet (touch, Arabic by default), and reports what a child would trip on:
     • tap targets smaller than 44×44 px (Apple/Google guideline)
     • buttons covered by something else (a tap would hit the wrong thing)
     • text cut off (clipped / ellipsis / overflowing its box)
     • sideways scrolling, console errors
   Usage: node tests/audit.mjs [ar|en] [outDir]     → report.json + screenshots
   ===================================================================== */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANG = process.argv[2] || 'ar';
const OUT = process.argv[3] || path.join(ROOT, 'tests', 'audit-out');
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.atlas': 'text/plain', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;

export const SCREENS = ['home', 'skill-menu', 'warmup', 'learning', 'games', 'form-control', 'puzzle', 'performance', 'action', 'error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'quiz', 'trophy-room', 'report', 'dashboard', 'character-change', 'cooldown', 'league', 'versus', 'coach', 'profile', 'players', 'curriculum'];
const DEVICES = [
  { name: 'phone-small', viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'phone', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
];

function seed(lang) {
  const players = [{ id: 'p1', name: 'عمر', createdAt: 1, character: 'boy' }, { id: 'p2', name: 'مريم', createdAt: 2, character: 'girl' }];
  const att = []; const games = ['form-control', 'puzzle', 'performance', 'action', 'quiz', 'learning', 'warmup', 'board-break'];
  for (let i = 0; i < 40; i++) att.push({ playerId: i % 2 ? 'p2' : 'p1', playerName: i % 2 ? 'مريم' : 'عمر', skillId: 'apchagi', gameId: games[i % games.length], score: 50 + (i * 7) % 50, passed: (i * 7) % 50 > 35, ts: Date.now() - (40 - i) * 5 * 3600e3 });
  localStorage.setItem('taekwondoJourneyPlayers', JSON.stringify(players));
  localStorage.setItem('taekwondoJourneyCurrentPlayer', 'p1');
  localStorage.setItem('taekwondoJourneyAttempts', JSON.stringify(att));
  localStorage.setItem('taekwondoJourneyLangChosen', 'audit');
  localStorage.setItem('taekwondoJourneyPrefs', JSON.stringify({ currentLanguage: lang, soundEnabled: false }));
  localStorage.setItem('taekwondoJourneyHints:p1', JSON.stringify(['home', 'skill-menu', 'warmup', 'learning', 'games', 'form-control', 'puzzle', 'performance', 'action', 'error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'quiz', 'versus', 'league', 'coach', 'profile', 'players', 'curriculum', 'dashboard', 'trophy-room', 'report']));
}

// runs in the page: collect problems on the visible screen
function inspect() {
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05 && r.bottom > 0 && r.right > 0 && r.left < innerWidth; };
  const label = el => (el.getAttribute('aria-label') || el.textContent || el.id || el.className || el.tagName).toString().trim().replace(/\s+/g, ' ').slice(0, 40);
  const where = el => { const s = el.closest('.screen'); return s ? s.id : (el.closest('#collapsibleNav') ? 'nav' : el.closest('.tkd-modal') ? 'modal' : el.closest('#tabbar') ? 'tabbar' : 'page'); };
  const scope = [...document.querySelectorAll('.screen.active, .tkd-modal, #tabbar, .header, .tab-sheet:not([hidden])')];
  const inScope = el => scope.some(s => s.contains(el));
  const out = { small: [], covered: [], clipped: [], overflowX: document.documentElement.scrollWidth - innerWidth };
  const taps = [...document.querySelectorAll('button, a[href], [role=button], input, select, [onclick], .skill-card, .game-card, .cu-item, .ss-card')].filter(el => inScope(el) && vis(el));
  const seen = new Set();
  for (const el of taps) {
    if ([...seen].some(s => s.contains(el))) continue;       // nested clickable inside one already counted
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (el.disabled) continue;
    const min = Math.min(r.width, r.height);
    if (min < 40 && !(el.tagName === 'INPUT' && el.type === 'range')) out.small.push({ where: where(el), what: label(el), size: `${Math.round(r.width)}×${Math.round(r.height)}` });
    // covered? test the centre point (only if it is on screen)
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cy > 0 && cy < innerHeight && cx > 0 && cx < innerWidth) {
      const top = document.elementFromPoint(cx, cy);
      if (top && top !== el && !el.contains(top) && !top.contains(el)) {
        const tl = top.closest('button, a, [role=button], .tkd-modal-card, .tkd-hint-bubble, #tabbar, .header, .nav-toggle-btn');
        out.covered.push({ where: where(el), what: label(el), by: label(tl || top) });
      }
    }
  }
  // text that does not fit
  const texts = [...document.querySelectorAll('h1, h2, h3, h4, p, span, b, small, label, li, button, a, .btn, td, th')].filter(el => inScope(el) && vis(el) && !el.closest('.desc-fold') && el.childElementCount < 3 && (el.textContent || '').trim().length > 1);
  for (const el of texts) {
    const cs = getComputedStyle(el);
    // measure the TEXT itself (scrollWidth also counts decorative ::before shine layers)
    const rg = document.createRange(); rg.selectNodeContents(el);
    const tw = rg.getBoundingClientRect().width;
    const box = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const clipsX = tw > box + 2 && (cs.overflowX !== 'visible' || cs.textOverflow === 'ellipsis');
    const clamped = cs.webkitLineClamp && cs.webkitLineClamp !== 'none';     // a deliberate 2-line teaser, not a bug
    const clipsY = !clamped && el.scrollHeight > el.clientHeight + 3 && cs.overflowY === 'hidden' && el.clientHeight > 0;
    const r = el.getBoundingClientRect();
    const offscreen = r.right > innerWidth + 1 || r.left < -1;
    if (clipsX || clipsY || offscreen) out.clipped.push({ where: where(el), what: label(el), why: clipsX ? 'cut sideways' : clipsY ? 'cut bottom' : 'off screen' });
  }
  const dedupe = a => { const k = new Set(); return a.filter(x => { const s = JSON.stringify(x); if (k.has(s)) return false; k.add(s); return true; }); };
  out.small = dedupe(out.small); out.covered = dedupe(out.covered); out.clipped = dedupe(out.clipped);
  return out;
}

const browser = await chromium.launch();
const report = {};
for (const dev of DEVICES) {
  const ctx = await browser.newContext({ ...dev, locale: LANG === 'ar' ? 'ar-EG' : 'en-US' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await page.addInitScript(seed, LANG);
  await page.goto(BASE);
  await page.waitForFunction(() => typeof StartScreen !== 'undefined');
  await page.waitForTimeout(600);
  // start screen first
  report[dev.name] = { start: await page.evaluate(inspect) };
  await page.screenshot({ path: path.join(OUT, `${dev.name}-00-start.png`) });
  await page.tap('.ss-card[data-pid="p1"]');
  await page.waitForTimeout(700);
  await page.evaluate(() => document.querySelectorAll('.tkd-modal, .flash-message').forEach(x => x.remove()));
  for (const [i, s] of SCREENS.entries()) {
    await page.evaluate(s => { document.querySelectorAll('.tkd-modal, .flash-message').forEach(x => x.remove()); switchScreen(s); window.scrollTo(0, 0); }, s);
    await page.waitForTimeout(900);
    const r = await page.evaluate(inspect);
    const active = await page.evaluate(() => document.querySelector('.screen.active')?.id);
    r.active = active;
    report[dev.name][s] = r;
    await page.screenshot({ path: path.join(OUT, `${dev.name}-${String(i + 1).padStart(2, '0')}-${s}.png`), fullPage: true });
  }
  // the menu
  for (const tab of ['train', 'play', 'mine', 'coach']) {
    await page.evaluate(() => switchScreen('home')); await page.waitForTimeout(300);
    await page.tap(`#tabbar [data-tab="${tab}"]`); await page.waitForTimeout(450);
    report[dev.name]['sheet-' + tab] = await page.evaluate(inspect);
    await page.screenshot({ path: path.join(OUT, `${dev.name}-99-sheet-${tab}.png`) });
    await page.tap(`#tabbar [data-tab="${tab}"]`); await page.waitForTimeout(300);
  }
  report[dev.name].errors = errors;
  await ctx.close();
}
await browser.close(); server.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
// summary
for (const [dev, screens] of Object.entries(report)) {
  let small = 0, covered = 0, clipped = 0, ox = [];
  for (const [s, r] of Object.entries(screens)) { if (s === 'errors') continue; small += r.small.length; covered += r.covered.length; clipped += r.clipped.length; if (r.overflowX > 2) ox.push(s); }
  console.log(`${dev}: ${small} small taps · ${covered} covered · ${clipped} cut text · sideways: ${ox.join(',') || 'none'} · errors: ${screens.errors.length}`);
}
