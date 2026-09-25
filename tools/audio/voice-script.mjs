#!/usr/bin/env node
// Builds the recording script for the Egyptian voice-over from the game itself,
// so it always matches what the game really reads aloud.
//   node tools/audio/voice-script.mjs
// → assets/audio/voice/lines.json, VOICE_SCRIPT.md, store/voice-script.csv
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.atlas': 'text/plain', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const b = await chromium.launch(); const p = await b.newPage();
await p.addInitScript(() => { localStorage.setItem('taekwondoJourneyLangChosen', 'x'); localStorage.setItem('taekwondoJourneyPlayers', '[{"id":"p1","name":"x","createdAt":1,"character":"boy"}]'); localStorage.setItem('taekwondoJourneyCurrentPlayer', 'p1'); });
await p.goto(`http://127.0.0.1:${server.address().port}/index.html`);
await p.waitForFunction(() => typeof Voice !== 'undefined' && typeof StartScreen !== 'undefined');
const lines = await p.evaluate(() => {
  const L = []; const add = (group, prio, ar, en, note = '') => { if (ar || en) L.push({ group, priority: prio, ar: (ar || '').trim(), en: (en || '').trim(), note }); };
  const strip = s => String(s || '').replace(/^[^\p{L}\p{N}]+/u, '').trim();
  Object.values(Voice.CUES).forEach(c => add('cue', 1, c.ar, c.en, 'حماس وفرحة، قصيرة'));
  Object.entries(TKDHints.LIST).forEach(([k, h]) => add('hint', 1, h.ar, h.en, 'شرح هادي لطفل'));
  WarmupSystem.EXERCISES().forEach(e => add('warmup', 1, e.nameAr, e.nameEn, 'اسم التمرين، بحماس'));
  add('warmup', 1, 'بدّل الرجل!', 'Switch legs!', 'تنبيه');
  GameConfig.SKILL_ORDER.forEach(id => { const s = GameConfig.SKILLS[id]; add('kick', 1, s.name.ar, s.name.en, 'اسم الركلة'); });
  GameConfig.SKILL_ORDER.forEach(id => GameConfig.SKILLS[id].phases.forEach(ph => { add('phase', 2, strip(ph.title.ar), strip(ph.title.en), 'عنوان مرحلة'); add('phase', 2, strip(ph.focus.ar), strip(ph.focus.en), 'نصيحة المدرب'); }));
  // screen instructions, both languages
  const desc = {};
  for (const lang of ['ar', 'en']) {
    GameStateInstance.setLanguage(lang);
    document.querySelectorAll('.screen .description').forEach((d, i) => { (desc[i] ||= {})[lang] = d.textContent.replace('🔊', '').replace('💡', '').trim(); });
    const coach = document.getElementById('learning-coach-text'); if (coach) (desc.coach ||= {})[lang] = coach.textContent.trim();
  }
  Object.values(desc).forEach(d => add('screen', 2, d.ar, d.en, 'تعليمات الشاشة'));
  Object.values(QuizSystem.QUESTION_BANK).flat().forEach(q => add('quiz', 3, q.questionAr, q.question, 'سؤال'));
  Object.values(QuizBlastSystem.BANK).flat().forEach(q => add('quiz-blast', 3, q.q[0], q.q[1], 'سؤال'));
  ErrorHuntSystem.LEVELS.forEach(l => add('error-hunt', 3, l.desc.ar, l.desc.en, 'سؤال'));
  add('performance', 3, 'بص على الصورة، واختار الجملة الوحيدة الغلط عن الأداء الصح', 'Look at the image and find the ONE statement that is technically WRONG', 'سؤال');
  // unique by the Arabic sentence key
  const seen = new Set(); const out = [];
  for (const l of L) {
    const k = Voice.key(l.ar || l.en); if (seen.has(k)) continue; seen.add(k);
    out.push({ ...l, key: k, keyEn: l.en ? Voice.key(l.en) : null });
  }
  const ko = (window.Curriculum ? Curriculum.all() : []).map(i => ({ group: 'korean', priority: 2, ko: i.hangul, roman: i.ko, key: Voice.key(i.hangul), note: 'بالكوري — المدرب' }));
  return { lines: out, korean: ko };
});
await b.close(); server.close();
const groupsOrder = ['cue', 'hint', 'warmup', 'kick', 'phase', 'screen', 'quiz', 'quiz-blast', 'error-hunt', 'performance'];
const count = {};
lines.lines.forEach(l => { count[l.group] = (count[l.group] || 0) + 1; l.file = `${l.group}-${String(count[l.group]).padStart(3, '0')}-${l.key}.mp3`; l.fileEn = l.keyEn ? `${l.group}-${String(count[l.group]).padStart(3, '0')}-${l.keyEn}.mp3` : null; });
lines.korean.forEach((l, i) => { l.file = `korean-${String(i + 1).padStart(3, '0')}-${l.key}.mp3`; });
fs.writeFileSync(path.join(ROOT, 'assets/audio/voice/lines.json'), JSON.stringify(lines, null, 1));
// recording script (Arabic first, it's the priority)
const P = { 1: 'أولوية ١ (ابدأ بيها)', 2: 'أولوية ٢', 3: 'أولوية ٣' };
let md = `# سكريبت التسجيل الصوتي — رحلة التايكوندو

الملف ده اتعمل أوتوماتيك من اللعبة (\`node tools/audio/voice-script.mjs\`)، فهو دايمًا مطابق للي اللعبة بتقوله.

## مواصفات التسجيل
- **الصوت:** مصري، ودود، طاقته عالية بس مش صريخ — زي مدرب بيكلم أطفال من ٦ لـ ١٢ سنة.
- **المكان:** أوضة هادية (دولاب هدوم مفتوح بيمتص الصدى)، الموبايل أو المايك على بعد شبرين من البق.
- **الملف:** اسم كل ملف هو المكتوب في عمود "الملف" بالظبط (أو أي اسم وبعدين أغيّره أنا). أي صيغة (wav / m4a / mp3).
- **سيب ثانية سكوت** قبل وبعد كل جملة — الأداة بتقص السكوت وبتظبط الصوت لوحدها:
  \`python3 tools/audio/voice-manifest.py --process مجلد_التسجيلات\`
- اللي مالوش تسجيل بتقوله اللعبة بصوت الموبايل زي دلوقتي، يعني ممكن تسجّل على دفعات.

عدد الجمل: **${lines.lines.length}** بالعربي (أولوية ١: ${lines.lines.filter(l => l.priority === 1).length})، و**${lines.korean.length}** كلمة بالكوري للمدرب.

`;
for (const pr of [1, 2, 3]) {
  md += `\n## ${P[pr]}\n\n| # | الملف (عربي) | الجملة | إزاي تتقال |\n|---|---|---|---|\n`;
  lines.lines.filter(l => l.priority === pr).sort((a, b) => groupsOrder.indexOf(a.group) - groupsOrder.indexOf(b.group)).forEach((l, i) => {
    md += `| ${i + 1} | \`${l.file}\` | ${l.ar.replace(/\|/g, '/')} | ${l.note} |\n`;
  });
}
md += `\n## الكلمات الكوري (يسجّلها المدرب — مجلد \`ko\`)\n\n| الملف | بالكوري | بالحروف الإنجليزي |\n|---|---|---|\n`;
lines.korean.forEach(l => { md += `| \`${l.file}\` | ${l.ko} | ${l.roman} |\n`; });
md += `\n## النسخة الإنجليزي (اختياري)\nنفس الجمل بالإنجليزي في \`store/voice-script.csv\` (عمود en وملف file_en) — بتتحط في \`assets/audio/voice/en/\`.\n`;
fs.writeFileSync(path.join(ROOT, 'VOICE_SCRIPT.md'), md);
const csv = ['priority,group,file_ar,text_ar,file_en,text_en,note', ...lines.lines.map(l => [l.priority, l.group, l.file, l.ar, l.fileEn || '', l.en, l.note].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))];
fs.writeFileSync(path.join(ROOT, 'store/voice-script.csv'), '﻿' + csv.join('\n'));
console.log(`${lines.lines.length} lines (${lines.lines.filter(l => l.priority === 1).length} priority 1), ${lines.korean.length} Korean terms`);
