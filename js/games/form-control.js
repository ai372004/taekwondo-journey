// =====================================================================
// GAME 1: FORM CONTROL SYSTEM — Target zones + Skeleton + Live Feedback
// =====================================================================
class FormControlSystem {
  static skeletonVisible = true;

  static getKickFrames(skillId, character) {
    const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi;
    const frames = {};
    skill.phases.forEach(p => { frames[p.key] = character === 'boy' ? p.image.boy : p.image.girl; });
    if (!frames.recoil) frames.recoil = frames.return;
    return frames;}
  static getKickFrames(skillId, character) {
    const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi;
    const frames = {};
    skill.phases.forEach(p => { frames[p.key] = character === 'boy' ? p.image.boy : p.image.girl; });
    if (!frames.recoil) frames.recoil = frames.return;
    return frames;
  }

  // Kids HUD: turns the abstract accuracy % into 3 stars + an energy bar
  // that fills up, so progress feels tangible instead of a bare number.
  static updateKidsHUD() {
    const starsCount = this.accuracy >= 85 ? 3 : (this.accuracy >= 60 ? 2 : (this.accuracy >= 35 ? 1 : 0));

    [1, 2, 3].forEach(num => {
      const star = document.getElementById(`star-${num}`);
      if (star) {
        const shouldUnlock = num <= starsCount;
        if (shouldUnlock && !star.classList.contains('unlocked')) {
          this.gameState?.playSound('success');
        }
        star.classList.toggle('unlocked', shouldUnlock);
      }
    });

    const energyFill = document.getElementById('kids-energy-fill');
    if (energyFill) energyFill.style.width = `${this.accuracy}%`;
  }

  // A little "🎉" bubble that pops up right where a joint just locked into
  // place, so the reward feels connected to the exact thing the kid just did.
  static spawnComicPopup(text, x, y) {
    const stage = document.getElementById('form-stage');
    if (!stage) return;
    const badge = document.createElement('div');
    badge.className = 'comic-badge';
    badge.textContent = text;
    badge.style.left = `${x}%`;
    badge.style.top = `${y}%`;
    stage.appendChild(badge);
    setTimeout(() => badge.remove(), 850);
  }

  // Magnetic snap: once a dragged joint gets close enough to its ideal spot,
  // pull it the rest of the way in — small hands/fingers on a touchscreen
  // rarely land exactly on target, so this removes that frustration.
  static checkMagneticSnap(part, x, y) {
    const ideal = this.idealPositions[part];
    if (!ideal) return { x, y, snapped: false };
    const dist = Math.hypot(x - ideal.x, y - ideal.y);
    const SNAP_THRESHOLD = 5.5;
    if (dist <= SNAP_THRESHOLD) return { x: ideal.x, y: ideal.y, snapped: true };
    return { x, y, snapped: false };
  }

  // Icons make it obvious at a glance what each touch point moves — easier
  // for kids than a plain colored dot with only a hover tooltip.
  static KID_ICONS = { knee: '🦵', foot: '👟', 'hand-left': '🥊', 'hand-right': '🛡️', pivot: '🦶' };

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
      point.innerHTML = FormControlSystem.KID_ICONS[part] || '🥋';
      const ar = this.gameState.currentLanguage === 'ar';
      point.title = FormControlSystem.JOINT_META[part]?.label?.[ar ? 'ar' : 'en'] || part;
      wrap.appendChild(point);
    });
    stage.appendChild(wrap);
  }
  static SKELETON_ANCHORS = {
    apchagi: {
      head: { x: 48, y: 19 },
      neck: { x: 48, y: 26 },
      chest: { x: 48, y: 33 },
      leftShoulder: { x: 40, y: 34 },
      rightShoulder: { x: 56, y: 34 },
      pelvis: { x: 47, y: 49 },
      kickingHip: { x: 44, y: 50 },
      standingHip: { x: 51, y: 50 },
      standingKnee: { x: 52, y: 67 },
      standingFoot: { x: 52, y: 84 },
      idealAngle: 165
    },
    narochagi: {
      head: { x: 44, y: 23 },
      neck: { x: 45, y: 29 },
      chest: { x: 46, y: 36 },
      leftShoulder: { x: 38, y: 38 },
      rightShoulder: { x: 54, y: 38 },
      pelvis: { x: 47, y: 52 },
      kickingHip: { x: 46, y: 51 },
      standingHip: { x: 50, y: 53 },
      standingKnee: { x: 51, y: 69 },
      standingFoot: { x: 51, y: 85 },
      idealAngle: 175
    },
    bakchagi3: {
      head: { x: 58, y: 23 },
      neck: { x: 55, y: 29 },
      chest: { x: 53, y: 36 },
      leftShoulder: { x: 45, y: 36 },
      rightShoulder: { x: 61, y: 37 },
      pelvis: { x: 50, y: 51 },
      kickingHip: { x: 44, y: 52 },
      standingHip: { x: 55, y: 53 },
      standingKnee: { x: 60, y: 66 },
      idealAngle: 155
    }
  };

  static SKILL_FORM_CONFIG = {
    apchagi: {
      controlPoints: ['knee', 'foot', 'hand-left', 'hand-right'],
      limits: {
        knee:         { minX: 35, maxX: 55, minY: 42, maxY: 68 },
        foot:         { minX: 45, maxX: 65, minY: 58, maxY: 82 },
        'hand-left':  { minX: 22, maxX: 42, minY: 28, maxY: 48 },
        'hand-right': { minX: 58, maxX: 78, minY: 28, maxY: 48 }
      },
      idealPositions: {
        knee:         { x: 45, y: 55 },
        foot:         { x: 55, y: 70 },
        'hand-left':  { x: 32, y: 38 },
        'hand-right': { x: 68, y: 38 }
      },
      why: {
        knee:         { en: 'A higher knee stores more energy, which converts into explosive power at extension.',
                        ar: 'الركبة العالية بتخزّن طاقة أكبر بتتحول لقوة انفجارية وقت ما تفرد رجلك.' },
        foot:         { en: 'Full forward extension delivers the strike at maximum reach and power.',
                        ar: 'إنك تفرد القدم على الآخر لقدام بيوصّل الضربة لأبعد مسافة وبأقصى قوة.' },
        'hand-left':  { en: 'A high guard protects your face and chest from counter-attacks while you kick.',
                        ar: 'الحراسة العالية بتحمي وشك وصدرك من أي هجمة مضادة وإنت بتركل.' },
        'hand-right': { en: 'A high guard protects your face and chest from counter-attacks while you kick.',
                        ar: 'الحراسة العالية بتحمي وشك وصدرك من أي هجمة مضادة وإنت بتركل.' }
      }
    },
    narochagi: {
      controlPoints: ['knee', 'foot', 'hand-left', 'hand-right'],
      limits: {
        knee:         { minX: 40, maxX: 60, minY: 22, maxY: 50 },
        foot:         { minX: 42, maxX: 62, minY: 6,  maxY: 28 },
        'hand-left':  { minX: 20, maxX: 40, minY: 40, maxY: 58 },
        'hand-right': { minX: 60, maxX: 80, minY: 40, maxY: 58 }
      },
      idealPositions: {
        knee:         { x: 50, y: 34 },
        foot:         { x: 52, y: 14 },
        'hand-left':  { x: 30, y: 48 },
        'hand-right': { x: 70, y: 48 }
      },
      why: {
        knee:         { en: 'A full vertical rise gives the heel enough travel distance to drop with real force.',
                        ar: 'الرفع العمودي الكامل بيدّي الكعب مسافة كفاية عشان ينزل بقوة حقيقية.' },
        foot:         { en: 'The foot must clear head height for the downward heel strike to be effective.',
                        ar: 'لازم القدم توصل فوق مستوى الراس عشان ضربة الكعب النازلة تبقى فعّالة.' },
        'hand-left':  { en: 'Keeping the guard up matters here too — you are momentarily off-balance during the rise.',
                        ar: 'الحراسة مهمة هنا عشان تحميك وإنت طالع لفوق.' },
        'hand-right': { en: 'Keeping the guard up matters here too — you are momentarily off-balance during the rise.',
                        ar: 'الحراسة مهمة هنا عشان تحميك وإنت طالع لفوق.' }
      }
    },
    bakchagi3: {
      controlPoints: ['knee', 'foot', 'hand-left', 'hand-right', 'pivot'],
      limits: {
        knee:         { minX: 28, maxX: 48, minY: 42, maxY: 68 },
        foot:         { minX: 18, maxX: 38, minY: 55, maxY: 78 },
        'hand-left':  { minX: 15, maxX: 35, minY: 28, maxY: 48 },
        'hand-right': { minX: 65, maxX: 85, minY: 32, maxY: 52 },
        pivot:        { minX: 55, maxX: 78, minY: 68, maxY: 88 }
      },
      idealPositions: {
        knee:         { x: 38, y: 52 },
        foot:         { x: 28, y: 64 },
        'hand-left':  { x: 25, y: 36 },
        'hand-right': { x: 75, y: 40 },
        pivot:        { x: 66, y: 78 }
      },
      why: {
        knee:         { en: 'Chambering the knee to chest height while turning side-on builds the momentum the strike depends on.',
                        ar: 'رفع الركبة لمستوى الصدر وإنت بتلف جنب هو اللي بيبني الزخم اللي الضربة معتمدة عليه.' },
        foot:         { en: 'A full straight-line leg extension delivers the heel/blade strike with maximum reach and power.',
                        ar: 'فرد الرجل على الآخر في خط مستقيم بيوصّل ضربة الكعب/الحافة لأقصى مدى وقوة.' },
        'hand-left':  { en: 'Guard must stay up while the body turns side-on to the target.',
                        ar: 'لازم الحراسة تفضل مرفوعة وإنت بتلف جسمك جنب ناحية الهدف.' },
        'hand-right': { en: 'Guard must stay up while the body turns side-on to the target.',
                        ar: 'لازم الحراسة تفضل مرفوعة وإنت بتلف جسمك جنب ناحية الهدف.' },
        pivot:        { en: 'The full 180° pivot of the standing foot is the real power source.',
                        ar: 'لفّة الارتكاز 180° كاملة هي مصدر القوة الحقيقي للركلة.' }
      }
    }
  };

  static JOINT_META = {
    knee: {
      label: { en: 'Knee', ar: 'الركبة' },
      hints: {
        up:    { en: 'Knee is too high ↓', ar: 'الركبة عالية أوي ↓' },
        down:  { en: 'Lift the knee higher ↑', ar: 'ارفع الركبة لفوق أكتر ↑' },
        left:  { en: 'Bring knee inward →', ar: 'دخّل الركبة لجوه →' },
        right: { en: 'Bring knee outward ←', ar: 'طلّع الركبة لبرّه ←' },
        great: { en: '✅ Knee — Perfect!', ar: '✅ الركبة — جامدة!' }
      }
    },
    foot: {
      label: { en: 'Foot', ar: 'القدم' },
      hints: {
        up:    { en: 'Lower the foot slightly ↓', ar: 'نزّل القدم شوية ↓' },
        down:  { en: 'Extend foot further ↑', ar: 'مدّ القدم لقدام أكتر ↑' },
        left:  { en: 'Push foot further forward →', ar: 'زق القدم لقدام →' },
        right: { en: 'Bring foot back ←', ar: 'رجّع القدم لورا ←' },
        great: { en: '✅ Foot — Perfect!', ar: '✅ القدم — جامدة!' }
      }
    },
    'hand-left': {
      label: { en: 'Left Hand', ar: 'الإيد الشمال' },
      hints: {
        up:    { en: 'Lower left hand ↓', ar: 'نزّل الإيد الشمال ↓' },
        down:  { en: 'Raise left hand ↑', ar: 'ارفع الإيد الشمال ↑' },
        left:  { en: 'Move left hand right →', ar: 'حرّك الشمال لليمين →' },
        right: { en: 'Move left hand left ←', ar: 'حرّك الشمال للشمال ←' },
        great: { en: '✅ Left hand — Perfect!', ar: '✅ الإيد الشمال — جامدة!' }
      }
    },
    'hand-right': {
      label: { en: 'Right Hand', ar: 'الإيد اليمين' },
      hints: {
        up:    { en: 'Lower right hand ↓', ar: 'نزّل الإيد اليمين ↓' },
        down:  { en: 'Raise right hand ↑', ar: 'ارفع الإيد اليمين ↑' },
        left:  { en: 'Move right hand right →', ar: 'حرّك اليمين لليمين →' },
        right: { en: 'Move right hand left ←', ar: 'حرّك اليمين للشمال ←' },
        great: { en: '✅ Right hand — Perfect!', ar: '✅ الإيد اليمين — جامدة!' }
      }
    },
    pivot: {
      label: { en: 'Pivot Foot', ar: 'رجل الارتكاز' },
      hints: {
        up:    { en: 'Rotate less ↓', ar: 'لفّ أقل ↓' },
        down:  { en: 'Rotate further toward 180° ↑', ar: 'لفّ أكتر لحد 180° ↑' },
        left:  { en: 'Shift pivot inward →', ar: 'دخّل الارتكاز لجوه →' },
        right: { en: 'Shift pivot outward ←', ar: 'طلّع الارتكاز لبرّه ←' },
        great: { en: '✅ Pivot — Perfect rotation!', ar: '✅ الارتكاز — دوران جامد!' }
      }
    }
  };

  static initialize(gameState) {
    this.gameState        = gameState;
    this.skillId          = gameState.currentSkill;
    this.accuracy         = 0;
    this.isDragging       = false;
    this.draggedElement   = null;
    this.draggedPart      = null;
    this.selectedCharacter= gameState.playerCharacter;

    const config = FormControlSystem.SKILL_FORM_CONFIG[this.skillId] || FormControlSystem.SKILL_FORM_CONFIG.apchagi;
    this.controlPoints    = [...config.controlPoints];
    this.keyboardActive   = false;
    this.keyboardStep     = 2;
    this.rewardPlayed     = false;
    // One free "show me" per attempt — see autoPosition() below for why.
    this.autoPositionUsed = false;

    const savedPositions = {};
    this.controlPoints.forEach(part => {
      const el = document.getElementById(`cp-${part}`);
      if (el && el.style.left) savedPositions[part] = { x: el.style.left, y: el.style.top };
    });
    this._savedPositions = Object.keys(savedPositions).length === this.controlPoints.length
      ? savedPositions : null;

    this.limits = config.limits;
    this.idealPositions = config.idealPositions;

    // Title/instructions were hard-coded to "Ap Chagi" regardless of which
    // skill's Form Control you were actually in — make them skill-specific.
    this.updateSkillHeader();

    setTimeout(() => {
      this.setupGame();
      this.updateAutoPositionBtn();
      this.setupKeyboardControls();
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

  // Fills in the screen's title/instructions with the ACTUAL current skill's
  // name instead of the hard-coded "Ap Chagi" text, and detaches them from
  // data-i18n so a language toggle can't stomp the skill-specific text back
  // to the generic default (toggleLanguage calls this again itself).
  static updateSkillHeader() {
    const skill = GameConfig.SKILLS[this.skillId] || GameConfig.SKILLS.apchagi;
    const ar = this.gameState.currentLanguage === 'ar';
    const skillName = ar ? skill.name.ar : skill.name.en;

    const titleEl = document.getElementById('form-control-title');
    if (titleEl) {
      titleEl.removeAttribute('data-i18n');
      titleEl.textContent = ar ? `🧍 التحكم في الشكل - اعمل ${skillName}` : `🧍 Form Control - Creating ${skillName}`;
    }
    const descEl = document.getElementById('form-control-desc');
    if (descEl) {
      descEl.removeAttribute('data-i18n');
      descEl.textContent = ar
        ? `اسحب نقط التحكم أو استخدم الأسهم عشان تعمل وضعية ${skillName} المظبوطة`
        : `Drag the control points or use arrow keys to create perfect ${skillName} form`;
    }

    // The 4 numbered coach instructions were hard-coded for Ap Chagi's straight
    // front kick ("extend foot straight forward") regardless of which skill was
    // active — wrong for Naeryeo Chagi's vertical rise or Bik Chagi's sideways
    // side kick. Replace them with skill-specific mechanics.
    const INSTRUCTION_SETS = {
      apchagi: {
        en: ['Lift the knee to chest height', 'Extend the leg straight forward, pivoting the standing foot ~90°', 'Keep the back straight and upright', 'Balance on the standing leg'],
        ar: ['ارفع ركبتك لحد صدرك', 'افرد رجلك لقدام على طول ولفّ القدم الواقفة حوالي ~90°', 'خلي ضهرك مفرود', 'اتوازن على الرجل الواقفة']
      },
      narochagi: {
        en: ['Raise the leg locked straight, as high as possible', 'Drop the heel straight down onto the target', 'Lean the torso back slightly (about 15°–25°) for balance', 'Land softly and reset your guard'],
        ar: ['ارفع رجلك مفرودة خالص لأعلى ما تقدر', 'نزّل الكعب على طول لتحت على الهدف', 'ميّل جسمك لورا شوية (حوالي 15° – 25°) عشان تتوازن', 'انزل بهدوء وارجع لوضعية الحراسة']
      },
      bakchagi3: {
        en: ['Turn the body side-on and lift the knee to chest height', 'Pivot the standing foot up to a full 180°', 'Extend the leg sideways in a straight line, striking with the heel/blade of the foot', 'Keep the guard up throughout the turn'],
        ar: ['لفّ جسمك جنب وارفع الركبة لمستوى الصدر', 'لفّ القدم الواقفة لحد 180° كاملة', 'افرد رجلك جنب في خط مستقيم، واضرب بالكعب أو بحرف القدم', 'خلي الحراسة مرفوعة طول اللفّة']
      }
    };
    const iSet = INSTRUCTION_SETS[this.skillId] || INSTRUCTION_SETS.apchagi;
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`instruction${i}-text`) || document.querySelector(`[data-i18n="instruction${i}"]`);
      if (el) {
        el.removeAttribute('data-i18n');
        el.textContent = ar ? iSet.ar[i - 1] : iSet.en[i - 1];
      }
    }
  }

  static setupGame() {
    this.removeExistingControlPoints();
    this.setupCharacterSelector();
    this.setupCharacterImages();
    this.createTargetZones();
    this.createControlPoints();
    this.createSkeletonOverlay();
    this.initializeControlPoints();
    this.setupEventListeners();
    this.updateDisplay();
    this.updateJointFeedbackPanel();
    this.updateSkeleton();
    this.syncSkeletonToggleUI();
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
            <div class="char-radio-thumb" style="background-image:url('assets/images/characters/boy_char/boy_idle.webp')"></div>
            <span>${ar ? 'الولد' : 'Boy'}</span>
          </label>
          <label class="char-radio-label">
            <input type="radio" name="form-character" value="girl" ${this.selectedCharacter==='girl'?'checked':''}>
            <div class="char-radio-thumb" style="background-image:url('assets/images/characters/girl_char/girl_idle.webp')"></div>
            <span>${ar ? 'البنت' : 'Girl'}</span>
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
        this.updateSkeleton();
      });
    });
  }

  static setupCharacterImages() {
    const frames = FormControlSystem.getKickFrames(this.skillId, this.selectedCharacter);
    const skill = GameConfig.SKILLS[this.skillId] || GameConfig.SKILLS.apchagi;
    const refEl  = document.getElementById('reference-character');
    const charEl = document.getElementById('form-character');
    if (refEl)  setBgWithFallback(refEl,  frames.extension || frames.ready, skill.phases[2]?.color);
    if (charEl) setBgWithFallback(charEl, frames.ready, skill.phases[0]?.color);
    this.paintCosmetics('ready');
  }

  // the belt colour / headband bought in the Star Shop, drawn over the photo
  static paintCosmetics(phaseKey, tries = 0) {
    const host = document.getElementById('form-character');
    if (!host || !window.Shop) return;
    this._cosPhase = phaseKey || this._cosPhase || 'ready';
    const want = this._cosPhase;
    const frames = FormControlSystem.getKickFrames(this.skillId, this.selectedCharacter);
    Shop.drawOnPhoto(host, { ch: this.selectedCharacter, skillId: this.skillId, frames, phaseKey: want })
      // the rig and the picture load in the background: if either wasn't ready
      // (or the picture on screen hadn't caught up yet) try again shortly,
      // otherwise the belt would silently never appear
      .then(ok => { if (ok === null && tries < 4 && this._cosPhase === want) setTimeout(() => this.paintCosmetics(want, tries + 1), 260); })
      .catch(() => {});
    if (!this._cosResize && window.ResizeObserver) {            // the stage scales with the phone
      this._cosResize = new ResizeObserver(() => this.paintCosmetics());
      this._cosResize.observe(host);
    }
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

  // إنشاء هيكل الـ SVG الإرشادي والحي
  static createSkeletonOverlay() {
    document.getElementById('form-skeleton-svg')?.remove();
    document.getElementById('knee-angle-badge')?.remove();

    const stage = document.getElementById('form-stage');
    if (!stage) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('id', 'form-skeleton-svg');
    svg.setAttribute('class', `form-skeleton-svg ${this.skeletonVisible ? '' : 'skel-hidden'}`);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    svg.innerHTML = `
      <!-- الطبقة الشبحية المستهدفة (Ghost Target) -->
      <g id="skel-ghost-layer">
        <line id="ghost-bone-spine" class="skel-ghost-bone" />
        <line id="ghost-bone-torso" class="skel-ghost-bone" />
        <line id="ghost-bone-clavicle-l" class="skel-ghost-bone" />
        <line id="ghost-bone-clavicle-r" class="skel-ghost-bone" />
        <line id="ghost-bone-arm-l" class="skel-ghost-bone" />
        <line id="ghost-bone-arm-r" class="skel-ghost-bone" />
        <line id="ghost-bone-thigh" class="skel-ghost-bone" />
        <line id="ghost-bone-shin" class="skel-ghost-bone" />
        <line id="ghost-bone-standing-thigh" class="skel-ghost-bone" />
        <line id="ghost-bone-standing-shin" class="skel-ghost-bone" />
        <circle id="ghost-joint-knee" r="2.2" class="skel-ghost-joint" />
        <circle id="ghost-joint-foot" r="2.2" class="skel-ghost-joint" />
        <circle id="ghost-joint-hand-l" r="2" class="skel-ghost-joint" />
        <circle id="ghost-joint-hand-r" r="2" class="skel-ghost-joint" />
      </g>

      <!-- طبقة عظام اللاعب الحية (Live Player Skeleton) -->
      <g id="skel-player-layer">
        <line id="skel-bone-spine" class="skel-bone skel-bone-core" />
        <line id="skel-bone-torso" class="skel-bone skel-bone-core" />
        <line id="skel-bone-clavicle-l" class="skel-bone" />
        <line id="skel-bone-clavicle-r" class="skel-bone" />
        <line id="skel-bone-arm-l" class="skel-bone" />
        <line id="skel-bone-arm-r" class="skel-bone" />
        <line id="skel-bone-pelvis-kicking" class="skel-bone" />
        <line id="skel-bone-thigh" class="skel-bone skel-bone-thigh" />
        <line id="skel-bone-shin" class="skel-bone skel-bone-shin" />
        <line id="skel-bone-pelvis-standing" class="skel-bone" />
        <line id="skel-bone-standing-thigh" class="skel-bone" />
        <line id="skel-bone-standing-shin" class="skel-bone" />

        <!-- مفاصل الهيكل العظمي -->
        <circle id="skel-joint-head" r="4.2" class="skel-head-joint" />
        <line id="skel-head-visor" class="skel-head-visor" />
        <circle id="skel-joint-neck" r="1.6" class="skel-joint" />
        <circle id="skel-joint-chest" r="2.4" class="skel-joint" />
        <circle id="skel-joint-shoulder-l" r="1.8" class="skel-joint" />
        <circle id="skel-joint-shoulder-r" r="1.8" class="skel-joint" />
        <circle id="skel-joint-pelvis" r="2.2" class="skel-joint" />
        <circle id="skel-joint-standing-knee" r="2" class="skel-joint" />
        <circle id="skel-joint-standing-foot" r="2.2" class="skel-joint" />
      </g>
    `;

    stage.appendChild(svg);

    // إضافة شارة قياس زاوية الركبة
    const badge = document.createElement('div');
    badge.id = 'knee-angle-badge';
    badge.className = `knee-angle-badge ${this.skeletonVisible ? '' : 'skel-hidden'}`;
    badge.innerHTML = `<span class="angle-icon">📐</span><span id="knee-angle-val">160°</span>`;
    stage.appendChild(badge);
  }

  static getJointColor(dist) {
    if (dist <= 1.5) return '#2a9d8f'; // متقن
    if (dist <= 6)   return '#e9c46a'; // قريب
    return '#e63946';                  // بعيد
  }

  // تحديث مسار العظام والزوايا لحظياً
  static updateSkeleton() {
    const anchors = FormControlSystem.SKELETON_ANCHORS[this.skillId] || FormControlSystem.SKELETON_ANCHORS.apchagi;
    const ideals  = this.idealPositions;

    const setLine = (id, x1, y1, x2, y2, color) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('x1', x1);
      el.setAttribute('y1', y1);
      el.setAttribute('x2', x2);
      el.setAttribute('y2', y2);
      if (color) {
        el.style.setProperty('--bone-color', color);
        el.style.stroke = color;
      }
    };

    const setCircle = (id, cx, cy, color) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('cx', cx);
      el.setAttribute('cy', cy);
      if (color) el.style.stroke = color;
    };

    // 1. رسم وتحديث الهيكل الشبحي الإرشادي (Target Ghost)
    setLine('ghost-bone-spine', anchors.neck.x, anchors.neck.y, anchors.chest.x, anchors.chest.y);
    setLine('ghost-bone-torso', anchors.chest.x, anchors.chest.y, anchors.pelvis.x, anchors.pelvis.y);
    setLine('ghost-bone-clavicle-l', anchors.chest.x, anchors.chest.y, anchors.leftShoulder.x, anchors.leftShoulder.y);
    setLine('ghost-bone-clavicle-r', anchors.chest.x, anchors.chest.y, anchors.rightShoulder.x, anchors.rightShoulder.y);
    setLine('ghost-bone-arm-l', anchors.leftShoulder.x, anchors.leftShoulder.y, ideals['hand-left'].x, ideals['hand-left'].y);
    setLine('ghost-bone-arm-r', anchors.rightShoulder.x, anchors.rightShoulder.y, ideals['hand-right'].x, ideals['hand-right'].y);
    setLine('ghost-bone-thigh', anchors.kickingHip.x, anchors.kickingHip.y, ideals.knee.x, ideals.knee.y);
    setLine('ghost-bone-shin', ideals.knee.x, ideals.knee.y, ideals.foot.x, ideals.foot.y);
    setLine('ghost-bone-standing-thigh', anchors.standingHip.x, anchors.standingHip.y, anchors.standingKnee.x, anchors.standingKnee.y);

    const ghostStandingEnd = this.skillId === 'bakchagi3' && ideals.pivot ? ideals.pivot : anchors.standingFoot;
    setLine('ghost-bone-standing-shin', anchors.standingKnee.x, anchors.standingKnee.y, ghostStandingEnd.x, ghostStandingEnd.y);

    setCircle('ghost-joint-knee', ideals.knee.x, ideals.knee.y);
    setCircle('ghost-joint-foot', ideals.foot.x, ideals.foot.y);
    setCircle('ghost-joint-hand-l', ideals['hand-left'].x, ideals['hand-left'].y);
    setCircle('ghost-joint-hand-r', ideals['hand-right'].x, ideals['hand-right'].y);

    // 2. إحداثيات نقاط اللاعب الحالية
    const getPos = (id, fallback) => {
      const el = document.getElementById(`cp-${id}`);
      if (!el) return fallback;
      const x = parseFloat(el.style.left);
      const y = parseFloat(el.style.top);
      return { x: isNaN(x) ? fallback.x : x, y: isNaN(y) ? fallback.y : y };
    };

    const curKnee  = getPos('knee', ideals.knee);
    const curFoot  = getPos('foot', ideals.foot);
    const curHandL = getPos('hand-left', ideals['hand-left']);
    const curHandR = getPos('hand-right', ideals['hand-right']);
    const curPivot = this.skillId === 'bakchagi3' ? getPos('pivot', ideals.pivot || anchors.standingFoot) : anchors.standingFoot;

    // حساب مسافات الدقة لتلوين العظام
    const distKnee  = Math.hypot(curKnee.x - ideals.knee.x, curKnee.y - ideals.knee.y);
    const distFoot  = Math.hypot(curFoot.x - ideals.foot.x, curFoot.y - ideals.foot.y);
    const distHandL = Math.hypot(curHandL.x - ideals['hand-left'].x, curHandL.y - ideals['hand-left'].y);
    const distHandR = Math.hypot(curHandR.x - ideals['hand-right'].x, curHandR.y - ideals['hand-right'].y);

    const colorKnee  = FormControlSystem.getJointColor(distKnee);
    const colorFoot  = FormControlSystem.getJointColor(distFoot);
    const colorHandL = FormControlSystem.getJointColor(distHandL);
    const colorHandR = FormControlSystem.getJointColor(distHandR);
    const colorCore  = this.accuracy >= 85 ? '#2a9d8f' : (this.accuracy >= 60 ? '#e9c46a' : '#e63946');

    // 3. رسم وتحديث هيكل اللاعب الحي
    setLine('skel-bone-spine', anchors.neck.x, anchors.neck.y, anchors.chest.x, anchors.chest.y, colorCore);
    setLine('skel-bone-torso', anchors.chest.x, anchors.chest.y, anchors.pelvis.x, anchors.pelvis.y, colorCore);
    setLine('skel-bone-clavicle-l', anchors.chest.x, anchors.chest.y, anchors.leftShoulder.x, anchors.leftShoulder.y, colorHandL);
    setLine('skel-bone-clavicle-r', anchors.chest.x, anchors.chest.y, anchors.rightShoulder.x, anchors.rightShoulder.y, colorHandR);
    setLine('skel-bone-arm-l', anchors.leftShoulder.x, anchors.leftShoulder.y, curHandL.x, curHandL.y, colorHandL);
    setLine('skel-bone-arm-r', anchors.rightShoulder.x, anchors.rightShoulder.y, curHandR.x, curHandR.y, colorHandR);

    // الساق الضاربة
    setLine('skel-bone-pelvis-kicking', anchors.pelvis.x, anchors.pelvis.y, anchors.kickingHip.x, anchors.kickingHip.y, colorKnee);
    setLine('skel-bone-thigh', anchors.kickingHip.x, anchors.kickingHip.y, curKnee.x, curKnee.y, colorKnee);
    setLine('skel-bone-shin', curKnee.x, curKnee.y, curFoot.x, curFoot.y, colorFoot);

    // الساق الواقفة
    const standingColor = this.skillId === 'bakchagi3' ? FormControlSystem.getJointColor(Math.hypot(curPivot.x - (ideals.pivot?.x||curPivot.x), curPivot.y - (ideals.pivot?.y||curPivot.y))) : '#2a9d8f';
    setLine('skel-bone-pelvis-standing', anchors.pelvis.x, anchors.pelvis.y, anchors.standingHip.x, anchors.standingHip.y, standingColor);
    setLine('skel-bone-standing-thigh', anchors.standingHip.x, anchors.standingHip.y, anchors.standingKnee.x, anchors.standingKnee.y, standingColor);
    setLine('skel-bone-standing-shin', anchors.standingKnee.x, anchors.standingKnee.y, curPivot.x, curPivot.y, standingColor);

    // المفاصل
    setCircle('skel-joint-head', anchors.head.x, anchors.head.y);
    setLine('skel-head-visor', anchors.head.x - 3.2, anchors.head.y, anchors.head.x + 3.2, anchors.head.y);
    setCircle('skel-joint-neck', anchors.neck.x, anchors.neck.y, colorCore);
    setCircle('skel-joint-chest', anchors.chest.x, anchors.chest.y, colorCore);
    setCircle('skel-joint-shoulder-l', anchors.leftShoulder.x, anchors.leftShoulder.y, colorHandL);
    setCircle('skel-joint-shoulder-r', anchors.rightShoulder.x, anchors.rightShoulder.y, colorHandR);
    setCircle('skel-joint-pelvis', anchors.pelvis.x, anchors.pelvis.y, colorCore);
    setCircle('skel-joint-standing-knee', anchors.standingKnee.x, anchors.standingKnee.y, standingColor);
    setCircle('skel-joint-standing-foot', curPivot.x, curPivot.y, standingColor);

    // 4. حساب زاوية مفصل الركبة الحركية بدقة
    const v1x = anchors.kickingHip.x - curKnee.x;
    const v1y = anchors.kickingHip.y - curKnee.y;
    const v2x = curFoot.x - curKnee.x;
    const v2y = curFoot.y - curKnee.y;
    const len1 = Math.hypot(v1x, v1y);
    const len2 = Math.hypot(v2x, v2y);
    let kneeAngle = 0;
    if (len1 > 0 && len2 > 0) {
      const dot = (v1x * v2x) + (v1y * v2y);
      const cosVal = Math.max(-1, Math.min(1, dot / (len1 * len2)));
      kneeAngle = Math.round(Math.acos(cosVal) * (180 / Math.PI));
    }

    const badge = document.getElementById('knee-angle-badge');
    const badgeVal = document.getElementById('knee-angle-val');
    if (badge && badgeVal) {
      badge.style.left = `${curKnee.x}%`;
      badge.style.top  = `${curKnee.y}%`;
      badgeVal.textContent = `${kneeAngle}°`;
      badge.style.borderColor = colorKnee;
      badge.style.boxShadow = `0 4px 15px rgba(0,0,0,0.6), 0 0 12px ${colorKnee}`;
    }
  }

  static toggleSkeleton() {
    this.skeletonVisible = !this.skeletonVisible;
    this.syncSkeletonToggleUI();
    this.gameState?.playSound('click');
  }

  // Applies the current skeletonVisible state (and current language) to the
  // toggle button + overlays. Shared by toggleSkeleton() AND setupGame() so
  // the button shows the correct ON/OFF label and language on first load
  // instead of the raw hard-coded Arabic placeholder text from the HTML.
  static syncSkeletonToggleUI() {
    const svg   = document.getElementById('form-skeleton-svg');
    const badge = document.getElementById('knee-angle-badge');
    const btn   = document.getElementById('toggle-skeleton-btn');
    const txt   = document.getElementById('toggle-skel-text');
    const ar    = this.gameState?.currentLanguage === 'ar';

    if (svg)   svg.classList.toggle('skel-hidden', !this.skeletonVisible);
    if (badge) badge.classList.toggle('skel-hidden', !this.skeletonVisible);
    if (btn)   btn.classList.toggle('is-inactive', !this.skeletonVisible);

    if (txt) {
      txt.textContent = this.skeletonVisible
        ? (ar ? 'الهيكل: شغّال' : 'Skeleton: ON')
        : (ar ? 'الهيكل: مقفول' : 'Skeleton: OFF');
    }
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
    this.updateSkeleton();
    this.calculateAccuracy();
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
    let html = `<h4 style="color:var(--primary-color);margin-bottom:8px;">${ar ? '📍 إرشادات المفاصل والهيكل:' : '📍 Joint & Skeleton Guidance:'}</h4>`;

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

      let hint, color, why = '';
      if (dist <= tolerance) {
        hint  = meta.hints.great[ar ? 'ar' : 'en'];
        color = '#2a9d8f';
        const config  = FormControlSystem.SKILL_FORM_CONFIG[this.skillId] || FormControlSystem.SKILL_FORM_CONFIG.apchagi;
        const whyText = config.why?.[part]?.[ar ? 'ar' : 'en'];
        if (whyText) why = `<div class="joint-why">🎯 ${whyText}</div>`;
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
                 ${why}
               </div>`;
    });

    panel.innerHTML = html;
  }

  // Everything registered here is tied to one AbortController, so calling
  // setupEventListeners() again (every visit to this screen) replaces the
  // listeners instead of stacking duplicates — previously Reset / Check /
  // Auto-position gained an extra click handler on every visit, so "Check
  // Form" could run 2, 3, 4… times per tap.
  static teardownListeners() {
    if (FormControlSystem._fcAbort) { FormControlSystem._fcAbort.abort(); FormControlSystem._fcAbort = null; }
    if (FormControlSystem.isDragging) FormControlSystem.stopDrag();
  }

  static setupEventListeners() {
    FormControlSystem.teardownListeners();
    const { signal } = (FormControlSystem._fcAbort = new AbortController());

    // Kept for backward compatibility with code that references them.
    FormControlSystem._dragMoveHandler = (e) => this.drag(e);
    FormControlSystem._dragStopHandler = (e) => this.stopDrag(e);

    document.querySelectorAll('.control-point').forEach(point => {
      point.addEventListener('mousedown',  (e) => this.startDrag(e), { signal });
      point.addEventListener('touchstart', (e) => { e.preventDefault(); this.startDrag(e); }, { passive: false, signal });
    });
    // NOTE: move/up listeners are attached in startDrag() only for the
    // duration of a drag. A permanent non-passive touchmove on document makes
    // the browser wait on JS before every scroll, on every screen.

    document.getElementById('reset-form-btn')?.addEventListener('click',    (e) => { e.preventDefault(); this.resetForm(); }, { signal });
    document.getElementById('check-form-btn')?.addEventListener('click',    (e) => { e.preventDefault(); this.checkForm(); }, { signal });
    document.getElementById('auto-position-btn')?.addEventListener('click', (e) => { e.preventDefault(); this.autoPosition(); }, { signal });

    // ربط زر الهيكل العظمي
    const skelBtn = document.getElementById('toggle-skeleton-btn');
    if (skelBtn && !skelBtn._attached) {
      skelBtn._attached = true;
      skelBtn.addEventListener('click', (e) => { e.preventDefault(); this.toggleSkeleton(); });
    }
  }

  static setupKeyboardControls() {
    const instructionsDiv = document.querySelector('.game-instructions');
    if (instructionsDiv && !instructionsDiv.querySelector('.keyboard-controls')) {
      const ar = this.gameState.currentLanguage === 'ar';
      instructionsDiv.insertAdjacentHTML('beforeend', `
        <div class="keyboard-controls">
          <p style="margin:0;font-size:0.85rem;">
            <i class="fas fa-keyboard"></i>
            <strong>${ar ? 'الكيبورد:' : 'Keyboard:'}</strong>
            ${ar ? 'دوس على نقطة ← وحرّكها بالأسهم' : 'Click a point → Arrow keys to move it'}
          </p>
        </div>
      `);
    }

    if (!FormControlSystem._keydownAttached) {
      FormControlSystem._keydownAttached = true;
      document.addEventListener('keydown', (e) => {
        if (!FormControlSystem.keyboardActive || !FormControlSystem.draggedPart) return;
        if (e.key === 'Escape') {
          document.querySelectorAll('.control-point').forEach(q => q.classList.remove('keyboard-selected'));
          FormControlSystem.keyboardActive = false;
          FormControlSystem.draggedPart = null;
          return;
        }
        // Only arrow keys belong to the joint — previously preventDefault ran
        // for EVERY key, so Tab / Enter / Space stopped working while a point
        // was selected (a keyboard trap).
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
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
        FormControlSystem.calculateAccuracy();   // also refreshes colours + skeleton
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

    if (!FormControlSystem._docClickAttached) {
      FormControlSystem._docClickAttached = true;
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.control-point')) {
          document.querySelectorAll('.control-point').forEach(q => q.classList.remove('keyboard-selected'));
          FormControlSystem.keyboardActive = false;
          if (!FormControlSystem.isDragging) FormControlSystem.draggedPart = null;
        }
      });
    }
  }

  static startDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isDragging) return;               // ignore a second finger
    this.isDragging     = true;
    this.draggedElement = event.target.closest('.control-point') || event.target;
    this.draggedPart    = this.draggedElement.dataset.part;
    this.draggedElement.classList.add('dragging');
    this.keyboardActive = false;
    this._touchId       = event.changedTouches ? event.changedTouches[0].identifier : null;
    this._stageRect     = document.getElementById('form-stage')?.getBoundingClientRect() || null;
    this.gameState.playSound('click');

    // Listeners that only live for this one drag.
    const { signal } = (this._dragAbort = new AbortController());
    const move = (e) => this.drag(e);
    const end  = (e) => this.stopDrag(e);
    document.addEventListener('mousemove',   move, { signal });
    document.addEventListener('touchmove',   move, { passive: false, signal });
    document.addEventListener('mouseup',     end,  { signal });
    document.addEventListener('touchend',    end,  { signal });
    // touchcancel (incoming call, OS gesture, palm rejection…) used to leave
    // the joint stuck in its enlarged "dragging" state.
    document.addEventListener('touchcancel', end,  { signal });
    window.addEventListener('blur',          end,  { signal });
  }

  static _pointerFromEvent(event) {
    if (event.touches) {
      const list = Array.from(event.touches);
      const t = list.find(t => t.identifier === this._touchId) || list[0];
      return t ? { x: t.clientX, y: t.clientY } : null;
    }
    return { x: event.clientX, y: event.clientY };
  }

  // Pointer events can fire 120–240×/s on modern screens, and each one
  // rebuilt the feedback panel's innerHTML, the skeleton and the HUD. Now we
  // only record the latest position and do the heavy work once per frame.
  static drag(event) {
    if (!this.isDragging || !this.draggedElement || !this.draggedPart) return;
    event.preventDefault();
    const pt = this._pointerFromEvent(event);
    if (!pt) return;
    this._pendingPointer = pt;
    if (!this._dragRaf) this._dragRaf = requestAnimationFrame(() => this._applyDrag());
  }

  static _applyDrag() {
    this._dragRaf = null;
    const pt = this._pendingPointer;
    this._pendingPointer = null;
    if (!pt || !this.draggedElement || !this.draggedPart) return;
    const rect = this._stageRect || document.getElementById('form-stage').getBoundingClientRect();
    let x = this.applyLimitX(this.draggedPart, ((pt.x - rect.left) / rect.width)  * 100);
    let y = this.applyLimitY(this.draggedPart, ((pt.y - rect.top)  / rect.height) * 100);

    // Magnetic snap: once the joint gets close enough to its ideal spot,
    // pull it the rest of the way in — small fingers rarely land exactly on
    // target on a touchscreen, so this removes that frustration for kids.
    const snap = this.checkMagneticSnap(this.draggedPart, x, y);
    x = snap.x; y = snap.y;
    if (snap.snapped && this.draggedElement.dataset.wasSnapped !== 'true') {
      this.draggedElement.dataset.wasSnapped = 'true';
      const ar = this.gameState.currentLanguage === 'ar';
      this.spawnComicPopup(ar ? '🔒 اتقفلت!' : '🔒 Locked!', x, Math.max(2, y - 6));
      this.gameState.playSound('success');
      if (navigator.vibrate && !prefersReducedMotion()) navigator.vibrate(15);   // tiny haptic "click"
    } else if (!snap.snapped) {
      this.draggedElement.dataset.wasSnapped = 'false';
    }

    this.draggedElement.style.left = `${x}%`;
    this.draggedElement.style.top  = `${y}%`;
    this.calculateAccuracy();   // also updates point colours, skeleton, HUD
  }

  static stopDrag() {
    // Apply the final queued position so a quick flick isn't lost.
    if (this._dragRaf) { cancelAnimationFrame(this._dragRaf); this._dragRaf = null; this._applyDrag(); }
    if (this._dragAbort) { this._dragAbort.abort(); this._dragAbort = null; }
    if (this.draggedElement) {
      this.draggedElement.classList.remove('dragging');
      // (No inline transform here any more — an inline style permanently
      // overrode the CSS states such as .keyboard-selected.)
      this.draggedElement.style.transform = '';
    }
    this.isDragging = false;
    this.draggedElement = null;
    this.draggedPart = null;
    this._stageRect = null;
    this._touchId = null;
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
    const frames = FormControlSystem.getKickFrames(this.skillId, this.selectedCharacter);

    const kneeLimit = this.limits.knee || { minY: 42, maxY: 68 };
    const range = kneeLimit.maxY - kneeLimit.minY || 26;
    const t = (kneeY - kneeLimit.minY) / range;

    let frame, colorIdx, key;
    if      (t <= 0.2)  { frame = frames.ready;               colorIdx = 0; key = 'ready'; }
    else if (t <= 0.45) { frame = frames.chamber;             colorIdx = 1; key = 'chamber'; }
    else if (t <= 0.7)  { frame = frames.extension;           colorIdx = 2; key = 'extension'; }
    else if (t <= 0.9)  { frame = frames.recoil || frames.return; colorIdx = 3; key = frames.recoil ? 'recoil' : 'return'; }
    else                { frame = frames.return;              colorIdx = 4; key = 'return'; }
    const skill = GameConfig.SKILLS[this.skillId] || GameConfig.SKILLS.apchagi;
    setBgWithFallback(character, frame, skill.phases[colorIdx]?.color);
    if (key !== this._cosPhase) this.paintCosmetics(key);
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
    this.updateSkeleton();
    this.updateKidsHUD();

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
      ar ? '🔥 برافو! الشكل جامد! دوس "تحقق من الشكل" عشان تخلّص.'
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
    this.autoPositionUsed = false;   // a fresh attempt earns a fresh hint
    this.updateAutoPositionBtn();
    this.initializeControlPoints();
    this.calculateAccuracy();
    this.updateSkeleton();
    this.gameState.playSound('click');
    this.showFeedback(this.gameState.currentLanguage === 'ar' ? '🔄 رجّعنا كل حاجة من الأول' : '🔄 Reset complete', 'info');
  }

  // "Auto Position" used to be a free, unlimited "I win" button: one click
  // solved the pose perfectly, with nothing stopping a child from spamming
  // it and Check Form every time instead of ever dragging a joint — which
  // defeated the entire point of the exercise. It's now a one-time-per-attempt
  // demonstration: the child can see what perfect form looks like once, then
  // has to reproduce it themselves. Reset (or a fresh visit) earns another.
  static autoPosition() {
    const ar = this.gameState.currentLanguage === 'ar';
    if (this.autoPositionUsed) {
      this.gameState.playSound('error');
      this.showFeedback(
        ar ? '💪 إنت استخدمت التلميح خلاص — جرّب تحرك المفاصل بنفسك دلوقتي!'
           : "💪 You've already used the hint — try moving the joints yourself now!",
        'error'
      );
      return;
    }
    this.autoPositionUsed = true;
    this.updateAutoPositionBtn();
    Object.entries(this.idealPositions).forEach(([part, pos]) => {
      const p = document.getElementById(`cp-${part}`);
      if (p) { p.style.left = `${pos.x}%`; p.style.top = `${pos.y}%`; }
    });
    this.calculateAccuracy();
    this.updateSkeleton();
    this.gameState.playSound('success');
    this.showFeedback(
      ar ? '✨ دي الوضعية المظبوطة — حاول تحفظ شكلها! دوس Reset لو عايز تتمرن من الأول.'
         : "✨ That's perfect form — try to remember it! Press Reset if you want to practice from scratch.",
      'success'
    );
  }

  static updateAutoPositionBtn() {
    const btn = document.getElementById('auto-position-btn');
    if (!btn) return;
    btn.classList.toggle('btn-used-once', this.autoPositionUsed);
    const ar = this.gameState.currentLanguage === 'ar';
    const label = btn.querySelector('span');
    if (label) label.textContent = this.autoPositionUsed
      ? (ar ? 'التلميح اتاستخدم' : 'Hint used')
      : (ar ? 'الوضعية المظبوطة' : 'Auto Position');
  }

  static checkForm() {
    this.calculateAccuracy();
    const ar = this.gameState.currentLanguage === 'ar';
    if (this.accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      this.gameState.playSound('win');
      this.showFeedback(`🎉 ${ar ? 'برافو! دقتك' : 'Excellent! Accuracy:'} ${this.accuracy}%`, 'success');
      const isFirstClear = this.gameState.completeGame('form-control', this.accuracy);
      screenTimeout(() => WinnerSystem.show('form-control', this.accuracy, this.gameState, isFirstClear), 1500);
    } else {
      this.gameState.playSound('error');
      this.showFeedback(`⚠️ ${ar ? 'دقتك' : 'Accuracy:'} ${this.accuracy}% — ${ar ? 'امشي على الإرشادات اللي فوق' : 'Follow the guidance above'}`, 'error');
      this.gameState.trackFailure(this.accuracy, 'form-control');
    }
  }

  static showFeedback(message, type) {
    const div = document.getElementById('form-feedback');
    if (!div) return;
    div.textContent  = message;
    div.className    = `feedback-message ${type}`;
    div.style.display = 'block';
    setTimeout(() => { div.style.display = 'none'; }, 3500);
    // on a phone that box lives far below the fold — say it where the child is looking
    try { window.TKD?.toast(message, type === 'success' ? 'success' : 'warning'); } catch (e) {}
  }
}

