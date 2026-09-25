#!/usr/bin/env node
// Generates the app-store / manifest screenshots into assets/store/.
//   node tools/store-screenshots.mjs
// Google Play phone/tablet + App Store iPhone/iPad sizes · JPEG · Arabic + English.
// Uses demo players (never real children's names or data).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/store');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/index.html`;
fs.mkdirSync(OUT, { recursive: true });

function seed(lang) {
  const names = lang === 'ar' ? ['عمر', 'مريم', 'يوسف', 'ليلى'] : ['Omar', 'Mariam', 'Youssef', 'Laila'];
  const players = names.map((n, i) => ({ id: 'p' + (i + 1), name: n, createdAt: i + 1, character: i % 2 ? 'girl' : 'boy' }));
  const games = ['form-control', 'puzzle', 'performance', 'action', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'heavy-bag', 'quiz', 'learning', 'warmup'];
  const att = []; let r = 11; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  players.forEach((p, pi) => {
    const n = [70, 55, 40, 30][pi];
    for (let i = 0; i < n; i++) {
      const g = games[Math.floor(rnd() * games.length)];
      const sc = Math.round(Math.min(100, 50 + rnd() * 40 + i * 0.5 - pi * 3));
      att.push({ playerId: p.id, playerName: p.name, skillId: i > 40 ? 'narochagi' : 'apchagi', gameId: g, score: sc, passed: sc >= 85, ts: Date.now() - (n - i) * 7 * 3600e3 - pi * 1e6 });
    }
  });
  // the hero of the shots is half-way along the side-kick map (two kicks mastered)
  [['warmup', 100], ['learning', 100], ['form-control', 96], ['puzzle', 82]].forEach(([g, sc], i) =>
    att.push({ playerId: 'p1', playerName: players[0].name, skillId: 'bakchagi3', gameId: g, score: sc, passed: true, ts: Date.now() - (4 - i) * 3600e3 }));
  localStorage.setItem('taekwondoJourneyPlayers', JSON.stringify(players));
  localStorage.setItem('taekwondoJourneyCurrentPlayer', 'p1');
  localStorage.setItem('taekwondoJourneyAttempts', JSON.stringify(att));
  localStorage.setItem('taekwondoJourneyLangChosen', 'store');
  localStorage.setItem('taekwondoJourneyWelcome:p1', 'true');   // the one-time coach hello must not sit on the store shot
  localStorage.setItem('taekwondoJourneyPrefs', JSON.stringify({ currentLanguage: lang, soundEnabled: false }));
  localStorage.setItem('taekwondoJourneyCurriculum:p1', JSON.stringify(['gyeongnye', 'junbi', 'gihap', 'counting', 'naranhi-seogi', 'ap-seogi', 'ap-kubi', 'arae-makki']));
}

const SCENES = [
  ['home', async p => {}],
  ['curriculum', async p => { await p.evaluate(() => switchScreen('curriculum')); }],
  ['learning', async p => { await p.evaluate(() => switchScreen('learning')); }],
  ['profile', async p => { await p.evaluate(() => Profile.open('p1')); }],
  ['league', async p => { await p.evaluate(() => switchScreen('league')); }],
  ['dashboard', async p => { await p.evaluate(() => switchScreen('dashboard')); }]
];
const FORMS = {
  phone:  { viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 },     // Google Play phone 1080×1920
  tablet: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 },  // Google Play tablet 1920×1200
  iphone: { viewport: { width: 430, height: 932 }, deviceScaleFactor: 3 },     // App Store 6.7"/6.9" 1290×2796
  ipad:   { viewport: { width: 1032, height: 1376 }, deviceScaleFactor: 2 }    // App Store 13" iPad 2064×2752
};

const browser = await chromium.launch();
const made = [];
for (const lang of ['ar', 'en']) for (const [form, opt] of Object.entries(FORMS)) {
  const ctx = await browser.newContext({ ...opt, locale: lang === 'ar' ? 'ar-EG' : 'en-US', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.addInitScript(seed, lang);
  await page.goto(BASE);
  await page.waitForFunction(() => typeof StartScreen !== 'undefined');
  await page.click('.ss-card[data-pid="p1"]');
  for (const [name, fn] of SCENES) {
    await page.evaluate(() => { document.querySelectorAll('.tkd-modal, .flash-message').forEach(x => x.remove()); TKDHints?.hide(); switchScreen('home'); });
    await page.waitForTimeout(300);
    await fn(page);
    await page.waitForTimeout(1200);
    await page.evaluate(() => { document.querySelectorAll('.tkd-modal, .flash-message').forEach(x => x.remove()); TKDHints?.hide(); window.scrollTo(0, 0); });
    const file = `${form}-${lang}-${name}.jpg`;
    await page.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: 78 });
    made.push(file);
  }
  await ctx.close();
}
await browser.close(); server.close();
console.log(`${made.length} screenshots in assets/store/`);
