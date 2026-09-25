// =====================================================================
// CORE GAME STATE MANAGEMENT
// =====================================================================
class GameState {
  constructor() {
    this.currentScreen = 'language';
    this.playerCharacter = 'boy';
    this.completedGames = new Set();
    this.currentLanguage = 'en';
    this.soundEnabled = true;
    this.learningProgress = 0;
    this.formControlProgress = 0;
    this.puzzleProgress = 0;
    this.performanceProgress = 0;
    this.quizProgress = 0;
    this.currentSkill = 'apchagi';
    this.completedSkills = new Set();
    this.unlockedSkills = new Set(['apchagi']);
    this.skillProgress = {
      apchagi: new Set(),
      narochagi: new Set(),
      bakchagi3: new Set()
    };
    // Per-skill, per-activity best scores (0-100). Drives skill-menu progress
    // bars and stage gating. "warmup" gates entry into learning but is NOT
    // part of the weighted unlock-next-skill average (see
    // calculateSkillOverallProgress) — it mirrors the pipeline's Stage 1 role.
    this.skillGameScores = {
      apchagi:   { warmup: 0, learning: 0, formControl: 0, puzzle: 0, performance: 0, action: 0, errorHunt: 0, quizBlast: 0, boardBreak: 0, paddleReflex: 0, phaseRhythm: 0, sparringDuel: 0, balanceHold: 0, heavyBag: 0, quiz: 0 },
      narochagi: { warmup: 0, learning: 0, formControl: 0, puzzle: 0, performance: 0, action: 0, errorHunt: 0, quizBlast: 0, boardBreak: 0, paddleReflex: 0, phaseRhythm: 0, sparringDuel: 0, balanceHold: 0, heavyBag: 0, quiz: 0 },
      bakchagi3: { warmup: 0, learning: 0, formControl: 0, puzzle: 0, performance: 0, action: 0, errorHunt: 0, quizBlast: 0, boardBreak: 0, paddleReflex: 0, phaseRhythm: 0, sparringDuel: 0, balanceHold: 0, heavyBag: 0, quiz: 0 }
    };
    this.currentGame = null;
    // True once the initial page-load state sync has finished — gates
    // whether unlockSkillCard() plays its celebration (skip it while just
    // restoring already-known saved progress on load/refresh).
    this._bootstrapped = false;
    this.isTransitioning = false;
    this.failureCount = 0;
    this.practiceStreak = 0;
    this.bestStreak = 0;
    this.lastPlayedDate = null;
    this.lastWarmupAt = 0;
    this.audioContext = null;
    this.audioGain = null;
    this.animators = new Map();
  }

  async init() {
    this.loadFromStorage();
    this.updatePracticeStreak();
    this.initAudio();
    this.applyLanguage();
    this.updateUI();
    this._bootstrapped = true;
    // Fire-and-forget: warm the image cache in the background so the language /
    // character picker isn't held up (matches the comment in bootstrapGame()).
    this.preloadAnimations().catch((e) => console.warn('Sprite preload failed:', e));
  }

  // v23: progress is saved PER PLAYER ('taekwondoJourney:p:<id>'), so kids
  // sharing one gym tablet no longer share unlocks. Language + sound are
  // device preferences ('taekwondoJourneyPrefs'). 'taekwondoJourney' is the
  // pre-v23 shared save — only used before anyone has registered a name.
  static PREFS_KEY = 'taekwondoJourneyPrefs';
  static storageKey(playerId = PlayerSystem.getCurrentPlayerId()) {
    return playerId ? `taekwondoJourney:p:${playerId}` : 'taekwondoJourney';
  }

  // The save to use for a player who has none yet: rebuilt from their own
  // attempt log, or (a single player on an upgraded device) the old shared save.
  static initialSaveFor(playerId) {
    const rebuilt = PlayerSystem.rebuildState(playerId);
    if (rebuilt) return rebuilt;
    try {
      const legacy = localStorage.getItem('taekwondoJourney');
      if (legacy && !localStorage.getItem('taekwondoJourneyLegacyClaimed') && PlayerSystem.getPlayers().length <= 1) {
        localStorage.setItem('taekwondoJourneyLegacyClaimed', playerId);
        return JSON.parse(legacy);
      }
    } catch (e) {}
    return null;
  }

  loadFromStorage() {
    try {
      // pre-v23 devices kept language/sound inside the shared save
      const prefs = JSON.parse(localStorage.getItem(GameState.PREFS_KEY) || localStorage.getItem('taekwondoJourney') || 'null');
      if (prefs && ['en', 'ar'].includes(prefs.currentLanguage)) this.currentLanguage = prefs.currentLanguage;
      if (prefs && typeof prefs.soundEnabled === 'boolean') this.soundEnabled = prefs.soundEnabled;
    } catch (e) {}
    const key = GameState.storageKey();
    try {
      let saved = localStorage.getItem(key);
      const pid = PlayerSystem.getCurrentPlayerId();
      if (!saved && pid) {
        const init = GameState.initialSaveFor(pid);
        if (init) saved = JSON.stringify(init);
      }
      if (saved) {
        const data = JSON.parse(saved);
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Corrupt save');
        // Only accept known values — a bad language (e.g. from a hand-edited
        // or foreign backup) made message lookups like messages[lang][type]
        // throw and blank out the winner screen.
        const arr = (v) => Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
        data.completedGames  = arr(data.completedGames);
        data.completedSkills = arr(data.completedSkills);
        data.unlockedSkills  = arr(data.unlockedSkills);
        if (!['boy', 'girl'].includes(data.playerCharacter)) delete data.playerCharacter;
        if (!['en', 'ar'].includes(data.currentLanguage))   delete data.currentLanguage;
        if (!GameConfig.SKILLS[data.currentSkill])         delete data.currentSkill;
        this.playerCharacter = data.playerCharacter || PlayerSystem.getCurrentPlayer()?.character || this.playerCharacter;
        if (!localStorage.getItem(GameState.PREFS_KEY)) {
          this.currentLanguage = data.currentLanguage || this.currentLanguage;
          this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : this.soundEnabled;
        }
        this.completedGames = new Set(data.completedGames || []);
        this.learningProgress = data.learningProgress || 0;
        this.formControlProgress = data.formControlProgress || 0;
        this.puzzleProgress = data.puzzleProgress || 0;
        this.performanceProgress = data.performanceProgress || 0;
        this.quizProgress = data.quizProgress || 0;
        this.currentSkill = data.currentSkill || 'apchagi';
        this.completedSkills = new Set(data.completedSkills || []);
        this.unlockedSkills = new Set((data.unlockedSkills || []).length ? data.unlockedSkills : ['apchagi']);
        if (data.skillProgress) {
          this.skillProgress = {
            apchagi: new Set(data.skillProgress.apchagi || []),
            narochagi: new Set(data.skillProgress.narochagi || data.skillProgress.dolyochagi || []),
            bakchagi3: new Set(data.skillProgress.bakchagi3 || data.skillProgress.yeopchagi || [])
          };
        }
        if (data.skillGameScores) {
          ['apchagi', 'narochagi', 'bakchagi3'].forEach(sk => {
            this.skillGameScores[sk] = { ...this.skillGameScores[sk], ...(data.skillGameScores[sk] || {}) };
          });
        }
        this.failureCount = data.failureCount || 0;
        this.practiceStreak = data.practiceStreak || 0;
        this.bestStreak = data.bestStreak || 0;
        this.lastPlayedDate = data.lastPlayedDate || null;
        this.lastWarmupAt = Number(data.lastWarmupAt) || 0;
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      localStorage.removeItem(key);
    }
  }

  // Daily practice streak — counts CONSECUTIVE calendar days the app was
  // opened, not just games completed in one sitting. Runs once per boot.
  updatePracticeStreak() {
    // LOCAL calendar date. toISOString() is UTC, so in Egypt (UTC+2/+3) a
    // session between midnight and 2–3 am counted as the previous day and
    // broke or skipped the streak.
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (this.lastPlayedDate === todayStr) return; // already counted today

    if (this.lastPlayedDate) {
      const prev = new Date(this.lastPlayedDate + 'T00:00:00');
      const today = new Date(todayStr + 'T00:00:00');
      const dayGap = Math.round((today - prev) / 86400000);
      this.practiceStreak = (dayGap === 1) ? this.practiceStreak + 1 : 1;
    } else {
      this.practiceStreak = 1; // very first visit ever
    }
    this.bestStreak = Math.max(this.bestStreak, this.practiceStreak);
    this.lastPlayedDate = todayStr;
    this.saveToStorage();
  }

  saveToStorage() {
    if (this._importing) return;   // a backup restore is about to reload the page
    try {
      const data = {
        playerCharacter: this.playerCharacter,
        currentLanguage: this.currentLanguage,
        soundEnabled: this.soundEnabled,
        completedGames: Array.from(this.completedGames),
        learningProgress: this.learningProgress,
        formControlProgress: this.formControlProgress,
        puzzleProgress: this.puzzleProgress,
        performanceProgress: this.performanceProgress,
        quizProgress: this.quizProgress,
        currentSkill: this.currentSkill,
        completedSkills: Array.from(this.completedSkills),
        unlockedSkills: Array.from(this.unlockedSkills),
        skillProgress: {
          apchagi: Array.from(this.skillProgress.apchagi),
          narochagi: Array.from(this.skillProgress.narochagi),
          bakchagi3: Array.from(this.skillProgress.bakchagi3)
        },
        skillGameScores: this.skillGameScores,
        failureCount: this.failureCount,
        practiceStreak: this.practiceStreak,
        bestStreak: this.bestStreak,
        lastPlayedDate: this.lastPlayedDate,
        lastWarmupAt: this.lastWarmupAt || 0
      };
      localStorage.setItem(GameState.storageKey(), JSON.stringify(data));
      localStorage.setItem(GameState.PREFS_KEY, JSON.stringify({ currentLanguage: this.currentLanguage, soundEnabled: this.soundEnabled }));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  // Swap the whole in-memory progress to another player's save.
  static PROGRESS_FIELDS = ['playerCharacter', 'completedGames', 'learningProgress', 'formControlProgress', 'puzzleProgress',
    'performanceProgress', 'quizProgress', 'currentSkill', 'completedSkills', 'unlockedSkills', 'skillProgress',
    'skillGameScores', 'failureCount', 'practiceStreak', 'bestStreak', 'lastPlayedDate', 'lastWarmupAt'];
  switchPlayer(playerId) {
    if (!playerId) return;
    if (PlayerSystem.getCurrentPlayerId() !== playerId) {
      if (PlayerSystem.getCurrentPlayerId()) this.saveToStorage();
      PlayerSystem.setCurrentPlayerId(playerId);
    }
    const fresh = new GameState();
    GameState.PROGRESS_FIELDS.forEach(k => { this[k] = fresh[k]; });
    this.loadFromStorage();
    const p = PlayerSystem.getCurrentPlayer();
    if (p?.character && !localStorage.getItem(GameState.storageKey())) this.playerCharacter = p.character;
    this.updatePracticeStreak();
    this.syncFlatProgressToCurrentSkill();
    this.saveToStorage();
    try { this.updateUI(); this.updateCharacterDisplays(); } catch (e) {}
    document.dispatchEvent(new CustomEvent('tkd:player-changed', { detail: { playerId } }));
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioGain = this.audioContext.createGain();
      this.audioGain.gain.value = this.soundEnabled ? 0.3 : 0;
      this.audioGain.connect(this.audioContext.destination);
      // Browsers suspend AudioContext until first user gesture
      const resumeAudio = () => {
        if (this.audioContext?.state === 'suspended') this.audioContext.resume();
        document.removeEventListener('click',      resumeAudio, true);
        document.removeEventListener('touchstart', resumeAudio, true);
      };
      document.addEventListener('click',      resumeAudio, true);
      document.addEventListener('touchstart', resumeAudio, true);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // A short ascending major arpeggio (C5→E5→G5→C6) — deliberately distinct
  // from the single-tone 'success'/'win' sounds so a skill unlocking FEELS
  // like a bigger moment than passing one mini-game.
  playUnlockFanfare() {
    if (!this.soundEnabled || !this.audioContext) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const startBase = this.audioContext.currentTime;
      notes.forEach((freq, i) => {
        const osc  = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.audioGain);
        const t = startBase + i * 0.09;
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (error) {
      console.warn('Failed to play unlock fanfare:', error);
    }
  }

 // محرك صوتي هجين: يصنع أصوات ضربات قتالية حقيقية وشق الهواء برمجياً
  playSound(type, frequency = 800) {
    if (!this.soundEnabled || !this.audioContext) return;
    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // 1. صوت شق الهواء للركلة (Whoosh Wind Effect)
      if (type === 'kick') {
        // Build the noise burst once and reuse it — regenerating ~10k random
        // samples on every kick created garbage-collector pressure right when
        // the kick animation needs a smooth frame.
        if (!this._kickNoiseBuffer) {
          const bufferSize = Math.floor(ctx.sampleRate * 0.22);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
          }
          this._kickNoiseBuffer = buffer;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = this._kickNoiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.22);
        filter.Q.value = 3.0;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.22);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioGain);
        noise.start(now);
        return;
      }

      // 2. صوت ارتطام الضربة بالهدف (Heavy Pad Impact)
      if (type === 'strike') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.audioGain);
        osc.start(now);
        osc.stop(now + 0.16);
        return;
      }

      // 3. الأصوات التفاعلية العادية
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      let duration = 0.1;
      let waveType = 'sine';

      switch (type) {
        case 'click': frequency = 650; duration = 0.04; waveType = 'sine'; break;
        case 'success': frequency = 950; duration = 0.2; waveType = 'triangle'; break;
        case 'error': frequency = 220; duration = 0.18; waveType = 'sawtooth'; break;
        case 'win': frequency = 1200; duration = 0.35; waveType = 'sine'; break;
        case 'ratchet': frequency = 1700; duration = 0.025; waveType = 'square'; break;   // dial tick (Action Challenge)
      }

      oscillator.type = waveType;
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      gainNode.connect(this.audioGain);

      // 5 ms attack + fade to near-silence before stop: jumping straight to
      // 0.25 and cutting off at 0.01 produced audible clicks/pops.
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration + 0.01);
    } catch (error) {
      console.warn('Audio synthesis failed:', error);
    }
  }

  // نطق المصطلحات الكورية بنبرة واضحة عبر Web Speech API
  speakKorean(term) {
    if (!('speechSynthesis' in window) || !this.soundEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(term);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Korean speech synthesis unavailable:', e);
    }
  }
  setLanguage(lang) {
    this.currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.setAttribute('lang', lang);
    document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    // Clear any inline direction styles so CSS attribute selectors take full control
    document.body.style.direction  = '';
    document.body.style.textAlign  = '';
    this.applyLanguage();
    // badges built from JS strings (streak, resume, belt) must be redrawn in the new language
    try { this.updateBeltUI(); this.renderStreakBadge(); this.renderResumeButton(); } catch (e) {}
    this.saveToStorage();
  }

  applyLanguage() {
    const translations = {
      en: {
        apChagiMenu: 'Ap Chagi',
        apChagiMenuDesc: 'Choose where to go in your Ap Chagi journey',
        learningStage: 'Learning Stage',
        learningStageDesc: 'Watch tutorials and study the 5 phases of Ap Chagi',
        gamesMenuDesc: 'Practice with interactive training games',
        warmupMenuDesc: 'Prepare your body with warm-up exercises before training', warmupEnergyLabel: 'Readiness',
        tests: 'Tests',
        testsDesc: 'Test your knowledge and earn your achievement',
        watchTutorial: '🎥 Watch Ap Chagi Tutorial',
        videoNotSupported: 'Your browser does not support HTML5 video. Please try another browser.',
        play: 'Play', replay: 'Replay', markAsWatched: 'Mark as Watched',
        videoInstruction1: 'Watch the complete video tutorial for Ap Chagi',
        videoInstruction2: 'Pay attention to the 5 key stages: Preparation, Chamber, Extension, Recoil, Return',
        videoInstruction3: 'You must watch at least 80% of the video to continue',
        videoInstruction4: 'After watching, mark as completed to proceed to practice games',
        gameTitle: 'Taekwondo Journey', gameSubtitle: 'Educational Taekwondo Adventure',
        home: 'Home', learning: 'Learning', games: 'Games', changeCharacter: 'Change Character', quiz: 'Quiz', warmup: 'Warm Up',
        welcome: '👋 Welcome to Taekwondo Journey',
        homeDescription: 'Start your journey to master Taekwondo techniques. Complete each skill to unlock the next!',
        apChagi: 'Ap Chagi', frontKick: 'Front Kick', naroChagi: 'Naeryeo Chagi', bakChagi3: 'Bik Chagi',
        completePrevious: 'Complete previous skill to unlock', startLearning: 'Start Learning', practiceGames: 'Practice Games',
        selectCharacter: 'Choose Your Character', boy: 'Boy', boyDesc: 'Beginner Taekwondo Player', girl: 'Girl', girlDesc: 'Beginner Taekwondo Player', confirmSelect: 'Confirm Selection', characterNote: 'Selected character will appear in all games and activities',
        playerModalTitle: "🏆 Who's Playing?", playerModalDesc: 'Enter a name to save your scores and join the leaderboard.', playerNamePlaceholder: 'Your name', playerNameConfirm: "Let's Go", playerExistingLabel: 'Or continue as:',
        leaderboardTitle: '🏆 Leaderboard', leaderboardDesc: 'See how every player on this device ranks.', leaderboardMyStats: 'My Stats', leaderboardAllPlayers: 'All Players', leaderboardTotalPoints: 'Total Points', leaderboardGamesPlayed: 'Games Played', leaderboardAttempts: 'Attempts', leaderboardLastPlayed: 'Last Played', leaderboardExport: '⬇️ Export Scores (CSV)', leaderboardSwitchPlayer: '🔁 Switch Player', leaderboardEmpty: 'No scores yet — play a game to get on the board!', leaderboardYou: 'You',
        changeCharacterTitle: '👤 Change Character', currentCharacter: 'Current Character:', selectNewCharacter: 'Select New Character:', select: 'Select',
        coachYang: '👴 Coach YANG:',
        coachInstruction1: 'Watch how I perform the front kick step by step!',
        learningTitle: '🎓 Learn Ap Chagi', learningSubtitle: 'Master the 5 stages of the front kick',
        preparation: 'Preparation (Junbi)', chamber: 'Chamber (Knee Lift)', extension: 'Extension (Kick)', recoil: 'Recoil (Pull Back)', return: 'Return to Stance',
        gamesCenter: '🎮 Games Center', chooseGame: 'Choose a game to start training',
        formControl: 'Form Control', formControlDesc: 'Drag player joints to create perfect Ap Chagi stance',
        puzzleAssembly: 'Puzzle Assembly', puzzleDesc: 'Arrange puzzle pieces to create Ap Chagi kick sequence',
        performanceRecognition: 'Performance Recognition', performanceDesc: 'Identify correct from incorrect kick performance',
        quizDesc: 'Test your Taekwondo knowledge', notStarted: 'Not Started', inProgress: 'In Progress', completed: 'Completed',
        formControlGame: '🧍 Form Control - Creating Ap Chagi', formControlInstructions: 'Drag the control points or use arrow keys to create perfect Ap Chagi form',
        instructions: '🎯 Instructions:', instruction1: 'Lift knee to chest height', instruction2: 'Extend foot straight forward', instruction3: 'Keep back straight and upright', instruction4: 'Balance on standing leg',
        accuracy: 'Accuracy:', checkForm: 'Check Form', autoPosition: 'Auto Position', formProgress: 'Form Progress:', backToGames: 'Back to Games',
        puzzleGame: '📋 Puzzle Assembly', puzzleInstructions: 'Arrange the 5 real stages in order — one piece is an imposter, leave it out!',
        puzzlePieces: 'Drag pieces to slots:', readyStance: 'Ready Stance', kneeLift: 'Knee Lift', fullExtension: 'Full Extension', legRetract: 'Leg Retract', returnStance: 'Return to Stance',
        checkPuzzle: 'Check Sequence', hint: 'Hint', puzzleProgress: 'Puzzle Progress:',
        performanceGame: '🎯 Performance Recognition', performanceInstructions: 'Tap the ONE statement that is technically wrong about the image shown',
        whichIsCorrect: 'Look at the image and find the incorrect statement',
        taekwondoQuiz: '❓ Taekwondo Knowledge Quiz', quizDescription: 'Test your understanding of Taekwondo techniques and terminology',
        question: 'Question', score: 'Score:', winner: '🏆 Congratulations!', achievementsUnlocked: 'Achievements Unlocked:',
        firstCompletion: 'First Game Completed', perfectForm: 'Perfect Form Mastered', nextLevel: 'Next Level', tryAgain: 'Try Again',
        backToMenu: 'Back to Home', coachCongrats: 'Well done champion! Your dedication to mastering Ap Chagi is impressive. Keep training!',
        reset: 'Reset',
        backToHome: 'Back to Home',
        nextQuestion: 'Next Question',
        resetData: 'Reset Data',
        backupExport: 'Save Backup', backupImport: 'Restore Backup',
        locked: 'Locked', naroChagiDesc: 'Axe Kick', bakChagi3Desc: 'Side Kick',
        trophyRoom: 'Trophy Room', trophyRoomTitle: '🏆 Dojang Trophy Room', trophyRoomDesc: "Every medal, cup, and certificate you've earned on your journey",
        coolDown: 'Cool Down', coolDownTitle: '🧘 Cool Down Time', coolDownDesc: 'Great training! Stretch these muscles for 20 seconds each to finish safely.', coolDownDone: 'Done Stretching',
        reportNav: 'Progress Report', reportTitle: '📊 Progress Report', reportDesc: 'A quick read-only summary for parents and coaches.',
        menuTitle: 'Menu', navSectionTrain: 'Train', navSectionProgress: 'Progress', navSectionData: 'Data',
        actionTitle: 'Action Challenge', actionDesc: 'A different hands-on challenge for every kick',
        errorHuntTitle: 'Error Hunt', errorHuntDesc: 'Find the hidden mistake in an Ap Chagi kick',
        errorHuntGame: '🔍 Error Hunt', errorHuntInstructions: 'Tap the body part that has the hidden technical mistake in this Ap Chagi kick',
        quizBlastTitle: 'Quiz Blast', quizBlastDesc: 'Shoot the right answer - new questions for every kick',
        quizBlastGame: '🚀 Quiz Blast', quizBlastInstructions: 'Move the helmet with the arrow keys (or drag), fire with Space (or 🔥) and hit the correct answer. Three lives!',
        downloadCertificate: 'Download Certificate 📜',
        boardBreakTitle: 'Board Break', boardBreakDesc: 'Pick the right part of the foot, aim and smash the boards',
        paddleTitle: 'Target Paddles', paddleDesc: 'Hit only the paddle at a real target for this kick — fast!',
        rhythmTitle: 'Kick Rhythm', rhythmDesc: 'Tap the 5 phases in order, right on the beat',
        coreGames: 'Main games (unlock the test)', bonusGames: 'Bonus games',
        dashboardNav: 'Player Dashboard', backToGames2: 'Back to Games',
        dashboardTitle: '📊 Player Dashboard', dashboardDesc: 'Scores and insights for every player on this device.',
        dashboardOpen: 'Open Player Dashboard', dashboardExportPlayer: 'This player (CSV)', dashboardExportAll: 'All players (CSV)',
        sparringTitle: 'Sparring Duel', sparringDesc: 'Score on a real opponent — kick only when a legal target opens',
        balanceTitle: 'Balance Hold', balanceDesc: 'Hold every phase of the kick on one leg without falling',
        heavyBagTitle: 'Heavy Bag', heavyBagDesc: 'Time your kick to the swinging bag for maximum power',
        leagueNav: 'League & Challenges', versusNav: 'Challenge a Friend', switchPlayerNav: 'Switch Player', coachNav: 'Coach Mode',
        leagueTitle: '🏅 League & Challenges', leagueDesc: "Play today's challenge, climb the weekly league and win awards.",
        versusTitle: '⚔️ Challenge a Friend', versusDesc: 'Two players, one screen: the first to kick a legal target scores.',
        coachTitle: '👩‍🏫 Coach Mode',
        profileNav: 'My Hero Page', playersNav: 'All Players',
        playersTitle: '👥 All Players', playersDesc: 'Everyone training on this device — tap a player to see their hero page.',
        curriculumNav: 'Belt Syllabus', privacyNav: 'Privacy', curriculumTitle: '📚 Belt Syllabus', curriculumDesc: 'Every belt, every technique and every poomsae — tap one to learn it.'
      },
      ar: {
        apChagiMenu: 'آب تشاجي',
        apChagiMenuDesc: 'اختار هتروح فين في رحلة الآب تشاجي',
        learningStage: 'مرحلة التعلم',
        learningStageDesc: 'اتفرج على الدروس واتعلم المراحل الخمسة للآب تشاجي',
        gamesMenuDesc: 'اتمرن مع الألعاب التفاعلية',
        warmupMenuDesc: 'جهّز جسمك بتمارين الإحماء قبل التمرين', warmupEnergyLabel: 'الجاهزية',
        tests: 'الاختبارات',
        testsDesc: 'اختبر معلوماتك وخد إنجازك',
        watchTutorial: '🎥 اتفرج على فيديو تعليم الآب تشاجي',
        videoNotSupported: 'المتصفح بتاعك مابيشغلش الفيديو. جرّب متصفح تاني.',
        play: 'تشغيل', replay: 'إعادة', markAsWatched: 'اتفرجت',
        videoInstruction1: 'اتفرج على الفيديو التعليمي كله للآب تشاجي',
        videoInstruction2: 'ركّز على المراحل الخمسة الأساسية: الاستعداد، رفع الركبة، الفرد، السحب، الرجوع',
        videoInstruction3: 'لازم تتفرج على 80% من الفيديو على الأقل عشان تكمّل',
        videoInstruction4: 'بعد ما تتفرج، دوس على "اتفرجت" عشان تروح لألعاب التمرين',
        gameTitle: 'رحلة التايكوندو', gameSubtitle: 'مغامرة تايكوندو تعليمية',
        home: 'الرئيسية', learning: 'التعلم', games: 'الألعاب', changeCharacter: 'غيّر الشخصية', quiz: 'الاختبار', warmup: 'الإحماء',
        welcome: '👋 أهلًا بيك في رحلة التايكوندو', homeDescription: 'ابدأ رحلتك عشان تحترف حركات التايكوندو. خلّص كل مهارة عشان تفتح اللي بعدها!',
        apChagi: 'آب تشاجي', frontKick: 'الركلة الأمامية المستقيمة', naroChagi: 'نارو تشاجي', bakChagi3: 'بيك تشاجي',
        completePrevious: 'خلّص المهارة اللي قبلها عشان تفتح', startLearning: 'ابدأ اتعلم', practiceGames: 'ألعاب التمرين',
        selectCharacter: 'اختار شخصيتك', boy: 'الولد', boyDesc: 'لاعب تايكوندو مبتدئ', girl: 'البنت', girlDesc: 'لاعبة تايكوندو مبتدئة',
        confirmSelect: 'أكّد اختيارك', characterNote: 'الشخصية اللي اخترتها هتظهر في كل الألعاب والأنشطة',
        playerModalTitle: '🏆 مين اللي بيلعب؟', playerModalDesc: 'اكتب اسمك عشان نحفظ نقاطك وتنضم للوحة المتصدرين.', playerNamePlaceholder: 'اسمك', playerNameConfirm: 'يلا نبدأ', playerExistingLabel: 'أو كمّل باسم:',
        leaderboardTitle: '🏆 لوحة المتصدرين', leaderboardDesc: 'شوف ترتيبك مقارنة بكل اللاعبين على الجهاز ده.', leaderboardMyStats: 'إحصائياتي', leaderboardAllPlayers: 'كل اللاعبين', leaderboardTotalPoints: 'مجموع النقاط', leaderboardGamesPlayed: 'الألعاب اللي لعبتها', leaderboardAttempts: 'المحاولات', leaderboardLastPlayed: 'آخر لعب', leaderboardExport: '⬇️ نزّل النتايج (CSV)', leaderboardSwitchPlayer: '🔁 غيّر اللاعب', leaderboardEmpty: 'لسه معندكش نقاط — العب أي لعبة عشان تدخل اللوحة!', leaderboardYou: 'إنت',
        changeCharacterTitle: '👤 غيّر الشخصية', currentCharacter: 'الشخصية دلوقتي:', selectNewCharacter: 'اختار شخصية جديدة:', select: 'اختار',
        coachYang: '👴 الكوتش يانغ:',        coachInstruction1: 'بص أنا بعمل الركلة الأمامية إزاي خطوة بخطوة!', learningTitle: '🎓 اتعلم الآب تشاجي', learningSubtitle: 'اتقن المراحل الخمسة للركلة الأمامية',
        preparation: 'الاستعداد (جونبي)', chamber: 'رفع الركبة', extension: 'فرد الركلة', recoil: 'سحب الرجل', return: 'الرجوع للوضعية',
        gamesCenter: '🎮 مركز الألعاب', chooseGame: 'اختار لعبة وابدأ التمرين', formControl: 'ظبّط الوضعية', formControlDesc: 'اسحب نقط المفاصل أو استخدم الأسهم وظبّط وضعية مثالية',
        puzzleAssembly: 'ركّب الأجزاء', puzzleDesc: 'رتّب قطع البازل وكوّن تسلسل ركلة الآب تشاجي', performanceRecognition: 'اعرف الأداء الصح',
        performanceDesc: 'اختار الصورة اللي فيها الركلة الصح', quizDesc: 'اختبر معلوماتك في التايكوندو', notStarted: 'لسه مابدأش', inProgress: 'شغال', completed: 'خلصت',
        formControlGame: '🧍 ظبّط الوضعية - شكّل الآب تشاجي', formControlInstructions: 'اسحب نقط التحكم أو استخدم الأسهم عشان تحرك المفاصل',
        instructions: '🎯 التعليمات:', instruction1: 'ارفع ركبتك لحد صدرك', instruction2: 'افرد رجلك لقدام على طول', instruction3: 'خلي ضهرك مفرود', instruction4: 'اتوازن على الرجل اللي واقف عليها',
        accuracy: 'الدقة:', checkForm: 'اتأكد من الشكل', autoPosition: 'وضع أوتوماتيك', formProgress: 'تقدّمك في الشكل:', backToGames: 'ارجع للألعاب',
        puzzleGame: '📋 تركيب الأجزاء', puzzleInstructions: 'رتّب المراحل الخمسة الحقيقية بالترتيب الصح — فيه قطعة دخيلة، سيبها برّه!',
        puzzlePieces: 'اسحب القطع للأماكن الفاضية:', readyStance: 'وضعية الاستعداد', kneeLift: 'رفع الركبة', fullExtension: 'فرد كامل', legRetract: 'سحب الرجل', returnStance: 'الرجوع للوضعية',
        checkPuzzle: 'اتأكد من الترتيب', hint: 'تلميح', puzzleProgress: 'تقدّمك في التركيب:', performanceGame: '🎯 ميّز الأداء',
        performanceInstructions: 'دوس على الجملة الوحيدة الغلط فنيًا عن الصورة اللي قدامك', whichIsCorrect: 'بص على الصورة ودوّر على الجملة الغلط',
        taekwondoQuiz: '❓ اختبر معلوماتك في التايكوندو', quizDescription: 'اختبر فهمك لحركات ومصطلحات التايكوندو', question: 'سؤال', score: 'النقط:',
        winner: '🏆 مبروك!', achievementsUnlocked: 'الإنجازات اللي اتفتحت:', firstCompletion: 'أول لعبة تخلّصها', perfectForm: 'أتقنت الشكل المثالي',
        nextLevel: 'المستوى اللي بعده', tryAgain: 'جرّب تاني', backToMenu: 'ارجع للرئيسية', viewProgress: 'شوف تقدّمك',
        coachCongrats: 'برافو يا بطل! تعبك في إتقان الآب تشاجي يجنن. كمّل تمرين!',
        reset: 'ابدأ من جديد',
        backToHome: 'ارجع للرئيسية',
        nextQuestion: 'السؤال اللي بعده',
        resetData: 'امسح البيانات',
        backupExport: 'احفظ نسخة احتياطية', backupImport: 'رجّع نسخة احتياطية',
        locked: 'مقفول', naroChagiDesc: 'الركلة المطرقية من فوق لتحت', bakChagi3Desc: 'الركلة الجانبية',
        trophyRoom: 'فاترينة الإنجازات', trophyRoomTitle: '🏆 فاترينة إنجازات الصالة', trophyRoomDesc: 'كل ميدالية وكاس وشهادة خدتها في رحلتك',
        coolDown: 'تهدئة', coolDownTitle: '🧘 وقت التهدئة', coolDownDesc: 'تمرين جامد! اعمل إطالة للعضلات دي 20 ثانية لكل واحدة عشان تخلّص بأمان.', coolDownDone: 'خلّصت الإطالة',
        reportNav: 'تقرير التقدم', reportTitle: '📊 تقرير التقدم', reportDesc: 'ملخص سريع للقراية بس، لأولياء الأمور والمدربين.',
        menuTitle: 'القائمة', navSectionTrain: 'التمرين', navSectionProgress: 'التقدم', navSectionData: 'البيانات',
        actionTitle: 'تحدي الضربة', actionDesc: 'تحدي عملي مختلف لكل ركلة',
        errorHuntTitle: 'صياد الأخطاء', errorHuntDesc: 'اكتشف الغلطة الفنية المستخبية في ركلة أب تشاجي',
        errorHuntGame: '🔍 صياد الأخطاء', errorHuntInstructions: 'دوس على الجزء اللي فيه الغلطة الفنية المستخبية في الركلة الأمامية دي',
        quizBlastTitle: 'كويز الفضاء', quizBlastDesc: 'اضرب الليزر على الإجابة الصح - أسئلة مخصوص لكل ركلة',
        quizBlastGame: '🚀 كويز الفضاء', quizBlastInstructions: 'حرّك الخوذة بالأسهم (أو بالسحب)، واضرب بالمسافة (أو زرار 🔥) وصيب الإجابة الصح. معاك 3 محاولات!',
        downloadCertificate: 'نزّل شهادة الإتقان 📜',
        boardBreakTitle: 'كسر الألواح', boardBreakDesc: 'اختار جزء القدم الصح، صوّب، واكسر الألواح',
        paddleTitle: 'مضارب الأهداف', paddleDesc: 'اضرب بس المضرب اللي عند هدف حقيقي للركلة دي — بسرعة!',
        rhythmTitle: 'إيقاع الركلة', rhythmDesc: 'دوس على المراحل الخمسة بالترتيب وعلى الإيقاع',
        coreGames: 'الألعاب الأساسية (بتفتح الاختبار)', bonusGames: 'ألعاب زيادة',
        dashboardNav: 'لوحة اللاعبين', backToGames2: 'رجوع للألعاب',
        dashboardTitle: '📊 لوحة اللاعبين', dashboardDesc: 'النتائج والملاحظات لكل لاعب على الجهاز ده.',
        dashboardOpen: 'افتح لوحة اللاعبين', dashboardExportPlayer: 'اللاعب ده (CSV)', dashboardExportAll: 'كل اللاعبين (CSV)',
        sparringTitle: 'نزال القتال', sparringDesc: 'سجّل نقط على منافس حقيقي — اركل بس لما يفتح هدف قانوني',
        balanceTitle: 'ثبات التوازن', balanceDesc: 'اثبت على رجل واحدة في كل مرحلة من الركلة من غير ما تقع',
        heavyBagTitle: 'كيس الملاكمة', heavyBagDesc: 'اظبط توقيت ركلتك مع الكيس اللي بيتمرجح عشان أقصى قوة',
        leagueNav: 'الدوري والتحديات', versusNav: 'تحدّى صاحبك', switchPlayerNav: 'غيّر اللاعب', coachNav: 'وضع المدرب',
        leagueTitle: '🏅 الدوري والتحديات', leagueDesc: 'العب تحدي النهارده، اطلع في الدوري الأسبوعي واكسب جوايز.',
        versusTitle: '⚔️ تحدّى صاحبك', versusDesc: 'لاعبين على شاشة واحدة: اللي يركل الأول في هدف صح ياخد النقط.',
        coachTitle: '👩‍🏫 وضع المدرب',
        profileNav: 'صفحة البطل بتاعتي', playersNav: 'كل اللاعبين',
        playersTitle: '👥 كل اللاعبين', playersDesc: 'كل اللي بيتمرنوا على الجهاز ده — دوس على أي لاعب تشوف صفحته.',
        curriculumNav: 'منهج الأحزمة', privacyNav: 'الخصوصية', curriculumTitle: '📚 منهج الأحزمة', curriculumDesc: 'كل حزام وكل حركة وكل بومسي — دوس على أي حاجة وتعلّمها.'
      }
    };

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
        element.textContent = translations[this.currentLanguage][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
        element.setAttribute('placeholder', translations[this.currentLanguage][key]);
      }
    });

    // Update lang toggle button: shows the OTHER language you can switch to
    const langSpan = document.getElementById('current-lang');
    if (langSpan) langSpan.textContent = this.currentLanguage === 'ar' ? 'EN' : 'AR';

    // Sync html element dir + lang
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');

    // Belt badge text is language-dependent — refresh it whenever language changes
    this.updateBeltUI();
  }

  async preloadAnimations() {
    // SpriteEngine.preloadAnimations() expects { CHARACTER: { ANIM: { frames } } },
    // i.e. GameConfig.ANIMATIONS exactly as-is. The old code flattened it by
    // animation name, which handed the engine objects one level too shallow
    // (so it found no frames and preloaded nothing) and would also have dropped
    // the GIRL / COACH frames whose animation names matched BOY's.
    await SpriteEngine.preloadAnimations(GameConfig.ANIMATIONS);
  }

  createCharacterVisual(elementId, characterType, animationType = 'IDLE') {
    const element = document.getElementById(elementId);
    if (!element) return null;

    if (this.animators.has(elementId)) {
      const oldAnimator = this.animators.get(elementId);
      SpriteEngine.removeAnimator(oldAnimator);
      this.animators.delete(elementId);
    }

    let animations = characterType === 'boy' ? GameConfig.ANIMATIONS.BOY :
                     characterType === 'girl' ? GameConfig.ANIMATIONS.GIRL :
                     GameConfig.ANIMATIONS.COACH;

    const animator = SpriteEngine.createAnimator(element, animations);
    this.animators.set(elementId, animator);

    element.classList.remove('is-kicking', 'is-winning', 'is-idle');

    const targetAnim = animationType in animations ? animationType : 'IDLE';
    if (targetAnim === 'KICK') element.classList.add('is-kicking');
    else if (targetAnim === 'WIN') element.classList.add('is-winning');
    else element.classList.add('is-idle');

    animator.play(targetAnim);
    return animator;
  }

  updateUI() {
    this.updateCharacterDisplays();
    this.updateGameProgress();
    this.updateHomeProgress();
    this.updateHomeSkills();
    this.updateBeltUI();
    this.renderStreakBadge();
    this.renderResumeButton();
  }

  // Practice streak badge — shown on the home screen next to the belt.
  renderStreakBadge() {
    const el = document.getElementById('home-streak-badge');
    if (!el) return;
    const ar = this.currentLanguage === 'ar';
    if (this.practiceStreak >= 2) {
      el.innerHTML = `<div class="streak-badge"><span class="streak-flame">🔥</span><span class="streak-label">${ar ? `${this.practiceStreak} أيام ورا بعض` : `${this.practiceStreak}-day streak`}</span></div>`;
    } else {
      el.innerHTML = `<div class="streak-badge streak-badge-new"><span class="streak-flame">🔥</span><span class="streak-label">${ar ? 'ابدأ سلسلتك النهارده!' : 'Start your streak today!'}</span></div>`;
    }
  }

  // Figures out EXACTLY where the player should pick back up: the right
  // skill (not always apchagi) AND the right stage within it, so "Continue
  // Training" is a single tap instead of re-navigating the whole menu.
  getResumeTarget() {
    const order = GameConfig.SKILL_ORDER;
    let skillId = this.currentSkill;
    if (this.completedSkills.has(skillId) || !this.unlockedSkills.has(skillId)) {
      const next = order.find(id => this.unlockedSkills.has(id) && !this.completedSkills.has(id));
      skillId = next || null;
    }
    if (!skillId) return { done: true };

    const s = this.skillGameScores[skillId] || {};
    let stage = 'warmup';
    if ((s.warmup || 0) > 0)  stage = 'learning';
    if ((s.learning || 0) > 0) stage = 'games';
    if (GameState.allGamesDone(s)) stage = 'quiz';
    return { done: false, skillId, stage };
  }

  renderResumeButton() {
    const wrap = document.getElementById('resume-training-wrap');
    if (!wrap) return;
    const ar = this.currentLanguage === 'ar';
    const target = this.getResumeTarget();

    if (target.done) {
      wrap.innerHTML = `
        <button class="btn btn-success" onclick="switchScreen('trophy-room')">
          <i class="fas fa-trophy"></i> ${ar ? 'خلّصت كل حاجة! شوف إنجازاتك' : "You've completed everything! See your trophies"}
        </button>`;
      return;
    }
    const skill = GameConfig.SKILLS[target.skillId];
    const skillName = ar ? skill.name.ar : skill.name.en;
    const stageLabels = {
      warmup:   { en: 'Warm Up',   ar: 'الإحماء' },
      learning: { en: 'Learning',  ar: 'التعلم' },
      games:    { en: 'Practice Games', ar: 'ألعاب التمرين' },
      quiz:     { en: 'the Quiz',  ar: 'الاختبار' }
    };
    const stageName = ar ? stageLabels[target.stage].ar : stageLabels[target.stage].en;
    const label = ar
      ? `كمّل من مكان ما وقفت — ${skillName} (${stageName})`
      : `Continue Training — ${skillName} (${stageName})`;
    wrap.innerHTML = `
      <button class="btn btn-success" onclick="resumeTraining()">
        <i class="fas fa-play-circle"></i> ${label}
      </button>`;
  }

  // =====================================================================
  // REAL BELT SYSTEM — every skill in this app is beginner-level, so the
  // belt stays a genuine WHITE belt the whole way through (no color
  // changes). Progress is shown the way real dojangs mark early grades:
  // a black degree stripe is added to the tip of the white belt for each
  // of the 3 kicks mastered (0 → 3 stripes). A full white belt with all
  // 3 stripes is the beginner tier's graduation point, ready to test for
  // the next color belt outside this app.
  static BELTS = [
    { id: 'white-0', threshold: 0, stripes: 0, color: '#f8fafc', accent: '#cbd5e1', name: { en: 'White Belt',                    ar: 'الحزام الأبيض' } },
    { id: 'white-1', threshold: 1, stripes: 1, color: '#f8fafc', accent: '#cbd5e1', name: { en: 'White Belt — 1st Stripe',       ar: 'الحزام الأبيض — الشريط الأول' } },
    { id: 'white-2', threshold: 2, stripes: 2, color: '#f8fafc', accent: '#cbd5e1', name: { en: 'White Belt — 2nd Stripe',       ar: 'الحزام الأبيض — الشريط التاني' } },
    { id: 'white-3', threshold: 3, stripes: 3, color: '#f8fafc', accent: '#cbd5e1', name: { en: 'White Belt — 3rd Stripe',       ar: 'الحزام الأبيض — الشريط التالت' } }
  ];

  getBeltInfo() {
    const done = this.completedSkills.size;
    let belt = GameState.BELTS[0];
    for (const b of GameState.BELTS) { if (done >= b.threshold) belt = b; }
    return belt;
  }

  renderBeltBadge(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    const belt = this.getBeltInfo();
    const ar = this.currentLanguage === 'ar';
    const stripes = Array.from({ length: belt.stripes })
      .map(() => `<span class="belt-stripe"></span>`).join('');
    el.innerHTML = `
      <div class="belt-badge" style="--belt-color:${belt.color};--belt-accent:${belt.accent}">
        <span class="belt-strip">${stripes}</span>
        <span class="belt-label">🥋 ${ar ? belt.name.ar : belt.name.en}</span>
      </div>`;
  }

  updateBeltUI() {
    this.renderBeltBadge('home-belt-badge');
    this.renderBeltBadge('skillmenu-belt-badge');
    const belt = this.getBeltInfo();
    document.documentElement.style.setProperty('--current-belt-color', belt.color);
    document.documentElement.style.setProperty('--current-belt-accent', belt.accent);
  }

  updateCharacterDisplays() {
    ['current-character-large', 'learning-character-animation', 'winner-character']
      .forEach(id => this.createCharacterVisual(id, this.playerCharacter, 'IDLE'));

    this.createCharacterVisual('preview-boy', 'boy', 'IDLE');
    this.createCharacterVisual('preview-girl', 'girl', 'IDLE');
    this.createCharacterVisual('change-boy', 'boy', 'IDLE');
    this.createCharacterVisual('change-girl', 'girl', 'IDLE');
    
    ['coach-learning', 'coach-form', 'coach-performance', 'coach-quiz', 'coach-winner']
      .forEach(id => this.createCharacterVisual(id, 'coach', 'IDLE'));
  }

  // Quiz is a "Test", not a mini-game — its own progress bar lives on the
  // Tests stage card (see SkillMenuSystem.initialize's quizBar), not here.
  updateGameProgress() {
    // Skill-specific bonus games (Error Hunt is Ap Chagi only) show only for their skill.
    document.querySelectorAll('.game-card[data-skill-only]').forEach(card => {
      card.classList.toggle('hidden', card.dataset.skillOnly !== this.currentSkill);
    });
    const games = [
      { id: 'form-control', progress: this.formControlProgress, statusId: 'form-status' },
      { id: 'puzzle', progress: this.puzzleProgress, statusId: 'puzzle-status' },
      { id: 'performance', progress: this.performanceProgress, statusId: 'performance-status' },
      { id: 'action', progress: this.skillGameScores[this.currentSkill]?.action || 0, statusId: 'action-status' },
      { id: 'error-hunt', progress: this.skillGameScores[this.currentSkill]?.errorHunt || 0, statusId: 'error-hunt-status' },
      { id: 'quiz-blast', progress: this.skillGameScores[this.currentSkill]?.quizBlast || 0, statusId: 'quiz-blast-status' },
      { id: 'board-break', progress: this.skillGameScores[this.currentSkill]?.boardBreak || 0, statusId: 'board-break-status' },
      { id: 'paddle-reflex', progress: this.skillGameScores[this.currentSkill]?.paddleReflex || 0, statusId: 'paddle-reflex-status' },
      { id: 'phase-rhythm', progress: this.skillGameScores[this.currentSkill]?.phaseRhythm || 0, statusId: 'phase-rhythm-status' },
      { id: 'sparring-duel', progress: this.skillGameScores[this.currentSkill]?.sparringDuel || 0, statusId: 'sparring-duel-status' },
      { id: 'balance-hold', progress: this.skillGameScores[this.currentSkill]?.balanceHold || 0, statusId: 'balance-hold-status' },
      { id: 'heavy-bag', progress: this.skillGameScores[this.currentSkill]?.heavyBag || 0, statusId: 'heavy-bag-status' }
    ];

    games.forEach(game => {
      const progressBar = document.getElementById(`${game.id}-progress-bar`);
      const statusElement = document.getElementById(game.statusId);
      if (progressBar) progressBar.style.width = `${game.progress}%`;
      if (statusElement) {
        if (game.progress >= GameConfig.SETTINGS.PASSING_SCORE) {
          statusElement.textContent = this.currentLanguage === 'ar' ? 'خلصت' : 'Completed';
        } else if (game.progress > 0) {
          statusElement.textContent = this.currentLanguage === 'ar' ? 'شغال' : 'In Progress';
        } else {
          statusElement.textContent = this.currentLanguage === 'ar' ? 'لسه مابدأش' : 'Not Started';
        }
      }
      // v30: the same ★★★ as the map, so a child sees at a glance which game to improve
      const card = document.querySelector(`.game-card[data-game="${game.id}"]`);
      if (card) {
        const n = window.Journey ? Journey.starsFor(game.progress) : 0;
        let row = card.querySelector('.gc-stars');
        if (!row) { row = document.createElement('div'); row.className = 'gc-stars'; row.setAttribute('aria-hidden', 'true'); card.querySelector('.game-icon')?.after(row); }
        row.innerHTML = [1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}">★</i>`).join('');
        card.classList.toggle('is-played', game.progress > 0);
      }
    });
    // v29: "ابدأ من هنا" on the one game the journey wants next
    const nextGame = window.Journey?.nextGame?.(this.currentSkill);
    document.querySelectorAll('.game-card').forEach(card => {
      const on = card.dataset.game === nextGame;
      card.classList.toggle('is-next', on);
      let tag = card.querySelector('.card-next-tag');
      if (on && !tag) { tag = document.createElement('span'); tag.className = 'card-next-tag'; card.appendChild(tag); }
      if (tag) tag.textContent = this.currentLanguage === 'ar' ? '👉 ابدأ من هنا' : '👉 start here';
      if (tag && !on) tag.remove();
    });
  }

  updateHomeProgress() {
    this.updateHomeSkillRings();
  }

  // Circular ring around each home-screen skill icon — replaces the old
  // (unwired) rectangular bars. Driven by the same weighted overall score
  // used for the unlock threshold, so the ring and the unlock moment always agree.
  updateHomeSkillRings() {
    const CIRC = 2 * Math.PI * 38; // r=38, matches the SVG circle radius
    ['apchagi', 'narochagi', 'bakchagi3'].forEach(skillId => {
      const ring = document.getElementById(`${skillId}-icon-ring`);
      if (!ring) return;
      const pct = this.completedSkills.has(skillId) ? 100 : this.calculateSkillOverallProgress(skillId);
      ring.style.strokeDasharray = `${CIRC}`;
      ring.style.strokeDashoffset = `${CIRC * (1 - pct / 100)}`;
      if (this.completedSkills.has(skillId)) ring.classList.add('ring-complete');
    });
  }

  updateHomeSkills() {
    const apChagiStatus = document.getElementById('apchagi-status');
    const ar = this.currentLanguage === 'ar';
    
    if (this.completedSkills.has('apchagi')) {
      if (apChagiStatus) apChagiStatus.textContent = ar ? 'خلصت ✓' : 'Completed ✓';
      this.unlockSkill('narochagi');
      this.unlockSkillCard('narochagi', 'naroChagiDesc');
    }
    
    if (this.completedSkills.has('narochagi')) {
      this.unlockSkill('bakchagi3');
      this.unlockSkillCard('bakchagi3', 'bakChagi3Desc');
    }
  }

  // Finds the card by its data-skill attribute (the ONLY reliable hook the
  // markup provides — these cards have no id attribute) and visually unlocks
  // it: drops the .locked class (which is what carries pointer-events:none),
  // removes the lock badge, and rebinds the click handler.
  unlockSkillCard(skillId, descKey) {
    const card = document.querySelector(`.skill-card[data-skill="${skillId}"]`);
    if (!card || !card.classList.contains('locked')) return;

    const lock   = card.querySelector('.lock-overlay');
    const icon   = card.querySelector('.skill-icon');
    const desc   = card.querySelector('p');
    const status = card.querySelector('.skill-status');

    const finishUnlock = () => {
      card.classList.remove('locked');
      if (icon) icon.textContent = '🥋';
      if (desc) desc.setAttribute('data-i18n', descKey);
      if (status) status.setAttribute('data-i18n', 'startLearning');
      if (lock) lock.remove();
      card.onclick = () => { if (typeof switchToSkill === 'function') switchToSkill(skillId); };
      this.applyLanguage();
    };

    // Silent instant restore while re-syncing SAVED state on page load —
    // the celebration is reserved for a unlock that happens live, mid-session.
    if (!this._bootstrapped) { finishUnlock(); return; }

    this.playUnlockFanfare();
    card.classList.add('unlocking');
    if (lock) lock.classList.add('lock-breaking');

    const ribbon = document.createElement('div');
    ribbon.className = 'unlock-ribbon';
    ribbon.textContent = this.currentLanguage === 'ar' ? '✨ مهارة جديدة!' : '✨ New Skill!';
    card.appendChild(ribbon);

    setTimeout(() => {
      finishUnlock();
      card.classList.remove('unlocking');
      setTimeout(() => ribbon.remove(), 1400);
    }, 650);
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('flash-container');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = `flash-message ${type}`;
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(() => { notification.style.animation = 'fadeOut 0.3s ease forwards'; setTimeout(() => notification.remove(), 300); }, 2700);
  }

  unlockSkill(skillId) {
    if (!this.unlockedSkills.has(skillId)) {
      this.unlockedSkills.add(skillId);
      this.saveToStorage();
      const skillName = this.getSkillName(skillId);
      const message = this.currentLanguage === 'ar'
        ? GameConfig.SETTINGS.SKILL_UNLOCK_MESSAGE.ar.replace('{skill}', skillName)
        : GameConfig.SETTINGS.SKILL_UNLOCK_MESSAGE.en.replace('{skill}', skillName);
      this.showNotification(message, 'success');
      return true;
    }
    return false;
  }

  completeSkill(skillId) {
    if (!this.completedSkills.has(skillId)) {
      this.completedSkills.add(skillId);
      this.saveToStorage();
      this.updateHomeSkills();
      this.updateBeltUI();
      const skillName = this.getSkillName(skillId);
      const belt = this.getBeltInfo();
      const ar = this.currentLanguage === 'ar';
      const message = ar
        ? `🎖️ مبروك! خلّصت مهارة ${skillName}! حزامك دلوقتي: ${belt.name.ar}`
        : `🎖️ Congratulations! You mastered ${skillName}! Your belt is now: ${belt.name.en}`;
      this.showNotification(message, 'success');
      return true;
    }
    return false;
  }

  // Weighted overall mastery for a skill: average of (learning, the 3
  // mini-games averaged together, quiz) — matches the "Cards Seen + Mini-
  // Game Score + Quiz Score" model. This is what gates unlocking the NEXT
  // skill, decoupled from any single activity's pass/fail bar.
  calculateSkillOverallProgress(skillId) {
    const s = this.skillGameScores[skillId] || {};
    const gamesAvg = ((s.formControl || 0) + (s.puzzle || 0) + (s.performance || 0) + (s.action || 0)) / 4;
    return Math.round(((s.learning || 0) + gamesAvg + (s.quiz || 0)) / 3);
  }

  getSkillName(skillId) {
    const skill = GameConfig.SKILLS[skillId];
    if (!skill) return skillId;
    return this.currentLanguage === 'ar' ? skill.name.ar : skill.name.en;
  }

  static GAME_KEY_MAP = { 'learning': 'learning', 'form-control': 'formControl', 'puzzle': 'puzzle', 'performance': 'performance', 'action': 'action', 'error-hunt': 'errorHunt', 'quiz-blast': 'quizBlast', 'board-break': 'boardBreak', 'paddle-reflex': 'paddleReflex', 'phase-rhythm': 'phaseRhythm', 'sparring-duel': 'sparringDuel', 'balance-hold': 'balanceHold', 'heavy-bag': 'heavyBag', 'quiz': 'quiz' };

  // The mini-games that must all be cleared (score > 0 = passed at least once) before the Quiz unlocks.
  static REQUIRED_GAME_KEYS = ['formControl', 'puzzle', 'performance', 'action'];
  static allGamesDone(scores) {
    const s = scores || {};
    return GameState.REQUIRED_GAME_KEYS.every(k => (s[k] || 0) > 0);
  }

  // gameId: 'learning' | 'form-control' | 'puzzle' | 'performance' | 'action' | 'error-hunt' (bonus, Ap Chagi) | 'quiz-blast' (bonus, every kick) | 'quiz'
  // score: 0-100 accuracy for that activity, scoped to gameState.currentSkill
  completeGame(gameId, score = 100, meta = null) {
    const skillId = this.currentSkill;
    const key = GameState.GAME_KEY_MAP[gameId];
    const perSkillKey = `${gameId}:${skillId}`;
    const alreadyDone = this.completedGames.has(perSkillKey);

    if (key && this.skillGameScores[skillId]) {
      this.skillGameScores[skillId][key] = Math.max(this.skillGameScores[skillId][key] || 0, score);
    }
    this.completedGames.add(perSkillKey);
    this.completedGames.add(gameId); // legacy flat flag, kept for old callers/back-compat

    if (score >= GameConfig.SETTINGS.PASSING_SCORE && this.skillProgress[skillId]) {
      this.skillProgress[skillId].add(gameId);
    }
    // Skill unlocks on OVERALL weighted mastery, not on requiring every single
    // activity to individually clear the pass bar — one weak activity no
    // longer blocks progression if the others carry the average past 80%.
    if (this.calculateSkillOverallProgress(skillId) >= GameConfig.SETTINGS.SKILL_UNLOCK_THRESHOLD) {
      this.completeSkill(skillId);
    }

    this.saveToStorage();

    // Flat fields kept in sync with the CURRENT skill for legacy UI reads
    switch (gameId) {
      case 'learning':      this.learningProgress      = this.skillGameScores[skillId]?.learning      ?? score; break;
      case 'form-control':  this.formControlProgress   = this.skillGameScores[skillId]?.formControl   ?? score; break;
      case 'puzzle':        this.puzzleProgress        = this.skillGameScores[skillId]?.puzzle        ?? score; break;
      case 'performance':   this.performanceProgress   = this.skillGameScores[skillId]?.performance   ?? score; break;
      case 'quiz':          this.quizProgress          = this.skillGameScores[skillId]?.quiz          ?? score; break;
    }

    this.updateGameProgress();
    this.updateHomeProgress();
    this.updateHomeSkills();
    PlayerSystem.logAttempt(gameId, skillId, score, true, meta);
    return !alreadyDone;
  }

  // Load a skill's saved scores into the flat legacy fields (call whenever currentSkill changes)
  syncFlatProgressToCurrentSkill() {
    const s = this.skillGameScores[this.currentSkill] || {};
    this.learningProgress    = s.learning    || 0;
    this.formControlProgress = s.formControl || 0;
    this.puzzleProgress      = s.puzzle      || 0;
    this.performanceProgress = s.performance || 0;
    this.quizProgress        = s.quiz        || 0;
  }

  // Missing the pass bar (85%) is just a normal attempt — the player should
  // always be free to try the same game again immediately, no penalty.
  // Only a run of genuinely rough attempts (score under SEVERE_FAIL_SCORE)
  // sends the player back to Learning; anything better than that resets the
  // streak, since it shows they're not fundamentally struggling.
  trackFailure(score = 0, gameId = null, meta = null) {
    if (gameId) PlayerSystem.logAttempt(gameId, this.currentSkill, score, false, meta);
    if (score >= GameConfig.SETTINGS.SEVERE_FAIL_SCORE) {
      this.failureCount = 0;
      this.saveToStorage();
      return false;
    }
    this.failureCount++;
    this.saveToStorage();
    if (this.failureCount >= GameConfig.SETTINGS.SEVERE_FAIL_STREAK) {
      this.failureCount = 0;
      this.saveToStorage();
      ScreenManagerInstance.switchScreen('learning');
      this.showNotification(
        this.currentLanguage === 'ar'
          ? `📚 دي المحاولة الصعبة رقم ${GameConfig.SETTINGS.SEVERE_FAIL_STREAK} ورا بعض. يلا نرجع للتعلم ونظبط حركتك!`
          : `📚 That's ${GameConfig.SETTINGS.SEVERE_FAIL_STREAK} tough attempts in a row. Let's go back to learning and improve your technique!`,
        'warning'
      );
      return true;
    }
    return false;
  }
}

