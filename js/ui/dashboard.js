/* =====================================================================
   TAEKWONDO JOURNEY — PLAYER DASHBOARD (v20)
   Scores and insights for EVERY player registered on this device, built
   from the per-attempt log PlayerSystem keeps (taekwondoJourneyAttempts).
   Charts are plain inline SVG (no library), with hover/tap tooltips.
   ===================================================================== */
'use strict';

const DashboardSystem = {
  GAMES: {
    'warmup':        { icon: '🔥', en: 'Warm-up',          ar: 'الإحماء' },
    'learning':      { icon: '🎓', en: 'Learning',         ar: 'التعلم' },
    'form-control':  { icon: '🎭', en: 'Form Control',     ar: 'التحكم في الوضعية' },
    'puzzle':        { icon: '🧩', en: 'Puzzle',           ar: 'ركّب الأجزاء' },
    'performance':   { icon: '👁️', en: 'Performance',      ar: 'اعرف الأداء الصح' },
    'action':        { icon: '⚡', en: 'Action Challenge', ar: 'تحدي الضربة' },
    'error-hunt':    { icon: '🔍', en: 'Error Hunt',       ar: 'صياد الأخطاء' },
    'quiz-blast':    { icon: '🚀', en: 'Quiz Blast',       ar: 'كويز الفضاء' },
    'board-break':   { icon: '🪵', en: 'Board Break',      ar: 'كسر الألواح' },
    'paddle-reflex': { icon: '🎯', en: 'Target Paddles',   ar: 'مضارب الأهداف' },
    'phase-rhythm':  { icon: '🥁', en: 'Kick Rhythm',      ar: 'إيقاع الركلة' },
    'sparring-duel': { icon: '🥊', en: 'Sparring Duel',    ar: 'نزال القتال' },
    'balance-hold':  { icon: '⚖️', en: 'Balance Hold',     ar: 'ثبات التوازن' },
    'heavy-bag':     { icon: '🥋', en: 'Heavy Bag',        ar: 'كيس الملاكمة' },
    'quiz':          { icon: '📝', en: 'Test',             ar: 'الاختبار' }
  },
  // games that are real "played" activities (warm-up/learning are stages)
  PLAYED: ['form-control', 'puzzle', 'performance', 'action', 'error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'quiz'],
  SKILL_COLORS: { apchagi: '#3987e5', narochagi: '#d95926', bakchagi3: '#199e70' },   // validated vs the dark card surface
  SEQ: ['#0d366b', '#104281', '#184f95', '#1c5cab', '#256abf', '#2a78d6', '#3987e5', '#5598e7', '#6da7ec', '#86b6ef'],

  state: { playerId: null, skill: 'all', range: 'all' },

  get ar() { return GameStateInstance?.currentLanguage === 'ar'; },
  t(en, ar) { return this.ar ? ar : en; },
  gName(id) { const g = this.GAMES[id]; return g ? (this.ar ? g.ar : g.en) : id; },
  sName(id) { const s = GameConfig.SKILLS[id]; return s ? (this.ar ? s.name.ar : s.name.en).replace(/\s*\(.*\)$/, '') : id; },
  esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
  day(ts) { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; },
  fmtDate(ts, withTime = false) {
    if (!ts) return '—';
    const o = withTime ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short' };
    return new Date(ts).toLocaleString(this.ar ? 'ar-EG' : 'en-GB', o);
  },

  initialize(gameState) {
    this.gs = gameState;
    if (!this._boundExport) {
      this._boundExport = true;
      document.getElementById('db-export-player')?.addEventListener('click', () => this.exportCSV(this.state.playerId));
      document.getElementById('db-export-all')?.addEventListener('click', () => this.exportCSV(null));
    }
    const players = PlayerSystem.getPlayers();
    if (!this.state.playerId || !players.some(p => p.id === this.state.playerId)) {
      this.state.playerId = PlayerSystem.getCurrentPlayerId() || players[0]?.id || null;
    }
    this.render();
  },

  // ---------------------------------------------------------------- data
  attemptsFor(playerId) {
    const { skill, range } = this.state;
    const since = range === '7d' ? Date.now() - 7 * 864e5 : range === '30d' ? Date.now() - 30 * 864e5 : 0;
    return PlayerSystem.getAttempts()
      .filter(a => a.playerId === playerId && a.ts >= since && (skill === 'all' || a.skillId === skill))
      .sort((a, b) => a.ts - b.ts);
  },

  summarize(list) {
    const played = list.filter(a => this.PLAYED.includes(a.gameId));
    const best = {};             // "skill:game" → best
    const perGame = {};          // game → {n, sum, best, pass}
    played.forEach(a => {
      const k = `${a.skillId}:${a.gameId}`;
      best[k] = Math.max(best[k] ?? 0, a.score);
      const g = (perGame[a.gameId] ||= { n: 0, sum: 0, best: 0, pass: 0 });
      g.n++; g.sum += a.score; g.best = Math.max(g.best, a.score); if (a.score >= GameConfig.SETTINGS.PASSING_SCORE) g.pass++;
    });
    const days = new Set(list.map(a => this.day(a.ts)));
    const passCount = played.filter(a => a.score >= GameConfig.SETTINGS.PASSING_SCORE).length;
    return {
      list, played, best, perGame, days,
      points: Object.values(best).reduce((s, v) => s + v, 0),
      attempts: played.length,
      passRate: played.length ? Math.round((passCount / played.length) * 100) : null,
      avg: played.length ? Math.round(played.reduce((s, a) => s + a.score, 0) / played.length) : null,
      warmups: list.filter(a => a.gameId === 'warmup').length,
      last: list.length ? list[list.length - 1].ts : 0
    };
  },

  insights(S) {
    const out = [];
    const ar = this.ar;
    const PASS = GameConfig.SETTINGS.PASSING_SCORE;
    if (!S.played.length) {
      out.push({ icon: '🌱', tone: 'info', title: this.t('Just getting started', 'لسه في الأول'), text: this.t('Play any game to see scores and tips here.', 'العب أي لعبة عشان تشوف النتايج والنصايح هنا.') });
      return out;
    }
    const games = Object.entries(S.perGame).map(([id, g]) => ({ id, avg: Math.round(g.sum / g.n), ...g }));
    const strong = [...games].sort((a, b) => b.avg - a.avg)[0];
    const weak = [...games].filter(g => g.n >= 1).sort((a, b) => a.avg - b.avg)[0];
    out.push({ icon: '💪', tone: 'good', title: this.t('Strongest game', 'أقوى لعبة'), text: `${this.GAMES[strong.id]?.icon || ''} ${this.gName(strong.id)} — ${this.t('average', 'المتوسط')} ${strong.avg}%` });
    if (weak && weak.id !== strong.id) {
      out.push({ icon: '🎯', tone: weak.avg < PASS ? 'warn' : 'info', title: this.t('Needs the most practice', 'محتاجة تمرين أكتر'), text: `${this.GAMES[weak.id]?.icon || ''} ${this.gName(weak.id)} — ${this.t('average', 'المتوسط')} ${weak.avg}%${weak.best < PASS ? this.t(`, best ${weak.best}% (pass is ${PASS}%)`, `، أحسن نتيجة ${weak.best}% (النجاح من ${PASS}%)`) : ''}` });
    }
    // trend: last 5 vs previous 5
    const sc = S.played.map(a => a.score);
    if (sc.length >= 6) {
      const n = Math.min(5, Math.floor(sc.length / 2));
      const recent = sc.slice(-n).reduce((s, v) => s + v, 0) / n;
      const before = sc.slice(-2 * n, -n).reduce((s, v) => s + v, 0) / n;
      const d = Math.round(recent - before);
      if (d >= 3) out.push({ icon: '📈', tone: 'good', title: this.t('Improving', 'بيتحسن'), text: this.t(`Last ${n} games average ${d} points higher than the ${n} before.`, `متوسط آخر ${n} ألعاب أعلى بـ ${d} نقطة من الـ ${n} اللي قبلهم.`) });
      else if (d <= -3) out.push({ icon: '📉', tone: 'warn', title: this.t('Dipping lately', 'نزل شوية'), text: this.t(`Last ${n} games are ${-d} points lower than before — a short warm-up and the Learning cards usually help.`, `آخر ${n} ألعاب أقل بـ ${-d} نقطة — إحماء صغير وكروت التعلم هيساعدوك.`) });
      else out.push({ icon: '➖', tone: 'info', title: this.t('Steady', 'ثابت'), text: this.t('Scores are holding steady.', 'النتايج ثابتة.') });
    }
    // retries
    const retried = games.filter(g => g.n >= 3);
    if (retried.length) {
      const g = retried.sort((a, b) => b.n - a.n)[0];
      out.push({ icon: '🔁', tone: 'info', title: this.t('Never gives up', 'مش بيستسلم'), text: this.t(`${g.n} tries at ${this.gName(g.id)} — best ${g.best}%.`, `${g.n} محاولات في ${this.gName(g.id)} — أحسن نتيجة ${g.best}%.`) });
    }
    // warm-up habit
    const sessions = S.days.size;
    if (sessions) {
      const wuDays = new Set(S.list.filter(a => a.gameId === 'warmup').map(a => this.day(a.ts))).size;
      const pct = Math.round((wuDays / sessions) * 100);
      out.push({ icon: '🔥', tone: pct >= 70 ? 'good' : 'warn', title: this.t('Warm-up habit', 'عادة الإحماء'), text: this.t(`Warmed up on ${wuDays} of ${sessions} training days (${pct}%).`, `عمل إحماء في ${wuDays} من ${sessions} أيام تمرين (${pct}%).`) + (pct < 70 ? this.t(' Warming up first protects the legs.', ' الإحماء الأول بيحمي الرجلين.') : '') });
    }
    // reaction time
    const pr = S.list.filter(a => a.gameId === 'paddle-reflex' && a.meta?.avgReaction);
    if (pr.length) {
      const bestRt = Math.min(...pr.map(a => a.meta.avgReaction));
      out.push({ icon: '⚡', tone: 'info', title: this.t('Reaction time', 'سرعة رد الفعل'), text: this.t(`Best average reaction ${bestRt.toFixed(2)} s in Target Paddles.`, `أحسن متوسط رد فعل ${bestRt.toFixed(2)} ث في مضارب الأهداف.`) });
    }
    // untried games
    const tried = new Set(S.played.map(a => a.gameId));
    const untried = ['board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'quiz-blast'].filter(g => !tried.has(g));
    if (untried.length) out.push({ icon: '🆕', tone: 'info', title: this.t('Not tried yet', 'لسه متجربتش'), text: untried.map(g => `${this.GAMES[g].icon} ${this.gName(g)}`).join(' · ') });
    // next step for the current kick (only makes sense for the signed-in player on this device)
    if (this.state.playerId === PlayerSystem.getCurrentPlayerId()) {
      const sk = this.gs.currentSkill, s = this.gs.skillGameScores[sk] || {};
      const need = GameState.REQUIRED_GAME_KEYS.find(k => (s[k] || 0) < PASS);
      const keyToGame = Object.fromEntries(Object.entries(GameState.GAME_KEY_MAP).map(([g, k]) => [k, g]));
      let text;
      if (!(s.warmup > 0)) text = this.t(`Start ${this.sName(sk)} with the warm-up.`, `ابدأ ${this.sName(sk)} بالإحماء.`);
      else if (!(s.learning > 0)) text = this.t(`Watch the ${this.sName(sk)} lesson next.`, `اتفرج على درس ${this.sName(sk)} بعد كده.`);
      else if (need) text = this.t(`Get ${this.gName(keyToGame[need])} to ${PASS}% for ${this.sName(sk)} (now ${s[need] || 0}%).`, `وصّل ${this.gName(keyToGame[need])} لـ ${PASS}% في ${this.sName(sk)} (دلوقتي ${s[need] || 0}%).`);
      else if ((s.quiz || 0) < PASS) text = this.t(`Ready for the ${this.sName(sk)} test!`, `جاهز لاختبار ${this.sName(sk)}!`);
      else text = this.t('Everything passed for this kick — try the bonus games for a higher score.', 'عدّيت كل حاجة في الركلة دي — جرّب الألعاب الزيادة عشان تجيب نتيجة أعلى.');
      out.unshift({ icon: '👉', tone: 'next', title: this.t('Next step', 'الخطوة الجاية'), text });
    }
    return out;
  },

  // ---------------------------------------------------------------- render
  render() {
    const root = document.getElementById('dashboard-root');
    if (!root) return;
    const ar = this.ar;
    const players = PlayerSystem.getPlayers();
    if (!players.length) {
      root.innerHTML = `<div class="db-empty">${this.t('No players yet — register a name to start tracking scores.', 'لسه مفيش لاعبين — سجّل اسم عشان نبدأ نتابع النتايج.')}</div>`;
      return;
    }
    const board = players.map(p => {
      const S = this.summarize(this.attemptsFor(p.id));
      return { p, S };
    }).sort((a, b) => b.S.points - a.S.points || b.S.attempts - a.S.attempts);
    const me = board.find(r => r.p.id === this.state.playerId) || board[0];
    this.state.playerId = me.p.id;
    const S = me.S;
    const currentId = PlayerSystem.getCurrentPlayerId();

    const seg = (name, opts, val) => `<div class="db-seg" role="radiogroup" data-seg="${name}">${opts.map(([v, l]) => `<button type="button" role="radio" aria-checked="${v === val}" class="${v === val ? 'on' : ''}" data-v="${v}">${l}</button>`).join('')}</div>`;

    root.innerHTML = `
      <div class="db-players" role="tablist" aria-label="${this.t('Players', 'اللاعبين')}">
        ${board.map((r, i) => `
          <button type="button" role="tab" aria-selected="${r.p.id === me.p.id}" class="db-player ${r.p.id === me.p.id ? 'on' : ''}" data-pid="${r.p.id}">
            <span class="db-avatar" style="--h:${(r.p.name.charCodeAt(0) * 47) % 360}">${this.esc(r.p.name.trim().charAt(0).toUpperCase())}</span>
            <span class="db-pname">${this.esc(r.p.name)}${r.p.id === currentId ? ` <em>${this.t('(you)', '(إنت)')}</em>` : ''}</span>
            <span class="db-ppts">${i < 3 && r.S.points ? ['🥇', '🥈', '🥉'][i] + ' ' : ''}${r.S.points} ${this.t('pts', 'نقطة')}</span>
          </button>`).join('')}
      </div>

      <div class="db-filters">
        ${seg('skill', [['all', this.t('All kicks', 'كل الركلات')], ...GameConfig.SKILL_ORDER.map(s => [s, this.sName(s)])], this.state.skill)}
        ${seg('range', [['7d', this.t('7 days', '٧ أيام')], ['30d', this.t('30 days', '٣٠ يوم')], ['all', this.t('All time', 'من الأول')]], this.state.range)}
      </div>

      <div class="db-kpis">
        ${this.kpi(this.t('Total points', 'مجموع النقاط'), S.points, this.t('sum of best scores', 'مجموع أحسن النتايج'))}
        ${this.kpi(this.t('Games played', 'ألعاب اتلعبت'), S.attempts, this.t(`${S.days.size} training days`, `${S.days.size} أيام تمرين`))}
        ${this.kpi(this.t('Average score', 'متوسط النتيجة'), S.avg === null ? '—' : S.avg + '%', this.t('across all attempts', 'على كل المحاولات'))}
        ${this.kpi(this.t('Pass rate', 'نسبة النجاح'), S.passRate === null ? '—' : S.passRate + '%', this.t(`attempts ≥ ${GameConfig.SETTINGS.PASSING_SCORE}%`, `محاولات ≥ ${GameConfig.SETTINGS.PASSING_SCORE}%`))}
        ${this.kpi(this.t('Warm-ups', 'مرات الإحماء'), S.warmups, this.t('completed', 'خلصت'))}
        ${this.kpi(this.t('Last played', 'آخر لعب'), this.fmtDate(S.last), S.last ? this.fmtDate(S.last, true).split(/,\s*/).pop() : '')}
      </div>

      <section class="db-panel">
        <h3>🥋 ${this.t('Kick mastery', 'إتقان الركلات')}</h3>
        ${this.masteryHTML(me.p.id)}
      </section>

      <section class="db-panel">
        <h3>💡 ${this.t('Insights', 'ملاحظات ونصايح')}</h3>
        <div class="db-insights">${this.insights(S).map(i => `
          <div class="db-insight tone-${i.tone}"><span class="db-ins-icon">${i.icon}</span><div><b>${i.title}</b><p>${i.text}</p></div></div>`).join('')}
        </div>
      </section>

      <div class="db-grid">
        <section class="db-panel db-span2">
          <div class="db-panel-head"><h3>📈 ${this.t('Score over time', 'النتيجة مع الوقت')}</h3>
            <div class="db-legend">${this.legendHTML(S)}</div></div>
          <div class="db-chart" id="db-trend"></div>
        </section>
        <section class="db-panel">
          <h3>🧩 ${this.t('Best score by game and kick', 'أحسن نتيجة في كل لعبة وركلة')}</h3>
          <div class="db-heat" id="db-heat"></div>
        </section>
        <section class="db-panel">
          <h3>🎮 ${this.t('What they practise most', 'أكتر حاجة بيتمرن عليها')}</h3>
          <div class="db-chart" id="db-mix"></div>
        </section>
      </div>

      <section class="db-panel">
        <h3>🕒 ${this.t('Recent activity', 'آخر نشاط')}</h3>
        ${this.recentHTML(S)}
      </section>

      <section class="db-panel">
        <h3>🏆 ${this.t('All players', 'كل اللاعبين')}</h3>
        ${this.compareHTML(board)}
      </section>
      <div class="db-tooltip" id="db-tip" role="tooltip" hidden></div>`;

    this.drawTrend(S);
    this.drawHeat(S);
    this.drawMix(S);
    this.bind(root);
  },

  // Mastery per kick from THIS player's own attempt log (the device-level
  // progress in GameState is shared by everyone who plays on the device, so
  // it can't tell players apart). Same formula as calculateSkillOverallProgress:
  // (learning + average of the 4 main games + test) / 3.
  masteryFor(playerId) {
    const all = PlayerSystem.getAttempts().filter(a => a.playerId === playerId);
    const best = (sk, g) => all.filter(a => a.skillId === sk && a.gameId === g).reduce((m, a) => Math.max(m, a.score), 0);
    return GameConfig.SKILL_ORDER.map(sk => {
      const learning = best(sk, 'learning');
      const games = ['form-control', 'puzzle', 'performance', 'action'].map(g => best(sk, g));
      const gamesAvg = Math.round(games.reduce((x, y) => x + y, 0) / games.length);
      const quiz = best(sk, 'quiz');
      const bonus = ['error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag'].filter(g => best(sk, g) >= GameConfig.SETTINGS.PASSING_SCORE).length;
      return { sk, learning, gamesAvg, quiz, bonus, overall: Math.round((learning + gamesAvg + quiz) / 3), warm: all.some(a => a.skillId === sk && a.gameId === 'warmup') };
    });
  },

  masteryHTML(playerId) {
    const C = 2 * Math.PI * 30;
    const T = GameConfig.SETTINGS.SKILL_UNLOCK_THRESHOLD;
    return `<div class="db-mastery">${this.masteryFor(playerId).map(m => {
      const col = this.SKILL_COLORS[m.sk];
      const bar = (label, v) => `<div class="db-mbar"><span>${label}</span><span class="db-mbar-track"><i style="width:${v}%;background:${col}"></i></span><b>${v}%</b></div>`;
      const status = m.overall >= T ? `✔ ${this.t('Mastered', 'اتقنتها')}` : m.overall > 0 ? this.t('In progress', 'شغّال عليها') : this.t('Not started', 'لسه مابدأتش');
      return `<div class="db-mcard">
        <div class="db-ring" role="img" aria-label="${this.sName(m.sk)} ${m.overall}%">
          <svg viewBox="0 0 72 72"><circle cx="36" cy="36" r="30" class="db-ring-bg"/>
            <circle cx="36" cy="36" r="30" class="db-ring-fg" stroke="${col}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - m.overall / 100)}"/></svg>
          <b>${m.overall}%</b>
        </div>
        <div class="db-mbody">
          <div class="db-mtitle"><i class="db-dot" style="background:${col}"></i>${this.sName(m.sk)} <span class="db-mstatus ${m.overall >= T ? 'ok' : ''}">${status}</span></div>
          ${bar(this.t('Learning', 'التعلم'), m.learning)}
          ${bar(this.t('Main games', 'الألعاب الأساسية'), m.gamesAvg)}
          ${bar(this.t('Test', 'الاختبار'), m.quiz)}
          <p class="db-msub">${m.warm ? '🔥' : '·'} ${this.t(`${m.bonus} bonus games passed`, `عدّيت ${m.bonus} ألعاب إضافية`)}</p>
        </div></div>`;
    }).join('')}</div>`;
  },

  exportCSV(playerId = null) {
    const rows = PlayerSystem.getAttempts().filter(a => !playerId || a.playerId === playerId).sort((a, b) => a.ts - b.ts);
    const header = ['Player', 'Kick', 'Activity', 'Score', 'Passed', 'Date', 'Time', 'Details'];
    const esc = (v) => { const x = String(v ?? ''); return /[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x; };
    const lines = rows.map(a => {
      const d = new Date(a.ts);
      const meta = a.meta ? Object.entries(a.meta).map(([k, v]) => `${k}=${v}`).join('; ') : '';
      return [a.playerName, GameConfig.SKILLS[a.skillId]?.name.en || a.skillId, this.GAMES[a.gameId]?.en || a.gameId, a.score, a.passed ? 'Yes' : 'No',
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, d.toTimeString().slice(0, 5), meta].map(esc).join(',');
    });
    const who = playerId ? (PlayerSystem.getPlayers().find(p => p.id === playerId)?.name || 'player').replace(/[^\w\u0600-\u06FF-]+/g, '_') : 'all-players';
    const blob = new Blob(['\ufeff' + [header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `taekwondo-${who}-${this.day(Date.now())}.csv`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.gs?.showNotification(this.t(`⬇️ Exported ${rows.length} attempts`, `⬇️ اتصدّر ${rows.length} محاولة`), 'success');
  },

  kpi(label, value, sub) {
    return `<div class="db-kpi"><span class="db-kpi-label">${label}</span><span class="db-kpi-value">${value}</span><span class="db-kpi-sub">${sub || ''}</span></div>`;
  },

  legendHTML(S) {
    const skills = this.state.skill === 'all' ? GameConfig.SKILL_ORDER.filter(s => S.played.some(a => a.skillId === s)) : [this.state.skill];
    if (skills.length < 2) return '';
    return skills.map(s => `<span class="db-leg"><i style="background:${this.SKILL_COLORS[s]}"></i>${this.sName(s)}</span>`).join('');
  },

  recentHTML(S) {
    const rows = [...S.list].reverse().slice(0, 12);
    if (!rows.length) return `<p class="db-muted">${this.t('Nothing yet in this period.', 'مفيش حاجة في الفترة دي.')}</p>`;
    return `<div class="db-table-wrap"><table class="db-table">
      <thead><tr><th>${this.t('When', 'إمتى')}</th><th>${this.t('Kick', 'الركلة')}</th><th>${this.t('Activity', 'النشاط')}</th><th>${this.t('Score', 'النتيجة')}</th></tr></thead>
      <tbody>${rows.map(a => {
        const pass = a.score >= GameConfig.SETTINGS.PASSING_SCORE;
        return `<tr><td>${this.fmtDate(a.ts, true)}</td><td><i class="db-dot" style="background:${this.SKILL_COLORS[a.skillId] || '#888'}"></i>${this.sName(a.skillId)}</td>
          <td>${this.GAMES[a.gameId]?.icon || ''} ${this.gName(a.gameId)}</td>
          <td><span class="db-score ${pass ? 'pass' : 'fail'}">${pass ? '✔' : '✖'} ${a.score}%</span></td></tr>`;
      }).join('')}</tbody></table></div>`;
  },

  compareHTML(board) {
    return `<div class="db-table-wrap"><table class="db-table db-compare">
      <thead><tr><th>#</th><th>${this.t('Player', 'اللاعب')}</th><th>${this.t('Points', 'النقاط')}</th><th>${this.t('Games', 'الألعاب')}</th><th>${this.t('Average', 'المتوسط')}</th><th>${this.t('Pass rate', 'نسبة النجاح')}</th><th>${this.t('Best kick', 'أحسن ركلة')}</th><th>${this.t('Last played', 'آخر لعب')}</th></tr></thead>
      <tbody>${board.map((r, i) => {
        const bySkill = {};
        r.S.played.forEach(a => { (bySkill[a.skillId] ||= []).push(a.score); });
        const bestSkill = Object.entries(bySkill).map(([s, v]) => [s, v.reduce((x, y) => x + y, 0) / v.length]).sort((a, b) => b[1] - a[1])[0];
        return `<tr class="${r.p.id === this.state.playerId ? 'on' : ''}" data-pid="${r.p.id}" tabindex="0">
          <td>${i < 3 && r.S.points ? ['🥇', '🥈', '🥉'][i] : i + 1}</td><td><b>${this.esc(r.p.name)}</b></td><td>${r.S.points}</td><td>${r.S.attempts}</td>
          <td>${r.S.avg ?? '—'}${r.S.avg !== null ? '%' : ''}</td><td>${r.S.passRate ?? '—'}${r.S.passRate !== null ? '%' : ''}</td>
          <td>${bestSkill ? this.sName(bestSkill[0]) : '—'}</td><td>${this.fmtDate(r.S.last)}</td></tr>`;
      }).join('')}</tbody></table></div>`;
  },

  // ---------------------------------------------------------------- charts
  drawTrend(S) {
    const el = document.getElementById('db-trend'); if (!el) return;
    const pts = S.played;
    if (pts.length < 2) { el.innerHTML = `<p class="db-muted db-center">${this.t('Play at least 2 games to see a trend.', 'العب لعبتين على الأقل عشان الرسم يظهر.')}</p>`; return; }
    const W = 640, H = 240, m = { l: 36, r: 12, t: 12, b: 26 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const n = pts.length;
    const x = (i) => m.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
    const y = (v) => m.t + ih - (v / 100) * ih;
    const skills = [...new Set(pts.map(a => a.skillId))];
    const PASS = GameConfig.SETTINGS.PASSING_SCORE;
    let svg = `<svg viewBox="0 0 ${W} ${H}" class="db-svg" role="img" aria-label="${this.t('Score of every game over time', 'نتيجة كل لعبة مع الوقت')}">`;
    [0, 25, 50, 75, 100].forEach(v => { svg += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" class="db-grid-line"/><text x="${m.l - 6}" y="${y(v) + 4}" class="db-axis" text-anchor="end">${v}</text>`; });
    svg += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(PASS)}" y2="${y(PASS)}" class="db-pass-line"/><text x="${m.l + 6}" y="${y(PASS) - 6}" class="db-axis db-pass-label" text-anchor="start" paint-order="stroke" stroke="var(--db-surface)" stroke-width="4">${this.t('pass', 'نجاح')} ${PASS}%</text>`;
    // x labels: first / middle / last dates
    [0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i).forEach(i => {
      svg += `<text x="${x(i)}" y="${H - 6}" class="db-axis" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${this.fmtDate(pts[i].ts)}</text>`;
    });
    // one line per kick (points keep their global order on x)
    skills.forEach(s => {
      const idx = pts.map((a, i) => [a, i]).filter(([a]) => a.skillId === s);
      if (idx.length > 1) svg += `<polyline fill="none" stroke="${this.SKILL_COLORS[s]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${idx.map(([a, i]) => `${x(i)},${y(a.score)}`).join(' ')}"/>`;
    });
    pts.forEach((a, i) => { svg += `<circle cx="${x(i)}" cy="${y(a.score)}" r="4.5" fill="${this.SKILL_COLORS[a.skillId] || '#888'}" stroke="var(--db-surface)" stroke-width="2" class="db-pt" data-i="${i}"/>`; });
    svg += `<line class="db-cross" x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}" visibility="hidden"/>`;
    svg += `<rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent" class="db-hit"/></svg>`;
    el.innerHTML = svg;
    const svgEl = el.querySelector('svg'), cross = el.querySelector('.db-cross'), hit = el.querySelector('.db-hit');
    const show = (evt) => {
      const r = svgEl.getBoundingClientRect();
      const px = ((evt.clientX - r.left) / r.width) * W;
      const i = Math.round(((px - m.l) / iw) * (n - 1));
      const k = Math.max(0, Math.min(n - 1, i)), a = pts[k];
      cross.setAttribute('x1', x(k)); cross.setAttribute('x2', x(k)); cross.setAttribute('visibility', 'visible');
      el.querySelectorAll('.db-pt').forEach(c => c.classList.toggle('on', +c.dataset.i === k));
      this.tip(evt, `<b>${a.score}%</b> · ${this.GAMES[a.gameId]?.icon || ''} ${this.gName(a.gameId)}<br><span>${this.sName(a.skillId)} · ${this.fmtDate(a.ts, true)}</span>`);
    };
    hit.addEventListener('pointermove', show);
    hit.addEventListener('pointerdown', show);
    hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); el.querySelectorAll('.db-pt.on').forEach(c => c.classList.remove('on')); this.tip(null); });
  },

  drawHeat(S) {
    const el = document.getElementById('db-heat'); if (!el) return;
    const skills = this.state.skill === 'all' ? GameConfig.SKILL_ORDER : [this.state.skill];
    const games = this.PLAYED.filter(g => g !== 'error-hunt' || skills.includes('apchagi'));
    const cell = (v) => {
      if (v === undefined) return `<td class="db-cell empty" aria-label="—">—</td>`;
      const idx = Math.min(this.SEQ.length - 1, Math.floor((v / 100) * (this.SEQ.length - 1) + 0.0001));
      const pass = v >= GameConfig.SETTINGS.PASSING_SCORE;
      return `<td class="db-cell" style="--c:${this.SEQ[idx]}"><span>${v}${pass ? ' ✔' : ''}</span></td>`;
    };
    el.innerHTML = `<div class="db-table-wrap"><table class="db-heat-table">
      <thead><tr><th></th>${skills.map(s => `<th>${this.sName(s)}</th>`).join('')}</tr></thead>
      <tbody>${games.map(g => `<tr><th>${this.GAMES[g].icon} ${this.gName(g)}</th>${skills.map(s => cell(S.best[`${s}:${g}`])).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <div class="db-heat-scale"><span>0</span><i style="background:linear-gradient(90deg, ${this.SEQ.join(',')})"></i><span>100</span></div>`;
  },

  drawMix(S) {
    const el = document.getElementById('db-mix'); if (!el) return;
    const rows = Object.entries(S.perGame).map(([id, g]) => ({ id, n: g.n, avg: Math.round(g.sum / g.n) })).sort((a, b) => b.n - a.n).slice(0, 8);
    if (!rows.length) { el.innerHTML = `<p class="db-muted db-center">${this.t('No games yet.', 'مفيش ألعاب لسه.')}</p>`; return; }
    const max = Math.max(...rows.map(r => r.n));
    el.innerHTML = `<div class="db-bars">${rows.map(r => `
      <div class="db-bar-row" tabindex="0" data-tip="${this.esc(`${r.n} ${this.t('attempts', 'محاولات')} · ${this.t('average', 'المتوسط')} ${r.avg}%`)}">
        <span class="db-bar-label">${this.GAMES[r.id]?.icon || ''} ${this.gName(r.id)}</span>
        <span class="db-bar-track"><i style="width:${Math.max(4, (r.n / max) * 100)}%"></i></span>
        <span class="db-bar-val">${r.n}</span>
      </div>`).join('')}</div>`;
    el.querySelectorAll('.db-bar-row').forEach(row => {
      row.addEventListener('pointermove', (e) => this.tip(e, row.dataset.tip));
      row.addEventListener('pointerleave', () => this.tip(null));
    });
  },

  tip(evt, html) {
    const t = document.getElementById('db-tip'); if (!t) return;
    if (!evt) { t.hidden = true; return; }
    t.innerHTML = html; t.hidden = false;
    const pad = 12, w = t.offsetWidth, h = t.offsetHeight;
    let x = evt.clientX + pad, y = evt.clientY - h - pad;
    if (x + w > window.innerWidth - 8) x = evt.clientX - w - pad;
    if (y < 8) y = evt.clientY + pad;
    t.style.left = `${x}px`; t.style.top = `${y}px`;
  },

  bind(root) {
    root.querySelectorAll('.db-player, .db-compare tr[data-pid]').forEach(b => {
      const go = () => { this.state.playerId = b.dataset.pid; this.gs?.playSound('click'); this.render(); };
      b.addEventListener('click', go);
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    });
    root.querySelectorAll('.db-seg').forEach(seg => seg.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      this.state[seg.dataset.seg] = btn.dataset.v; this.gs?.playSound('click'); this.render();
    })));
  }
};
window.DashboardSystem = DashboardSystem;
