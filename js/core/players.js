// =====================================================================
// PLAYER IDENTITY + LEADERBOARD — a lightweight local competitive layer.
// There is no server here (this is a static app you can open offline), so
// "all the players who joined" means every name ever registered ON THIS
// DEVICE/BROWSER — perfect for a family or a classroom sharing one tablet,
// each picking their own name. Every attempt at every game (win AND lose)
// is logged with its own score, so nobody is forced to get a best score —
// they can lose, retry, and their history + best score are both kept.
// =====================================================================
class PlayerSystem {
  static PLAYERS_KEY  = 'taekwondoJourneyPlayers';
  static CURRENT_KEY  = 'taekwondoJourneyCurrentPlayer';
  static ATTEMPTS_KEY = 'taekwondoJourneyAttempts';
  static MAX_ATTEMPTS = 5000; // trim oldest beyond this so storage never runs away

  static _readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  static _writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  static getPlayers() { return this._readJSON(this.PLAYERS_KEY, []); }
  static _savePlayers(list) { this._writeJSON(this.PLAYERS_KEY, list); }

  static getCurrentPlayerId() { return localStorage.getItem(this.CURRENT_KEY) || null; }
  static setCurrentPlayerId(id) {
    try { localStorage.setItem(this.CURRENT_KEY, id); } catch (e) {}
  }
  static getCurrentPlayer() {
    const id = this.getCurrentPlayerId();
    if (!id) return null;
    return this.getPlayers().find(p => p.id === id) || null;
  }

  // Registers a new player, or — if a player with that name already exists
  // (case-insensitive, trimmed) — just signs back in as them, so someone
  // typing their own name again doesn't fork a duplicate profile.
  static createOrSelectPlayer(rawName, character = null) {
    const name = (rawName || '').trim().slice(0, 18);
    if (!character && typeof GameStateInstance !== 'undefined' && GameStateInstance) character = GameStateInstance.playerCharacter;
    if (!name) return null;
    const players = this.getPlayers();
    const existing = players.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      this._activate(existing.id);
      return existing;
    }
    const player = {
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      character: ['boy', 'girl'].includes(character) ? character : 'boy',
      createdAt: Date.now()
    };
    players.push(player);
    this._savePlayers(players);
    this._activate(player.id);
    return player;
  }

  static selectPlayer(id) {
    const player = this.getPlayers().find(p => p.id === id);
    if (player) this._activate(player.id);
    return player || null;
  }

  // Makes `id` the active player and loads their own progress.
  static _activate(id) {
    if (typeof GameStateInstance !== 'undefined' && GameStateInstance) GameStateInstance.switchPlayer(id);
    else this.setCurrentPlayerId(id);
  }

  static updatePlayer(id, patch) {
    const players = this.getPlayers();
    const p = players.find(x => x.id === id);
    if (!p) return null;
    Object.assign(p, patch);
    this._savePlayers(players);
    return p;
  }

  // Removes a player, their save and their attempts (coach mode).
  static deletePlayer(id) {
    this._savePlayers(this.getPlayers().filter(p => p.id !== id));
    this._writeJSON(this.ATTEMPTS_KEY, this.getAttempts().filter(a => a.playerId !== id));
    try { localStorage.removeItem(GameState.storageKey(id)); } catch (e) {}
    if (this.getCurrentPlayerId() === id) { try { localStorage.removeItem(this.CURRENT_KEY); } catch (e) {} }
  }

  // Progress rebuilt from a player's own attempt log (used the first time a
  // player loads on v23, when all players used to share one save).
  static rebuildState(playerId) {
    const atts = this.getAttempts().filter(a => a.playerId === playerId);
    if (!atts.length) return null;
    const PASS = GameConfig.SETTINGS.PASSING_SCORE;
    const scores = {}, completedGames = new Set(), skillProgress = {};
    GameConfig.SKILL_ORDER.forEach(sk => { scores[sk] = {}; skillProgress[sk] = new Set(); });
    let lastWarmupAt = 0;
    atts.forEach(a => {
      if (!scores[a.skillId]) return;
      const key = a.gameId === 'warmup' ? 'warmup' : GameState.GAME_KEY_MAP[a.gameId];
      if (key) scores[a.skillId][key] = Math.max(scores[a.skillId][key] || 0, a.score);
      if (a.gameId === 'warmup') lastWarmupAt = Math.max(lastWarmupAt, a.ts);
      if (a.passed || a.gameId === 'warmup') { completedGames.add(`${a.gameId}:${a.skillId}`); completedGames.add(a.gameId); }
      if (a.score >= PASS) skillProgress[a.skillId].add(a.gameId);
    });
    const unlocked = ['apchagi'], completed = [];
    GameConfig.SKILL_ORDER.forEach(sk => {
      const s = scores[sk];
      const overall = Math.round(((s.learning || 0) + ((s.formControl || 0) + (s.puzzle || 0) + (s.performance || 0) + (s.action || 0)) / 4 + (s.quiz || 0)) / 3);
      if (overall >= GameConfig.SETTINGS.SKILL_UNLOCK_THRESHOLD) {
        completed.push(sk);
        const next = GameConfig.SKILLS[sk].nextSkill;
        if (next && !unlocked.includes(next)) unlocked.push(next);
      }
    });
    const last = atts.reduce((m, a) => (a.ts > m.ts ? a : m), atts[0]);
    return {
      completedGames: [...completedGames], completedSkills: completed, unlockedSkills: unlocked,
      currentSkill: unlocked.includes(last.skillId) ? last.skillId : 'apchagi',
      skillGameScores: scores,
      skillProgress: Object.fromEntries(Object.entries(skillProgress).map(([k, v]) => [k, [...v]])),
      lastWarmupAt,
      playerCharacter: this.getPlayers().find(p => p.id === playerId)?.character
    };
  }

  // Every mini-game attempt — pass OR fail — lands here. skillId/gameId
  // match GameConfig's own ids ('apchagi'/'narochagi'/'bakchagi3' and
  // 'form-control'/'puzzle'/'performance'/'action'/'error-hunt'/
  // 'quiz-blast'/'quiz'/'learning').
  static logAttempt(gameId, skillId, score, passed, meta = null) {
    const player = this.getCurrentPlayer();
    if (!player) return; // no one signed in yet (e.g. very first "learning" auto-complete before onboarding) — skip
    const attempts = this._readJSON(this.ATTEMPTS_KEY, []);
    const row = {
      playerId: player.id,
      playerName: player.name,
      skillId,
      gameId,
      score: Math.round(score),
      passed: !!passed,
      ts: Date.now()
    };
    if (meta && typeof meta === 'object') row.meta = meta;
    attempts.push(row);
    if (attempts.length > this.MAX_ATTEMPTS) attempts.splice(0, attempts.length - this.MAX_ATTEMPTS);
    this._writeJSON(this.ATTEMPTS_KEY, attempts);
  }

  static getAttempts() { return this._readJSON(this.ATTEMPTS_KEY, []); }

  // Personal stats for one player: best score per (skill, game) combo ever
  // attempted, total attempts, and a "total points" figure — the sum of
  // their own best scores across every combo they've tried — used to rank
  // the leaderboard. Retrying and losing never lowers this number.
  static statsFor(playerId) {
    const attempts = this.getAttempts().filter(a => a.playerId === playerId);
    const bestByCombo = {}; // "skillId:gameId" -> best score
    let lastPlayed = 0;
    attempts.forEach(a => {
      const k = `${a.skillId}:${a.gameId}`;
      bestByCombo[k] = Math.max(bestByCombo[k] || 0, a.score);
      if (a.ts > lastPlayed) lastPlayed = a.ts;
    });
    const totalPoints = Object.values(bestByCombo).reduce((s, v) => s + v, 0);
    return {
      attempts: attempts.length,
      gamesPlayed: Object.keys(bestByCombo).length,
      totalPoints,
      bestByCombo,
      lastPlayed
    };
  }

  // Every registered player, ranked by totalPoints — the global leaderboard.
  static leaderboard() {
    return this.getPlayers()
      .map(p => ({ id: p.id, name: p.name, ...this.statsFor(p.id) }))
      .sort((a, b) => b.totalPoints - a.totalPoints || b.attempts - a.attempts);
  }

  // Raw attempt-level export so a parent/coach can pivot it however they
  // like in Excel/Sheets — one row per attempt, not just the summary.
  static exportCSV() {
    const attempts = this.getAttempts();
    const header = ['Player', 'Skill', 'Game', 'Score', 'Passed', 'Date', 'Time'];
    const rows = attempts.map(a => {
      const d = new Date(a.ts);
      return [
        a.playerName, a.skillId, a.gameId, a.score, a.passed ? 'Yes' : 'No',
        d.toISOString().slice(0, 10), d.toTimeString().slice(0, 8)
      ];
    });
    const esc = (v) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [header, ...rows].map(r => r.map(esc).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taekwondo-journey-scores-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

