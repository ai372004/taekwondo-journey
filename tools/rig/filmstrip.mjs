// Film-strip of any rig animation:  node tools/rig/filmstrip.mjs out.png boy:apchagi:8 girl:naeryeo:8   (server on :8765)
import { chromium } from 'playwright';
import fs from 'node:fs';
const [,, out, ...anims] = process.argv;
const b = await chromium.launch(); const p = await b.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://127.0.0.1:8765/tools/rig/preview.html'); await p.waitForTimeout(1500);
const rows = [];
for (const spec of anims) { const [ch, a, n] = spec.split(':'); rows.push(await p.evaluate(([ch, a, n]) => window.strip(ch, a, +n || 8), [ch, a, n])); }
await p.setContent(`<body style="margin:0;background:#222">${rows.map(r => `<div style="display:flex">${r.map(u => `<img src="${u}">`).join('')}</div>`).join('')}</body>`);
await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true });
console.log(errs.length ? errs : 'ok');
await b.close();
