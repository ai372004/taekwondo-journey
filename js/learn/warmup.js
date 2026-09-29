// =====================================================================
// WARM UP SYSTEM — 7 exercises, each shown as a real demo clip from
// assets/videos/warmup/, a rest screen with a preview of what's next and a
// per-kick "key exercise" badge. Every exercise here has a real clip — one
// that didn't (Torso Twists) was dropped rather than fall back to a drawing,
// since the child asked for videos only, not hand-drawn animation.
// =====================================================================
class WarmupSystem {

  // Same 7 exercises, same order, for all three kicks — every one has a real
  // clip in assets/videos/warmup/.
  //   side: true   → a "switch sides" cue is shown half-way through
  //   key: [...]   → kicks this exercise matters most for (gets a ⭐ badge)
  static EXERCISES() {
    return [
      {
        id: 'jumping_jacks', icon: '🤸', duration: 15, color: '#4cc9f0', type: 'cardio',
        nameEn: 'Jumping Jacks', nameAr: 'تمرين القفز (جامبينج جاك)',
        video: 'assets/videos/warmup/jumping_jacks.mp4',
        descEn: 'Jump your feet apart while your arms swing up over your head, then jump back together. Keep a steady rhythm.',
        descAr: 'اقفز وافتح رجليك وارفع دراعاتك فوق راسك، وبعدين اقفز واقفلهم تاني. خلّي الإيقاع ثابت.',
        tipEn: 'This wakes up your heart and warms every muscle before you stretch.',
        tipAr: 'ده بيصحّي قلبك ويدفّي كل عضلات جسمك قبل الإطالة.',
        key: []
      },
      {
        id: 'forward_lunge', icon: '🏃', duration: 15, color: '#2a9d8f', type: 'strength',
        nameEn: 'Forward Lunges', nameAr: 'لانجز لقدّام',
        video: 'assets/videos/warmup/forward_lunge.mp4',
        descEn: 'Step one foot forward and bend both knees, then push back up and switch legs. Hands on your hips, back tall.',
        descAr: 'اخطي خطوة لقدام وانزل بركبتيك الاتنين، وبعدين اطلع وبدّل رجلك. إيديك على وسطك وظهرك مفرود.',
        tipEn: 'Builds the strong standing leg and balance that holds you up while you kick.',
        tipAr: 'بيقوّي رجل الارتكاز والتوازن اللي بيشيلوك وإنت بتركل.',
        key: ['apchagi']
      },
      {
        id: 'lateral_lunge', icon: '🦵', duration: 15, color: '#f4a261', type: 'mobility',
        nameEn: 'Side Lunge Shifts', nameAr: 'لانجز على الجنب',
        video: 'assets/videos/warmup/lateral_lunge.mp4',
        descEn: 'Feet very wide. Sink down over one bent knee while the other leg stays straight, then slide across to the other side.',
        descAr: 'افتح رجليك على الآخر. انزل على ركبة مثنية والرجل التانية مفرودة، وبعدين اتنقل للناحية التانية.',
        tipEn: 'Opens the inner thighs and hips — you need that to turn side-on for a side kick.',
        tipAr: 'بيفتح الفخذ من جوه والوركين — ودي حاجة مهمة عشان تلف بجنبك في الركلة الجانبية.',
        key: ['bakchagi3']
      },
      {
        id: 'straddle_fold', icon: '🙇', duration: 20, color: '#ff6b35', type: 'stretch',
        nameEn: 'Wide-Leg Forward Fold', nameAr: 'انحناء لقدام ورجليك مفتوحة',
        video: 'assets/videos/warmup/straddle_fold.mp4',
        descEn: 'Stand with your feet wide apart, fold forward from the hips and place your hands on the floor. Breathe and hold.',
        descAr: 'اقف وافتح رجليك، وانزل لقدام من وسطك وحط إيديك على الأرض. خد نفسك واثبت كده.',
        tipEn: 'Stretches the back of your legs and inner thighs for higher, cleaner kicks.',
        tipAr: 'بيطوّل عضلات ورا الرجل والفخذ من جوه عشان ركلتك تبقى أعلى وأنضف.',
        key: ['narochagi']
      },
      {
        id: 'straddle_side_reach', icon: '🧘', duration: 20, color: '#9b5de5', type: 'stretch',
        nameEn: 'Seated Straddle Reach', nameAr: 'إطالة جانبية وإنت قاعد',
        video: 'assets/videos/warmup/straddle_side_reach.mp4',
        descEn: 'Sit with your legs open wide. Reach both hands toward one foot, come back to the middle, then reach to the other foot.',
        descAr: 'اقعد ورجليك مفتوحة على الآخر. مد إيديك الاتنين ناحية رجل، ارجع للنص، وبعدين للرجل التانية.',
        tipEn: 'Keep both legs straight and your chest open — this loosens the side of the hip.',
        tipAr: 'خلي رجليك مفرودة وصدرك مفتوح — ده بيفكّ جنب الورك.',
        key: ['bakchagi3', 'narochagi']
      },
      {
        id: 'single_leg_hamstring', icon: '🦶', duration: 20, color: '#43aa8b', type: 'stretch', side: true,
        nameEn: 'Single-Leg Hamstring Stretch', nameAr: 'إطالة العضلة اللي ورا الفخذ برجل واحدة',
        video: 'assets/videos/warmup/single_leg_hamstring.mp4',
        descEn: 'Sit with one leg straight and the other foot tucked in. Reach for the toes of the straight leg. Switch legs half-way.',
        descAr: 'اقعد برجل مفرودة والتانية مثنية لجوه. امسك صوابع الرجل المفرودة. وفي النص بدّل رجلك.',
        tipEn: 'Reach with a long, straight back — tight hamstrings stop your leg from rising high.',
        tipAr: 'اتمد لقدام وظهرك مفرود — العضلة اللي ورا الفخذ لو مشدودة بتمنع رجلك تطلع لفوق.',
        key: ['narochagi', 'apchagi']
      },
      {
        id: 'double_leg_hamstring', icon: '🧎', duration: 20, color: '#3a86ff', type: 'stretch',
        nameEn: 'Seated Forward Fold', nameAr: 'انحناء لقدام وإنت قاعد',
        video: 'assets/videos/warmup/double_leg_hamstring.mp4',
        descEn: 'Sit with both legs straight together and reach forward to hold your feet. Relax and breathe slowly.',
        descAr: 'اقعد ورجليك الاتنين مفرودين ولازقين في بعض، وامسك رجليك. ريّح جسمك وخد نفسك بهدوء.',
        tipEn: 'A calm finisher — your legs are now warm and ready to kick.',
        tipAr: 'ختام هادي — رجليك دلوقتي دافية وجاهزة تركل.',
        key: ['narochagi']
      }
    ];
  }

  static REST_SECONDS = 6;
  static RECENT_WARMUP_MS = 3 * 60 * 60 * 1000;   // a warm-up counts for every kick for 3 hours
  static CIRCUMFERENCE = 2 * Math.PI * 52;

  static get ar() { return this.gameState?.currentLanguage === 'ar'; }
  static $(id) { return document.getElementById(id); }
  static setText(id, text) { const el = this.$(id); if (el) el.textContent = text; }

  static initialize(gameState) {
    this.gameState  = gameState;
    this.skillId    = gameState.currentSkill;
    this.stopTimer();
    this.stopRest();
    this.exercises  = WarmupSystem.EXERCISES();
    this.currentIdx = 0;
    this.timeLeft   = 0;
    this.isPaused   = false;
    this.inRest     = false;
    this.completedIds = new Set();
    this.startedAt  = Date.now();

    this.localise();
    this.buildDots();
    this.gameState.createCharacterVisual('warmup-coach-badge', 'coach', 'IDLE');

    const done = this.$('warmup-complete');
    if (done) done.hidden = true;
    const card = this.$('warmup-card');
    if (card) card.hidden = false;

    this.setupControls();
    this.loadExercise(0);
  }

  static localise() {
    const ar = this.ar;
    const skill = GameConfig.SKILLS[this.skillId] || GameConfig.SKILLS.apchagi;
    this.setText('wu2-title', ar ? '🔥 يلا نعمل إحماء!' : '🔥 Warm Up Time!');
    this.setText('wu2-subtitle', ar ? '٨ تمارين قصيرة تجهّز جسمك قبل التمرين' : '8 short exercises to get your body ready');
    this.setText('wu2-kick-chip', ar ? `🥋 بنجهّز لـ ${skill.name.ar}` : `🥋 Getting ready for ${skill.name.en}`);
    this.setText('warmup-energy-label', ar ? '⚡ جاهزيتك' : '⚡ Readiness');
    this.setText('warmup-timer-label', ar ? 'ثانية' : 'sec');
    this.setText('warmup-next-label', ar ? 'عدّي' : 'Skip');
    this.setText('wu2-rest-title', ar ? 'استراحة صغيرة' : 'Quick rest');
    this.setText('wu2-rest-next-label', ar ? 'اللي جاي:' : 'Next up:');
    this.setText('wu2-rest-skip-label', ar ? 'يلا نبدأ' : "I'm ready");
    this.setText('warmup-go-learn', ar ? 'يلا نتعلم 🎓' : 'Start Learning 🎓');
    this.setText('warmup-go-repeat', ar ? 'إحماء تاني 🔁' : 'Repeat Warm Up 🔁');
    this.setText('warmup-go-home', ar ? 'الرئيسية 🏠' : 'Home 🏠');
    this.$('warmup-exit-btn')?.setAttribute('aria-label', ar ? 'خروج' : 'Exit');
    this.syncPauseBtn();
  }

  static buildDots() {
    const wrap = this.$('warmup-dots');
    if (!wrap) return;
    const ar = this.ar;
    wrap.innerHTML = this.exercises.map((ex, i) => `
      <li class="wu2-step" id="wdot-${i}" data-idx="${i}" role="button" tabindex="0" title="${ar ? ex.nameAr : ex.nameEn}" aria-label="${i + 1}. ${ar ? ex.nameAr : ex.nameEn}">
        <span class="wu2-step-ico">${ex.icon}</span><span class="wu2-step-num">${i + 1}</span>
      </li>`).join('');
  }

  static updateDots(idx) {
    this.exercises.forEach((ex, i) => {
      const dot = this.$(`wdot-${i}`);
      if (!dot) return;
      const done = this.completedIds.has(ex.id);
      dot.classList.toggle('is-done', done);
      dot.classList.toggle('is-skipped', !done && i < idx);
      dot.classList.toggle('is-active', i === idx);
    });
    const pct = Math.round((Math.min(idx, this.exercises.length) / this.exercises.length) * 100);
    const fill = this.$('warmup-energy-fill');
    if (fill) fill.style.width = `${pct}%`;
    this.setText('warmup-energy-pct', `${pct}%`);
  }

  // Shows the filmed clip when the exercise has one, otherwise the drawn
  // demo. Any playback error (missing file, codec) falls back to the drawing.
  static showMedia(ex) {
    const video = this.$('warmup-video');
    const drawn = this.$('warmup-character');
    const tag   = this.$('wu2-media-tag');
    const ar = this.ar;
    const useDrawing = () => {
      if (video) { video.classList.remove('is-on'); video.pause(); }
      if (drawn) {
        drawn.innerHTML = WarmupSystem.SVG(ex.id, ex.color);
        drawn.classList.add('is-on');
        drawn.classList.toggle('is-paused', this.isPaused);
      }
      if (tag) tag.textContent = ar ? '✏️ شرح متحرك' : '✏️ Animated demo';
    };
    if (!ex.video || !video) { useDrawing(); return; }

    video.onerror = () => { if (this.exercises[this.currentIdx] === ex) useDrawing(); };
    const reveal = () => {
      video.classList.add('is-on');
      if (drawn) { drawn.classList.remove('is-on'); drawn.innerHTML = ''; }
    };
    if (video.dataset.src !== ex.video) {
      video.dataset.src = ex.video;
      video.src = ex.video;
      video.load();
      video.onloadeddata = reveal;
      // keep whatever is on screen until the new clip has a frame
    } else {
      try { video.currentTime = 0; } catch (e) {}   // every exercise starts its clip from the top
      if (video.readyState >= 2) reveal(); else video.onloadeddata = reveal;
    }
    if (!this.isPaused && !this.inRest) video.play().catch(() => {});
  }

  // Fills the info column (name, description, tip, key badge, counter) for
  // one exercise — used both when it starts and during the rest before it.
  static paintInfo(idx) {
    const ex = this.exercises[idx];
    if (!ex) return;
    const ar = this.ar;
    this.setText('warmup-ex-icon', ex.icon);
    this.setText('warmup-ex-name', ar ? ex.nameAr : ex.nameEn);
    this.setText('warmup-ex-desc', ar ? ex.descAr : ex.descEn);
    this.setText('warmup-char-tip', ar ? ex.tipAr : ex.tipEn);
    this.setText('warmup-ex-counter', ar
      ? `تمرين ${idx + 1} من ${this.exercises.length}`
      : `Exercise ${idx + 1} of ${this.exercises.length}`);
    const key = this.$('wu2-key');
    if (key) {
      const skill = GameConfig.SKILLS[this.skillId] || GameConfig.SKILLS.apchagi;
      key.hidden = !ex.key.includes(this.skillId);
      key.textContent = ar ? `⭐ مهم أوي لـ ${skill.name.ar}` : `⭐ Key for ${skill.name.en}`;
    }
    const tag = this.$('wu2-media-tag');
    if (tag) tag.textContent = ex.video ? (ar ? '🎥 فيديو شرح' : '🎥 Demo video') : (ar ? '✏️ شرح متحرك' : '✏️ Animated demo');
    const card = this.$('warmup-card');
    if (card) {
      card.style.setProperty('--wu-color', ex.color);
      card.classList.remove('wu2-enter'); void card.offsetWidth; card.classList.add('wu2-enter');
    }
  }

  static loadExercise(idx) {
    this.stopTimer();
    this.stopRest();
    this.currentIdx = idx;
    const ex = this.exercises[idx];
    if (!ex) return;
    const ar = this.ar;
    this.paintInfo(idx);
    const flash = this.$('wu2-flash');
    if (flash) flash.classList.remove('show');

    this.showMedia(ex);
    this.timeLeft = ex.duration;
    this.switchCued = false;
    this.updateTimerDisplay();
    this.updateDots(idx);
    this.syncPauseBtn();
    this.startTimer();
    if (this.gameState.soundEnabled) SpeechHelper.speak(ar ? ex.nameAr : ex.nameEn, ar ? 'ar-EG' : 'en-US');
  }

  static startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.isPaused || document.hidden) return;
      this.timeLeft--;
      const ex = this.exercises[this.currentIdx];
      if (ex?.side && !this.switchCued && this.timeLeft === Math.floor(ex.duration / 2)) {
        this.switchCued = true;
        this.cue(this.ar ? '🔄 بدّل الرجل!' : '🔄 Switch legs!');
      }
      if (this.timeLeft > 0 && this.timeLeft <= 3) this.gameState.playSound('click');
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) this.finishExercise();
    }, 1000);
  }

  static stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }

  static cue(text) {
    const flash = this.$('wu2-flash');
    if (!flash) return;
    flash.textContent = text;
    flash.classList.remove('show'); void flash.offsetWidth; flash.classList.add('show');
    this.gameState.playSound('success');
    if (this.gameState.soundEnabled) SpeechHelper.speak(text.replace(/^\S+\s/, ''), this.ar ? 'ar-EG' : 'en-US');
  }

  static updateTimerDisplay() {
    const ex = this.exercises[this.currentIdx];
    if (!ex) return;
    const num = this.$('warmup-timer-num');
    const ring = this.$('warmup-ring-fill');
    const critical = this.timeLeft <= 3;
    if (num) {
      num.textContent = Math.max(0, this.timeLeft);
      num.classList.toggle('is-critical', critical);
      num.classList.remove('wu-tick'); void num.offsetWidth; num.classList.add('wu-tick');
    }
    if (ring) {
      const pct = Math.max(0, this.timeLeft) / ex.duration;
      ring.style.strokeDasharray = `${WarmupSystem.CIRCUMFERENCE}`;
      ring.style.strokeDashoffset = `${WarmupSystem.CIRCUMFERENCE * (1 - pct)}`;
      ring.style.stroke = critical ? 'var(--danger-color)' : ex.color;
    }
  }

  // Called when the countdown runs out (counts as done) or on Skip.
  static finishExercise(skipped = false) {
    this.stopTimer();
    const ex = this.exercises[this.currentIdx];
    if (ex && !skipped) this.completedIds.add(ex.id);
    this.gameState.playSound(skipped ? 'click' : 'success');
    const next = this.currentIdx + 1;
    if (next < this.exercises.length) this.showRest(next);
    else this.complete();
  }

  // Rest screen sits ON TOP of the media box (nothing is torn down and
  // rebuilt), and the next exercise's clip is already loading underneath it,
  // so it starts instantly when the rest ends.
  static showRest(nextIdx) {
    this.stopRest();
    this.inRest = true;
    this.pendingIdx = nextIdx;
    const ex = this.exercises[nextIdx];
    const ar = this.ar;
    const rest = this.$('wu2-rest');
    if (!rest) { this.loadExercise(nextIdx); return; }
    this.setText('wu2-rest-next-name', `${ex.icon} ${ar ? ex.nameAr : ex.nameEn}`);
    this.setText('wu2-rest-next-desc', ar ? ex.descAr : ex.descEn);
    rest.hidden = false;
    rest.classList.remove('show'); void rest.offsetWidth; rest.classList.add('show');
    this.currentIdx = nextIdx;
    this.paintInfo(nextIdx);
    this.timeLeft = ex.duration;
    this.updateTimerDisplay();
    this.updateDots(nextIdx);

    // Pre-load the next clip behind the overlay (paused).
    const video = this.$('warmup-video');
    if (ex.video && video) {
      video.pause();
      if (video.dataset.src !== ex.video) {
        video.dataset.src = ex.video; video.src = ex.video; video.load();
      }
    }

    let t = WarmupSystem.REST_SECONDS;
    const paint = () => {
      this.setText('wu2-rest-count', t);
      const ring = this.$('wu2-rest-ring');
      if (ring) ring.style.setProperty('--pct', `${(t / WarmupSystem.REST_SECONDS) * 100}%`);
    };
    paint();
    this._restInterval = setInterval(() => {
      if (this.isPaused || document.hidden) return;
      t--; paint();
      if (t <= 0) this.endRest();
    }, 1000);
  }

  static stopRest() {
    if (this._restInterval) { clearInterval(this._restInterval); this._restInterval = null; }
  }

  static endRest() {
    this.stopRest();
    this.inRest = false;
    const rest = this.$('wu2-rest');
    if (rest) { rest.classList.remove('show'); rest.hidden = true; }
    if (this.pendingIdx != null) this.loadExercise(this.pendingIdx);
    this.pendingIdx = null;
  }

  static togglePause() {
    this.isPaused = !this.isPaused;
    this.syncPauseBtn();
    this.$('warmup-character')?.classList.toggle('is-paused', this.isPaused);
    const card = this.$('warmup-card');
    card?.classList.toggle('is-paused', this.isPaused);
    const video = this.$('warmup-video');
    if (video && video.classList.contains('is-on') && !this.inRest) {
      if (this.isPaused) video.pause(); else video.play().catch(() => {});
    }
  }

  static syncPauseBtn() {
    const ar = this.ar;
    const icon = this.$('warmup-pause-icon');
    if (icon) icon.className = this.isPaused ? 'fas fa-play' : 'fas fa-pause';
    this.setText('warmup-pause-label', this.isPaused ? (ar ? 'كمّل' : 'Resume') : (ar ? 'وقّف' : 'Pause'));
  }

  static exit() {
    this.stopTimer();
    this.stopRest();
    const video = this.$('warmup-video');
    if (video) video.pause();
    switchScreen(this.gameState?.completedGames?.size ? 'skill-menu' : 'home');
  }

  // One delegated listener on the permanent screen element, attached once.
  static setupControls() {
    const screen = this.$('warmup-screen');
    if (!screen || screen._wuDelegated) return;
    screen._wuDelegated = true;
    const jump = (step) => {
      const idx = +step.dataset.idx;
      if (Number.isNaN(idx) || !this.$('warmup-complete')?.hidden) return;
      if (idx === this.currentIdx && !this.inRest) return;
      this.gameState.playSound('click');
      this.inRest = false;
      const rest = this.$('wu2-rest');
      if (rest) { rest.classList.remove('show'); rest.hidden = true; }
      this.pendingIdx = null;
      this.loadExercise(idx);
    };
    screen.addEventListener('keydown', (e) => {
      const step = e.target.closest?.('.wu2-step');
      if (step && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); jump(step); }
    });
    screen.addEventListener('click', (e) => {
      const step = e.target.closest('.wu2-step');
      if (step) { jump(step); return; }
      const btn = e.target.closest('button');
      if (!btn) return;
      switch (btn.id) {
        case 'warmup-pause-btn': this.togglePause(); break;
        case 'warmup-next-btn':
          if (this.inRest) this.endRest(); else this.finishExercise(true);
          break;
        case 'wu2-rest-skip': this.endRest(); break;
        case 'warmup-exit-btn': this.exit(); break;
      }
    });
    document.addEventListener('keydown', (e) => {
      if (!screen.classList.contains('active') || e.target.closest?.('input, textarea')) return;
      if (e.target.closest?.('.wu2-step')) return;
      if (e.code === 'Space') { e.preventDefault(); this.togglePause(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // "next" is → in LTR and ← in RTL; the other arrow goes back one exercise
        if (!this.$('warmup-complete')?.hidden) return;
        const next = (e.key === 'ArrowRight') !== this.ar;
        if (next) { if (this.inRest) this.endRest(); else this.finishExercise(true); }
        else if (this.currentIdx > 0 || this.inRest) {
          const back = this.currentIdx - 1;   // in a rest, currentIdx already points at the NEXT exercise
          const rest = this.$('wu2-rest');
          if (rest) { rest.classList.remove('show'); rest.hidden = true; }
          this.inRest = false; this.pendingIdx = null;
          this.loadExercise(Math.max(0, back));
        }
      } else if (e.key === 'Escape') this.exit();
    });
  }

  static complete() {
    this.stopTimer();
    this.stopRest();
    this.inRest = false;
    const video = this.$('warmup-video');
    if (video) { video.pause(); video.classList.remove('is-on'); }
    const gs = this.gameState;
    gs.playSound('win');

    const doneCount = this.completedIds.size;
    const total = this.exercises.length;
    const score = Math.round((doneCount / total) * 100);
    // Warming up at all opens Learning; the score records how much of it was done.
    GameConfig.SKILL_ORDER.forEach(sk => {
      const s = gs.skillGameScores[sk];
      if (s && (sk === this.skillId || gs.unlockedSkills.has(sk))) s.warmup = Math.max(s.warmup || 0, Math.max(score, 1));
    });
    gs.lastWarmupAt = Date.now();
    gs.saveToStorage();
    PlayerSystem.logAttempt('warmup', this.skillId, score, true, {
      durationSec: Math.round((Date.now() - this.startedAt) / 1000),
      exercisesDone: doneCount
    });

    this.updateDots(total);
    const ar = this.ar;
    const card = this.$('warmup-card');
    if (card) card.hidden = true;
    const done = this.$('warmup-complete');
    if (done) done.hidden = false;
    setTimeout(() => window.Voice?.cue('warmupDone'), 400);
    // v29: hand the child straight to the next step of the journey
    const btns = this.$('wu2-done-btns') || document.querySelector('.wu2-done-btns');
    if (btns && window.Journey && !btns.querySelector('#jr-next-warm')) {
      btns.insertAdjacentHTML('afterbegin', Journey.nextButtonHTML('jr-next-warm'));
      Journey.bindNextButton('jr-next-warm');
      btns.querySelectorAll('.btn').forEach(b => { if (b.id !== 'jr-next-warm') b.classList.add('btn-quiet'); });
    }
    this.setText('warmup-complete-title', ar ? '🎉 خلّصت الإحماء!' : '🎉 Warm-up done!');
    this.setText('warmup-complete-sub', doneCount === total
      ? (ar ? 'عملت كل التمارين! جسمك جاهز خالص للتمرين.' : 'You did every exercise — your body is fully ready!')
      : (ar ? `عملت ${doneCount} من ${total} تمارين. المرة الجاية جرّب تخلّصهم كلهم!` : `You did ${doneCount} of ${total} exercises. Next time try to finish them all!`));

    const list = this.$('wu2-done-list');
    if (list) {
      list.innerHTML = this.exercises.map(ex => {
        const ok = this.completedIds.has(ex.id);
        return `<li class="${ok ? 'ok' : 'skip'}"><span>${ok ? '✅' : '⏭️'}</span> ${ex.icon} ${ar ? ex.nameAr : ex.nameEn}</li>`;
      }).join('');
    }
    const completeChar = this.$('warmup-complete-char');
    if (completeChar) gs.createCharacterVisual('warmup-complete-char', gs.playerCharacter, 'WIN');
    this.spawnConfetti();
    gs.showNotification(ar ? '🔥 الإحماء خلص! جسمك جاهز للتمرين!' : '🔥 Warm-up complete! Body is ready!', 'success');
  }

  static spawnConfetti() {
    const holder = this.$('warmup-confetti');
    if (!holder || prefersReducedMotion()) return;
    holder.innerHTML = '';
    const colors = ['#ff6b35', '#2a9d8f', '#e9c46a', '#e76f51', '#ffd700', '#4dc9ff'];
    for (let i = 0; i < 36; i++) {
      const piece = document.createElement('div');
      piece.className = 'piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = `${1.6 + Math.random() * 1.1}s`;
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      piece.style.setProperty('--rot', Math.random() > 0.5 ? '540deg' : '-540deg');
      holder.appendChild(piece);
    }
    setTimeout(() => { holder.innerHTML = ''; }, 3200);
  }

  static restart() { this.initialize(this.gameState); }

  // Re-render texts in the new language without losing the place.
  static refreshLanguage() {
    this.localise();
    this.buildDots();
    const done = this.$('warmup-complete');
    if (done && !done.hidden) { this.updateDots(this.exercises.length); return; }
    this.paintInfo(this.currentIdx);
    if (this.inRest) {
      const ex = this.exercises[this.currentIdx]; const ar = this.ar;
      this.setText('wu2-rest-next-name', `${ex.icon} ${ar ? ex.nameAr : ex.nameEn}`);
      this.setText('wu2-rest-next-desc', ar ? ex.descAr : ex.descEn);
    }
    this.updateDots(this.currentIdx);
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
      <linearGradient id="giG2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#DCE8FA"/><stop offset="100%" stop-color="#B8CBE8"/>
      </linearGradient>
      <linearGradient id="beltG" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#111122"/><stop offset="50%" stop-color="#1a1a3e"/><stop offset="100%" stop-color="#111122"/>
      </linearGradient>
      <filter id="sh"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/></filter>
    </defs>`;

    const lc = `stroke-linecap="round" stroke-linejoin="round"`;

    // Fills a limb segment as a tapered, rounded-cap solid shape (wide end
    // → narrow end) instead of a uniform-width stroked line — reads as an
    // actual limb with mass (bicep→forearm, thigh→calf) rather than a thin
    // wire. w1/w2 are the full widths at each end; every exercise pose still
    // just passes start/end points + a width like before, so no per-pose
    // code needs to change to pick this up.
    function bone(x1, y1, x2, y2, w1, w2, fill) {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const ax = x1 + nx * w1 / 2, ay = y1 + ny * w1 / 2;
      const bx = x1 - nx * w1 / 2, by = y1 - ny * w1 / 2;
      const cx2 = x2 - nx * w2 / 2, cy2 = y2 - ny * w2 / 2;
      const dx2 = x2 + nx * w2 / 2, dy2 = y2 + ny * w2 / 2;
      return `<circle cx="${x1}" cy="${y1}" r="${w1/2}" fill="url(#${fill})"/>` +
             `<path d="M${ax},${ay} L${dx2},${dy2} L${cx2},${cy2} L${bx},${by} Z" fill="url(#${fill})"/>` +
             `<circle cx="${x2}" cy="${y2}" r="${w2/2}" fill="url(#${fill})"/>`;
    }

    const skin  = (x1,y1,x2,y2,w=11) => bone(x1,y1,x2,y2, w*1.05, w*0.95, 'skinG');
    // Upper limb segments (upper arm / thigh): noticeably wider at the
    // joint end, tapering out — gives real "muscle" shape.
    const gi    = (x1,y1,x2,y2,w)     => bone(x1,y1,x2,y2, w*1.3, w*0.92, 'giG');
    // Lower limb segments (forearm / calf): slimmer and taper further.
    const gi2   = (x1,y1,x2,y2,w)     => bone(x1,y1,x2,y2, w*1.05, w*0.72, 'giG2');
    const dot   = (cx,cy,r=6)          => `<ellipse cx="${cx}" cy="${cy}" rx="${r*1.1}" ry="${r*0.92}" fill="url(#skinG)"/>`;
    const floor = (cx,y=200)           => `<ellipse cx="${cx}" cy="${y}" rx="30" ry="6" fill="rgba(0,0,0,0.2)"/>
      <line x1="${cx-45}" y1="${y}" x2="${cx+45}" y2="${y}" stroke="rgba(255,255,255,0.1)" stroke-width="2" ${lc}/>`;

    const head = (cx,cy,r=16) => `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#skinG)" stroke="rgba(0,0,0,0.12)" stroke-width="1.5" filter="url(#sh)"/>
      <path d="M${cx-r+3},${cy-r/2} Q${cx},${cy-r-6} ${cx+r-3},${cy-r/2}" fill="#2C1810"/>
      <circle cx="${cx-4.5}" cy="${cy-2}" r="2" fill="#1a1a2e"/>
      <circle cx="${cx+4.5}" cy="${cy-2}" r="2" fill="#1a1a2e"/>
      <circle cx="${cx-4}" cy="${cy-2.5}" r="0.7" fill="white"/>
      <circle cx="${cx+5}" cy="${cy-2.5}" r="0.7" fill="white"/>
      <path d="M${cx-3.5},${cy+4} Q${cx},${cy+8} ${cx+3.5},${cy+4}" stroke="#C87" stroke-width="1.5" fill="none" ${lc}/>`;

    // Torso: a proper tapered silhouette (broad shoulders → narrower waist)
    // instead of a single thin line, plus a V-neck collar notch, a belt
    // at natural waist width, and a soft highlight down one side so the
    // chest reads with some volume instead of flat.
    const torso = (sx,sy,hx,hy,w=20) => {
      const shoulderW = w * 1.55, waistW = w * 1.05;
      const dx = hx - sx, dy = hy - sy;
      const len = Math.sqrt(dx*dx + dy*dy) || 1;
      const nx = -dy/len, ny = dx/len;
      const hlx1 = sx + nx*shoulderW*0.18, hly1 = sy + ny*shoulderW*0.18 + 3;
      const hlx2 = hx + nx*waistW*0.15,    hly2 = hy + ny*waistW*0.15;
      return `
      ${bone(sx,sy,hx,hy, shoulderW, waistW, 'giG')}
      <path d="M${hlx1},${hly1} L${hlx2},${hly2}" stroke="rgba(255,255,255,0.35)" stroke-width="3" ${lc}/>
      <path d="M${sx-6},${sy+1} L${sx},${sy+9} L${sx+6},${sy+1}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" ${lc}/>
      <rect x="${hx-waistW/2-1}" y="${hy-6}" width="${waistW+2}" height="8" rx="2.5" fill="url(#beltG)" opacity="0.9"/>`;
    };

    const svgs = {
      jumping_jacks: `<svg viewBox="0 0 200 215" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .jj-legs { transform-origin:100px 118px; animation:jjL 0.9s ease-in-out infinite; }
          .jj-larm { transform-origin:100px 78px; animation:jjLA 0.9s ease-in-out infinite; }
          .jj-rarm { transform-origin:100px 78px; animation:jjRA 0.9s ease-in-out infinite; }
          @keyframes jjL  { 0%,100%{ transform:scaleX(1); } 50%{ transform:scaleX(1.7); } }
          @keyframes jjLA { 0%,100%{ transform:rotate(70deg); } 50%{ transform:rotate(-10deg); } }
          @keyframes jjRA { 0%,100%{ transform:rotate(-70deg); } 50%{ transform:rotate(10deg); } }
        </style>
        ${floor(100)}
        <g class="jj-legs">
          ${gi(107,118,120,168,13)}${gi2(120,168,124,200,11)}${dot(124,204,7)}
          ${gi(93,118,80,168,13)}${gi2(80,168,76,200,11)}${dot(76,204,7)}
        </g>
        ${torso(100,62,100,118)}
        <g class="jj-rarm">${gi(114,80,140,88,11)}${gi2(140,88,154,72,9)}${dot(154,68)}</g>
        <g class="jj-larm">${gi(86,80,60,88,11)}${gi2(60,88,46,72,9)}${dot(46,68)}</g>
        ${skin(100,62,100,54)}
        ${head(100,40)}
      </svg>`,
      straddle_fold: `<svg viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .sf-fold { transform-origin:105px 116px; animation:sfF 2.4s ease-in-out infinite; }
          @keyframes sfF { 0%,100%{ transform:rotate(0deg); } 55%{ transform:rotate(58deg); } }
        </style>
        ${floor(105)}
        ${gi(122,116,152,168,13)}${gi2(152,168,156,200,11)}${dot(156,204,7)}
        ${gi(88,116,58,168,13)}${gi2(58,168,54,200,11)}${dot(54,204,7)}
        <g class="sf-fold">
          ${torso(105,60,105,116)}
          ${gi(93,78,74,96,11)}${gi2(74,96,60,116,9)}${dot(60,116)}
          ${gi(117,78,136,96,11)}${gi2(136,96,150,116,9)}${dot(150,116)}
          ${skin(105,60,105,52)}
          ${head(105,37)}
        </g>
      </svg>`,
      heel_glute: `<svg viewBox="0 0 230 210" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          /* Single rigid group for torso+head+arms — everything hinges
             together at the hip, so nothing swings independently or
             out-runs the body (that mismatch was the old broken look). */
          .hg-upper { transform-origin:105px 118px; animation:hgU 2.4s ease-in-out infinite; }
          @keyframes hgU { 0%,100%{ transform:rotate(0deg); } 55%{ transform:rotate(100deg); } }
        </style>
        ${floor(105)}
        ${gi(94,118,83,168,13)}${gi2(83,168,79,200,11)}${dot(79,204,7)}
        ${gi(116,118,127,168,13)}${gi2(127,168,131,200,11)}${dot(131,204,7)}
        <g class="hg-upper">
          ${torso(105,62,105,118)}
          ${skin(105,62,105,54)}
          ${head(105,40)}
          <!-- Arms raised overhead at rest; once the body hinges forward
               they naturally sweep down past the head toward the floor,
               reading as "reaching for your feet" instead of flailing. -->
          ${gi(93,66,80,38,11)}${gi2(80,38,71,14,9)}${dot(71,14)}
          ${gi(117,66,130,38,11)}${gi2(130,38,139,14,9)}${dot(139,14)}
        </g>
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
          ${skin(100,62,100,54)}
          ${head(100,40)}
          ${gi(86,80,56,88,11)}${gi2(56,88,40,96,9)}${dot(40,96)}
          ${gi(114,80,144,88,11)}${gi2(144,88,160,96,9)}${dot(160,96)}
        </g>
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
          ${skin(110,60,110,52)}
          ${head(110,37)}
          ${gi(96,78,72,90,11)}${gi2(72,90,54,108,9)}${dot(54,108)}
          ${gi(124,78,148,92,11)}${gi2(148,92,164,110,9)}${dot(164,110)}
        </g>
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
          ${skin(115,58,115,50)}
          ${head(115,35)}
        </g>
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
          ${skin(100,62,100,54)}
          ${head(100,40)}
        </g>
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
          ${skin(90,110,90,102)}
          ${head(90,87)}
        </g>
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
          ${skin(120,110,120,102)}
          ${head(120,87)}
        </g>
      </svg>`,
      calf_raises: `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .cr-body { transform-origin:100px 118px; animation:crUp 1.4s ease-in-out infinite; }
          @keyframes crUp { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-10px); } }
        </style>
        ${floor(100)}
        <g class="cr-body">
          ${gi(93,118,90,168,13)}${gi2(90,168,88,198,11)}${dot(88,200,7)}
          ${gi(107,118,110,168,13)}${gi2(110,168,112,198,11)}${dot(112,200,7)}
          ${torso(100,62,100,118)}
          ${skin(100,62,100,54)}
          ${head(100,40)}
          ${gi(86,80,70,110,11)}${gi2(70,110,60,130,9)}${dot(60,130)}
          ${gi(114,80,130,110,11)}${gi2(130,110,140,130,9)}${dot(140,130)}
        </g>
      </svg>`,
      leg_swing_front: `<svg viewBox="0 0 200 215" xmlns="http://www.w3.org/2000/svg">${DEFS}
        <style>
          .ls-swing { transform-origin:100px 118px; animation:lsSw 1.6s ease-in-out infinite; }
          @keyframes lsSw { 0%,100%{ transform:rotate(-35deg); } 50%{ transform:rotate(35deg); } }
        </style>
        ${floor(100)}
        ${gi(93,118,88,168,13)}${gi2(88,168,84,200,11)}${dot(84,204,7)}
        <g class="ls-swing">${gi(107,118,112,160,13)}${gi2(112,160,118,190,11)}${dot(118,192,7)}</g>
        ${torso(100,62,100,118)}
        ${skin(100,62,100,54)}
        ${head(100,40)}
        ${gi(86,80,64,92,11)}${gi2(64,92,50,100,9)}${dot(50,100)}
        ${gi(114,80,136,92,11)}${gi2(136,92,150,100,9)}${dot(150,100)}
      </svg>`
    };

    // Clip ids → the drawn fallback that matches each clip.
    const alias = { lateral_lunge: 'side_press', straddle_side_reach: 'split_right',
                    single_leg_hamstring: 'hamstring_left', double_leg_hamstring: 'heel_glute' };
    return svgs[exerciseId] || svgs[alias[exerciseId]] || svgs.heel_glute;
  }

}

