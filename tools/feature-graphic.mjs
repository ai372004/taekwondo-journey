#!/usr/bin/env node
// Google Play feature graphic (1024×500) → store/feature-graphic-{ar,en}.png
//   node tools/feature-graphic.mjs     (run tools/store-screenshots.mjs first)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const b64 = f => 'data:image/' + (f.endsWith('.png') ? 'png' : 'jpeg') + ';base64,' + fs.readFileSync(path.join(ROOT, f)).toString('base64');
const icon = b64('assets/icons/icon-512.png');
const T = {
  ar: { dir: 'rtl', title: 'رحلة التايكوندو', sub: 'اتعلم الركلات والأحزمة والبومسي وإنت بتلعب', tags: ['🥋 منهج الأحزمة', '🏆 دوري أسبوعي', '📴 من غير نت'], shot: 'assets/store/phone-ar-home.jpg' },
  en: { dir: 'ltr', title: 'Taekwondo Journey', sub: 'Learn real kicks, belts and poomsae — by playing', tags: ['🥋 Belt syllabus', '🏆 Weekly league', '📴 Works offline'], shot: 'assets/store/phone-en-home.jpg' }
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 500 } });
for (const [lang, t] of Object.entries(T)) {
  await page.setContent(`<html dir="${t.dir}"><body style="margin:0;width:1024px;height:500px;overflow:hidden;font-family:'Cairo','Noto Sans Arabic','DejaVu Sans',sans-serif;
    background:radial-gradient(circle at 20% 30%,#ff8a4c,#ff6b35 40%,#c2410c);color:#fff;display:flex;align-items:center;gap:40px;padding:0 60px;box-sizing:border-box">
    <div style="flex:1">
      <img src="${icon}" style="width:110px;height:110px;border-radius:26px;box-shadow:0 10px 30px rgba(0,0,0,.3)">
      <h1 style="font-size:60px;margin:18px 0 6px;font-weight:900;text-shadow:0 4px 18px rgba(0,0,0,.25)">${t.title}</h1>
      <p style="font-size:26px;margin:0 0 22px;opacity:.95">${t.sub}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">${t.tags.map(x => `<span style="background:rgba(0,0,0,.22);padding:8px 16px;border-radius:99px;font-size:20px;font-weight:700">${x}</span>`).join('')}</div>
    </div>
    <img src="${b64(t.shot)}" style="height:560px;margin-top:140px;border-radius:32px;border:8px solid #111;box-shadow:0 20px 50px rgba(0,0,0,.45);transform:rotate(${t.dir === 'rtl' ? 4 : -4}deg)">
  </body></html>`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ROOT, `store/feature-graphic-${lang}.png`) });
}
await browser.close();
console.log('store/feature-graphic-ar.png, store/feature-graphic-en.png');
