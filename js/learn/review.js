// ============================================================================
// SMART REVIEW (v28) — remembers what each child gets wrong, per kick, and
// turns it into ONE clear suggestion for today:
//   "النهارده راجع: رفع الركبة في الآب تشاجي"  → opens exactly that lesson step.
// Games report small facts ("missed the chamber note", "picked the wrong part
// of the foot", "kicked a leg target"...) with Review.note(). Old mistakes fade
// (half-life 10 days) and good answers cancel them out, so the suggestion moves
// on as the child improves. Stored per player, on the device only.
// ============================================================================
const Review = {
  HALF_LIFE_DAYS: 10,
  key(pid = TKD.pid()) { return `taekwondoJourneyReview:${pid || 'guest'}`; },
  load(pid) { return TKD.read(this.key(pid), { topics: {}, done: {} }); },
  save(d, pid) { TKD.write(this.key(pid), d); },
  decay(v, dtMs) { return v * Math.pow(0.5, dtMs / (this.HALF_LIFE_DAYS * 864e5)); },

  // what each topic means for a child, and how to fix it
  TOPICS: {
    phase:   { icon: '🦵', en: (s, i) => `${Review.phaseName(s, i, 'en')} in ${TKD.skillName(s)}`, ar: (s, i) => `${Review.phaseName(s, i, 'ar')} في ${TKD.skillName(s)}` },
    surface: { icon: '🦶', en: s => `which part of the foot hits in ${TKD.skillName(s)}`, ar: s => `جزء الرجل اللي بيضرب في ${TKD.skillName(s)}` },
    target:  { icon: '🎯', en: s => `the right targets for ${TKD.skillName(s)}`, ar: s => `الأهداف الصح لـ ${TKD.skillName(s)}` },
    pivot:   { icon: '🔄', en: s => `turning the standing foot in ${TKD.skillName(s)}`, ar: s => `لفّة رجل الارتكاز في ${TKD.skillName(s)}` },
    name:    { icon: '🗣️', en: s => `the Korean name of ${TKD.skillName(s)}`, ar: s => `الاسم الكوري لـ ${TKD.skillName(s)}` },
    timing:  { icon: '⏱️', en: s => `the timing of ${TKD.skillName(s)}`, ar: s => `توقيت ${TKD.skillName(s)}` },
    head:    { icon: '👀', en: s => `eyes on the target in ${TKD.skillName(s)}`, ar: s => `عينك على الهدف في ${TKD.skillName(s)}` },
    knee:    { icon: '🦿', en: s => `a fully straight kicking knee in ${TKD.skillName(s)}`, ar: s => `فرد ركبة الركلة على الآخر في ${TKD.skillName(s)}` },
    lean:    { icon: '🧍', en: s => `keeping the back upright in ${TKD.skillName(s)}`, ar: s => `ضهرك مفرود في ${TKD.skillName(s)}` },
    heel:    { icon: '🦶', en: s => `a planted standing heel in ${TKD.skillName(s)}`, ar: s => `كعب رجل الارتكاز ثابت في ${TKD.skillName(s)}` }
  },
  phaseName(s, i, lang) {
    const ph = GameConfig.SKILLS[s]?.phases?.[i]; if (!ph) return '';
    return (lang === 'ar' ? ph.title.ar : ph.title.en).replace(/^[^\p{L}]+/u, '').replace(/\s*\(.*\)\s*$/, '');
  },
  // where to practise it
  fixFor(topic, s, i) {
    const lesson = (phase) => ({ kind: 'lesson', phase, go: () => this.openLesson(s, phase) });
    const game = (g) => ({ kind: 'game', game: g, go: () => { const gs = TKD.gs(); gs.currentSkill = s; gs.syncFlatProgressToCurrentSkill?.(); switchScreen(g); } });
    return ({
      phase: () => lesson(i), surface: () => game('board-break'), target: () => game('sparring-duel'), pivot: () => lesson(1),
      name: () => game('quiz-blast'), timing: () => game('heavy-bag'), head: () => lesson(2), knee: () => lesson(2), lean: () => lesson(2), heel: () => lesson(2)
    }[topic] || (() => lesson(0)))();
  },
  openLesson(s, phase) {
    const gs = TKD.gs(); if (!gs) return;
    gs.currentSkill = s; gs.syncFlatProgressToCurrentSkill?.();
    switchScreen('learning');
    setTimeout(() => { LearningSystem.currentPhase = Math.max(0, Math.min(4, phase)); LearningSystem.render(); }, 60);
  },

  // ------------------------------------------------------------------ recording
  note(topic, ok, { skill, phase = null, weight = 1 } = {}) {
    const pid = TKD.pid(); if (!pid || !this.TOPICS[topic]) return;
    skill = skill || TKD.gs()?.currentSkill || 'apchagi';
    const id = `${skill}|${topic}${phase !== null && topic === 'phase' ? '|' + phase : ''}`;
    const d = this.load(pid), now = Date.now();
    const t = d.topics[id] || { m: 0, h: 0, t: now };
    t.m = this.decay(t.m, now - t.t); t.h = this.decay(t.h, now - t.t); t.t = now;
    if (ok) t.h += weight; else t.m += weight;
    d.topics[id] = t;
    // a good answer on today's review topic = review done
    const today = this.today(pid, d);
    if (ok && today && today.id === id && t.h >= 1) d.done[TKD.dayKey()] = id;
    this.save(d, pid);
  },
  // ------------------------------------------------------------------ reading
  list(pid = TKD.pid()) {
    const d = this.load(pid), now = Date.now();
    return Object.entries(d.topics).map(([id, t]) => {
      const [skill, topic, phase] = id.split('|');
      const m = this.decay(t.m, now - t.t), h = this.decay(t.h, now - t.t);
      return { id, skill, topic, phase: phase !== undefined ? +phase : null, misses: m, hits: h, weak: m - 0.7 * h };
    }).filter(x => GameConfig.SKILLS[x.skill] && this.TOPICS[x.topic]).sort((a, b) => b.weak - a.weak);
  },
  weakest(pid, n = 3) { return this.list(pid).filter(x => x.weak >= 1.2 && x.misses >= 2).slice(0, n); },
  today(pid = TKD.pid(), d = null) { return this.weakest(pid, 1)[0] || null; },
  doneToday(pid = TKD.pid()) { return !!this.load(pid).done[TKD.dayKey()]; },
  label(x) {
    const T = this.TOPICS[x.topic];
    return `${T.icon} ${TKD.ar ? T.ar(x.skill, x.phase) : T.en(x.skill, x.phase)}`;
  },
  // classify a quiz question by its (English) wording
  topicFromText(en) {
    const s = String(en || '').toLowerCase();
    if (/korean|called|name/.test(s)) return { topic: 'name' };
    if (/part of the foot|surface|strik|contact|delivered/.test(s)) return { topic: 'surface' };
    if (/target|score|scores|aim/.test(s)) return { topic: 'target' };
    if (/pivot|rotate|turn|angle|degree/.test(s)) return { topic: 'pivot' };
    const m = s.match(/(first|second|third|fourth|fifth|last|final|1st|2nd|3rd|4th|5th)\s+(phase|stage|step)|(phase|stage|step)\s+(\d)/);
    if (m) { const w = m[1] || m[4]; const i = { first: 0, '1st': 0, 1: 0, second: 1, '2nd': 1, 2: 1, third: 2, '3rd': 2, 3: 2, fourth: 3, '4th': 3, 4: 3, fifth: 4, '5th': 4, 5: 4, last: 4, final: 4 }[w]; return { topic: 'phase', phase: i ?? 0 }; }
    if (/chamber|knee lift|lift the knee|raise/.test(s)) return { topic: 'phase', phase: 1 };
    if (/extend|extension|snap/.test(s)) return { topic: 'phase', phase: 2 };
    if (/recoil|pull back|retract/.test(s)) return { topic: 'phase', phase: 3 };
    if (/ready|stance|guard/.test(s)) return { topic: 'phase', phase: 0 };
    return null;
  },
  noteText(en, ok, skill) { const t = this.topicFromText(en); if (t) this.note(t.topic, ok, { skill, phase: t.phase ?? null }); },

  // ------------------------------------------------------------------ home card
  card() {
    if (!TKD.pid()) return '';
    const x = this.today(); if (!x) return '';
    const done = this.doneToday();
    const fix = this.fixFor(x.topic, x.skill, x.phase);
    return `<button type="button" class="hub-review ${done ? 'done' : ''}" id="hub-review">
      <span class="hub-rv-k">${done ? '✅' : '🧠'} ${done ? TKD.t('Reviewed today — well done!', 'راجعت النهارده — برافو!') : TKD.t("Today's review", 'مراجعة النهارده')}</span>
      <span class="hub-rv-big">${TKD.esc(this.label(x))}</span>
      <span class="hub-rv-s">${fix.kind === 'lesson' ? TKD.t('Open the lesson step →', 'افتح خطوة الدرس ←') : TKD.t(`Practise in ${TKD.gameName(fix.game)} →`, `اتمرّن في ${TKD.gameName(fix.game)} ←`)}</span>
    </button>`;
  },
  bindCard() {
    const b = TKD.$('hub-review'); if (!b) return;
    b.addEventListener('click', () => {
      const x = this.today(); if (!x) return;
      TKD.gs()?.playSound('click');
      // opening the lesson step itself counts as a first look
      const fix = this.fixFor(x.topic, x.skill, x.phase);
      if (fix.kind === 'lesson') { const d = this.load(); d.done[TKD.dayKey()] = x.id; this.save(d); }
      fix.go();
    });
  }
};
window.Review = Review;
