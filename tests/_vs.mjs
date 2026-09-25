import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(() => { localStorage.setItem('taekwondoJourneyLangChosen', 'x'); localStorage.setItem('taekwondoJourneyPrefs', JSON.stringify({ currentLanguage: 'en', soundEnabled: false }));
  localStorage.setItem('taekwondoJourneyPlayers', JSON.stringify([{ id: 'p1', name: 'ahmed', createdAt: 1, character: 'boy' }])); localStorage.setItem('taekwondoJourneyCurrentPlayer', 'p1'); });
await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForTimeout(900); await p.click('.ss-card[data-pid="p1"]'); await p.waitForTimeout(400);
const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: +(process.argv[2] || 1) });
await p.evaluate(() => { document.querySelectorAll('.tkd-modal,.flash-message').forEach(x => x.remove()); switchScreen('versus'); });
await p.waitForTimeout(800);
await p.evaluate(() => Versus.startMatch({ name: 'ahmed', character: 'boy' }, { name: 'Guest 2', character: 'girl' }, 'apchagi'));
await p.waitForTimeout(2500);
// measure fps + frame cost
const r = await p.evaluate(() => new Promise(res => { let n = 0, worst = 0, last = performance.now(); const t0 = last; const f = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < 3000) requestAnimationFrame(f); else res({ fps: n / 3, worst }); }; requestAnimationFrame(f); }));
console.log('fps', r);
// press when a signal opens
let scored = null;
for (let k = 0; k < 40 && !scored; k++) {
  const st = await p.evaluate(() => [Versus.state, Versus.signal && Versus.signal.valid]);
  if (st[0] === 'open' && st[1]) { const t = Date.now(); await p.keyboard.press('a'); await p.waitForTimeout(900); scored = await p.evaluate(() => Versus.score.slice()); }
  else await p.waitForTimeout(100);
}
console.log('score after press', scored, errs);
await p.screenshot({ path: '/tmp/claude-0/-home-claude/31a7dad9-73d8-5ea5-80c7-f82abd15bbe4/scratchpad/vs.png' });
await b.close();
