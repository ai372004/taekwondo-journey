// =====================================================================
// AP CHAGI MENU SYSTEM — intermediate hub screen
// =====================================================================
// =====================================================================
// SKILL MENU SYSTEM — generic hub for whichever skill is currentSkill
// =====================================================================
// =====================================================================
// DOJANG TROPHY ROOM — permanent achievements display (medals, cups,
// digital certificates) so kids have a reason to come back and see their
// collection grow, instead of only seeing achievements once on a win screen.
// =====================================================================
class TrophyRoomSystem {
  static TROPHIES = [
    {
      id: 'first-step', icon: '🥉',
      name: { en: 'First Steps', ar: 'أول الخطوات' },
      desc: { en: 'Completed your very first training game', ar: 'خلّصت أول لعبة تدريب ليك' },
      condition: (gs) => gs.completedGames.size > 0
    },
    {
      id: 'white-belt-1st-stripe', icon: '🥋',
      name: { en: 'White Belt — 1st Stripe', ar: 'الحزام الأبيض — الشريط الأول' },
      desc: { en: 'Mastered Ap Chagi', ar: 'اتقنت مهارة آب تشاجي' },
      condition: (gs) => gs.completedSkills.has('apchagi')
    },
    {
      id: 'white-belt-2nd-stripe', icon: '🥋',
      name: { en: 'White Belt — 2nd Stripe', ar: 'الحزام الأبيض — الشريط التاني' },
      desc: { en: 'Mastered Naeryeo Chagi', ar: 'اتقنت مهارة ناريو تشاجي' },
      condition: (gs) => gs.completedSkills.has('narochagi')
    },
    {
      id: 'white-belt-3rd-stripe', icon: '🥋',
      name: { en: 'White Belt — 3rd Stripe (Beginner Tier Complete)', ar: 'الحزام الأبيض — الشريط التالت (خلّصت مرحلة الأساسيات)' },
      desc: { en: 'Mastered every skill in the Dojang', ar: 'اتقنت كل مهارات الصالة' },
      condition: (gs) => gs.completedSkills.has('bakchagi3')
    },
    {
      id: 'puzzle-master', icon: '📋',
      name: { en: 'Sequence Master', ar: 'ملك الترتيب' },
      desc: { en: 'Scored 100% on a puzzle assembly', ar: 'جبت 100% في لعبة تركيب القطع' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.puzzle || 0) >= 100)
    },
    {
      id: 'sharp-eye', icon: '🎯',
      name: { en: 'Sharp Eye', ar: 'العين الصقر' },
      desc: { en: 'Scored 100% on Performance Recognition', ar: 'جبت 100% في التعرف على الأداء' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.performance || 0) >= 100)
    },
    {
      id: 'kick-master', icon: '⚡',
      name: { en: 'Kick Master', ar: 'ملك الركلات' },
      desc: { en: 'Scored 100% on an Action Challenge', ar: 'جبت 100% في تحدي الضربة' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.action || 0) >= 100)
    },
    {
      id: 'quiz-genius', icon: '🧠',
      name: { en: 'Quiz Genius', ar: 'عبقري الاختبارات' },
      desc: { en: 'Scored 100% on a knowledge quiz', ar: 'جبت 100% في اختبار المعلومات' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.quiz || 0) >= 100)
    },
    {
      id: 'board-breaker', icon: '🪵',
      name: { en: 'Board Breaker', ar: 'كاسر الألواح' },
      desc: { en: 'Passed Board Break with every kick', ar: 'عدّيت كسر الألواح بكل الركلات' },
      condition: (gs) => GameConfig.SKILL_ORDER.every(sk => (gs.skillGameScores[sk]?.boardBreak || 0) >= GameConfig.SETTINGS.PASSING_SCORE)
    },
    {
      id: 'lightning', icon: '⚡',
      name: { en: 'Lightning Reflexes', ar: 'سريع زي البرق' },
      desc: { en: 'Scored 95%+ on Target Paddles', ar: 'جبت 95% أو أكتر في مضارب الأهداف' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.paddleReflex || 0) >= 95)
    },
    {
      id: 'rhythm-master', icon: '🥁',
      name: { en: 'Rhythm Master', ar: 'ملك الإيقاع' },
      desc: { en: 'Scored 95%+ on Kick Rhythm', ar: 'جبت 95% أو أكتر في إيقاع الركلة' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.phaseRhythm || 0) >= 95)
    },
    {
      id: 'ring-champion', icon: '🥊',
      name: { en: 'Ring Champion', ar: 'بطل الحلبة' },
      desc: { en: 'Passed Sparring Duel with every kick', ar: 'عدّيت النزال بكل الركلات' },
      condition: (gs) => GameConfig.SKILL_ORDER.every(sk => (gs.skillGameScores[sk]?.sparringDuel || 0) >= GameConfig.SETTINGS.PASSING_SCORE)
    },
    {
      id: 'iron-balance', icon: '⚖️',
      name: { en: 'Iron Balance', ar: 'توازن حديد' },
      desc: { en: 'Scored 95%+ on Balance Hold', ar: 'جبت 95% أو أكتر في ثبات التوازن' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.balanceHold || 0) >= 95)
    },
    {
      id: 'power-kicker', icon: '💥',
      name: { en: 'Power Kicker', ar: 'ركلة جبارة' },
      desc: { en: 'Scored 95%+ on Heavy Bag', ar: 'جبت 95% أو أكتر في كيس الملاكمة' },
      condition: (gs) => Object.values(gs.skillGameScores).some(s => (s.heavyBag || 0) >= 95)
    },
    {
      id: 'certified', icon: '📜',
      name: { en: 'Certified', ar: 'معاه شهادة' },
      desc: { en: 'Earned an official mastery certificate', ar: 'خدت شهادة إتقان رسمية' },
      condition: (gs) => gs.completedSkills.size > 0
    }
  ];

  static initialize(gameState) {
    this.gameState = gameState;
    const ar = gameState.currentLanguage === 'ar';
    const grid = document.getElementById('trophy-room-grid');
    if (!grid) return;

    const unlockedCount = this.TROPHIES.filter(t => t.condition(gameState)).length;
    const counter = document.getElementById('trophy-room-counter');
    if (counter) {
      counter.textContent = ar
        ? `جمّعت ${unlockedCount} من ${this.TROPHIES.length}`
        : `${unlockedCount} of ${this.TROPHIES.length} collected`;
    }

    grid.innerHTML = this.TROPHIES.map(t => {
      const unlocked = t.condition(gameState);
      return `
        <div class="trophy-card ${unlocked ? 'trophy-unlocked' : 'trophy-locked'}">
          <div class="trophy-icon">${unlocked ? t.icon : '🔒'}</div>
          <h4>${ar ? t.name.ar : t.name.en}</h4>
          <p>${unlocked ? (ar ? t.desc.ar : t.desc.en) : (ar ? 'إنجاز مستخبي — كمّل لعب!' : 'Hidden — keep playing to unlock!')}</p>
        </div>`;
    }).join('');
  }
}

