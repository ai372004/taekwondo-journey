// =====================================================================
// LEARNING SYSTEM — Phase Cards + Video
// =====================================================================
class LearningSystem {

  // Reads the 5 phases for whichever skill is passed in (defaults to currentSkill)
  // and reshapes them into the {num, title, image, focus, tips, color} format the
  // renderer below expects.
  static PHASES(isBoy, ar, skillId) {
    const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS[this.gameState?.currentSkill] || GameConfig.SKILLS.apchagi;
    return skill.phases.map(p => ({
      num: p.num,
      title: ar ? p.title.ar : p.title.en,
      image: isBoy ? p.image.boy : p.image.girl,
      focus: ar ? p.focus.ar : p.focus.en,
      tips: ar ? p.tips.ar : p.tips.en,
      color: p.color
    }));
  }

  static initialize(gameState) {
    this.gameState      = gameState;
    this.skillId         = gameState.currentSkill;
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
    const phases = LearningSystem.PHASES(isBoy, ar, this.skillId);
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
              <div class="phase-char-img" data-img-url="${phase.image.replace(/ /g,'%20')}" data-img-color="${phase.color}" style="background-image:url('${phase.image.replace(/ /g,'%20')}')"></div>
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
              ? `<button class="btn" id="phase-prev-btn"><i class="fas fa-arrow-left"></i> ${ar ? 'رجوع' : 'Back'}</button>`
              : '<span></span>'
            }
            <div class="phase-read-badge" id="phase-read-badge" style="display:${this.phasesRead.has(this.currentPhase) ? 'flex' : 'none'}">
              <i class="fas fa-check-circle"></i> ${ar ? 'قريتها' : 'Read!'}
            </div>
            <button class="btn btn-success" id="phase-next-btn">
              ${this.currentPhase === total - 1
                ? (ar ? 'اتفرج على الفيديو 🎥' : 'Watch Video 🎥')
                : (ar ? 'اللي بعده ←' : 'Next →')
              }
            </button>
          </div>

        </div>
      </div>
    `;

    scanAndVerifyImages(container);

    // v27: the character really moves into this phase (skeletal animation), when the kick has one
    this.rigView?.destroy(); this.rigView = null;
    const col = container.querySelector('.phase-image-col');
    if (col && window.RigView && RigSupport.has(this.skillId)) {
      const rv = new RigView(col, { ch: isBoy ? 'boy' : 'girl', skillId: this.skillId, color: phase.color, ar });
      this.rigView = rv;
      rv.start(this.currentPhase).then(ok => { if (!ok && this.rigView === rv) this.rigView = null; });
    }

    // Capture the phase now: reading the value 2 s later marked the NEXT phase
    // as "read" if the player tapped Next quickly, skipping it unread.
    const phaseShown = this.currentPhase;
    screenTimeout(() => {
      if (this.currentPhase !== phaseShown) return;
      this.phasesRead.add(phaseShown);
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
    const phases = LearningSystem.PHASES(false, ar, this.skillId);
    const skill = GameConfig.SKILLS[this.skillId] || GameConfig.SKILLS.apchagi;
    const skillName = ar ? skill.name.ar : skill.name.en;

    // User has read all 5 phases — unlock games even before video is watched
    LearningSystem.unlockGamesFromPhases();

    container.innerHTML = `
      <div class="phase-dots" style="margin-bottom:20px">
        ${phases.map((p, i) => `<div class="phase-dot done" title="${p.title}">✓</div>`).join('')}
        <div class="phase-dot active">🎥</div>
      </div>

      <div class="video-container">
        <h3>🎥 ${ar ? `اتفرج دلوقتي: ${skillName} كامل` : `Now Watch: Full ${skillName} Tutorial`}</h3>
        <div class="video-wrapper">
          <video id="learning-video" controls preload="metadata">
            <source src="${skill.video}" type="video/mp4">
          </video>
          <div class="video-controls">
            <button class="btn btn-small" id="play-pause-btn"><i class="fas fa-play"></i> ${ar ? 'تشغيل' : 'Play'}</button>
            <button class="btn btn-small" id="replay-btn"><i class="fas fa-redo"></i> ${ar ? 'إعادة' : 'Replay'}</button>
            <button class="btn btn-small btn-success" id="mark-complete-btn" disabled>
              <i class="fas fa-check"></i> ${ar ? 'اتفرجت ✓' : 'Mark as Watched ✓'}
            </button>
          </div>
          <div class="video-progress-bar-wrap">
            <div class="video-progress-bar-fill" id="vid-progress-fill" style="width:0%"></div>
          </div>
          <p class="video-hint">${ar ? '⏱️ اتفرج على 80% على الأقل عشان زرار الإكمال يشتغل' : '⏱️ Watch at least 80% to unlock the completion button'}</p>
        </div>
        <button class="btn" id="back-to-phases-btn" style="margin-top:10px">
          <i class="fas fa-arrow-left"></i> ${ar ? 'راجع المراحل' : 'Review Phases'}
        </button>
      </div>
    `;

    this.videoElement = document.getElementById('learning-video');
    watchVideoLoading(this.videoElement);
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
        ? '🎉 برافو! دلوقتي تقدر تخلّص مرحلة التعلم.'
        : '🎉 Great job! You can now complete the learning phase.',
      'success'
    );
  }

  static completeLearning() {
    if (!this.gameState) return;
    this.gameState.completeGame('learning', 100);
    this.gameState.playSound('success');
    this.gameState.showNotification(
      this.gameState.currentLanguage === 'ar'
        ? '🎉 مبروك! خلّصت مرحلة التعلم بنجاح!'
        : '🎉 Congratulations! Learning phase complete!',
      'success'
    );
    this.gameState.updateHomeProgress();
    this.gameState.updateHomeSkills();
    // v29: straight to the next step of the journey (the first game), no menu hunting
    screenTimeout(() => { const n = window.Journey?.next?.(); if (n) n.go(); else ScreenManagerInstance?.switchScreen('skill-menu'); }, 1500);
  }

  // Called after user reads all 5 phase cards — unlocks games without needing video
  static unlockGamesFromPhases() {
    if (!this.gameState) return;
    const skillId = this.skillId || this.gameState.currentSkill;
    const key = `learning:${skillId}`;
    if (this.gameState.completedGames.has(key)) return; // already unlocked for this skill
    this.gameState.completedGames.add(key);
    this.gameState.completedGames.add('learning'); // legacy flat flag, back-compat
    if (this.gameState.skillGameScores[skillId]) {
      this.gameState.skillGameScores[skillId].learning = Math.max(this.gameState.skillGameScores[skillId].learning || 0, 80);
    }
    this.gameState.learningProgress = 80;
    this.gameState.saveToStorage();
    this.gameState.updateHomeProgress();
    this.gameState.showNotification(
      this.gameState.currentLanguage === 'ar'
        ? '🎓 برافو! قريت كل المراحل — الألعاب اتفتحت دلوقتي! اتفرج على الفيديو عشان تخلّص التعلم كله.'
        : '🎓 Well done! All phases read — games are now unlocked! Watch the video to fully complete learning.',
      'success'
    );
  }
}


