// ============================================================================
// CURRICULUM SCREEN (v26) — the whole belt syllabus in one place.
// Every belt → its techniques grouped by kind. Playable kicks open their
// training path; everything else opens a card with names, key points and
// common mistakes, and shows a "pictures coming soon" slot until the media
// arrives. Each player can tick what they already practised at the dojo
// (saved per player) — that becomes a belt checklist.
// ============================================================================
const CurriculumScreen = {
  key() { return `taekwondoJourneyCurriculum:${TKD.pid() || 'guest'}`; },
  done() { return new Set(TKD.read(this.key(), [])); },
  toggle(id) { const d = this.done(); d.has(id) ? d.delete(id) : d.add(id); TKD.write(this.key(), [...d]); },
  L(p) { return TKD.ar ? p.ar : p.en; },
  openBelt: null,

  // an item counts as "done" when ticked, or (for playable kicks) when the skill is completed
  isDone(it, d = this.done()) {
    const gs = TKD.gs();
    return d.has(it.id) || (it.skillId && gs?.completedSkills?.has(it.skillId));
  },
  mastery(it) {
    const gs = TKD.gs();
    if (!it.skillId || !gs) return null;
    return gs.completedSkills.has(it.skillId) ? 100 : Math.round(gs.calculateSkillOverallProgress?.(it.skillId) || 0);
  },
  photo(it) {
    if (it.skillId) {
      const sk = GameConfig.SKILLS[it.skillId];
      const ph = sk?.phases?.[2] || sk?.phases?.[0];
      const ch = TKD.gs()?.playerCharacter === 'girl' ? 'girl' : 'boy';
      return ph?.image?.[ch] || it.media.photo;
    }
    return it.media.photo;
  },

  video(it) { return (it.skillId && GameConfig.SKILLS[it.skillId]?.video) || it.media.video; },

  init() {
    const root = TKD.$('curriculum-root');
    if (!root) return;
    const d = this.done();
    const c = Curriculum.count();
    const withMedia = Curriculum.all().filter(i => i.status === 'playable').length;
    if (!this.openBelt) this.openBelt = (Curriculum.BELTS.find(b => b.items.some(i => !this.isDone(i, d))) || Curriculum.BELTS[0]).id;

    const belts = Curriculum.BELTS.map((b, bi) => {
      const doneN = b.items.filter(i => this.isDone(i, d)).length;
      const pct = Math.round(100 * doneN / b.items.length);
      const groups = Object.keys(Curriculum.KINDS).map(k => {
        const items = b.items.filter(i => i.kind === k);
        if (!items.length) return '';
        return `<div class="cu-group"><h4>${Curriculum.KINDS[k].icon} ${this.L(Curriculum.KINDS[k].name)}</h4><div class="cu-grid">${items.map(it => {
          const m = this.mastery(it); const ok = this.isDone(it, d);
          return `<button type="button" class="cu-item ${it.status === 'playable' ? 'playable' : ''} ${ok ? 'done' : ''}" data-id="${it.id}">
            <span class="cu-ko">${TKD.esc(it.ko)}</span>
            <span class="cu-name">${TKD.esc(this.L(it.name))}</span>
            <span class="cu-chip">${it.status === 'playable' ? (m !== null ? `▶ ${TKD.num(m)}%` : '▶') : ok ? '✓' : TKD.t('📷 soon', '📷 قريب')}</span>
          </button>`;
        }).join('')}</div></div>`;
      }).join('');
      const open = this.openBelt === b.id;
      return `<section class="cu-belt ${open ? 'open' : ''}" data-belt="${b.id}" style="--belt:${b.color};--belt-2:${b.accent}">
        <button type="button" class="cu-belt-head" aria-expanded="${open}">
          <span class="cu-belt-strip"></span>
          <span class="cu-belt-txt"><b>${TKD.num(bi + 1)}. ${TKD.esc(this.L(b.name))}</b><small>${TKD.esc(this.L(b.geup))} · ${TKD.num(b.items.length)} ${TKD.t('items', 'حاجة')}</small></span>
          <span class="cu-belt-pct"><span style="width:${pct}%"></span></span>
          <span class="cu-belt-n">${TKD.num(doneN)}/${TKD.num(b.items.length)}</span>
        </button>
        <div class="cu-belt-body"><p class="cu-goal">🎯 ${TKD.esc(this.L(b.goal))}</p>${groups}</div>
      </section>`;
    }).join('');

    root.innerHTML = `
      <div class="cu-summary">
        <span><b>${TKD.num(c.belts)}</b> ${TKD.t('belts', 'أحزمة')}</span>
        <span><b>${TKD.num(c.items)}</b> ${TKD.t('techniques', 'حركة')}</span>
        <span><b>${TKD.num(c.poomsae)}</b> ${TKD.t('poomsae', 'بومسي')}</span>
        <span><b>${TKD.num(withMedia)}</b> ${TKD.t('playable now', 'تتلعب دلوقتي')}</span>
      </div>
      <p class="cu-note">${TKD.t('📷 = pictures & videos are on the way. You can already read the tips and tick what you practised at the dojo.', '📷 = الصور والفيديوهات جايين في السكة. تقدر من دلوقتي تقرا النصايح وتعلّم على اللي اتمرنت عليه في النادي.')}</p>
      ${belts}`;

    root.querySelectorAll('.cu-belt-head').forEach(h => h.addEventListener('click', () => {
      const id = h.parentElement.dataset.belt;
      this.openBelt = this.openBelt === id ? '' : id;
      root.querySelectorAll('.cu-belt').forEach(s => { const o = s.dataset.belt === this.openBelt; s.classList.toggle('open', o); s.querySelector('.cu-belt-head').setAttribute('aria-expanded', o); });
    }));
    root.querySelectorAll('.cu-item').forEach(b => b.addEventListener('click', () => this.show(b.dataset.id)));
  },

  show(id) {
    const it = Curriculum.byId(id);
    if (!it) return;
    const belt = Curriculum.BELTS.find(b => b.id === it.belt);
    const ok = this.isDone(it);
    const list = (arr, cls) => arr.length ? `<ul class="${cls}">${arr.map(p => `<li>${TKD.esc(this.L(p))}</li>`).join('')}</ul>` : '';
    const ov = document.createElement('div');
    ov.className = 'tkd-modal cu-modal';
    ov.innerHTML = `<div class="tkd-modal-card cu-card" role="dialog" aria-label="${TKD.esc(it.ko)}" style="--belt:${belt.color};--belt-2:${belt.accent}">
      <div class="cu-media"><img src="${this.photo(it)}" alt="" onerror="this.parentElement.classList.add('empty');this.remove()"><span class="cu-soon">📷 ${TKD.t('Picture coming soon', 'الصورة جاية قريب')}</span></div>
      <video class="cu-video" controls playsinline preload="metadata" hidden src="${this.video(it)}" onloadedmetadata="this.hidden=false" onerror="this.remove()"></video>
      <p class="cu-kind">${Curriculum.KINDS[it.kind].icon} ${TKD.esc(this.L(Curriculum.KINDS[it.kind].name))} · ${TKD.esc(this.L(belt.name))}</p>
      <h2>${TKD.esc(it.ko)} <span class="cu-hangul" lang="ko">${TKD.esc(it.hangul)}</span></h2>
      <p class="cu-sub">${TKD.esc(this.L(it.name))}${it.trigram ? ` · ${TKD.esc(it.trigram)}` : ''}${it.aka ? ` · <i>${TKD.esc(this.L(it.aka))}</i>` : ''}</p>
      ${it.points.length ? `<h3>✅ ${TKD.t('Key points', 'أهم النقط')}</h3>${list(it.points, 'cu-points')}` : ''}
      ${it.mistakes.length ? `<h3>⚠️ ${TKD.t('Watch out', 'خلي بالك')}</h3>${list(it.mistakes, 'cu-mistakes')}` : ''}
      <div class="tkd-row cu-actions">
        <button type="button" class="btn" data-a="say">🔊 ${TKD.t('Say it', 'اسمعها')}</button>
        ${it.skillId ? `<button type="button" class="btn btn-primary" data-a="play">▶ ${TKD.t('Train it', 'اتمرن عليها')}</button>`
                     : `<button type="button" class="btn ${ok ? 'btn-primary' : ''}" data-a="tick">${ok ? '✓ ' + TKD.t('Practised', 'اتمرنت عليها') : TKD.t('I practised this', 'اتمرنت عليها في النادي')}</button>`}
        <button type="button" class="btn" data-a="close">${TKD.t('Close', 'اقفل')}</button>
      </div></div>`;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    ov.querySelector('[data-a="close"]').addEventListener('click', close);
    ov.querySelector('[data-a="say"]').addEventListener('click', () => {
      // the coach's recording (Korean) if there is one, else a Korean phone voice, else the romanized name
      if (window.Voice?.play(it.hangul, 'ko-KR')) return;
      const koVoice = (window.speechSynthesis?.getVoices() || []).some(v => /^ko/i.test(v.lang));
      SpeechHelper.speak(koVoice ? it.hangul : it.ko, koVoice ? 'ko-KR' : 'en-US');
    });
    ov.querySelector('[data-a="play"]')?.addEventListener('click', () => { close(); switchToSkill(it.skillId); });
    ov.querySelector('[data-a="tick"]')?.addEventListener('click', () => { this.toggle(it.id); close(); this.init(); });
  }
};
window.CurriculumScreen = CurriculumScreen;
Object.assign(window.TKDScreens || (window.TKDScreens = {}), { curriculum: () => CurriculumScreen.init() });
