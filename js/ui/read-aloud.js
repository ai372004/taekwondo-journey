// ============================================================================
// READ-ALOUD (v31) — for the 6-year-olds who can't read well yet.
//   • a big 🔊 on every screen reads its title + instructions
//   • a 🔊 on every game card reads the game's name + what to do
//   • the quiz 🔊 reads the question AND the four answers
//   • 🗣️ in the header = "read to me by myself": each screen, each quiz
//     question and the map's next step are read out as soon as they appear
// Speech goes through TKD.speak → the recorded Egyptian voice when there is one,
// otherwise the phone's voice. Muted sound = silent (with a hint).
// ============================================================================
const ReadAloud = {
  key() { return `taekwondoJourneyReadAloud:${TKD.pid() || 'guest'}`; },
  auto() { return !!TKD.read(this.key(), false); },
  setAuto(on) { TKD.write(this.key(), !!on); this.paintBtn(); if (on) this.say(TKD.t('I will read everything to you!', 'هقرالك كل حاجة!')); },
  clean(s) { return String(s || '').replace(/[\u{1F000}-\u{1FAFF}☀-➿️]/gu, '').replace(/\s+/g, ' ').trim(); },
  say(text, btn = null) {
    const t = this.clean(text); if (!t) return;
    if (TKD.gs()?.soundEnabled === false) { TKD.toast(TKD.t('Sound is off — turn it on with 🔊 at the top', 'الصوت مقفول — شغّله من 🔊 اللي فوق'), 'info'); return; }
    btn?.classList.add('speaking');
    SpeechHelper.speak(t, TKD.ar ? 'ar-EG' : 'en-US', btn);
    if (btn) setTimeout(() => btn.classList.remove('speaking'), Math.min(9000, 900 + t.length * 70));
  },
  // title + the screen's instructions
  screenText(screen) {
    const h = screen.querySelector('h2');
    const d = screen.querySelector('.description, .desc-fold .desc-full, .desc-fold');
    return [h?.textContent, d?.textContent].filter(Boolean).map(x => this.clean(x).replace(/اقرا الشرح كله|Read all/g, '')).join('. ');
  },
  mountScreen(screen) {
    if (!screen || screen.id === 'home-screen' || screen.id === 'warmup-screen') return;
    const box = screen.querySelector('.game-container') || screen;
    if (box.querySelector(':scope > .say-fab')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'say-fab';
    b.setAttribute('aria-label', TKD.t('Read it to me', 'اقرالي'));
    b.innerHTML = '<span aria-hidden="true">🔊</span>';
    b.addEventListener('click', (e) => { e.stopPropagation(); this.say(this.screenText(screen), b); });
    box.prepend(b);
  },
  mountCards() {
    document.querySelectorAll('.game-card').forEach(card => {
      if (card.querySelector('.say-mini')) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'say-mini';
      b.setAttribute('aria-label', TKD.t('What is this game?', 'اللعبة دي إيه؟'));
      b.innerHTML = '<span aria-hidden="true">🔊</span>';
      b.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); this.say(`${card.querySelector('h3')?.textContent || ''}. ${card.querySelector('p')?.textContent || ''}`, b); });
      card.appendChild(b);
    });
  },
  quizText() {
    const q = document.getElementById('question-text')?.textContent || '';
    const nums = TKD.ar ? ['واحد', 'اتنين', 'تلاتة', 'أربعة'] : ['one', 'two', 'three', 'four'];
    const opts = [...document.querySelectorAll('.quiz-option')].map((o, i) => `${nums[i] || ''}: ${o.querySelector('.option-text')?.textContent || ''}`);
    return `${q}. ${opts.join('. ')}`;
  },
  // the header switch
  mountBtn() {
    const ctrls = document.querySelector('.header-controls');
    if (!ctrls || document.getElementById('readAloudBtn')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'readAloudBtn'; b.className = 'sound-toggle-btn read-toggle-btn';
    b.addEventListener('click', () => this.setAuto(!this.auto()));
    ctrls.insertBefore(b, ctrls.firstChild);
    this.paintBtn();
  },
  paintBtn() {
    const b = document.getElementById('readAloudBtn'); if (!b) return;
    const on = this.auto();
    b.classList.toggle('muted', !on);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? TKD.t('Stop reading to me', 'بطّل تقرالي') : TKD.t('Read everything to me', 'اقرالي كل حاجة'));
    b.innerHTML = on ? '🗣️' : '<span style="opacity:.5">🗣️</span>';
  },
  init() {
    this.mountBtn();
    document.addEventListener('tkd:screen', (e) => {
      const id = e.detail?.screenId, scr = document.getElementById(`${id}-screen`);
      this.mountScreen(scr);
      if (id === 'games') this.mountCards();
      if (!this.auto() || !scr) return;
      clearTimeout(this._t);
      this._t = setTimeout(() => {
        if (!scr.classList.contains('active')) return;
        // quiz is handled entirely by the #question-text MutationObserver below
        // (it fires on the first question too) — reading it here as well would
        // speak the same question twice.
        if (id === 'home') { const n = window.Journey?.next?.(); if (n) this.say(TKD.t(`Next: ${n.label}`, `الخطوة الجاية: ${n.label}`)); }
        else if (id !== 'quiz' && id !== 'warmup') this.say(this.screenText(scr));
      }, 700);
    });
    document.addEventListener('tkd:player-changed', () => this.paintBtn());
    // the quiz: its 🔊 reads the answers too, and each new question is read in auto mode
    const qBtn = document.querySelector('.quiz-question .speak-btn');
    if (qBtn) { qBtn.removeAttribute('onclick'); qBtn.addEventListener('click', (e) => { e.stopPropagation(); this.say(this.quizText(), qBtn); }); }
    const qt = document.getElementById('question-text');
    if (qt) new MutationObserver(() => {
      if (this.auto() && document.getElementById('quiz-screen')?.classList.contains('active')) { clearTimeout(this._q); this._q = setTimeout(() => this.say(this.quizText()), 400); }
    }).observe(qt, { childList: true, characterData: true, subtree: true });
  }
};
window.ReadAloud = ReadAloud;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => ReadAloud.init()); else ReadAloud.init();
