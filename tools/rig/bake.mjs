#!/usr/bin/env node
// Bakes the skeleton poses into the picture frames every other game uses, so
// every screen shows the SAME boy and the SAME girl.
//   node tools/rig/bake.mjs          (needs:  npm run serve  in another terminal, or PORT=…)
// Originals are kept once in assets/images/characters/_originals/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const URL_ = `http://127.0.0.1:${process.env.PORT || 8765}/tools/rig/preview.html`;
const W = 1000, H = 1300, TALL = 900, ANKLE_X = 430, GROUND = 1262;
const KICKS = {
  apchagi: { anim: 'apchagi', names: ['ready', 'chamber', 'extension', 'recoil', 'return'] },
  narochagi: { anim: 'naeryeo', names: ['ready', 'rise', 'drop', 'recoil', 'return'] }
};
const C = 'assets/images/characters';
function backup(rel) {
  const src = path.join(ROOT, rel), dst = path.join(ROOT, C, '_originals', path.relative(path.join(ROOT, C), src));
  if (fs.existsSync(src) && !fs.existsSync(dst)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); }
}
function save(rel, dataUrl) {
  backup(rel);
  fs.mkdirSync(path.dirname(path.join(ROOT, rel)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, rel), Buffer.from(dataUrl.split(',')[1], 'base64'));
}
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(URL_); await p.waitForTimeout(1200);
let n = 0;
for (const ch of ['boy', 'girl']) {
  for (const [folder, k] of Object.entries(KICKS)) {
    const times = await p.evaluate(([ch, a]) => window.phaseTimes(ch, a), [ch, k.anim]);
    for (let i = 0; i < 5; i++) {
      const t = i === 4 ? times[3] + (times[4] - times[3]) * 0.72 : times[i];
      const url = await p.evaluate(a => window.bakePose(...a), [ch, k.anim, t, W, H, TALL, ANKLE_X, GROUND]);
      save(`${C}/${ch}_char/${folder}/${k.names[i]}_${ch}.webp`, url); n++;
    }
  }
  // celebration frames (crouch, jump)
  const wins = ch === 'boy' ? [['boy_win_1', 0.2], ['boy_win_2', 0.4]] : [['girl_win_1', 0.4]];
  for (const [name, t] of wins) { save(`${C}/${ch}_char/${name}.webp`, await p.evaluate(a => window.bakePose(...a), [ch, 'win', t, W, H, TALL, ANKLE_X, GROUND])); n++; }
}
await b.close();
const { execSync } = await import('node:child_process');
execSync('python3 tools/rig/trim-sets.py', { cwd: ROOT, stdio: 'inherit' });
console.log(`baked ${n} frames`);
