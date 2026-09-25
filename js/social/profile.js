/* =====================================================================
   TAEKWONDO JOURNEY — PLAYER PROFILE ("hero page") + ALL PLAYERS (v24)
   Profile: hero card, kick mastery, tiered achievements (bronze → silver →
   gold, with progress to the next tier) + the classic trophies, personal
   records, training calendar, journey timeline, this week vs last week,
   shareable PNG card. All players: gym records + sortable player grid.
   "New record!" / "New achievement!" pop up right after the attempt.
   Everything is computed from data the game already stores. Loaded after
   competition.js / versus.js.
   ===================================================================== */
'use strict';

const Profile = {
  pid: null,
  month: 0,          // 0 = this month, -1 = last month …
  showAllTimeline: false,
  PLAYED_EXCLUDE: new Set(['warmup', 'learning']),
  TIER_NAMES: [{ en: 'Bronze', ar: 'برونز', icon: '🥉', color: '#c08457' }, { en: 'Silver', ar: 'فضة', icon: '🥈', color: '#aab4be' }, { en: 'Gold', ar: 'دهب', icon: '🥇', color: '#e9c46a' }],

  // ------------------------------------------------------------ data
  ctx(pid) {
    const p = PlayerSystem.getPlayers().find(x => x.id === pid);
    if (!p) return null;
    if (pid === PlayerSystem.getCurrentPlayerId()) TKD.gs()?.saveToStorage();
    const save = TKD.read(GameState.storageKey(pid), null) || PlayerSystem.rebuildState(pid) || {};
    const att = PlayerSystem.getAttempts().filter(a => a.playerId === pid).sort((a, b) => a.ts - b.ts);
    const played = att.filter(a => !this.PLAYED_EXCLUDE.has(a.gameId));
    const days = [...new Set(att.map(a => TKD.dayKey(a.ts)))].sort();
    // longest run of consecutive training days (from the log) vs the saved streak
    let run = 0, best = 0, prev = null;
    days.forEach(d => { run = prev && TKD.addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; });
    // weekly streak: consecutive weeks (Sat–Fri) with at least 2 training days — fits a gym
    // schedule (classes are rarely on consecutive days, so a day streak would stay at 1)
    const perWeek = {};
    days.forEach(d => { const w = TKD.weekKey(new Date(d + 'T12:00:00')); perWeek[w] = (perWeek[w] || 0) + 1; });
    let wRun = 0, wBest = 0, wPrev = null;
    Object.keys(perWeek).sort().forEach(w => { if (perWeek[w] < 2) { wRun = 0; wPrev = w; return; } wRun = wPrev && TKD.addDays(wPrev, 7) === w && wRun ? wRun + 1 : 1; wBest = Math.max(wBest, wRun); wPrev = w; });
    let wNow = 0;
    for (let w = TKD.weekKey(), first = true; ; w = TKD.addDays(w, -7), first = false) {
      if ((perWeek[w] || 0) >= 2) wNow++;
      else if (!first) break;                  // this week isn't over yet — don't break the streak on it
      if (!perWeek[w] && !first) break;
      if (wNow > 200) break;
    }
    const vs = window.Versus ? Versus.load() : { matches: [], champions: [] };
    const duels = vs.matches.filter(m => m.p1?.id === pid || m.p2?.id === pid);
    const challengeDays = [...new Set(att.filter(a => a.meta?.challenge).map(a => a.meta.challenge))];
    const gs = {
      completedGames: new Set(save.completedGames || []), completedSkills: new Set(save.completedSkills || []),
      unlockedSkills: new Set(save.unlockedSkills || ['apchagi']), skillGameScores: save.skillGameScores || {},
      practiceStreak: save.practiceStreak || 0, bestStreak: save.bestStreak || 0
    };
    const belt = [...GameState.BELTS].reverse().find(b => gs.completedSkills.size >= b.threshold) || GameState.BELTS[0];
    return {
      p, save, att, played, days, gs, belt,
      warmups: att.filter(a => a.gameId === 'warmup').length,
      passes: played.filter(a => a.score >= GameConfig.SETTINGS.PASSING_SCORE).length,
      perfect: played.filter(a => a.score >= 100).length,
      tried: new Set(played.map(a => a.gameId)),
      bestStreak: Math.max(best, save.bestStreak || 0),
      weekStreak: wNow, bestWeekStreak: Math.max(wBest, wNow),
      streak: save.practiceStreak || 0,
      challengeDays,
      challengeWins: challengeDays.filter(d => Challenge.ranking(d)[0]?.pid === pid).length,
      duelWins: duels.filter(m => m.winner === pid).length, duelLosses: duels.filter(m => m.winner && m.winner !== pid).length,
      duelBest: duels.reduce((m, x) => Math.max(m, x.p1?.id === pid ? x.s1 : x.s2), 0),
      titles: vs.champions.filter(c => c.id === pid),
      awards: (p.badges || []).filter(b => b.id !== 'promoted'),
      tier: League.tierOf(p),
      mastered: gs.completedSkills.size
    };
  },
  metaBest(c, gameIds, key, lower = false) {
    let best = null;
    c.att.forEach(a => {
      if (!gameIds.includes(a.gameId)) return;
      const v = a.meta?.[key];
      if (typeof v !== 'number' || v <= 0) return;
      if (best === null || (lower ? v < best.v : v > best.v)) best = { v, ts: a.ts };
    });
    return best;
  },

  // ------------------------------------------------------------ achievements (tiered)
  // Thresholds are calibrated for a typical gym kid: ~3 training days a week,
  // ~1 warm-up + ~5 games + the daily challenge per day, ~45% of games passed,
  // ~5% perfect. Target time to each medal: bronze ≈ 1–2 weeks (a quick first
  // win), silver ≈ 6–8 weeks, gold ≈ one season (4–5 months). Skill medals
  // (power, reaction, kicks, league) are set by how hard the thing is, not by
  // time. scale: true → the coach's "medal difficulty" setting multiplies it.
  ACH: [
    { id: 'warmups',    icon: '🔥', en: 'Warm-up Hero',   ar: 'بطل الإحماء',     den: 'warm-ups',        dar: 'إحماء',          t: [5, 25, 60],   scale: true, v: c => c.warmups },
    { id: 'days',       icon: '📅', en: 'Regular',        ar: 'منتظم',           den: 'training days',   dar: 'يوم تمرين',      t: [4, 20, 50],   scale: true, v: c => c.days.length },
    { id: 'streak',     icon: '⚡', en: 'On Fire',        ar: 'مولّع',            den: 'weeks in a row (2+ days)', dar: 'أسبوع ورا بعض (يومين+)', t: [2, 6, 12], scale: true, v: c => c.bestWeekStreak },
    { id: 'games',      icon: '🎮', en: 'Gamer',          ar: 'لعّيب',            den: 'games played',    dar: 'لعبة',           t: [20, 100, 300], scale: true, v: c => c.played.length },
    { id: 'passes',     icon: '✅', en: 'Passer',         ar: 'بيعدّي',           den: 'passes (85%+)',   dar: 'نجاح (٨٥٪+)',    t: [5, 40, 120],  scale: true, v: c => c.passes },
    { id: 'perfect',    icon: '💯', en: 'Perfectionist',  ar: 'مية مية',          den: 'perfect 100%',    dar: 'مرة ١٠٠٪',      t: [1, 5, 15],    scale: true, v: c => c.perfect },
    { id: 'kicks',      icon: '🥋', en: 'Kick Master',    ar: 'أستاذ الركلات',    den: 'kicks mastered',  dar: 'ركلة متقنة',     t: [1, 2, 3],     v: c => c.mastered },
    { id: 'explorer',   icon: '🧭', en: 'Explorer',       ar: 'مستكشف',          den: 'different games', dar: 'لعبة مختلفة',    t: [4, 8, 13],    v: c => c.tried.size },
    { id: 'challenges', icon: '🏆', en: 'Challenger',     ar: 'بتاع التحديات',    den: 'daily challenges', dar: 'تحدي يومي',     t: [3, 15, 40],   scale: true, v: c => c.challengeDays.length },
    { id: 'daywins',    icon: '🥇', en: 'Top of the Day', ar: 'الأول في اليوم',   den: 'days ranked #1',  dar: 'يوم في المركز الأول', t: [1, 4, 10], scale: true, v: c => c.challengeWins },
    { id: 'duels',      icon: '⚔️', en: 'Duelist',        ar: 'مقاتل',           den: 'duels won',       dar: 'مواجهة كسبها',   t: [1, 8, 25],    scale: true, v: c => c.duelWins },
    { id: 'titles',     icon: '👑', en: 'Champion',       ar: 'البطل',            den: 'tournaments won', dar: 'بطولة',          t: [1, 2, 4],     v: c => c.titles.length },
    { id: 'awards',     icon: '🎖️', en: 'Decorated',      ar: 'متكرّم',           den: 'weekly awards',   dar: 'جايزة أسبوعية',  t: [1, 3, 6],     scale: true, v: c => c.awards.length },
    { id: 'league',     icon: '⬆️', en: 'Climber',        ar: 'طالع لفوق',        den: 'league reached',  dar: 'الدوري',         t: [1, 2, 4],     v: c => c.tier, fmt: v => League.tierName(v), noUnit: true },
    { id: 'power',      icon: '💥', en: 'Power Kicker',   ar: 'رجل حديد',         den: 'newtons',         dar: 'نيوتن',          t: [450, 650, 850], v: c => Profile.metaBest(c, ['heavy-bag'], 'bestPower')?.v || 0 },
    { id: 'reflex',     icon: '⚡', en: 'Lightning',      ar: 'البرق',            den: 's reaction',      dar: 'ث رد فعل',       t: [1.1, 0.85, 0.65], lower: true, v: c => Profile.metaBest(c, ['paddle-reflex', 'sparring-duel'], 'avgReaction', true)?.v || 0, fmt: v => v ? v.toFixed(2) : '—' }
  ],
  // coach setting: easier ×0.7 · normal ×1 · harder ×1.4 (count medals only)
  MEDAL_SCALE: { easy: 0.7, normal: 1, hard: 1.4 },
  thresholds(a) {
    const k = this.MEDAL_SCALE[League.settings().medals] || 1;
    if (!a.scale || k === 1) return a.t;
    return a.t.map((x, i) => Math.max(i + 1, Math.round(x * k)));
  },
  achTier(a, v) {
    const t = this.thresholds(a);
    if (a.lower) { if (!v) return 0; return t.filter(x => v <= x).length; }
    return t.filter(x => v >= x).length;
  },
  achievements(c) {
    return this.ACH.map(a0 => {
      const a = { ...a0, t: this.thresholds(a0) };
      const v = a.v(c), tier = this.achTier(a0, v);
      const next = tier < 3 ? a.t[tier] : null;
      let prog = 1;
      if (next !== null) prog = a.lower ? (v ? Math.max(0, Math.min(1, (a.t[0] * 1.6 - v) / (a.t[0] * 1.6 - next))) : 0) : Math.min(1, v / next);
      return { ...a, value: v, tier, next, prog };
    });
  },
  trophies(c) {
    const list = (typeof TrophyRoomSystem !== 'undefined' && TrophyRoomSystem.TROPHIES) || [];
    return list.map(t => { let ok = false; try { ok = !!t.condition(c.gs); } catch (e) {} return { ...t, ok }; });
  },
  level(achs, trophies) {
    const pts = achs.reduce((s, a) => s + a.tier, 0) + trophies.filter(t => t.ok).length;
    return { pts, level: 1 + Math.floor(pts / 3), into: pts % 3 };
  },

  // ------------------------------------------------------------ personal records
  records(c) {
    const r = [];
    const add = (id, icon, en, ar, best, fmt) => r.push({ id, icon, label: TKD.t(en, ar), v: best?.v ?? null, ts: best?.ts, text: best ? fmt(best.v) : '—' });
    add('reaction', '⚡', 'Fastest reaction', 'أسرع رد فعل', this.metaBest(c, ['paddle-reflex', 'sparring-duel'], 'avgReaction', true), v => TKD.t(`${v.toFixed(2)} s`, `${TKD.num(v.toFixed(2))} ث`));
    add('power', '💥', 'Strongest kick', 'أقوى ركلة', this.metaBest(c, ['heavy-bag'], 'bestPower'), v => `${TKD.num(v)} N`);
    const sp = this.metaBest(c, ['sparring-duel'], 'points');
    const duelBest = c.duelBest ? { v: c.duelBest } : null;
    add('points', '🥊', 'Most points in a fight', 'أكتر نقط في نزال', sp && (!duelBest || sp.v >= duelBest.v) ? sp : duelBest, v => TKD.t(`${v} pts`, `${TKD.num(v)} نقطة`));
    add('rhythm', '🥁', 'Longest rhythm streak', 'أطول سلسلة إيقاع', this.metaBest(c, ['phase-rhythm'], 'bestStreak'), v => TKD.t(`${v} notes`, `${TKD.num(v)} نوتة`));
    add('combo', '🎯', 'Best paddle combo', 'أحسن كومبو مضارب', this.metaBest(c, ['paddle-reflex'], 'bestCombo'), v => `× ${TKD.num(v)}`);
    const bal = c.att.filter(a => a.gameId === 'balance-hold' && a.meta && a.meta.falls === 0).reduce((m, a) => (!m || a.score > m.v ? { v: a.score, ts: a.ts } : m), null);
    add('balance', '⚖️', 'Best balance (no falls)', 'أحسن توازن (من غير وقوع)', bal, v => `${TKD.num(v)}%`);
    const ch = c.att.filter(a => a.meta?.challenge).reduce((m, a) => (!m || a.score > m.v ? { v: a.score, ts: a.ts } : m), null);
    add('challenge', '🏆', 'Best challenge score', 'أحسن نتيجة في التحدي', ch, v => `${TKD.num(v)}%`);
    add('streak', '🔥', 'Longest weekly streak', 'أطول سلسلة أسابيع', c.bestWeekStreak ? { v: c.bestWeekStreak } : null, v => TKD.t(`${v} weeks`, `${TKD.num(v)} أسبوع`));
    const weeks = [...new Set(c.days.map(d => TKD.weekKey(new Date(d + 'T12:00:00'))))];
    const bw = weeks.map(w => ({ v: League.pointsFor(c.p.id, w).total, ts: new Date(w + 'T12:00:00').getTime() })).sort((a, b) => b.v - a.v)[0];
    add('week', '📈', 'Best week', 'أحسن أسبوع', bw && bw.v ? bw : null, v => TKD.t(`${v} pts`, `${TKD.num(v)} نقطة`));
    return r;
  },

  // ------------------------------------------------------------ timeline
  timeline(c) {
    const ev = [];
    const push = (ts, icon, text) => { if (ts) ev.push({ ts, icon, text }); };
    push(c.p.createdAt, '🎉', TKD.t('Joined Taekwondo Journey', 'بدأ رحلة التايكوندو'));
    const w = c.att.find(a => a.gameId === 'warmup'); push(w?.ts, '🔥', TKD.t('First warm-up', 'أول إحماء'));
    GameConfig.SKILL_ORDER.forEach(sk => {
      const first = c.att.find(a => a.skillId === sk && a.gameId !== 'warmup');
      if (first && sk !== 'apchagi') push(first.ts, '🔓', TKD.t(`Started ${TKD.skillName(sk)}`, `بدأ ${TKD.skillName(sk)}`));
      const q = c.att.find(a => a.skillId === sk && a.gameId === 'quiz' && a.score >= GameConfig.SETTINGS.PASSING_SCORE);
      push(q?.ts, '🎓', TKD.t(`Passed the ${TKD.skillName(sk)} test`, `عدّى اختبار ${TKD.skillName(sk)}`));
    });
    const perf = c.played.find(a => a.score >= 100); push(perf?.ts, '💯', TKD.t(`First 100% — ${TKD.gameName(perf?.gameId)}`, `أول ١٠٠٪ — ${TKD.gameName(perf?.gameId)}`));
    (c.p.badges || []).forEach(b => push(new Date((b.week || TKD.dayKey()) + 'T20:00:00').getTime(), League.AWARDS[b.id]?.icon || '🏅', League.awardName(b.id).replace(/^\S+\s/, '')));
    const dw = c.att.find(a => a.meta?.challenge && Challenge.ranking(a.meta.challenge)[0]?.pid === c.p.id);
    push(dw?.ts, '🥇', TKD.t('First day ranked #1 in the challenge', 'أول يوم في المركز الأول في التحدي'));
    const duel = window.Versus ? Versus.load().matches.find(m => m.winner === c.p.id) : null;
    push(duel?.ts, '⚔️', TKD.t('First duel won', 'أول مواجهة كسبها'));
    return ev.sort((a, b) => b.ts - a.ts);
  },

  // ------------------------------------------------------------ open / render
  open(pid) { this.pid = pid || PlayerSystem.getCurrentPlayerId(); this.month = 0; this.showAllTimeline = false; switchScreen('profile'); },
  init() { if (!this.pid || !PlayerSystem.getPlayers().find(p => p.id === this.pid)) this.pid = PlayerSystem.getCurrentPlayerId() || PlayerSystem.getPlayers()[0]?.id; this.render(); },
  render() {
    const root = TKD.$('profile-root'); if (!root) return;
    const c = this.ctx(this.pid);
    if (!c) { root.innerHTML = `<p class="lg-empty">${TKD.t('No players yet.', 'لسه مفيش لاعبين.')}</p>`; return; }
    const achs = this.achievements(c), trophies = this.trophies(c), lv = this.level(achs, trophies);
    const me = c.p.id === PlayerSystem.getCurrentPlayerId();
    const tier = League.TIERS[c.tier];
    const medals = [0, 1, 2].map(i => achs.filter(a => a.tier > i).length);
    const recs = this.records(c);
    root.innerHTML = `
      ${this.heroHTML(c, lv, tier, medals, trophies, me)}
      ${this.compareHTML(c)}
      ${(() => { const w = window.Review ? Review.weakest(c.p.id, 3) : []; return w.length ? `<section class="pf-sec pf-review"><h3>🧠 ${TKD.t('Worth reviewing', 'محتاج يراجع')}</h3><ul>${w.map(x => `<li>${TKD.esc(Review.label(x))}</li>`).join('')}</ul></section>` : ''; })()}
      <section class="pf-sec"><h3>🥋 ${TKD.t('Kicks', 'الركلات')}</h3>${window.DashboardSystem ? DashboardSystem.masteryHTML(c.p.id) : ''}</section>
      <section class="pf-sec"><h3>🏅 ${TKD.t('Achievements', 'الإنجازات')} <small>${TKD.t(`${medals[0]} bronze · ${medals[1]} silver · ${medals[2]} gold`, `${TKD.num(medals[0])} برونز · ${TKD.num(medals[1])} فضة · ${TKD.num(medals[2])} دهب`)}</small></h3>
        <div class="pf-ach">${achs.map(a => this.achHTML(a)).join('')}</div></section>
      <section class="pf-sec"><h3>🏆 ${TKD.t('Trophies', 'الكاسات')} <small>${TKD.num(trophies.filter(t => t.ok).length)} / ${TKD.num(trophies.length)}</small></h3>
        <div class="pf-troph">${trophies.map(t => `<div class="pf-trophy ${t.ok ? 'ok' : ''}" title="${TKD.esc(TKD.ar ? t.desc.ar : t.desc.en)}"><span>${t.ok ? t.icon : '🔒'}</span><b>${TKD.esc(TKD.ar ? t.name.ar : t.name.en)}</b><small>${TKD.esc(TKD.ar ? t.desc.ar : t.desc.en)}</small></div>`).join('')}</div></section>
      <section class="pf-sec"><h3>📊 ${TKD.t('Personal records', 'أرقامي القياسية')}</h3>
        <div class="pf-recs">${recs.map(r => `<div class="pf-rec ${r.v === null ? 'empty' : ''}"><span class="pf-rec-i">${r.icon}</span><span class="pf-rec-l">${r.label}</span><b>${r.text}</b>${r.ts ? `<small>${new Date(r.ts).toLocaleDateString(TKD.ar ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' })}</small>` : ''}</div>`).join('')}</div></section>
      <section class="pf-sec">${this.calendarHTML(c)}</section>
      <section class="pf-sec">${this.timelineHTML(c)}</section>`;
    this.bind(root, c, achs, trophies, lv, medals);
  },
  heroHTML(c, lv, tier, medals, trophies, me) {
    const belt = c.belt;
    return `<section class="pf-hero" style="--tier:${tier.color}">
      <div class="pf-hero-av">${TKD.avatar(c.p, 'xl')}<span class="pf-lvl" title="${TKD.t('Level', 'المستوى')}">${TKD.num(lv.level)}</span></div>
      <div class="pf-hero-main">
        <h2>${TKD.esc(c.p.name)}${me ? ` <em>${TKD.t('(you)', '(إنت)')}</em>` : ''}</h2>
        <div class="pf-tags"><span>${tier.icon} ${League.tierName(c.tier)}</span>
          <span class="pf-belt"><i style="background:${belt.color};border-color:${belt.accent}">${'<b></b>'.repeat(belt.stripes)}</i>${TKD.esc(TKD.ar ? belt.name.ar : belt.name.en)}</span></div>
        <div class="pf-xp"><span>${TKD.t(`Level ${lv.level}`, `المستوى ${TKD.num(lv.level)}`)}</span><div class="pf-xp-bar"><i style="width:${(lv.into / 3) * 100}%"></i></div><small>${TKD.t(`${3 - lv.into} more medals to level ${lv.level + 1}`, `فاضل ${TKD.num(3 - lv.into)} ميداليات للمستوى ${TKD.num(lv.level + 1)}`)}</small></div>
      </div>
      <div class="pf-tiles">
        <div><b>🔥 ${TKD.num(c.weekStreak)}</b><small>${TKD.t('weeks in a row', 'أسبوع ورا بعض')}</small></div>
        <div><b>${TKD.num(League.pointsFor(c.p.id).total)}</b><small>${TKD.t('pts this week', 'نقطة الأسبوع ده')}</small></div>
        <div><b>🥇 ${TKD.num(medals[2])}</b><small>${TKD.t('gold medals', 'ميدالية دهب')}</small></div>
        <div><b>🏆 ${TKD.num(trophies.filter(t => t.ok).length)}</b><small>${TKD.t('trophies', 'كاس')}</small></div>
      </div>
      <div class="pf-hero-btns">
        <button type="button" class="btn btn-success btn-small" id="pf-share">🖼️ ${TKD.t('Save my card', 'احفظ الكارت بتاعي')}</button>
        ${!me ? `<button type="button" class="btn btn-small" id="pf-duel">⚔️ ${TKD.t('Challenge', 'تحدّاه')}</button>` : ''}
        <button type="button" class="btn btn-small" id="pf-all">👥 ${TKD.t('All players', 'كل اللاعبين')}</button>
      </div></section>`;
  },
  compareHTML(c) {
    const wk = TKD.weekKey(), lw = TKD.addDays(wk, -7);
    const inWeek = (w) => c.att.filter(a => TKD.dayKey(a.ts) >= w && TKD.dayKey(a.ts) < TKD.addDays(w, 7));
    const stat = (w) => { const l = inWeek(w), pl = l.filter(a => !this.PLAYED_EXCLUDE.has(a.gameId)); return { pts: League.pointsFor(c.p.id, w).total, games: pl.length, avg: pl.length ? Math.round(pl.reduce((s, a) => s + a.score, 0) / pl.length) : 0, warm: new Set(l.filter(a => a.gameId === 'warmup').map(a => TKD.dayKey(a.ts))).size }; };
    const a = stat(wk), b = stat(lw);
    const cell = (label, x, y, unit = '') => {
      const d = x - y, cls = d > 0 ? 'up' : d < 0 ? 'down' : '';
      return `<div class="pf-cmp-c"><small>${label}</small><b>${TKD.num(x)}${unit}</b><span class="${cls}">${d > 0 ? '▲' : d < 0 ? '▼' : '＝'} ${TKD.num(Math.abs(d))}${unit}</span></div>`;
    };
    const msg = a.pts > b.pts ? TKD.t(`You're ahead of last week by ${a.pts - b.pts} points — keep it up! 💪`, `إنت متقدم عن الأسبوع اللي فات بـ${TKD.num(a.pts - b.pts)} نقطة — كمّل كده! 💪`)
      : a.pts === b.pts ? TKD.t('Level with last week — one more warm-up puts you ahead!', 'زي الأسبوع اللي فات بالظبط — إحماء واحد كمان وتبقى متقدم!')
      : TKD.t(`${b.pts - a.pts} points to beat last week — you can do it!`, `فاضل ${TKD.num(b.pts - a.pts)} نقطة وتكسب الأسبوع اللي فات — تقدر!`);
    return `<section class="pf-sec pf-cmp"><h3>📈 ${TKD.t('This week vs last week', 'الأسبوع ده قصاد اللي فات')}</h3>
      <div class="pf-cmp-row">${cell(TKD.t('Points', 'النقط'), a.pts, b.pts)}${cell(TKD.t('Games', 'الألعاب'), a.games, b.games)}${cell(TKD.t('Average', 'المتوسط'), a.avg, b.avg, '%')}${cell(TKD.t('Warm-up days', 'أيام الإحماء'), a.warm, b.warm)}</div>
      <p class="pf-cmp-msg">${msg}</p></section>`;
  },
  achHTML(a) {
    const T = this.TIER_NAMES;
    const cur = a.tier ? T[a.tier - 1] : null;
    const fmt = a.fmt || (v => TKD.num(Math.round(v * 100) / 100));
    const nextTxt = a.next === null ? TKD.t('Max level!', 'أعلى مستوى!')
      : a.lower ? TKD.t(`${T[a.tier].icon} at ${a.next.toFixed(1)} s`, `${T[a.tier].icon} عند ${TKD.num(a.next.toFixed(1))} ث`)
      : TKD.t(`${T[a.tier].icon} at ${a.fmt ? a.fmt(a.next) : a.next}`, `${T[a.tier].icon} عند ${a.fmt ? a.fmt(a.next) : TKD.num(a.next)}`);
    return `<div class="pf-a t${a.tier}" style="--c:${cur ? cur.color : 'rgba(255,255,255,0.15)'}">
      <div class="pf-a-medal">${a.icon}${cur ? `<i>${cur.icon}</i>` : ''}</div>
      <div class="pf-a-body"><b>${TKD.ar ? a.ar : a.en}</b>
        <small>${fmt(a.value)}${a.noUnit ? '' : ' ' + (TKD.ar ? a.dar : a.den)}</small>
        <div class="pf-a-bar"><i style="width:${Math.round(a.prog * 100)}%"></i></div>
        <small class="pf-a-next">${nextTxt}</small></div></div>`;
  },
  calendarHTML(c) {
    const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + this.month);
    const y = base.getFullYear(), m = base.getMonth();
    const first = new Date(y, m, 1), daysIn = new Date(y, m + 1, 0).getDate();
    const lead = (first.getDay() + 1) % 7;              // weeks start on Saturday
    const per = {}, warm = new Set();
    c.att.forEach(a => { const d = TKD.dayKey(a.ts); per[d] = (per[d] || 0) + 1; if (a.gameId === 'warmup') warm.add(d); });
    const lvl = (n) => (!n ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4);
    const names = TKD.ar ? ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'] : ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'];
    const today = TKD.dayKey();
    let cells = '';
    for (let i = 0; i < lead; i++) cells += '<span class="pf-day pad"></span>';
    let trained = 0;
    for (let d = 1; d <= daysIn; d++) {
      const key = TKD.dayKey(new Date(y, m, d)), n = per[key] || 0;
      if (n) trained++;
      cells += `<span class="pf-day l${lvl(n)} ${key === today ? 'today' : ''}" title="${key}: ${n}">${TKD.num(d)}${warm.has(key) ? '<i>🔥</i>' : ''}</span>`;
    }
    const title = first.toLocaleDateString(TKD.ar ? 'ar-EG' : 'en-GB', { month: 'long', year: 'numeric' });
    return `<div class="pf-cal-head"><h3>🗓️ ${TKD.t('Training calendar', 'تقويم التمرين')}</h3>
        <div class="pf-cal-nav"><button type="button" data-cal="-1" aria-label="${TKD.t('previous month', 'الشهر اللي فات')}">${TKD.ar ? '›' : '‹'}</button><b>${title}</b><button type="button" data-cal="1" ${this.month >= 0 ? 'disabled' : ''} aria-label="${TKD.t('next month', 'الشهر الجاي')}">${TKD.ar ? '‹' : '›'}</button></div></div>
      <div class="pf-cal">${names.map(n => `<span class="pf-dow">${n}</span>`).join('')}${cells}</div>
      <div class="pf-cal-foot"><span>${TKD.t(`Trained ${trained} days this month`, `اتمرن ${TKD.num(trained)} يوم في الشهر ده`)}</span>
        <span class="pf-cal-key">${TKD.t('less', 'أقل')} <i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i> ${TKD.t('more', 'أكتر')} · 🔥 ${TKD.t('warm-up', 'إحماء')}</span></div>`;
  },
  timelineHTML(c) {
    const ev = this.timeline(c);
    const list = this.showAllTimeline ? ev : ev.slice(0, 8);
    return `<h3>🧭 ${TKD.t('My journey', 'رحلتي')}</h3>
      ${ev.length ? `<ol class="pf-tl">${list.map(e => `<li><span class="pf-tl-i">${e.icon}</span><span>${TKD.esc(e.text)}</span><small>${new Date(e.ts).toLocaleDateString(TKD.ar ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</small></li>`).join('')}</ol>
        ${ev.length > 8 && !this.showAllTimeline ? `<button type="button" class="btn btn-small" id="pf-tl-more">${TKD.t(`Show all (${ev.length})`, `اعرض الكل (${TKD.num(ev.length)})`)}</button>` : ''}`
        : `<p class="lg-empty">${TKD.t('The journey starts with the first warm-up!', 'الرحلة بتبدأ بأول إحماء!')}</p>`}`;
  },
  bind(root, c, achs, trophies, lv, medals) {
    root.querySelectorAll('[data-cal]').forEach(b => b.addEventListener('click', () => { this.month = Math.min(0, this.month + (+b.dataset.cal)); this.render(); }));
    TKD.$('pf-tl-more')?.addEventListener('click', () => { this.showAllTimeline = true; this.render(); });
    TKD.$('pf-all')?.addEventListener('click', () => switchScreen('players'));
    TKD.$('pf-duel')?.addEventListener('click', () => { Versus.mode = 'friendly'; Versus.sel = { ...Versus.sel, p1: PlayerSystem.getCurrentPlayerId(), p2: c.p.id }; switchScreen('versus'); });
    TKD.$('pf-share')?.addEventListener('click', () => this.shareCard(c, achs, trophies, lv, medals));
  },

  // ------------------------------------------------------------ shareable PNG card
  async shareCard(c, achs, trophies, lv, medals) {
    const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d'); const tier = League.TIERS[c.tier];
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1d3557'); bg.addColorStop(0.55, '#15232c'); bg.addColorStop(1, '#3a1420');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = tier.color; g.lineWidth = 14; g.beginPath(); g.roundRect(30, 30, W - 60, H - 60, 40); g.stroke();
    const img = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = `assets/images/characters/${c.p.character === 'girl' ? 'girl' : 'boy'}_char/${c.p.character === 'girl' ? 'girl' : 'boy'}_idle.webp`; });
    g.save(); g.beginPath(); g.arc(W / 2, 330, 190, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,0.08)'; g.fill(); g.clip();
    if (img) { const h = 520, w = img.width * h / img.height; g.drawImage(img, W / 2 - w / 2, 170, w, h); }
    g.restore();
    g.lineWidth = 8; g.strokeStyle = tier.color; g.beginPath(); g.arc(W / 2, 330, 190, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#ff6b35'; g.beginPath(); g.arc(W / 2 + 150, 190, 58, 0, Math.PI * 2); g.fill();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = TKD.ar ? 'rtl' : 'ltr';
    g.fillStyle = '#fff'; g.font = '900 56px Cairo, "Noto Sans Arabic", Roboto, system-ui, Tahoma, sans-serif'; g.fillText(TKD.num(lv.level), W / 2 + 150, 194);
    g.font = '900 96px Cairo, "Noto Sans Arabic", Roboto, system-ui, Tahoma, sans-serif'; g.fillText(c.p.name, W / 2, 610);
    g.font = '700 44px Cairo, "Noto Sans Arabic", Roboto, system-ui, Tahoma, sans-serif'; g.fillStyle = tier.color; g.fillText(`${tier.icon} ${League.tierName(c.tier)}`, W / 2, 695);
    g.fillStyle = '#cfd8dc'; g.font = '600 38px Cairo, "Noto Sans Arabic", Roboto, system-ui, Tahoma, sans-serif'; g.fillText(TKD.ar ? c.belt.name.ar : c.belt.name.en, W / 2, 755);
    const tiles = [[`🔥 ${TKD.num(c.weekStreak)}`, TKD.t('weeks in a row', 'أسبوع ورا بعض')], [TKD.num(League.pointsFor(c.p.id).total), TKD.t('pts this week', 'نقطة الأسبوع')], [`🥇 ${TKD.num(medals[2])}`, TKD.t('gold medals', 'ميدالية دهب')], [`🏆 ${TKD.num(trophies.filter(t => t.ok).length)}`, TKD.t('trophies', 'كاس')]];
    tiles.forEach(([v, l], i) => {
      const x = 90 + (i % 2) * 460, y = 820 + Math.floor(i / 2) * 170;
      g.fillStyle = 'rgba(255,255,255,0.07)'; g.beginPath(); g.roundRect(x, y, 440, 150, 26); g.fill();
      g.fillStyle = '#fff'; g.font = '900 56px Cairo, "Noto Sans Arabic", Roboto, system-ui, Tahoma, sans-serif'; g.fillText(v, x + 220, y + 62);
      g.fillStyle = '#9fb3c0'; g.font = '600 30px Cairo, "Noto Sans Arabic", Roboto, system-ui, Tahoma, sans-serif'; g.fillText(l, x + 220, y + 116);
    });
    const top = achs.filter(a => a.tier).sort((a, b) => b.tier - a.tier).slice(0, 6);
    g.font = '64px system-ui, "Segoe UI Emoji", sans-serif';
    top.forEach((a, i) => g.fillText(a.icon, W / 2 + (i - (top.length - 1) / 2) * 120, 1200));
    g.fillStyle = '#ff6b35'; g.font = '800 34px Cairo, "Noto Sans Arabic", Roboto, system-ui, Tahoma, sans-serif'; g.fillText(`🥋 ${TKD.t('Taekwondo Journey', 'رحلة التايكوندو')}`, W / 2, 1280);
    cv.toBlob(b => {
      const url = URL.createObjectURL(b), l = document.createElement('a');
      l.href = url; l.download = `hero-${String(c.p.name).replace(/[^\w؀-ۿ-]+/g, '_')}.png`;
      document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(url), 3000);
    });
    TKD.toast(TKD.t('🖼️ Card saved', '🖼️ الكارت اتحفظ'), 'success');
  },

  // ------------------------------------------------------------ live "new record / achievement" pop-ups
  snapshot(pid) {
    const c = this.ctx(pid); if (!c) return null;
    return { recs: Object.fromEntries(this.records(c).map(r => [r.id, r])), achs: Object.fromEntries(this.achievements(c).map(a => [a.id, a])) };
  },
  wrapLogging() {
    const orig = PlayerSystem.logAttempt.bind(PlayerSystem);
    const lowerIsBetter = new Set(['reaction']);
    PlayerSystem.logAttempt = (...args) => {
      const pid = PlayerSystem.getCurrentPlayerId();
      let before = null;
      try { before = pid ? this.snapshot(pid) : null; } catch (e) {}
      orig(...args);
      if (!before) return;
      setTimeout(() => {
        try {
          const after = this.snapshot(pid); if (!after) return;
          const news = [];
          Object.values(after.recs).forEach(r => {
            const b = before.recs[r.id];
            if (r.v === null || !b || b.v === null || r.id === 'streak' || r.id === 'week') return;
            if (lowerIsBetter.has(r.id) ? r.v < b.v : r.v > b.v) news.push(`📊 ${TKD.t('New record!', 'رقم قياسي جديد!')} ${r.icon} ${r.label}: ${r.text}`);
          });
          Object.values(after.achs).forEach(a => {
            const b = before.achs[a.id];
            if (b && a.tier > b.tier) news.push(`🏅 ${TKD.t('New achievement!', 'إنجاز جديد!')} ${a.icon} ${TKD.ar ? a.ar : a.en} — ${this.TIER_NAMES[a.tier - 1].icon} ${TKD.ar ? this.TIER_NAMES[a.tier - 1].ar : this.TIER_NAMES[a.tier - 1].en}`);
          });
          news.slice(0, 3).forEach((m, i) => setTimeout(() => { TKD.toast(m, 'success'); if (i === 0) { TKD.gs()?.playSound('success'); window.AudioKit?.sfx('star'); window.Voice?.cue(/📊/.test(m) ? 'record' : 'levelup'); } }, 2600 + i * 1400));
        } catch (e) {}
      }, 50);
    };
  }
};
window.Profile = Profile;

// =====================================================================
// ALL PLAYERS
// =====================================================================
const PlayersPage = {
  sort: 'week',
  init() { this.render(); },
  render() {
    const root = TKD.$('players-root'); if (!root) return;
    const rows = PlayerSystem.getPlayers().map(p => {
      const c = Profile.ctx(p.id), achs = Profile.achievements(c), tro = Profile.trophies(c), lv = Profile.level(achs, tro);
      const recs = Object.fromEntries(Profile.records(c).map(r => [r.id, r]));
      const last = c.att.length ? c.att[c.att.length - 1].ts : p.createdAt || 0;
      return { p, c, lv, recs, last, week: League.pointsFor(p.id).total, gold: achs.filter(a => a.tier === 3).length, medals: achs.reduce((s, a) => s + a.tier, 0), trophies: tro.filter(t => t.ok).length };
    });
    if (!rows.length) { root.innerHTML = `<p class="lg-empty">${TKD.t('No players yet.', 'لسه مفيش لاعبين.')}</p>`; return; }
    const sorts = {
      week: [TKD.t('Week points', 'نقط الأسبوع'), (a, b) => b.week - a.week],
      level: [TKD.t('Level', 'المستوى'), (a, b) => b.lv.pts - a.lv.pts],
      streak: [TKD.t('Streak', 'السلسلة'), (a, b) => b.c.weekStreak - a.c.weekStreak || b.c.bestWeekStreak - a.c.bestWeekStreak],
      warm: [TKD.t('Warm-ups', 'الإحماء'), (a, b) => b.c.warmups - a.c.warmups],
      recent: [TKD.t('Recent', 'الأحدث'), (a, b) => b.last - a.last]
    };
    rows.sort(sorts[this.sort][1]);
    // gym-wide records
    const holder = (id, lower) => rows.filter(r => r.recs[id]?.v != null).sort((a, b) => lower ? a.recs[id].v - b.recs[id].v : b.recs[id].v - a.recs[id].v)[0];
    const gymRecs = [['reaction', true], ['power', false], ['points', false], ['streak', false], ['challenge', false]].map(([id, lower]) => {
      const h = holder(id, lower); if (!h) return '';
      const r = h.recs[id];
      return `<button type="button" class="pl-rec" data-pid="${h.p.id}"><span class="pl-rec-i">${r.icon}</span><span class="pl-rec-t"><small>${r.label}</small><b>${r.text}</b></span>${TKD.avatar(h.p)}<span class="pl-rec-n">${TKD.esc(h.p.name)}</span></button>`;
    }).join('');
    const mostLvl = [...rows].sort(sorts.level[1])[0];
    root.innerHTML = `
      ${gymRecs || mostLvl ? `<section class="pf-sec"><h3>🏟️ ${TKD.t('Gym records', 'الأرقام القياسية في الصالة')}</h3><div class="pl-recs">
        ${mostLvl ? `<button type="button" class="pl-rec" data-pid="${mostLvl.p.id}"><span class="pl-rec-i">⭐</span><span class="pl-rec-t"><small>${TKD.t('Highest level', 'أعلى مستوى')}</small><b>${TKD.t(`Level ${mostLvl.lv.level}`, `المستوى ${TKD.num(mostLvl.lv.level)}`)}</b></span>${TKD.avatar(mostLvl.p)}<span class="pl-rec-n">${TKD.esc(mostLvl.p.name)}</span></button>` : ''}
        ${gymRecs}</div></section>` : ''}
      <div class="pl-sort" role="radiogroup">${Object.entries(sorts).map(([k, [l]]) => `<button type="button" role="radio" aria-checked="${this.sort === k}" class="${this.sort === k ? 'on' : ''}" data-sort="${k}">${l}</button>`).join('')}</div>
      <div class="pl-grid">${rows.map((r, i) => {
        const tier = League.TIERS[r.c.tier];
        return `<button type="button" class="pl-card ${r.p.id === PlayerSystem.getCurrentPlayerId() ? 'me' : ''}" data-pid="${r.p.id}" style="--tier:${tier.color}">
          <span class="pl-pos">${i < 3 ? ['🥇', '🥈', '🥉'][i] : TKD.num(i + 1)}</span>
          <span class="pl-av">${TKD.avatar(r.p, 'lg')}<span class="pf-lvl">${TKD.num(r.lv.level)}</span></span>
          <b class="pl-name">${TKD.esc(r.p.name)}</b>
          <small>${tier.icon} ${League.tierName(r.c.tier)}</small>
          <span class="pl-belt"><i style="background:${r.c.belt.color};border-color:${r.c.belt.accent}">${'<b></b>'.repeat(r.c.belt.stripes)}</i></span>
          <span class="pl-stats"><span>🔥 ${TKD.num(r.c.weekStreak)}</span><span>📈 ${TKD.num(r.week)}</span><span>🏅 ${TKD.num(r.medals)}</span><span>🏆 ${TKD.num(r.trophies)}</span></span>
        </button>`;
      }).join('')}</div>`;
    root.querySelectorAll('[data-sort]').forEach(b => b.addEventListener('click', () => { this.sort = b.dataset.sort; TKD.gs()?.playSound('click'); this.render(); }));
    root.querySelectorAll('[data-pid]').forEach(b => b.addEventListener('click', () => Profile.open(b.dataset.pid)));
  }
};
window.PlayersPage = PlayersPage;

// ------------------------------------------------------------ wiring
Object.assign(window.TKDScreens, { profile: () => Profile.init(), players: () => PlayersPage.init() });
GameConfig.BACKGROUNDS.PROFILE = 'assets/images/backgrounds/memory_dojo_bg.webp';
GameConfig.BACKGROUNDS.PLAYERS = 'assets/images/backgrounds/arena_bg.webp';
Profile.wrapLogging();
(function wrapLanguage() {
  const orig = GameState.prototype.applyLanguage;
  GameState.prototype.applyLanguage = function () {
    const r = orig.apply(this, arguments);
    try {
      if (document.querySelector('#profile-screen.active')) Profile.render();
      if (document.querySelector('#players-screen.active')) PlayersPage.render();
    } catch (e) {}
    return r;
  };
})();
