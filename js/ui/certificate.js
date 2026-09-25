// =====================================================================
// CERTIFICATE SYSTEM (Canvas-based Official Belt Certificate)
// =====================================================================
class CertificateSystem {
  static generate() {
    const gameState = GameStateInstance;
    if (!gameState) return;

    const skillId = gameState.currentSkill;
    const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi;
    const isAr = gameState.currentLanguage === 'ar';
    const charName = gameState.playerCharacter === 'boy' ? (isAr ? 'البطل (ولد)' : 'Young Warrior (Boy)') : (isAr ? 'البطلة (بنت)' : 'Young Warrior (Girl)');
    const technique = isAr ? skill.name.ar : skill.name.en;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // الخلفية وإطار الدوجو التراثي
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, 'rgba(255, 107, 53, 0.12)');
    grad.addColorStop(1, 'rgba(42, 157, 143, 0.12)');
    ctx.fillStyle = grad;
    ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);

    // حدود ذهبية مزدوجة
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);

    // الشعار والرموز
    ctx.textAlign = 'center';
    ctx.font = '70px serif';
    ctx.fillText('🥋', canvas.width / 2, 140);

    // عنوان الشهادة
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 38px ' + (isAr ? "Cairo, 'Noto Sans Arabic', Tahoma, sans-serif" : 'Roboto, system-ui, sans-serif');
    ctx.fillText(isAr ? 'شهادة إتقان مهارة تايكوندو' : 'CERTIFICATE OF TAEKWONDO MASTERY', canvas.width / 2, 210);

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px ' + (isAr ? "Cairo, 'Noto Sans Arabic', Tahoma, sans-serif" : 'Roboto, system-ui, sans-serif');
    ctx.fillText(isAr ? 'الاتحاد التعليمي للتايكوندو بيشهد إن اللاعب:' : 'This certifies that the player:', canvas.width / 2, 280);

    // اسم اللاعب
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 46px ' + (isAr ? "Cairo, 'Noto Sans Arabic', Tahoma, sans-serif" : 'Roboto, system-ui, sans-serif');
    ctx.fillText(charName, canvas.width / 2, 355);

    // تفاصيل الإنجاز
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '24px ' + (isAr ? "Cairo, 'Noto Sans Arabic', Tahoma, sans-serif" : 'Roboto, system-ui, sans-serif');
    const msg = isAr 
      ? `خلّص بنجاح كل اختبارات الحركة والمعلومات النظرية لمهارة: (${technique})`
      : `Has successfully mastered all biomechanical and technical stages of: (${technique})`;
    ctx.fillText(msg, canvas.width / 2, 430);

    // شريط الحزام
    ctx.fillStyle = '#2a9d8f';
    ctx.fillRect(canvas.width / 2 - 180, 480, 360, 20);
    ctx.fillStyle = '#111827';
    ctx.fillRect(canvas.width / 2 + 60, 480, 30, 20);

    // أختام وتوقيع المدرب
    const dateStr = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US');
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px ' + (isAr ? "Cairo, 'Noto Sans Arabic', Tahoma, sans-serif" : 'Roboto, system-ui, sans-serif');
    ctx.fillText((isAr ? 'التاريخ: ' : 'Date: ') + dateStr, 220, 640);
    ctx.fillText(isAr ? 'المدرب: يانغ (Coach Yang)' : 'Instructor: Master Yang', canvas.width - 240, 640);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 360, 600);
    ctx.lineTo(canvas.width - 120, 600);
    ctx.stroke();

    // تحميل الصورة كملف PNG
    const link = document.createElement('a');
    link.download = `Taekwondo_${skillId}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    gameState.playSound('win');
    gameState.showNotification(isAr ? '🎉 شهادة الإتقان نزلت بنجاح!' : '🎉 Certificate downloaded successfully!', 'success');
  }
}
