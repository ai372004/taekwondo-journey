// =====================================================================
// GLOBAL INITIATORS
// =====================================================================
let GameStateInstance;
let ScreenManagerInstance;

async function initGame() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar    = document.getElementById('loading-bar');
  const loadingText   = document.getElementById('loading-text');

  const setProgress = (pct, text) => {
    if (loadingBar)  loadingBar.style.width = `${pct}%`;
    if (loadingText) loadingText.textContent = text;
  };

  setProgress(20, 'Initializing...');
  GameStateInstance = new GameState();

  setProgress(50, 'Loading assets...');
  // init() itself no longer blocks on the full animation preload — see the
  // comment inside GameState.init() — so this resolves quickly and the
  // language/character picker appears without waiting on every image.
  await GameStateInstance.init();

  setProgress(80, 'Starting game...');
  ScreenManagerInstance = new ScreenManager(GameStateInstance);
  setupGlobalEventListeners();

  setProgress(100, 'Ready!');
  setTimeout(() => {
    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (window.StartScreen) StartScreen.show(); else ScreenManagerInstance.showModal('language');
  }, 400);
}

function setupGlobalEventListeners() {
  document.querySelectorAll('.language-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const language = event.currentTarget.dataset.lang;
      GameStateInstance.setLanguage(language);
      ScreenManagerInstance.hideModals();
      setTimeout(() => ScreenManagerInstance.showModal('character'), 300);
    });
  });
  
  document.querySelectorAll('.character-option').forEach(option => {
    option.addEventListener('click', (event) => {
      document.querySelectorAll('.character-option').forEach(opt => opt.classList.remove('selected'));
      event.currentTarget.classList.add('selected');
      GameStateInstance.playSound('click');
    });
  });
  
  document.getElementById('confirm-character-btn')?.addEventListener('click', () => {
    const selected = document.querySelector('.character-option.selected');
    if (!selected) {
      GameStateInstance.showNotification(
        GameStateInstance.currentLanguage === 'ar' ? '⚠️ اختار شخصية الأول' : '⚠️ Please select a character first', 'warning'
      );
      return;
    }
    const character = selected.dataset.character;
    GameStateInstance.playerCharacter = character;
    GameStateInstance.saveToStorage();
    GameStateInstance.playSound('success');
    ScreenManagerInstance.hideModals();

    const enterHome = () => {
      ScreenManagerInstance.switchScreen('home');
      const welcomeMessage = GameStateInstance.currentLanguage === 'ar'
        ? `🎮 أهلًا ${character === 'boy' ? 'يا بطل' : 'يا بطلة'}! اتبسط برحلتك في التايكوندو.`
        : `🎮 Welcome ${character === 'boy' ? 'Boy' : 'Girl'}! Enjoy your Taekwondo journey.`;
      GameStateInstance.showNotification(welcomeMessage, 'success');
    };

    // A player already recognized on this device (browser/storage) skips
    // straight to Home; a first-time device shows the name prompt so their
    // scores can be tracked and ranked.
    if (PlayerSystem.getCurrentPlayer()) {
      enterHome();
    } else {
      renderExistingPlayerChips();
      setTimeout(() => {
        ScreenManagerInstance.showModal('player');
        document.getElementById('player-name-input')?.focus();
      }, 250);
      window._tkdEnterHomeAfterPlayer = enterHome;
    }
  });

  function renderExistingPlayerChips() {
    const wrap = document.getElementById('player-existing-list');
    if (!wrap) return;
    const players = PlayerSystem.getPlayers();
    const ar = GameStateInstance.currentLanguage === 'ar';
    if (!players.length) { wrap.innerHTML = ''; wrap.removeAttribute('data-label'); return; }
    wrap.setAttribute('data-label', ar ? 'أو كمّل باسم:' : 'Or continue as:');
    wrap.innerHTML = players
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(p => `<span class="player-chip" data-player-id="${p.id}">${p.name}</span>`)
      .join('');
    wrap.querySelectorAll('.player-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        PlayerSystem.selectPlayer(chip.dataset.playerId);
        GameStateInstance.playSound('success');
        ScreenManagerInstance.hideModals();
        (window._tkdEnterHomeAfterPlayer || (() => ScreenManagerInstance.switchScreen('home')))();
      });
    });
  }

  function confirmPlayerName() {
    const input = document.getElementById('player-name-input');
    const name = input?.value || '';
    if (!name.trim()) {
      GameStateInstance.showNotification(
        GameStateInstance.currentLanguage === 'ar' ? '⚠️ اكتب اسمك الأول' : '⚠️ Please enter your name first', 'warning'
      );
      return;
    }
    PlayerSystem.createOrSelectPlayer(name);
    GameStateInstance.playSound('success');
    ScreenManagerInstance.hideModals();
    (window._tkdEnterHomeAfterPlayer || (() => ScreenManagerInstance.switchScreen('home')))();
  }

  document.getElementById('player-name-confirm-btn')?.addEventListener('click', confirmPlayerName);
  document.getElementById('player-name-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmPlayerName();
  });
  
  document.querySelectorAll('.select-character-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const character = event.currentTarget.dataset.character;
      GameStateInstance.playerCharacter = character;
      const pid = PlayerSystem.getCurrentPlayerId();
      if (pid) PlayerSystem.updatePlayer(pid, { character });
      GameStateInstance.saveToStorage();
      GameStateInstance.updateCharacterDisplays();
      GameStateInstance.playSound('click');
      const message = GameStateInstance.currentLanguage === 'ar'
        ? `👤 غيّرنا الشخصية لـ ${character === 'boy' ? 'الولد' : 'البنت'}`
        : `👤 Character changed to ${character === 'boy' ? 'Boy' : 'Girl'}`;
      GameStateInstance.showNotification(message, 'success');
    });
  });
  
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', (event) => {
      const gameId = card.dataset.game;
      const learningDone = GameStateInstance && GameStateInstance.completedGames.has(`learning:${GameStateInstance.currentSkill}`);
      if (learningDone) {
        GameStateInstance.currentGame = gameId;
        ScreenManagerInstance.switchScreen(gameId);
      } else {
        GameStateInstance.playSound('error');
        GameStateInstance.showNotification(
          GameStateInstance.currentLanguage === 'ar'
            ? '🔒 خلّص التعلم واتفرج على الفيديو الأول'
            : '🔒 Please complete the video learning first',
          'warning'
        );
      }
    });
  });
}

function switchScreen(screenId) {
  if (ScreenManagerInstance) ScreenManagerInstance.switchScreen(screenId);
}

// Called from skill cards / "Start Learning" buttons across the UI.
// Sets the active skill so every subordinate screen (Learning, Games, Quiz,
// Skill Menu) reconfigures itself dynamically for that kick.
// "Continue Training" — jumps straight to the exact skill + stage the
// player last left off at, computed by GameState.getResumeTarget().
function resumeTraining() {
  if (!GameStateInstance || !ScreenManagerInstance) return;
  const target = GameStateInstance.getResumeTarget();
  if (target.done) { ScreenManagerInstance.switchScreen('trophy-room'); return; }

  GameStateInstance.currentSkill = target.skillId;
  GameStateInstance.syncFlatProgressToCurrentSkill();
  GameStateInstance.saveToStorage();
  ScreenManagerInstance.switchScreen(target.stage === 'warmup' ? 'warmup' : target.stage);
}

// =====================================================================
// BACKUP — progress lives only in this browser's localStorage, so a
// cleared cache or a different device loses everything. These let a
// parent save a small JSON file and restore it anywhere.
// =====================================================================
function tkdStorageKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('taekwondoJourney')) keys.push(k); }
  return keys;
}

function exportProgress() {
  GameStateInstance?.saveToStorage();
  const keys = tkdStorageKeys();
  const ar = GameStateInstance?.currentLanguage === 'ar';
  if (!keys.length) {
    GameStateInstance?.showNotification(
      ar ? '⚠️ لسه مفيش تقدم متسجل عشان تصدّره' : '⚠️ No saved progress yet to export',
      'warning'
    );
    return;
  }
  // v2: every player's save + players list + attempt log (the whole device)
  const payload = {
    app: 'taekwondo-journey-backup',
    version: 2,
    exportedAt: new Date().toISOString(),
    keys: Object.fromEntries(keys.map(k => [k, localStorage.getItem(k)]))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `taekwondo-progress-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking in the same tick can cancel the download in Safari/Firefox.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  GameStateInstance?.showNotification(
    ar ? '✅ النسخة الاحتياطية اتحفظت' : '✅ Backup saved',
    'success'
  );
}

function triggerImportProgress() {
  document.getElementById('import-progress-input')?.click();
}

function importProgress(fileInput) {
  const file = fileInput.files && fileInput.files[0];
  fileInput.value = ''; // allow re-selecting the same file later
  if (!file) return;
  const ar = GameStateInstance?.currentLanguage === 'ar';

  const confirmMsg = ar
    ? 'أي تقدم موجود دلوقتي هيتبدل بالنسخة الاحتياطية دي. تكمل؟'
    : 'This will replace any current progress with this backup. Continue?';
  if (!window.confirm(confirmMsg)) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (parsed?.app === 'taekwondo-journey-backup' && parsed.version >= 2 && parsed.keys && typeof parsed.keys === 'object') {
        Object.entries(parsed.keys).forEach(([k, v]) => { if (k.startsWith('taekwondoJourney') && typeof v === 'string') localStorage.setItem(k, v); });
        if (GameStateInstance) GameStateInstance._importing = true;
        GameStateInstance?.showNotification(ar ? '✅ النسخة الاحتياطية رجعت، بنحمّل تاني...' : '✅ Backup restored, reloading...', 'success');
        setTimeout(() => window.location.reload(), 900);
        return;
      }
      const data = parsed?.data && parsed?.app === 'taekwondo-journey-backup' ? parsed.data : parsed;
      // Previously ANY JSON object was accepted, so picking the wrong .json
      // file silently wiped the child's real progress. Require it to look
      // like one of our saves.
      const KNOWN_KEYS = ['completedGames', 'unlockedSkills', 'skillProgress', 'skillGameScores', 'currentSkill', 'playerCharacter'];
      if (!data || typeof data !== 'object' || Array.isArray(data) || !KNOWN_KEYS.some(k => k in data)) {
        throw new Error('Invalid backup file');
      }
      localStorage.setItem(GameState.storageKey(), JSON.stringify(data));
      // Freeze further saves: a game timer firing before the reload would
      // otherwise overwrite the backup we just restored with in-memory state.
      if (GameStateInstance) GameStateInstance._importing = true;
      GameStateInstance?.showNotification(
        ar ? '✅ النسخة الاحتياطية رجعت، بنحمّل تاني...' : '✅ Backup restored, reloading...',
        'success'
      );
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      console.error('Import failed:', err);
      GameStateInstance?.showNotification(
        ar ? '❌ ملف النسخة الاحتياطية مش سليم' : '❌ Invalid backup file',
        'error'
      );
    }
  };
  reader.onerror = () => {
    GameStateInstance?.showNotification(
      ar ? '❌ مش قادرين نقرا الملف' : '❌ Could not read the file',
      'error'
    );
  };
  reader.readAsText(file);
}

// Generic "read aloud" helper — reads out whatever text is currently in
// the given element, in whichever language is active. Used to put a
// listen button on any screen's instructions/question without needing a
// bespoke handler per screen.
function speakElementText(elementId) {
  const el = document.getElementById(elementId);
  if (!el || !GameStateInstance) return;
  const ar = GameStateInstance.currentLanguage === 'ar';
  SpeechHelper.speak(el.textContent.trim(), ar ? 'ar-EG' : 'en-US');
}

function switchToSkill(skillId) {
  if (!GameStateInstance || !ScreenManagerInstance) return;
  if (!GameStateInstance.unlockedSkills.has(skillId)) {
    GameStateInstance.playSound('error');
    GameStateInstance.showNotification(
      GameStateInstance.currentLanguage === 'ar' ? '🔒 المهارة دي لسه مقفولة' : '🔒 This skill is still locked',
      'warning'
    );
    return;
  }
  GameStateInstance.currentSkill = skillId;
  GameStateInstance.syncFlatProgressToCurrentSkill();
  GameStateInstance.saveToStorage();
  ScreenManagerInstance.switchScreen('skill-menu');
}

// Called from the Skill Menu's 4 stage cards. Enforces the strict pipeline —
// Warm Up → Learning → Games → Tests — for the CURRENT skill only, so each
// skill's stages gate independently of every other skill's progress.
function attemptStageNav(stage) {
  if (!GameStateInstance || !ScreenManagerInstance) return;
  const skillId = GameStateInstance.currentSkill;
  const s = GameStateInstance.skillGameScores[skillId] || {};
  const ar = GameStateInstance.currentLanguage === 'ar';
  let reason = null;

  // A warm-up done in the last few hours (for any kick) still counts — no
  // need to repeat every exercise just because you switched kicks.
  if (stage === 'learning' && !((s.warmup || 0) > 0)
      && Date.now() - (GameStateInstance.lastWarmupAt || 0) < WarmupSystem.RECENT_WARMUP_MS) {
    s.warmup = 100;
    GameStateInstance.saveToStorage();
    GameStateInstance.showNotification(ar ? '🔥 جسمك لسه دافي من الإحماء — يلا نتعلم!' : '🔥 You are still warm from your warm-up — let\'s learn!', 'success');
  }
  if (stage === 'learning' && !((s.warmup || 0) > 0)) {
    reason = ar ? '🔒 كمّل الإحماء الأول' : '🔒 Complete the warm-up first';
  } else if (stage === 'games' && !((s.learning || 0) > 0)) {
    reason = ar ? '🔒 كمّل مرحلة التعلم الأول' : '🔒 Complete the learning stage first';
  } else if (stage === 'quiz' && !GameState.allGamesDone(s)) {
    reason = ar ? 'كمّل الألعاب الأربعة الأول' : '🔒 Complete all 4 games first';
  }

  if (reason) {
    GameStateInstance.playSound('error');
    GameStateInstance.showNotification(reason, 'warning');
    return;
  }
  ScreenManagerInstance.switchScreen(stage);
}

// =====================================================================
// NAVIGATION — global so onclick="navToggle()" works from HTML
// =====================================================================
// Keeps focus contained inside the menu while it's open (keyboard/screen
// reader users), and remembers what was focused before opening so it can
// be restored on close instead of dropping focus back to <body>.
let _navFocusedBeforeOpen = null;

function _navFocusableEls(navMenu) {
  return Array.from(navMenu.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])'))
    .filter(el => el.offsetParent !== null); // skip hidden elements (e.g. the file input)
}

function navOpen() {
  const navMenu   = document.getElementById('collapsibleNav');
  const overlay   = document.getElementById('navOverlay');
  const toggleBtn = document.getElementById('navToggleBtn');
  if (!navMenu) return;
  navMenu.classList.add('active');
  if (overlay)   overlay.classList.add('active');
  if (toggleBtn) {
    // change the icon in place: replacing innerHTML detached the clicked <i>, so the
    // "click outside closes the menu" handler thought the click was outside and closed it again
    const ic = toggleBtn.querySelector('i'); if (ic) ic.className = 'fas fa-times';
    toggleBtn.setAttribute('aria-label', 'Close Menu');
  }

  _navFocusedBeforeOpen = document.activeElement;
  const closeBtn = navMenu.querySelector('.nav-close-btn');
  if (closeBtn) closeBtn.focus();
}

function navClose() {
  const navMenu   = document.getElementById('collapsibleNav');
  const overlay   = document.getElementById('navOverlay');
  const toggleBtn = document.getElementById('navToggleBtn');
  if (!navMenu) return;
  const wasOpen = navMenu.classList.contains('active');
  navMenu.classList.remove('active');
  if (overlay)   overlay.classList.remove('active');
  if (toggleBtn) {
    const ic = toggleBtn.querySelector('i'); if (ic) ic.className = 'fas fa-bars';
    toggleBtn.setAttribute('aria-label', 'Open Menu');
  }

  if (wasOpen) {
    const restoreTo = (_navFocusedBeforeOpen && document.body.contains(_navFocusedBeforeOpen))
      ? _navFocusedBeforeOpen
      : toggleBtn;
    restoreTo?.focus();
    _navFocusedBeforeOpen = null;
  }
}

function navToggle() {
  const navMenu = document.getElementById('collapsibleNav');
  if (!navMenu) return;
  navMenu.classList.contains('active') ? navClose() : navOpen();
}

// ✅ تم إصلاح دالة تبديل اللغة - تستخدم الـ ScreenManagerInstance الموجود
function toggleLanguage() {
  if (!GameStateInstance) return;

  const newLang = GameStateInstance.currentLanguage === 'ar' ? 'en' : 'ar';
  GameStateInstance.setLanguage(newLang);
  GameStateInstance.playSound('click');

  const message = newLang === 'ar'
    ? '🌐 اللغة اتغيرت للعربي'
    : '🌐 Language changed to English';
  GameStateInstance.showNotification(message, 'success');

  // Close nav menu if open (RTL flip changes side)
  navClose();

  // Re-render the currently active screen in the new language
  const activeScreen = document.querySelector('.screen.active');
  const currentScreen = activeScreen?.id?.replace('-screen', '');

  GameStateInstance.updateCharacterDisplays();
  GameStateInstance.updateGameProgress();
  GameStateInstance.updateHomeProgress();
  GameStateInstance.updateHomeSkills();

  if (currentScreen && ScreenManagerInstance) {
    // Switching language used to call each game's initialize(), which threw
    // away the child's progress: the warm-up jumped back to exercise 1, the
    // quiz to question 1 with score 0, Performance to round 1, the puzzle
    // emptied its slots and Learning returned to phase 1. Now each screen is
    // re-rendered in the new language while keeping where the child was.
    const ar = newLang === 'ar';
    switch (currentScreen) {
      case 'form-control': {
        const rewardPlayed     = FormControlSystem.rewardPlayed;
        // initialize() also resets autoPositionUsed to false — without
        // preserving it, toggling the language was a free way to reopen the
        // "Auto Position" hint as many times as you like, defeating the
        // once-per-attempt limit entirely.
        const autoPositionUsed = FormControlSystem.autoPositionUsed;
        FormControlSystem.initialize(GameStateInstance);   // already restores joint positions
        FormControlSystem.rewardPlayed     = rewardPlayed;      // don't replay the reward
        FormControlSystem.autoPositionUsed = autoPositionUsed;
        FormControlSystem.updateAutoPositionBtn();
        break;
      }
      case 'puzzle': {
        const placed = [...(PuzzleSystem.userOrder || [])];
        const filledCount = placed.filter(Boolean).length;
        if (filledCount === 5) break;   // solved / being checked — leave it alone
        PuzzleSystem.initialize(GameStateInstance);
        if (filledCount) {
          const soundWas = GameStateInstance.soundEnabled;
          GameStateInstance.soundEnabled = false;          // re-place silently
          try { placed.forEach((id, i) => { if (id) PuzzleSystem.placePiece(id, i + 1); }); }
          finally { GameStateInstance.soundEnabled = soundWas; }
        }
        break;
      }
      case 'performance': {
        const P = PerformanceSystem;
        if (P.answered || !P.currentQuestion || !P.usedIndices?.length) break;  // next round will use the new language
        const isBoy = GameStateInstance.playerCharacter === 'boy';
        const pool = PerformanceSystem.getQuestionPool(P.skillId, isBoy, newLang);
        const q = pool[P.usedIndices[P.usedIndices.length - 1]];
        if (!q) break;
        P.currentQuestion = q;
        P.currentQuestion.shuffledCards = P.shuffleArray([...q.cards]);
        P.renderRound();          // timer keeps running with the time left
        P.updateTimerUI();
        break;
      }
      case 'action':
        ActionSystem.refresh();   // texts only: keeps the round, scores and the mechanic's state
        break;
      case 'error-hunt':
        ErrorHuntSystem.render();   // texts only: keeps the level, mistakes and answers
        break;
      case 'quiz-blast':
        QuizBlastSystem.refresh();   // texts only: keeps the question, the targets and the score
        break;
      case 'board-break': case 'paddle-reflex': case 'phase-rhythm':
      case 'sparring-duel': case 'balance-hold': case 'heavy-bag':
        window.ArenaGames?.refresh(currentScreen);   // texts only: the round keeps going
        break;
      case 'dashboard':
        window.DashboardSystem?.initialize(GameStateInstance);
        break;
      case 'report':
        ReportSystem.initialize(GameStateInstance);
        break;
      case 'quiz':
        // Unanswered: redraw the same question. Answered: the next one appears
        // in the new language (redrawing now would let it be answered twice).
        if (QuizSystem.selectedAnswer === null && QuizSystem.sessionQuestions) {
          QuizSystem.loadQuestion(QuizSystem.currentQuestionIndex);
        }
        break;
      case 'learning': {
        // If the child is on the video page, re-rendering used to recreate
        // the <video> element from scratch — silently losing their playback
        // position and re-disabling "Mark as Watched" even after they'd
        // already watched enough of the video to unlock it.
        const phase           = LearningSystem.currentPhase;
        const read            = LearningSystem.phasesRead;
        const wasCompleted    = LearningSystem.videoCompleted;
        const wasPlaying      = LearningSystem.isVideoPlaying;
        const resumeTime      = LearningSystem.videoElement?.currentTime || 0;
        LearningSystem.initialize(GameStateInstance);
        LearningSystem.currentPhase = phase;
        LearningSystem.phasesRead   = read;
        LearningSystem.render();
        if (phase >= 5 && LearningSystem.videoElement) {
          LearningSystem.videoCompleted = wasCompleted;
          const btn = document.getElementById('mark-complete-btn');
          if (btn) btn.disabled = !wasCompleted;
          LearningSystem.videoElement.currentTime = resumeTime;
          if (wasPlaying) LearningSystem.videoElement.play().catch(() => {});
        }
        break;
      }
      case 'warmup': WarmupSystem.refreshLanguage(); break;
      case 'skill-menu': SkillMenuSystem.initialize(GameStateInstance); break;
    }
  }
}

function hardResetGame() {
  const ar = GameStateInstance?.currentLanguage === 'ar';
  const msg = ar
    ? 'إنت متأكد إنك عايز تمسح كل التقدم؟ مش هتقدر ترجّعه تاني.'
    : 'Are you sure you want to reset all progress? This cannot be undone.';
  if (confirm(msg)) {
    try { WarmupSystem.stopTimer(); } catch(e) {}
    try { PerformanceSystem.stopTimer(); } catch(e) {}
    tkdStorageKeys().forEach(k => localStorage.removeItem(k));
    location.reload();
  }
}

function initCollapsibleNav() {
  document.addEventListener('keydown', (e) => {
    const navMenu = document.getElementById('collapsibleNav');
    if (!navMenu || !navMenu.classList.contains('active')) return;

    // Escape key closes nav
    if (e.key === 'Escape') { navClose(); return; }

    // Trap Tab focus inside the open menu so keyboard/screen-reader users
    // can't tab out into the (invisible, off-screen) rest of the page.
    if (e.key === 'Tab') {
      const focusable = _navFocusableEls(navMenu);
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  // Clicking outside closes nav
  document.addEventListener('click', (e) => {
    const navMenu   = document.getElementById('collapsibleNav');
    const toggleBtn = document.getElementById('navToggleBtn');
    if (!navMenu || !navMenu.classList.contains('active')) return;
    if (!e.target.isConnected) return;                 // the clicked element was just re-rendered
    if (!navMenu.contains(e.target) && !toggleBtn?.contains(e.target)) navClose();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGame();
  setTimeout(initCollapsibleNav, 500);
})
