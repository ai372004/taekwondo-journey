// =====================================================================
// PARENT / COACH REPORT — a read-only summary screen (not a game) so a
// parent or coach can check progress at a glance without digging through
// every stage menu individually.
// =====================================================================
class ReportSystem {
  static initialize(gameState) {
    this.gameState = gameState;
    const ar = gameState.currentLanguage === 'ar';
    const belt = gameState.getBeltInfo();

    const beltEl = document.getElementById('report-belt');
    if (beltEl) {
      beltEl.innerHTML = `<div class="belt-badge" style="--belt-color:${belt.color};--belt-accent:${belt.accent}"><span class="belt-strip"></span><span class="belt-label">🥋 ${ar ? belt.name.ar : belt.name.en}</span></div>`;
    }

    const streakEl = document.getElementById('report-streak');
    if (streakEl) {
      streakEl.textContent = ar
        ? `🔥 ${gameState.practiceStreak} أيام ورا بعض دلوقتي (الأحسن: ${gameState.bestStreak})`
        : `🔥 ${gameState.practiceStreak}-day streak right now (best: ${gameState.bestStreak})`;
    }

    const lastPlayedEl = document.getElementById('report-last-played');
    if (lastPlayedEl) {
      lastPlayedEl.textContent = gameState.lastPlayedDate
        ? (ar ? `📅 آخر تمرين: ${gameState.lastPlayedDate}` : `📅 Last practiced: ${gameState.lastPlayedDate}`)
        : (ar ? '📅 لسه ما بدأش التدريب' : '📅 No training yet');
    }

    const grid = document.getElementById('report-skills-grid');
    if (grid) {
      grid.innerHTML = GameConfig.SKILL_ORDER.map(skillId => {
        const skill = GameConfig.SKILLS[skillId];
        const scores = gameState.skillGameScores[skillId] || {};
        const dims = ['formControl', 'puzzle', 'performance', 'action', 'quiz'].map(k => scores[k] || 0);
        const attempted = dims.filter(v => v > 0);
        const avg = attempted.length ? Math.round(attempted.reduce((a, b) => a + b, 0) / attempted.length) : 0;

        let statusLabel, statusClass;
        if (gameState.completedSkills.has(skillId)) { statusLabel = ar ? '✅ خلصت' : '✅ Completed'; statusClass = 'report-status-done'; }
        else if (gameState.unlockedSkills.has(skillId)) { statusLabel = ar ? '🟡 شغال عليها' : '🟡 In Progress'; statusClass = 'report-status-progress'; }
        else {
          // Tell parents/coaches exactly which skill unlocks this one, instead
          // of a bare "Locked" with no next step — skill order is sequential
          // and known, unlike the Trophy Room's intentionally-hidden badges.
          const orderIdx = GameConfig.SKILL_ORDER.indexOf(skillId);
          const prevSkillId = orderIdx > 0 ? GameConfig.SKILL_ORDER[orderIdx - 1] : null;
          const prevSkill = prevSkillId ? GameConfig.SKILLS[prevSkillId] : null;
          const prevName = prevSkill ? (ar ? prevSkill.name.ar : prevSkill.name.en) : '';
          statusLabel = prevName
            ? (ar ? `🔒 مقفولة — خلّص ${prevName} الأول` : `🔒 Locked — finish ${prevName} first`)
            : (ar ? '🔒 مقفولة' : '🔒 Locked');
          statusClass = 'report-status-locked';
        }

        return `
          <div class="report-skill-card ${statusClass}">
            <h4>${ar ? skill.name.ar : skill.name.en}</h4>
            <p class="report-skill-status">${statusLabel}</p>
            <div class="report-skill-bar-track"><div class="report-skill-bar-fill" style="width:${avg}%"></div></div>
            <p class="report-skill-avg">${ar ? `متوسط الدقة: ${avg}%` : `Average accuracy: ${avg}%`}</p>
          </div>`;
      }).join('');
    }

    this.renderLeaderboard();
    this.setupLeaderboardEvents();
  }

  static fmtDate(ts, ar) {
    if (!ts) return ar ? '—' : '—';
    return new Date(ts).toLocaleDateString(ar ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' });
  }

  static renderLeaderboard() {
    const ar = this.gameState.currentLanguage === 'ar';
    const player = PlayerSystem.getCurrentPlayer();

    // "My Stats" panel
    const mineEl = document.getElementById('lb-panel-mine');
    if (mineEl) {
      if (!player) {
        mineEl.innerHTML = `<p class="lb-empty">${ar ? 'لسه ماسجّلتش باسمك.' : "You haven't registered a name yet."}</p>`;
      } else {
        const s = PlayerSystem.statsFor(player.id);
        mineEl.innerHTML = `
          <div class="lb-player-name-banner">🥋 ${player.name}</div>
          <div class="lb-stat-grid">
            <div class="lb-stat-tile"><span class="lb-stat-value">${s.totalPoints}</span><span class="lb-stat-label">${ar ? 'مجموع النقاط' : 'Total Points'}</span></div>
            <div class="lb-stat-tile"><span class="lb-stat-value">${s.gamesPlayed}</span><span class="lb-stat-label">${ar ? 'الألعاب اللي لعبتها' : 'Games Played'}</span></div>
            <div class="lb-stat-tile"><span class="lb-stat-value">${s.attempts}</span><span class="lb-stat-label">${ar ? 'المحاولات' : 'Attempts'}</span></div>
            <div class="lb-stat-tile"><span class="lb-stat-value">${this.fmtDate(s.lastPlayed, ar)}</span><span class="lb-stat-label">${ar ? 'آخر لعب' : 'Last Played'}</span></div>
          </div>`;
      }
    }

    // "All Players" panel — the global leaderboard
    const allEl = document.getElementById('lb-panel-all');
    if (allEl) {
      const board = PlayerSystem.leaderboard();
      if (!board.length) {
        allEl.innerHTML = `<p class="lb-empty">${ar ? 'لسه معندكش نقاط — العب أي لعبة عشان تدخل اللوحة!' : 'No scores yet — play a game to get on the board!'}</p>`;
      } else {
        allEl.innerHTML = `<div class="lb-rank-list">${board.map((p, i) => {
          const rank = i + 1;
          const isMe = player && p.id === player.id;
          return `
            <div class="lb-rank-row lb-rank-${rank} ${isMe ? 'lb-me' : ''}">
              <span class="lb-rank-num">${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</span>
              <span class="lb-rank-name">${p.name}${isMe ? ` (${ar ? 'إنت' : 'You'})` : ''}
                <div class="lb-rank-sub">${p.gamesPlayed} ${ar ? 'ألعاب' : 'games'} · ${p.attempts} ${ar ? 'محاولة' : 'attempts'}</div>
              </span>
              <span class="lb-rank-points">${p.totalPoints}</span>
            </div>`;
        }).join('')}</div>`;
      }
    }
  }

  static setupLeaderboardEvents() {
    const cloneAndBind = (id, fn) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const clone = el.cloneNode(true);
      el.replaceWith(clone);
      clone.addEventListener('click', fn);
      return clone;
    };

    const tabMine = document.getElementById('lb-tab-mine');
    const tabAll  = document.getElementById('lb-tab-all');
    const panelMine = document.getElementById('lb-panel-mine');
    const panelAll  = document.getElementById('lb-panel-all');

    cloneAndBind('lb-tab-mine', () => {
      document.getElementById('lb-tab-mine')?.classList.add('active');
      document.getElementById('lb-tab-all')?.classList.remove('active');
      if (panelMine) panelMine.style.display = '';
      if (panelAll) panelAll.style.display = 'none';
    });
    cloneAndBind('lb-tab-all', () => {
      document.getElementById('lb-tab-all')?.classList.add('active');
      document.getElementById('lb-tab-mine')?.classList.remove('active');
      if (panelAll) panelAll.style.display = '';
      if (panelMine) panelMine.style.display = 'none';
    });

    cloneAndBind('lb-export-btn', () => {
      PlayerSystem.exportCSV();
      this.gameState.playSound('click');
    });

    cloneAndBind('lb-switch-player-btn', () => {
      this.gameState.playSound('click');
      const wrap = document.getElementById('player-existing-list');
      if (wrap) {
        const ar = this.gameState.currentLanguage === 'ar';
        const players = PlayerSystem.getPlayers();
        wrap.setAttribute('data-label', ar ? 'أو كمّل باسم:' : 'Or continue as:');
        wrap.innerHTML = players
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(p => `<span class="player-chip" data-player-id="${p.id}">${p.name}</span>`)
          .join('');
        wrap.querySelectorAll('.player-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            PlayerSystem.selectPlayer(chip.dataset.playerId);
            this.gameState.playSound('success');
            ScreenManagerInstance.hideModals();
            ScreenManagerInstance.switchScreen('home');
          });
        });
      }
      const input = document.getElementById('player-name-input');
      if (input) input.value = '';
      window._tkdEnterHomeAfterPlayer = () => ScreenManagerInstance.switchScreen('home');
      ScreenManagerInstance.showModal('player');
      document.getElementById('player-name-input')?.focus();
    });
  }
}

