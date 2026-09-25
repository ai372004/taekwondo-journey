// ============================================================================
// THE JOURNEY (v29 → v30 adventure map) — the child always sees ONE road and
// ONE next step.
//   🔥 warm-up → 🎓 learn → 🎭 🧩 👁️ ⚡ four games → 📝 test → 🎁 treasure
// The road snakes across the card like a board game. Finished stations keep
// their stars, the child's own fighter stands on the station that is next, the
// road fills up as they go, and the treasure chest at the end opens when the
// kick is mastered. Every screen that ends (a game, the warm-up, a lesson)
// offers the same next step, so nobody ever has to hunt through a menu.
// All looping motion is transform/opacity only (runs on the GPU compositor).
// ============================================================================
const Journey = {
  GAMES: ['form-control', 'puzzle', 'performance', 'action'],       // the 4 that a kick needs
  KEY: { 'form-control': 'formControl', puzzle: 'puzzle', performance: 'performance', action: 'action' },
  SHORT: {                                                          // station labels must fit under a 60 px button
    'form-control': { en: 'Pose', ar: 'الوضعية' },
    puzzle: { en: 'Puzzle', ar: 'رتّبها' },
    performance: { en: 'Spot it', ar: 'عين الحكم' },
    action: { en: 'Strike', ar: 'الضربة' }
  },
  skill() {
    const gs = TKD.gs(); if (!gs) return 'apchagi';
    const t = gs.getResumeTarget();
    return t.done ? gs.currentSkill : t.skillId;
  },
  scores(skillId) { return TKD.gs()?.skillGameScores?.[skillId] || {}; },
  gamesDone(skillId) { const s = this.scores(skillId); return this.GAMES.filter(g => (s[this.KEY[g]] || 0) > 0).length; },
  nextGame(skillId) { const s = this.scores(skillId); return this.GAMES.find(g => !(s[this.KEY[g]] > 0)) || null; },
  // ⭐ for a score: anything counts, 75+ is good, 90+ is perfect
  starsFor(score) { return score >= 90 ? 3 : score >= 75 ? 2 : score > 0 ? 1 : 0; },

  // the eight stations of the current kick
  steps(skillId = this.skill()) {
    const s = this.scores(skillId), gs = TKD.gs();
    const sc = k => s[k] || 0;
    const complete = !!gs?.completedSkills?.has(skillId);
    const allGames = this.gamesDone(skillId) >= this.GAMES.length;
    const st = [
      { id: 'warmup', stage: 'warmup', icon: '🔥', en: 'Warm-up', ar: 'الإحماء', done: sc('warmup') > 0, stars: sc('warmup') > 0 ? 3 : 0, go: () => switchScreen('warmup') },
      { id: 'learning', stage: 'learning', icon: '🎓', en: 'Learn it', ar: 'اتعلمها', done: sc('learning') > 0, stars: sc('learning') > 0 ? 3 : 0, go: () => switchScreen('learning') },
      ...this.GAMES.map(g => ({
        id: 'g:' + g, stage: 'games', game: g, icon: TKD.gameIcon(g), en: this.SHORT[g].en, ar: this.SHORT[g].ar,
        done: sc(this.KEY[g]) > 0, stars: this.starsFor(sc(this.KEY[g])), go: () => switchScreen(g)
      })),
      { id: 'quiz', stage: 'quiz', icon: '📝', en: 'The test', ar: 'الاختبار', done: sc('quiz') > 0, stars: this.starsFor(sc('quiz')), go: () => switchScreen(allGames ? 'quiz' : 'games') },
      { id: 'chest', stage: 'chest', icon: complete ? '🏅' : '🎁', en: 'Treasure', ar: 'الكنز', done: complete, stars: 0, go: () => switchScreen('trophy-room') }
    ];
    // the first unfinished station is "now"; everything after it is locked
    const i = st.findIndex(x => !x.done);
    st.forEach((x, k) => { x.state = x.done ? 'done' : k === i ? 'now' : 'locked'; });
    return st;
  },
  starTotal(st) { return st.reduce((a, x) => a + x.stars, 0); },
  starMax(st) { return st.filter(x => x.id !== 'chest').length * 3; },

  // the single next action (used by the home button and by every "what now?" moment)
  next() {
    const gs = TKD.gs();
    if (!gs) return null;
    const t = gs.getResumeTarget();
    if (t.done) return { icon: '🏆', label: TKD.t('See your trophies', 'شوف إنجازاتك'), step: 'done', stage: 'done', go: () => switchScreen('trophy-room') };
    const skillId = t.skillId, st = this.steps(skillId), now = st.find(x => x.state === 'now') || st[0];
    const name = TKD.skillName(skillId);
    const label = now.game ? TKD.t(`Play: ${TKD.gameName(now.game)}`, `العب: ${TKD.gameName(now.game)}`) : {
      warmup: TKD.t('Start the warm-up', 'ابدأ الإحماء'),
      learning: TKD.t(`Learn ${name}`, `اتعلم ${name}`),
      quiz: TKD.t(`Take the ${name} test`, `امتحن في ${name}`),
      chest: TKD.t('Open the treasure', 'افتح الكنز')
    }[now.id];
    return { icon: now.icon, label, step: now.id, stage: now.stage, skillId, go: () => { gs.currentSkill = skillId; gs.syncFlatProgressToCurrentSkill?.(); gs.saveToStorage?.(); now.go(); } };
  },

  // ------------------------------------------------------------------ the board geometry
  // 8 stations on a 300 × 330 board: three rows that snake like a board game
  // (right → left first in Arabic). Positions are in board units; the HTML uses %.
  BOARD: { w: 300, h: 342, rows: [54, 162, 270], cols: [250, 150, 50] },
  layout(n = 8) {
    const B = this.BOARD, rtl = TKD.ar, pts = [];
    for (let i = 0; i < n + 1; i++) {                                   // +1 = the sign to the next kick
      const row = Math.floor(i / 3), c = i % 3;
      let x = row % 2 === 0 ? B.cols[c] : B.cols[2 - c];
      if (!rtl) x = B.w - x;
      pts.push({ x, y: B.rows[row] });
    }
    return pts;
  },
  // one smooth road through the stations: straight runs + U-turns at the ends
  road(pts) {
    let d = `M${pts[0].x} ${pts[0].y}`;
    const segs = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      if (a.y === b.y) { d += ` L${b.x} ${b.y}`; segs.push(Math.abs(b.x - a.x)); continue; }
      const out = a.x > this.BOARD.w / 2 ? 42 : -42;                   // bulge outwards
      const c1 = { x: a.x + out, y: a.y }, c2 = { x: b.x + out, y: b.y };
      d += ` C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;
      segs.push(this.bezLen(a, c1, c2, b));
    }
    const total = segs.reduce((x, y) => x + y, 0);
    const at = [0]; segs.reduce((acc, l) => { acc += l; at.push(acc / total); return acc; }, 0);
    return { d, at };                                                  // at[i] = 0…1 position of station i on the road
  },
  // the fighter stands on the road next to its station (towards the middle of the board)
  stagePos(p) { return { x: p.x + (p.x > this.BOARD.w / 2 ? -44 : 44), y: p.y + 20 }; },
  bezLen(p0, p1, p2, p3) {
    let len = 0, px = p0.x, py = p0.y;
    for (let i = 1; i <= 24; i++) {
      const t = i / 24, u = 1 - t;
      const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
      const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
      len += Math.hypot(x - px, y - py); px = x; py = y;
    }
    return len;
  },

  // ------------------------------------------------------------------ home: the map
  html() {
    const skillId = this.skill(), st = this.steps(skillId), n = this.next(), gs = TKD.gs();
    const order = GameConfig.SKILL_ORDER, ki = Math.max(0, order.indexOf(skillId));
    const pts = this.layout(st.length), road = this.road(pts), B = this.BOARD;
    const nowI = st.findIndex(x => x.state === 'now');
    const reach = nowI < 0 ? 1 : road.at[nowI];
    const nextKick = order[ki + 1];
    const pct = (p) => `left:${(100 * p.x / B.w).toFixed(2)}%;top:${(100 * p.y / B.h).toFixed(2)}%`;
    const starRow = (x) => x.id === 'chest' ? '' : `<span class="jr-st-stars" aria-hidden="true">${[1, 2, 3].map(k => `<i class="${k <= x.stars ? 'on' : ''}" style="--k:${k}">★</i>`).join('')}</span>`;
    const kicks = order.map((id, i) => {
      const state = gs?.completedSkills?.has(id) ? 'done' : id === skillId ? 'now' : 'locked';
      return `<li class="jr-kick is-${state}"><span>${state === 'done' ? '✓' : state === 'locked' ? '🔒' : '🦶'}</span>${TKD.esc(TKD.skillName(id))}</li>`;
    }).join('');
    const stars = this.starTotal(st), max = this.starMax(st);
    return `<section class="jr jr-map" aria-label="${TKD.t('My journey', 'رحلتي')}" data-skill="${skillId}">
      <header class="jr-head">
        <div class="jr-title"><b>🗺️ ${TKD.t(`${TKD.skillName(skillId)} adventure`, `مغامرة ${TKD.skillName(skillId)}`)}</b>
          <small>${TKD.t(`Kick ${ki + 1} of ${order.length}`, `الركلة ${TKD.num(ki + 1)} من ${TKD.num(order.length)}`)}</small></div>
        <div class="jr-stars" title="${TKD.t('Stars on this map', 'نجوم الخريطة دي')}"><span class="jr-star-ico">⭐</span><b id="jr-star-n">${TKD.num(stars)}</b><small>/${TKD.num(max)}</small></div>
      </header>
      ${n ? `<button type="button" class="jr-go" id="jr-go"><span class="jr-go-ico">${n.icon}</span><span class="jr-go-txt"><b>${TKD.esc(n.label)}</b><small>${TKD.t('tap to start', 'دوس عشان تبدأ')}</small></span><span class="jr-go-arrow">${TKD.ar ? '←' : '→'}</span></button>` : ''}
      <div class="jr-board" id="jr-board" style="--reach:${reach.toFixed(4)}">
        <svg class="jr-road" viewBox="0 0 ${B.w} ${B.h}" aria-hidden="true" focusable="false">
          <defs><linearGradient id="jr-fill" x1="0" x2="1"><stop offset="0" stop-color="#ffd166"/><stop offset="1" stop-color="#ff6b35"/></linearGradient></defs>
          <path class="jr-road-edge" d="${road.d}"/>
          <path class="jr-road-bed" d="${road.d}"/>
          <path class="jr-road-dash" d="${road.d}"/>
          <path class="jr-road-fill" d="${road.d}" pathLength="1"/>
        </svg>
        ${st.map((x, i) => `
        <div class="jr-step is-${x.state} ${x.id === 'chest' ? 'is-chest' : ''}" data-step="${x.id}" style="${pct(pts[i])};--i:${i}">
          <button type="button" class="jr-dot" data-go="${x.id}" aria-label="${TKD.esc(TKD.ar ? x.ar : x.en)}${x.state === 'locked' ? ' — ' + TKD.t('locked', 'مقفول') : x.state === 'done' ? ' — ' + TKD.t('done', 'خلصت') : ''}">
            <span class="jr-ico">${x.state === 'locked' && x.id !== 'chest' ? '🔒' : x.icon}</span>
            ${x.state === 'done' && x.id !== 'chest' ? '<span class="jr-check" aria-hidden="true">✓</span>' : ''}
          </button>
          ${starRow(x)}
          <span class="jr-lbl">${TKD.esc(TKD.ar ? x.ar : x.en)}</span>
        </div>`).join('')}
        <div class="jr-sign" style="${pct(pts[st.length])}" aria-hidden="true">${nextKick
          ? `<span>🔒</span><small>${TKD.t('Next', 'الجاية')}: ${TKD.esc(TKD.skillName(nextKick))}</small>`
          : `<span>🥋</span><small>${TKD.t('Next belt!', 'الحزام الجاي!')}</small>`}</div>
        <div class="jr-stage" id="jr-stage" style="${pct(this.stagePos(pts[nowI < 0 ? st.length - 1 : nowI]))}"></div>
      </div>
      <ol class="jr-kicks" aria-label="${TKD.t('The kicks', 'الركلات')}">${kicks}</ol>
    </section>`;
  },
  bind(root = document) {
    // the child's own fighter stands on the station that is next
    const stage = root.querySelector('#jr-stage');
    const ch = TKD.gs()?.playerCharacter === 'girl' ? 'girl' : 'boy';
    const fallback = () => { if (stage) TKD.gs()?.createCharacterVisual('jr-stage', ch, 'IDLE'); };
    if (stage && window.RigSprite) {
      this.sprite = new RigSprite(stage, { ch, anim: 'idle', tap: 'win', height: 84 });
      this.sprite.start().then(ok => { if (!ok) fallback(); });
    } else fallback();
    root.querySelector('#jr-go')?.addEventListener('click', () => {
      TKD.gs()?.playSound('click'); window.AudioKit?.sfx('ui-pop', { gain: 0.5 });
      const step = this.next()?.step || '';
      this.sprite?.play(step.startsWith('g:') || step === 'quiz' ? 'win' : 'apchagi');
      setTimeout(() => this.next()?.go(), 200);
    });
    root.querySelectorAll('.jr-dot').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.go, st = this.steps().find(x => x.id === id);
      if (!st) return;
      const box = b.closest('.jr-step');
      if (st.state === 'locked') {
        box?.classList.remove('shake'); void box?.offsetWidth; box?.classList.add('shake');
        TKD.toast(st.id === 'chest'
          ? TKD.t('The treasure opens after the test 🎁', 'الكنز بيتفتح بعد الاختبار 🎁')
          : TKD.t('Finish the step before it first 😊', 'خلّص اللي قبلها الأول 😊'), 'warning');
        TKD.gs()?.playSound('error');
        return;
      }
      TKD.gs()?.playSound('click');
      box?.classList.add('tapped');
      const gs = TKD.gs(); if (gs) { gs.currentSkill = this.skill(); gs.syncFlatProgressToCurrentSkill?.(); }
      setTimeout(() => st.go(), 140);
    }));
    // the road fills to where the child is (animated once on first paint)
    const board = root.querySelector('#jr-board');
    if (board && !this._noIntro) { board.classList.add('intro'); requestAnimationFrame(() => requestAnimationFrame(() => board.classList.remove('intro'))); }
  },

  // ------------------------------------------------------------------ "what now?" button used after a game / lesson / warm-up
  nextButtonHTML(id = 'jr-next-btn') {
    const n = this.next(); if (!n) return '';
    return `<button type="button" class="btn btn-success jr-next" id="${id}">${n.icon} ${TKD.t('Next:', 'الخطوة الجاية:')} ${TKD.esc(n.label)} ${TKD.ar ? '←' : '→'}</button>`;
  },
  bindNextButton(id = 'jr-next-btn') {
    const b = document.getElementById(id); if (!b) return;
    b.addEventListener('click', () => { TKD.gs()?.playSound('click'); this.next()?.go(); });
  }
};
window.Journey = Journey;

// ---------------------------------------------------------------- first-time welcome
Object.assign(Journey, {
  welcomeKey() { return `taekwondoJourneyWelcome:${TKD.pid() || 'guest'}`; },
  welcome(root = document) {
    if (!TKD.pid() || TKD.read(this.welcomeKey(), false)) return;
    if (document.querySelector('.jr-coach')) return;
    const anchor = root.querySelector('.jr') || root.querySelector('#jr-go'); if (!anchor) return;
    const p = PlayerSystem.getCurrentPlayer();
    const box = document.createElement('div');
    box.className = 'jr-coach';
    box.innerHTML = `<div class="jr-coach-inner">
      <img class="jr-coach-img" src="assets/images/characters/coach_yang/coach_idle.webp" alt="">
      <div class="jr-coach-bubble">
        <b>${TKD.t('Hi! I am Coach Yang 👋', 'أهلًا! أنا الكوتش يانج 👋')}</b>
        <p>${TKD.t(`${p?.name || ''}, this is your map! Walk the road one station at a time, collect the stars ⭐ — and at the end there's a treasure 🎁.`, `يا ${p?.name || 'بطل'}، دي خريطتك! امشي على الطريق محطة محطة، واجمع النجوم ⭐، وفي الآخر فيه كنز مستنيك 🎁.`)}</p>
        <button type="button" class="btn btn-success" data-a="go">${TKD.t("Let's go! 🚀", 'يلا بينا! 🚀')}</button>
      </div></div>`;
    anchor.after(box);
    const close = () => { TKD.write(this.welcomeKey(), true); box.remove(); };
    box.querySelector('[data-a="go"]').addEventListener('click', () => { close(); this.next()?.go(); });
    box.addEventListener('click', (e) => { if (e.target === box) close(); });          // tap outside the bubble
    const bye = (e) => { if (e.detail?.screenId !== 'home') { document.removeEventListener('tkd:screen', bye); close(); } };
    document.addEventListener('tkd:screen', bye);                                      // never left hanging
    TKD.speak(TKD.t('This is your map. Walk the road and collect the stars!', 'دي خريطتك. امشي على الطريق واجمع النجوم!'));
    setTimeout(close, 14000);
  }
});

// ---------------------------------------------------------------- celebrations
// Coming back to the map after finishing something: the station pops, its stars
// fly in one by one, the road fills to the new station and the fighter hops
// there. Finishing a whole kick opens the treasure chest.
Object.assign(Journey, {
  snapKey() { return `taekwondoJourneySteps:${TKD.pid() || 'guest'}`; },
  reduced() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; },
  celebrate(root = document) {
    // the hub also re-renders in the background (player switch, sync) — only replay what the child can SEE
    if (!document.getElementById('home-screen')?.classList.contains('active')) return;
    const gs = TKD.gs(), skill = this.skill(), st = this.steps(skill);
    const snap = { skill, done: st.filter(x => x.done).map(x => x.id), stars: Object.fromEntries(st.map(x => [x.id, x.stars])), completed: [...(gs?.completedSkills || [])] };
    const before = TKD.read(this.snapKey(), null);
    TKD.write(this.snapKey(), snap);
    if (!before || Array.isArray(before)) return;                     // first visit (or the v29 format) → nothing to replay
    const newKick = snap.completed.find(id => !(before.completed || []).includes(id));
    if (newKick) { this.treasure(newKick); return; }
    if (before.skill !== skill) return;
    const fresh = st.filter(x => x.done && !before.done.includes(x.id));
    const moreStars = st.filter(x => x.done && before.done.includes(x.id) && x.stars > (before.stars?.[x.id] || 0));
    if (!fresh.length && !moreStars.length) return;
    const board = root.querySelector('#jr-board');
    const reduced = this.reduced();
    // 1) the road and the fighter start where they were…
    if (board && !reduced) {
      const pts = this.layout(st.length), road = this.road(pts), B = this.BOARD;
      const prevNow = st.findIndex(x => !before.done.includes(x.id));
      if (prevNow >= 0 && fresh.length) {
        board.style.setProperty('--reach', road.at[prevNow].toFixed(4));
        const stg = board.querySelector('#jr-stage'), to = { left: stg?.style.left, top: stg?.style.top };
        const sp = this.stagePos(pts[prevNow]);
        if (stg) { stg.classList.add('no-tr'); stg.style.left = `${(100 * sp.x / B.w).toFixed(2)}%`; stg.style.top = `${(100 * sp.y / B.h).toFixed(2)}%`; void stg.offsetWidth; stg.classList.remove('no-tr'); }
        // 2) …then move on once the stars have landed
        setTimeout(() => {
          const nowI = st.findIndex(x => x.state === 'now');
          board.style.setProperty('--reach', (nowI < 0 ? 1 : road.at[nowI]).toFixed(4));
          if (stg) { stg.classList.add('hop'); stg.style.left = to.left; stg.style.top = to.top; setTimeout(() => stg.classList.remove('hop'), 900); }
          window.AudioKit?.sfx('whoosh-1', { gain: 0.35 });
        }, 700 + fresh.length * 450);
      }
    }
    [...fresh, ...moreStars].forEach((x, k) => setTimeout(() => {
      const box = root.querySelector(`.jr-step[data-step="${x.id}"]`); if (!box) return;
      box.classList.add('just-done');
      const dot = box.querySelector('.jr-dot');
      if (dot && !reduced) for (let i = 0; i < 12; i++) {
        const s = document.createElement('i');
        s.className = 'jr-spark';
        s.style.setProperty('--a', `${(360 / 12) * i}deg`);
        dot.appendChild(s);
        setTimeout(() => s.remove(), 900);
      }
      box.querySelectorAll('.jr-st-stars i.on').forEach((star, j) => {
        star.classList.add('fly');
        setTimeout(() => window.AudioKit?.sfx('star', { gain: 0.4, rate: 1 + j * 0.12 }), 180 + j * 160);
      });
      setTimeout(() => box.classList.remove('just-done'), 1400);
    }, 350 + k * 450));
    // the star counter counts up to the new total
    const n = root.querySelector('#jr-star-n');
    const from = Object.values(before.stars || {}).reduce((a, b) => a + b, 0);
    if (n && !reduced) { n.textContent = TKD.num(from); setTimeout(() => window.tkdCountUp(n, this.starTotal(st), { dur: 900, from }), 500); }
  },
  // a whole kick mastered → the treasure chest opens
  treasure(skillId) {
    if (document.querySelector('.jr-treasure')) return;
    const nextId = GameConfig.SKILL_ORDER[GameConfig.SKILL_ORDER.indexOf(skillId) + 1];
    const box = document.createElement('div');
    box.className = 'jr-treasure' + (this.reduced() ? ' still' : '');
    box.setAttribute('role', 'dialog');
    box.innerHTML = `<div class="jr-tr-card">
      <div class="jr-tr-rays" aria-hidden="true"></div>
      <div class="jr-tr-chest" aria-hidden="true"><span class="jr-tr-closed">🎁</span><span class="jr-tr-open">🏅</span></div>
      <h3>${TKD.t(`You mastered ${TKD.skillName(skillId)}!`, `إنت كده قفلت ${TKD.skillName(skillId)}!`)}</h3>
      <p>${TKD.t('The treasure is open — your medal is in the trophy room.', 'الكنز اتفتح — الميدالية بتاعتك في أوضة الإنجازات.')}</p>
      ${nextId ? `<p class="jr-tr-next">🦶 ${TKD.t('Next adventure', 'المغامرة الجاية')}: <b>${TKD.esc(TKD.skillName(nextId))}</b></p>` : ''}
      <button type="button" class="btn btn-success" data-a="ok">${nextId ? TKD.t("On to the next kick! 🚀", 'يلا على الركلة الجاية! 🚀') : TKD.t('See my trophies 🏆', 'شوف إنجازاتي 🏆')}</button>
    </div>`;
    document.body.appendChild(box);
    for (let i = 0; i < 18 && !this.reduced(); i++) {
      const c = document.createElement('i');
      c.className = 'jr-confetti';
      c.style.setProperty('--x', `${Math.round(Math.random() * 100)}%`);
      c.style.setProperty('--d', `${(Math.random() * 0.6).toFixed(2)}s`);
      c.style.setProperty('--h', `${Math.round(Math.random() * 360)}`);
      box.appendChild(c);
    }
    window.AudioKit?.sfx('taiko', { gain: 0.6 });
    setTimeout(() => { box.classList.add('open'); window.AudioKit?.sfx('win', { gain: 0.6 }); }, this.reduced() ? 0 : 900);
    const close = () => box.remove();
    box.querySelector('[data-a="ok"]').addEventListener('click', () => { close(); if (!nextId) switchScreen('trophy-room'); });
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    const bye = (e) => { if (e.detail?.screenId !== 'home') { document.removeEventListener('tkd:screen', bye); close(); } };
    document.addEventListener('tkd:screen', bye);
  }
});

// number that counts up — used for scores and points
window.tkdCountUp = function (el, to, { dur = 900, suffix = '', from = 0 } = {}) {
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const num = n => (typeof TKD !== 'undefined' && TKD.ar ? TKD.num(n) : String(n));
  if (reduce) { el.textContent = num(to) + suffix; return; }
  const t0 = performance.now();
  const tick = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = num(Math.round(from + (to - from) * e)) + suffix;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// ---------------------------------------------------------------- lite mode for slow phones
// A phone with ≤4 cores or ≤3 GB of memory — or one on which a game already had
// to lower its render scale — gets html.lite: decorative loops off, fewer particles.
(function tkdLite() {
  let q = 1; try { q = +localStorage.getItem('tkdRenderQ') || 1; } catch (e) {}
  const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3 || q <= 0.75;
  document.documentElement.classList.toggle('lite', weak);
  window.TKDLite = () => document.documentElement.classList.contains('lite');
})();
