/* ===================================================================== */
/* 🥋 TAEKWONDO JOURNEY - COMPLETE GAME LOGIC WITH ALL UPDATED FEATURES  */
/* ===================================================================== */

// =====================================================================
// SPRITE ANIMATION ENGINE (Embedded for single file solution)
// =====================================================================

(function (global) {
  'use strict';

  const _imageCache = new Map();
  let _totalImages = 0;
  let _loadedImages = 0;

  function _preloadImage(url) {
    return new Promise((resolve) => {
      if (!url || typeof url !== 'string') return resolve(null);
      const safeUrl = url.replace(/ /g, '%20');
      if (_imageCache.has(safeUrl)) return resolve(safeUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        _imageCache.set(safeUrl, img);
        _loadedImages++;
        resolve(safeUrl);
      };
      img.onerror = () => {
        console.warn(`❌ Failed to load: ${safeUrl}`);
        resolve(null);
      };
      img.src = safeUrl;
    });
  }

  async function _preloadImages(urls) {
    if (!Array.isArray(urls)) return [];
    const validUrls = urls.filter(url => url && typeof url === 'string');
    _totalImages = validUrls.length;
    _loadedImages = 0;
    const results = await Promise.all(validUrls.map(_preloadImage));
    return results.filter(Boolean);
  }

  class SpriteAnimator {
    constructor(element, animationSet = {}) {
      if (!element) throw new Error('SpriteAnimator requires a DOM element');
      this.element = element;
      this.animationSet = animationSet;
      this.currentAnimation = '';
      this.currentFrames = [];
      this.currentIndex = 0;
      this.frameCount = 0;
      this.fps = 8;
      this.loop = true;
      this.holdLast = 0;
      this.onComplete = null;
      this.onFrameChange = null;
      this._accumulator = 0;
      this._isPlaying = false;
      this._isPaused = false;
      this._frameDuration = 1000 / this.fps;
      this._initializeElement();
    }

    _initializeElement() {
      const style = this.element.style;
      style.backgroundSize = 'contain';
      style.backgroundRepeat = 'no-repeat';
      style.backgroundPosition = 'center';
      style.transformOrigin = 'center bottom';
      style.willChange = 'background-image';
    }

    play(animationName, options = {}) {
      const animation = this.animationSet[animationName];
      if (!animation) {
        if (animationName !== 'IDLE' && this.animationSet['IDLE']) return this.play('IDLE', options);
        return false;
      }
      this.stop();
      const frames = Array.isArray(animation.frames) ? animation.frames : [];
      if (frames.length === 0) return false;
      this.fps = options.fps ?? animation.fps ?? 8;
      this.loop = options.loop ?? animation.loop ?? true;
      this.holdLast = options.holdLast ?? animation.holdLast ?? 0;
      this.onComplete = options.onComplete ?? animation.onComplete ?? null;
      this.onFrameChange = options.onFrameChange ?? animation.onFrameChange ?? null;
      this._frameDuration = 1000 / this.fps;
      this.currentAnimation = animationName;
      this.currentFrames = frames;
      this.currentIndex = 0;
      this.frameCount = frames.length;
      this._showFrame(0);
      this._isPlaying = true;
      this._isPaused = false;
      this._accumulator = 0;
      return true;
    }

    stop() {
      this._isPlaying = false;
      this._isPaused = false;
      this.currentAnimation = '';
    }

    pause() { if (this._isPlaying && !this._isPaused) this._isPaused = true; }
    resume() { if (this._isPlaying && this._isPaused) this._isPaused = false; }

    update(deltaTime) {
      if (!this._isPlaying || this._isPaused || this.currentFrames.length <= 1) return;
      this._accumulator += deltaTime;
      while (this._accumulator >= this._frameDuration) {
        this._accumulator -= this._frameDuration;
        this._advanceFrame();
      }
    }

    _advanceFrame() {
      this.currentIndex++;
      if (this.currentIndex >= this.frameCount) {
        if (this.loop) {
          this.currentIndex = 0;
        } else {
          this.currentIndex = this.frameCount - 1;
          this._showFrame(this.currentIndex);
          this._completeAnimation();
          return;
        }
      }
      this._showFrame(this.currentIndex);
    }

    _showFrame(frameIndex) {
      if (frameIndex < 0 || frameIndex >= this.currentFrames.length) return;
      const frameUrl = this.currentFrames[frameIndex];
      const safeUrl = frameUrl.replace(/ /g, '%20');
      this.element.style.backgroundImage = `url('${safeUrl}')`;
      if (typeof this.onFrameChange === 'function') {
        this.onFrameChange(this.currentIndex, this.frameCount);
      }
    }

    _completeAnimation() {
      this._isPlaying = false;
      if (this.holdLast > 0) setTimeout(() => this._fireCompletion(), this.holdLast);
      else this._fireCompletion();
    }

    _fireCompletion() {
      if (typeof this.onComplete === 'function') {
        try { this.onComplete(this); } catch (error) { console.error('Error in onComplete callback:', error); }
      }
    }
  }

  const SpriteEngine = {
    _animators: new Set(),
    _isRunning: false,
    _lastTimestamp: 0,
    _animationFrameId: null,

    createAnimator(element, animationSet) {
      const animator = new SpriteAnimator(element, animationSet);
      this._animators.add(animator);
      if (!this._isRunning) this.start();
      return animator;
    },

    removeAnimator(animator) {
      if (animator) {
        animator.stop();
        this._animators.delete(animator);
      }
    },

    start() {
      if (this._isRunning) return;
      this._isRunning = true;
      this._lastTimestamp = performance.now();
      const animate = (timestamp) => {
        if (!this._isRunning) return;
        const deltaTime = timestamp - this._lastTimestamp;
        this._lastTimestamp = timestamp;
        this._animators.forEach(animator => animator.update(deltaTime));
        this._animationFrameId = requestAnimationFrame(animate);
      };
      this._animationFrameId = requestAnimationFrame(animate);
    },

    stop() {
      this._isRunning = false;
      if (this._animationFrameId) {
        cancelAnimationFrame(this._animationFrameId);
        this._animationFrameId = null;
      }
      this._animators.forEach(animator => animator.stop());
    },

    pauseAll() { this._animators.forEach(animator => animator.pause()); },
    resumeAll() { this._animators.forEach(animator => animator.resume()); },

    async preloadAnimations(animationSets) {
      const allUrls = new Set();
      Object.values(animationSets).forEach(animationSet => {
        Object.values(animationSet).forEach(animation => {
          if (Array.isArray(animation.frames)) {
            animation.frames.forEach(url => {
              if (url) allUrls.add(url.replace(/ /g, '%20'));
            });
          }
        });
      });
      return await _preloadImages(Array.from(allUrls));
    },

    clearCache() {
      _imageCache.clear();
      _totalImages = 0;
      _loadedImages = 0;
    }
  };

  global.SpriteEngine = SpriteEngine;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpriteEngine.start());
  } else {
    SpriteEngine.start();
  }

})(window);

// =====================================================================
// GAME CONFIGURATION - UPDATED WITH CORRECT FILE PATHS
// =====================================================================
const GameConfig = {
  ANIMATIONS: {
    BOY: {
      IDLE: { frames: ['assets/images/characters/boy_char/boy_idle.png'], fps: 1, loop: true },
      KICK: { frames: [
          'assets/images/characters/boy_char/Ready Stance boy.png',
          'assets/images/characters/boy_char/Ready Stance boy.png',
          'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png',
          'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png',
          'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png',
          'assets/images/characters/boy_char/Recoil (Pull Back) boy.png',
          'assets/images/characters/boy_char/boy_idle.png'
        ], fps: 8, loop: false, holdLast: 800,
        onComplete: (animator) => {
          if (animator.element) animator.element.classList.remove('is-kicking');
          animator.play('IDLE');
        }
      },
      WIN: { frames: [
          'assets/images/characters/boy_char/boy_win_1.png',
          'assets/images/characters/boy_char/boy_win_2.png',
          'assets/images/characters/boy_char/boy_win_1.png',
          'assets/images/characters/boy_char/boy_win_2.png'
        ], fps: 4, loop: true }
    },
    GIRL: {
      IDLE: { frames: ['assets/images/characters/girl_char/girl_idle.png'], fps: 1, loop: true },
      KICK: { frames: [
          'assets/images/characters/girl_char/Ready Stance_girl.png',
          'assets/images/characters/girl_char/Ready Stance_girl.png',
          'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
          'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
          'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
          'assets/images/characters/girl_char/girl_idle.png'
        ], fps: 8, loop: false, holdLast: 800,
        onComplete: (animator) => {
          if (animator.element) animator.element.classList.remove('is-kicking');
          animator.play('IDLE');
        }
      },
      WIN: { frames: [
          'assets/images/characters/girl_char/girl_win_1.png',
          'assets/images/characters/girl_char/girl_win_1.png'
        ], fps: 3, loop: true }
    },
    COACH: {
      IDLE: { frames: ['assets/images/characters/coach_yang/coach_idle.png'], fps: 1, loop: true },
      DEMO: { frames: [
          'assets/images/characters/coach_yang/Ready Stance (Junbi)_coach.png',
          'assets/images/characters/coach_yang/Ready Stance (Junbi)_coach.png',
          'assets/images/characters/coach_yang/Knee Lift (Chamber Position)_coach.png',
          'assets/images/characters/coach_yang/Kick Extension (Strike Moment)_coach.png',
          'assets/images/characters/coach_yang/Kick Extension (Strike Moment)_coach.png',
          'assets/images/characters/coach_yang/Recoil (Pull Back)_coach.png',
          'assets/images/characters/coach_yang/Return to Stance_coach.png',
          'assets/images/characters/coach_yang/Return to Stance_coach.png'
        ], fps: 6, loop: false,
        onComplete: (animator) => { animator.play('IDLE'); }
      }
    }
  },

  BACKGROUNDS: {
    HOME: 'assets/images/backgrounds/main_menu_bg.jpg',
    DOJO: 'assets/images/backgrounds/dojo_interior_bg.jpg'
  },

  VIDEOS: {
    AP_CHAGI_TUTORIAL: 'assets/videos/apchagi-tutorial.mp4'
  },

  SKILLS: {
    AP_CHAGI: { id: 'apchagi', name: 'Ap Chagi', description: 'Front Kick', unlocked: true, completed: false, requiredGames: 3, nextSkill: 'dolyochagi' },
    DOLYO_CHAGI: { id: 'dolyochagi', name: 'Dolyo Chagi', description: 'Roundhouse Kick', unlocked: false, completed: false, requiredGames: 3, nextSkill: 'yeopchagi' },
    YEOP_CHAGI: { id: 'yeopchagi', name: 'Yeop Chagi', description: 'Side Kick', unlocked: false, completed: false, requiredGames: 3, nextSkill: 'dwichagi' },
    DWI_CHAGI: { id: 'dwichagi', name: 'Dwi Chagi', description: 'Back Kick', unlocked: false, completed: false, requiredGames: 3, nextSkill: null }
  },

  SETTINGS: {
    PASSING_SCORE: 85,
    GAMES_REQUIRED_PER_SKILL: 3,
    SKILL_UNLOCK_MESSAGE: {
      en: '🎉 New Skill Unlocked! You can now learn {skill}!',
      ar: '🎉 مهارة جديدة مفتوحة! يمكنك الآن تعلم {skill}!'
    }
  }
};

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
      dolyochagi: new Set(),
      yeopchagi: new Set(),
      dwichagi: new Set()
    };
    this.currentGame = null;
    this.isTransitioning = false;
    this.failureCount = 0;
    this.audioContext = null;
    this.audioGain = null;
    this.animators = new Map();
  }

  async init() {
    this.loadFromStorage();
    this.initAudio();
    this.applyLanguage();
    this.updateUI();
    await this.preloadAnimations();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('taekwondoJourney');
      if (saved) {
        const data = JSON.parse(saved);
        this.playerCharacter = data.playerCharacter || this.playerCharacter;
        this.currentLanguage = data.currentLanguage || this.currentLanguage;
        this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : this.soundEnabled;
        this.completedGames = new Set(data.completedGames || []);
        this.learningProgress = data.learningProgress || 0;
        this.formControlProgress = data.formControlProgress || 0;
        this.puzzleProgress = data.puzzleProgress || 0;
        this.performanceProgress = data.performanceProgress || 0;
        this.quizProgress = data.quizProgress || 0;
        this.currentSkill = data.currentSkill || 'apchagi';
        this.completedSkills = new Set(data.completedSkills || []);
        this.unlockedSkills = new Set(data.unlockedSkills || ['apchagi']);
        if (data.skillProgress) {
          this.skillProgress = {
            apchagi: new Set(data.skillProgress.apchagi || []),
            dolyochagi: new Set(data.skillProgress.dolyochagi || []),
            yeopchagi: new Set(data.skillProgress.yeopchagi || []),
            dwichagi: new Set(data.skillProgress.dwichagi || [])
          };
        }
        this.failureCount = data.failureCount || 0;
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      localStorage.removeItem('taekwondoJourney');
    }
  }

  saveToStorage() {
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
          dolyochagi: Array.from(this.skillProgress.dolyochagi),
          yeopchagi: Array.from(this.skillProgress.yeopchagi),
          dwichagi: Array.from(this.skillProgress.dwichagi)
        },
        failureCount: this.failureCount
      };
      localStorage.setItem('taekwondoJourney', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
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

  playSound(type, frequency = 800) {
    if (!this.soundEnabled || !this.audioContext) return;
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      let duration = 0.1;
      let waveType = 'sine';
      
      switch (type) {
        case 'click': frequency = 600; duration = 0.05; break;
        case 'success': frequency = 1000; duration = 0.2; waveType = 'triangle'; break;
        case 'error': frequency = 400; duration = 0.15; waveType = 'square'; break;
        case 'kick': frequency = 800; duration = 0.1; waveType = 'sawtooth'; break;
        case 'win': frequency = 1200; duration = 0.3; waveType = 'sine'; break;
      }
      
      oscillator.type = waveType;
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      gainNode.connect(this.audioGain);
      
      const startTime = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    } catch (error) {
      console.warn('Failed to play sound:', error);
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
        warmupMenuDesc: 'Prepare your body with warm-up exercises before training',
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
        apChagi: 'Ap Chagi', frontKick: 'Front Kick', dolyoChagi: 'Dolyo Chagi', roundhouseKick: 'Roundhouse Kick',
        yeopChagi: 'Yeop Chagi', sideKick: 'Side Kick', dwiChagi: 'Dwi Chagi', backKick: 'Back Kick',
        completePrevious: 'Complete previous skill to unlock', startLearning: 'Start Learning', practiceGames: 'Practice Games',
        selectCharacter: 'Choose Your Character', boy: 'Boy', boyDesc: 'Beginner Taekwondo Player', girl: 'Girl', girlDesc: 'Beginner Taekwondo Player', confirmSelect: 'Confirm Selection', characterNote: 'Selected character will appear in all games and activities',
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
        formControlGame: '🎭 Form Control - Creating Ap Chagi', formControlInstructions: 'Drag the control points or use arrow keys to create perfect Ap Chagi form',
        instructions: '🎯 Instructions:', instruction1: 'Lift knee to chest height', instruction2: 'Extend foot straight forward', instruction3: 'Keep back straight and upright', instruction4: 'Balance on standing leg',
        accuracy: 'Accuracy:', checkForm: 'Check Form', autoPosition: 'Auto Position', formProgress: 'Form Progress:', backToGames: 'Back to Games',
        puzzleGame: '🧩 Puzzle Assembly - Ap Chagi Sequence', puzzleInstructions: 'Arrange the stages in correct order from preparation to completion',
        puzzlePieces: 'Drag pieces to slots:', readyStance: 'Ready Stance', kneeLift: 'Knee Lift', fullExtension: 'Full Extension', legRetract: 'Leg Retract', returnStance: 'Return to Stance',
        checkPuzzle: 'Check Sequence', hint: 'Hint', puzzleProgress: 'Puzzle Progress:',
        performanceGame: '👁️ Performance Recognition', performanceInstructions: 'Click on the image that shows the correct Ap Chagi technique',
        whichIsCorrect: 'Which of these shows correct Ap Chagi technique?',
        taekwondoQuiz: '❓ Taekwondo Knowledge Quiz', quizDescription: 'Test your understanding of Taekwondo techniques and terminology',
        question: 'Question', score: 'Score:', winner: '🏆 Congratulations!', achievementsUnlocked: 'Achievements Unlocked:',
        firstCompletion: 'First Game Completed', perfectForm: 'Perfect Form Mastered', nextLevel: 'Next Level', tryAgain: 'Try Again',
        backToMenu: 'Back to Home', coachCongrats: 'Well done champion! Your dedication to mastering Ap Chagi is impressive. Keep training!',
        reset: 'Reset',
        backToHome: 'Back to Home',
        nextQuestion: 'Next Question',
        resetData: 'Reset Data'
      },
      ar: {
        apChagiMenu: 'آب تشاجي',
        apChagiMenuDesc: 'اختر وجهتك في رحلة الآب تشاجي',
        learningStage: 'مرحلة التعلم',
        learningStageDesc: 'شاهد الدروس وادرس المراحل الخمس للآب تشاجي',
        gamesMenuDesc: 'تمرّن مع الألعاب التفاعلية',
        warmupMenuDesc: 'جهّز جسمك بتمارين الإحماء قبل التدريب',
        tests: 'الاختبارات',
        testsDesc: 'اختبر معلوماتك واحصل على إنجازك',
        watchTutorial: '🎥 مشاهدة فيديو تعليم الآب تشاجي',
        videoNotSupported: 'متصفحك لا يدعم تشغيل الفيديو. يرجى استخدام متصفح آخر.',
        play: 'تشغيل', replay: 'إعادة', markAsWatched: 'تمت المشاهدة',
        videoInstruction1: 'شاهد الفيديو التعليمي الكامل للآب تشاجي',
        videoInstruction2: 'ركز على المراحل الخمس الأساسية: الاستعداد، رفع الركبة، التمديد، السحب، العودة',
        videoInstruction3: 'يجب مشاهدة 80% على الأقل من الفيديو للمتابعة',
        videoInstruction4: 'بعد المشاهدة، اضغط على "تمت المشاهدة" للانتقال للألعاب التمرينية',
        gameTitle: 'رحلة التايكوندو', gameSubtitle: 'مغامرة تايكوندو تعليمية',
        home: 'الرئيسية', learning: 'التعلم', games: 'الألعاب', changeCharacter: 'تغيير الشخصية', quiz: 'الاختبار', warmup: 'الإحماء',
        welcome: '👋 أهلًا بك في رحلة التايكوندو', homeDescription: 'ابدأ رحلتك لإتقان تقنيات التايكوندو. أكمل كل مهارة لفتح التالية!',
        apChagi: 'آب تشاجي', frontKick: 'الركلة الأمامية', dolyoChagi: 'دوليو تشاجي', roundhouseKick: 'الركلة الدائرية',
        yeopChagi: 'يوب تشاجي', sideKick: 'الركلة الجانبية', dwiChagi: 'دوي تشاجي', backKick: 'الركلة الخلفية',
        completePrevious: 'أكمل المهارة السابقة لفتح', startLearning: 'ابدأ التعلم', practiceGames: 'تمارين الألعاب',
        selectCharacter: 'اختر شخصيتك', boy: 'الصبي', boyDesc: 'لاعب تايكوندو مبتدئ', girl: 'الفتاة', girlDesc: 'لاعبة تايكوندو مبتدئة',
        confirmSelect: 'تأكيد الاختيار', characterNote: 'الشخصية المختارة ستظهر في جميع الألعاب والأنشطة',
        changeCharacterTitle: '👤 تغيير الشخصية', currentCharacter: 'الشخصية الحالية:', selectNewCharacter: 'اختر شخصية جديدة:', select: 'اختر',
        coachYang: '👴 المدرب يانغ:',        coachInstruction1: 'انظر كيف أقوم بالركلة الأمامية خطوة بخطوة!', learningTitle: '🎓 تعلم الآب تشاجي', learningSubtitle: 'أتقن المراحل الخمس للركلة الأمامية',
        preparation: 'الاستعداد (جونبي)', chamber: 'رفع الركبة', extension: 'تمديد الركلة', recoil: 'سحب الرجل', return: 'العودة للوضعية',
        gamesCenter: '🎮 مركز الألعاب', chooseGame: 'اختر لعبة لتبدأ التدريب', formControl: 'التحكم في الشكل', formControlDesc: 'اسحب نقاط المفاصل أو استخدم الأسهم لإنشاء وضعية مثالية',
        puzzleAssembly: 'تركيب الأجزاء', puzzleDesc: 'رتب قطع البازل لتصنع تسلسل ركلة الآب تشاجي', performanceRecognition: 'تمييز الأداء',
        performanceDesc: 'اختر الصورة التي تظهر الركلة الصحيحة', quizDesc: 'اختبر معرفتك بالتايكوندو', notStarted: 'لم يبدأ', inProgress: 'قيد التقدم', completed: 'مكتمل',
        formControlGame: '🎭 التحكم في الشكل - تشكيل الآب تشاجي', formControlInstructions: 'اسحب نقاط التحكم أو استخدم الأسهم لتحريك المفاصل',
        instructions: '🎯 التعليمات:', instruction1: 'ارفع الركبة لمستوى الصدر', instruction2: 'مدد القدم للأمام مباشرة', instruction3: 'احتفظ بظهر مستقيم', instruction4: 'توازن على الساق الواقفة',
        accuracy: 'الدقة:', checkForm: 'تحقق من الشكل', autoPosition: 'وضع تلقائي', formProgress: 'تقدم الشكل:', backToGames: 'العودة للألعاب',
        puzzleGame: '🧩 تركيب الأجزاء - تسلسل الآب تشاجي', puzzleInstructions: 'رتب المراحل بالترتيب الصحيح من الاستعداد حتى الإكمال',
        puzzlePieces: 'اسحب القطع للفراغات:', readyStance: 'وضعية الاستعداد', kneeLift: 'رفع الركبة', fullExtension: 'تمديد كامل', legRetract: 'سحب الرجل', returnStance: 'العودة للوضعية',
        checkPuzzle: 'تحقق من التسلسل', hint: 'تلميح', puzzleProgress: 'تقدم التركيب:', performanceGame: '👁️ تمييز الأداء',
        performanceInstructions: 'اختر الصورة التي تظهر التقنية الصحيحة للآب تشاجي', whichIsCorrect: 'أي من هذه الصور تظهر الركلة الصحيحة؟',
        taekwondoQuiz: '❓ اختبار معرفة التايكوندو', quizDescription: 'اختبر فهمك لتقنيات ومصطلحات التايكوندو', question: 'سؤال', score: 'النقاط:',
        winner: '🏆 مبروك!', achievementsUnlocked: 'الإنجازات المُفتوحة:', firstCompletion: 'أول لعبة مكتملة', perfectForm: 'إتقان الشكل المثالي',
        nextLevel: 'المستوى التالي', tryAgain: 'حاول مرة أخرى', backToMenu: 'العودة للرئيسية', viewProgress: 'عرض التقدم',
        coachCongrats: 'أحسنت يا بطل! تفانيك في إتقان الآب تشاجي مثير للإعجاب. استمر في التدريب!',
        reset: 'إعادة تعيين',
        backToHome: 'العودة للرئيسية',
        nextQuestion: 'السؤال التالي',
        resetData: 'حذف البيانات'
      }
    };

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
        element.textContent = translations[this.currentLanguage][key];
      }
    });

    // Update lang toggle button: shows the OTHER language you can switch to
    const langSpan = document.getElementById('current-lang');
    if (langSpan) langSpan.textContent = this.currentLanguage === 'ar' ? 'EN' : 'AR';

    // Sync html element dir + lang
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');
  }

  async preloadAnimations() {
    const allAnimations = {};
    Object.values(GameConfig.ANIMATIONS).forEach(characterAnimations => {
      Object.entries(characterAnimations).forEach(([animationName, animation]) => {
        if (!allAnimations[animationName]) allAnimations[animationName] = animation;
      });
    });
    await SpriteEngine.preloadAnimations(allAnimations);
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

  updateGameProgress() {
    const games = [
      { id: 'form-control', progress: this.formControlProgress, statusId: 'form-status' },
      { id: 'puzzle', progress: this.puzzleProgress, statusId: 'puzzle-status' },
      { id: 'performance', progress: this.performanceProgress, statusId: 'performance-status' },
      { id: 'quiz', progress: this.quizProgress, statusId: 'quiz-status' }
    ];

    games.forEach(game => {
      const progressBar = document.getElementById(`${game.id}-progress-bar`);
      const statusElement = document.getElementById(game.statusId);
      if (progressBar) progressBar.style.width = `${game.progress}%`;
      if (statusElement) {
        if (game.progress >= GameConfig.SETTINGS.PASSING_SCORE) {
          statusElement.textContent = this.currentLanguage === 'ar' ? 'مكتمل' : 'Completed';
        } else if (game.progress > 0) {
          statusElement.textContent = this.currentLanguage === 'ar' ? 'قيد التقدم' : 'In Progress';
        } else {
          statusElement.textContent = this.currentLanguage === 'ar' ? 'لم يبدأ' : 'Not Started';
        }
      }
    });
  }

  updateHomeProgress() {
    const learningProgressBar = document.getElementById('learning-progress-bar');
    if (learningProgressBar) learningProgressBar.style.width = `${this.learningProgress}%`;
  }

  updateHomeSkills() {
    const apChagiStatus = document.getElementById('apchagi-status');
    const learningProgressBar = document.getElementById('learning-progress-bar');
    
    if (this.completedSkills.has('apchagi')) {
      if (apChagiStatus) apChagiStatus.textContent = this.currentLanguage === 'ar' ? 'مكتمل ✓' : 'Completed ✓';
      if (learningProgressBar) learningProgressBar.style.width = '100%';
      this.unlockSkill('dolyochagi');
      const dolyoCard = document.getElementById('dolyo-card');
      if (dolyoCard) {
        dolyoCard.classList.remove('locked');
        dolyoCard.innerHTML = `
          <div class="skill-icon">🥋</div>
          <div class="skill-progress"><div class="progress-bar" id="dolyo-progress-bar" style="width: 0%"></div></div>
          <span class="skill-status" data-i18n="startLearning">${this.currentLanguage === 'ar' ? 'ابدأ التعلم' : 'Start Learning'}</span>
        `;
        dolyoCard.onclick = () => { this.currentSkill = 'dolyochagi'; this.saveToStorage(); switchScreen('learning'); };
      }
    }
    
    if (this.completedSkills.has('dolyochagi')) {
      this.unlockSkill('yeopchagi');
      const yeopCard = document.getElementById('yeop-card');
      if (yeopCard) {
        yeopCard.classList.remove('locked');
        yeopCard.innerHTML = `
          <div class="skill-icon">🥋</div>
          <div class="skill-progress"><div class="progress-bar" id="yeop-progress-bar" style="width: 0%"></div></div>
          <span class="skill-status" data-i18n="startLearning">${this.currentLanguage === 'ar' ? 'ابدأ التعلم' : 'Start Learning'}</span>
        `;
        yeopCard.onclick = () => { this.currentSkill = 'yeopchagi'; this.saveToStorage(); switchScreen('learning'); };
      }
    }
    
    if (this.completedSkills.has('yeopchagi')) {
      this.unlockSkill('dwichagi');
      const dwiCard = document.getElementById('dwi-card');
      if (dwiCard) {
        dwiCard.classList.remove('locked');
        dwiCard.innerHTML = `
          <div class="skill-icon">🥋</div>
          <div class="skill-progress"><div class="progress-bar" id="dwi-progress-bar" style="width: 0%"></div></div>
          <span class="skill-status" data-i18n="startLearning">${this.currentLanguage === 'ar' ? 'ابدأ التعلم' : 'Start Learning'}</span>
        `;
        dwiCard.onclick = () => { this.currentSkill = 'dwichagi'; this.saveToStorage(); switchScreen('learning'); };
      }
    }
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
      const skillName = this.getSkillName(skillId);
      const message = this.currentLanguage === 'ar'
        ? `🎖️ مبروك! أتممت مهارة ${skillName}!`
        : `🎖️ Congratulations! You mastered ${skillName}!`;
      this.showNotification(message, 'success');
      return true;
    }
    return false;
  }

  getSkillName(skillId) {
    const skills = {
      apchagi: this.currentLanguage === 'ar' ? 'آب تشاجي' : 'Ap Chagi',
      dolyochagi: this.currentLanguage === 'ar' ? 'دوليو تشاجي' : 'Dolyo Chagi',
      yeopchagi: this.currentLanguage === 'ar' ? 'يوب تشاجي' : 'Yeop Chagi',
      dwichagi: this.currentLanguage === 'ar' ? 'دوي تشاجي' : 'Dwi Chagi'
    };
    return skills[skillId] || skillId;
  }

  completeGame(gameId) {
    if (!this.completedGames.has(gameId)) {
      this.completedGames.add(gameId);
      if (this.skillProgress[this.currentSkill]) {
        this.skillProgress[this.currentSkill].add(gameId);
        if (this.skillProgress[this.currentSkill].size >= GameConfig.SETTINGS.GAMES_REQUIRED_PER_SKILL) {
          this.completeSkill(this.currentSkill);
        }
      }
      this.saveToStorage();
      switch (gameId) {
        case 'learning': this.learningProgress = 100; break;
        case 'form-control': this.formControlProgress = 100; break;
        case 'puzzle': this.puzzleProgress = 100; break;
        case 'performance': this.performanceProgress = 100; break;
        case 'quiz': this.quizProgress = 100; break;
      }
      this.updateGameProgress();
      this.updateHomeProgress();
      this.updateHomeSkills();
      return true;
    }
    return false;
  }

  trackFailure() {
    this.failureCount++;
    this.saveToStorage();
    if (this.failureCount >= 3) {
      this.failureCount = 0;
      this.saveToStorage();
      ScreenManagerInstance.switchScreen('learning');
      this.showNotification(
        this.currentLanguage === 'ar'
          ? '📚 لقد فشلت 3 مرات. دعنا نعود للتعلم ونحسن تقنيتك!'
          : '📚 You failed 3 times. Let\'s go back to learning and improve your technique!',
        'warning'
      );
      return true;
    }
    return false;
  }
}

// =====================================================================
// SCREEN MANAGER
// =====================================================================
class ScreenManager {
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
    
    this.currentScreen = screenId;
    this.gameState.currentScreen = screenId;

    // Stop any running timers from previous screen to prevent background leaks
    try { WarmupSystem.stopTimer(); } catch(e) {}
    try { if (WarmupSystem._restInterval) { clearInterval(WarmupSystem._restInterval); WarmupSystem._restInterval = null; } } catch(e) {}
    try { PerformanceSystem.stopTimer(); } catch(e) {}
    // Remove Form Control drag listeners when leaving that screen
    if (this.currentScreen === 'form-control') {
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
    
    const targetScreen = document.getElementById(`${screenId}-screen`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));
      const navButton = document.querySelector(`.nav-btn[onclick*="${screenId}"]`);
      if (navButton) navButton.classList.add('active');
      
      this.setBackground(screenId);
      try {
        this.initializeScreen(screenId);
      } catch (err) {
        console.error('Screen init error:', err);
      }
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

  setBackground(screenId) {
    const background = GameConfig.BACKGROUNDS[screenId.toUpperCase()] || GameConfig.BACKGROUNDS.HOME;
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('${background}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  }

  initializeScreen(screenId) {
    switch (screenId) {
      case 'home':
        this.gameState.updateCharacterDisplays();
        this.gameState.updateHomeProgress();
        this.gameState.updateHomeSkills();
        break;
      case 'apchagi-menu': ApChagiMenuSystem.initialize(this.gameState); break;
      case 'warmup': WarmupSystem.initialize(this.gameState); break;
      case 'learning': LearningSystem.initialize(this.gameState); break;
      case 'games': this.gameState.updateGameProgress(); break;
      case 'form-control': FormControlSystem.initialize(this.gameState); break;
      case 'puzzle': PuzzleSystem.initialize(this.gameState); break;
      case 'performance': PerformanceSystem.initialize(this.gameState); break;
      case 'character-change': this.gameState.updateCharacterDisplays(); break;
      case 'quiz': QuizSystem.initialize(this.gameState); break;
      case 'winner': WinnerSystem.initialize(this.gameState); break;
    }
  }
}

// =====================================================================
// LEARNING SYSTEM — Phase Cards + Video
// =====================================================================
class LearningSystem {

  static PHASES(isBoy, ar) {
    const b = isBoy;
    return [
      {
        num: 1,
        title:   ar ? '1️⃣ وضعية الاستعداد (جونبي)' : '1️⃣ Ready Stance (Junbi)',
        image:   b  ? 'assets/images/characters/boy_char/Ready Stance boy.png'
                    : 'assets/images/characters/girl_char/Ready Stance_girl.png',
        focus:   ar ? '👀 ركّز على: قدماك على بُعد عرض كتفيك — جسمك مستقيم'
                    : '👀 Focus: Feet shoulder-width apart — body straight',
        tips: ar
          ? ['✅ يداك أمام صدرك للحماية', '✅ نظرك للأمام دائماً', '⚠️ لا تنحني للأمام أو للخلف']
          : ['✅ Hands up in front of chest for guard', '✅ Eyes always forward', '⚠️ Do not lean forward or back'],
        color: '#2a9d8f'
      },
      {
        num: 2,
        title:   ar ? '2️⃣ رفع الركبة (التجهيز)' : '2️⃣ Knee Lift (Chamber)',
        image:   b  ? 'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png'
                    : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
        focus:   ar ? '👀 ركّز على: الركبة ترتفع لمستوى الصدر بقوة وسرعة'
                    : '👀 Focus: Drive the knee up to chest height powerfully',
        tips: ar
          ? ['✅ الركبة لازم توصل لمستوى الصدر', '✅ القدم الواقفة ثابتة تماماً', '⚠️ لا ترفع الركبة بشكل منخفض']
          : ['✅ Knee must reach chest level', '✅ Standing foot stays flat and firm', '⚠️ Do not lift knee too low'],
        color: '#e76f51'
      },
      {
        num: 3,
        title:   ar ? '3️⃣ تمديد الركلة (الضربة)' : '3️⃣ Kick Extension (Strike)',
        image:   b  ? 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png'
                    : 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
        focus:   ar ? '👀 ركّز على: مد الرجل بالكامل — اضرب بكرة القدم'
                    : '👀 Focus: Fully extend the leg — strike with the ball of your foot',
        tips: ar
          ? ['✅ الرجل تمتد بالكامل للأمام', '✅ أصابع القدم مطوية للخلف', '⚠️ لا تضرب بأصابع القدم — استخدم كرة القدم']
          : ['✅ Leg fully extends forward', '✅ Toes pulled back to expose ball of foot', '⚠️ Never strike with the toes'],
        color: '#ff6b35'
      },
      {
        num: 4,
        title:   ar ? '4️⃣ سحب الرجل (الارتداد)' : '4️⃣ Recoil (Pull Back)',
        image:   b  ? 'assets/images/characters/boy_char/Recoil (Pull Back) boy.png'
                    : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
        focus:   ar ? '👀 ركّز على: اسحب الرجل للخلف بسرعة بعد الضربة'
                    : '👀 Focus: Snap the leg back immediately after the strike',
        tips: ar
          ? ['✅ السحب بنفس سرعة التمديد', '✅ يحمي من الإمساك بقدمك', '⚠️ لا تترك الرجل معلقة في الهواء']
          : ['✅ Recoil as fast as the extension', '✅ Protects against leg grabs', '⚠️ Never leave the leg hanging'],
        color: '#e9c46a'
      },
      {
        num: 5,
        title:   ar ? '5️⃣ العودة للوضعية' : '5️⃣ Return to Stance',
        image:   b  ? 'assets/images/characters/boy_char/boy_idle.png'
                    : 'assets/images/characters/girl_char/girl_idle.png',
        focus:   ar ? '👀 ركّز على: أعد قدمك للأرض بهدوء وحافظ على توازنك'
                    : '👀 Focus: Step down smoothly and regain your ready stance',
        tips: ar
          ? ['✅ عد لوضعية الاستعداد فوراً', '✅ حافظ على توازنك طوال الوقت', '⚠️ لا تسقط قدمك بثقل على الأرض']
          : ['✅ Return to guard position immediately', '✅ Maintain balance throughout', '⚠️ Do not stomp the foot down'],
        color: '#457b9d'
      }
    ];
  }

  static initialize(gameState) {
    this.gameState      = gameState;
    this.videoElement   = null;
    this.isVideoPlaying = false;
    this.videoCompleted = false;
    this.currentPhase   = 0;
    this.phasesRead     = new Set();

    this.render();
  }

  static render() {
    const container = document.querySelector('.learning-steps');
    if (!container) return;
    container.innerHTML = '';

    if (this.currentPhase < 5) {
      this.renderPhaseCard(container);
    } else {
      this.renderVideo(container);
    }
  }

  static renderPhaseCard(container) {
    const ar    = this.gameState.currentLanguage === 'ar';
    const isBoy = this.gameState.playerCharacter === 'boy';
    const phases = LearningSystem.PHASES(isBoy, ar);
    const phase  = phases[this.currentPhase];
    const total  = phases.length;

    container.innerHTML = `
      <div class="phase-card-wrapper">

        <div class="phase-dots">
          ${phases.map((p, i) => `
            <div class="phase-dot ${i < this.currentPhase ? 'done' : ''} ${i === this.currentPhase ? 'active' : ''}"
                 title="${p.title}">
              ${i < this.currentPhase ? '✓' : i + 1}
            </div>
          `).join('')}
          <div class="phase-dot ${this.currentPhase >= 5 ? 'done active' : ''}">🎥</div>
        </div>

        <div class="phase-card" style="border-top: 5px solid ${phase.color}">

          <div class="phase-card-header" style="background: ${phase.color}22">
            <h2 class="phase-title">${phase.title}</h2>
            <span class="phase-counter">${ar ? `${this.currentPhase + 1} / ${total}` : `${this.currentPhase + 1} / ${total}`}</span>
          </div>

          <div class="phase-card-body">
            <div class="phase-image-col">
              <div class="phase-char-img" style="background-image:url('${phase.image.replace(/ /g,'%20')}')"></div>
            </div>

            <div class="phase-info-col">
              <div class="phase-focus-box" style="border-left: 4px solid ${phase.color}">
                <p>${phase.focus}</p>
              </div>

              <ul class="phase-tips-list">
                ${phase.tips.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="phase-card-footer">
            ${this.currentPhase > 0
              ? `<button class="btn" id="phase-prev-btn"><i class="fas fa-arrow-left"></i> ${ar ? 'السابق' : 'Back'}</button>`
              : '<span></span>'
            }
            <div class="phase-read-badge" id="phase-read-badge" style="display:${this.phasesRead.has(this.currentPhase) ? 'flex' : 'none'}">
              <i class="fas fa-check-circle"></i> ${ar ? 'تمت القراءة' : 'Read!'}
            </div>
            <button class="btn btn-success" id="phase-next-btn">
              ${this.currentPhase === total - 1
                ? (ar ? 'شاهد الفيديو 🎥' : 'Watch Video 🎥')
                : (ar ? 'التالي ←' : 'Next →')
              }
            </button>
          </div>

        </div>
      </div>
    `;

    setTimeout(() => {
      this.phasesRead.add(this.currentPhase);
      const badge = document.getElementById('phase-read-badge');
      if (badge) badge.style.display = 'flex';
    }, 2000);

    document.getElementById('phase-next-btn')?.addEventListener('click', () => {
      this.gameState.playSound('click');
      this.currentPhase++;
      this.render();
    });
    document.getElementById('phase-prev-btn')?.addEventListener('click', () => {
      this.gameState.playSound('click');
      this.currentPhase--;
      this.render();
    });
  }

  static renderVideo(container) {
    const ar = this.gameState.currentLanguage === 'ar';
    const phases = LearningSystem.PHASES(false, ar);

    // User has read all 5 phases — unlock games even before video is watched
    LearningSystem.unlockGamesFromPhases();

    container.innerHTML = `
      <div class="phase-dots" style="margin-bottom:20px">
        ${phases.map((p, i) => `<div class="phase-dot done" title="${p.title}">✓</div>`).join('')}
        <div class="phase-dot active">🎥</div>
      </div>

      <div class="video-container">
        <h3>🎥 ${ar ? 'شاهد الآن: الآب تشاجي كاملاً' : 'Now Watch: Full Ap Chagi Tutorial'}</h3>
        <div class="video-wrapper">
          <video id="learning-video" controls preload="metadata">
            <source src="${GameConfig.VIDEOS.AP_CHAGI_TUTORIAL}" type="video/mp4">
          </video>
          <div class="video-controls">
            <button class="btn btn-small" id="play-pause-btn"><i class="fas fa-play"></i> ${ar ? 'تشغيل' : 'Play'}</button>
            <button class="btn btn-small" id="replay-btn"><i class="fas fa-redo"></i> ${ar ? 'إعادة' : 'Replay'}</button>
            <button class="btn btn-small btn-success" id="mark-complete-btn" disabled>
              <i class="fas fa-check"></i> ${ar ? 'تمت المشاهدة ✓' : 'Mark as Watched ✓'}
            </button>
          </div>
          <div class="video-progress-bar-wrap">
            <div class="video-progress-bar-fill" id="vid-progress-fill" style="width:0%"></div>
          </div>
          <p class="video-hint">${ar ? '⏱️ شاهد 80% على الأقل لتفعيل زر الإكمال' : '⏱️ Watch at least 80% to unlock the completion button'}</p>
        </div>
        <button class="btn" id="back-to-phases-btn" style="margin-top:10px">
          <i class="fas fa-arrow-left"></i> ${ar ? 'مراجعة المراحل' : 'Review Phases'}
        </button>
      </div>
    `;

    this.videoElement = document.getElementById('learning-video');
    this.videoElement.addEventListener('timeupdate', () => this.checkVideoProgress());
    this.videoElement.addEventListener('ended',      () => this.onVideoEnded());
    this.videoElement.addEventListener('play',  () => { this.isVideoPlaying = true;  this.updatePlayButton(); });
    this.videoElement.addEventListener('pause', () => { this.isVideoPlaying = false; this.updatePlayButton(); });

    document.getElementById('play-pause-btn')?.addEventListener('click',    () => this.toggleVideoPlayback());
    document.getElementById('replay-btn')?.addEventListener('click',        () => this.replayVideo());
    document.getElementById('mark-complete-btn')?.addEventListener('click', () => this.completeLearning());
    document.getElementById('back-to-phases-btn')?.addEventListener('click', () => {
      this.currentPhase = 0;
      this.render();
    });
  }

  static toggleVideoPlayback() {
    if (!this.videoElement) return;
    if (this.videoElement.paused) { this.videoElement.play(); this.isVideoPlaying = true; }
    else                          { this.videoElement.pause(); this.isVideoPlaying = false; }
    this.updatePlayButton();
  }

  static updatePlayButton() {
    const ar  = this.gameState.currentLanguage === 'ar';
    const btn = document.getElementById('play-pause-btn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    const span = btn.querySelector('span') || btn;
    if (this.isVideoPlaying) { if (icon) icon.className = 'fas fa-pause'; }
    else                     { if (icon) icon.className = 'fas fa-play';  }
  }

  static replayVideo() {
    if (!this.videoElement) return;
    this.videoElement.currentTime = 0;
    this.videoElement.play();
    this.isVideoPlaying = true;
    this.gameState.playSound('click');
  }

  static checkVideoProgress() {
    if (!this.videoElement) return;
    const pct = this.videoElement.duration > 0
      ? (this.videoElement.currentTime / this.videoElement.duration) * 100 : 0;

    const fill = document.getElementById('vid-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    if (pct >= 80 && !this.videoCompleted) {
      this.videoCompleted = true;
      const btn = document.getElementById('mark-complete-btn');
      if (btn) { btn.disabled = false; btn.style.animation = 'pulse-btn 0.6s ease 3'; }
    }
  }

  static onVideoEnded() {
    this.isVideoPlaying = false;
    this.videoCompleted = true;
    this.updatePlayButton();
    const btn = document.getElementById('mark-complete-btn');
    if (btn) btn.disabled = false;
    this.gameState.playSound('success');
    this.gameState.showNotification(
      this.gameState.currentLanguage === 'ar'
        ? '🎉 أحسنت! يمكنك الآن إكمال مرحلة التعلم.'
        : '🎉 Great job! You can now complete the learning phase.',
      'success'
    );
  }

  static completeLearning() {
    if (!this.gameState) return;
    this.gameState.completeGame('learning');
    this.gameState.playSound('success');
    this.gameState.showNotification(
      this.gameState.currentLanguage === 'ar'
        ? '🎉 مبروك! أتممت مرحلة التعلم بنجاح!'
        : '🎉 Congratulations! Learning phase complete!',
      'success'
    );
    this.gameState.updateHomeProgress();
    this.gameState.updateHomeSkills();
    setTimeout(() => { if (ScreenManagerInstance) ScreenManagerInstance.switchScreen('apchagi-menu'); }, 1500);
  }

  // Called after user reads all 5 phase cards — unlocks games without needing video
  static unlockGamesFromPhases() {
    if (!this.gameState) return;
    if (this.gameState.completedGames.has('learning')) return; // already unlocked
    this.gameState.completedGames.add('learning');
    this.gameState.learningProgress = 80;
    this.gameState.saveToStorage();
    this.gameState.updateHomeProgress();
    this.gameState.showNotification(
      this.gameState.currentLanguage === 'ar'
        ? '🎓 أحسنت! قرأت جميع المراحل — الألعاب مفتوحة الآن! شاهد الفيديو لإكمال التعلم كاملاً.'
        : '🎓 Well done! All phases read — games are now unlocked! Watch the video to fully complete learning.',
      'success'
    );
  }
}

// =====================================================================
// GAME 1: FORM CONTROL SYSTEM — Target zones + live feedback
// =====================================================================
class FormControlSystem {
  static kickFrames = {
    boy: {
      ready:    'assets/images/characters/boy_char/Ready Stance boy.png',
      chamber:  'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png',
      extension:'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png',
      recoil:   'assets/images/characters/boy_char/Recoil (Pull Back) boy.png',
      return:   'assets/images/characters/boy_char/boy_idle.png'
    },
    girl: {
      ready:    'assets/images/characters/girl_char/Ready Stance_girl.png',
      chamber:  'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
      extension:'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
      return:   'assets/images/characters/girl_char/girl_idle.png'
    }
  };

  static JOINT_META = {
    knee: {
      label: { en: 'Knee', ar: 'الركبة' },
      hints: {
        up:    { en: 'Knee is too high ↓', ar: 'الركبة عالية جداً ↓' },
        down:  { en: 'Lift the knee higher ↑', ar: 'ارفع الركبة أعلى ↑' },
        left:  { en: 'Bring knee inward →', ar: 'حرك الركبة للداخل →' },
        right: { en: 'Bring knee outward ←', ar: 'حرك الركبة للخارج ←' },
        great: { en: '✅ Knee — Perfect!', ar: '✅ الركبة — ممتازة!' }
      }
    },
    foot: {
      label: { en: 'Foot', ar: 'القدم' },
      hints: {
        up:    { en: 'Lower the foot slightly ↓', ar: 'انزل القدم قليلاً ↓' },
        down:  { en: 'Extend foot further ↑', ar: 'مد القدم للأمام أكثر ↑' },
        left:  { en: 'Push foot further forward →', ar: 'ادفع القدم للأمام →' },
        right: { en: 'Bring foot back ←', ar: 'أعد القدم للخلف ←' },
        great: { en: '✅ Foot — Perfect!', ar: '✅ القدم — ممتازة!' }
      }
    },
    'hand-left': {
      label: { en: 'Left Hand', ar: 'اليد اليسرى' },
      hints: {
        up:    { en: 'Lower left hand ↓', ar: 'أنزل اليد اليسرى ↓' },
        down:  { en: 'Raise left hand ↑', ar: 'ارفع اليد اليسرى ↑' },
        left:  { en: 'Move left hand right →', ar: 'حرك اليسرى يميناً →' },
        right: { en: 'Move left hand left ←', ar: 'حرك اليسرى يساراً ←' },
        great: { en: '✅ Left hand — Perfect!', ar: '✅ اليد اليسرى — ممتازة!' }
      }
    },
    'hand-right': {
      label: { en: 'Right Hand', ar: 'اليد اليمنى' },
      hints: {
        up:    { en: 'Lower right hand ↓', ar: 'أنزل اليد اليمنى ↓' },
        down:  { en: 'Raise right hand ↑', ar: 'ارفع اليد اليمنى ↑' },
        left:  { en: 'Move right hand right →', ar: 'حرك اليمنى يميناً →' },
        right: { en: 'Move right hand left ←', ar: 'حرك اليمنى يساراً ←' },
        great: { en: '✅ Right hand — Perfect!', ar: '✅ اليد اليمنى — ممتازة!' }
      }
    }
  };

  static initialize(gameState) {
    this.gameState        = gameState;
    this.accuracy         = 0;
    this.isDragging       = false;
    this.draggedElement   = null;
    this.draggedPart      = null;
    this.selectedCharacter= gameState.playerCharacter;
    this.controlPoints    = ['knee', 'foot', 'hand-left', 'hand-right'];
    this.keyboardActive   = false;
    this.keyboardStep     = 2;
    this.rewardPlayed     = false;

    // Save existing point positions so language switch doesn't reset them
    const savedPositions = {};
    this.controlPoints.forEach(part => {
      const el = document.getElementById(`cp-${part}`);
      if (el && el.style.left) savedPositions[part] = { x: el.style.left, y: el.style.top };
    });
    this._savedPositions = Object.keys(savedPositions).length === this.controlPoints.length
      ? savedPositions : null;

    this.limits = {
      knee:         { minX: 35, maxX: 55, minY: 42, maxY: 68 },
      foot:         { minX: 45, maxX: 65, minY: 58, maxY: 82 },
      'hand-left':  { minX: 22, maxX: 42, minY: 28, maxY: 48 },
      'hand-right': { minX: 58, maxX: 78, minY: 28, maxY: 48 }
    };

    this.idealPositions = {
      knee:         { x: 45, y: 55 },
      foot:         { x: 55, y: 70 },
      'hand-left':  { x: 32, y: 38 },
      'hand-right': { x: 68, y: 38 }
    };

    setTimeout(() => {
      this.setupGame(); this.setupKeyboardControls();
      // Restore positions if this was a language switch (not a fresh entry)
      if (this._savedPositions) {
        this.controlPoints.forEach(part => {
          const el = document.getElementById(`cp-${part}`);
          const saved = this._savedPositions[part];
          if (el && saved) { el.style.left = saved.x; el.style.top = saved.y; }
        });
        this._savedPositions = null;
        this.calculateAccuracy();
      }
    }, 100);
  }

  static setupGame() {
    this.removeExistingControlPoints();
    this.setupCharacterSelector();
    this.setupCharacterImages();
    this.createTargetZones();
    this.createControlPoints();
    this.initializeControlPoints();
    this.setupEventListeners();
    this.updateDisplay();
    this.updateJointFeedbackPanel();
  }

  static setupCharacterSelector() {
    const instructionsDiv = document.querySelector('.game-instructions');
    if (!instructionsDiv || instructionsDiv.querySelector('.character-selector-form')) return;
    const ar = this.gameState.currentLanguage === 'ar';
    instructionsDiv.insertAdjacentHTML('afterbegin', `
      <div class="character-selector-form">
        <h4 style="color:var(--primary-color);margin-bottom:10px;">👤 ${ar ? 'الشخصية:' : 'Character:'}</h4>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <label class="char-radio-label">
            <input type="radio" name="form-character" value="boy" ${this.selectedCharacter==='boy'?'checked':''}>
            <div class="char-radio-thumb" style="background-image:url('assets/images/characters/boy_char/boy_idle.png')"></div>
            <span>${ar ? 'الصبي' : 'Boy'}</span>
          </label>
          <label class="char-radio-label">
            <input type="radio" name="form-character" value="girl" ${this.selectedCharacter==='girl'?'checked':''}>
            <div class="char-radio-thumb" style="background-image:url('assets/images/characters/girl_char/girl_idle.png')"></div>
            <span>${ar ? 'الفتاة' : 'Girl'}</span>
          </label>
        </div>
      </div>
    `);
    document.querySelectorAll('input[name="form-character"]').forEach(r => {
      r.addEventListener('change', (e) => {
        this.selectedCharacter = e.target.value;
        this.rewardPlayed = false;
        this.setupCharacterImages();
        this.initializeControlPoints();
        this.removeTargetZones();
        this.createTargetZones();
      });
    });
  }

  static setupCharacterImages() {
    const b = this.selectedCharacter === 'boy';
    const refEl  = document.getElementById('reference-character');
    const charEl = document.getElementById('form-character');
    if (refEl)  refEl.style.backgroundImage  = `url('${(b ? 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png' : 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png').replace(/ /g,'%20')}')`;
    if (charEl) charEl.style.backgroundImage = `url('${(b ? 'assets/images/characters/boy_char/Ready Stance boy.png' : 'assets/images/characters/girl_char/Ready Stance_girl.png').replace(/ /g,'%20')}')`;
  }

  static createTargetZones() {
    const stage = document.getElementById('form-stage');
    if (!stage) return;
    const wrap = document.createElement('div');
    wrap.className = 'target-zones';
    Object.entries(this.idealPositions).forEach(([part, pos]) => {
      const zone = document.createElement('div');
      zone.className = 'target-zone';
      zone.id = `tz-${part}`;
      zone.style.left = `${pos.x}%`;
      zone.style.top  = `${pos.y}%`;
      wrap.appendChild(zone);
    });
    stage.appendChild(wrap);
  }

  static removeTargetZones() {
    document.querySelector('.target-zones')?.remove();
  }

  static removeExistingControlPoints() {
    document.querySelector('.control-points')?.remove();
  }

  static createControlPoints() {
    const stage = document.getElementById('form-stage');
    if (!stage) return;
    const wrap = document.createElement('div');
    wrap.className = 'control-points';
    this.controlPoints.forEach(part => {
      const point = document.createElement('div');
      point.className = 'control-point cp-far';
      point.id = `cp-${part}`;
      point.dataset.part = part;
      point.setAttribute('draggable', 'false');
      const ar = this.gameState.currentLanguage === 'ar';
      point.title = FormControlSystem.JOINT_META[part]?.label?.[ar ? 'ar' : 'en'] || part;
      wrap.appendChild(point);
    });
    stage.appendChild(wrap);
  }

  static initializeControlPoints() {
    Object.entries(this.idealPositions).forEach(([part, ideal]) => {
      const point = document.getElementById(`cp-${part}`);
      const limit = this.limits[part];
      if (!point || !limit) return;
      const rangeX = limit.maxX - limit.minX;
      const rangeY = limit.maxY - limit.minY;
      let x, y, tries = 0;
      do {
        x = limit.minX + Math.random() * rangeX;
        y = limit.minY + Math.random() * rangeY;
        tries++;
      } while (tries < 30 && Math.abs(x - ideal.x) < rangeX * 0.28 && Math.abs(y - ideal.y) < rangeY * 0.28);
      point.style.left = `${x}%`;
      point.style.top  = `${y}%`;
      point.className  = 'control-point cp-far';
    });
    this.updateCharacterFrame();
  }

  static applyLimitX(part, x) { const l = this.limits[part]; return l ? Math.max(l.minX, Math.min(l.maxX, x)) : x; }
  static applyLimitY(part, y) { const l = this.limits[part]; return l ? Math.max(l.minY, Math.min(l.maxY, y)) : y; }

  static updateJointFeedbackPanel() {
    let panel = document.getElementById('joint-feedback-panel');
    if (!panel) {
      const instructionsDiv = document.querySelector('.game-instructions');
      if (!instructionsDiv) return;
      panel = document.createElement('div');
      panel.id = 'joint-feedback-panel';
      panel.className = 'joint-feedback-panel';
      instructionsDiv.insertAdjacentElement('beforeend', panel);
    }

    const ar = this.gameState.currentLanguage === 'ar';
    const tolerance = 1.5;
    let html = `<h4 style="color:var(--primary-color);margin-bottom:8px;">${ar ? '📍 إرشادات المفاصل:' : '📍 Joint Guidance:'}</h4>`;

    this.controlPoints.forEach(part => {
      const point   = document.getElementById(`cp-${part}`);
      const ideal   = this.idealPositions[part];
      const meta    = FormControlSystem.JOINT_META[part];
      if (!point || !ideal || !meta) return;

      const cx = parseFloat(point.style.left) || ideal.x;
      const cy = parseFloat(point.style.top)  || ideal.y;
      const dx = cx - ideal.x;
      const dy = cy - ideal.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let hint, color;
      if (dist <= tolerance) {
        hint  = meta.hints.great[ar ? 'ar' : 'en'];
        color = '#2a9d8f';
      } else {
        const absDx = Math.abs(dx), absDy = Math.abs(dy);
        if (absDy >= absDx) {
          hint  = dy < 0 ? meta.hints.up[ar ? 'ar' : 'en'] : meta.hints.down[ar ? 'ar' : 'en'];
        } else {
          hint  = dx < 0 ? meta.hints.left[ar ? 'ar' : 'en'] : meta.hints.right[ar ? 'ar' : 'en'];
        }
        color = dist < 6 ? '#e9c46a' : '#e63946';
      }

      html += `<div class="joint-hint" style="border-left:4px solid ${color};">
                 <span style="color:${color};font-weight:bold;">${meta.label[ar ? 'ar' : 'en']}:</span>
                 <span> ${hint}</span>
               </div>`;
    });

    panel.innerHTML = html;
  }

  static setupEventListeners() {
    // Remove any previous global drag listeners before adding new ones
    if (FormControlSystem._dragMoveHandler) {
      document.removeEventListener('mousemove', FormControlSystem._dragMoveHandler);
      document.removeEventListener('touchmove', FormControlSystem._dragMoveHandler);
    }
    if (FormControlSystem._dragStopHandler) {
      document.removeEventListener('mouseup',  FormControlSystem._dragStopHandler);
      document.removeEventListener('touchend', FormControlSystem._dragStopHandler);
    }

    FormControlSystem._dragMoveHandler = (e) => this.drag(e);
    FormControlSystem._dragStopHandler = () => this.stopDrag();

    document.querySelectorAll('.control-point').forEach(point => {
      point.addEventListener('mousedown',  (e) => this.startDrag(e));
      point.addEventListener('touchstart', (e) => { e.preventDefault(); this.startDrag(e); }, { passive: false });
    });
    document.addEventListener('mousemove', FormControlSystem._dragMoveHandler);
    document.addEventListener('touchmove', FormControlSystem._dragMoveHandler, { passive: false });
    document.addEventListener('mouseup',   FormControlSystem._dragStopHandler);
    document.addEventListener('touchend',  FormControlSystem._dragStopHandler);

    document.getElementById('reset-form-btn')?.addEventListener('click',    (e) => { e.preventDefault(); this.resetForm(); });
    document.getElementById('check-form-btn')?.addEventListener('click',    (e) => { e.preventDefault(); this.checkForm(); });
    document.getElementById('auto-position-btn')?.addEventListener('click', (e) => { e.preventDefault(); this.autoPosition(); });
  }

  static setupKeyboardControls() {
    const instructionsDiv = document.querySelector('.game-instructions');
    if (instructionsDiv && !instructionsDiv.querySelector('.keyboard-controls')) {
      const ar = this.gameState.currentLanguage === 'ar';
      instructionsDiv.insertAdjacentHTML('beforeend', `
        <div class="keyboard-controls">
          <p style="margin:0;font-size:0.85rem;">
            <i class="fas fa-keyboard"></i>
            <strong>${ar ? 'لوحة المفاتيح:' : 'Keyboard:'}</strong>
            ${ar ? 'انقر على نقطة ← مفاتيح الأسهم للتحريك' : 'Click a point → Arrow keys to move it'}
          </p>
        </div>
      `);
    }
    // Attach keydown only ONCE per page load using a flag on the class
    if (!FormControlSystem._keydownAttached) {
      FormControlSystem._keydownAttached = true;
      document.addEventListener('keydown', (e) => {
        if (!FormControlSystem.keyboardActive || !FormControlSystem.draggedPart) return;
        e.preventDefault();
        const point = document.getElementById(`cp-${FormControlSystem.draggedPart}`);
        if (!point) return;
        let x = parseFloat(point.style.left) || 50;
        let y = parseFloat(point.style.top)  || 50;
        switch(e.key) {
          case 'ArrowUp':    y -= FormControlSystem.keyboardStep; break;
          case 'ArrowDown':  y += FormControlSystem.keyboardStep; break;
          case 'ArrowLeft':  x -= FormControlSystem.keyboardStep; break;
          case 'ArrowRight': x += FormControlSystem.keyboardStep; break;
          default: return;
        }
        point.style.left = `${FormControlSystem.applyLimitX(FormControlSystem.draggedPart, x)}%`;
        point.style.top  = `${FormControlSystem.applyLimitY(FormControlSystem.draggedPart, y)}%`;
        FormControlSystem.updateColorForPoint(FormControlSystem.draggedPart);
        FormControlSystem.calculateAccuracy();
        FormControlSystem.gameState.playSound('click');
      });
    }
    document.querySelectorAll('.control-point').forEach(p => {
      p.addEventListener('click', () => {
        document.querySelectorAll('.control-point').forEach(q => q.classList.remove('keyboard-selected'));
        p.classList.add('keyboard-selected');
        this.draggedPart  = p.dataset.part;
        this.keyboardActive = true;
      });
    });
    document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('control-point')) {
        document.querySelectorAll('.control-point').forEach(q => q.classList.remove('keyboard-selected'));
        FormControlSystem.keyboardActive = false;
        FormControlSystem.draggedPart = null;
      }
    });
  }

  static startDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging     = true;
    this.draggedElement = event.target.closest('.control-point') || event.target;
    this.draggedPart    = this.draggedElement.dataset.part;
    this.draggedElement.classList.add('dragging');
    this.keyboardActive = false;
    this.gameState.playSound('click');
  }

  static drag(event) {
    if (!this.isDragging || !this.draggedElement || !this.draggedPart) return;
    event.preventDefault();
    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;
    const rect    = document.getElementById('form-stage').getBoundingClientRect();
    const x = this.applyLimitX(this.draggedPart, ((clientX - rect.left)  / rect.width)  * 100);
    const y = this.applyLimitY(this.draggedPart, ((clientY - rect.top) / rect.height) * 100);
    this.draggedElement.style.left = `${x}%`;
    this.draggedElement.style.top  = `${y}%`;
    this.updateColorForPoint(this.draggedPart);
    this.calculateAccuracy();
  }

  static stopDrag() {
    if (this.draggedElement) {
      this.draggedElement.classList.remove('dragging');
      this.draggedElement.style.transform = 'translate(-50%,-50%) scale(1)';
    }
    this.isDragging = false; this.draggedElement = null; this.draggedPart = null;
  }

  static updateColorForPoint(part) {
    const point   = document.getElementById(`cp-${part}`);
    const ideal   = this.idealPositions[part];
    if (!point || !ideal) return;
    const dx   = parseFloat(point.style.left) - ideal.x;
    const dy   = parseFloat(point.style.top)  - ideal.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    point.classList.remove('cp-far', 'cp-close', 'cp-perfect');
    if (dist <= 1.5)     point.classList.add('cp-perfect');
    else if (dist <= 6)  point.classList.add('cp-close');
    else                 point.classList.add('cp-far');
  }

  static updateAllPointColors() {
    this.controlPoints.forEach(part => this.updateColorForPoint(part));
  }

  static updateCharacterFrame() {
    const kneePoint = document.getElementById('cp-knee');
    const character = document.getElementById('form-character');
    if (!kneePoint || !character) return;
    const kneeY  = parseFloat(kneePoint.style.top) || 50;
    const frames = this.kickFrames[this.selectedCharacter];
    let frame;
    if      (kneeY <= 47) frame = frames.ready;
    else if (kneeY <= 56) frame = frames.chamber;
    else if (kneeY <= 66) frame = frames.extension;
    else if (kneeY <= 75) frame = frames.recoil || frames.return;
    else                  frame = frames.return;
    character.style.backgroundImage = `url('${frame.replace(/ /g,'%20')}')`;
  }

  static calculateAccuracy() {
    let totalScore = 0, validPoints = 0;
    const tolerance = 1.5;

    this.controlPoints.forEach(part => {
      const point = document.getElementById(`cp-${part}`);
      const ideal = this.idealPositions[part];
      const limit = this.limits[part];
      if (!point || !ideal || !limit) return;
      const cx = parseFloat(point.style.left);
      const cy = parseFloat(point.style.top);
      if (isNaN(cx) || isNaN(cy)) return;

      const dist = Math.sqrt(Math.pow(cx - ideal.x, 2) + Math.pow(cy - ideal.y, 2));
      const corners = [
        {x: limit.minX, y: limit.minY}, {x: limit.maxX, y: limit.minY},
        {x: limit.minX, y: limit.maxY}, {x: limit.maxX, y: limit.maxY}
      ];
      const maxDev = Math.max(...corners.map(c => Math.sqrt(Math.pow(c.x - ideal.x, 2) + Math.pow(c.y - ideal.y, 2))));
      const score  = maxDev > 0 ? Math.max(0, 100 - ((Math.max(0, dist - tolerance) / maxDev) * 100)) : 100;
      totalScore += score;
      validPoints++;
    });

    this.accuracy = validPoints > 0 ? Math.min(100, Math.round(totalScore / validPoints)) : 0;
    this.updateCharacterFrame();
    this.updateAllPointColors();
    this.updateDisplay();
    this.updateJointFeedbackPanel();

    if (this.accuracy >= 85 && !this.rewardPlayed) {
      this.rewardPlayed = true;
      this.playRewardAnimation();
    }
  }

  static playRewardAnimation() {
    const charEl = document.getElementById('form-character');
    if (!charEl) return;
    const ar = this.gameState.currentLanguage === 'ar';
    this.gameState.playSound('win');
    charEl.style.animation = 'rewardKick 0.5s ease-in-out 2';
    this.gameState.showNotification(
      ar ? '🔥 أحسنت! الشكل ممتاز! اضغط "تحقق من الشكل" للإكمال.'
         : '🔥 Great form! Press "Check Form" to complete!',
      'success'
    );
    setTimeout(() => { charEl.style.animation = ''; }, 1100);
  }

  static updateDisplay() {
    const accEl = document.getElementById('form-accuracy');
    const barEl = document.getElementById('form-progress');
    if (accEl) {
      accEl.textContent = `${this.accuracy}%`;
      accEl.style.color = this.accuracy >= 85 ? 'var(--success-color)'
                        : this.accuracy >= 60  ? 'var(--warning-color)'
                        : 'var(--danger-color)';
    }
    if (barEl) barEl.style.width = `${this.accuracy}%`;
  }

  static resetForm() {
    this.rewardPlayed = false;
    this.initializeControlPoints();
    this.calculateAccuracy();
    this.gameState.playSound('click');
    this.showFeedback(this.gameState.currentLanguage === 'ar' ? '🔄 تمت إعادة التعيين' : '🔄 Reset complete', 'info');
  }

  static autoPosition() {
    Object.entries(this.idealPositions).forEach(([part, pos]) => {
      const p = document.getElementById(`cp-${part}`);
      if (p) { p.style.left = `${pos.x}%`; p.style.top = `${pos.y}%`; }
    });
    this.calculateAccuracy();
    this.gameState.playSound('success');
    this.showFeedback(this.gameState.currentLanguage === 'ar' ? '✨ تم تطبيق الشكل المثالي' : '✨ Perfect form applied', 'success');
  }

  static checkForm() {
    this.calculateAccuracy();
    const ar = this.gameState.currentLanguage === 'ar';
    if (this.accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      this.gameState.playSound('win');
      this.showFeedback(`🎉 ${ar ? 'ممتاز! دقتك' : 'Excellent! Accuracy:'} ${this.accuracy}%`, 'success');
      this.gameState.completeGame('form-control');
      setTimeout(() => WinnerSystem.show('form-control', this.accuracy, this.gameState), 1500);
    } else {
      this.gameState.playSound('error');
      this.showFeedback(`⚠️ ${ar ? 'دقتك' : 'Accuracy:'} ${this.accuracy}% — ${ar ? 'اتبع الإرشادات أعلاه' : 'Follow the guidance above'}`, 'error');
      this.gameState.trackFailure();
    }
  }

  static showFeedback(message, type) {
    const div = document.getElementById('form-feedback');
    if (!div) return;
    div.textContent  = message;
    div.className    = `feedback-message ${type}`;
    div.style.display = 'block';
    setTimeout(() => { div.style.display = 'none'; }, 3500);
  }
}

// =====================================================================
// GAME 2: PUZZLE SYSTEM — descriptions + preview + snap/shake
// =====================================================================
class PuzzleSystem {

  static STEP_DATA(isBoy, ar) {
    const b = isBoy;
    return {
      step1: {
        image:   b ? 'assets/images/characters/boy_char/Ready Stance boy.png'
                   : 'assets/images/characters/girl_char/Ready Stance_girl.png',
        label:   ar ? 'وضعية الاستعداد' : 'Ready Stance',
        desc:    ar ? '🥋 قف بثبات، قدماك على بُعد الكتفين، يديك أمام الصدر للحماية.'
                    : '🥋 Stand firm, feet shoulder-width apart, hands up to guard your chest.'
      },
      step2: {
        image:   b ? 'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png'
                   : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
        label:   ar ? 'رفع الركبة' : 'Knee Lift',
        desc:    ar ? '⬆️ ارفع ركبة الرجل الضاربة بقوة حتى مستوى الصدر — هذا يولّد الطاقة للركلة.'
                    : '⬆️ Drive your kicking knee up powerfully to chest height — this generates kick power.'
      },
      step3: {
        image:   b ? 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png'
                   : 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
        label:   ar ? 'التمديد الكامل' : 'Full Extension',
        desc:    ar ? '💥 مد رجلك بالكامل للأمام واضرب بكرة القدم — الرجل مستقيمة تماماً!'
                    : '💥 Fully extend your leg forward and strike with the ball of the foot — leg fully straight!'
      },
      step4: {
        image:   b ? 'assets/images/characters/boy_char/Recoil (Pull Back) boy.png'
                   : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
        label:   ar ? 'سحب الرجل' : 'Leg Retract',
        desc:    ar ? '↩️ اسحب ركبتك للخلف بسرعة بعد الضربة مباشرة — يحمي من الإمساك بقدمك.'
                    : '↩️ Snap your knee back immediately after the strike — prevents leg grabs.'
      },
      step5: {
        image:   b ? 'assets/images/characters/boy_char/boy_idle.png'
                   : 'assets/images/characters/girl_char/girl_idle.png',
        label:   ar ? 'العودة للوضعية' : 'Return to Stance',
        desc:    ar ? '🔄 أعد قدمك للأرض بهدوء وعد فوراً لوضعية الاستعداد — جاهز للضربة القادمة!'
                    : '🔄 Step down smoothly and return to ready stance immediately — ready for the next move!'
      }
    };
  }

  static initialize(gameState) {
    this.gameState    = gameState;
    this.correctOrder = ['step1','step2','step3','step4','step5'];
    this.userOrder    = Array(5).fill(null);
    this.previewing   = false;
    this.initializePieces();
    this.shufflePieces();
    this.setupEventListeners();
    this.updateProgress();
    this.injectDescriptionBox();
  }

  static injectDescriptionBox() {
    const container = document.querySelector('.puzzle-container');
    if (!container || document.getElementById('step-description-box')) return;
    const ar = this.gameState.currentLanguage === 'ar';
    const box = document.createElement('div');
    box.id = 'step-description-box';
    box.className = 'step-description-box';
    box.innerHTML = `<p>${ar ? '💡 اسحب قطعة للفراغ لترى شرح المرحلة هنا!' : '💡 Drop a piece into a slot to see the phase explanation here!'}</p>`;
    container.insertAdjacentElement('afterend', box);
  }

  static showStepDescription(stepId) {
    const box = document.getElementById('step-description-box');
    if (!box) return;
    const ar   = this.gameState.currentLanguage === 'ar';
    const isBoy= this.gameState.playerCharacter === 'boy';
    const data = PuzzleSystem.STEP_DATA(isBoy, ar)[stepId];
    if (!data) return;
    box.innerHTML = `
      <div class="step-desc-inner">
        <div class="step-desc-img" style="background-image:url('${data.image.replace(/ /g,'%20')}')"></div>
        <div class="step-desc-text">
          <h4 style="color:var(--primary-color);margin-bottom:8px;">${data.label}</h4>
          <p style="margin:0;line-height:1.6;">${data.desc}</p>
        </div>
      </div>
    `;
    box.classList.add('visible');
  }

  static initializePieces() {
    for (let i = 1; i <= 5; i++) {
      const slot = document.getElementById(`slot-${i}`);
      if (slot) { slot.innerHTML = ''; slot.parentElement.classList.remove('filled','slot-correct','slot-wrong'); }
    }
    this.userOrder.fill(null);
    const box = document.getElementById('step-description-box');
    if (box) box.classList.remove('visible');
  }

  static shufflePieces() {
    this.shuffledPieces = [...this.correctOrder];
    for (let i = this.shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledPieces[i], this.shuffledPieces[j]] = [this.shuffledPieces[j], this.shuffledPieces[i]];
    }
    this.displayShuffledPieces();
  }

  static displayShuffledPieces() {
    const container = document.querySelector('.puzzle-pieces');
    if (!container) return;
    container.innerHTML = '';
    this.shuffledPieces.forEach(id => container.appendChild(this.createPiece(id)));
    this.setupDragListeners();
  }

  static createPiece(stepId) {
    const ar   = this.gameState.currentLanguage === 'ar';
    const isBoy= this.gameState.playerCharacter === 'boy';
    const data = PuzzleSystem.STEP_DATA(isBoy, ar)[stepId];
    const div  = document.createElement('div');
    div.className = 'puzzle-piece integrated-piece';
    div.dataset.piece = stepId;
    div.setAttribute('draggable','true');
    div.innerHTML = `
      <div class="piece-image-container">
        <div class="piece-image" style="background-image:url('${data.image.replace(/ /g,'%20')}')"></div>
      </div>
      <div class="piece-label">${data.label}</div>
    `;
    return div;
  }

  static setupDragListeners() {
    document.querySelectorAll('.puzzle-piece').forEach(p => {
      p.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', p.dataset.piece); p.classList.add('dragging'); });
      p.addEventListener('dragend',   () => p.classList.remove('dragging'));
    });
  }

  static setupEventListeners() {
    this.setupDragListeners();

    document.querySelectorAll('.puzzle-slot').forEach(slot => {
      slot.addEventListener('dragover',  (e) => { e.preventDefault(); slot.classList.add('drag-over'); });
      slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const pieceId = e.dataTransfer.getData('text/plain');
        this.placePiece(pieceId, parseInt(slot.dataset.step));
      });
    });

    const cloneBtn = (id, fn) => {
      const el = document.getElementById(id);
      if (!el) return;
      const clone = el.cloneNode(true);
      el.replaceWith(clone);
      clone.addEventListener('click', fn);
    };
    cloneBtn('reset-puzzle-btn',  () => this.resetPuzzle());
    cloneBtn('check-puzzle-btn',  () => this.checkPuzzle());
    cloneBtn('hint-puzzle-btn',   () => this.showHint());

    const controls = document.querySelector('#puzzle-screen .game-controls');
    if (controls && !document.getElementById('preview-puzzle-btn')) {
      const ar = this.gameState.currentLanguage === 'ar';
      const btn = document.createElement('button');
      btn.className = 'btn'; btn.id = 'preview-puzzle-btn';
      btn.innerHTML = `<i class="fas fa-play-circle"></i> ${ar ? 'معاينة الترتيب' : 'Preview Order'}`;
      btn.addEventListener('click', () => this.previewSequence());
      controls.appendChild(btn);
    }
  }

  static placePiece(pieceId, slotNumber) {
    const slot  = document.getElementById(`slot-${slotNumber}`);
    const piece = document.querySelector(`.puzzle-piece[data-piece="${pieceId}"]`);
    if (!slot || !piece) return;

    const ar   = this.gameState.currentLanguage === 'ar';
    const isBoy= this.gameState.playerCharacter === 'boy';
    const data = PuzzleSystem.STEP_DATA(isBoy, ar)[pieceId];

    slot.innerHTML = `
      <div class="piece-image-container" style="height:80px;">
        <div class="piece-image" style="background-image:url('${data.image.replace(/ /g,'%20')}')"></div>
      </div>
      <div class="piece-label">${data.label}</div>
    `;
    slot.parentElement.classList.add('filled');
    piece.remove();

    this.userOrder[slotNumber - 1] = pieceId;

    const isCorrect = pieceId === this.correctOrder[slotNumber - 1];
    if (isCorrect) {
      slot.parentElement.classList.add('slot-correct');
      slot.parentElement.style.animation = 'slotSnap 0.4s ease';
      this.gameState.playSound('success');
      setTimeout(() => { slot.parentElement.style.animation = ''; }, 400);
    } else {
      slot.parentElement.classList.add('slot-wrong');
      slot.parentElement.style.animation = 'slotShake 0.4s ease';
      this.gameState.playSound('error');
      setTimeout(() => { slot.parentElement.style.animation = ''; }, 400);
    }

    this.showStepDescription(pieceId);
    this.updateProgress();
  }

  static updateProgress() {
    const placed = this.userOrder.filter(p => p !== null).length;
    const bar    = document.getElementById('puzzle-progress');
    if (bar) bar.style.width = `${(placed / 5) * 100}%`;
  }

  static resetPuzzle() {
    this.initializePieces();
    this.shufflePieces();
    this.updateProgress();
    this.gameState.playSound('click');
  }

  static showHint() {
    this.gameState.playSound('click');
    const ar = this.gameState.currentLanguage === 'ar';
    this.gameState.showNotification(
      ar ? '💡 الترتيب: الاستعداد ← رفع الركبة ← التمديد ← السحب ← العودة'
         : '💡 Order: Ready Stance → Knee Lift → Extension → Recoil → Return',
      'info'
    );
  }

  static previewSequence() {
    if (this.previewing) return;
    this.previewing = true;
    const ar   = this.gameState.currentLanguage === 'ar';
    const isBoy= this.gameState.playerCharacter === 'boy';
    const steps = this.correctOrder;
    let i = 0;

    const highlight = () => {
      document.querySelectorAll('.puzzle-slot').forEach(s => s.classList.remove('preview-highlight'));
      if (i >= steps.length) { this.previewing = false; return; }

      const slot = document.querySelector(`.puzzle-slot[data-step="${i + 1}"]`);
      if (slot) {
        slot.classList.add('preview-highlight');
        this.showStepDescription(steps[i]);
      }
      i++;
      setTimeout(highlight, 1200);
    };

    this.gameState.showNotification(
      ar ? '▶️ معاينة الترتيب الصحيح...' : '▶️ Previewing correct order...', 'info'
    );
    highlight();
  }

  static checkPuzzle() {
    if (this.userOrder.some(p => p === null)) {
      this.gameState.playSound('error');
      this.gameState.showNotification(
        this.gameState.currentLanguage === 'ar' ? '⚠️ ضع جميع القطع أولاً' : '⚠️ Place all pieces first', 'error'
      );
      return;
    }
    let correct = 0;
    for (let i = 0; i < 5; i++) { if (this.userOrder[i] === this.correctOrder[i]) correct++; }
    const accuracy = (correct / 5) * 100;

    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      this.gameState.completeGame('puzzle');
      this.gameState.playSound('success');
      this.gameState.showNotification(
        this.gameState.currentLanguage === 'ar' ? `🎉 أحسنت! دقتك ${accuracy}%!` : `🎉 Well done! Accuracy: ${accuracy}%!`, 'success'
      );
      setTimeout(() => WinnerSystem.show('puzzle', accuracy, this.gameState), 1000);
    } else {
      this.gameState.playSound('error');
      if (this.gameState.trackFailure()) return;
      this.gameState.showNotification(
        this.gameState.currentLanguage === 'ar' ? `⚠️ ${correct}/5 صحيح. حاول مرة أخرى!` : `⚠️ ${correct}/5 correct. Try again!`, 'error'
      );
    }
  }
}

// =====================================================================
// GAME 3: PERFORMANCE SYSTEM
// =====================================================================
class PerformanceSystem {

  static getQuestionPool(isBoy, lang) {
    const b = isBoy;
    const ar = lang === 'ar';

    return [
      {
        question: ar ? 'أي صورة تُظهر مد الرجل الكامل في الآب تشاجي؟'
                     : 'Which image shows the FULL leg extension of Ap Chagi?',
        cards: [
          {
            correct: true,
            image: b ? 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png'
                     : 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
            label: ar ? 'الصورة أ' : 'Image A'
          },
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png'
                     : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
            label: ar ? 'الصورة ب' : 'Image B'
          },
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/Ready Stance boy.png'
                     : 'assets/images/characters/girl_char/Ready Stance_girl.png',
            label: ar ? 'الصورة ج' : 'Image C'
          }
        ],
        correctFeedback: ar ? 'صحيح! هذه هي لحظة التمديد الكامل للركلة.'
                            : 'Correct! This is the full kick extension moment.',
        wrongFeedback:   ar ? 'خطأ! هذه ليست مرحلة التمديد الكامل. ابحث عن الرجل الممدودة بالكامل للأمام.'
                            : 'Wrong! That is not full extension. Look for the leg fully stretched forward.'
      },
      {
        question: ar ? 'أي صورة تُظهر مرحلة رفع الركبة (الاستعداد للركل)؟'
                     : 'Which image shows the KNEE LIFT (chamber) phase?',
        cards: [
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png'
                     : 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
            label: ar ? 'الصورة أ' : 'Image A'
          },
          {
            correct: true,
            image: b ? 'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png'
                     : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
            label: ar ? 'الصورة ب' : 'Image B'
          },
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/boy_idle.png'
                     : 'assets/images/characters/girl_char/girl_idle.png',
            label: ar ? 'الصورة ج' : 'Image C'
          }
        ],
        correctFeedback: ar ? 'ممتاز! رفع الركبة هو الخطوة الثانية الأساسية قبل الركل.'
                            : 'Excellent! The knee lift is the critical second step before kicking.',
        wrongFeedback:   ar ? 'خطأ! ابحث عن الوضعية التي ترتفع فيها الركبة للأعلى.'
                            : 'Wrong! Look for the pose where the knee is raised upward.'
      },
      {
        question: ar ? 'أي صورة تُظهر وضعية الاستعداد (جونبي) الصحيحة؟'
                     : 'Which image shows the correct READY STANCE (Junbi)?',
        cards: [
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png'
                     : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
            label: ar ? 'الصورة أ' : 'Image A'
          },
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/Recoil (Pull Back) boy.png'
                     : 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
            label: ar ? 'الصورة ب' : 'Image B'
          },
          {
            correct: true,
            image: b ? 'assets/images/characters/boy_char/Ready Stance boy.png'
                     : 'assets/images/characters/girl_char/Ready Stance_girl.png',
            label: ar ? 'الصورة ج' : 'Image C'
          }
        ],
        correctFeedback: ar ? 'رائع! هذه هي وضعية الاستعداد الصحيحة للبدء.'
                            : 'Great! This is the correct starting ready stance.',
        wrongFeedback:   ar ? 'خطأ! وضعية الاستعداد هي الوضعية الأساسية قبل بدء الحركة.'
                            : 'Wrong! The ready stance is the base position before any movement.'
      },
      {
        question: ar ? 'أي صورة تُظهر مرحلة سحب الرجل بعد الركلة؟'
                     : 'Which image shows the RECOIL phase (pulling back after the kick)?',
        cards: [
          {
            correct: true,
            image: b ? 'assets/images/characters/boy_char/Recoil (Pull Back) boy.png'
                     : 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
            label: ar ? 'الصورة أ' : 'Image A'
          },
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png'
                     : 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
            label: ar ? 'الصورة ب' : 'Image B'
          },
          {
            correct: false,
            image: b ? 'assets/images/characters/boy_char/Ready Stance boy.png'
                     : 'assets/images/characters/girl_char/Ready Stance_girl.png',
            label: ar ? 'الصورة ج' : 'Image C'
          }
        ],
        correctFeedback: ar ? 'صحيح! السحب بعد الركلة مهم للحفاظ على التوازن.'
                            : 'Correct! Recoiling after the kick is essential for balance.',
        wrongFeedback:   ar ? 'خطأ! مرحلة السحب تأتي بعد الضربة مباشرة — الركبة تعود للخلف.'
                            : 'Wrong! The recoil comes right after the strike — the knee pulls back.'
      }
    ];
  }

  static initialize(gameState) {
    this.gameState    = gameState;
    this.totalRounds  = 3;
    this.currentRound = 0;
    this.correctCount = 0;
    this.streak       = 0;
    this.totalScore   = 0;
    this.usedIndices  = [];
    this.timerInterval= null;
    this.baseTime     = gameState.currentLanguage === 'ar' ? 18 : 15;
    this.timeLeft     = this.baseTime;
    this.answered     = false;
    this.injectScoreUI();
    this.loadNextRound();
  }

  static injectScoreUI() {
    const qSection = document.querySelector('.performance-question');
    if (!qSection || document.getElementById('perf-hud')) return;
    const ar = this.gameState.currentLanguage === 'ar';
    const hud = document.createElement('div');
    hud.id = 'perf-hud';
    hud.innerHTML = `
      <div class="perf-streak"   id="perf-streak"></div>
      <div class="perf-score-display" id="perf-score-display">
        ${ar ? 'النقاط:' : 'Score:'} <span id="perf-score-val">0</span>
      </div>
      <div class="perf-timer-text" id="perf-timer-text">⏱ 12</div>
      <div class="perf-timer-bar-wrap">
        <div class="perf-timer-bar-fill" id="perf-timer-fill"></div>
      </div>
    `;
    qSection.insertAdjacentElement('afterend', hud);
  }

  static startTimer() {
    this.stopTimer();
    this.timeLeft = this.baseTime;
    this.answered = false;
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerUI();
      if (this.timeLeft <= 0) {
        this.stopTimer();
        if (!this.answered) this.timeOut();
      }
    }, 1000);
  }

  static stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }

  static updateTimerUI() {
    const timerEl = document.getElementById('perf-timer-text');
    const fillEl  = document.getElementById('perf-timer-fill');
    if (timerEl) {
      timerEl.textContent = `⏱ ${this.timeLeft}`;
      timerEl.classList.toggle('urgent', this.timeLeft <= 4);
    }
    if (fillEl) fillEl.style.width = `${(this.timeLeft / this.baseTime) * 100}%`;
  }

  static timeOut() {
    const ar = this.gameState.currentLanguage === 'ar';
    this.answered = true;
    this.streak   = 0;
    this.updateStreakUI();
    this.gameState.playSound('error');
    this.gameState.showNotification(ar ? '⏰ انتهى الوقت!' : '⏰ Time\'s up!', 'warning');

    const correctCard = document.querySelector('.performance-card[data-correct="true"]');
    if (correctCard) correctCard.classList.add('selected');

    setTimeout(() => {
      this.currentRound++;
      if (this.currentRound < this.totalRounds) this.loadNextRound();
      else this.finishGame();
    }, 2000);
  }

  static updateStreakUI() {
    const el = document.getElementById('perf-streak');
    if (!el) return;
    if (this.streak >= 3)      el.textContent = `🔥🔥🔥 ${this.streak}x Streak!`;
    else if (this.streak === 2) el.textContent = `🔥🔥 ${this.streak}x Streak!`;
    else if (this.streak === 1) el.textContent = `🔥 Good!`;
    else                        el.textContent = '';
  }

  static updateScoreUI() {
    const el = document.getElementById('perf-score-val');
    if (el) el.textContent = this.totalScore;
  }

  static showZoomOverlay(wrongImage, correctImage) {
    const ar = this.gameState.currentLanguage === 'ar';
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.id = 'zoom-overlay';
    overlay.innerHTML = `
      <p class="zoom-overlay-msg" style="color:var(--danger-color);font-size:1.3rem;font-weight:bold;">
        ${ar ? '❌ هذه هي الإجابة الخاطئة' : '❌ This was your wrong choice'}
      </p>
      <div class="zoom-overlay-img" style="background-image:url('${wrongImage.replace(/ /g,'%20')}')"></div>
      <p class="zoom-overlay-msg">
        ${ar ? '✅ الإجابة الصحيحة هي:' : '✅ The correct answer is:'}
      </p>
      <div class="zoom-overlay-correct-img" style="background-image:url('${correctImage.replace(/ /g,'%20')}')"></div>
      <p class="zoom-overlay-msg" style="color:var(--text-gray);font-size:0.95rem;">
        ${this.currentQuestion.wrongFeedback}
      </p>
      <button class="btn btn-success" id="zoom-close-btn" style="margin-top:10px;">
        ${ar ? 'فهمت ✓' : 'Got it ✓'}
      </button>
    `;
    document.body.appendChild(overlay);
    document.getElementById('zoom-close-btn')?.addEventListener('click', () => {
      overlay.remove();
      this.currentRound++;
      if (this.currentRound < this.totalRounds) this.loadNextRound();
      else this.finishGame();
    });
  }

  static loadNextRound() {
    const isBoy = this.gameState.playerCharacter === 'boy';
    const lang  = this.gameState.currentLanguage;
    const pool  = PerformanceSystem.getQuestionPool(isBoy, lang);

    const available = pool.map((_, i) => i).filter(i => !this.usedIndices.includes(i));
    const idx = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : Math.floor(Math.random() * pool.length);
    this.usedIndices.push(idx);
    this.currentQuestion = pool[idx];
    this.currentQuestion.shuffledCards = this.shuffleArray([...this.currentQuestion.cards]);

    this.renderRound();
    this.startTimer();
  }

  static renderRound() {
    const lang = this.gameState.currentLanguage;
    const ar   = lang === 'ar';

    const qEl = document.querySelector('.performance-question h3');
    if (qEl) qEl.textContent = this.currentQuestion.question;

    let counterEl = document.getElementById('perf-round-counter');
    if (!counterEl) {
      const qSection = document.querySelector('.performance-question');
      if (qSection) {
        counterEl = document.createElement('p');
        counterEl.id = 'perf-round-counter';
        counterEl.style.cssText = 'color:var(--warning-color);font-weight:bold;margin-top:8px;font-size:1rem;';
        qSection.appendChild(counterEl);
      }
    }
    if (counterEl) {
      counterEl.textContent = ar
        ? `السؤال ${this.currentRound + 1} من ${this.totalRounds}`
        : `Question ${this.currentRound + 1} of ${this.totalRounds}`;
    }

    const feedback = document.getElementById('performance-feedback');
    if (feedback) feedback.classList.add('hidden');

    const cardsContainer = document.querySelector('.performance-cards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = this.currentQuestion.shuffledCards.map((card, i) => `
      <div class="performance-card" data-correct="${card.correct}" data-card="${i}">
        <div class="card-visual">
          <div class="character-performance" style="
            background-image: url('${card.image.replace(/ /g, '%20')}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            width: 100%; height: 100%;
          "></div>
        </div>
        <div class="card-content">
          <h4 style="margin:10px 0 0;">${card.label}</h4>
        </div>
        <button class="btn select-card-btn" data-card="${i}">
          ${ar ? 'اختر' : 'Select'}
        </button>
      </div>
    `).join('');

    this.selectedAnswer = null;
    this.setupEventListeners();
  }

  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static setupEventListeners() {
    document.querySelectorAll('.performance-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-card-btn')) return;
        this.selectCard(card);
      });
    });
    document.querySelectorAll('.select-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectCard(btn.closest('.performance-card'));
      });
    });
  }

  static selectCard(card) {
    if (this.answered || this.selectedAnswer !== null) return;

    this.stopTimer();
    this.answered = true;

    const isCorrect = card.dataset.correct === 'true';
    this.selectedAnswer = isCorrect ? 'correct' : 'incorrect';

    document.querySelectorAll('.performance-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    this.gameState.playSound(isCorrect ? 'success' : 'error');

    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      const timeBonus  = Math.max(0, this.timeLeft) * 5;
      const streakBonus= (this.streak >= 3) ? 30 : (this.streak === 2) ? 15 : 0;
      this.totalScore += 100 + timeBonus + streakBonus;
      this.updateStreakUI();
      this.updateScoreUI();
      this.showFeedback(true);

      setTimeout(() => {
        this.currentRound++;
        if (this.currentRound < this.totalRounds) this.loadNextRound();
        else this.finishGame();
      }, 1800);
    } else {
      this.streak = 0;
      this.updateStreakUI();
      this.showFeedback(false);

      const correctCard = document.querySelector('.performance-card[data-correct="true"]');
      if (correctCard) correctCard.classList.add('selected');

      const wrongImage   = card.querySelector('.character-performance')?.style.backgroundImage
                           .replace(/url\(['"]?|['"]?\)/g, '') || '';
      const correctImage = correctCard?.querySelector('.character-performance')?.style.backgroundImage
                           .replace(/url\(['"]?|['"]?\)/g, '') || '';

      setTimeout(() => this.showZoomOverlay(wrongImage, correctImage), 1200);
    }
  }

  static showFeedback(isCorrect) {
    const feedback  = document.getElementById('performance-feedback');
    const title     = document.getElementById('feedback-title');
    const message   = document.getElementById('feedback-message');
    if (!feedback || !title || !message) return;

    feedback.classList.remove('hidden');
    if (isCorrect) {
      title.textContent  = this.currentQuestion.correctFeedback.split('!')[0] + '!';
      title.style.color  = 'var(--success-color)';
      message.textContent = this.currentQuestion.correctFeedback;
    } else {
      title.textContent  = this.gameState.currentLanguage === 'ar' ? '❌ غير صحيح' : '❌ Incorrect';
      title.style.color  = 'var(--danger-color)';
      message.textContent = this.currentQuestion.wrongFeedback;
    }
  }

  static finishGame() {
    this.stopTimer();
    const ar       = this.gameState.currentLanguage === 'ar';
    const accuracy = Math.round((this.correctCount / this.totalRounds) * 100);

    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      this.gameState.completeGame('performance');
      this.gameState.playSound('win');
      WinnerSystem.show('performance', accuracy, this.gameState);
    } else {
      this.gameState.playSound('error');
      const msg = ar
        ? `⚠️ أجبت صح على ${this.correctCount} من ${this.totalRounds} (${accuracy}%). حاول مرة أخرى!`
        : `⚠️ ${this.correctCount}/${this.totalRounds} correct (${accuracy}%). Try again!`;
      this.gameState.showNotification(msg, 'error');
      this.gameState.trackFailure();
      setTimeout(() => this.initialize(this.gameState), 2000);
    }
  }
}

// =====================================================================
// GAME 4: QUIZ SYSTEM
// =====================================================================
class QuizSystem {

  static QUESTION_POOL = [
    {
      question: 'What is the Korean name for front kick?',
      questionAr: 'ما هو الاسم الكوري للركلة الأمامية؟',
      options: ['Ap Chagi', 'Dolyo Chagi', 'Yeop Chagi', 'Dwi Chagi'],
      optionsAr: ['آب تشاجي', 'دوليو تشاجي', 'يوب تشاجي', 'دوي تشاجي'],
      correctText: 'Ap Chagi',
      image: 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png',
      explanation: 'Ap Chagi (앞차기) literally means "front kick" in Korean.',
      explanationAr: 'آب تشاجي تعني "الركلة الأمامية" باللغة الكورية.'
    },
    {
      question: 'Which part of the foot makes contact in Ap Chagi?',
      questionAr: 'أي جزء من القدم يُستخدم في الآب تشاجي؟',
      options: ['Toes', 'Heel', 'Ball of foot', 'Side of foot'],
      optionsAr: ['أصابع القدم', 'الكعب', 'كرة القدم (الجزء الأمامي)', 'جانب القدم'],
      correctText: 'Ball of foot',
      image: 'assets/images/characters/girl_char/Kick Extension (Strike Moment)_girl.png',
      explanation: 'The ball of the foot is the striking surface for Ap Chagi.',
      explanationAr: 'الجزء الأمامي من باطن القدم هو نقطة الاتصال في الآب تشاجي.'
    },
    {
      question: 'What is the FIRST phase of Ap Chagi?',
      questionAr: 'ما هي المرحلة الأولى من الآب تشاجي؟',
      options: ['Kick extension', 'Knee lift', 'Ready stance', 'Recoil'],
      optionsAr: ['مد الرجل', 'رفع الركبة', 'وضعية الاستعداد', 'السحب'],
      correctText: 'Ready stance',
      image: 'assets/images/characters/girl_char/Ready Stance_girl.png',
      explanation: 'The ready stance (Junbi) is always the first step.',
      explanationAr: 'وضعية الاستعداد (جونبي) هي دائماً الخطوة الأولى.'
    },
    {
      question: 'How many main phases does a complete Ap Chagi have?',
      questionAr: 'كم عدد المراحل الرئيسية في الآب تشاجي الكاملة؟',
      options: ['3', '4', '5', '6'],
      optionsAr: ['3', '4', '5', '6'],
      correctText: '5',
      image: 'assets/images/characters/boy_char/Knee Lift (Chamber Position) boy.png',
      explanation: 'Ap Chagi has 5 phases: Ready Stance → Knee Lift → Extension → Recoil → Return.',
      explanationAr: 'الآب تشاجي لها 5 مراحل: الاستعداد ← رفع الركبة ← التمديد ← السحب ← العودة.'
    },
    {
      question: 'What does "Junbi" mean in Taekwondo?',
      questionAr: 'ماذا تعني كلمة "جونبي" في التايكوندو؟',
      options: ['Attack', 'Ready', 'Stop', 'Kick'],
      optionsAr: ['هجوم', 'استعداد', 'توقف', 'ركلة'],
      correctText: 'Ready',
      image: 'assets/images/characters/boy_char/Ready Stance boy.png',
      explanation: 'Junbi (준비) means "ready" — the preparation position.',
      explanationAr: 'جونبي تعني "استعداد" — وضعية التحضير.'
    },
    {
      question: 'What phase comes AFTER the knee lift in Ap Chagi?',
      questionAr: 'ما هي المرحلة التي تأتي بعد رفع الركبة في الآب تشاجي؟',
      options: ['Return to stance', 'Ready stance', 'Kick extension', 'Recoil'],
      optionsAr: ['العودة للوضعية', 'الاستعداد', 'مد الرجل', 'السحب'],
      correctText: 'Kick extension',
      image: 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png',
      explanation: 'After the knee lift (chamber), you extend the leg forward to strike.',
      explanationAr: 'بعد رفع الركبة تمد الرجل للأمام للضرب.'
    },
    {
      question: 'Why is the recoil phase important in Ap Chagi?',
      questionAr: 'لماذا مرحلة السحب مهمة في الآب تشاجي؟',
      options: ['To score more points', 'To maintain balance and guard', 'To kick faster', 'To look better'],
      optionsAr: ['لتسجيل نقاط أكثر', 'للحفاظ على التوازن والحراسة', 'للركل بشكل أسرع', 'لمظهر أفضل'],
      correctText: 'To maintain balance and guard',
      image: 'assets/images/characters/boy_char/Recoil (Pull Back) boy.png',
      explanation: 'Pulling the leg back quickly restores balance and protects against counter-attacks.',
      explanationAr: 'سحب الرجل للخلف بسرعة يعيد التوازن ويحمي من الهجمات المضادة.'
    },
    {
      question: 'Which belt colour is typically worn by beginners in Taekwondo?',
      questionAr: 'ما لون الحزام الذي يرتديه المبتدئون في التايكوندو؟',
      options: ['Black', 'Red', 'Blue', 'White'],
      optionsAr: ['أسود', 'أحمر', 'أزرق', 'أبيض'],
      correctText: 'White',
      image: 'assets/images/characters/girl_char/girl_idle.png',
      explanation: 'White belt represents the beginning of the Taekwondo journey.',
      explanationAr: 'الحزام الأبيض يمثل بداية رحلة التايكوندو.'
    },
    {
      question: 'What is the correct HEIGHT for the knee during the chamber phase?',
      questionAr: 'ما هو الارتفاع الصحيح للركبة أثناء مرحلة رفعها؟',
      options: ['Hip height', 'Chest height', 'Head height', 'Knee height'],
      optionsAr: ['مستوى الورك', 'مستوى الصدر', 'مستوى الرأس', 'مستوى الركبة'],
      correctText: 'Chest height',
      image: 'assets/images/characters/girl_char/Knee Lift (Chamber Position)_girl.png',
      explanation: 'The knee should lift to chest height to generate maximum kick power.',
      explanationAr: 'يجب أن ترتفع الركبة لمستوى الصدر لتوليد أقصى قوة للركلة.'
    },
    {
      question: 'What does "Chagi" mean in Korean?',
      questionAr: 'ماذا تعني كلمة "تشاجي" بالكورية؟',
      options: ['Block', 'Punch', 'Kick', 'Stance'],
      optionsAr: ['حجب', 'لكمة', 'ركلة', 'وضعية'],
      correctText: 'Kick',
      image: 'assets/images/characters/boy_char/Kick Extension (Strike Moment) boy (2).png',
      explanation: 'Chagi (차기) means "kick" in Korean — used in all kick names.',
      explanationAr: 'تشاجي تعني "ركلة" بالكورية وتُستخدم في أسماء جميع الركلات.'
    }
  ];

  static initialize(gameState) {
    this.gameState           = gameState;
    this.score               = 0;
    this.currentQuestionIndex = 0;
    this.selectedAnswer      = null;

    // Use ALL 10 questions in shuffled order for full coverage
    this.sessionQuestions = this.shuffleArray([...QuizSystem.QUESTION_POOL]);

    const totalEl = document.getElementById('total-questions');
    if (totalEl) totalEl.textContent = this.sessionQuestions.length;

    this.loadQuestion(0);
    this.setupEventListeners();
  }

  static shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  static loadQuestion(index) {
    if (index >= this.sessionQuestions.length) { this.completeQuiz(); return; }

    const ar  = this.gameState.currentLanguage === 'ar';
    const q   = this.sessionQuestions[index];

    const questionText = document.getElementById('question-text');
    if (questionText) questionText.textContent = ar ? q.questionAr : q.question;

    const questionImage = document.getElementById('question-image');
    if (questionImage && q.image)
      questionImage.style.backgroundImage = `url('${q.image.replace(/ /g, '%20')}')`;

    const optionPairs = q.options.map((opt, i) => ({ en: opt, ar: q.optionsAr[i] }));
    this.shuffledOptions = this.shuffleArray([...optionPairs]);

    this.shuffledOptions.forEach((opt, i) => {
      const textEl = document.getElementById(`option${i + 1}-text`);
      if (textEl) textEl.textContent = ar ? opt.ar : opt.en;
    });

    this.selectedAnswer = null;
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.classList.remove('selected', 'correct', 'incorrect');
      btn.disabled = false;
    });

    const feedback = document.getElementById('quiz-feedback');
    if (feedback) feedback.classList.add('hidden');

    this.updateProgress(index);
  }

  static setupEventListeners() {
    if (this._quizAbort) this._quizAbort.abort();
    this._quizAbort = new AbortController();
    const { signal } = this._quizAbort;
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('click', (event) => {
        if (this.selectedAnswer !== null) return;
        this.selectAnswer(parseInt(event.currentTarget.dataset.answer));
      }, { signal });
    });

    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) {
      const clone = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(clone, nextBtn);
      clone.addEventListener('click', () => this.nextQuestion());
    }
  }

  static selectAnswer(answerIndex) {
    this.selectedAnswer  = answerIndex;
    const ar             = this.gameState.currentLanguage === 'ar';
    const q              = this.sessionQuestions[this.currentQuestionIndex];

    const chosenOption   = this.shuffledOptions[answerIndex - 1];
    const isCorrect      = chosenOption && chosenOption.en === q.correctText;

    const selectedBtn = document.querySelector(`.quiz-option[data-answer="${answerIndex}"]`);
    if (selectedBtn) selectedBtn.classList.add('selected');

    this.shuffledOptions.forEach((opt, i) => {
      if (opt.en === q.correctText) {
        const btn = document.querySelector(`.quiz-option[data-answer="${i + 1}"]`);
        if (btn) btn.classList.add('correct');
      }
    });
    if (!isCorrect && selectedBtn) selectedBtn.classList.add('incorrect');

    document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

    this.showFeedback(isCorrect, ar ? q.explanationAr : q.explanation,
                                 ar ? q.optionsAr[q.options.indexOf(q.correctText)] : q.correctText);
    this.gameState.playSound(isCorrect ? 'success' : 'error');

    if (isCorrect) this.score += 20;
    this.updateScoreDisplay();

    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) nextBtn.disabled = false;
  }

  static showFeedback(isCorrect, explanation, correctAnswerText) {
    const ar       = this.gameState.currentLanguage === 'ar';
    const feedback = document.getElementById('quiz-feedback');
    const title    = document.getElementById('quiz-result-title');
    const expEl    = document.getElementById('quiz-explanation');
    if (!feedback || !title || !expEl) return;

    feedback.classList.remove('hidden');
    if (isCorrect) {
      title.textContent = ar ? '🎉 إجابة صحيحة!' : '🎉 Correct!';
      title.style.color = 'var(--success-color)';
    } else {
      title.textContent = ar
        ? `❌ خطأ — الإجابة الصحيحة: "${correctAnswerText}"`
        : `❌ Wrong — Correct answer: "${correctAnswerText}"`;
      title.style.color = 'var(--danger-color)';
    }
    expEl.textContent = explanation;
  }

  static updateProgress(index) {
    const currentEl = document.getElementById('current-question');
    const totalEl   = document.getElementById('total-questions');
    if (currentEl) currentEl.textContent = (index ?? this.currentQuestionIndex) + 1;
    if (totalEl)   totalEl.textContent   = this.sessionQuestions.length;
    const nextBtn = document.getElementById('next-question-btn');
    if (nextBtn) nextBtn.disabled = true;
  }

  static updateScoreDisplay() {
    const scoreEl = document.getElementById('quiz-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }

  static nextQuestion() {
    this.currentQuestionIndex++;
    this.loadQuestion(this.currentQuestionIndex);
    this.gameState.playSound('click');
  }

  static completeQuiz() {
    const ar       = this.gameState.currentLanguage === 'ar';
    const maxScore = this.sessionQuestions.length * 20;
    const accuracy = Math.round((this.score / maxScore) * 100);

    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      this.gameState.completeGame('quiz');
      this.gameState.playSound('win');
      const msg = ar
        ? `🎉 اختبار مكتمل! نقاطك ${this.score}/${maxScore} (${accuracy}%)`
        : `🎉 Quiz complete! Score: ${this.score}/${maxScore} (${accuracy}%)`;
      this.gameState.showNotification(msg, 'success');
      setTimeout(() => WinnerSystem.show('quiz', accuracy, this.gameState), 1000);
    } else {
      this.gameState.playSound('error');
      if (this.gameState.trackFailure()) return;
      const msg = ar
        ? `⚠️ تحتاج مراجعة أكثر! نقاطك ${this.score}/${maxScore} (${accuracy}%)`
        : `⚠️ Needs more study! Score: ${this.score}/${maxScore} (${accuracy}%)`;
      this.gameState.showNotification(msg, 'error');
      setTimeout(() => this.initialize(this.gameState), 2000);
    }
  }
}

// =====================================================================
// REWARDS & WINNER SYSTEM
// =====================================================================
class WinnerSystem {
  static show(gameType, accuracy, gameState) {
    this.gameState  = gameState;
    this.lastGame   = gameType; // store the game ID directly, not currentScreen
    this.lastGameScreen = gameState.currentScreen; // keep original screen too
    const accuracyEl = document.getElementById('winner-accuracy');
    if (accuracyEl) accuracyEl.textContent = `${Math.round(accuracy)}%`;
    
    const messages = {
      en: {
        'form-control': 'Excellent! You mastered the Ap Chagi stance control!',
        'puzzle': 'Great! You understood the complete Ap Chagi movement sequence!',
        'performance': 'Superb! You correctly identified the perfect form!',
        'quiz': 'Bravo! Your Taekwondo knowledge is impressive!',
        'learning': 'Congratulations! You completed your learning successfully!'
      },
      ar: {
        'form-control': 'ممتاز! لقد أتقنت التحكم في وضعية الآب تشاجي!',
        'puzzle': 'رائع! لقد فهمت تسلسل حركة الآب تشاجي الكامل!',
        'performance': 'مذهل! لقد حددت الشكل المثالي بشكل صحيح!',
        'quiz': 'برافو! معرفتك بالتايكوندو مثيرة للإعجاب!',
        'learning': 'مبروك! لقد أتممت تعلمك بنجاح!'
      }
    };
    
    const messageElement = document.getElementById('winner-message');
    if (messageElement) {
      const langMessages = messages[gameState.currentLanguage];
      messageElement.textContent = langMessages[gameType] || langMessages.learning;
    }
    
    gameState.createCharacterVisual('winner-character', gameState.playerCharacter, 'WIN');
    ScreenManagerInstance.switchScreen('winner');
    this.setupEventListeners();
  }

  static initialize(gameState) {
    this.gameState = gameState;
    this.setupEventListeners();
  }

  static setupEventListeners() {
    const cloneAndBind = (id, fn) => {
      const el = document.getElementById(id);
      if (!el) return;
      const clone = el.cloneNode(true);
      el.replaceWith(clone);
      clone.addEventListener('click', fn);
    };
    cloneAndBind('next-level-btn',   () => this.goApchagiMenu());
    cloneAndBind('back-to-home-btn', () => this.goHome());
    cloneAndBind('try-again-btn',    () => this.tryAgain());
  }

  static tryAgain() {
    const last = this.lastGame;
    // lastGame is now the gameType (form-control, puzzle, performance, quiz, learning)
    const validScreens = ['form-control', 'puzzle', 'performance', 'quiz', 'learning'];
    if (last && validScreens.includes(last)) ScreenManagerInstance.switchScreen(last);
    else this.goApchagiMenu();
    this.gameState.playSound('click');
  }

  static goHome() {
    ScreenManagerInstance.switchScreen('home');
    this.gameState.playSound('click');
  }

  static goApchagiMenu() {
    ScreenManagerInstance.switchScreen('apchagi-menu');
    this.gameState.playSound('click');
  }
}

// =====================================================================
// AP CHAGI MENU SYSTEM — intermediate hub screen
// =====================================================================
class ApChagiMenuSystem {
  static initialize(gameState) {
    this.gameState = gameState;

    // Character visual
    gameState.createCharacterVisual('apchagi-menu-character', gameState.playerCharacter, 'IDLE');

    // Progress bars
    const learnBar   = document.getElementById('apchagi-learn-progress');
    const gamesBar   = document.getElementById('apchagi-games-progress');
    const warmupBar  = document.getElementById('apchagi-warmup-progress');
    const quizBar    = document.getElementById('apchagi-quiz-progress');

    if (learnBar)  learnBar.style.width  = `${gameState.learningProgress}%`;

    // Games average
    const gamesAvg = Math.round(
      (gameState.formControlProgress + gameState.puzzleProgress + gameState.performanceProgress) / 3
    );
    if (gamesBar) gamesBar.style.width = `${gamesAvg}%`;

    // Warmup — mark full if completedGames has it, otherwise 0
    if (warmupBar) warmupBar.style.width = '0%';

    if (quizBar) quizBar.style.width = `${gameState.quizProgress}%`;

    // Update card visual states
    ApChagiMenuSystem.updateCardStates(gameState);
  }

  static updateCardStates(gameState) {
    const cards = document.querySelectorAll('.apchagi-menu-card');
    cards.forEach((card, i) => {
      card.classList.remove('amenu-done');
      // Learning card
      if (i === 0 && gameState.learningProgress >= 85) card.classList.add('amenu-done');
      // Games card
      const gDone = gameState.completedGames.has('form-control') &&
                    gameState.completedGames.has('puzzle') &&
                    gameState.completedGames.has('performance');
      if (i === 1 && gDone) card.classList.add('amenu-done');
      // Quiz card
      if (i === 3 && gameState.quizProgress >= 85) card.classList.add('amenu-done');
    });
  }
}

// =====================================================================
// WARM UP SYSTEM — 6 exercises with circular countdown timer
// =====================================================================
class WarmupSystem {

  static EXERCISES(isBoy, ar) {
    return [
      {
        id: 'heel_glute',
        icon: '🙇',
        nameEn: 'Heel to Glute',            nameAr: 'لمس الكاحل بالجسم',
        descEn: 'Bend forward slowly and try to touch your ankles or feet with both hands.',
        descAr: 'انحنِ للأمام ببطء وحاول لمس كاحليك أو قدميك بكلتا يديك.',
        tipEn:  'Keep knees slightly bent and breathe out as you reach down.',
        tipAr:  'أبقِ ركبتيك مثنيتين قليلاً وازفر وأنت تنحني للأسفل.',
        duration: 20, color: '#2a9d8f'
      },
      {
        id: 'hip_twist',
        icon: '🌀',
        nameEn: 'Standing Hip Twist',        nameAr: 'تدوير الحوض واقفاً',
        descEn: 'Stand straight and twist your torso and hips left then right — feet stay still.',
        descAr: 'قف مستقيماً ودوّر جذعك ووركيك يساراً ثم يميناً — قدماك ثابتتان.',
        tipEn:  'Rotate from the waist, not just the shoulders.',
        tipAr:  'الدوران يبدأ من الخصر وليس من الكتفين فقط.',
        duration: 20, color: '#e76f51'
      },
      {
        id: 'split_right',
        icon: '🤸',
        nameEn: 'Split Stretch — Right',     nameAr: 'إطالة جانبية — اليمين',
        descEn: 'Open feet wide, lean body to the RIGHT and reach both arms toward your right foot.',
        descAr: 'افتح قدميك بشكل واسع، أمل جسمك لليمين والمس قدمك اليمنى بكلتا يديك.',
        tipEn:  'Keep the right leg straight and feel the inner thigh stretch.',
        tipAr:  'أبقِ الرجل اليمنى مستقيمة وأحس بالإطالة في الفخذ الداخلي.',
        duration: 20, color: '#ff6b35'
      },
      {
        id: 'side_press',
        icon: '🦵',
        nameEn: 'Side Press (Lunge)',         nameAr: 'الطعن الجانبي',
        descEn: 'Step wide to the side, bend one knee and press down — keep the other leg straight.',
        descAr: 'افتح قدمك جانباً، انحنِ على ركبة واحدة واضغط للأسفل — الرجل الأخرى مستقيمة.',
        tipEn:  'Keep your chest up and hips square to the front.',
        tipAr:  'أبقِ صدرك مرتفعاً ووركيك مواجهين للأمام.',
        duration: 20, color: '#e9c46a'
      },
      {
        id: 'forward_lunge',
        icon: '🏃',
        nameEn: 'Forward Lunges',             nameAr: 'الطعن الأمامي',
        descEn: 'Step one foot far forward, bend both knees to 90° then return and alternate legs.',
        descAr: 'خطِ بقدم واحدة للأمام بشكل واسع، انحنِ بركبتيك لـ90° ثم أعد وبدّل الرجلين.',
        tipEn:  'Keep front knee above the ankle — not past the toes.',
        tipAr:  'الركبة الأمامية تكون فوق الكاحل — لا تتجاوز أصابع القدم.',
        duration: 20, color: '#2a9d8f'
      },
      {
        id: 'hamstring_left',
        icon: '🧘',
        nameEn: 'Hamstring Stretch — Left',   nameAr: 'إطالة الفخذ — اليسار',
        descEn: 'Sit, extend your LEFT leg forward fully, lean and reach for your left toes.',
        descAr: 'اجلس، مد رجلك اليسرى للأمام بالكامل، أمل جسمك والمس أصابع قدمك اليسرى.',
        tipEn:  'Keep your back straight and feel the stretch behind the thigh.',
        tipAr:  'أبقِ ظهرك مستقيماً وأحس بالإطالة خلف الفخذ.',
        duration: 20, color: '#e76f51'
      },
      {
        id: 'hamstring_right',
        icon: '🧘',
        nameEn: 'Hamstring Stretch — Right',  nameAr: 'إطالة الفخذ — اليمين',
        descEn: 'Sit, extend your RIGHT leg forward fully, lean and reach for your right toes.',
        descAr: 'اجلس، مد رجلك اليمنى للأمام بالكامل، أمل جسمك والمس أصابع قدمك اليمنى.',
        tipEn:  'Breathe in then exhale as you reach forward — go deeper each breath.',
        tipAr:  'خذ نفساً ثم ازفر وأنت تمد للأمام — اذهب أعمق مع كل زفير.',
        duration: 20, color: '#ff6b35'
      }
    ];
  }

  static CIRCUMFERENCE = 2 * Math.PI * 52;

  static initialize(gameState) {
    this.gameState       = gameState;
    this.currentIdx      = 0;
    this.timeLeft        = 0;
    this.isPaused        = false;
    this.timerInterval   = null;
    this._restInterval   = null;
    this._pendingNextIdx = null;
    const ar   = gameState.currentLanguage === 'ar';
    const isBoy= gameState.playerCharacter === 'boy';
    this.exercises = WarmupSystem.EXERCISES(isBoy, ar);

    // Reset delegation flag so controls re-attach cleanly
    const screen = document.getElementById('warmup-screen');
    if (screen) screen._wuDelegated = false;

    this.localise(ar);
    this.buildDots();

    document.getElementById('warmup-complete').style.display = 'none';
    document.getElementById('warmup-card').style.display     = '';

    this.loadExercise(0);
    this.setupControls();
  }

  static localise(ar) {
    this.setText('warmup-title',    ar ? '🔥 وقت الإحماء!' : '🔥 Warm Up Time!');
    this.setText('warmup-subtitle', ar ? 'جهّز جسمك قبل التدريب' : 'Get your body ready before training');
    this.setText('warmup-pause-label', ar ? 'إيقاف' : 'Pause');
    this.setText('warmup-next-label',  ar ? 'التالي' : 'Skip');
    this.setText('warmup-exit-label',  ar ? 'خروج'  : 'Exit');
    this.setText('warmup-timer-label', ar ? 'ثانية'  : 'sec');
    this.setText('warmup-go-learn',  ar ? 'ابدأ التعلم 🎓' : 'Start Learning 🎓');
    this.setText('warmup-go-repeat', ar ? 'أعد الإحماء 🔁' : 'Repeat Warm Up 🔁');
    this.setText('warmup-go-home',   ar ? 'الرئيسية 🏠'   : 'Home 🏠');
  }

  static setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  static SVG(exerciseId, color) {
    const c = color;

    const DEFS = `<defs>
      <radialGradient id="skinG" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#FFE0B2"/><stop offset="100%" stop-color="#FFAB76"/>
      </radialGradient>
      <linearGradient id="giG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EEF4FF"/><stop offset="100%" stop-color="#C8D8F0"/>
      </linearGradient>
      <linearGradient id="beltG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#111122"/><stop offset="50%" stop-color="#1a1a3e"/><stop offset="100%" stop-color="#111122"/>
      </linearGradient>
      <filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/></filter>
    </defs>`;

    const lc = `stroke-linecap="round" stroke-linejoin="round"`;
    const skin  = (x1,y1,x2,y2,w=8) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#skinG)" stroke-width="${w}" ${lc}/>`;
    const gi    = (x1,y1,x2,y2,w)   => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#giG)"   stroke-width="${w}" ${lc}/>`;
    const gi2   = (x1,y1,x2,y2,w)   => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#C8D8F0"    stroke-width="${w}" ${lc}/>`;
    const dot   = (cx,cy,r=5)        => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#skinG)"/>`;
    const floor = (cx,y=200)         => `<ellipse cx="${cx}" cy="${y}" rx="30" ry="6" fill="rgba(0,0,0,0.2)"/>
      <line x1="${cx-45}" y1="${y}" x2="${cx+45}" y2="${y}" stroke="rgba(255,255,255,0.1)" stroke-width="2" ${lc}/>`;

    const head = (cx,cy,r=15) => `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#skinG)" stroke="rgba(0,0,0,0.12)" stroke-width="1.5" filter="url(#sh)"/>
      <path d="M${cx-r+3},${cy-r/2} Q${cx},${cy-r-6} ${cx+r-3},${cy-r/2}" fill="#2C1810"/>
      <circle cx="${cx-4.5}" cy="${cy-2}" r="2" fill="#1a1a2e"/>
      <circle cx="${cx+4.5}" cy="${cy-2}" r="2" fill="#1a1a2e"/>
      <circle cx="${cx-4}" cy="${cy-2.5}" r="0.7" fill="white"/>
      <circle cx="${cx+5}" cy="${cy-2.5}" r="0.7" fill="white"/>
      <path d="M${cx-3.5},${cy+4} Q${cx},${cy+8} ${cx+3.5},${cy+4}" stroke="#C87" stroke-width="1.5" fill="none" ${lc}/>`;

    const torso = (sx,sy,hx,hy,w=20) => `
      ${gi(sx,sy,hx,hy,w)}
      <rect x="${hx-10}" y="${hy-6}" width="20" height="7" rx="2" fill="url(#beltG)" opacity="0.9"/>
      ${gi(sx,sy+2,hx-2,hy-7,1.5)}${gi(sx,sy+2,hx+2,hy-7,1.5)}`;

    const svgs = {
      heel_glute: `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .hg-upper { transform-origin:100px 118px; animation:hgU 2.2s ease-in-out infinite; }
          .hg-la    { transform-origin:100px 118px; animation:hgA 2.2s ease-in-out infinite; }
          .hg-ra    { transform-origin:100px 118px; animation:hgA 2.2s ease-in-out infinite; }
          @keyframes hgU { 0%,100%{ transform:rotate(0deg); } 50%{ transform:rotate(78deg); } }
          @keyframes hgA { 0%,100%{ transform:rotate(0deg); } 50%{ transform:rotate(90deg); } }
        </style>
        ${floor(100)}
        ${gi(89,118,78,168,13)}${gi2(78,168,74,200,11)}${dot(74,204,7)}
        ${gi(111,118,122,168,13)}${gi2(122,168,126,200,11)}${dot(126,204,7)}
        <g class="hg-upper">
          ${torso(100,62,100,118)}
          <line x1="100" y1="62" x2="100" y2="54" stroke="url(#skinG)" stroke-width="8" ${lc}/>
          ${head(100,40)}
          <g class="hg-la">${gi(86,80,58,104,11)}${gi2(58,104,44,124,9)}${dot(44,124)}</g>
          <g class="hg-ra">${gi(114,80,142,104,11)}${gi2(142,104,156,124,9)}${dot(156,124)}</g>
        </g>
        <text x="154" y="88" font-size="10" fill="${c}" opacity="0.6">↓ bend</text>
      </svg>`,
      hip_twist: `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .ht-up  { transform-origin:100px 118px; animation:htUp 1.6s ease-in-out infinite; }
          .ht-lo  { transform-origin:100px 118px; animation:htLo 1.6s ease-in-out infinite; }
          @keyframes htUp { 0%,100%{ transform:rotate(0deg) scaleX(1); } 25%{ transform:rotate(18deg) scaleX(0.96); } 75%{ transform:rotate(-18deg) scaleX(0.96); } }
          @keyframes htLo { 0%,100%{ transform:rotate(0deg); } 25%{ transform:rotate(-6deg); } 75%{ transform:rotate(6deg); } }
        </style>
        ${floor(100)}
        <circle cx="100" cy="118" r="34" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="7 5" opacity="0.25"/>
        <g class="ht-lo">
          ${gi(89,118,78,168,13)}${gi2(78,168,74,200,11)}${dot(74,204,7)}
          ${gi(111,118,122,168,13)}${gi2(122,168,126,200,11)}${dot(126,204,7)}
        </g>
        <g class="ht-up">
          ${torso(100,62,100,118)}
          <line x1="100" y1="62" x2="100" y2="54" stroke="url(#skinG)" stroke-width="8" ${lc}/>
          ${head(100,40)}
          ${gi(86,80,56,88,11)}${gi2(56,88,40,96,9)}${dot(40,96)}
          ${gi(114,80,144,88,11)}${gi2(144,88,160,96,9)}${dot(160,96)}
        </g>
        <text x="68" y="140" font-size="9" fill="${c}" opacity="0.6">← twist →</text>
      </svg>`,
      split_right: `<svg viewBox="0 0 220 215" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .sr-lean { transform-origin:110px 115px; animation:srL 2.4s ease-in-out infinite; }
          @keyframes srL { 0%,100%{ transform:rotate(0deg); } 50%{ transform:rotate(30deg); } }
        </style>
        ${floor(110,206)}
        ${gi(101,115,62,168,13)}${gi2(62,168,52,204,11)}${dot(52,207,7)}
        ${gi(119,115,158,168,13)}${gi2(158,168,168,204,11)}${dot(168,207,7)}
        <g class="sr-lean">
          ${torso(110,60,110,115)}
          <line x1="110" y1="60" x2="110" y2="52" stroke="url(#skinG)" stroke-width="8" ${lc}/>
          ${head(110,37)}
          ${gi(96,78,72,90,11)}${gi2(72,90,54,108,9)}${dot(54,108)}
          ${gi(124,78,148,92,11)}${gi2(148,92,164,110,9)}${dot(164,110)}
        </g>
        <text x="155" y="148" font-size="9" fill="${c}" opacity="0.6">↘ reach</text>
      </svg>`,
      side_press: `<svg viewBox="0 0 230 215" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .sp-b { transform-origin:115px 110px; animation:spB 2.2s ease-in-out infinite; }
          @keyframes spB { 0%,100%{ transform:translateY(0) rotate(0deg); } 50%{ transform:translateY(8px) rotate(-4deg); } }
        </style>
        ${floor(115,207)}
        <g class="sp-b">
          ${gi(126,110,172,140,13)}${gi2(172,140,172,203,11)}${dot(172,207,7)}
          ${gi(104,110,58,140,13)}${gi2(58,140,42,200,11)}${dot(42,204,7)}
          ${torso(115,58,115,110)}
          ${gi(101,76,80,90,11)}${gi2(80,90,68,106,9)}${dot(68,106)}
          ${gi(129,76,150,90,11)}${gi2(150,90,166,100,9)}${dot(166,100)}
          <line x1="115" y1="58" x2="115" y2="50" stroke="url(#skinG)" stroke-width="8" ${lc}/>
          ${head(115,35)}
        </g>
        <text x="152" y="170" font-size="9" fill="${c}" opacity="0.6">lunge ↓</text>
        <text x="28" y="165" font-size="9" fill="${c}" opacity="0.6">straight</text>
      </svg>`,
      forward_lunge: `<svg viewBox="0 0 200 215" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .fl-lleg { transform-origin:93px 114px; animation:flLL 1.2s ease-in-out infinite; }
          .fl-rleg { transform-origin:107px 114px; animation:flRL 1.2s ease-in-out infinite; }
          .fl-body { transform-origin:100px 114px; animation:flB  1.2s ease-in-out infinite; }
          @keyframes flLL { 0%,100%{ transform:rotate(0deg); } 50%{ transform:rotate(20deg); } }
          @keyframes flRL { 0%,100%{ transform:rotate(0deg); } 50%{ transform:rotate(-34deg); } }
          @keyframes flB  { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(10px); } }
        </style>
        ${floor(100)}
        <g class="fl-body">
          <g class="fl-rleg">${gi(107,114,128,156,13)}${gi2(128,156,124,200,11)}${dot(124,204,7)}</g>
          <g class="fl-lleg">${gi(93,114,72,158,13)}${gi2(72,158,68,200,11)}${dot(68,204,7)}</g>
          ${torso(100,62,100,114)}
          ${gi(86,80,60,96,11)}${gi2(60,96,48,112,9)}${dot(48,112)}
          ${gi(114,80,140,96,11)}${gi2(140,96,152,112,9)}${dot(152,112)}
          <line x1="100" y1="62" x2="100" y2="54" stroke="url(#skinG)" stroke-width="8" ${lc}/>
          ${head(100,40)}
        </g>
        <text x="108" y="185" font-size="9" fill="${c}" opacity="0.55">→ step forward</text>
      </svg>`,
      hamstring_left: `<svg viewBox="0 0 210 200" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .hl-reach { transform-origin:90px 110px; animation:hlR 2.2s ease-in-out infinite; }
          @keyframes hlR { 0%,100%{ transform:rotate(0deg); } 55%{ transform:rotate(42deg); } }
        </style>
        <line x1="20" y1="180" x2="190" y2="180" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
        ${gi(80,175,158,175,13)}${dot(162,175,8)}
        ${gi(80,175,60,160,13)}${gi2(60,160,44,175,11)}${dot(44,178,7)}
        <g class="hl-reach">
          ${torso(90,110,90,172,18)}
          ${gi(78,128,52,138,11)}${gi2(52,138,34,152,9)}${dot(34,152)}
          ${gi(102,128,128,138,11)}${gi2(128,138,148,152,9)}${dot(148,152)}
          <line x1="90" y1="110" x2="90" y2="102" stroke="url(#skinG)" stroke-width="8" ${lc}/>
          ${head(90,87)}
        </g>
        <text x="140" y="168" font-size="9" fill="${c}" opacity="0.6">← reach toes</text>
      </svg>`,
      hamstring_right: `<svg viewBox="0 0 210 200" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .hr-reach { transform-origin:120px 110px; animation:hrR 2.2s ease-in-out infinite; }
          @keyframes hrR { 0%,100%{ transform:rotate(0deg); } 55%{ transform:rotate(-42deg); } }
        </style>
        <line x1="20" y1="180" x2="190" y2="180" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
        ${gi(130,175,52,175,13)}${dot(48,175,8)}
        ${gi(130,175,150,160,13)}${gi2(150,160,166,175,11)}${dot(166,178,7)}
        <g class="hr-reach">
          ${torso(120,110,120,172,18)}
          ${gi(108,128,82,138,11)}${gi2(82,138,62,152,9)}${dot(62,152)}
          ${gi(132,128,158,138,11)}${gi2(158,138,176,152,9)}${dot(176,152)}
          <line x1="120" y1="110" x2="120" y2="102" stroke="url(#skinG)" stroke-width="8" ${lc}/>
          ${head(120,87)}
        </g>
        <text x="40" y="168" font-size="9" fill="${c}" opacity="0.6">reach toes →</text>
      </svg>`
    };

    return svgs[exerciseId] || svgs['heel_glute'];
  }

  static buildDots() {
    const wrap = document.getElementById('warmup-dots');
    if (!wrap) return;
    wrap.innerHTML = this.exercises.map((ex, i) => `
      <div class="warmup-dot" id="wdot-${i}" title="${ex.nameEn}">
        <span>${ex.icon}</span>
      </div>
    `).join('');
  }

  static updateDots(idx) {
    this.exercises.forEach((_, i) => {
      const dot = document.getElementById(`wdot-${i}`);
      if (!dot) return;
      dot.classList.toggle('wu-done',   i < idx);
      dot.classList.toggle('wu-active', i === idx);
      dot.classList.toggle('wu-future', i > idx);
    });
  }

  static loadExercise(idx) {
    this.stopTimer();
    this.currentIdx = idx;
    const ex = this.exercises[idx];
    const ar = this.gameState.currentLanguage === 'ar';

    document.getElementById('warmup-ex-icon').textContent = ex.icon;
    document.getElementById('warmup-ex-name').textContent = ar ? ex.nameAr : ex.nameEn;
    document.getElementById('warmup-ex-desc').textContent = ar ? ex.descAr : ex.descEn;
    document.getElementById('warmup-char-tip').textContent = ar ? ex.tipAr : ex.tipEn;
    document.getElementById('warmup-ex-counter').textContent = ar
      ? `تمرين ${idx + 1} من ${this.exercises.length}`
      : `Exercise ${idx + 1} of ${this.exercises.length}`;

    const card = document.getElementById('warmup-card');
    if (card) card.style.borderTopColor = ex.color;

    const charEl = document.getElementById('warmup-character');
    if (charEl) {
      charEl.style.backgroundImage = 'none';
      charEl.className = 'warmup-character';
      charEl.innerHTML = WarmupSystem.SVG(ex.id, ex.color);
    }

    const ringFill = document.getElementById('warmup-ring-fill');
    if (ringFill) ringFill.style.stroke = ex.color;

    this.timeLeft = ex.duration;
    this.isPaused = false;
    this.updateTimerDisplay();
    this.updateDots(idx);
    this.syncPauseBtn();
    this.startTimer();

    if (card) {
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = 'wuCardIn 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    }
  }

  static startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      this.timeLeft--;
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) this.nextExercise();
    }, 1000);
  }

  static stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }

  static updateTimerDisplay() {
    const numEl  = document.getElementById('warmup-timer-num');
    const fillEl = document.getElementById('warmup-ring-fill');
    const ex     = this.exercises[this.currentIdx];
    if (!ex) return;

    const urgent = this.timeLeft <= 5;

    if (numEl) {
      numEl.textContent = this.timeLeft;
      numEl.style.color = urgent ? 'var(--danger-color)' : 'var(--text-white)';
    }

    if (fillEl) {
      const pct    = this.timeLeft / ex.duration;
      const offset = WarmupSystem.CIRCUMFERENCE * (1 - pct);
      fillEl.style.strokeDashoffset = offset;
      fillEl.style.stroke = urgent ? 'var(--danger-color)' : ex.color;
    }
  }

  static nextExercise() {
    this.stopTimer();
    this.gameState.playSound('success');
    const next = this.currentIdx + 1;
    if (next < this.exercises.length) {
      this.showRestPeriod(next);
    } else {
      this.complete();
    }
  }

  static showRestPeriod(nextIdx) {
    if (this._restInterval) {
      clearInterval(this._restInterval);
      this._restInterval = null;
    }
    this._pendingNextIdx = nextIdx;   // store so delegation can access it
    
    const ar  = this.gameState.currentLanguage === 'ar';
    const ex  = this.exercises[nextIdx];
    let restTime = 10;

    const card = document.getElementById('warmup-card');
    if (!card) { this.loadExercise(nextIdx); return; }

    card._savedHTML = card.innerHTML;
    card.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center;
                  justify-content:center; padding:32px 24px; gap:20px; min-height:340px;">
        <div style="font-size:2.8rem; font-weight:900; color:var(--success-color);">
          ${ar ? 'راحة' : 'REST'}
        </div>
        <div id="rest-countdown" style="font-size:5rem; font-weight:900; color:var(--text-white);
             font-variant-numeric:tabular-nums; line-height:1;">${restTime}</div>
        <div style="color:var(--text-gray); font-size:0.9rem; letter-spacing:1px; text-transform:uppercase;">
          ${ar ? 'التالي:' : 'NEXT UP:'}
        </div>
        <div style="display:flex; align-items:center; gap:16px; background:rgba(0,0,0,0.3); 
                    border-radius:16px; padding:16px 24px; border:2px solid rgba(255,255,255,0.1);">
          <span style="font-size:2.2rem;">${ex.icon}</span>
          <div>
            <div style="font-size:1.1rem; font-weight:700; color:var(--text-white);">
              ${ar ? ex.nameAr : ex.nameEn}
            </div>
            <div style="font-size:0.88rem; color:var(--text-gray); margin-top:4px; max-width:280px; line-height:1.4;">
              ${ar ? ex.descAr : ex.descEn}
            </div>
          </div>
        </div>
        <div style="width:100%; max-width:320px; height:8px; background:rgba(255,255,255,0.1); 
                    border-radius:4px; overflow:hidden;">
          <div id="rest-bar" style="height:100%; width:100%; background:var(--success-color);
               border-radius:4px; transition:width 0.9s linear;"></div>
        </div>
        <button class="btn btn-success btn-small" id="rest-skip-btn">
          <i class="fas fa-forward"></i> ${ar ? 'تخطي الراحة' : 'Skip Rest'}
        </button>
      </div>
    `;

    requestAnimationFrame(() => {
      const bar = document.getElementById('rest-bar');
      if (bar) bar.style.width = '0%';
    });

    const countdownEl = () => document.getElementById('rest-countdown');
    
    this._restInterval = setInterval(() => {
      restTime--;
      const el = countdownEl();
      if (el) {
        el.textContent = restTime;
        if (restTime <= 3) el.style.color = 'var(--danger-color)';
      }
      if (restTime <= 0) {
        if (this._restInterval) {
          clearInterval(this._restInterval);
          this._restInterval = null;
        }
        this.endRestPeriod(nextIdx);
      }
    }, 1000);

    // Note: Skip Rest button click is handled by event delegation in setupControls()
  }

  static endRestPeriod(nextIdx) {
    if (this._restInterval) {
      clearInterval(this._restInterval);
      this._restInterval = null;
    }
    
    const card = document.getElementById('warmup-card');
    if (card && card._savedHTML) {
      card.innerHTML = card._savedHTML;
      card._savedHTML = null;
    }
    
    this.loadExercise(nextIdx);
  }

  static togglePause() {
    this.isPaused = !this.isPaused;
    this.syncPauseBtn();
    const charEl = document.getElementById('warmup-character');
    if (charEl) charEl.classList.toggle('wu-paused', this.isPaused);
  }

  static syncPauseBtn() {
    const ar   = this.gameState.currentLanguage === 'ar';
    const icon = document.getElementById('warmup-pause-icon');
    const lbl  = document.getElementById('warmup-pause-label');
    if (icon) icon.className = this.isPaused ? 'fas fa-play' : 'fas fa-pause';
    if (lbl)  lbl.textContent = this.isPaused
      ? (ar ? 'استمرار' : 'Resume')
      : (ar ? 'إيقاف'   : 'Pause');
  }

  static setupControls() {
    // Use event delegation on the static warmup screen container.
    // This fires correctly even after innerHTML replacement during REST.
    const screen = document.getElementById('warmup-screen');
    if (!screen || screen._wuDelegated) return;   // attach once only
    screen._wuDelegated = true;

    screen.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const id = btn.id || btn.closest('[id]')?.id;

      if (btn.id === 'warmup-pause-btn' || btn.closest('#warmup-pause-btn')) {
        this.togglePause();
        return;
      }
      if (btn.id === 'warmup-next-btn' || btn.closest('#warmup-next-btn')) {
        this.gameState.playSound('click');
        this.stopTimer();
        this.nextExercise();
        return;
      }
      if (btn.id === 'warmup-exit-btn' || btn.closest('#warmup-exit-btn')) {
        this.stopTimer();
        if (this._restInterval) { clearInterval(this._restInterval); this._restInterval = null; }
        switchScreen('home');
        return;
      }
      if (btn.id === 'rest-skip-btn') {
        if (this._restInterval) { clearInterval(this._restInterval); this._restInterval = null; }
        this.endRestPeriod(this._pendingNextIdx ?? this.currentIdx + 1);
        return;
      }
    });
  }

  static complete() {
    this.stopTimer();
    this.gameState.playSound('win');

    const ar = this.gameState.currentLanguage === 'ar';

    document.getElementById('warmup-card').style.display     = 'none';
    document.getElementById('warmup-complete').style.display = '';

    document.getElementById('warmup-complete-title').textContent = ar ? '🎉 انتهى الإحماء!' : '🎉 Warm Up Done!';
    document.getElementById('warmup-complete-sub').textContent   = ar
      ? 'رائع! جسمك جاهز الآن للتدريب. هيا نتعلم!'
      : 'Awesome! Your body is ready. Let\'s train!';

    const completeChar = document.getElementById('warmup-complete-char');
    if (completeChar && this.gameState) {
      const isBoy = this.gameState.playerCharacter === 'boy';
      completeChar.style.backgroundImage = `url('${(
        isBoy
          ? 'assets/images/characters/boy_char/boy_idle.png'
          : 'assets/images/characters/girl_char/girl_idle.png'
        ).replace(/ /g,'%20')}')`;
      completeChar.classList.add('wu-complete-bounce');
    }

    this.updateDots(this.exercises.length);

    this.gameState.showNotification(
      ar ? '🔥 إحماء مكتمل! جسمك جاهز للتدريب!' : '🔥 Warm-up complete! Body is ready!', 'success'
    );
  }

  static restart() {
    document.getElementById('warmup-complete').style.display = 'none';
    document.getElementById('warmup-card').style.display     = '';
    this.initialize(this.gameState);
  }
}

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
  await GameStateInstance.init();

  setProgress(80, 'Starting game...');
  ScreenManagerInstance = new ScreenManager(GameStateInstance);
  setupGlobalEventListeners();

  setProgress(100, 'Ready!');
  setTimeout(() => {
    if (loadingScreen) loadingScreen.classList.add('hidden');
    ScreenManagerInstance.showModal('language');
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
        GameStateInstance.currentLanguage === 'ar' ? '⚠️ يرجى اختيار شخصية أولاً' : '⚠️ Please select a character first', 'warning'
      );
      return;
    }
    const character = selected.dataset.character;
    GameStateInstance.playerCharacter = character;
    GameStateInstance.saveToStorage();
    GameStateInstance.playSound('success');
    ScreenManagerInstance.hideModals();
    ScreenManagerInstance.switchScreen('home');
    const welcomeMessage = GameStateInstance.currentLanguage === 'ar'
      ? `🎮 أهلًا ${character === 'boy' ? 'بالصبي' : 'بالفتاة'}! استمتع برحلتك في التايكوندو.`
      : `🎮 Welcome ${character === 'boy' ? 'Boy' : 'Girl'}! Enjoy your Taekwondo journey.`;
    GameStateInstance.showNotification(welcomeMessage, 'success');
  });
  
  document.querySelectorAll('.select-character-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const character = event.currentTarget.dataset.character;
      GameStateInstance.playerCharacter = character;
      GameStateInstance.saveToStorage();
      GameStateInstance.updateCharacterDisplays();
      GameStateInstance.playSound('click');
      const message = GameStateInstance.currentLanguage === 'ar'
        ? `👤 تم تغيير الشخصية إلى ${character === 'boy' ? 'الصبي' : 'الفتاة'}`
        : `👤 Character changed to ${character === 'boy' ? 'Boy' : 'Girl'}`;
      GameStateInstance.showNotification(message, 'success');
    });
  });
  
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', (event) => {
      const gameId = card.dataset.game;
      if (GameStateInstance && GameStateInstance.completedGames.has('learning')) {
        GameStateInstance.currentGame = gameId;
        ScreenManagerInstance.switchScreen(gameId);
      } else {
        GameStateInstance.playSound('error');
        GameStateInstance.showNotification(
          GameStateInstance.currentLanguage === 'ar'
            ? '🔒 يرجى إكمال التعلم ومشاهدة الفيديو أولاً'
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

// =====================================================================
// NAVIGATION — global so onclick="navToggle()" works from HTML
// =====================================================================
function navOpen() {
  const navMenu   = document.getElementById('collapsibleNav');
  const overlay   = document.getElementById('navOverlay');
  const toggleBtn = document.getElementById('navToggleBtn');
  if (!navMenu) return;
  navMenu.classList.add('active');
  if (overlay)   overlay.classList.add('active');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
    toggleBtn.setAttribute('aria-label', 'Close Menu');
  }
}

function navClose() {
  const navMenu   = document.getElementById('collapsibleNav');
  const overlay   = document.getElementById('navOverlay');
  const toggleBtn = document.getElementById('navToggleBtn');
  if (!navMenu) return;
  navMenu.classList.remove('active');
  if (overlay)   overlay.classList.remove('active');
  if (toggleBtn) {
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.setAttribute('aria-label', 'Open Menu');
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
    ? '🌐 تم تغيير اللغة إلى العربية'
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
    switch (currentScreen) {
      case 'form-control': FormControlSystem.initialize(GameStateInstance);   break;
      case 'puzzle':       PuzzleSystem.initialize(GameStateInstance);        break;
      case 'performance':  PerformanceSystem.initialize(GameStateInstance);   break;
      case 'quiz':         QuizSystem.initialize(GameStateInstance);          break;
      case 'learning':     LearningSystem.initialize(GameStateInstance);      break;
      case 'warmup':       WarmupSystem.initialize(GameStateInstance);        break;
      case 'apchagi-menu': ApChagiMenuSystem.initialize(GameStateInstance);   break;
    }
  }
}

function hardResetGame() {
  const ar = GameStateInstance?.currentLanguage === 'ar';
  const msg = ar
    ? 'هل أنت متأكد من حذف كل التقدم؟ لا يمكن التراجع عن هذا.'
    : 'Are you sure you want to reset all progress? This cannot be undone.';
  if (confirm(msg)) {
    try { WarmupSystem.stopTimer(); } catch(e) {}
    try { PerformanceSystem.stopTimer(); } catch(e) {}
    localStorage.removeItem('taekwondoJourney');
    location.reload();
  }
}

function initCollapsibleNav() {
  // Escape key closes nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navClose();
  });
  // Clicking outside closes nav
  document.addEventListener('click', (e) => {
    const navMenu   = document.getElementById('collapsibleNav');
    const toggleBtn = document.getElementById('navToggleBtn');
    if (!navMenu || !navMenu.classList.contains('active')) return;
    if (!navMenu.contains(e.target) && !toggleBtn?.contains(e.target)) navClose();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGame();
  setTimeout(initCollapsibleNav, 500);
});