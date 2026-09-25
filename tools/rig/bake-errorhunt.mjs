#!/usr/bin/env node
// Error Hunt pictures from the skeleton: one mistake per picture + the tappable
// zones measured from the real body parts.  node tools/rig/bake-errorhunt.mjs  (server on :8765)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TMP = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'eh-'));
const W = 1000, H = 1100, TALL = 860, AX = 360, G = 1070;
const ZONES = { head: ['head', 'ponytail'], torso: ['body'], kick: ['thighF', 'shinF', 'footF'], stand: ['thighB', 'shinB', 'footB'] };
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(`http://127.0.0.1:${process.env.PORT || 8765}/tools/rig/preview.html`); await p.waitForTimeout(1200);
const jobs = [];
for (const ch of ['boy', 'girl']) for (const lvl of ['head', 'knee', 'lean', 'heel']) {
  const anim = 'err-' + lvl;
  const save = async (name, only) => {
    const url = await p.evaluate(a => window.bakePose(...a), [ch, anim, 0, W, H, TALL, AX, G, 'image/png', only]);
    const f = path.join(TMP, `${ch}_${lvl}_${name}.png`); fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); return f;
  };
  const full = await save('full', null);
  const zones = {}; for (const [z, slots] of Object.entries(ZONES)) zones[z] = await save(z, slots);
  jobs.push({ ch, lvl, full, zones });
}
await b.close();
fs.writeFileSync(path.join(TMP, 'jobs.json'), JSON.stringify(jobs));
execFileSync('python3', [path.join(ROOT, 'tools/rig/eh_zones.py'), path.join(TMP, 'jobs.json')], { cwd: ROOT, stdio: 'inherit' });
