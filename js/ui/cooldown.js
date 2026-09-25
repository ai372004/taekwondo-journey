// =====================================================================
// COOL DOWN — quick post-training stretch routine (mirrors the warm-up
// stage at the START of a session) to build the healthy habit of always
// stretching after kicking, shown once a skill's full quiz is passed.
// =====================================================================
class CooldownSystem {
  static STRETCHES = [
    {
      icon: '🦵',
      nameEn: 'Standing Quad Stretch', nameAr: 'إطالة عضلة الفخذ اللي قدام',
      descEn: 'Pull one heel gently toward your glute, hold, then switch legs.',
      descAr: 'اسحب كعبك بالراحة ناحية وسطك من ورا، اثبت، وبعدين بدّل الرجل.'
    },
    {
      icon: '🧘',
      nameEn: 'Seated Hamstring Stretch', nameAr: 'إطالة عضلة الفخذ اللي ورا وإنت قاعد',
      descEn: 'Sit and reach for your toes with legs straight, breathing slowly.',
      descAr: 'اقعد ومد إيديك ناحية صوابع رجليك ورجليك مفرودين، وخد نفسك بالراحة.'
    },
    {
      icon: '🦶',
      nameEn: 'Calf & Ankle Roll', nameAr: 'إطالة السمانة ولف الكاحل',
      descEn: 'Lean into a wall with one leg back, heel down, then roll each ankle.',
      descAr: 'اسند على الحيطة ومد رجل لورا والكعب ثابت، وبعدين لف كل كاحل.'
    },
    {
      icon: '🌬️',
      nameEn: 'Deep Breathing', nameAr: 'نفس عميق',
      descEn: 'Stand tall, breathe in for 4 seconds, out for 4 seconds, five times.',
      descAr: 'اقف مفرود، خد نفس عميق 4 ثواني، وطلّعه في 4 ثواني، خمس مرات.'
    }
  ];

  static initialize(gameState) {
    this.gameState = gameState;
    const ar = gameState.currentLanguage === 'ar';
    const list = document.getElementById('cooldown-list');
    if (!list) return;
    list.innerHTML = this.STRETCHES.map(s => `
      <div class="cooldown-card">
        <div class="cooldown-icon">${s.icon}</div>
        <h4>${ar ? s.nameAr : s.nameEn}</h4>
        <p>${ar ? s.descAr : s.descEn}</p>
      </div>
    `).join('');
  }
}

