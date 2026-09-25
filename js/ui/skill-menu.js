class SkillMenuSystem {
  static initialize(gameState) {
    this.gameState = gameState;
    const skillId = gameState.currentSkill;
    const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi;
    const ar = gameState.currentLanguage === 'ar';

    const titleEl = document.getElementById('skill-menu-title');
    const descEl  = document.getElementById('skill-menu-desc');
    if (titleEl) {
      titleEl.textContent = `🥋 ${ar ? skill.name.ar : skill.name.en}`;
      // Audio dictionary: tap to hear the Korean term pronounced (Junbi, Ap
      // Chagi, Kihap style terms are just the romanized `name.en` field).
      const oldBtn = titleEl.querySelector('.speak-btn');
      if (oldBtn) oldBtn.remove();
      const speakBtn = SpeechHelper.makeButton(skill.name.en, 'en-US', skill.name.en);
      if (speakBtn) titleEl.appendChild(speakBtn);
    }
    if (descEl)  descEl.textContent  = ar ? skill.description.ar : skill.description.en;

    gameState.createCharacterVisual('skill-menu-character', gameState.playerCharacter, 'IDLE');
    // v29: mark the stage the journey wants next, so the child never guesses
    const step = window.Journey?.next?.()?.stage;
    document.querySelectorAll('.skill-menu-card[data-stage]').forEach(card => {
      const on = card.dataset.stage === step;
      card.classList.toggle('is-next', on);
      let tag = card.querySelector('.card-next-tag');
      if (on && !tag) { tag = document.createElement('span'); tag.className = 'card-next-tag'; card.appendChild(tag); }
      if (tag && on) tag.textContent = ar ? '👉 ابدأ من هنا' : '👉 start here';
      if (tag && !on) tag.remove();
    });

    const scores = gameState.skillGameScores[skillId] || {};
    const learnBar  = document.getElementById('skill-learn-progress');
    const gamesBar  = document.getElementById('skill-games-progress');
    const warmupBar = document.getElementById('skill-warmup-progress');
    const quizBar   = document.getElementById('skill-quiz-progress');

    if (learnBar)  learnBar.style.width  = `${scores.learning || 0}%`;
    const gamesAvg = Math.round(((scores.formControl || 0) + (scores.puzzle || 0) + (scores.performance || 0) + (scores.action || 0)) / 4);
    if (gamesBar)  gamesBar.style.width  = `${gamesAvg}%`;
    if (warmupBar) warmupBar.style.width = `${scores.warmup || 0}%`;
    if (quizBar)   quizBar.style.width   = `${scores.quiz || 0}%`;

    this.renderTechnicalInfo(skill, ar);
    this.renderMasterySummary(gameState, skillId, ar);
    this.applyStageGating(gameState, skillId);
  }

  // Visually locks Learning/Games/Tests cards until the prior stage is done
  // FOR THIS SKILL — cards stay clickable so attemptStageNav() can explain
  // why, rather than silently doing nothing.
  static applyStageGating(gameState, skillId) {
    const s = gameState.skillGameScores[skillId] || {};
    const stages = [
      { id: 'stage-learning-card', unlocked: (s.warmup || 0) > 0 },
      { id: 'stage-games-card',    unlocked: (s.learning || 0) > 0 },
      { id: 'stage-quiz-card',     unlocked: GameState.allGamesDone(s) }
    ];
    stages.forEach(({ id, unlocked }) => {
      const card = document.getElementById(id);
      if (card) card.classList.toggle('stage-locked', !unlocked);
    });
  }

  static renderTechnicalInfo(skill, ar) {
    const container = document.querySelector('#skill-menu-screen .game-container');
    if (!container) return;
    let box = document.getElementById('skill-technical-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'skill-technical-box';
      box.className = 'skill-technical-box';
      const grid = container.querySelector('.skill-menu-grid');
      if (grid) grid.insertAdjacentElement('beforebegin', box);
      else container.appendChild(box);
    }
    const t = skill.technical;
    box.innerHTML = `
      <div class="tech-info-row">
        <span class="tech-info-label">${ar ? '🎯 الجزء اللي بيضرب:' : '🎯 Striking Surface:'}</span>
        <span class="tech-info-value">${ar ? t.strikingSurface.ar : t.strikingSurface.en}</span>
      </div>
      <div class="tech-info-row">
        <span class="tech-info-label">${ar ? '🥅 الهدف:' : '🥅 Target:'}</span>
        <span class="tech-info-value">${ar ? t.target.ar : t.target.en}</span>
      </div>
      <div class="tech-info-row">
        <span class="tech-info-label">${ar ? '🔄 زاوية الارتكاز:' : '🔄 Pivot Angle:'}</span>
        <span class="tech-info-value">${ar ? t.pivotAngle.ar : t.pivotAngle.en}</span>
      </div>
    `;
  }

  // Ties the 4 mini-games together into ONE coherent reading instead of 4
  // separate bars: compares scores across activities and names a genuine
  // strength + growth area, or a balanced-performance message once there's
  // enough data. This is the "integration" layer across the games system.
  static renderMasterySummary(gameState, skillId, ar) {
    const container = document.querySelector('#skill-menu-screen .game-container');
    if (!container) return;
    let box = document.getElementById('skill-mastery-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'skill-mastery-box';
      box.className = 'skill-mastery-box';
      const techBox = document.getElementById('skill-technical-box');
      if (techBox) techBox.insertAdjacentElement('afterend', box);
      else container.appendChild(box);
    }

    const scores = gameState.skillGameScores[skillId] || {};
    const dims = [
      { key: 'formControl', label: { en: 'Body Positioning',   ar: 'وضعية الجسم' },      score: scores.formControl || 0 },
      { key: 'puzzle',      label: { en: 'Movement Sequencing', ar: 'ترتيب الحركة' },     score: scores.puzzle || 0 },
      { key: 'performance', label: { en: 'Spotting Mistakes',   ar: 'كشف الغلطات' },   score: scores.performance || 0 },
      { key: 'action',      label: { en: 'Kick Execution',     ar: 'تنفيذ الركلة' },       score: scores.action || 0 },
      { key: 'quiz',        label: { en: 'Technical Knowledge', ar: 'المعلومات النظرية' },  score: scores.quiz || 0 }
    ];
    const attempted = dims.filter(d => d.score > 0);

    if (attempted.length < 2) {
      box.innerHTML = `
        <div class="mastery-icon">🧭</div>
        <p>${ar ? 'كمّل نشاطين على الأقل من الخمسة عشان تشوف ملخص إتقانك كله.'
                : 'Complete at least 2 of the 5 activities to see your full mastery summary.'}</p>
      `;
      return;
    }

    const sorted = [...attempted].sort((a, b) => b.score - a.score);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    const gap = strongest.score - weakest.score;

    let msg;
    if (gap < 15) {
      msg = ar ? '⚖️ أداءك متوازن في كل حاجة — كمّل كده!'
               : "⚖️ Well-balanced performance across the board — keep it up!";
    } else {
      msg = ar
        ? `💪 إنت قوي في <b>${strongest.label.ar}</b> (${strongest.score}%)، ركّز أكتر على <b>${weakest.label.ar}</b> (${weakest.score}%).`
        : `💪 Strong in <b>${strongest.label.en}</b> (${strongest.score}%) — focus more on <b>${weakest.label.en}</b> (${weakest.score}%).`;
    }

    box.innerHTML = `
      <div class="mastery-icon">🧭</div>
      <p>${msg}</p>
    `;
  }
}

