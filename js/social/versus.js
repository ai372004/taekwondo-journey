/* =====================================================================
   TAEKWONDO JOURNEY — 1 × 1 DUEL + KNOCKOUT TOURNAMENT (v23)
   Two players on ONE screen. A referee board announces an opening; the
   first player to kick a LEGAL target for the chosen kick scores
   (+2 body / +3 head). Kicking a trap (leg = below the belt, a covered
   target) or kicking before the signal gives the other player +1.
   First to 10, or the leader after 12 exchanges (tie → golden point).
   Tournament: 3–8 registered players, random bracket, byes, champion badge.
   Loaded after competition.js.
   ===================================================================== */
'use strict';

const Versus = {
  KEY: 'taekwondoJourneyVersus',
  TKEY: 'taekwondoJourneyTournament',
  mode: 'friendly',            // friendly | tournament
  sel: { p1: null, p2: null, skill: 'apchagi', picks: [] },
  WIN_POINTS: 10, MAX_EX: 12,
  VALID: { apchagi: ['body', 'head'], narochagi: ['head'], bakchagi3: ['body'] },
  LABEL: { head: { en: 'HEAD', ar: 'الراس', icon: '🎯' }, body: { en: 'BODY', ar: 'الجسم', icon: '🎯' }, leg: { en: 'LEG', ar: 'الرجل', icon: '🦵' }, covered: { en: 'COVERED', ar: 'متغطي', icon: '🛡️' } },

  load() { return TKD.read(this.KEY, { matches: [], champions: [] }); },
  save(d) { TKD.write(this.KEY, d); },
  tour() { return TKD.read(this.TKEY, null); },
  saveTour(t) { TKD.write(this.TKEY, t); },

  standings() {
    const players = PlayerSystem.getPlayers(); const by = {};
    this.load().matches.forEach(m => {
      [['p1', 's1'], ['p2', 's2']].forEach(([k, s]) => {
        const id = m[k]?.id; if (!id || !players.find(p => p.id === id)) return;
        const r = (by[id] ||= { p: players.find(p => p.id === id), w: 0, l: 0, pts: 0 });
        r.pts += m[s];
        if (m.winner === id) r.w++; else if (m.winner) r.l++;
      });
    });
    return Object.values(by).sort((a, b) => b.w - a.w || a.l - b.l || b.pts - a.pts);
  },
  champions() {
    const players = PlayerSystem.getPlayers();
    return this.load().champions.slice().reverse().map(c => ({ ...c, p: players.find(p => p.id === c.id) || { name: c.pname } }));
  },

  init() {
    this.teardown();
    const t = this.tour();
    if (t && !t.done) this.mode = 'tournament';
    this.renderSetup();
  },
  refresh() { if (this.view === 'match') this.renderPads(); else if (this.view === 'bracket') this.renderBracket(); else this.renderSetup(); },

  // ------------------------------------------------------------ setup
  renderSetup() {
    this.view = 'setup';
    const root = TKD.$('vs-root'); if (!root) return;
    const players = PlayerSystem.getPlayers();
    const t = this.tour();
    if (!this.sel.p1) this.sel.p1 = PlayerSystem.getCurrentPlayerId() || 'guest1';
    if (!this.sel.p2) this.sel.p2 = players.find(p => p.id !== this.sel.p1)?.id || 'guest2';
    const opt = (slot) => {
      const list = [...players.map(p => ({ id: p.id, p })), { id: slot === 'p1' ? 'guest1' : 'guest2', p: { name: slot === 'p1' ? TKD.t('Guest 1', 'ضيف ١') : TKD.t('Guest 2', 'ضيف ٢'), character: slot === 'p1' ? 'boy' : 'girl' } }];
      return `<div class="vs-pick ${slot}"><h4>${slot === 'p1' ? `🔵 ${TKD.t('Player 1', 'اللاعب ١')}` : `🔴 ${TKD.t('Player 2', 'اللاعب ٢')}`}</h4>
        <div class="vs-pick-list">${list.map(({ id, p }) => `<button type="button" class="vs-chip ${this.sel[slot] === id ? 'on' : ''}" data-slot="${slot}" data-id="${id}" ${(slot === 'p1' ? this.sel.p2 : this.sel.p1) === id ? 'disabled' : ''}>${TKD.avatar(p)}<span>${TKD.esc(p.name)}</span></button>`).join('')}</div></div>`;
    };
    const kicks = `<div class="vs-kicks">${GameConfig.SKILL_ORDER.map(sk => `<button type="button" class="vs-chip ${this.sel.skill === sk ? 'on' : ''}" data-skill="${sk}">🥋 ${TKD.skillName(sk)}</button>`).join('')}</div>`;
    const tabs = `<div class="lg-tabs"><button type="button" class="${this.mode === 'friendly' ? 'on' : ''}" data-mode="friendly">⚔️ ${TKD.t('Friendly match', 'مباراة ودية')}</button>
      <button type="button" class="${this.mode === 'tournament' ? 'on' : ''}" data-mode="tournament">👑 ${TKD.t('Tournament', 'بطولة')}</button></div>`;
    let body;
    if (this.mode === 'friendly') {
      body = `<div class="vs-setup">${opt('p1')}<div class="vs-vs">VS</div>${opt('p2')}</div>
        <h4 class="vs-h">${TKD.t('Kick for this match', 'الركلة في المباراة دي')}</h4>${kicks}
        <p class="tkd-muted">${TKD.t('Hold the tablet between you. Player 1 taps the blue side (or A), player 2 the red side (or L).', 'امسكوا التابلت بينكم. اللاعب ١ يدوس على الأزرق (أو حرف A)، واللاعب ٢ على الأحمر (أو حرف L).')}</p>
        <button type="button" class="btn btn-success vs-start" id="vs-go">⚔️ ${TKD.t('Start the duel', 'ابدأ المواجهة')}</button>`;
    } else if (t) {                                   // running, or finished and not cleared yet
      body = `<div id="vs-bracket-inline"></div>`;
    } else {
      if (!this.sel.picks.length) this.sel.picks = players.slice(0, 8).map(p => p.id);
      body = `<h4 class="vs-h">${TKD.t('Who is in? (3 to 8 players)', 'مين داخل البطولة؟ (من ٣ لـ ٨ لاعبين)')}</h4>
        <div class="vs-pick-list">${players.map(p => `<button type="button" class="vs-chip ${this.sel.picks.includes(p.id) ? 'on' : ''}" data-pick="${p.id}">${TKD.avatar(p)}<span>${TKD.esc(p.name)}</span></button>`).join('')}</div>
        ${players.length < 3 ? `<p class="tkd-muted">⚠️ ${TKD.t('Register at least 3 players first.', 'سجّل ٣ لاعبين على الأقل الأول.')}</p>` : ''}
        <h4 class="vs-h">${TKD.t('Kick for the tournament', 'الركلة في البطولة')}</h4>${kicks}
        <button type="button" class="btn btn-success vs-start" id="vs-tour-go" ${this.sel.picks.length < 3 ? 'disabled' : ''}>👑 ${TKD.t(`Start the tournament (${this.sel.picks.length})`, `ابدأ البطولة (${TKD.num(this.sel.picks.length)})`)}</button>`;
    }
    root.innerHTML = tabs + body;
    root.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { this.mode = b.dataset.mode; this.renderSetup(); }));
    root.querySelectorAll('[data-slot]').forEach(b => b.addEventListener('click', () => { this.sel[b.dataset.slot] = b.dataset.id; TKD.gs()?.playSound('click'); this.renderSetup(); }));
    root.querySelectorAll('[data-skill]').forEach(b => b.addEventListener('click', () => { this.sel.skill = b.dataset.skill; this.renderSetup(); }));
    root.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.pick, l = this.sel.picks;
      this.sel.picks = l.includes(id) ? l.filter(x => x !== id) : (l.length < 8 ? [...l, id] : l);
      this.renderSetup();
    }));
    TKD.$('vs-go')?.addEventListener('click', () => this.startMatch(this.who(this.sel.p1, 'p1'), this.who(this.sel.p2, 'p2'), this.sel.skill));
    TKD.$('vs-tour-go')?.addEventListener('click', () => this.createTournament());
    if (TKD.$('vs-bracket-inline')) this.renderBracket(TKD.$('vs-bracket-inline'));
  },
  who(id, slot) {
    const p = PlayerSystem.getPlayers().find(x => x.id === id);
    if (p) return { id: p.id, name: p.name, character: p.character || 'boy' };
    return { id: null, name: slot === 'p1' ? TKD.t('Guest 1', 'ضيف ١') : TKD.t('Guest 2', 'ضيف ٢'), character: slot === 'p1' ? 'boy' : 'girl' };
  },

  // ------------------------------------------------------------ tournament
  createTournament() {
    const ids = AG.shuffle(this.sel.picks);
    const size = ids.length <= 4 ? 4 : 8;
    const slots = [...ids, ...new Array(size - ids.length).fill(null)];
    // spread byes: pair a player with a bye rather than two byes together
    const first = [];
    for (let i = 0; i < size / 2; i++) first.push({ a: slots[i], b: slots[size - 1 - i], winner: null });
    const rounds = [first];
    for (let n = size / 4; n >= 1; n /= 2) rounds.push(new Array(n).fill(0).map(() => ({ a: null, b: null, winner: null })));
    const d = new Date();
    const t = { id: 't' + Date.now(), name: TKD.t(`Cup ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`, `كأس ${d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}`), skill: this.sel.skill, rounds, done: false, champion: null };
    this.advanceByes(t);
    this.saveTour(t);
    TKD.gs()?.playSound('success');
    this.renderSetup();
  },
  advanceByes(t) {
    let changed = true;
    while (changed) {
      changed = false;
      t.rounds.forEach((round, ri) => round.forEach((m, mi) => {
        if (m.winner) return;
        const aDone = ri === 0 || t.rounds[ri - 1][mi * 2].winner !== null;
        const bDone = ri === 0 || t.rounds[ri - 1][mi * 2 + 1].winner !== null;
        if (!aDone || !bDone) return;
        if (m.a && !m.b) { m.winner = m.a; changed = true; }
        else if (!m.a && m.b) { m.winner = m.b; changed = true; }
        else if (!m.a && !m.b && ri > 0) { m.winner = 'bye'; changed = true; }
        if (m.winner) this.propagate(t, ri, mi);
      }));
    }
  },
  propagate(t, ri, mi) {
    const m = t.rounds[ri][mi];
    if (ri === t.rounds.length - 1) { if (m.winner && m.winner !== 'bye') { t.done = true; t.champion = m.winner; } return; }
    const next = t.rounds[ri + 1][Math.floor(mi / 2)];
    const w = m.winner === 'bye' ? null : m.winner;
    if (mi % 2 === 0) next.a = w; else next.b = w;
  },
  nextMatch(t) {
    for (let ri = 0; ri < t.rounds.length; ri++) for (let mi = 0; mi < t.rounds[ri].length; mi++) {
      const m = t.rounds[ri][mi];
      if (!m.winner && m.a && m.b) return { ri, mi, m };
    }
    return null;
  },
  renderBracket(host) {
    const t = this.tour(); if (!t) return this.renderSetup();
    this.view = host ? 'setup' : 'bracket';
    const root = host || TKD.$('vs-root');
    const players = PlayerSystem.getPlayers();
    const name = (id) => id ? TKD.esc(players.find(p => p.id === id)?.name || '?') : `<i>${TKD.t('bye', 'راحة')}</i>`;
    const rn = (ri) => { const left = t.rounds.length - ri; return left === 1 ? TKD.t('Final', 'النهائي') : left === 2 ? TKD.t('Semi-finals', 'قبل النهائي') : TKD.t('Quarter-finals', 'ربع النهائي'); };
    const nm = this.nextMatch(t);
    root.innerHTML = `<div class="vs-tour-head"><h3>👑 ${TKD.esc(t.name)} · ${TKD.skillName(t.skill)}</h3>
        <button type="button" class="btn btn-small btn-danger" id="vs-tour-cancel">✖ ${TKD.t('Cancel tournament', 'الغي البطولة')}</button></div>
      <div class="vs-bracket">${t.rounds.map((round, ri) => `<div class="vs-round"><h4>${rn(ri)}</h4>${round.map((m, mi) => `
        <div class="vs-match ${nm && nm.ri === ri && nm.mi === mi ? 'next' : ''}">
          <span class="${m.winner && m.winner === m.a ? 'win' : ''}">${m.a || ri === 0 ? name(m.a) : '…'}</span>
          <span class="${m.winner && m.winner === m.b ? 'win' : ''}">${m.b || ri === 0 ? name(m.b) : '…'}</span></div>`).join('')}</div>`).join('')}</div>
      ${t.done ? `<div class="vs-champ">🏆 ${TKD.t('Champion', 'البطل')}: <b>${name(t.champion)}</b>
          <button type="button" class="btn btn-small" id="vs-cert">📜 ${TKD.t('Certificate', 'الشهادة')}</button>
          <button type="button" class="btn btn-success btn-small" id="vs-tour-new">${TKD.t('New tournament', 'بطولة جديدة')}</button></div>`
        : nm ? `<button type="button" class="btn btn-success vs-start" id="vs-tour-play">⚔️ ${TKD.t('Next match', 'الماتش الجاي')}: ${name(nm.m.a)} × ${name(nm.m.b)}</button>` : ''}`;
    TKD.$('vs-tour-cancel')?.addEventListener('click', async () => { if (await tkdConfirm(TKD.t('Cancel this tournament?', 'تلغي البطولة دي؟'))) { localStorage.removeItem(this.TKEY); this.renderSetup(); } });
    TKD.$('vs-tour-new')?.addEventListener('click', () => { localStorage.removeItem(this.TKEY); this.renderSetup(); });
    TKD.$('vs-cert')?.addEventListener('click', () => { const p = players.find(x => x.id === t.champion); if (p) Certificates.draw({ icon: '👑', title: TKD.t('Tournament Champion', 'بطل البطولة'), name: p.name, line: t.name, date: TKD.dayKey() }); });
    TKD.$('vs-tour-play')?.addEventListener('click', () => {
      this.tourMatch = { ri: nm.ri, mi: nm.mi };
      this.startMatch(this.who(nm.m.a, 'p1'), this.who(nm.m.b, 'p2'), t.skill);
    });
  },
  finishTourMatch(winnerId) {
    const t = this.tour(); if (!t || !this.tourMatch) return;
    const { ri, mi } = this.tourMatch; this.tourMatch = null;
    t.rounds[ri][mi].winner = winnerId;
    this.propagate(t, ri, mi);
    this.advanceByes(t);
    if (t.done) {
      const d = this.load(); const p = PlayerSystem.getPlayers().find(x => x.id === t.champion);
      d.champions.push({ id: t.champion, pname: p?.name, name: t.name, date: TKD.dayKey() }); this.save(d);
      if (p) PlayerSystem.updatePlayer(p.id, { badges: [...(p.badges || []), { id: 'tournament-champion', week: TKD.dayKey() }], pending: [...(p.pending || []), { id: 'tournament-champion', week: TKD.dayKey() }] });
    }
    this.saveTour(t);
  },

  // ------------------------------------------------------------ match
  async startMatch(p1, p2, skill) {
    TKDHints.hide(); TKDHints.mark('versus');       // no pop-up over a running match
    if (!p1.id && !p2.id && this.tourMatch) return;
    this.teardown();
    this.view = 'match';
    this.P = [p1, p2]; this.skill = skill;
    this.score = [0, 0]; this.ex = 0; this.state = 'intro'; this.signal = null; this.golden = false; this.over = false;
    this.fouled = [false, false];
    const root = TKD.$('vs-root');
    root.innerHTML = `<div class="arena-wrap vs-wrap" id="vs-wrap"><canvas class="arena-canvas" id="vs-canvas" aria-label="Duel"></canvas><div class="arena-ui" id="vs-ui"></div></div>
      <div class="vs-pads" id="vs-pads" dir="ltr"></div>
      <div class="center-buttons"><button type="button" class="btn btn-small" id="vs-quit">✖ ${TKD.t('Stop', 'وقّف')}</button></div>`;
    this.renderPads();
    TKD.$('vs-quit').addEventListener('click', () => { this.teardown(); this.tourMatch = null; this.renderSetup(); });
    this.stage = new ArenaStage(TKD.$('vs-canvas'));
    const mk = (p, mirror) => (window.arenaMakeFighter ? arenaMakeFighter(this.stage, skill, p.character !== 'girl', { mirror }) : new ArenaFighter(this.stage, arenaKickFrames(skill, p.character !== 'girl'), { shared: arenaSharedCanvas(skill), mirror }));
    this.F = [mk(p1, false), mk(p2, true)];
    this.stage.onResize = () => this.layout();
    this.stage.start((dt) => this.update(dt), (c, W, H) => this.draw(c, W, H));
    const tok = (this.tok = (this.tok || 0) + 1);
    await Promise.all(this.F.map(f => f.load()));
    if (tok !== this.tok) return;
    this.layout();
    this.keyH = (e) => {
      if (!TKD.$('versus-screen')?.classList.contains('active') || this.view !== 'match') return;
      if (e.repeat) return;
      // e.code = the physical key, so A / L work even when the keyboard is switched to Arabic (ش / م)
      const k = e.code;
      if (k === 'KeyA' || k === 'KeyS' || k === 'ShiftLeft') { e.preventDefault(); this.press(0); }
      if (k === 'KeyL' || k === 'KeyK' || k === 'Enter' || k === 'ShiftRight') { e.preventDefault(); this.press(1); }
    };
    document.addEventListener('keydown', this.keyH);
    const st = this.stage;
    st.text(st.W / 2, st.H * 0.4, TKD.t('Kyung-rye!', 'كيونغ ري!'), { size: 34, ttl: 1.1, rise: 8 });
    this.later(() => st.text(st.W / 2, st.H * 0.4, TKD.t('Shi-jak! 🔔', 'شي-جاك! 🔔'), { color: '#ffd166', size: 40, ttl: 1, rise: 8 }), 1100);
    this.later(() => { if (!window.AudioKit?.sfx('gong', { gain: 0.6, vary: 0 })) ArenaSound.tone({ f0: 880, f1: 880, dur: 0.35, type: 'triangle', gain: 0.35 }); this.nextExchange(); }, 1900);
  },
  renderPads() {
    const pads = TKD.$('vs-pads'); if (!pads || !this.P) return;
    pads.innerHTML = this.P.map((p, i) => `<button type="button" class="vs-pad p${i + 1}" data-i="${i}">🦶 ${TKD.esc(p.name)}<small>${i === 0 ? TKD.t('key A', 'زرار A') : TKD.t('key L', 'زرار L')}</small><span class="vs-hint"></span></button>`).join('');
    pads.querySelectorAll('.vs-pad').forEach(b => b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 120); this.press(+b.dataset.i); }));
  },
  later(fn, ms) { const tok = this.tok; const id = setTimeout(() => { if (tok === this.tok) fn(); }, ms); (this._t ||= []).push(id); },
  teardown() {
    this.tok = (this.tok || 0) + 1;
    (this._t || []).forEach(clearTimeout); this._t = [];
    this.stage?.destroy(); this.stage = null;
    if (this.keyH) document.removeEventListener('keydown', this.keyH); this.keyH = null;
  },
  layout() {
    const st = this.stage; if (!st || !this.F) return;
    const W = st.W, H = st.H, fy = st.floorY();
    const figH = Math.min(H * 0.6, W * 0.34);
    this.F[0].layout(W * 0.28, fy, figH);
    this.F[1].layout(W * 0.72, fy, figH);
    st.spotX = W / 2;
  },
  nextExchange() {
    if (this.over || !this.stage) return;
    const [a, b] = this.score;
    if (!this.golden && (a >= this.WIN_POINTS || b >= this.WIN_POINTS || this.ex >= this.MAX_EX)) {
      if (a === b) { this.golden = true; this.stage.text(this.stage.W / 2, this.stage.H * 0.35, TKD.t('⭐ Golden point!', '⭐ النقطة الدهبية!'), { color: '#ffd166', size: 34, ttl: 1.4 }); }
      else return this.endMatch();
    } else if (this.golden && a !== b) return this.endMatch();
    this.ex++;
    this.state = 'wait'; this.signal = null; this.fouled = [false, false];
    this.later(() => this.openSignal(), AG.rand(1000, 2400));
  },
  openSignal() {
    if (this.state !== 'wait') return;
    const valid = this.VALID[this.skill];
    const trap = Math.random() < 0.35 && this.ex > 1;
    const kind = trap ? AG.pick(['leg', 'covered']) : AG.pick(valid);
    this.signal = { kind, valid: !trap, born: this.stage.time, zone: kind === 'covered' ? AG.pick(valid) : kind };
    this.state = 'open';
    ArenaSound.tone({ f0: 620, f1: 820, dur: 0.08, type: 'sine', gain: 0.22 });
  },
  press(i) {
    if (this.over || this.view !== 'match' || !this.stage) return;
    const other = 1 - i, st = this.stage;
    if (this.state === 'wait') {                       // jumped the gun
      if (this.fouled[i]) return;
      this.fouled[i] = true;
      this.score[other] += 1; this.pop = { i: other, t: 1 };
      ArenaSound.buzz();
      const f = this.F[i]; f.wobble = 0.6;
      st.text(f.x, f.floor - f.height * 1.05, TKD.t('Too early! +1 ⟶', 'بدري! +١ للتاني'), { color: '#ffb3b9', size: 20 });
      return;
    }
    if (this.state !== 'open') return;
    this.state = 'resolving';
    const s = this.signal, rt = st.time - s.born;
    if (s.valid) {
      const pts = s.kind === 'head' ? 3 : 2;
      this.kick(i, () => {
        this.score[i] += pts; this.pop = { i, t: 1 };
        const v = this.F[other], hx = v.footScreenX(), hy = v.floor - v.height * (s.kind === 'head' ? 0.86 : 0.6);
        ArenaSound.smack(); ArenaSound.tone({ f0: 1320, f1: 1320, dur: 0.12, type: 'square', gain: 0.12 });
        st.flash('#fff', 0.3); st.shake(s.kind === 'head' ? 11 : 7, 0.28);
        st.ring(hx, hy, i === 0 ? '#4dc9ff' : '#ff6b6b', 100, 0.45, 6); st.sparks(hx, hy, i === 0 ? '#8fd8ff' : '#ffb3b3', 26, 480);
        if (s.kind === 'head') st.slowmo(0.3, 0.28);
        v.wobble = 1; v.squash = 0.8; v.lungeTarget = -v.height * 0.08;
        this.later(() => { v.lungeTarget = 0; }, 350);
        st.text(hx, hy - 40, `+${pts}`, { color: i === 0 ? '#6ec8ff' : '#ff8a8a', size: 44 });
        st.text(st.W / 2, st.H * 0.3, `${rt.toFixed(2)}s`, { color: '#ffe68a', size: 16, rise: 18 });
      });
    } else {
      this.score[other] += 1; this.pop = { i: other, t: 1 };
      ArenaSound.buzz(); TKD.gs()?.playSound('error');
      this.F[i].wobble = 0.8;
      st.text(st.W / 2, st.H * 0.32, s.kind === 'leg' ? TKD.t('⚠️ Gam-jeom — below the belt! +1 ⟶', '⚠️ گام-جوم — تحت الحزام! +١ للتاني') : TKD.t('🛡️ It was covered! +1 ⟶', '🛡️ كان متغطي! +١ للتاني'), { color: '#ff9f9f', size: 22, ttl: 1.5, rise: 12 });
    }
    this.later(() => this.nextExchange(), 1300);
  },
  kick(i, onHit) {
    const f = this.F[i], o = this.F[1 - i], dir = i === 0 ? 1 : -1;
    const sp = f.strikePoint(2);
    const baseX = sp.x - f.lunge * dir;
    const target = o.footScreenX() - dir * o.height * 0.1;
    const reach = AG.clamp((target - baseX) * dir, 0, this.stage.W * 0.45);
    ArenaSound.whoosh();
    f.play([
      { pose: 0, hold: 0.04 },
      { pose: 1, hold: 0.12, fade: 0.06, lunge: reach * 0.85 },
      { pose: 2, hold: 0.08, fade: 0.05, lunge: reach },
      { pose: 2, hold: 0.2, fade: 0, ghost: false, hit: onHit },
      { pose: 3, hold: 0.12, fade: 0.07, lunge: reach * 0.4 },
      { pose: 4, hold: 0.14, fade: 0.1, lunge: 0 },
      { pose: 0, hold: 0.05, fade: 0.18 }
    ]);
  },
  update(dt) {
    this.F?.forEach(f => f.update(dt));
    // the two big buttons say what to do right now
    const pads = document.getElementById('vs-pads');
    if (pads && pads.dataset.state !== this.state) {
      pads.dataset.state = this.state;
      pads.querySelectorAll('.vs-pad').forEach((b, i) => {
        const hint = b.querySelector('.vs-hint');
        if (hint) hint.textContent = this.state === 'open' ? TKD.t('Legal target? KICK!', 'هدف صح؟ اركل!') : this.state === 'wait' ? TKD.t('wait for the board…', 'استنى اللوحة…') : '';
      });
    }
    if (this.state === 'open' && this.signal && this.stage.time - this.signal.born > 2.0) {
      this.state = 'resolving';
      const st = this.stage;
      st.text(st.W / 2, st.H * 0.32, this.signal.valid ? TKD.t('⏰ Nobody kicked!', '⏰ محدش ركل!') : TKD.t('👀 Both read it right!', '👀 الاتنين قروها صح!'), { color: '#ffe68a', size: 22, ttl: 1.3, rise: 10 });
      this.later(() => this.nextExchange(), 1100);
    }
    if (this.pop) { this.pop.t -= dt * 2; if (this.pop.t <= 0) this.pop = null; }
  },
  draw(c, W, H) {
    this.F?.forEach(f => f.draw(c));
    // scoreboard
    const w = Math.min(420, W * 0.7), h = 56, x = (W - w) / 2, y = 10, half = (w - 8) / 2;
    c.save();
    c.fillStyle = 'rgba(5,10,16,0.85)'; c.beginPath(); c.roundRect(x - 4, y - 4, w + 8, h + 8, 14); c.fill();
    (this.P || []).forEach((p, i) => {
      const bx = x + i * (half + 8), g = c.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, i ? '#d12a37' : '#1f5fd1'); g.addColorStop(1, i ? '#7d1720' : '#123a80');
      c.fillStyle = g; c.beginPath(); c.roundRect(bx, y, half, h, 10); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.9)'; c.font = '800 12px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText(p.name, bx + half / 2, y + 5);
      const s = this.pop?.i === i ? 1 + this.pop.t * 0.3 : 1;
      c.save(); c.translate(bx + half / 2, y + 36); c.scale(s, s);
      c.font = '900 26px "Roboto Mono", Roboto, monospace'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(String(this.score[i]), 0, 0); c.restore();
    });
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.font = '700 12px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
    c.fillText(this.golden ? TKD.t('⭐ golden point', '⭐ النقطة الدهبية') : TKD.t(`exchange ${Math.max(1, this.ex)} / ${this.MAX_EX} · first to ${this.WIN_POINTS}`, `جولة ${Math.max(1, this.ex)} / ${this.MAX_EX} · أول واحد يوصل ${this.WIN_POINTS}`), W / 2, y + h + 10);
    c.restore();
    // referee board
    const cx = W / 2, cy = H * 0.42;
    c.save();
    if (this.state === 'open' && this.signal) {
      const L = this.LABEL[this.signal.kind];
      const age = this.stage.time - this.signal.born, pop = AG.easeOutBack(AG.clamp(age / 0.18, 0, 1));
      const left = 1 - AG.clamp(age / 2, 0, 1);
      c.translate(cx, cy); c.scale(pop, pop);
      c.fillStyle = 'rgba(10,16,22,0.88)'; c.strokeStyle = '#ffd166'; c.lineWidth = 3;
      c.beginPath(); c.roundRect(-92, -46, 184, 92, 18); c.fill(); c.stroke();
      c.font = '34px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(L.icon, 0, -14);
      c.font = '900 22px Cairo, Roboto, sans-serif'; c.fillStyle = '#ffd166'; c.fillText(TKD.ar ? L.ar : L.en, 0, 22);
      c.fillStyle = left < 0.3 ? '#ff6b6b' : '#fff'; c.fillRect(-80, 38, 160 * left, 4);
    } else if (this.state === 'wait') {
      c.globalAlpha = 0.6 + 0.2 * Math.sin(this.stage.time * 6);
      c.font = '800 18px Cairo, Roboto, sans-serif'; c.fillStyle = '#fff'; c.textAlign = 'center';
      c.fillText(TKD.t('Ready…', 'استعدوا…'), cx, cy);
    }
    c.restore();
  },
  endMatch() {
    this.over = true; this.state = 'done';
    const [a, b] = this.score, wi = a > b ? 0 : 1, W = this.P[wi], L = this.P[1 - wi];
    const st = this.stage;
    st.confetti(wi === 0 ? st.W * 0.28 : st.W * 0.72, st.H * 0.3, 70);
    TKD.gs()?.playSound('win');
    this.F[wi].setPose(2, 0.1); this.F[1 - wi].wobble = 1;
    const d = this.load();
    d.matches.push({ ts: Date.now(), p1: { id: this.P[0].id, name: this.P[0].name }, p2: { id: this.P[1].id, name: this.P[1].name }, s1: a, s2: b, winner: W.id, kick: this.skill, tid: this.tourMatch ? this.tour()?.id : null });
    d.matches = d.matches.slice(-500);
    this.save(d);
    const inTour = !!this.tourMatch;
    if (inTour) this.finishTourMatch(W.id);
    const t = this.tour();
    const ui = TKD.$('vs-ui');
    this.later(() => {
      if (!ui) return;
      ui.innerHTML = `<div class="ag-card ag-center vs-result">
        <div class="vs-result-av">${TKD.avatar(W, 'lg')}</div>
        <div class="ag-big">🏆 ${TKD.esc(W.name)}</div>
        <p>${TKD.num(a)} – ${TKD.num(b)} · ${TKD.t(`well played, ${TKD.esc(L.name)}!`, `لعبت حلو يا ${TKD.esc(L.name)}!`)}</p>
        ${inTour && t?.done ? `<p class="vs-champ-line">👑 ${TKD.t('Tournament champion!', 'بطل البطولة!')}</p>` : ''}
        <div class="tkd-row wrap">
          ${inTour ? `<button type="button" class="btn btn-success" id="vs-r-bracket">👑 ${TKD.t('Back to the bracket', 'رجوع للبطولة')}</button>`
            : `<button type="button" class="btn btn-success" id="vs-r-again">🔁 ${TKD.t('Rematch', 'ماتش تاني')}</button><button type="button" class="btn" id="vs-r-setup">⚙️ ${TKD.t('Change players', 'غيّر اللاعبين')}</button>`}
        </div></div>`;
      TKD.$('vs-r-again')?.addEventListener('click', () => this.startMatch(this.P[0], this.P[1], this.skill));
      TKD.$('vs-r-setup')?.addEventListener('click', () => { this.teardown(); this.renderSetup(); });
      TKD.$('vs-r-bracket')?.addEventListener('click', () => { this.teardown(); this.renderSetup(); });
    }, 1400);
  }
};
window.Versus = Versus;
// the arena registry tears the duel down when leaving the screen
if (window.ArenaGames) ArenaGames.byScreen.versus = { initialize: () => {}, teardown: () => Versus.teardown(), refresh: () => Versus.refresh() };

// v27.1: leaving the duel screen (menu, home…) stops the match cleanly
document.addEventListener('tkd:screen', (e) => {
  if (e.detail?.previousScreen === 'versus' && e.detail.screenId !== 'versus' && Versus.view === 'match') { Versus.teardown(); Versus.view = 'setup'; }
});
