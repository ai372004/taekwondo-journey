// ============================================================================
// BOTTOM TAB BAR (v28) — replaces the 20-button side menu.
// Four big tabs a child can hit with a thumb: اتمرّن · العب · إنجازاتي · المدرب.
// Each tab opens a sheet of large tiles; the tab of the current screen is lit.
// ============================================================================
const TabBar = {
  TABS: [
    { id: 'train', icon: '🥋', en: 'Train', ar: 'اتمرّن', screens: ['home', 'warmup', 'skill-menu', 'learning', 'curriculum', 'quiz', 'cooldown'],
      items: [
        { icon: '🏠', en: 'Home', ar: 'الرئيسية', go: () => switchScreen('home') },
        { icon: '▶️', en: "Let's train!", ar: 'يلا نتمرن!', go: () => (window.resumeTraining ? resumeTraining() : switchScreen('home')), hot: true },
        { icon: '🔥', en: 'Warm-up', ar: 'الإحماء', go: () => switchScreen('warmup') },
        { icon: '🎓', en: 'Learning', ar: 'التعلم', go: () => switchScreen('skill-menu') },
        { icon: '📚', en: 'Belt syllabus', ar: 'منهج الأحزمة', go: () => switchScreen('curriculum') },
        { icon: '📝', en: 'The test', ar: 'الاختبار', go: () => attemptStageNav('quiz') },
        { icon: '🧘', en: 'Cool-down', ar: 'التهدئة', go: () => switchScreen('cooldown') }
      ] },
    { id: 'play', icon: '🎮', en: 'Play', ar: 'العب', screens: ['games', 'form-control', 'puzzle', 'performance', 'action', 'error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'league', 'versus'],
      items: [
        { icon: '🎮', en: 'All games', ar: 'كل الألعاب', go: () => attemptStageNav('games'), hot: true },
        { icon: '🏆', en: "Today's challenge", ar: 'تحدي النهارده', go: () => (window.Challenge ? Challenge.start() : switchScreen('league')) },
        { icon: '🏅', en: 'Weekly league', ar: 'الدوري', go: () => switchScreen('league') },
        { icon: '⚔️', en: 'Challenge a friend', ar: 'تحدّى صاحبك', go: () => switchScreen('versus') }
      ] },
    { id: 'mine', icon: '⭐', en: 'My stars', ar: 'إنجازاتي', screens: ['profile', 'trophy-room', 'players', 'character-change', 'winner'],
      items: [
        { icon: '🦸', en: 'My hero page', ar: 'صفحتي', go: () => Profile.open(), hot: true },
        { icon: '🏆', en: 'Trophy room', ar: 'فاترينة الإنجازات', go: () => switchScreen('trophy-room') },
        { icon: '👥', en: 'All players', ar: 'كل اللاعبين', go: () => switchScreen('players') },
        { icon: '🧒', en: 'Change character', ar: 'غيّر الشخصية', go: () => switchScreen('character-change') },
        { icon: '🔁', en: 'Switch player', ar: 'غيّر اللاعب', go: () => StartScreen.show() }
      ] },
    { id: 'coach', icon: '👩‍🏫', en: 'Coach', ar: 'المدرب', screens: ['coach', 'dashboard', 'report'],
      items: [
        { icon: '👩‍🏫', en: 'Coach mode', ar: 'وضع المدرب', go: () => Coach.open(), hot: true },
        { icon: '📊', en: 'Player dashboard', ar: 'لوحة اللاعبين', go: () => switchScreen('dashboard') },
        { icon: '📈', en: 'Progress report', ar: 'تقرير التقدم', go: () => switchScreen('report') },
        { icon: '💾', en: 'Save backup', ar: 'احفظ نسخة', go: () => exportProgress() },
        { icon: '📂', en: 'Restore backup', ar: 'رجّع نسخة', go: () => triggerImportProgress() },
        { icon: '🔒', en: 'Privacy', ar: 'الخصوصية', go: () => { location.href = 'privacy.html'; } },
        { icon: '🗑️', en: 'Erase everything', ar: 'امسح كل حاجة', go: () => hardResetGame(), danger: true }
      ] }
  ],
  t(o) { return (typeof TKD !== 'undefined' && TKD.ar) ? o.ar : o.en; },
  mount() {
    if (document.getElementById('tabbar')) return;
    const bar = document.createElement('nav');
    bar.id = 'tabbar'; bar.className = 'tabbar';
    bar.setAttribute('aria-label', 'Main');
    document.body.appendChild(bar);
    const sheet = document.createElement('div');
    sheet.id = 'tab-sheet'; sheet.className = 'tab-sheet'; sheet.hidden = true;
    sheet.innerHTML = '<div class="tab-sheet-back" data-close></div><div class="tab-sheet-card" role="dialog" aria-modal="true"><div class="tab-sheet-grip" data-close></div><h3 id="tab-sheet-title"></h3><div class="tab-sheet-grid" id="tab-sheet-grid"></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', e => { if (e.target.closest('[data-close]')) this.close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) this.close(); });
    document.addEventListener('tkd:screen', () => { this.close(); this.render(); });
    // language switch → re-label
    new MutationObserver(() => this.render()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    document.body.classList.add('has-tabbar');
    this.render();
  },
  current() {
    const id = (document.querySelector('.screen.active')?.id || '').replace(/-screen$/, '');
    return this.TABS.find(t => t.screens.includes(id))?.id || null;
  },
  render() {
    const bar = document.getElementById('tabbar'); if (!bar) return;
    const cur = this.current(), open = this.openId;
    // full-screen sessions keep the bar out of the way: the warm-up (own ✕) and the
    // arena games, whose KICK! button sits at the bottom of the canvas (v29).
    const act = document.querySelector('.screen.active');
    const immersive = !!act && (act.id === 'warmup-screen' || act.id === 'action-screen' || act.classList.contains('arena-screen'));
    document.body.classList.toggle('tab-hidden', immersive);
    bar.innerHTML = this.TABS.map(t => `<button type="button" class="tab ${t.id === cur ? 'on' : ''} ${t.id === open ? 'open' : ''}" data-tab="${t.id}" aria-haspopup="dialog" aria-expanded="${t.id === open}">
        <span class="tab-ico" aria-hidden="true">${t.icon}</span><span class="tab-lbl">${this.t(t)}</span></button>`).join('');
    bar.querySelectorAll('.tab').forEach(b => b.addEventListener('click', (e) => { this._kbd = e.detail === 0; this.toggle(b.dataset.tab); }));
  },
  toggle(id) { this.openId === id ? this.close() : this.open(id); },
  open(id) {
    const tab = this.TABS.find(t => t.id === id); if (!tab) return;
    this.openId = id;
    const sheet = document.getElementById('tab-sheet');
    document.getElementById('tab-sheet-title').textContent = `${tab.icon} ${this.t(tab)}`;
    const grid = document.getElementById('tab-sheet-grid');
    grid.innerHTML = tab.items.map((it, i) => `<button type="button" class="tab-tile ${it.hot ? 'hot' : ''} ${it.danger ? 'danger' : ''}" data-i="${i}">
      <span class="tab-tile-ico" aria-hidden="true">${it.icon}</span><span>${this.t(it)}</span></button>`).join('');
    grid.querySelectorAll('.tab-tile').forEach(b => b.addEventListener('click', () => {
      const it = tab.items[+b.dataset.i]; this.close();
      try { TKD.gs()?.playSound('click'); } catch (e) {}
      it.go();
    }));
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('show'));
    if (this._kbd) grid.querySelector('.tab-tile')?.focus({ preventScroll: true });   // focus ring only for keyboard users
    this.render();
  },
  close() {
    const sheet = document.getElementById('tab-sheet'); if (!sheet || sheet.hidden) { this.openId = null; return; }
    this.openId = null;
    sheet.classList.remove('show');
    setTimeout(() => { if (!this.openId) sheet.hidden = true; }, 180);
    this.render();
  }
};
window.TabBar = TabBar;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => TabBar.mount()); else TabBar.mount();

// v28: on phones, long instructions fold to 2 lines with a "more" button
const DescFold = {
  apply() {
    const small = window.matchMedia('(max-width: 600px)').matches;
    document.querySelectorAll('.screen.active .description').forEach(p => {
      const next = p.nextElementSibling?.classList?.contains('desc-more') ? p.nextElementSibling : null;
      if (!small || p.dataset.open === '1') { p.classList.remove('desc-fold'); if (next && !small) next.remove(); return; }
      if ((p.textContent || '').trim().length < 90) return;
      p.classList.add('desc-fold');
      if (next) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'desc-more';
      const label = () => (p.classList.contains('desc-fold') ? (TKD.ar ? 'اقرا الشرح كله ▾' : 'Read all ▾') : (TKD.ar ? 'أقل ▴' : 'Less ▴'));
      b.textContent = label();
      b.addEventListener('click', () => { p.classList.toggle('desc-fold'); p.dataset.open = p.classList.contains('desc-fold') ? '0' : '1'; b.textContent = label(); });
      p.after(b);
    });
  }
};
document.addEventListener('tkd:screen', () => setTimeout(() => DescFold.apply(), 60));
window.addEventListener('resize', () => DescFold.apply());
window.DescFold = DescFold;
