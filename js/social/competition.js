/* =====================================================================
   TAEKWONDO JOURNEY — PLAYERS, CHALLENGES & COMPETITION (v23)
   Everything works offline on one device (localStorage):

     StartScreen    "who's training?" — one screen: pick your card or add a
                    new player (name + boy/girl); language auto-detected
     HomeHub        big "let's train" button + today's challenge + league
     TKDDifficulty  easy / normal / hard for the arena games, auto-easier
                    after two misses in a row
     TKDHints       animated first-time hint per game + read-aloud buttons
     Challenge      one game + kick per day, same for everyone, 3 counted tries
     League         weekly points → tiers (bronze … champions), promotion,
                    weekly awards (champion, most improved, warm-up king)
     Certificates   printable PNG certificates for awards
     Coach          PIN-protected coach panel (players, stages, resets,
                    who needs help, QR cards import, settings)

   Loaded after game.js / games-arena*.js / dashboard.js.
   ===================================================================== */
'use strict';

const TKD = {
  gs: () => (typeof GameStateInstance !== 'undefined' ? GameStateInstance : null),
  get ar() { return this.gs()?.currentLanguage === 'ar'; },
  t(en, ar) { return this.ar ? ar : en; },
  esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
  $(id) { return document.getElementById(id); },
  read(key, fb) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch (e) { return fb; } },
  write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} },
  pid() { return PlayerSystem.getCurrentPlayerId(); },
  dayKey(d = new Date()) { d = new Date(d); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
  // Egyptian week: Saturday → Friday
  weekStart(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 1) % 7)); return x; },
  weekKey(d = new Date()) { return this.dayKey(this.weekStart(d)); },
  addDays(key, n) { const d = new Date(key + 'T00:00:00'); d.setDate(d.getDate() + n); return this.dayKey(d); },
  num(n) { return this.ar ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n); },
  avatar(p, cls = '') {
    const ch = p?.character === 'girl' ? 'girl' : 'boy';
    const src = ch === 'girl' ? 'assets/images/characters/girl_char/girl_idle.webp' : 'assets/images/characters/boy_char/boy_idle.webp';
    return `<span class="tkd-avatar ${cls}" data-ch="${ch}"><img src="${src}" alt="" loading="lazy"></span>`;
  },
  skillName(id) { const s = GameConfig.SKILLS[id]; return s ? (this.ar ? s.name.ar : s.name.en).replace(/\s*\(.*\)$/, '') : id; },
  gameName(id) { const g = window.DashboardSystem?.GAMES?.[id]; return g ? (this.ar ? g.ar : g.en) : id; },
  gameIcon(id) { return window.DashboardSystem?.GAMES?.[id]?.icon || '🎮'; },
  toast(msg, type = 'info') { this.gs()?.showNotification(msg, type); },
  speak(text) { if (this.gs()?.soundEnabled !== false) SpeechHelper.speak(text, this.ar ? 'ar-EG' : 'en-US'); },
  hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
};
window.TKD = TKD;

// =====================================================================
// DIFFICULTY
// =====================================================================
const TKDDifficulty = {
  LEVELS: {
    easy:   { level: 'easy',   speed: 0.78, window: 1.4,  tol: 1.35, icon: '🐣', en: 'Easy',   ar: 'سهل' },
    normal: { level: 'normal', speed: 1,    window: 1,    tol: 1,    icon: '🥋', en: 'Normal', ar: 'عادي' },
    hard:   { level: 'hard',   speed: 1.22, window: 0.78, tol: 0.8,  icon: '🔥', en: 'Hard',   ar: 'صعب' }
  },
  key() { return `taekwondoJourneyDiff:${TKD.pid() || 'guest'}`; },
  load() { return TKD.read(this.key(), { levels: {}, fails: {} }); },
  get(gameId) { return this.load().levels[gameId] || 'normal'; },
  set(gameId, level) { const d = this.load(); d.levels[gameId] = level; d.fails[gameId] = 0; TKD.write(this.key(), d); },
  locked(gameId) { return Challenge.active && Challenge.active.gameId === gameId; },
  factors(gameId) { return this.LEVELS[this.locked(gameId) ? 'normal' : this.get(gameId)] || this.LEVELS.normal; },
  // two misses in a row → one step easier (never during the daily challenge)
  onResult(gameId, acc) {
    if (this.locked(gameId)) return;
    const d = this.load();
    if (acc >= GameConfig.SETTINGS.PASSING_SCORE) { d.fails[gameId] = 0; TKD.write(this.key(), d); return; }
    d.fails[gameId] = (d.fails[gameId] || 0) + 1;
    const cur = d.levels[gameId] || 'normal';
    if (d.fails[gameId] >= 2 && cur !== 'easy') {
      d.levels[gameId] = cur === 'hard' ? 'normal' : 'easy';
      d.fails[gameId] = 0;
      setTimeout(() => TKD.toast(TKD.t('💪 We made it a little easier — you can switch back any time.', '💪 خليناها أسهل شوية — تقدر ترجّعها في أي وقت.'), 'info'), 1600);
    }
    TKD.write(this.key(), d);
  },
  mountPicker(G) {
    const hud = TKD.$(`${G.PREFIX}-round`)?.parentElement;
    if (!hud) return;
    let box = hud.querySelector('.tkd-diff');
    if (!box) { box = document.createElement('div'); box.className = 'tkd-diff'; box.setAttribute('role', 'radiogroup'); hud.appendChild(box); }
    if (this.locked(G.GAME_ID)) {
      box.innerHTML = `<span class="tkd-diff-lock">🏆 ${TKD.t('Daily challenge · Normal', 'تحدي النهارده · عادي')}</span>`;
      return;
    }
    const cur = this.get(G.GAME_ID);
    box.innerHTML = Object.values(this.LEVELS).map(L => `<button type="button" role="radio" aria-checked="${L.level === cur}" class="${L.level === cur ? 'on' : ''}" data-l="${L.level}">${L.icon} ${TKD.ar ? L.ar : L.en}</button>`).join('');
    box.querySelectorAll('button').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (b.dataset.l === this.get(G.GAME_ID)) return;
      this.set(G.GAME_ID, b.dataset.l);
      TKD.gs()?.playSound('click');
      G.initialize(TKD.gs());
    }));
  }
};
window.TKDDifficulty = TKDDifficulty;

// per-game difficulty hooks (called from ArenaGameBase.initialize)
(function wireDifficulty() {
  const base = (G, name, v) => { if (!G['_base_' + name]) G['_base_' + name] = JSON.parse(JSON.stringify(v)); return JSON.parse(JSON.stringify(G['_base_' + name])); };
  if (typeof BoardBreakGame !== 'undefined') BoardBreakGame.applyDifficulty = function (D) {
    this.ROUNDS = base(this, 'ROUNDS', this.ROUNDS).map(r => ({ ...r, aimSpeed: r.aimSpeed * D.speed, powerSpeed: r.powerSpeed * D.speed, zone: Math.min(0.3, r.zone * D.tol) }));
  };
  if (typeof PaddleReflexGame !== 'undefined') {
    const orig = PaddleReflexGame.nextRound;
    PaddleReflexGame.nextRound = function () { orig.call(this); if (this.life && this.D) this.life *= this.D.window; };
  }
  if (typeof PhaseRhythmGame !== 'undefined') PhaseRhythmGame.applyDifficulty = function (D) {
    this.COMBOS = base(this, 'COMBOS', this.COMBOS).map(b => Math.round(b * D.speed));
    const w = base(this, 'WIN', this.WIN); this.WIN = Object.fromEntries(Object.entries(w).map(([k, v]) => [k, v * D.tol]));
  };
  if (typeof SparringDuelGame !== 'undefined') {
    const orig = SparringDuelGame.openTarget;
    SparringDuelGame.openTarget = function () { orig.call(this); if (this.window && this.D) this.window *= this.D.window; };
  }
  if (typeof BalanceHoldGame !== 'undefined') BalanceHoldGame.applyDifficulty = function (D) {
    this.ROUNDS = base(this, 'ROUNDS', this.ROUNDS).map(r => ({ ...r, drift: r.drift * D.speed, gust: r.gust * D.speed }));
    this.GREEN = 0.1 * D.tol; this.YELLOW = 0.22 * D.tol;
  };
  if (typeof HeavyBagGame !== 'undefined') HeavyBagGame.applyDifficulty = function (D) { this.TOL = D.tol; this.PUSH = D.speed; this.ASSIST_ROUNDS = D.level === 'easy' ? 99 : D.level === 'hard' ? 0 : 3; };
})();

// =====================================================================
// FIRST-TIME HINTS + READ-ALOUD
// =====================================================================
const TKDHints = {
  // target: selector of the element the hand points at
  LIST: {
    'warmup':        { target: '#wu2-media', en: 'Copy the video until the timer runs out', ar: 'اعمل زي اللي في الفيديو لحد ما العداد يخلص' },
    'learning':      { target: '#learning-screen .game-container', en: 'Look at each step, then watch the video', ar: 'بص على كل خطوة، وبعدين اتفرج على الفيديو' },
    'form-control':  { target: '#form-control-screen .game-container', en: 'Drag the coloured dots to fix the pose', ar: 'اسحب النقط الملونة عشان تظبط الوضعية' },
    'puzzle':        { target: '#puzzle-screen .game-container', en: 'Drag the pieces into the right order', ar: 'اسحب القطع ورتّبها صح' },
    'performance':   { target: '#performance-screen .game-container', en: 'Tap the picture that is done right', ar: 'دوس على الصورة اللي معمولة صح' },
    'action':        { target: '#action-screen .game-container', en: 'Follow the arrow and tap at the right moment', ar: 'امشي ورا السهم ودوس في الوقت الصح' },
    'error-hunt':    { target: '#eh-board', en: 'Tap where the mistake is', ar: 'دوس على مكان الغلطة' },
    'quiz-blast':    { target: '#qb-arena', en: 'Move and shoot the right answer', ar: 'اتحرك واضرب الإجابة الصح' },
    'quiz':          { target: '#quiz-screen .game-container', en: 'Choose the right answer', ar: 'اختار الإجابة الصح' },
    'board-break':   { target: '#bb-wrap', en: 'Pick the foot part, then tap when the target is in the middle', ar: 'اختار جزء القدم، وبعدين دوس لما النيشان يبقى في النص' },
    'paddle-reflex': { target: '#pr-wrap', en: 'Tap only the paddle at the right target — fast!', ar: 'دوس بس على المضرب اللي عند الهدف الصح — بسرعة!' },
    'phase-rhythm':  { target: '#rh-pads', en: 'Tap the matching number when the note hits the line', ar: 'دوس على الرقم لما النوتة توصل للخط' },
    'sparring-duel': { target: '#sd-wrap', en: 'Tap when a good target lights up — wait on traps!', ar: 'دوس لما هدف صح ينوّر — واستنى لو فخ!' },
    'balance-hold':  { target: '#bh-pads', en: 'Hold ◀ or ▶ to keep the needle in the green', ar: 'دوس ◀ أو ▶ عشان المؤشر يفضل في الأخضر' },
    'heavy-bag':     { target: '#hb-wrap', en: 'Tap when the bag swings back to you', ar: 'دوس لما الكيس يرجع ناحيتك' },
    'versus':        { target: '#vs-wrap', en: 'Each player taps their own side when a good target shows', ar: 'كل لاعب يدوس على ناحيته لما يظهر هدف صح' }
  },
  key() { return `taekwondoJourneyHints:${TKD.pid() || 'guest'}`; },
  seen(id) { return (TKD.read(this.key(), [])).includes(id); },
  mark(id) { const l = TKD.read(this.key(), []); if (!l.includes(id)) { l.push(id); TKD.write(this.key(), l); } },
  maybeShow(screenId) {
    if (!this.LIST[screenId] || this.seen(screenId)) return;
    setTimeout(() => { if (document.querySelector('.screen.active')?.id === `${screenId}-screen`) this.show(screenId); }, 700);
  },
  show(screenId) {
    const h = this.LIST[screenId]; if (!h) return;
    this.hide();
    const target = document.querySelector(h.target) || document.querySelector(`#${screenId}-screen .game-container`);
    if (!target) return;
    const r = target.getBoundingClientRect();
    const ov = document.createElement('div');
    ov.className = 'tkd-hint';
    ov.setAttribute('role', 'dialog');
    const text = TKD.ar ? h.ar : h.en;
    const cx = Math.max(60, Math.min(window.innerWidth - 60, r.left + r.width / 2));
    const cy = Math.max(120, Math.min(window.innerHeight - 90, r.top + Math.min(r.height, window.innerHeight) / 2));
    ov.innerHTML = `<div class="tkd-hint-hand" style="left:${cx}px;top:${cy}px" aria-hidden="true"><span class="tkd-hint-ripple"></span>👆</div>
      <div class="tkd-hint-bubble" style="top:${Math.min(window.innerHeight - 150, cy + 70)}px">
        <p>${TKD.esc(text)}</p>
        <div><button type="button" class="btn btn-small tkd-hint-say">🔊</button><button type="button" class="btn btn-success btn-small tkd-hint-ok">${TKD.t('Got it 👍', 'فهمت 👍')}</button></div>
      </div>`;
    document.body.appendChild(ov);
    const close = () => { this.mark(screenId); this.hide(); };
    ov.querySelector('.tkd-hint-ok').addEventListener('click', close);
    ov.querySelector('.tkd-hint-say').addEventListener('click', () => TKD.speak(text));
    // v27.1: the hint never swallows a tap — the page stays playable underneath and
    // the first tap / key press anywhere else just closes it
    this._away = (e) => { if (!e.target.closest?.('.tkd-hint-bubble')) close(); };
    document.addEventListener('pointerdown', this._away, true);
    document.addEventListener('keydown', this._away, true);
    this._timer = setTimeout(close, 6000);
    TKD.speak(text);
  },
  hide() {
    clearTimeout(this._timer); document.querySelectorAll('.tkd-hint').forEach(n => n.remove());
    if (this._away) { document.removeEventListener('pointerdown', this._away, true); document.removeEventListener('keydown', this._away, true); this._away = null; }
  },
  // 🔊 on every instructions paragraph + 💡 to replay the hint
  mountReadAloud() {
    document.querySelectorAll('.screen .description, #warmup-ex-desc').forEach(p => {
      if (p.dataset.tkdSay) return;
      p.dataset.tkdSay = '1';
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'tkd-say'; b.innerHTML = '🔊';
      b.setAttribute('aria-label', 'Read aloud');
      b.addEventListener('click', (e) => { e.stopPropagation(); TKD.speak(p.textContent.replace('🔊', '').replace('💡', '').trim()); });
      p.appendChild(b);
      const scr = p.closest('.screen')?.id?.replace(/-screen$/, '');
      if (scr && this.LIST[scr]) {
        const hb = document.createElement('button');
        hb.type = 'button'; hb.className = 'tkd-say'; hb.innerHTML = '💡';
        hb.setAttribute('aria-label', 'Show hint');
        hb.addEventListener('click', (e) => { e.stopPropagation(); this.show(scr); });
        p.appendChild(hb);
      }
    });
  }
};
window.TKDHints = TKDHints;

// =====================================================================
// DAILY CHALLENGE
// =====================================================================
const Challenge = {
  GAMES: ['board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag'],
  active: null,
  settings() { return League.settings(); },
  today(day = TKD.dayKey()) {
    const h = TKD.hash('tkd-challenge-' + day);
    return { day, gameId: this.GAMES[h % this.GAMES.length], skillId: GameConfig.SKILL_ORDER[(h >>> 7) % GameConfig.SKILL_ORDER.length] };
  },
  attemptsFor(pid, day = TKD.dayKey()) {
    return PlayerSystem.getAttempts().filter(a => a.playerId === pid && a.meta?.challenge === day);
  },
  triesLeft(pid = TKD.pid(), day = TKD.dayKey()) { return Math.max(0, this.settings().tries - this.attemptsFor(pid, day).length); },
  best(pid, day = TKD.dayKey()) { const l = this.attemptsFor(pid, day); return l.length ? Math.max(...l.map(a => a.score)) : null; },
  ranking(day = TKD.dayKey()) {
    const by = {};
    PlayerSystem.getAttempts().forEach(a => {
      if (a.meta?.challenge !== day) return;
      const b = by[a.playerId];
      if (!b || a.score > b.score || (a.score === b.score && a.ts < b.ts)) by[a.playerId] = { pid: a.playerId, name: a.playerName, score: a.score, ts: a.ts };
    });
    return Object.values(by).sort((x, y) => y.score - x.score || x.ts - y.ts);
  },
  start() {
    const gs = TKD.gs(); if (!gs) return;
    const c = this.today();
    this.active = { ...c, date: c.day, prevSkill: gs.currentSkill };
    gs.currentSkill = c.skillId;
    if (!this.triesLeft()) TKD.toast(TKD.t('No counted tries left today — this one is practice only.', 'خلصت محاولاتك المحسوبة النهارده — دي تمرين بس.'), 'warning');
    switchScreen(c.gameId);
  },
  end() {
    if (!this.active) return;
    const gs = TKD.gs();
    if (gs && this.active.prevSkill) { gs.currentSkill = this.active.prevSkill; gs.syncFlatProgressToCurrentSkill(); gs.saveToStorage(); }
    this.active = null;
  },
  // tag attempts made during the challenge (only the first N of the day count)
  wrapLogging() {
    const orig = PlayerSystem.logAttempt.bind(PlayerSystem);
    PlayerSystem.logAttempt = (gameId, skillId, score, passed, meta = null) => {
      const c = this.active;
      if (c && c.gameId === gameId && TKD.pid()) {
        const counted = this.triesLeft() > 0;
        meta = { ...(meta || {}), ...(counted ? { challenge: c.date } : { challengePractice: c.date }) };
        orig(gameId, skillId, score, passed, meta);
        if (counted) setTimeout(() => this.announce(score), 1200);
        return;
      }
      orig(gameId, skillId, score, passed, meta);
    };
  },
  announce(score) {
    const rank = this.ranking().findIndex(r => r.pid === TKD.pid()) + 1;
    const left = this.triesLeft();
    TKD.toast(TKD.t(`🏆 Challenge: ${score}% · you are #${rank} today · ${left} ${left === 1 ? 'try' : 'tries'} left`,
      `🏆 التحدي: ${score}% · ترتيبك #${rank} النهارده · فاضل ${left} ${left === 1 ? 'محاولة' : 'محاولات'}`), 'success');
  }
};
window.Challenge = Challenge;

// =====================================================================
// WEEKLY LEAGUE + AWARDS
// =====================================================================
const League = {
  KEY: 'taekwondoJourneyLeague',
  TIERS: [
    { icon: '🥉', en: 'Bronze League', ar: 'دوري البرونز', color: '#c08457' },
    { icon: '🥈', en: 'Silver League', ar: 'دوري الفضة', color: '#aab4be' },
    { icon: '🥇', en: 'Gold League', ar: 'الدوري الدهبي', color: '#e9c46a' },
    { icon: '💎', en: 'Diamond League', ar: 'دوري الألماظ', color: '#6ec8ff' },
    { icon: '👑', en: 'Champions League', ar: 'دوري الأبطال', color: '#ff9f6b' }
  ],
  AWARDS: {
    'week-champion':  { icon: '🏆', en: 'Champion of the Week', ar: 'بطل الأسبوع' },
    'most-improved':  { icon: '📈', en: 'Most Improved', ar: 'أكتر واحد اتحسّن' },
    'warmup-king':    { icon: '🔥', en: 'Warm-up King', ar: 'ملك الإحماء' },
    'promoted':       { icon: '⬆️', en: 'Promoted', ar: 'طلع دوري أعلى' },
    'tournament-champion': { icon: '👑', en: 'Tournament Champion', ar: 'بطل البطولة' }
  },
  load() { return TKD.read(this.KEY, { processedWeek: null, history: [], settings: {} }); },
  save(st) { TKD.write(this.KEY, st); },
  settings() { const s = this.load().settings || {}; return { tries: s.tries || 3, promote: s.promote || 3, minPoints: s.minPoints ?? 150, medals: s.medals || 'normal' }; },
  tierOf(p) { return Math.max(0, Math.min(this.TIERS.length - 1, p?.tier || 0)); },
  tierName(i) { const t = this.TIERS[i]; return TKD.ar ? t.ar : t.en; },

  // points for one week: best counted challenge score per day + 20 per warm-up day + 10 per training day
  pointsFor(pid, week = TKD.weekKey()) {
    const end = TKD.addDays(week, 7);
    const att = PlayerSystem.getAttempts().filter(a => a.playerId === pid && TKD.dayKey(a.ts) >= week && TKD.dayKey(a.ts) < end);
    const bestPerDay = {}, warm = new Set(), train = new Set();
    att.forEach(a => {
      const d = TKD.dayKey(a.ts);
      train.add(d);
      if (a.gameId === 'warmup') warm.add(d);
      if (a.meta?.challenge) bestPerDay[a.meta.challenge] = Math.max(bestPerDay[a.meta.challenge] || 0, a.score);
    });
    const challenge = Object.values(bestPerDay).reduce((s, v) => s + v, 0);
    return { total: challenge + warm.size * 20 + train.size * 10, challenge, warmDays: warm.size, trainDays: train.size, challengeDays: Object.keys(bestPerDay).length };
  },
  table(week = TKD.weekKey()) {
    return PlayerSystem.getPlayers().map(p => ({ p, tier: this.tierOf(p), ...this.pointsFor(p.id, week) }))
      .sort((a, b) => b.total - a.total || a.p.name.localeCompare(b.p.name));
  },
  daysLeft() { return Math.max(1, Math.round((new Date(TKD.addDays(TKD.weekKey(), 7) + 'T00:00:00') - new Date()) / 864e5)); },

  // run once per new week: promote, give awards, remember celebrations
  process() {
    const st = this.load();
    const cur = TKD.weekKey();
    if (!st.processedWeek) { st.processedWeek = cur; this.save(st); return; }
    if (st.processedWeek === cur) return;
    const week = st.processedWeek;
    const set = this.settings();
    const players = PlayerSystem.getPlayers();
    const rows = players.map(p => ({ p, tier: this.tierOf(p), ...this.pointsFor(p.id, week), prev: this.pointsFor(p.id, TKD.addDays(week, -7)).total }));
    const results = [];
    const awards = {};
    const give = (pid, id) => {
      const pl = PlayerSystem.getPlayers().find(x => x.id === pid); if (!pl) return;
      const badges = pl.badges || []; badges.push({ id, week });
      const pending = pl.pending || []; pending.push({ id, week });
      PlayerSystem.updatePlayer(pid, { badges, pending });
    };
    this.TIERS.forEach((_, ti) => {
      const inTier = rows.filter(r => r.tier === ti).sort((a, b) => b.total - a.total);
      inTier.forEach((r, i) => {
        const promoted = i < set.promote && r.total >= set.minPoints && ti < this.TIERS.length - 1;
        results.push({ pid: r.p.id, name: r.p.name, tier: ti, points: r.total, rank: i + 1, promoted });
        if (promoted) { PlayerSystem.updatePlayer(r.p.id, { tier: ti + 1 }); give(r.p.id, 'promoted'); }
      });
    });
    const active = rows.filter(r => r.total > 0);
    if (active.length) {
      const champ = [...active].sort((a, b) => b.total - a.total)[0];
      awards['week-champion'] = champ.p.id; give(champ.p.id, 'week-champion');
      const imp = [...active].filter(r => r.total - r.prev > 0 && r.prev > 0).sort((a, b) => (b.total - b.prev) - (a.total - a.prev))[0];
      if (imp) { awards['most-improved'] = imp.p.id; give(imp.p.id, 'most-improved'); }
      const wk = [...active].filter(r => r.warmDays >= 2).sort((a, b) => b.warmDays - a.warmDays)[0];
      if (wk) { awards['warmup-king'] = wk.p.id; give(wk.p.id, 'warmup-king'); }
    }
    st.history = [{ week, results, awards }, ...(st.history || [])].slice(0, 12);
    st.processedWeek = cur;
    this.save(st);
  },
  awardName(id) { const a = this.AWARDS[id]; return a ? `${a.icon} ${TKD.ar ? a.ar : a.en}` : id; },

  // celebration for the signed-in player (awards they haven't seen yet)
  celebratePending() {
    const p = PlayerSystem.getCurrentPlayer(); if (!p || !(p.pending || []).length) return;
    const items = p.pending;
    PlayerSystem.updatePlayer(p.id, { pending: [] });
    const ov = document.createElement('div');
    ov.className = 'tkd-modal';
    ov.innerHTML = `<div class="tkd-modal-card tkd-celebrate">
      <div class="tkd-celebrate-burst">🎉</div>
      <h2>${TKD.t(`Well done, ${TKD.esc(p.name)}!`, `برافو يا ${TKD.esc(p.name)}!`)}</h2>
      <ul>${items.map(it => `<li><b>${this.awardName(it.id)}</b>${it.id === 'promoted' ? ` → ${this.TIERS[this.tierOf(p)].icon} ${this.tierName(this.tierOf(p))}` : ''}
        ${it.id !== 'promoted' ? `<button type="button" class="btn btn-small" data-cert="${it.id}" data-week="${it.week || ''}">📜 ${TKD.t('Certificate', 'الشهادة')}</button>` : ''}</li>`).join('')}</ul>
      <button type="button" class="btn btn-success tkd-close">${TKD.t('Yay! 🎊', 'هييييه! 🎊')}</button></div>`;
    document.body.appendChild(ov);
    TKD.gs()?.playSound('win');
    ov.querySelector('.tkd-close').addEventListener('click', () => ov.remove());
    ov.querySelectorAll('[data-cert]').forEach(b => b.addEventListener('click', () => Certificates.award(p, b.dataset.cert, b.dataset.week)));
  }
};
window.League = League;

// =====================================================================
// CERTIFICATES (PNG, drawn on a canvas — works offline)
// =====================================================================
const Certificates = {
  award(player, awardId, week) {
    const a = League.AWARDS[awardId] || { icon: '🏅', en: awardId, ar: awardId };
    const when = week ? TKD.t(`Week of ${week}`, `أسبوع ${week}`) : TKD.dayKey();
    this.draw({ icon: a.icon, title: TKD.ar ? a.ar : a.en, name: player.name, line: TKD.t('Taekwondo Journey', 'رحلة التايكوندو'), date: when });
  },
  draw({ icon, title, name, line, date }) {
    const W = 1600, H = 1130, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#fffaf0'); bg.addColorStop(1, '#fdf0d5');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#b8860b'; g.lineWidth = 18; g.strokeRect(40, 40, W - 80, H - 80);
    g.strokeStyle = '#1d3557'; g.lineWidth = 4; g.strokeRect(78, 78, W - 156, H - 156);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = TKD.ar ? 'rtl' : 'ltr';
    g.font = '150px system-ui, "Segoe UI Emoji", sans-serif'; g.fillText(icon, W / 2, 250);
    g.fillStyle = '#1d3557'; g.font = '800 46px Cairo, Roboto, sans-serif'; g.fillText(TKD.t('CERTIFICATE', 'شهادة تقدير'), W / 2, 390);
    g.fillStyle = '#c1121f'; g.font = '900 88px Cairo, Roboto, sans-serif'; g.fillText(title, W / 2, 500);
    g.fillStyle = '#555'; g.font = '500 40px Cairo, Roboto, sans-serif'; g.fillText(TKD.t('proudly presented to', 'بكل فخر لـ'), W / 2, 610);
    g.fillStyle = '#111'; g.font = '900 110px Cairo, Roboto, sans-serif'; g.fillText(name, W / 2, 730);
    g.strokeStyle = '#b8860b'; g.lineWidth = 3; g.beginPath(); g.moveTo(W / 2 - 380, 800); g.lineTo(W / 2 + 380, 800); g.stroke();
    g.fillStyle = '#1d3557'; g.font = '700 44px Cairo, Roboto, sans-serif'; g.fillText(`🥋 ${line}`, W / 2, 880);
    g.fillStyle = '#666'; g.font = '500 34px Cairo, Roboto, sans-serif'; g.fillText(date, W / 2, 950);
    c.toBlob(b => {
      const url = URL.createObjectURL(b); const l = document.createElement('a');
      l.href = url; l.download = `certificate-${String(name).replace(/[^\w؀-ۿ-]+/g, '_')}.png`;
      document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000);
    });
    TKD.toast(TKD.t('📜 Certificate downloaded', '📜 الشهادة اتنزلت'), 'success');
  }
};
window.Certificates = Certificates;

// =====================================================================
// START SCREEN — "who's training?"
// =====================================================================
const StartScreen = {
  show(mode = 'pick') {
    const el = TKD.$('start-screen'); if (!el) return;
    const gs = TKD.gs();
    // first run on this device: language from the browser
    // first visit on this device (no language picked yet, nobody registered): follow the browser
    if (!localStorage.getItem('taekwondoJourneyLangChosen') && !PlayerSystem.getPlayers().length) {
      const lang = (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
      gs.setLanguage(lang);
      try { localStorage.setItem('taekwondoJourneyLangChosen', 'auto'); } catch (e) {}
    } else gs.setLanguage(gs.currentLanguage);
    ScreenManagerInstance?.hideModals();
    el.hidden = false;
    document.body.classList.add('start-open');
    this.mode = PlayerSystem.getPlayers().length ? mode : 'new';
    this.newChar = this.newChar || 'boy';
    this.render();
  },
  hide() { const el = TKD.$('start-screen'); if (el) el.hidden = true; document.body.classList.remove('start-open'); },
  render() {
    const el = TKD.$('start-screen'); if (!el) return;
    const ar = TKD.ar;
    const players = PlayerSystem.getPlayers().map(p => {
      const last = PlayerSystem.getAttempts().filter(a => a.playerId === p.id).reduce((m, a) => Math.max(m, a.ts), p.createdAt || 0);
      return { p, last };
    }).sort((a, b) => b.last - a.last);
    const langBar = `<div class="ss-lang" role="group" aria-label="Language">
        <button type="button" data-lang="ar" class="${ar ? 'on' : ''}">عربي</button><button type="button" data-lang="en" class="${!ar ? 'on' : ''}">English</button></div>`;
    const head = `<div class="ss-top">${langBar}<button type="button" class="ss-coach" id="ss-coach">🔒 ${TKD.t('Coach', 'المدرب')}</button></div>
      <div class="ss-logo">🥋</div><h1 class="ss-title">${TKD.t('Taekwondo Journey', 'رحلة التايكوندو')}</h1>`;
    let body;
    if (this.mode === 'new') {
      body = `<h2 class="ss-q">${TKD.t('New player', 'لاعب جديد')}</h2>
        <div class="ss-new">
          <label class="ss-name"><span>${TKD.t('Your name', 'اسمك')}</span>
            <input id="ss-name-input" type="text" maxlength="18" autocomplete="off" placeholder="${TKD.t('Type your name', 'اكتب اسمك')}"></label>
          <div class="ss-chars" role="radiogroup" aria-label="${TKD.t('Character', 'الشخصية')}">
            ${['boy', 'girl'].map(c => `<button type="button" role="radio" aria-checked="${this.newChar === c}" class="ss-char ${this.newChar === c ? 'on' : ''}" data-ch="${c}">
              <img src="assets/images/characters/${c}_char/${c}_idle.webp" alt=""><span>${c === 'boy' ? TKD.t('Boy', 'ولد') : TKD.t('Girl', 'بنت')}</span></button>`).join('')}
          </div>
          <button type="button" class="btn btn-success ss-go" id="ss-go">${TKD.t("Let's go! 🚀", 'يلا بينا! 🚀')}</button>
          ${players.length ? `<button type="button" class="btn btn-small ss-back" id="ss-back">${TKD.t('← Back', '→ رجوع')}</button>` : ''}
        </div>`;
    } else {
      body = `<h2 class="ss-q">${TKD.t("Who's training today?", 'مين هيتمرن النهارده؟')}</h2>
        <div class="ss-grid">
          ${players.map(({ p }) => {
            const tier = League.TIERS[League.tierOf(p)];
            const streak = TKD.read(GameState.storageKey(p.id), {})?.practiceStreak || 0;
            return `<button type="button" class="ss-card" data-pid="${p.id}">${TKD.avatar(p, 'lg')}
              <b>${TKD.esc(p.name)}</b><small>${tier.icon} ${TKD.ar ? tier.ar : tier.en}${streak >= 2 ? ` · 🔥${TKD.num(streak)}` : ''}</small></button>`;
          }).join('')}
          <button type="button" class="ss-card ss-add" id="ss-add"><span class="ss-plus">＋</span><b>${TKD.t('New player', 'لاعب جديد')}</b></button>
        </div>`;
    }
    el.innerHTML = `<div class="ss-inner">${head}${body}</div>`;
    el.querySelectorAll('.ss-lang button').forEach(b => b.addEventListener('click', () => { TKD.gs().setLanguage(b.dataset.lang); try { localStorage.setItem('taekwondoJourneyLangChosen', 'user'); } catch (e) {} this.render(); }));
    TKD.$('ss-coach')?.addEventListener('click', () => { this.hide(); Coach.open(); });
    el.querySelectorAll('.ss-card[data-pid]').forEach(b => b.addEventListener('click', () => this.enter(b.dataset.pid)));
    TKD.$('ss-add')?.addEventListener('click', () => { this.mode = 'new'; this.newChar = 'boy'; this._draft = ''; this.render(); });
    TKD.$('ss-back')?.addEventListener('click', () => { this.mode = 'pick'; this.render(); });
    el.querySelectorAll('.ss-char').forEach(b => b.addEventListener('click', () => { this.newChar = b.dataset.ch; TKD.gs()?.playSound('click'); this.render(); TKD.$('ss-name-input')?.focus(); }));
    const input = TKD.$('ss-name-input');
    if (input) {
      input.value = this._draft || '';
      input.addEventListener('input', () => { this._draft = input.value; });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.create(); });
      setTimeout(() => input.focus(), 50);
    }
    TKD.$('ss-go')?.addEventListener('click', () => this.create());
  },
  create() {
    const name = (TKD.$('ss-name-input')?.value || '').trim();
    if (!name) { TKD.toast(TKD.t('⚠️ Type your name first', '⚠️ اكتب اسمك الأول'), 'warning'); TKD.$('ss-name-input')?.focus(); return; }
    const existing = PlayerSystem.getPlayers().find(p => p.name.toLowerCase() === name.toLowerCase());
    const p = PlayerSystem.createOrSelectPlayer(name, this.newChar);
    if (!existing) { TKD.gs().playerCharacter = this.newChar; TKD.gs().saveToStorage(); }
    this._draft = '';
    this.enter(p.id, !existing);
  },
  enter(pid, isNew = false) {
    const gs = TKD.gs();
    PlayerSystem.selectPlayer(pid);
    gs.playSound('success');
    if (!isNew) setTimeout(() => window.Voice?.cue('welcome'), 300);
    this.hide();
    League.process();
    switchScreen('home');
    const p = PlayerSystem.getCurrentPlayer();
    gs.showNotification(isNew ? TKD.t(`🎉 Welcome, ${p.name}! Let's start with a warm-up.`, `🎉 أهلاً يا ${p.name}! يلا نبدأ بالإحماء.`)
      : TKD.t(`👋 Welcome back, ${p.name}!`, `👋 نورت يا ${p.name}!`), 'success');
    setTimeout(() => League.celebratePending(), 900);
    this.shortcut();
  },
  // v26: app-icon shortcuts (manifest "shortcuts": ?go=train|challenge|curriculum) — once per launch
  shortcut() {
    let go = null;
    try { go = new URLSearchParams(location.search).get('go'); } catch (e) {}
    if (!go || this._shortcutDone) return;
    this._shortcutDone = true;
    const act = { train: () => resumeTraining(), challenge: () => Challenge.start(), curriculum: () => switchScreen('curriculum') }[go];
    if (act) setTimeout(act, 250);
  }
};
window.StartScreen = StartScreen;

// =====================================================================
// HOME HUB — one big button + today's challenge + league
// =====================================================================
const HomeHub = {
  STAGE: { warmup: { en: 'Warm-up', ar: 'الإحماء' }, learning: { en: 'Learning', ar: 'التعلم' }, games: { en: 'Games', ar: 'الألعاب' }, quiz: { en: 'The test', ar: 'الاختبار' } },
  render() {
    const el = TKD.$('home-hub'); if (!el) return;
    const gs = TKD.gs(); const p = PlayerSystem.getCurrentPlayer();
    TKD.$('home-screen')?.classList.toggle('has-hub', !!(gs && p));
    if (!gs || !p) { el.innerHTML = ''; return; }
    League.process();
    const target = gs.getResumeTarget();
    const sub = target.done ? TKD.t('Everything done — see your trophies', 'خلّصت كل حاجة — شوف إنجازاتك')
      : `${TKD.skillName(target.skillId)} · ${TKD.ar ? this.STAGE[target.stage].ar : this.STAGE[target.stage].en}`;
    // a brand-new player sees ONLY the journey — everything else appears after the first game
    const fresh = PlayerSystem.getAttempts().filter(a => a.playerId === p.id).length === 0 && !TKD.read(`taekwondoJourneyShowAll:${p.id}`, false);
    const c = Challenge.today(); const left = Challenge.triesLeft(); const best = Challenge.best(p.id);
    const rank = Challenge.ranking().findIndex(r => r.pid === p.id) + 1;
    const tierI = League.tierOf(p), tier = League.TIERS[tierI];
    const table = League.table().filter(r => r.tier === tierI);
    const myRow = table.findIndex(r => r.p.id === p.id);
    const pts = myRow >= 0 ? table[myRow].total : 0;
    el.innerHTML = `
      <div class="hub-player"><button type="button" class="hub-me" id="hub-me" aria-label="${TKD.t('My hero page', 'صفحة البطل بتاعتي')}">${TKD.avatar(p)}</button><div class="hub-player-txt"><b>${TKD.esc(p.name)}</b><small>${tier.icon} ${League.tierName(tierI)}${gs.practiceStreak >= 2 ? ` · 🔥 ${TKD.num(gs.practiceStreak)}` : ''}</small></div>
        <button type="button" class="btn btn-small btn-success" id="hub-profile">🏅 ${TKD.t('My page', 'صفحتي')}</button>
        <button type="button" class="btn btn-small hub-switch" id="hub-switch">👥 ${TKD.t('Switch player', 'غيّر اللاعب')}</button></div>
      ${window.Journey ? Journey.html() : `<button type="button" class="hub-cta" id="hub-cta"><span class="hub-cta-main">▶ ${TKD.t("Let's train!", 'يلا نتمرن!')}</span><span class="hub-cta-sub">${sub}</span></button>`}
      ${window.Review ? Review.card() : ''}
      ${fresh ? `<button type="button" class="hub-more" id="hub-more">✨ ${TKD.t('Show me more things to do', 'وريني حاجات تانية')}</button>` : ''}
      <div class="hub-cards" ${fresh ? 'hidden' : ''}>
        <button type="button" class="hub-card hub-challenge" id="hub-challenge">
          <span class="hub-card-k">🏆 ${TKD.t("Today's challenge", 'تحدي النهارده')}</span>
          <span class="hub-card-big">${TKD.gameIcon(c.gameId)} ${TKD.gameName(c.gameId)}</span>
          <span class="hub-card-s">${TKD.skillName(c.skillId)} · ${left ? TKD.t(`${left} tries left`, `فاضل ${TKD.num(left)} محاولات`) : TKD.t('no tries left', 'خلصت المحاولات')}</span>
          <span class="hub-card-s">${best !== null ? TKD.t(`Your best ${best}% · #${rank}`, `أحسن نتيجة ${TKD.num(best)}% · المركز ${TKD.num(rank)}`) : TKD.t('Same challenge for everyone today', 'نفس التحدي للكل النهارده')}</span>
        </button>
        <button type="button" class="hub-card hub-league" id="hub-league" style="--tier:${tier.color}">
          <span class="hub-card-k">${tier.icon} ${League.tierName(tierI)}</span>
          <span class="hub-card-big">${TKD.num(pts)} ${TKD.t('pts', 'نقطة')}</span>
          <span class="hub-card-s">${TKD.t(`#${myRow + 1} of ${table.length} · top ${League.settings().promote} go up`, `المركز ${TKD.num(myRow + 1)} من ${TKD.num(table.length)} · أول ${TKD.num(League.settings().promote)} يطلعوا`)}</span>
          <span class="hub-card-s">⏳ ${TKD.t(`${League.daysLeft()} days left this week`, `باقي ${TKD.num(League.daysLeft())} أيام في الأسبوع`)}</span>
        </button>
        <button type="button" class="hub-card hub-versus" id="hub-versus">
          <span class="hub-card-k">⚔️ ${TKD.t('Challenge a friend', 'تحدّى صاحبك')}</span>
          <span class="hub-card-big">🥊 1 × 1</span>
          <span class="hub-card-s">${TKD.t('Two players, one screen', 'لاعبين على نفس الشاشة')}</span>
          <span class="hub-card-s">${TKD.t('or start a tournament', 'أو ابدأ بطولة')}</span>
        </button>
      </div>
      ${fresh ? '' : this.syllabus()}`;
    TKD.$('hub-switch').addEventListener('click', () => StartScreen.show());
    TKD.$('hub-profile').addEventListener('click', () => window.Profile?.open());
    TKD.$('hub-me').addEventListener('click', () => window.Profile?.open());
    TKD.$('hub-cta')?.addEventListener('click', () => resumeTraining());
    window.Journey?.bind(el);
    TKD.$('hub-more')?.addEventListener('click', () => { TKD.write(`taekwondoJourneyShowAll:${p.id}`, true); TKD.gs()?.playSound('click'); this.render(); });
    window.Journey?.welcome(el);
    window.Journey?.celebrate(el);
    TKD.$('hub-challenge').addEventListener('click', () => Challenge.start());
    TKD.$('hub-league').addEventListener('click', () => switchScreen('league'));
    TKD.$('hub-versus').addEventListener('click', () => switchScreen('versus'));
    TKD.$('hub-syllabus')?.addEventListener('click', () => switchScreen('curriculum'));
    window.Review?.bindCard();
  },
  // v26: the belt the player is working on, from the full curriculum
  syllabus() {
    if (!window.Curriculum || !window.CurriculumScreen) return '';
    const d = CurriculumScreen.done();
    const b = Curriculum.BELTS.find(x => x.items.some(i => !CurriculumScreen.isDone(i, d))) || Curriculum.BELTS[Curriculum.BELTS.length - 1];
    const n = b.items.filter(i => CurriculumScreen.isDone(i, d)).length;
    return `<button type="button" class="hub-syllabus" id="hub-syllabus" style="--belt:${b.color};--belt-2:${b.accent}">
      <span class="hub-sy-belt"></span>
      <span class="hub-sy-txt"><b>📚 ${TKD.t('Belt syllabus', 'منهج الأحزمة')}</b><small>${TKD.esc(TKD.ar ? b.name.ar : b.name.en)} · ${TKD.num(n)}/${TKD.num(b.items.length)}</small></span>
      <span class="hub-sy-bar"><span style="width:${Math.round(100 * n / b.items.length)}%"></span></span>
    </button>`;
  }
};
window.HomeHub = HomeHub;

// =====================================================================
// LEAGUE SCREEN
// =====================================================================
const LeagueScreen = {
  tab: 'league',
  init() { League.process(); this.render(); },
  render() {
    const root = TKD.$('league-root'); if (!root) return;
    const tabs = [['league', `🏅 ${TKD.t('League', 'الدوري')}`], ['today', `🏆 ${TKD.t('Today', 'النهارده')}`], ['awards', `🎖️ ${TKD.t('Awards', 'الجوايز')}`], ['versus', `⚔️ ${TKD.t('Duels', 'المواجهات')}`], ['gym', `🏟️ ${TKD.t('Gym', 'الصالة')}`]];
    root.innerHTML = `<div class="lg-tabs" role="tablist">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${this.tab === k}" class="${this.tab === k ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('')}</div>
      <div class="lg-body">${this[this.tab + 'HTML']()}</div>`;
    root.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { this.tab = b.dataset.tab; TKD.gs()?.playSound('click'); this.render(); }));
    root.querySelector('#lg-play')?.addEventListener('click', () => Challenge.start());
    root.querySelectorAll('[data-profile]').forEach(li => li.addEventListener('click', () => window.Profile?.open(li.dataset.profile)));
    root.querySelectorAll('[data-cert]').forEach(b => b.addEventListener('click', () => {
      const p = PlayerSystem.getPlayers().find(x => x.id === b.dataset.pid); if (p) Certificates.award(p, b.dataset.cert, b.dataset.week);
    }));
    root.querySelector('#lg-duel')?.addEventListener('click', () => switchScreen('versus'));
    root.querySelector('#lg-scan')?.addEventListener('click', () => Coach.open('import'));
    root.querySelector('#lg-mycard')?.addEventListener('click', () => { const p = PlayerSystem.getCurrentPlayer(); if (p) PlayerCard.show(p); });
  },
  row(i, p, main, sub, cls = '') {
    return `<li class="lg-row ${cls} ${p?.id === TKD.pid() ? 'me' : ''}" ${p?.id && PlayerSystem.getPlayers().some(x => x.id === p.id) ? `data-profile="${p.id}" tabindex="0" role="button"` : ''}><span class="lg-rank">${i < 3 ? ['🥇', '🥈', '🥉'][i] : TKD.num(i + 1)}</span>${TKD.avatar(p)}
      <span class="lg-name">${TKD.esc(p?.name || '?')}${sub ? `<small>${sub}</small>` : ''}</span><span class="lg-pts">${main}</span></li>`;
  },
  leagueHTML() {
    const me = PlayerSystem.getCurrentPlayer();
    const myTier = League.tierOf(me);
    const set = League.settings();
    const all = League.table();
    const tierBlock = (ti) => {
      const rows = all.filter(r => r.tier === ti);
      if (!rows.length) return '';
      const t = League.TIERS[ti];
      return `<section class="lg-tier ${ti === myTier ? 'mine' : ''}" style="--tier:${t.color}">
        <h3>${t.icon} ${League.tierName(ti)} <small>${TKD.num(rows.length)} ${TKD.t('players', 'لاعبين')}</small></h3>
        <ol class="lg-list">${rows.map((r, i) => this.row(i, r.p, `${TKD.num(r.total)}`,
          TKD.t(`${r.challengeDays} challenges · ${r.warmDays} warm-ups · ${r.trainDays} days`, `${TKD.num(r.challengeDays)} تحديات · ${TKD.num(r.warmDays)} إحماء · ${TKD.num(r.trainDays)} أيام`),
          i < set.promote && ti < League.TIERS.length - 1 && r.total >= set.minPoints ? 'up' : '')).join('')}</ol></section>`;
    };
    return `<div class="lg-head"><div>${TKD.t('This week ends in', 'الأسبوع بيخلص بعد')} <b>${TKD.num(League.daysLeft())} ${TKD.t('days', 'أيام')}</b></div>
        <div class="lg-legend"><span class="lg-up">⬆️</span> ${TKD.t(`top ${set.promote} with ${set.minPoints}+ points go up a league`, `أول ${TKD.num(set.promote)} اللي عندهم ${TKD.num(set.minPoints)} نقطة أو أكتر بيطلعوا دوري أعلى`)}</div></div>
      ${[myTier, ...League.TIERS.map((_, i) => i).filter(i => i !== myTier).reverse()].map(tierBlock).join('')}
      <details class="lg-how"><summary>❓ ${TKD.t('How are points counted?', 'النقط بتتحسب إزاي؟')}</summary>
        <ul><li>🏆 ${TKD.t("Today's challenge: your best score each day (only the first 3 tries count)", 'تحدي النهارده: أحسن نتيجة ليك كل يوم (أول ٣ محاولات بس اللي بتتحسب)')}</li>
        <li>🔥 ${TKD.t('+20 for every day you warm up', '+٢٠ لكل يوم تعمل فيه إحماء')}</li>
        <li>📅 ${TKD.t('+10 for every day you train', '+١٠ لكل يوم تتمرن فيه')}</li>
        <li>⬆️ ${TKD.t('Nobody goes down a league — only up!', 'محدش بينزل دوري — بس بتطلع!')}</li></ul></details>`;
  },
  todayHTML() {
    const c = Challenge.today(), left = Challenge.triesLeft();
    const rk = Challenge.ranking();
    const players = PlayerSystem.getPlayers();
    return `<div class="lg-challenge">
        <div class="lg-ch-icon">${TKD.gameIcon(c.gameId)}</div>
        <div><h3>${TKD.gameName(c.gameId)} · ${TKD.skillName(c.skillId)}</h3>
          <p>${TKD.t('Same game and kick for everyone today, on Normal. Your best of the first 3 tries counts.', 'نفس اللعبة والركلة للكل النهارده، على مستوى عادي. أحسن نتيجة من أول ٣ محاولات هي اللي بتتحسب.')}</p></div>
        <button type="button" class="btn btn-success" id="lg-play">${left ? TKD.t(`Play (${left} left)`, `العب (فاضل ${TKD.num(left)})`) : TKD.t('Practice', 'اتمرن')}</button></div>
      ${rk.length ? `<ol class="lg-list">${rk.map((r, i) => this.row(i, players.find(p => p.id === r.pid) || { name: r.name }, `${TKD.num(r.score)}%`, new Date(r.ts).toLocaleTimeString(TKD.ar ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' }))).join('')}</ol>`
        : `<p class="lg-empty">${TKD.t('Nobody has played today yet — be the first! 🚀', 'لسه محدش لعب النهارده — خليك الأول! 🚀')}</p>`}`;
  },
  awardsHTML() {
    const st = League.load(); const players = PlayerSystem.getPlayers();
    const last = (st.history || [])[0];
    const nameOf = (id) => players.find(p => p.id === id);
    const me = PlayerSystem.getCurrentPlayer();
    const awards = last ? Object.entries(last.awards || {}).map(([id, pid]) => {
      const p = nameOf(pid); if (!p) return '';
      return `<li class="lg-award">${TKD.avatar(p)}<span><b>${League.awardName(id)}</b><small>${TKD.esc(p.name)}</small></span>
        <button type="button" class="btn btn-small" data-cert="${id}" data-pid="${p.id}" data-week="${last.week}">📜</button></li>`;
    }).join('') : '';
    const badges = (me?.badges || []).slice().reverse();
    return `<h3 class="lg-sub">${TKD.t('Last week', 'الأسبوع اللي فات')}${last ? ` <small>(${last.week})</small>` : ''}</h3>
      ${awards ? `<ul class="lg-awards">${awards}</ul>` : `<p class="lg-empty">${TKD.t('Awards are given when the week ends (Friday night).', 'الجوايز بتتوزع لما الأسبوع يخلص (يوم الجمعة بالليل).')}</p>`}
      <h3 class="lg-sub">${TKD.t('My badges', 'شاراتي')}</h3>
      ${badges.length ? `<div class="lg-badges">${badges.map(b => `<span class="lg-badge" title="${b.week || ''}">${League.awardName(b.id)}</span>`).join('')}</div>` : `<p class="lg-empty">${TKD.t('No badges yet — keep training! 💪', 'لسه مفيش شارات — كمّل تمرين! 💪')}</p>`}`;
  },
  versusHTML() {
    const rows = (window.Versus ? Versus.standings() : []);
    const champs = window.Versus ? Versus.champions() : [];
    return `<div class="lg-head"><div>${TKD.t('Wins in 1 × 1 duels on this device', 'المكسب في مواجهات ١×١ على الجهاز ده')}</div>
        <button type="button" class="btn btn-success btn-small" id="lg-duel">⚔️ ${TKD.t('New duel', 'مواجهة جديدة')}</button></div>
      ${rows.length ? `<ol class="lg-list">${rows.map((r, i) => this.row(i, r.p, `${TKD.num(r.w)} ${TKD.t('W', 'فوز')}`, TKD.t(`${r.l} losses · ${r.pts} points scored`, `${TKD.num(r.l)} خسارة · ${TKD.num(r.pts)} نقطة`))).join('')}</ol>`
        : `<p class="lg-empty">${TKD.t('No duels yet.', 'لسه مفيش مواجهات.')}</p>`}
      ${champs.length ? `<h3 class="lg-sub">👑 ${TKD.t('Tournament champions', 'أبطال البطولات')}</h3><ul class="lg-awards">${champs.map(c => `<li class="lg-award">${TKD.avatar(c.p)}<span><b>${TKD.esc(c.p.name)}</b><small>${TKD.esc(c.name)} · ${c.date}</small></span></li>`).join('')}</ul>` : ''}`;
  },
  gymHTML() {
    const rows = window.GymBoard ? GymBoard.rows() : [];
    return `<div class="lg-head"><div>${TKD.t('Players from every device your coach scanned (this week)', 'لاعبين من كل الأجهزة اللي المدرب مسح كروتهم (الأسبوع ده)')}</div>
        <div class="tkd-row"><button type="button" class="btn btn-small" id="lg-mycard">📇 ${TKD.t('My card', 'كارتي')}</button>
        <button type="button" class="btn btn-small" id="lg-scan">📷 ${TKD.t('Add cards (coach)', 'ضيف كروت (المدرب)')}</button></div></div>
      ${rows.length ? `<ol class="lg-list">${rows.map((r, i) => this.row(i, r.p, `${TKD.num(r.points)}`, `${League.TIERS[r.tier]?.icon || ''} ${r.local ? TKD.t('this device', 'الجهاز ده') : TKD.t(`card from ${r.updated}`, `كارت ${r.updated}`)}${r.stale ? ' · ⏳' : ''}`)).join('')}</ol>`
        : `<p class="lg-empty">${TKD.t('No players yet.', 'لسه مفيش لاعبين.')}</p>`}`;
  }
};
window.LeagueScreen = LeagueScreen;

// small in-app confirm (no browser dialogs)
function tkdConfirm(text, okLabel) {
  return new Promise(res => {
    const ov = document.createElement('div');
    ov.className = 'tkd-modal';
    ov.innerHTML = `<div class="tkd-modal-card"><p class="tkd-confirm-txt">${TKD.esc(text)}</p>
      <div class="tkd-row"><button type="button" class="btn" data-a="0">${TKD.t('Cancel', 'إلغاء')}</button><button type="button" class="btn btn-danger" data-a="1">${okLabel || TKD.t('Yes', 'أيوه')}</button></div></div>`;
    document.body.appendChild(ov);
    ov.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => { ov.remove(); res(b.dataset.a === '1'); }));
  });
}
window.tkdConfirm = tkdConfirm;

// =====================================================================
// PLAYER CARD (for the coach's gym leaderboard across devices)
// =====================================================================
const PlayerCard = {
  PREFIX: 'TKD1.',
  build(p) {
    const m = window.DashboardSystem ? DashboardSystem.masteryFor(p.id).map(x => x.overall) : [];
    const streak = TKD.read(GameState.storageKey(p.id), {})?.practiceStreak || 0;
    return { v: 1, id: p.id, n: p.name, c: p.character || 'boy', t: League.tierOf(p), wk: TKD.weekKey(), wp: League.pointsFor(p.id).total, s: streak, m, d: TKD.dayKey() };
  },
  encode(card) {
    const bytes = new TextEncoder().encode(JSON.stringify(card));
    let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); });
    return this.PREFIX + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  decode(text) {
    const t = String(text || '').trim();
    const i = t.indexOf(this.PREFIX); if (i < 0) return null;
    try {
      const b64 = t.slice(i + this.PREFIX.length).split(/\s/)[0].replace(/-/g, '+').replace(/_/g, '/');
      const bin = atob(b64 + '==='.slice((b64.length + 3) % 4));
      const card = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, ch => ch.charCodeAt(0))));
      return card && card.v === 1 && card.id && card.n ? card : null;
    } catch (e) { return null; }
  },
  show(p) {
    const card = this.build(p), code = this.encode(card);
    const ov = document.createElement('div');
    ov.className = 'tkd-modal';
    ov.innerHTML = `<div class="tkd-modal-card tkd-card-view">
      <h2>📇 ${TKD.t('Player card', 'كارت اللاعب')}</h2>
      <div class="tkd-card-id">${TKD.avatar(p)}<div><b>${TKD.esc(p.name)}</b><small>${League.TIERS[card.t].icon} ${League.tierName(card.t)} · ${TKD.num(card.wp)} ${TKD.t('pts this week', 'نقطة الأسبوع ده')}</small></div></div>
      <div class="tkd-qr" id="tkd-qr"></div>
      <p class="tkd-muted">${TKD.t("Show this to your coach's camera, or send the code.", 'وري الكارت ده لكاميرا المدرب، أو ابعتله الكود.')}</p>
      <textarea readonly class="tkd-code" rows="2" aria-label="code">${code}</textarea>
      <div class="tkd-row wrap">
        <button type="button" class="btn btn-small" data-a="copy">📋 ${TKD.t('Copy code', 'انسخ الكود')}</button>
        ${navigator.share ? `<button type="button" class="btn btn-small" data-a="share">📤 ${TKD.t('Share', 'شارك')}</button>` : ''}
        <button type="button" class="btn btn-small" data-a="png">⬇️ ${TKD.t('Save picture', 'احفظ الصورة')}</button>
        <button type="button" class="btn btn-success btn-small" data-a="close">${TKD.t('Done', 'تمام')}</button></div></div>`;
    document.body.appendChild(ov);
    const box = ov.querySelector('#tkd-qr');
    let canvas = null;
    try { canvas = QRCode.toCanvas(code, 6); box.appendChild(canvas); }
    catch (e) { box.innerHTML = `<textarea readonly class="tkd-code">${code}</textarea>`; }
    ov.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', async () => {
      const a = b.dataset.a;
      if (a === 'close') ov.remove();
      if (a === 'copy') { try { await navigator.clipboard.writeText(code); TKD.toast(TKD.t('📋 Code copied', '📋 الكود اتنسخ'), 'success'); } catch (e) { const ta = ov.querySelector('.tkd-code'); ta.select(); TKD.toast(TKD.t('Select and copy the code below', 'حدّد الكود اللي تحت وانسخه'), 'info'); } }
      if (a === 'share') { try { await navigator.share({ title: 'Taekwondo Journey', text: code }); } catch (e) {} }
      if (a === 'png' && canvas) { const l = document.createElement('a'); l.href = canvas.toDataURL('image/png'); l.download = `card-${p.name}.png`; document.body.appendChild(l); l.click(); l.remove(); }
    }));
  }
};
window.PlayerCard = PlayerCard;

const GymBoard = {
  KEY: 'taekwondoJourneyGym',
  load() { return TKD.read(this.KEY, { cards: {} }); },
  add(card) {
    const st = this.load();
    const old = st.cards[card.id];
    if (old && old.d > card.d) return 'older';
    st.cards[card.id] = card; TKD.write(this.KEY, st);
    return old ? 'updated' : 'added';
  },
  remove(id) { const st = this.load(); delete st.cards[id]; TKD.write(this.KEY, st); },
  rows() {
    const wk = TKD.weekKey();
    const local = PlayerSystem.getPlayers().map(p => ({ p, points: League.pointsFor(p.id).total, tier: League.tierOf(p), local: true }));
    const ids = new Set(local.map(r => r.p.id));
    const remote = Object.values(this.load().cards).filter(c => !ids.has(c.id)).map(c => ({
      p: { id: c.id, name: c.n, character: c.c }, points: c.wk === wk ? c.wp : 0, tier: c.t || 0, local: false, updated: c.d, stale: c.wk !== wk
    }));
    return [...local, ...remote].sort((a, b) => b.points - a.points);
  }
};
window.GymBoard = GymBoard;

// =====================================================================
// COACH MODE
// =====================================================================
const Coach = {
  KEY: 'taekwondoJourneyCoach',
  unlocked: false,
  view: 'panel',
  pinHash(pin) { return 'h' + TKD.hash('tkd-coach-salt:' + pin).toString(36); },
  hasPin() { return !!TKD.read(this.KEY, {}).pin; },
  // ---------- reject easy-to-guess PINs when a coach is choosing one (all-same-digit,
  // simple runs like 1234/4321, or a well-known weak PIN such as 1212/0852)
  isWeakPin(pin) {
    if (!/^\d{4}$/.test(pin)) return true;
    const d = [...pin].map(Number);
    if (d.every(x => x === d[0])) return true; // 0000, 1111, ...
    if (d.every((x, i) => i === 0 || x === d[i - 1] + 1)) return true; // 1234, 2345, ...
    if (d.every((x, i) => i === 0 || x === d[i - 1] - 1)) return true; // 4321, 9876, ...
    const common = ['1212', '1122', '2001', '2580', '0852', '1004', '1313', '6969'];
    return common.includes(pin);
  },
  open(view = 'panel') { this.view = view; switchScreen('coach'); },
  init() { this.render(); },
  render() {
    const root = TKD.$('coach-root'); if (!root) return;
    if (!this.unlocked) return this.renderPin(root);
    const views = { panel: () => this.panelHTML(), import: () => this.importHTML(), voice: () => this.voiceHTML(), settings: () => this.settingsHTML() };
    root.innerHTML = `<div class="co-top">
        <div class="co-nav">${[['panel', `👥 ${TKD.t('Players', 'اللاعبين')}`], ['import', `📷 ${TKD.t('Scan cards', 'امسح كروت')}`], ['voice', `🎙️ ${TKD.t('Record voice', 'سجّل الصوت')}`], ['settings', `⚙️ ${TKD.t('Settings', 'الإعدادات')}`]]
          .map(([k, l]) => `<button type="button" class="${this.view === k ? 'on' : ''}" data-v="${k}">${l}</button>`).join('')}</div>
        <button type="button" class="btn btn-small" id="co-lock">🔒 ${TKD.t('Lock', 'اقفل')}</button></div>
      <div class="co-body">${views[this.view]()}</div>`;
    root.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { this.stopCamera(); if (window.VoiceRecorder?.recording()) VoiceRecorder.cancel(); this.view = b.dataset.v; this.render(); }));
    TKD.$('co-lock').addEventListener('click', () => { this.unlocked = false; this.stopCamera(); if (window.VoiceRecorder?.recording()) VoiceRecorder.cancel(); this.render(); });
    this['bind_' + this.view]?.(root);
  },

  // ---------- forgotten PIN: a grown-up question (not something a young child can answer) resets it
  forgotPin(root) {
    const a = 6 + Math.floor(Math.random() * 7), b = 12 + Math.floor(Math.random() * 8);
    root.innerHTML = `<div class="co-pin">
      <div class="co-pin-ico">🔑</div>
      <h3>${TKD.t('Grown-ups only', 'للكبار بس')}</h3>
      <p class="co-pin-help">${TKD.t(`To choose a new PIN, type the answer: ${a} × ${b}`, `عشان تختار رقم سري جديد، اكتب ناتج: ${TKD.num(a)} × ${TKD.num(b)}`)}</p>
      <input id="co-gate" class="player-name-input" inputmode="numeric" autocomplete="off" dir="ltr" style="max-width:160px;text-align:center">
      <div class="tkd-row"><button type="button" class="btn btn-success btn-small" id="co-gate-ok">${TKD.t('Reset PIN', 'غيّر الرقم')}</button>
      <button type="button" class="btn btn-small" id="co-gate-back">${TKD.t('Back', 'رجوع')}</button></div>
      <p class="co-pin-help" id="co-gate-msg"></p></div>`;
    const inp = TKD.$('co-gate'); inp.focus();
    const ok = () => {
      const v = parseInt(String(inp.value).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)), 10);
      if (v === a * b) { const c = TKD.read(this.KEY, {}); delete c.pin; TKD.write(this.KEY, c); this.unlocked = false; this.render(); }
      else { TKD.$('co-gate-msg').textContent = TKD.t('Not right — try again.', 'مش مظبوط — جرّب تاني.'); inp.value = ''; }
    };
    TKD.$('co-gate-ok').addEventListener('click', ok);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
    TKD.$('co-gate-back').addEventListener('click', () => this.render());
  },

  // ---------- PIN
  renderPin(root) {
    const setting = !this.hasPin();
    this._pin = ''; this._first = null;
    const paint = (msg) => {
      root.innerHTML = `<div class="co-pin">
        <div class="co-pin-ico">👩‍🏫</div>
        <h3>${msg || (setting ? TKD.t('Choose a 4-digit coach PIN', 'اختار رقم سري للمدرب (٤ أرقام)') : TKD.t('Coach PIN', 'الرقم السري للمدرب'))}</h3>
        <p class="co-pin-help">${setting
          ? (this._first ? TKD.t('Type the same 4 numbers again to confirm.', 'اكتب نفس الـ ٤ أرقام اللي لسه كاتبها عشان نتأكد.')
                         : TKD.t('There is no ready-made PIN: pick any 4 numbers you will remember. Kids should not know it.', 'مفيش رقم جاهز: اختار أي ٤ أرقام هتفتكرها، وماتقولهاش للأطفال.'))
          : ''}</p>
        <div class="co-dots">${[0, 1, 2, 3].map(i => `<i class="${i < this._pin.length ? 'on' : ''}"></i>`).join('')}</div>
        <div class="co-pad" dir="ltr">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(k => `<button type="button" data-k="${k}">${k}</button>`).join('')}</div>
        ${setting ? '' : `<button type="button" class="co-forgot" id="co-forgot">${TKD.t('Forgot the PIN?', 'نسيت الرقم السري؟')}</button>`}
        <button type="button" class="btn btn-small" id="co-back">${TKD.t('Back', 'رجوع')}</button></div>`;
      root.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => press(b.dataset.k)));
      TKD.$('co-forgot')?.addEventListener('click', () => this.forgotPin(root));
      TKD.$('co-back').addEventListener('click', () => { if (PlayerSystem.getCurrentPlayer()) switchScreen('home'); else StartScreen.show(); });
    };
    const press = (k) => {
      if (k === '⌫') { this._pin = this._pin.slice(0, -1); return paint(); }
      if (k === '✓') return submit();
      if (this._pin.length < 4) this._pin += k;
      paint();
      if (this._pin.length === 4) setTimeout(submit, 150);
    };
    const submit = () => {
      if (this._pin.length !== 4) return;
      if (setting) {
        if (!this._first) {
          if (this.isWeakPin(this._pin)) { this._pin = ''; return paint(TKD.t('That PIN is too easy to guess — pick different numbers.', 'الرقم ده سهل التخمين — اختار أرقام تانية.')); }
          this._first = this._pin; this._pin = ''; return paint(TKD.t('Type it again', 'اكتبه تاني'));
        }
        if (this._first !== this._pin) { this._first = null; this._pin = ''; return paint(TKD.t('Not the same — try again', 'مش زي بعض — جرّب تاني')); }
        TKD.write(this.KEY, { ...TKD.read(this.KEY, {}), pin: this.pinHash(this._pin) });
        this.unlocked = true; TKD.gs()?.playSound('success'); return this.render();
      }
      if (this.pinHash(this._pin) === TKD.read(this.KEY, {}).pin) { this.unlocked = true; TKD.gs()?.playSound('success'); return this.render(); }
      this._pin = ''; TKD.gs()?.playSound('error'); paint(TKD.t('Wrong PIN', 'الرقم غلط'));
    };
    this._keyHandler && document.removeEventListener('keydown', this._keyHandler);
    this._keyHandler = (e) => {
      if (this.unlocked || !TKD.$('coach-screen')?.classList.contains('active') || e.target?.closest?.('input, textarea') || !document.querySelector('.co-pad')) return;
      if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('⌫'); else if (e.key === 'Enter') press('✓');
    };
    document.addEventListener('keydown', this._keyHandler);
    paint();
  },

  // ---------- players panel
  stats(p) {
    const att = PlayerSystem.getAttempts().filter(a => a.playerId === p.id);
    const played = att.filter(a => a.gameId !== 'warmup' && a.gameId !== 'learning');
    const last5 = played.slice(-5);
    const avg5 = last5.length ? Math.round(last5.reduce((s, a) => s + a.score, 0) / last5.length) : null;
    let failRun = 0; for (let i = played.length - 1; i >= 0 && !played[i].passed; i--) failRun++;
    const last = att.reduce((m, a) => Math.max(m, a.ts), 0);
    const save = TKD.read(GameState.storageKey(p.id), null) || PlayerSystem.rebuildState(p.id) || {};
    const unlocked = save.unlockedSkills || ['apchagi'];
    const help = [];
    if (avg5 !== null && avg5 < 60 && last5.length >= 3) help.push(TKD.t(`low scores (avg ${avg5}%)`, `نتايج واطية (متوسط ${avg5}%)`));
    if (failRun >= 3) help.push(TKD.t(`${failRun} misses in a row`, `${failRun} محاولات مش ناجحة ورا بعض`));
    if (last && Date.now() - last > 7 * 864e5) help.push(TKD.t('no training for a week', 'متمرنش من أسبوع'));
    return { avg5, failRun, last, help, save, unlocked, week: League.pointsFor(p.id).total, streak: save.practiceStreak || 0 };
  },
  // ---------- across every player: which station (kick × mini-game) trips kids up
  // most often, so a coach knows where to spend the next lesson's time — not just
  // which child is struggling (that's stats() above), but which STEP is the problem.
  stuckReport(minAttempts = 3, limit = 5) {
    const att = PlayerSystem.getAttempts().filter(a => a.gameId !== 'warmup' && a.gameId !== 'learning');
    const by = {};
    att.forEach(a => {
      const k = a.skillId + '|' + a.gameId;
      const row = by[k] || (by[k] = { skillId: a.skillId, gameId: a.gameId, n: 0, fails: 0, players: new Set() });
      row.n++; row.players.add(a.playerId); if (!a.passed) row.fails++;
    });
    return Object.values(by)
      .filter(r => r.n >= minAttempts)
      .map(r => ({ ...r, rate: r.fails / r.n, players: r.players.size }))
      .filter(r => r.rate > 0)
      .sort((a, b) => b.rate - a.rate || b.n - a.n)
      .slice(0, limit);
  },
  panelHTML() {
    const players = PlayerSystem.getPlayers();
    if (!players.length) return `<p class="lg-empty">${TKD.t('No players yet.', 'لسه مفيش لاعبين.')}</p>`;
    const rows = players.map(p => ({ p, s: this.stats(p) }));
    const needs = rows.filter(r => r.s.help.length);
    const stuck = this.stuckReport();
    const fmt = (ts) => ts ? new Date(ts).toLocaleDateString(TKD.ar ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' }) : '—';
    return `${needs.length ? `<section class="co-help"><h3>🆘 ${TKD.t('Needs help', 'محتاجين مساعدة')}</h3>
        <ul>${needs.map(r => `<li>${TKD.avatar(r.p)}<b>${TKD.esc(r.p.name)}</b> ${r.s.help.map(h => `<span class="co-chip">${h}</span>`).join('')}</li>`).join('')}</ul></section>` : ''}
      ${stuck.length ? `<section class="co-stuck"><h3>🧩 ${TKD.t('Where kids get stuck', 'فين الأطفال بيتعثروا')}</h3>
        <ul>${stuck.map(r => `<li><b>${TKD.skillName(r.skillId)}</b> · ${TKD.gameIcon(r.gameId)} ${TKD.gameName(r.gameId)}
          <span class="co-chip co-chip-bad">${TKD.t(`${Math.round(r.rate * 100)}% miss`, `${TKD.num(Math.round(r.rate * 100))}% مش عدى`)}</span>
          <span class="co-chip">${TKD.t(`${r.players} kid${r.players > 1 ? 's' : ''}`, `${TKD.num(r.players)} طفل`)}</span></li>`).join('')}</ul></section>` : ''}
      <div class="co-tools">
        <button type="button" class="btn btn-small" data-tool="tournament">👑 ${TKD.t('New tournament', 'بطولة جديدة')}</button>
        <button type="button" class="btn btn-small" data-tool="gym">🏟️ ${TKD.t('Gym leaderboard', 'ترتيب الصالة')}</button>
        <button type="button" class="btn btn-small" data-tool="dashboard">📊 ${TKD.t('Dashboard', 'لوحة اللاعبين')}</button>
        <button type="button" class="btn btn-small" data-tool="backup">⬇️ ${TKD.t('Backup (all players)', 'نسخة احتياطية (كل اللاعبين)')}</button>
      </div>
      <div class="db-table-wrap"><table class="co-table">
        <thead><tr><th>${TKD.t('Player', 'اللاعب')}</th><th>${TKD.t('League', 'الدوري')}</th><th>${TKD.t('Week pts', 'نقط الأسبوع')}</th><th>🔥</th><th>${TKD.t('Kicks open', 'الركلات المفتوحة')}</th><th>${TKD.t('Last 5 avg', 'متوسط آخر ٥')}</th><th>${TKD.t('Last played', 'آخر لعب')}</th><th></th></tr></thead>
        <tbody>${rows.map(({ p, s }) => `<tr data-pid="${p.id}">
          <td>${TKD.avatar(p)} <b>${TKD.esc(p.name)}</b></td>
          <td>${League.TIERS[League.tierOf(p)].icon}</td><td>${TKD.num(s.week)}</td><td>${TKD.num(s.streak)}</td>
          <td>${GameConfig.SKILL_ORDER.map(sk => `<span class="co-kick ${s.unlocked.includes(sk) ? 'on' : ''}" title="${TKD.skillName(sk)}">${GameConfig.SKILL_ORDER.indexOf(sk) + 1}</span>`).join('')}</td>
          <td>${s.avg5 === null ? '—' : TKD.num(s.avg5) + '%'}</td><td>${fmt(s.last)}</td>
          <td class="co-acts">
            <button type="button" title="${TKD.t('Play as', 'العب بيه')}" data-act="play">▶</button>
            <button type="button" title="${TKD.t('Move to a kick', 'انقله لركلة')}" data-act="stage">🎯</button>
            <button type="button" title="${TKD.t("Give back today's tries", 'رجّع محاولات النهارده')}" data-act="tries">↺</button>
            <button type="button" title="${TKD.t('Player card (QR)', 'كارت اللاعب (QR)')}" data-act="card">📇</button>
            <button type="button" title="${TKD.t('Delete', 'امسح')}" data-act="del">🗑️</button></td></tr>`).join('')}</tbody></table></div>`;
  },
  bind_panel(root) {
    root.querySelectorAll('[data-tool]').forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.tool;
      if (t === 'tournament') { window.Versus && (Versus.mode = 'tournament'); switchScreen('versus'); }
      if (t === 'gym') { LeagueScreen.tab = 'gym'; switchScreen('league'); }
      if (t === 'dashboard') switchScreen('dashboard');
      if (t === 'backup') exportProgress();
    }));
    root.querySelectorAll('tr[data-pid] [data-act]').forEach(b => b.addEventListener('click', async () => {
      const pid = b.closest('tr').dataset.pid; const p = PlayerSystem.getPlayers().find(x => x.id === pid); if (!p) return;
      const act = b.dataset.act;
      if (act === 'play') { PlayerSystem.selectPlayer(pid); switchScreen('home'); }
      if (act === 'card') PlayerCard.show(p);
      if (act === 'tries') {
        const day = TKD.dayKey();
        const all = PlayerSystem.getAttempts();
        let n = 0;
        all.forEach(a => { if (a.playerId === pid && a.meta?.challenge === day) { a.meta.challengePractice = day; delete a.meta.challenge; n++; } });
        PlayerSystem._writeJSON(PlayerSystem.ATTEMPTS_KEY, all);
        TKD.toast(TKD.t(`↺ ${p.name} has ${League.settings().tries} tries again today`, `↺ ${p.name} رجعله ${League.settings().tries} محاولات النهارده`), 'success');
        this.render();
      }
      if (act === 'del') {
        if (await tkdConfirm(TKD.t(`Delete ${p.name} and all their scores?`, `تمسح ${p.name} وكل نتايجه؟`), TKD.t('Delete', 'امسح'))) {
          const wasMe = PlayerSystem.getCurrentPlayerId() === pid;
          PlayerSystem.deletePlayer(pid);
          if (wasMe) { const next = PlayerSystem.getPlayers()[0]; if (next) PlayerSystem.selectPlayer(next.id); }
          this.render();
        }
      }
      if (act === 'stage') this.stageDialog(p);
    }));
  },
  stageDialog(p) {
    const ov = document.createElement('div');
    ov.className = 'tkd-modal';
    ov.innerHTML = `<div class="tkd-modal-card"><h2>🎯 ${TKD.t(`Move ${TKD.esc(p.name)} to…`, `انقل ${TKD.esc(p.name)} لـ…`)}</h2>
      <p class="tkd-muted">${TKD.t('Opens this kick (and the ones before it). Useful when a child already knows a kick from class.', 'بيفتح الركلة دي (واللي قبلها). مفيد لو الطفل عارف الركلة من التمرين.')}</p>
      <div class="tkd-col">${GameConfig.SKILL_ORDER.map((sk, i) => `<button type="button" class="btn" data-sk="${sk}">${i + 1}. ${TKD.skillName(sk)}</button>`).join('')}</div>
      <label class="tkd-check"><input type="checkbox" id="co-skip" checked> ${TKD.t('Mark warm-up and lesson as done', 'اعتبر الإحماء والدرس خلصوا')}</label>
      <div class="tkd-row"><button type="button" class="btn" data-x>${TKD.t('Cancel', 'إلغاء')}</button></div></div>`;
    document.body.appendChild(ov);
    ov.querySelector('[data-x]').addEventListener('click', () => ov.remove());
    ov.querySelectorAll('[data-sk]').forEach(b => b.addEventListener('click', () => {
      const sk = b.dataset.sk, skip = ov.querySelector('#co-skip').checked;
      const key = GameState.storageKey(p.id);
      const gs = TKD.gs();
      if (PlayerSystem.getCurrentPlayerId() === p.id) gs.saveToStorage();
      const save = TKD.read(key, null) || PlayerSystem.rebuildState(p.id) || {};
      const order = GameConfig.SKILL_ORDER, idx = order.indexOf(sk);
      save.unlockedSkills = [...new Set([...(save.unlockedSkills || ['apchagi']), ...order.slice(0, idx + 1)])];
      save.currentSkill = sk;
      save.skillGameScores = save.skillGameScores || {};
      save.completedGames = save.completedGames || [];
      if (skip) {
        const s = (save.skillGameScores[sk] = save.skillGameScores[sk] || {});
        s.warmup = Math.max(s.warmup || 0, 100); s.learning = Math.max(s.learning || 0, 100);
        save.completedGames.push(`learning:${sk}`, 'learning');
      }
      TKD.write(key, save);
      if (PlayerSystem.getCurrentPlayerId() === p.id) gs.switchPlayer(p.id);
      ov.remove();
      TKD.toast(TKD.t(`🎯 ${p.name} → ${TKD.skillName(sk)}`, `🎯 ${p.name} ← ${TKD.skillName(sk)}`), 'success');
      this.render();
    }));
  },

  // ---------- import player cards (camera / paste / picture)
  importHTML() {
    const cam = 'BarcodeDetector' in window;
    const cards = Object.values(GymBoard.load().cards);
    return `<div class="co-import">
        ${cam ? `<div class="co-cam"><video id="co-video" playsinline muted></video><div class="co-cam-frame"></div>
          <button type="button" class="btn btn-success" id="co-cam-btn">📷 ${TKD.t('Start camera', 'شغّل الكاميرا')}</button></div>`
          : `<p class="tkd-muted">📷 ${TKD.t("This browser can't read QR codes with the camera — paste the code instead (players can copy it from their card).", 'المتصفح ده مبيقراش QR بالكاميرا — الصق الكود بدل كده (اللاعب يقدر ينسخه من الكارت بتاعه).')}</p>`}
        <label class="co-paste"><span>${TKD.t('…or paste a code', '…أو الصق الكود')}</span><textarea id="co-code" rows="2" placeholder="TKD1…"></textarea></label>
        <div class="tkd-row wrap"><button type="button" class="btn btn-success btn-small" id="co-add">➕ ${TKD.t('Add', 'ضيف')}</button>
          ${cam ? `<label class="btn btn-small co-file">🖼️ ${TKD.t('From a picture', 'من صورة')}<input type="file" accept="image/*" id="co-file" hidden></label>` : ''}</div>
        <h3 class="lg-sub">${TKD.t('Cards on this device', 'الكروت اللي على الجهاز ده')} (${TKD.num(cards.length)})</h3>
        ${cards.length ? `<ul class="co-cards">${cards.map(c => `<li>${TKD.avatar({ character: c.c })}<b>${TKD.esc(c.n)}</b><small>${League.TIERS[c.t || 0].icon} ${TKD.num(c.wp)} · ${c.d}</small><button type="button" data-rm="${c.id}">✖</button></li>`).join('')}</ul>` : `<p class="lg-empty">—</p>`}
      </div>`;
  },
  bind_import(root) {
    const take = (text) => {
      const card = PlayerCard.decode(text);
      if (!card) { TKD.toast(TKD.t('❌ Not a player card', '❌ ده مش كارت لاعب'), 'error'); return false; }
      const r = GymBoard.add(card);
      TKD.gs()?.playSound('success');
      TKD.toast(r === 'older' ? TKD.t(`${card.n}: a newer card is already saved`, `${card.n}: فيه كارت أحدث متسجل`) : TKD.t(`✅ ${card.n} added to the gym leaderboard`, `✅ ${card.n} اتضاف لترتيب الصالة`), 'success');
      return true;
    };
    TKD.$('co-add')?.addEventListener('click', () => { if (take(TKD.$('co-code').value)) { TKD.$('co-code').value = ''; this.render(); } });
    root.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { GymBoard.remove(b.dataset.rm); this.render(); }));
    TKD.$('co-file')?.addEventListener('change', async (e) => {
      const f = e.target.files?.[0]; if (!f) return;
      try {
        const det = new BarcodeDetector({ formats: ['qr_code'] });
        const res = await det.detect(await createImageBitmap(f));
        if (!res.length || !take(res[0].rawValue)) TKD.toast(TKD.t('No card found in the picture', 'ملقيناش كارت في الصورة'), 'warning');
        else this.render();
      } catch (err) { TKD.toast(TKD.t('Could not read the picture', 'مقدرناش نقرا الصورة'), 'error'); }
    });
    TKD.$('co-cam-btn')?.addEventListener('click', () => this.startCamera(take));
  },
  async startCamera(take) {
    const v = TKD.$('co-video'); if (!v) return;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      v.srcObject = this.stream; await v.play();
      TKD.$('co-cam-btn').hidden = true;
      const det = new BarcodeDetector({ formats: ['qr_code'] });
      const seen = new Set();
      this._scan = setInterval(async () => {
        try {
          const res = await det.detect(v);
          res.forEach(r => { if (!seen.has(r.rawValue)) { seen.add(r.rawValue); take(r.rawValue); } });
        } catch (e) {}
      }, 400);
    } catch (e) { TKD.toast(TKD.t('Camera not available', 'الكاميرا مش متاحة'), 'error'); }
  },
  stopCamera() { clearInterval(this._scan); this.stream?.getTracks().forEach(t => t.stop()); this.stream = null; },

  // ---------- voice recording (record the game's Egyptian lines on this phone)
  voiceHTML() {
    return `<div class="co-voice">
      <p class="tkd-muted">${TKD.t("Record the game's lines in your own voice — right here, no computer needed. Recordings stay on this device and play instead of the phone voice.", 'سجّل جمل اللعبة بصوتك من هنا على طول — مش محتاج كومبيوتر. التسجيلات بتفضل على الجهاز ده وبتتسمع بدل صوت الموبايل.')}</p>
      ${VoiceRecorder.supported() ? '' : `<p class="co-voice-warn">⚠️ ${TKD.t("This browser can't record audio.", 'المتصفح ده مايقدرش يسجّل صوت.')}</p>`}
      <div class="co-voice-progress" id="vr-prog"></div>
      <div class="co-voice-filters" id="vr-filters"></div>
      <ul class="co-voice-list" id="vr-list"><li class="tkd-muted">${TKD.t('Loading…', 'بيحمّل…')}</li></ul>
    </div>`;
  },
  async bind_voice(root) {
    if (!window.VoiceRecorder) return;
    const state = { group: 'all', onlyMissing: false };
    const lines = await VoiceRecorder.lines();
    if (!TKD.$('vr-list')) return; // the coach switched away before the script finished loading
    const groups = [...new Set(lines.map(l => l.group))];

    const paintProgress = async () => {
      const { recorded, total } = await VoiceRecorder.count();
      const pct = total ? Math.round(recorded / total * 100) : 0;
      TKD.$('vr-prog').innerHTML = `<div class="vr-bar"><div class="vr-bar-fill" style="width:${pct}%"></div></div>
        <span>${TKD.t(`${recorded} / ${total} recorded`, `${TKD.num(recorded)} / ${TKD.num(total)} متسجلين`)}</span>`;
    };
    const rowHTML = (l) => {
      const recorded = VoiceRecorder.has(l.key);
      return `<li class="vr-row ${recorded ? 'is-on' : ''}" data-key="${l.key}">
        <span class="vr-badge">${recorded ? '✅' : '⚪'}</span>
        <span class="vr-text"><b>${TKD.esc(l.ar)}</b><small>${TKD.esc(l.en)}</small></span>
        <span class="vr-actions">
          ${recorded ? `<button type="button" class="btn btn-small" data-act="play">▶️</button>` : ''}
          <button type="button" class="btn btn-small" data-act="rec">🎤</button>
          ${recorded ? `<button type="button" class="btn btn-small btn-danger" data-act="del">🗑️</button>` : ''}
        </span></li>`;
    };
    const paintList = () => {
      const filtered = lines.filter(l => (state.group === 'all' || l.group === state.group) && (!state.onlyMissing || !VoiceRecorder.has(l.key)));
      TKD.$('vr-list').innerHTML = filtered.length ? filtered.map(rowHTML).join('') : `<li class="tkd-muted">${TKD.t('Nothing here.', 'مفيش حاجة هنا.')}</li>`;
    };
    TKD.$('vr-filters').innerHTML = `
      <select id="vr-group"><option value="all">${TKD.t('All parts', 'كل الأجزاء')}</option>${groups.map(g => `<option value="${g}">${TKD.esc(g)}</option>`).join('')}</select>
      <label class="tkd-row" style="gap:4px"><input type="checkbox" id="vr-missing"> ${TKD.t("Only what's missing", 'اللي لسه ناقص بس')}</label>`;
    TKD.$('vr-group').addEventListener('change', e => { state.group = e.target.value; paintList(); });
    TKD.$('vr-missing').addEventListener('change', e => { state.onlyMissing = e.target.checked; paintList(); });

    let activeAudio = null;
    TKD.$('vr-list').addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-act]'); if (!btn) return;
      const li = btn.closest('.vr-row'); const key = li.dataset.key;
      const line = lines.find(l => l.key === key); if (!line) return;
      if (btn.dataset.act === 'rec') {
        if (VoiceRecorder.recording() === key) {
          await VoiceRecorder.stop(true); li.outerHTML = rowHTML(line); await paintProgress();
        } else if (!VoiceRecorder.recording()) {
          if (!VoiceRecorder.supported()) { TKD.toast(TKD.t('Recording is not supported here', 'التسجيل مش متاح هنا'), 'error'); return; }
          try { await VoiceRecorder.start(key); li.classList.add('is-recording'); btn.textContent = '⏹️'; }
          catch (err) { TKD.toast(TKD.t('Could not use the microphone', 'ماقدرناش نستخدم المايك'), 'error'); }
        }
      } else if (btn.dataset.act === 'play') {
        activeAudio?.pause(); const url = VoiceRecorder.urlFor(key); if (!url) return;
        activeAudio = new Audio(url); activeAudio.play().catch(() => {});
      } else if (btn.dataset.act === 'del') {
        if (!(await tkdConfirm(TKD.t('Delete this recording?', 'تمسح التسجيل ده؟')))) return;
        await VoiceRecorder.remove(key); li.outerHTML = rowHTML(line); await paintProgress();
      }
    });
    paintList(); await paintProgress();
  },

  // ---------- settings
  settingsHTML() {
    const s = League.settings();
    const sel = (id, vals, cur) => `<select id="${id}">${vals.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${TKD.num(v)}</option>`).join('')}</select>`;
    return `<div class="co-settings">
      <label>🏆 ${TKD.t('Counted challenge tries per day', 'عدد محاولات التحدي المحسوبة في اليوم')} ${sel('co-tries', [1, 2, 3, 4, 5], s.tries)}</label>
      <label>⬆️ ${TKD.t('Players promoted per league each week', 'عدد اللي بيطلعوا من كل دوري كل أسبوع')} ${sel('co-promote', [1, 2, 3, 4, 5], s.promote)}</label>
      <label>🎯 ${TKD.t('Minimum points to go up', 'أقل نقط عشان يطلع')} ${sel('co-min', [0, 50, 100, 150, 200, 300, 400], s.minPoints)}</label>
      <label>🏅 ${TKD.t('Medal difficulty', 'صعوبة الميداليات')} <select id="co-medals">${[['easy', TKD.t('Easier', 'أسهل')], ['normal', TKD.t('Normal', 'عادي')], ['hard', TKD.t('Harder', 'أصعب')]].map(([v, l]) => `<option value="${v}" ${s.medals === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <p class="tkd-muted">${TKD.t('Easier = ×0.7, harder = ×1.4 on the medals you earn by training (warm-ups, games, days…). Skill medals like strongest kick don\'t change.', 'أسهل = ×٠٫٧، أصعب = ×١٫٤ على ميداليات التمرين (إحماء، ألعاب، أيام…). ميداليات المهارة زي أقوى ركلة مابتتغيرش.')}</p>
      <div class="tkd-row wrap">
        <button type="button" class="btn btn-success btn-small" id="co-save">💾 ${TKD.t('Save', 'احفظ')}</button>
        <button type="button" class="btn btn-small" id="co-newpin">🔑 ${TKD.t('Change PIN', 'غيّر الرقم السري')}</button>
        <button type="button" class="btn btn-small btn-danger" id="co-reset-league">↺ ${TKD.t('Everyone back to Bronze', 'رجّع الكل للبرونز')}</button></div></div>`;
  },
  bind_settings() {
    TKD.$('co-save').addEventListener('click', () => {
      const st = League.load();
      st.settings = { tries: +TKD.$('co-tries').value, promote: +TKD.$('co-promote').value, minPoints: +TKD.$('co-min').value, medals: TKD.$('co-medals').value };
      League.save(st); TKD.toast(TKD.t('✅ Saved', '✅ اتحفظ'), 'success');
    });
    TKD.$('co-newpin').addEventListener('click', () => { const c = TKD.read(this.KEY, {}); delete c.pin; TKD.write(this.KEY, c); this.unlocked = false; this.render(); });
    TKD.$('co-reset-league').addEventListener('click', async () => {
      if (!(await tkdConfirm(TKD.t('Put every player back in the Bronze league?', 'ترجّع كل اللاعبين لدوري البرونز؟')))) return;
      PlayerSystem.getPlayers().forEach(p => PlayerSystem.updatePlayer(p.id, { tier: 0 }));
      TKD.toast(TKD.t('Done', 'تمام'), 'success');
    });
  }
};
window.Coach = Coach;

// =====================================================================
// WIRING
// =====================================================================
window.TKDScreens = {
  league: () => LeagueScreen.init(),
  coach: () => Coach.init(),
  versus: (gs) => window.Versus?.init(gs)
};
GameConfig.BACKGROUNDS.LEAGUE = 'assets/images/backgrounds/arena_bg.webp';
GameConfig.BACKGROUNDS.COACH = 'assets/images/backgrounds/dojo_interior_bg.webp';
GameConfig.BACKGROUNDS.VERSUS = 'assets/images/backgrounds/sparring_training_bg.webp';

Challenge.wrapLogging();
document.addEventListener('tkd:screen', (e) => {
  const id = e.detail.screenId;
  if (Challenge.active && id !== Challenge.active.gameId && id !== 'winner') Challenge.end();
  if (id !== 'coach') Coach.stopCamera();
  TKDHints.hide();
  TKDHints.mountReadAloud();
  TKDHints.maybeShow(id);
});
document.addEventListener('tkd:player-changed', () => { if (document.querySelector('#home-screen.active')) HomeHub.render(); });
document.addEventListener('DOMContentLoaded', () => TKDHints.mountReadAloud());

// keep the hub + open screens in the current language
(function wrapLanguage() {
  const orig = GameState.prototype.applyLanguage;
  GameState.prototype.applyLanguage = function () {
    const r = orig.apply(this, arguments);
    try {
      if (document.querySelector('#home-screen.active')) HomeHub.render();
      if (document.querySelector('#league-screen.active')) LeagueScreen.render();
      if (document.querySelector('#coach-screen.active')) Coach.render();
      if (!TKD.$('start-screen')?.hidden) StartScreen.render();
      if (document.querySelector('#versus-screen.active')) window.Versus?.refresh?.();
    } catch (e) {}
    return r;
  };
})();
