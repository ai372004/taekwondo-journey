// =====================================================================
// REWARDS & WINNER SYSTEM
// =====================================================================
class WinnerSystem {
  // Per-game achievement label shown for actually completing THAT activity,
  // instead of one generic line no matter which game was just played.
  static ACHIEVEMENT_LABELS = {
    en: {
      'form-control': { icon: '🤸', text: 'Form Control Mastered' },
      'puzzle':       { icon: '📋', text: 'Puzzle Assembly Completed' },
      'performance':  { icon: '🎯', text: 'Performance Recognition Completed' },
      'action':       { icon: '⚡', text: 'Action Challenge Completed' },
      'error-hunt':   { icon: '🔍', text: 'Error Hunt Completed' },
      'quiz-blast':   { icon: '🚀', text: 'Quiz Blast Completed' },
      'board-break':  { icon: '🪵', text: 'Boards Broken' },
      'paddle-reflex':{ icon: '🎯', text: 'Target Paddles Cleared' },
      'phase-rhythm': { icon: '🥁', text: 'Kick Rhythm Mastered' },
      'sparring-duel': { icon: '🥊', text: 'Sparring Duel Won' },
      'balance-hold':  { icon: '⚖️', text: 'Perfect Balance' },
      'heavy-bag':     { icon: '🥋', text: 'Heavy Bag Crushed' },
      'quiz':         { icon: '❓', text: 'Quiz Completed' },
      'learning':     { icon: '🎓', text: 'Learning Completed' }
    },
    ar: {
      'form-control': { icon: '🤸', text: 'اتقنت التحكم في الوضعية' },
      'puzzle':       { icon: '📋', text: 'خلّصت تركيب الأجزاء' },
      'performance':  { icon: '🎯', text: 'خلّصت تمييز الأداء' },
      'action':       { icon: '⚡', text: 'خلّصت تحدي الضربة' },
      'error-hunt':   { icon: '🔍', text: 'خلّصت صياد الأخطاء' },
      'quiz-blast':   { icon: '🚀', text: 'خلّصت تحدي كويز الفضاء' },
      'board-break':  { icon: '🪵', text: 'كسرت الألواح' },
      'paddle-reflex':{ icon: '🎯', text: 'خلّصت مضارب الأهداف' },
      'phase-rhythm': { icon: '🥁', text: 'اتقنت إيقاع الركلة' },
      'sparring-duel': { icon: '🥊', text: 'كسبت النزال' },
      'balance-hold':  { icon: '⚖️', text: 'توازن مظبوط' },
      'heavy-bag':     { icon: '🥋', text: 'غلبت كيس الملاكمة' },
      'quiz':         { icon: '❓', text: 'خلّصت الاختبار' },
      'learning':     { icon: '🎓', text: 'خلّصت التعلم' }
    }
  };

  static renderAchievements(gameType, accuracy, gameState, isFirstClear) {
    const list = document.getElementById('winner-achievement-list');
    if (!list) return;
    const ar = gameState.currentLanguage === 'ar';
    const labels = this.ACHIEVEMENT_LABELS[ar ? 'ar' : 'en'];
    const items = [];

    // 1. Always: what was actually just completed.
    const gameLabel = labels[gameType] || labels['learning'];
    items.push({ icon: gameLabel.icon, text: gameLabel.text });

    // 2. Only the first time this exact activity is cleared — kept genuine
    //    instead of showing "First Game Completed" on every single replay.
    if (isFirstClear) {
      items.push({
        icon: '🥇',
        text: ar ? 'أول لعبة تخلّصها' : 'First Game Completed'
      });
    }

    // 3. Only for a near-perfect run, matching what actually happened.
    if (Math.round(accuracy) >= 95) {
      items.push({
        icon: '🎯',
        text: ar ? 'أتقنت الشكل المثالي' : 'Perfect Form Mastered'
      });
    }

    list.innerHTML = items.map(it => `
            <div class="achievement-item">
              <span class="achievement-icon">${it.icon}</span>
              <span class="achievement-text">${it.text}</span>
            </div>`).join('');
  }

  static show(gameType, accuracy, gameState, isFirstClear = false) {
    this.gameState  = gameState;
    this.lastGame   = gameType; // store the game ID directly, not currentScreen
    this.lastGameScreen = gameState.currentScreen; // keep original screen too
    setTimeout(() => window.Voice?.cue(accuracy >= 95 ? 'great' : 'bravo'), 700);
    const wc = document.getElementById('winner-character');
    if (wc && window.RigSprite) {
      wc.innerHTML = '';
      const sp = new RigSprite(wc, { ch: gameState.playerCharacter === 'girl' ? 'girl' : 'boy', anim: 'win', tap: 'win', height: 190 });
      sp.start().then(ok => { if (!ok) gameState.createCharacterVisual('winner-character', gameState.playerCharacter, 'WIN'); });
    }
    // v30: the same ★★★ as the map — they pop in one by one
    const starsEl = document.getElementById('winner-stars');
    if (starsEl) {
      const n = window.Journey ? Journey.starsFor(Math.round(accuracy)) : 0;
      starsEl.setAttribute('aria-label', TKD.t(`${n} of 3 stars`, `${TKD.num(n)} نجوم من ٣`));
      starsEl.innerHTML = [1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}" style="--k:${k}">★</i>`).join('');
      [1, 2, 3].slice(0, n).forEach((k, j) => setTimeout(() => window.AudioKit?.sfx('star', { gain: 0.45, rate: 1 + j * 0.15 }), 450 + j * 260));
    }
    const accuracyEl = document.getElementById('winner-accuracy');
    if (accuracyEl) window.tkdCountUp ? tkdCountUp(accuracyEl, Math.round(accuracy), { suffix: '%' }) : (accuracyEl.textContent = `${Math.round(accuracy)}%`);
    
    const skill = GameConfig.SKILLS[gameState.currentSkill] || GameConfig.SKILLS.apchagi;
    const skillName = gameState.currentLanguage === 'ar' ? skill.name.ar : skill.name.en;

    const messages = {
      en: {
        'form-control': `Excellent! You mastered the ${skillName} stance control!`,
        'puzzle': `Great! You understood the complete ${skillName} movement sequence!`,
        'performance': `Superb! You spotted the technical mistakes in ${skillName} like a real coach!`,
        'action': `Powerful! You mastered the ${skillName} action challenge!`,
        'error-hunt': `Sharp eyes! You spotted every technical mistake in ${skillName}.`,
        'quiz-blast': `Blast off! You cleared the ${skillName} question run!`,
        'board-break': `Hi-yah! You broke the boards with a real ${skillName}!`,
        'paddle-reflex': `Lightning fast! You hit every real ${skillName} target!`,
        'phase-rhythm': `On the beat! You know the ${skillName} phases by heart!`,
        'sparring-duel': `Great ring sense — you only scored with legal ${skillName} targets!`,
        'balance-hold': `Steady as a rock through every phase of the ${skillName}!`,
        'heavy-bag': `Perfect timing — your ${skillName} hit the bag with real power!`,
        'quiz': 'Bravo! Your Taekwondo knowledge is impressive!',
        'learning': 'Congratulations! You completed your learning successfully!'
      },
      ar: {
        'form-control': `برافو! اتقنت التحكم في وضعية ${skillName}!`,
        'puzzle': `جامد! فهمت حركة ${skillName} كلها بالترتيب!`,
        'performance': `تحفة! لقطت الأخطاء الفنية في ${skillName} زي مدرّب بجد!`,
        'action': `عاش! اتقنت تحدي ${skillName}!`,
        'error-hunt': `عين خبيرة! لقطت الأخطاء الفنية في ${skillName}.`,
        'quiz-blast': `انطلاقة جامدة! خلّصت أسئلة ${skillName} بنجاح!`,
        'board-break': `كسرت الألواح بـ ${skillName} بجد!`,
        'paddle-reflex': `سريع زي البرق! ضربت كل أهداف ${skillName} الصح!`,
        'phase-rhythm': `ماشي على الإيقاع! حافظ مراحل ${skillName} صم!`,
        'sparring-duel': `قراية حلوة للنزال — سجّلت بس على أهداف ${skillName} القانونية!`,
        'balance-hold': `ثابت زي الصخرة في كل مراحل ${skillName}!`,
        'heavy-bag': `توقيت مظبوط — ${skillName} بتاعتك ضربت الكيس بقوة بجد!`,
        'quiz': 'برافو! معلوماتك في التايكوندو تجنن!',
        'learning': 'مبروك! خلّصت التعلم بنجاح!'
      }
    };
    
    const messageElement = document.getElementById('winner-message');
    if (messageElement) {
      const langMessages = messages[gameState.currentLanguage];
      messageElement.textContent = langMessages[gameType] || langMessages.learning;
    }

    this.renderAchievements(gameType, accuracy, gameState, isFirstClear);

    // Cool Down: only offer it once the skill's full quiz/assessment is
    // passed — that's the natural end of a kicking session.
    const cooldownBtn = document.getElementById('cooldown-btn');
    if (cooldownBtn) cooldownBtn.style.display = (gameType === 'quiz') ? '' : 'none';

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
    // v29: one obvious next step instead of "Next level"
    const nx = window.Journey?.next?.();
    const nextBtn = document.getElementById('next-level-btn');
    if (nx && nextBtn) {
      nextBtn.innerHTML = `<span aria-hidden="true">${nx.icon}</span> ${TKD.t('Next:', 'الخطوة الجاية:')} ${TKD.esc(nx.label)} ${TKD.ar ? '←' : '→'}`;
      nextBtn.classList.add('jr-next');
    }
    cloneAndBind('next-level-btn',   () => (nx ? nx.go() : this.goSkillMenu()));
    cloneAndBind('back-to-home-btn', () => this.goHome());
    cloneAndBind('try-again-btn',    () => this.tryAgain());
    cloneAndBind('cooldown-btn',     () => ScreenManagerInstance.switchScreen('cooldown'));
  }

  static tryAgain() {
    const last = this.lastGame;
    // lastGame is now the gameType (form-control, puzzle, performance, quiz, learning)
    const validScreens = ['form-control', 'puzzle', 'performance', 'action', 'error-hunt', 'quiz-blast', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'quiz', 'learning'];
    if (last && validScreens.includes(last)) ScreenManagerInstance.switchScreen(last);
    else this.goSkillMenu();
    this.gameState.playSound('click');
  }

  static goHome() {
    ScreenManagerInstance.switchScreen('home');
    this.gameState.playSound('click');
  }

  static goSkillMenu() {
    ScreenManagerInstance.switchScreen('skill-menu');
    this.gameState.playSound('click');
  }
}

