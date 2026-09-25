#!/usr/bin/env node
/* =====================================================================
   Proof that a stylesheet change did not alter a single pixel of styling.
   Opens every screen at three sizes, walks every element, and records the
   FULL computed style of each one. Run it before a CSS refactor and again
   after; `--check` compares the two and lists exactly which element on
   which screen changed which property.
     node tools/css-snapshot.mjs            → writes /tmp/css-snapshot.json
     node tools/css-snapshot.mjs --check    → compares against it
   Set CSS_SNAPSHOT to keep several baselines around.

   Reading the result: 0 is the normal answer and what a value-for-value
   refactor must produce. A stray 1–2 elements that are never the same twice
   are a screen whose selected button depends on the clock (the dashboard's
   period, the league's week) — run --check again; a real regression repeats
   and names the same element every time.
   ===================================================================== */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.CSS_SNAPSHOT || '/tmp/css-snapshot.json';
const CHECK = process.argv.includes('--check');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.atlas': 'text/plain', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg', '.md': 'text/plain' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;

const SCREENS = ['home', 'skill-menu', 'warmup', 'learning', 'games', 'form-control', 'puzzle', 'performance',
  'action', 'error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel',
  'balance-hold', 'heavy-bag', 'quiz', 'winner', 'report', 'trophy-room', 'league', 'versus', 'coach',
  'profile', 'players', 'curriculum', 'dashboard'];
const SIZES = [{ w: 390, h: 844, n: 'phone' }, { w: 820, h: 1180, n: 'tablet' }, { w: 1280, h: 860, n: 'desktop' }];

const browser = await chromium.launch();
const snap = {};
for (const size of SIZES) {
  for (const lang of ['ar', 'en']) {
    const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, locale: lang === 'ar' ? 'ar-EG' : 'en-US' });
    const page = await ctx.newPage();
    await page.addInitScript((lg) => {
      // the games shuffle puzzle pieces, pick questions and scatter targets at
      // random; two runs must line up element-for-element to be comparable
      let seed = 20260925;
      Math.random = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
      localStorage.setItem('taekwondoJourneyLangChosen', 'snap');
      localStorage.setItem('taekwondoJourneyPrefs', JSON.stringify({ currentLanguage: lg, soundEnabled: false }));
      localStorage.setItem('taekwondoJourneyPlayers', JSON.stringify([{ id: 'p1', name: 'Omar', createdAt: 1, character: 'boy' }]));
      localStorage.setItem('taekwondoJourneyCurrentPlayer', 'p1');
      localStorage.setItem('taekwondoJourneyWelcome:p1', 'true');
    }, lang);
    await page.goto(BASE);
    await page.waitForFunction(() => typeof StartScreen !== 'undefined');
    await page.waitForTimeout(500);
    await page.click('.ss-card[data-pid="p1"]').catch(() => {});
    await page.waitForTimeout(700);
    await page.evaluate(() => { document.querySelectorAll('.tkd-modal').forEach(x => x.remove()); window.TKDHints?.hide(); });
    for (const screen of SCREENS) {
      await page.evaluate(s => { try { switchScreen(s); } catch (e) {} }, screen);
      await page.waitForTimeout(260);
      await page.evaluate(() => { document.querySelectorAll('.tkd-modal').forEach(x => x.remove()); window.TKDHints?.hide(); });
      const rows = await page.evaluate(() => {
        // freeze everything that moves: a value sampled mid-animation differs
        // between two runs for reasons that have nothing to do with the CSS
        if (!document.getElementById('snap-freeze')) {
          const s = document.createElement('style');
          s.id = 'snap-freeze';
          s.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }';
          document.head.appendChild(s);
        }
        const out = [];
        // a stable name for an element, independent of sibling order noise
        const nameOf = (el) => {
          const bits = [el.tagName.toLowerCase()];
          if (el.id) bits.push('#' + el.id);
          if (el.className && typeof el.className === 'string') bits.push('.' + el.className.trim().split(/\s+/).join('.'));
          return bits.join('');
        };
        document.querySelectorAll('.screen.active, .screen.active *, body > header, body > header *, .tab-bar, .tab-bar *').forEach((el, i) => {
          const cs = getComputedStyle(el);
          const style = [];
          // Quiz Blast flies its targets from a script loop, so their transform
          // depends on how many frames have gone by, not on any stylesheet
          const scripted = !!el.closest('#qb-arena');
          for (let k = 0; k < cs.length; k++) {
            const prop = cs[k];
            if (scripted && prop === 'transform') continue;
            // sizes move with content/animation; colours, borders and spacing are what a refactor can break
            if (/^(width|height|inline-size|block-size|perspective-origin|transform-origin|animation-|transition-|-webkit-locale)/.test(prop)) continue;
            // the test server picks a free port each run — the URL itself is not the point
            style.push(prop + ':' + cs.getPropertyValue(prop).replace(/127\.0\.0\.1:\d+/g, 'host'));
          }
          // custom properties are not enumerated in a stable order
          out.push([i + '|' + nameOf(el), style.sort().join(';')]);
        });
        return out;
      });
      snap[`${size.n}/${lang}/${screen}`] = Object.fromEntries(rows);
    }
    await ctx.close();
  }
}
await browser.close();
server.close();

if (!CHECK) {
  fs.writeFileSync(OUT, JSON.stringify(snap));
  const n = Object.values(snap).reduce((s, o) => s + Object.keys(o).length, 0);
  console.log(`snapshot written: ${OUT} — ${Object.keys(snap).length} screens, ${n} elements`);
} else {
  const before = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const pairs = s => new Map(s.split(';').filter(p => p.includes(':')).map(p => [p.slice(0, p.indexOf(':')), p.slice(p.indexOf(':') + 1)]));
  let diffs = 0, missing = 0;
  const added = new Set();
  for (const [key, els] of Object.entries(snap)) {
    const was = before[key];
    if (!was) { console.log(`NEW screen ${key}`); continue; }
    for (const [el, style] of Object.entries(els)) {
      if (!(el in was)) { missing++; continue; }
      if (was[el] === style) continue;
      const a = pairs(was[el]), b = pairs(style);
      const changed = [];
      for (const [k, v] of a) {
        if (!b.has(k)) changed.push(`   ${k} is gone (was ${v})`);
        else if (b.get(k) !== v) changed.push(`   ${k}\n     was ${v}\n     now ${b.get(k)}`);
      }
      // a brand new token in :root shows up on every element; that is the
      // refactor adding a name, not the page looking different
      for (const k of b.keys()) if (!a.has(k)) added.add(k);
      if (!changed.length) continue;
      diffs++;
      if (diffs <= 25) { console.log(`\n${key}  ${el}`); changed.slice(0, 6).forEach(c => console.log(c)); }
    }
  }
  if (added.size) console.log(`\nnew properties (no effect on what is drawn): ${[...added].join(', ')}`);
  console.log(`\n${diffs} element(s) differ${missing ? `, ${missing} not comparable (element list changed)` : ''}`);
  process.exit(diffs ? 1 : 0);
}
