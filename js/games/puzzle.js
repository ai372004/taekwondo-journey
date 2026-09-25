// =====================================================================
// GAME 2: PUZZLE SYSTEM — descriptions + preview + snap/shake
// =====================================================================
class PuzzleSystem {

  static STEP_DATA(skillId, isBoy, ar) {
    const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi;
    const data = {};
    skill.phases.forEach(p => {
      data[`step${p.num}`] = {
        image: isBoy ? p.image.boy : p.image.girl,
        label: ar ? p.title.ar.replace(/^[0-9️⃣]+\s*/u, '') : p.title.en.replace(/^[0-9️⃣]+\s*/u, ''),
        desc:  ar ? p.focus.ar : p.focus.en,
        color: p.color
      };
    });
    // Imposter piece: a real image paired with ANOTHER phase's title. It never
    // matches any slot, so placing it is always wrong — reasoning it out (not
    // just pattern-matching) is exactly the point.
    const imgPhase   = skill.phases[2];
    const labelPhase = skill.phases[0];
    data.distractor = {
      image: isBoy ? imgPhase.image.boy : imgPhase.image.girl,
      label: (ar ? labelPhase.title.ar : labelPhase.title.en).replace(/^[0-9️⃣]+\s*/u, ''),
      desc:  ar ? '⚠️ القطعة دي مش من الترتيب الصح — خلي بالك إن في قطعة تانية بنفس الاسم في المجموعة!'
                : "⚠️ This piece doesn't belong in the sequence — notice another piece already shares its name!",
      color: imgPhase.color
    };
    return data;
  }

  // Short bilingual explanation of WHY the order matters mechanically — shown
  // once the puzzle is solved correctly, so the exercise ends with a "why"
  // instead of just a checkmark.
  static SEQUENCE_RATIONALE = {
    apchagi: {
      en: 'Why this order matters: the knee lift STORES power before the leg snaps into extension — skip it, and the kick loses most of its force.',
      ar: 'ليه الترتيب ده مهم: رفع الركبة بيخزّن الطاقة قبل ما الرجل تتفرد — لو نطّيت المرحلة دي، الركلة بتخسر معظم قوتها.'
    },
    narochagi: {
      en: 'Why this order matters: the leg must rise fully BEFORE the heel drops — dropping early turns a powerful axe strike into a weak push.',
      ar: 'ليه الترتيب ده مهم: الرجل لازم تطلع لفوق خالص الأول قبل ما الكعب ينزل — لو نزلت بدري، ضربة الفأس القوية هتبقى زقّة ضعيفة.'
    },
    bakchagi3: {
      en: 'Why this order matters: the hip rotation builds momentum THROUGH the pivot — cutting the spin short kills the power the whole kick depends on.',
      ar: 'ليه الترتيب ده مهم: لفّة الوسط بتبني الزخم وإنت بترتكز — لو وقفت اللفّة بدري، هتضيّع القوة اللي الركلة كلها معتمدة عليها.'
    }
  };

  static initialize(gameState) {
    this.gameState    = gameState;
    this.skillId      = gameState.currentSkill;
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
    box.innerHTML = `<p>${ar ? '💡 اسحب قطعة للمكان الفاضي عشان تشوف شرح المرحلة هنا!' : '💡 Drop a piece into a slot to see the phase explanation here!'}</p>`;
    container.insertAdjacentElement('afterend', box);
  }

  static showStepDescription(stepId) {
    const box = document.getElementById('step-description-box');
    if (!box) return;
    const ar   = this.gameState.currentLanguage === 'ar';
    const isBoy= this.gameState.playerCharacter === 'boy';
    const data = PuzzleSystem.STEP_DATA(this.skillId, isBoy, ar)[stepId];
    if (!data) return;
    box.innerHTML = `
      <div class="step-desc-inner">
        <div class="step-desc-img" data-img-url="${data.image.replace(/ /g,'%20')}" data-img-color="${data.color || ''}" style="background-image:url('${data.image.replace(/ /g,'%20')}')"></div>
        <div class="step-desc-text">
          <h4 style="color:var(--primary-color);margin-bottom:8px;">${data.label}</h4>
          <p style="margin:0;line-height:1.6;">${data.desc}</p>
        </div>
      </div>
    `;
    box.classList.remove('rationale-box');
    box.classList.add('visible');
    scanAndVerifyImages(box);

    // Read-aloud accessibility: helps kids who can't read fluently yet.
    const textEl = box.querySelector('.step-desc-text');
    if (textEl) {
      const speakBtn = SpeechHelper.makeButton(`${data.label}. ${data.desc}`, ar ? 'ar-EG' : 'en-US');
      if (speakBtn) textEl.querySelector('h4')?.appendChild(speakBtn);
    }
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
    // 5 real steps + 1 imposter piece = 6 in the tray, 5 slots to fill
    this.shuffledPieces = [...this.correctOrder, 'distractor'];
    for (let i = this.shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledPieces[i], this.shuffledPieces[j]] = [this.shuffledPieces[j], this.shuffledPieces[i]];
    }
    this.displayShuffledPieces();
  }

  static displayShuffledPieces() {
    const container = document.querySelector('.puzzle-pieces');
    if (!container) return;
    this.selectedPiece = null;
    container.innerHTML = '';
    this.shuffledPieces.forEach(id => container.appendChild(this.createPiece(id)));
    this.setupDragListeners();
  }

  static createPiece(stepId) {
    const ar   = this.gameState.currentLanguage === 'ar';
    const isBoy= this.gameState.playerCharacter === 'boy';
    const data = PuzzleSystem.STEP_DATA(this.skillId, isBoy, ar)[stepId];
    const div  = document.createElement('div');
    div.className = 'puzzle-piece integrated-piece';
    div.dataset.piece = stepId;
    div.setAttribute('draggable','true');
    // Keyboard/switch-device support, to match Form Control's joints: the
    // pieces were mouse/touch only before, so a keyboard-only player had no
    // way to play the puzzle at all.
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', data.label);
    div.innerHTML = `
      <div class="piece-image-container">
        <div class="piece-image" data-img-url="${data.image.replace(/ /g,'%20')}" data-img-color="${data.color || ''}" style="background-image:url('${data.image.replace(/ /g,'%20')}')"></div>
      </div>
      <div class="piece-label">${data.label}</div>
    `;
    scanAndVerifyImages(div);
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.selectPieceForTap(div.dataset.piece); }
    });
    return div;
  }

  static setupDragListeners() {
    document.querySelectorAll('.puzzle-piece').forEach(p => {
      // Desktop drag-and-drop (unchanged)
      p.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', p.dataset.piece); p.classList.add('dragging'); });
      p.addEventListener('dragend',   () => p.classList.remove('dragging'));
      // Mobile-friendly fallback: tap a piece to select it, then tap a slot to
      // place it. HTML5 dragstart/dataTransfer don't fire on touch devices by
      // default, so this is required for the puzzle to work on phones/tablets.
      p.addEventListener('click', () => this.selectPieceForTap(p.dataset.piece));
    });
  }

  // Tap-to-select / tap-to-place: tapping a piece selects it (glow outline +
  // dashed hint on every empty slot); tapping it again deselects it; tapping
  // a slot while a piece is selected places that piece there.
  static selectPieceForTap(pieceId) {
    const alreadySelected = this.selectedPiece === pieceId;
    document.querySelectorAll('.puzzle-piece.piece-selected').forEach(el => el.classList.remove('piece-selected'));
    document.querySelectorAll('.puzzle-slot.slot-selectable-target').forEach(el => el.classList.remove('slot-selectable-target'));

    if (alreadySelected) {
      this.selectedPiece = null;
      return;
    }
    this.selectedPiece = pieceId;
    const pieceEl = document.querySelector(`.puzzle-piece[data-piece="${pieceId}"]`);
    if (pieceEl) pieceEl.classList.add('piece-selected');
    this.gameState.playSound('click');
    document.querySelectorAll('.puzzle-slot:not(.filled)').forEach(slot => slot.classList.add('slot-selectable-target'));
  }

  static setupEventListeners() {
    this.selectedPiece = null;
    // setupDragListeners() is NOT called here any more: initializePieces()
    // already calls it, so every piece got TWO click handlers. A tap then ran
    // selectPieceForTap twice — select, then instantly deselect — which made
    // tap-to-place (the only way to play on phones/tablets) do nothing.

    // The slots are permanent elements, so tie their listeners to one
    // AbortController; otherwise each visit stacks another set of handlers.
    if (this._slotAbort) this._slotAbort.abort();
    this._slotAbort = new AbortController();
    const { signal } = this._slotAbort;

    document.querySelectorAll('.puzzle-slot').forEach(slot => {
      slot.addEventListener('dragover',  (e) => { e.preventDefault(); slot.classList.add('drag-over'); }, { signal });
      slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'), { signal });
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const pieceId = e.dataTransfer.getData('text/plain');
        this.placePiece(pieceId, parseInt(slot.dataset.step));
      }, { signal });
      // Tap-to-place: complete the tap gesture started on a piece. Also
      // keyboard-accessible (Enter/Space), matching Form Control's joints.
      slot.setAttribute('tabindex', '0');
      slot.setAttribute('role', 'button');
      const placeOrTake = () => {
        const slotNum = parseInt(slot.dataset.step);
        if (!this.selectedPiece) {
          // Nothing selected: activating a filled slot takes that piece
          // back, instead of doing nothing (the only previous option was
          // resetting the whole board).
          if (this.userOrder[slotNum - 1]) {
            this.clearSlot(slotNum);
            this.gameState.playSound('click');
            this.updateProgress();
          }
          return;
        }
        const pieceId = this.selectedPiece;
        this.selectedPiece = null;
        document.querySelectorAll('.puzzle-slot.slot-selectable-target').forEach(el => el.classList.remove('slot-selectable-target'));
        this.placePiece(pieceId, slotNum);
      };
      slot.addEventListener('click', placeOrTake, { signal });
      slot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); placeOrTake(); }
      }, { signal });
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
      btn.innerHTML = `<i class="fas fa-play-circle"></i> ${ar ? 'شوف الترتيب' : 'Preview Order'}`;
      btn.addEventListener('click', () => this.previewSequence());
      controls.appendChild(btn);
    }
  }

  // Recreates a piece's tray element and wires up its drag + tap listeners —
  // used to give a piece back to the tray, whether from a slot the player
  // is reclaiming or one they're about to overwrite with a different piece.
  static returnPieceToTray(pieceId) {
    const container = document.querySelector('.puzzle-pieces');
    if (!container) return;
    const el = this.createPiece(pieceId);
    container.appendChild(el);
    el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', el.dataset.piece); el.classList.add('dragging'); });
    el.addEventListener('dragend',   () => el.classList.remove('dragging'));
    el.addEventListener('click', () => this.selectPieceForTap(el.dataset.piece));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.selectPieceForTap(el.dataset.piece); }
    });
  }

  // Empties a slot and sends whatever piece was in it back to the tray, so
  // the player has a way to correct a misplaced piece without resetting the
  // whole board. Used both when tapping a filled slot with nothing selected
  // (an explicit "take this back" tap) and internally when a piece is about
  // to overwrite one that's already there.
  static clearSlot(slotNumber) {
    const oldPieceId = this.userOrder[slotNumber - 1];
    if (!oldPieceId) return;
    const slot = document.getElementById(`slot-${slotNumber}`);
    if (slot) {
      slot.innerHTML = '';
      slot.parentElement.classList.remove('filled', 'slot-correct', 'slot-wrong');
    }
    this.userOrder[slotNumber - 1] = null;
    this.returnPieceToTray(oldPieceId);
  }

  static placePiece(pieceId, slotNumber) {
    const slot  = document.getElementById(`slot-${slotNumber}`);
    const piece = document.querySelector(`.puzzle-piece[data-piece="${pieceId}"]`);
    if (!slot || !piece) return;

    // A slot that already holds a DIFFERENT piece used to be silently
    // overwritten: the old piece vanished for good — not in the tray, not in
    // any slot — leaving the puzzle impossible to finish without a full
    // Reset. One mis-tap on a crowded phone screen could cost all of a
    // child's progress. Now the old piece is swapped back to the tray first.
    if (this.userOrder[slotNumber - 1] && this.userOrder[slotNumber - 1] !== pieceId) {
      this.clearSlot(slotNumber);
    }

    const ar   = this.gameState.currentLanguage === 'ar';
    const isBoy= this.gameState.playerCharacter === 'boy';
    const data = PuzzleSystem.STEP_DATA(this.skillId, isBoy, ar)[pieceId];

    slot.innerHTML = `
      <div class="piece-image-container" style="height:80px;">
        <div class="piece-image" data-img-url="${data.image.replace(/ /g,'%20')}" data-img-color="${data.color || ''}" style="background-image:url('${data.image.replace(/ /g,'%20')}')"></div>
      </div>
      <div class="piece-label">${data.label}</div>
    `;
    scanAndVerifyImages(slot);
    slot.parentElement.classList.remove('slot-correct', 'slot-wrong');   // clear any stale result from a previous piece here
    slot.parentElement.classList.add('filled');
    piece.remove();

    this.userOrder[slotNumber - 1] = pieceId;

    const isCorrect = pieceId === this.correctOrder[slotNumber - 1];
    window.Review?.note('phase', isCorrect, { skill: this.gameState?.currentSkill, phase: slotNumber - 1 });
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
    this.nudgeCheck();
  }

  // v29: the moment the last piece is down, bring the green button to the child
  // (on a phone it lives below the fold) and make it impossible to miss.
  static nudgeCheck() {
    if (this.userOrder.some(p => p === null)) return;
    const btn = document.getElementById('check-puzzle-btn');
    if (!btn) return;
    btn.classList.add('is-next');
    const r = btn.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 90 || r.top < 60) {
      btn.scrollIntoView({ block: 'center', behavior: (window.prefersReducedMotion?.() ? 'auto' : 'smooth') });
    }
    window.AudioKit?.sfx('ui-pop', { gain: 0.4 });
    TKD?.toast(TKD.t('Now tap “Check the order” ✅', 'دلوقتي دوس «اتأكد من الترتيب» ✅'), 'info');
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
      ar ? '💡 الترتيب: الاستعداد ← رفع الركبة ← فرد الرجل ← السحب ← الرجوع'
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
      screenTimeout(highlight, 1200);
    };

    this.gameState.showNotification(
      ar ? '▶️ بنوريك الترتيب الصح...' : '▶️ Previewing correct order...', 'info'
    );
    highlight();
  }

  static checkPuzzle() {
    if (this.userOrder.some(p => p === null)) {
      this.gameState.playSound('error');
      this.gameState.showNotification(
        this.gameState.currentLanguage === 'ar' ? '⚠️ حط كل القطع الأول' : '⚠️ Place all pieces first', 'error'
      );
      return;
    }
    let correct = 0;
    for (let i = 0; i < 5; i++) { if (this.userOrder[i] === this.correctOrder[i]) correct++; }
    const accuracy = (correct / 5) * 100;

    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      const isFirstClear = this.gameState.completeGame('puzzle', accuracy);
      this.gameState.playSound('success');
      this.gameState.showNotification(
        this.gameState.currentLanguage === 'ar' ? `🎉 برافو! دقتك ${accuracy}%!` : `🎉 Well done! Accuracy: ${accuracy}%!`, 'success'
      );
      this.showSequenceRationale();
      screenTimeout(() => WinnerSystem.show('puzzle', accuracy, this.gameState, isFirstClear), 2600);
    } else {
      this.gameState.playSound('error');
      if (this.gameState.trackFailure(accuracy, 'puzzle')) return;
      this.gameState.showNotification(
        this.gameState.currentLanguage === 'ar' ? `⚠️ ${correct}/5 صح. جرّب تاني!` : `⚠️ ${correct}/5 correct. Try again!`, 'error'
      );
    }
  }

  static showSequenceRationale() {
    const box = document.getElementById('step-description-box');
    if (!box) return;
    const ar = this.gameState.currentLanguage === 'ar';
    const rationale = PuzzleSystem.SEQUENCE_RATIONALE[this.skillId] || PuzzleSystem.SEQUENCE_RATIONALE.apchagi;
    box.innerHTML = `
      <div class="step-desc-inner sequence-rationale">
        <span style="font-size:1.6rem;">🧠</span>
        <div class="step-desc-text">
          <p style="margin:0;line-height:1.6;">${ar ? rationale.ar : rationale.en}</p>
        </div>
      </div>
    `;
    box.classList.add('visible', 'rationale-box');
  }
}

