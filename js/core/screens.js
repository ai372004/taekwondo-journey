// =====================================================================
// SCREEN MANAGER
// =====================================================================
// setTimeout that is silently dropped if the player navigates to another
// screen before it fires. Plain setTimeouts here used to yank the player
// back: finish a game, tap Home within ~2 s, and the winner screen (or a
// restarted round with a running timer) appeared on top of Home anyway.
function screenTimeout(fn, ms) {
  const navAtSchedule = ScreenManager.navId;
  return setTimeout(() => { if (ScreenManager.navId === navAtSchedule) fn(); }, ms);
}

class ScreenManager {
  static navId = 0;

  constructor(gameState) {
    this.gameState = gameState;
    this.currentScreen = null;
  }

  switchScreen(screenId) {
    if (this.gameState.isTransitioning) return;
    this.gameState.isTransitioning = true;
    this.gameState.playSound('click');
    try {

    if (screenId === 'language' || screenId === 'character') {
      this.showModal(screenId);
      this.gameState.isTransitioning = false;
      return;
    }
    
    if (this.gameState.failureCount >= 3 && screenId !== 'learning') {
      this.gameState.failureCount = 0;
      this.gameState.saveToStorage();
      screenId = 'learning';
    }
    
    // Remember where we're coming FROM — the form-control cleanup below used to
    // compare against currentScreen after it had already been overwritten with
    // the destination, so the drag listeners were never removed on exit.
    const previousScreen = this.currentScreen;
    ScreenManager.navId++;   // invalidates any pending screenTimeout() callbacks
    this.currentScreen = screenId;
    this.gameState.currentScreen = screenId;

    // Stop any running timers from previous screen to prevent background leaks
    try { WarmupSystem.stopTimer(); WarmupSystem.stopRest(); } catch(e) {}
    try {
      if (screenId !== 'warmup') {
        const v = document.getElementById('warmup-video');
        if (v) { v.pause(); v.classList.remove('is-on'); v.removeAttribute('src'); v.dataset.src = ''; v.load(); }
        SpeechHelper.supported && window.speechSynthesis.cancel();
      }
    } catch(e) {}
    try { PerformanceSystem.stopTimer(); } catch(e) {}
    try { if (screenId !== 'action') ActionSystem.teardown(); } catch(e) {}   // stops the timing-bar loop / drag listeners
    try { if (screenId !== 'quiz-blast') QuizBlastSystem.teardown(); } catch(e) {}   // stops the laser loop / key listeners
    try { window.ArenaGames?.teardownExcept(screenId); } catch(e) {}                 // canvas games: stop loops + listeners
    // Remove Form Control drag listeners when leaving that screen
    if (previousScreen === 'form-control') {
      try { FormControlSystem.teardownListeners(); } catch(e) {}
      try {
        if (FormControlSystem._dragMoveHandler) {
          document.removeEventListener('mousemove', FormControlSystem._dragMoveHandler);
          document.removeEventListener('touchmove', FormControlSystem._dragMoveHandler);
          FormControlSystem._dragMoveHandler = null;
        }
        if (FormControlSystem._dragStopHandler) {
          document.removeEventListener('mouseup',  FormControlSystem._dragStopHandler);
          document.removeEventListener('touchend', FormControlSystem._dragStopHandler);
          FormControlSystem._dragStopHandler = null;
        }
      } catch(e) {}
    }
    
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    document.body.classList.toggle('overlay-screen', screenId === 'warmup');
    
    const targetScreen = document.getElementById(`${screenId}-screen`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));
      const navButton = document.querySelector(`.nav-btn[onclick*="${screenId}"]`);
      if (navButton) navButton.classList.add('active');
      
      this.setBackground(screenId);
      // The site header is tall — bring the screen itself into view so games
      // don't start below the fold.
      if (screenId !== 'home' && screenId !== 'warmup') {
        requestAnimationFrame(() => {
          // v29: on a phone, put the PLAY AREA (canvas / stage) in the middle of the
          // screen, so the game and its buttons are visible without scrolling
          const play = window.innerWidth <= 760 && targetScreen.querySelector('.arena-wrap, .act-layout, #form-stage, .puzzle-board, .qb-arena, #eh-board, .quiz-card, .performance-stage');
          if (play) {
            // taller than the phone? show its BOTTOM — that is where KICK! and the
            // game's own buttons live; a child should never scroll to find them.
            const r = play.getBoundingClientRect();
            const fits = r.height <= window.innerHeight - 24;
            play.scrollIntoView({ block: fits ? 'center' : 'end', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            return;
          }
          const top = targetScreen.getBoundingClientRect().top + window.scrollY - 8;
          if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        });
      } else if (screenId === 'home') {
        window.scrollTo({ top: 0 });
      }
      try {
        this.initializeScreen(screenId);
      } catch (err) {
        console.error('Screen init error:', err);
      }
      try { document.dispatchEvent(new CustomEvent('tkd:screen', { detail: { screenId, previousScreen } })); } catch (e) {}
      navClose();
    }
    } catch(e) { console.error('Screen switch error:', e); }
    this.gameState.isTransitioning = false;
  }

  showModal(modalId) {
    this.gameState.playSound('click');
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    const modal = document.getElementById(`${modalId}-modal`);
    if (modal) {
      modal.classList.add('active');
      this.gameState.currentScreen = modalId;
      this.setBackground('HOME');
    }
  }

  hideModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
  }

  // Screen backgrounds now live on two fixed layers that cross-fade with
  // opacity (GPU-composited). The old body `background-attachment: fixed`
  // forced a full repaint on every scroll frame on Android and is ignored on
  // iOS, and the image swapped abruptly (or faded in half-loaded).
  setBackground(screenId) {
    const background = GameConfig.BACKGROUNDS[screenId.toUpperCase()] || GameConfig.BACKGROUNDS.HOME;
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    if (this._bgUrl === background) return;
    this._bgUrl = background;

    if (!this._bgLayers) {
      this._bgLayers = [0, 1].map(() => {
        const layer = document.createElement('div');
        layer.className = 'app-bg-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.prepend(layer);
        return layer;
      });
      this._bgFront = 0;
    }

    const token = (this._bgToken = (this._bgToken || 0) + 1);
    const reveal = () => {
      if (token !== this._bgToken) return;      // a newer screen switch won
      const next = this._bgLayers[1 - this._bgFront];
      const prev = this._bgLayers[this._bgFront];
      next.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('${background}')`;
      next.classList.add('is-visible');
      prev.classList.remove('is-visible');
      this._bgFront = 1 - this._bgFront;
    };
    // Wait for the image so we never fade into an empty/half-decoded layer.
    const img = new Image();
    img.onload = img.onerror = reveal;
    img.src = background;
  }

  initializeScreen(screenId) {
    switch (screenId) {
      case 'home':
        this.gameState.updateCharacterDisplays();
        this.gameState.updateHomeProgress();
        this.gameState.updateHomeSkills();
        window.HomeHub?.render();
        break;
      case 'skill-menu': SkillMenuSystem.initialize(this.gameState); break;
      case 'warmup': WarmupSystem.initialize(this.gameState); break;
      case 'learning': LearningSystem.initialize(this.gameState); break;
      case 'games': this.gameState.updateGameProgress(); break;
      case 'form-control': FormControlSystem.initialize(this.gameState); break;
      case 'puzzle': PuzzleSystem.initialize(this.gameState); break;
      case 'performance': PerformanceSystem.initialize(this.gameState); break;
      case 'action': ActionSystem.initialize(this.gameState); break;
      case 'error-hunt': ErrorHuntSystem.initialize(this.gameState); break;
      case 'quiz-blast': QuizBlastSystem.initialize(this.gameState); break;
      case 'character-change': this.gameState.updateCharacterDisplays(); break;
      case 'quiz': QuizSystem.initialize(this.gameState); break;
      case 'winner': WinnerSystem.initialize(this.gameState); break;
      case 'trophy-room': TrophyRoomSystem.initialize(this.gameState); break;
      case 'cooldown': CooldownSystem.initialize(this.gameState); break;
      case 'report': ReportSystem.initialize(this.gameState); break;
      case 'dashboard': if (window.DashboardSystem) DashboardSystem.initialize(this.gameState); break;
      default:
        if (window.TKDScreens?.[screenId]) window.TKDScreens[screenId](this.gameState);   // v23 screens (league, versus, coach)
        else window.ArenaGames?.init(screenId, this.gameState);
    }
  }
}

