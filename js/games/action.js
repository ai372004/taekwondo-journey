// =====================================================================
// 4TH MINI-GAME: ACTION CHALLENGE  a different hands-on mechanic for every kick
//   Ap Chagi     -> TIMING     stop a moving marker inside the green zone (chest / face height)
//   Naeryeo Chagi-> SWIPE      swipe UP (straight, no wobble = no bent knee), then DOWN fast
//   Bik Chagi    -> PIVOT      turn the standing foot exactly 180 on a dial, then kick
// Each round is scored 0-100; the average must reach PASSING_SCORE to pass. The
// best score is stored in skillGameScores[skill].action and, like the other three
// games, is required before the Quiz unlocks.
// =====================================================================
class ActionSystem {

  static ROUNDS = { apchagi: 5, narochagi: 3, bakchagi3: 4 };

  static COPY = {
    apchagi: {
      title: { en: '⏱️ Timing Challenge', ar: '⏱️ تحدي التوقيت' },
      how:   { en: 'Tap KICK! when the moving marker is inside the green zone — that is chest / face height. Too low and the kick falls short, too high and it flies over the target.',
               ar: 'دوس «اركل!» لما المؤشر اللي بيتحرك يبقى جوه المنطقة الخضرا، اللي هي ارتفاع الصدر / الوش. لو كان واطي الركلة هتقصر، ولو كان عالي هتعدّي فوق الهدف.' }
    },
    narochagi: {
      title: { en: '🪓 Gravity Drop Challenge', ar: '🪓 تحدي الجاذبية والنزول' },
      how:   { en: '1) Swipe UP in a straight line to raise the leg as high as you can — a wobble means a bent knee. 2) Then swipe DOWN as fast as you can to drop the heel.',
               ar: '١) اسحب لفوق في خط مستقيم عشان ترفع رجلك لأعلى حاجة — لو الخط اهتز يبقى ركبتك اتثنت. ٢) وبعدين اسحب لتحت بأسرع ما تقدر عشان الكعب ينزل.' }
    },
    bakchagi3: {
      title: { en: '🔄 Pivot Challenge', ar: '🔄 تحدي لفّة الارتكاز' },
      how:   { en: 'Turn the standing foot exactly 180°: drag around the dial (or use the arrow keys), then press KICK!',
               ar: 'لفّ قدم الارتكاز 180° بالظبط: اسحب حوالين القرص (أو استخدم الأسهم) وبعدين دوس «اركل!».' }
    }
  };

  static TXT = {
    round:  { en: (r, n) => `Round ${r} / ${n}`, ar: (r, n) => `الجولة ${r} / ${n}` },
    score:  { en: (s) => `Score: ${s}`,            ar: (s) => `النتيجة: ${s}` },
    kick:   { en: 'KICK!',        ar: 'اركل!' },
    low:    { en: 'Too low',      ar: 'واطية' },
    high:   { en: 'Too high',     ar: 'عالية' },
    zone:   { en: 'Chest / Face', ar: 'الصدر / الوش' },
    top:    { en: 'Full height',  ar: 'لأعلى ارتفاع' },
    height: { en: 'Height',       ar: 'الارتفاع' },
    speed:  { en: 'Speed',        ar: 'السرعة' },
    step1:  { en: '1) Swipe UP in a straight line', ar: '١) اسحب لفوق في خط مستقيم' },
    step2:  { en: '2) Now swipe DOWN — fast!',      ar: '٢) دلوقتي اسحب لتحت — بسرعة!' },
    higher: { en: 'Swipe up a little higher first.', ar: 'اسحب لفوق شوية كمان الأول.' },
    lower:  { en: 'Swipe all the way down!',          ar: 'اسحب لحد تحت خالص!' },
    bent:   { en: 'Wobble! Keep it straight',         ar: 'بتهتز! خليها مستقيمة' },
    dial:   { en: 'Rotation dial',                    ar: 'قرص اللف' },
    ready:  { en: 'Get ready…',                       ar: 'استعد…' }
  };

  static PASS_HINT = { en: 'Look a little closer', ar: 'ركّز شوية كمان' };

  // narochagi only: the 5 axe-kick frames in assets/.../narochagi/ all share
  // one canvas (same body size, same floor point), so the live cross-fade in
  // the Gravity Drop challenge reads as one figure moving.
  static LIVE_FRAMES = {
    narochagi: {
      boy: [
        'assets/images/characters/boy_char/narochagi/ready_boy.webp',
        'assets/images/characters/boy_char/narochagi/rise_boy.webp',
        'assets/images/characters/boy_char/narochagi/drop_boy.webp',
        'assets/images/characters/boy_char/narochagi/recoil_boy.webp',
        'assets/images/characters/boy_char/narochagi/return_boy.webp'
      ],
      girl: [
        'assets/images/characters/girl_char/narochagi/ready_girl.webp',
        'assets/images/characters/girl_char/narochagi/rise_girl.webp',
        'assets/images/characters/girl_char/narochagi/drop_girl.webp',
        'assets/images/characters/girl_char/narochagi/recoil_girl.webp',
        'assets/images/characters/girl_char/narochagi/return_girl.webp'
      ]
    }
  };

  static gameState = null;
  static skillId = 'apchagi';
  static round = 0;
  static scores = [];
  static busy = true;
  static _abort = null;
  static _raf = 0;
  static _token = 0;
  static _st = null;
  static _last = null;
  static _frames = [];

  static get ar() { return this.gameState?.currentLanguage === 'ar'; }
  static t(obj) { return this.ar ? obj.ar : obj.en; }
  static get total() { return this.ROUNDS[this.skillId] || 3; }
  static $(id) { return document.getElementById(id); }
  static clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  static later(fn, ms) {
    const tok = this._token;
    return screenTimeout(() => { if (tok === this._token) fn(); }, ms);
  }

  // ------------------------------------------------------------------
  // lifecycle
  // ------------------------------------------------------------------
  static initialize(gameState) {
    this.teardown();
    this.gameState = gameState;
    this.skillId = this.ROUNDS[gameState.currentSkill] ? gameState.currentSkill : 'apchagi';
    this.round = 0;
    this.scores = [];
    this._last = null;
    this.busy = true;
    this._abort = new AbortController();

    const isBoy = gameState.playerCharacter === 'boy';
    const live = this.LIVE_FRAMES[this.skillId];
    this._frames = live
      ? live[isBoy ? 'boy' : 'girl']
      : GameConfig.SKILLS[this.skillId].phases.map(p => (isBoy ? p.image.boy : p.image.girl));
    this._frames.forEach(u => { const im = new Image(); im.src = u; });   // warm the cache

    const fighter = this.$('act-fighter');
    if (fighter) fighter.onerror = () => { fighter.style.visibility = 'hidden'; };
    this.mountWidget();
    this.renderTexts();
    this.nextRound();
  }

  // Stops every loop / listener / pending callback. Called when leaving the
  // screen (ScreenManager.switchScreen) and before every restart.
  static teardown() {
    this._token++;
    if (this._abort) { this._abort.abort(); this._abort = null; }
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this._st) this._st.running = false;
    this._st = null;
    this.busy = true;
  }

  static showFrame(i) {
    const img = this.$('act-fighter');
    if (!img || !this._frames.length) return;
    img.style.visibility = '';
    img.style.opacity = '';        // clear any live-blend override (paintPose) -- back to fully opaque
    img.src = this._frames[Math.min(i, this._frames.length - 1)];
  }

  static nextRound() {
    this.round++;
    if (this.round > this.total) { this.finishGame(); return; }
    this.busy = true;
    this._last = null;
    this.$('act-fighter')?.classList.remove('act-wobble');
    this.showFrame(0);
    this.renderCallout();
    this.renderTexts();
    this.setCallout('neutral', this.t(this.TXT.ready));
    this.later(() => {
      this._last = null; this.renderCallout();
      this.busy = false;
      if (this.skillId === 'apchagi') this.startTiming();
      else if (this.skillId === 'narochagi') this.startSwipe();
      else this.startPivot();
    }, 700);
  }

  // ------------------------------------------------------------------
  // shared rendering
  // ------------------------------------------------------------------
  static average() {
    return this.scores.length ? Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length) : null;
  }

  static renderTexts() {
    const set = (id, txt) => { const el = this.$(id); if (el) el.textContent = txt; };
    const copy = this.COPY[this.skillId];
    set('act-title', this.t(copy.title));
    set('act-how', this.t(copy.how));
    set('act-round', this.t(this.TXT.round)(Math.min(this.round, this.total) || 1, this.total));
    const avg = this.average();
    set('act-score', this.t(this.TXT.score)(avg === null ? '—' : `${avg}%`));
    set('act-lbl-low', this.t(this.TXT.low));
    set('act-lbl-high', this.t(this.TXT.high));
    set('act-zone-label', this.t(this.TXT.zone));
    set('act-kick-label', this.t(this.TXT.kick));
    const dragzone = this.$('act-dragzone');
    if (dragzone) {
      dragzone.setAttribute('aria-label', this.t(copy.title));
      const dropping = this._st?.phase === 'raised' || this._st?.phase === 'dropping';
      set('act-swipe-step', this.t(dropping ? this.TXT.step2 : this.TXT.step1));
      const txt = this.$('act-hint-txt');
      if (txt) txt.textContent = this.t(dropping ? this.TXT.step2 : this.TXT.step1);
    }
    this.$('act-dial')?.setAttribute('aria-label', this.t(this.TXT.dial));
    this.renderCallout();
  }

  static setCallout(kind, text, score) {
    this._last = { kind, text, score };
    this.renderCallout();
  }

  // The last message is kept as data so a language switch can re-render it.
  static renderCallout() {
    const el = this.$('act-callout');
    if (!el) return;
    if (!this._last) { el.className = 'act-callout'; el.textContent = ''; return; }
    const { kind, text, score } = this._last;
    el.className = `act-callout show ${kind}`;
    el.textContent = '';
    if (score !== undefined) {
      const b = document.createElement('strong');
      b.textContent = `${score}% `;
      el.appendChild(b);
    }
    // text may be a {en, ar} pair (result messages) or already a string (status text)
    el.appendChild(document.createTextNode(typeof text === 'string' ? text : this.t(text)));
  }

  // ------------------------------------------------------------------
  // resolving a round: kick animation + sounds + scoring
  // kind: 'hit' (lands) | 'short' (falls short) | 'over' (flies over) | 'fall' (loses balance)
  // ------------------------------------------------------------------
  static resolveRound({ score, kind, power, msg }) {
    if (this.busy) return;
    this.busy = true;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this._st) this._st.running = false;

    this.scores.push(score);
    const good = score >= GameConfig.SETTINGS.PASSING_SCORE;
    this.setCallout(good ? 'ok' : 'bad', msg, score);
    this.renderTexts();

    const gs = this.gameState;
    const step = Math.round(230 - 140 * this.clamp(power, 0, 1));    // faster kick = higher power
    const seqs = { hit: [1, 2, 2, 3, 4, 0], short: [1, 3, 4, 0], over: [1, 2, 3, 4, 0], fall: [1, 2, 0] };
    const seq = seqs[kind] || seqs.short;

    gs.playSound('kick');                                            // whoosh
    seq.forEach((frame, i) => this.later(() => {
      this.showFrame(frame);
      if (frame === 2 && i === seq.indexOf(2)) this.onExtension(kind, power);
    }, i * step));

    const end = seq.length * step;
    this.later(() => gs.playSound(good ? 'success' : 'error'), end);
    this.later(() => this.nextRound(), Math.max(end + 500, 1700));
  }

  static onExtension(kind, power) {
    const fighter = this.$('act-fighter');
    if (kind === 'hit') {
      this.gameState.playSound('strike');                            // heavy thud
      const pad = this.$('act-target');
      if (pad) {
        pad.classList.remove('is-hit'); void pad.offsetWidth; pad.classList.add('is-hit');
        const r = pad.getBoundingClientRect();
        ImpactEffects.burst(r.left + r.width / 2, r.top + r.height / 2, power > 0.85 ? '#ffd700' : '#ff6b35');
      }
      const stage = this.$('act-stage');
      if (stage && power > 0.7) {
        stage.classList.remove('screen-kick-shake'); void stage.offsetWidth; stage.classList.add('screen-kick-shake');
      }
    } else if (kind === 'fall' && fighter) {
      fighter.classList.add('act-wobble');
    }
  }

  static finishGame() {
    const gs = this.gameState;
    const accuracy = this.average() ?? 0;
    this.busy = true;
    if (accuracy >= GameConfig.SETTINGS.PASSING_SCORE) {
      const isFirstClear = gs.completeGame('action', accuracy);
      gs.playSound('win');
      WinnerSystem.show('action', accuracy, gs, isFirstClear);
    } else {
      gs.playSound('error');
      gs.showNotification(
        this.ar ? `${this.t(this.PASS_HINT)}: ${accuracy}%. جرّب تاني!`
                : `${this.t(this.PASS_HINT)}: ${accuracy}%. Try again!`,
        'error'
      );
      gs.trackFailure(accuracy, 'action');
      this.later(() => this.initialize(gs), 2000);
    }
  }

  static refresh() {
    if (!this.gameState || !this.$('act-title')) return;
    this.renderTexts();
  }

  // ------------------------------------------------------------------
  // widget markup (one per kick)
  // ------------------------------------------------------------------
  static mountWidget() {
    const panel = this.$('act-panel');
    if (!panel) return;
    const sig = { signal: this._abort.signal };
    // The narochagi round drags straight on the fighter (see mountLiveStage);
    // its extra stage nodes are torn down and rebuilt on every mount so a
    // round of another kick never leaves them behind on the shared stage.
    this.$('act-stage')?.querySelectorAll('.act-fighter-over, .act-hint, .act-gauge-wrap, .act-dragzone').forEach(n => n.remove());

    if (this.skillId === 'apchagi') {
      panel.innerHTML = `
        <div class="act-timing" dir="ltr">
          <div class="act-bar-labels"><span id="act-lbl-low" dir="auto"></span><span id="act-lbl-high" dir="auto"></span></div>
          <div class="act-bar" id="act-bar">
            <div class="act-zone" id="act-zone"><span id="act-zone-label" dir="auto"></span></div>
            <div class="act-marker" id="act-marker"></div>
          </div>
          <button type="button" class="btn act-kick-btn" id="act-kick-btn"><i class="fas fa-shoe-prints"></i> <span id="act-kick-label"></span></button>
        </div>`;
      const tap = (e) => { e.preventDefault?.(); this.tapTiming(); };
      this.$('act-kick-btn').addEventListener('click', () => this.tapTiming(), sig);
      this.$('act-bar').addEventListener('pointerdown', tap, sig);
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && document.activeElement === document.body) { e.preventDefault(); this.tapTiming(); }
      }, sig);

    } else if (this.skillId === 'narochagi') {
      // The old design asked the player to drag an abstract bar in the side
      // panel while the fighter just stood there. Now the fighter IS the
      // control: dragging on the stage visibly raises / drops their own leg
      // in real time (mountLiveStage), and the panel only carries the step
      // instructions plus a small after-the-fact height/speed readout.
      panel.innerHTML = `
        <div class="act-swipe-info" dir="ltr">
          <div class="act-swipe-step" id="act-swipe-step" dir="auto"></div>
        </div>`;
      this.mountLiveStage(sig);

    } else {
      let ticks = '';
      for (let a = 0; a < 360; a += 15) {
        const major = a % 90 === 0, mid = a % 45 === 0;
        const r1 = 108, r2 = major ? 92 : mid ? 96 : 100;
        const rad = (a - 90) * Math.PI / 180;
        ticks += `<line x1="${120 + r1 * Math.cos(rad)}" y1="${120 + r1 * Math.sin(rad)}" x2="${120 + r2 * Math.cos(rad)}" y2="${120 + r2 * Math.sin(rad)}" class="act-tick${major ? ' major' : ''}"/>`;
        if (major) {
          const lr = 76;
          ticks += `<text x="${120 + lr * Math.cos(rad)}" y="${120 + lr * Math.sin(rad) + 5}" class="act-tick-label" text-anchor="middle">${a}°</text>`;
        }
      }
      panel.innerHTML = `
        <div class="act-pivot" dir="ltr">
          <div class="act-dial" id="act-dial" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="360" aria-valuenow="0">
            <svg viewBox="0 0 240 240" aria-hidden="true">
              <circle cx="120" cy="120" r="112" class="act-dial-face"/>
              ${ticks}
              <g id="act-foot" transform="rotate(0 120 120)">
                <path d="M120 30 L136 72 L104 72 Z" class="act-foot-toe"/>
                <rect x="110" y="70" width="20" height="50" rx="9" class="act-foot-body"/>
                <circle cx="120" cy="120" r="11" class="act-foot-hub"/>
              </g>
            </svg>
          </div>
          <div class="act-angle" id="act-angle-read" aria-live="off">0°</div>
          <button type="button" class="btn act-kick-btn" id="act-kick-btn"><i class="fas fa-shoe-prints"></i> <span id="act-kick-label"></span></button>
        </div>`;
      const dial = this.$('act-dial');
      dial.addEventListener('pointerdown',   (e) => this.pivotDown(e), sig);
      dial.addEventListener('pointermove',   (e) => this.pivotMove(e), sig);
      dial.addEventListener('pointerup',     (e) => this.pivotUp(e), sig);
      dial.addEventListener('pointercancel', (e) => this.pivotUp(e), sig);
      dial.addEventListener('keydown', (e) => this.pivotKey(e), sig);
      this.$('act-kick-btn').addEventListener('click', () => this.kickPivot(), sig);
    }
  }

  // Builds the narochagi drag surface directly on top of the fighter: a
  // second, transparent fighter image is stacked over the real one and its
  // opacity is driven live by the swipe, so the two blend into one pose that
  // visibly moves as the player's finger moves. A slim gauge + swipe-hint
  // arrows sit on the stage itself instead of a separate abstract widget.
  static mountLiveStage(sig) {
    const stage = this.$('act-stage');
    if (!stage) return;

    const over = document.createElement('img');
    over.className = 'act-fighter-over'; over.id = 'act-fighter-over'; over.alt = '';
    stage.appendChild(over);

    const hint = document.createElement('div');
    hint.className = 'act-hint'; hint.id = 'act-hint';
    hint.innerHTML = `<i class="fas fa-chevron-up" id="act-hint-icon"></i><span id="act-hint-txt" dir="auto"></span>`;
    stage.appendChild(hint);

    const gauge = document.createElement('div');
    gauge.className = 'act-gauge-wrap'; gauge.id = 'act-gauge-wrap';
    gauge.innerHTML = `<div class="act-gauge"><div class="act-gauge-fill" id="act-gauge-fill"></div></div><span class="act-gauge-pct" id="act-gauge-pct">0%</span>`;
    stage.appendChild(gauge);

    const zone = document.createElement('div');
    zone.className = 'act-dragzone'; zone.id = 'act-dragzone';
    zone.tabIndex = 0; zone.setAttribute('role', 'application');
    stage.appendChild(zone);

    zone.addEventListener('pointerdown',   (e) => this.swipeDown(e), sig);
    zone.addEventListener('pointermove',   (e) => this.swipeMove(e), sig);
    zone.addEventListener('pointerup',     (e) => this.swipeUp(e), sig);
    zone.addEventListener('pointercancel', (e) => this.swipeUp(e), sig);
    zone.addEventListener('keydown', (e) => this.swipeKey(e, true), sig);
    zone.addEventListener('keyup',   (e) => this.swipeKey(e, false), sig);

    // The overlay's box is kept pixel-matched to the real fighter image's
    // box every time that image finishes loading a new frame (its rendered
    // size changes with each frame's own aspect ratio) and on resize.
    const base = this.$('act-fighter');
    base?.addEventListener('load', () => this.syncOverGeometry(), sig);
    window.addEventListener('resize', () => this.syncOverGeometry(), sig);
    this.syncOverGeometry();
  }

  static syncOverGeometry() {
    const stage = this.$('act-stage'), base = this.$('act-fighter'), over = this.$('act-fighter-over');
    if (!stage || !base || !over) return;
    const sRect = stage.getBoundingClientRect(), bRect = base.getBoundingClientRect();
    if (!bRect.width || !bRect.height) return;    // image not laid out yet
    over.style.left = `${bRect.left - sRect.left}px`;
    over.style.top = `${bRect.top - sRect.top}px`;
    over.style.width = `${bRect.width}px`;
    over.style.height = `${bRect.height}px`;
  }

  // ==================================================================
  // 1) AP CHAGI  timing bar
  // ==================================================================
  static startTiming() {
    const r = this.round;
    const speed  = [0.7, 0.85, 1.0, 1.15, 1.3][r - 1] ?? 1.3;          // sweeps per second
    const half   = [0.13, 0.12, 0.11, 0.10, 0.09][r - 1] ?? 0.09;      // half width of the green zone (bar fraction)
    const center = 0.3 + Math.random() * 0.4;
    const st = this._st = { running: true, t0: performance.now(), pos: 0, center, half, speed };
    const zone = this.$('act-zone'), marker = this.$('act-marker');
    if (!zone || !marker) return;
    zone.style.left = `${(center - half) * 100}%`;
    zone.style.width = `${half * 200}%`;
    const loop = (now) => {
      if (!st.running) return;
      const p = ((now - st.t0) / 1000 * speed) % 2;
      st.pos = p < 1 ? p : 2 - p;                                       // ping-pong 0..1..0
      marker.style.left = `${st.pos * 100}%`;
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  static tapTiming() {
    const st = this._st;
    if (this.busy || !st || !st.running) return;
    st.running = false;
    const d = Math.abs(st.pos - st.center) / st.half;                  // 1 = edge of the zone
    const inZone = d <= 1;
    const score = inZone ? Math.round(100 - 15 * d) : Math.max(0, Math.round(70 - 35 * (d - 1)));
    let kind, msg;
    if (inZone) {
      kind = 'hit';
      msg = d <= 0.25
        ? { en: 'Perfect timing! Straight to the target.', ar: 'توقيت مظبوط! الركلة جت في الهدف على طول.' }
        : { en: 'Good hit!', ar: 'ضربة حلوة!' };
    } else if (st.pos < st.center) {
      kind = 'short';
      msg = { en: 'Too low — the kick fell short of the target.', ar: 'واطية أوي — الركلة ماوصلتش للهدف.' };
    } else {
      kind = 'over';
      msg = { en: 'Too high — the kick flew over the target.', ar: 'عالية أوي — الركلة عدّت من فوق الهدف.' };
    }
    this.resolveRound({ score, kind, power: inZone ? 0.6 + 0.4 * (score - 85) / 15 : 0.3, msg });
  }

  // ==================================================================
  // 2) NAERYEO CHAGI  swipe up (straight) then down (fast)
  // ==================================================================
  // The fighter itself is the widget now: dragging on the stage crossfades
  // between two of their real poses live (paintPose), so the leg visibly
  // rises and drops with the player's finger instead of an abstract bar.
  static startSwipe() {
    this._st = { running: true, phase: 'up', active: false, kb: false, h: 0, maxDev: 0, riseScore: 0, tol: 40, need: 0.5 };
    this.paintPose(0, 1, 0);
    this.paintGauge(0, false);
    this.$('act-stage')?.classList.remove('act-danger');
    this.showHint('up');
    this.renderTexts();
    this.$('act-dragzone')?.focus?.({ preventScroll: true });
  }

  // The live drag distance that counts as "full height" / "full drop" -- a
  // fixed fraction of the stage itself, since the drag now happens right on
  // top of the fighter rather than in a separate fixed-height track.
  static dragRange() { return Math.max(160, (this.$('act-stage')?.getBoundingClientRect().height || 380) * 0.62); }

  // Blends the fighter from frame `a` to frame `b`: the base layer shows `a`,
  // a second stacked image shows `b` and fades in as `t` goes 0 -> 1. Two
  // real photos cross-fading over a moving finger reads as one fighter
  // actually raising or dropping their leg.
  static paintPose(a, b, t) {
    const base = this.$('act-fighter'), over = this.$('act-fighter-over');
    if (!base || !over || this._frames.length < 3) return;
    base.src = this._frames[a];
    over.src = this._frames[b];
    const v = this.clamp(t, 0, 1);
    over.style.opacity = v;
    base.style.opacity = 1 - v * 0.85;   // a true two-way dissolve reads as one figure moving, not two stacked
  }

  static paintGauge(v, bent) {
    const fill = this.$('act-gauge-fill'), pct = this.$('act-gauge-pct');
    const p = Math.round(this.clamp(v, 0, 1) * 100);
    if (fill) fill.classList.toggle('bent', !!bent);
    if (fill) fill.style.width = `${p}%`;
    if (pct) pct.textContent = `${p}%`;
  }

  static showHint(dir) {
    const hint = this.$('act-hint');
    if (!hint) return;
    hint.classList.remove('hidden');
    const icon = this.$('act-hint-icon');
    if (icon) icon.className = dir === 'down' ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    const txt = this.$('act-hint-txt');
    if (txt) txt.textContent = this.t(dir === 'down' ? this.TXT.step2 : this.TXT.step1);
  }

  static swipeDown(e) {
    const st = this._st;
    if (this.busy || !st || !st.running) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    const zone = this.$('act-dragzone');
    try { zone.setPointerCapture(e.pointerId); } catch (_) {}
    st.startX = e.clientX; st.startY = e.clientY; st.lastY = e.clientY;
    st.tol = this.dragRange() * 0.16;                                     // sideways slack before the "knee" bends
    this.$('act-hint')?.classList.add('hidden');
    if (st.phase === 'up') {
      st.active = true; st.h = 0; st.maxDev = 0;
      this.gameState.playSound('click');
    } else if (st.phase === 'raised') {
      st.phase = 'dropping'; st.active = true; st.t0 = null; st.tHalf = null;
      st.need = Math.min(0.5, st.h * 0.6);
      this.gameState.playSound('kick');                                    // whoosh as the leg comes down
    }
  }

  static swipeMove(e) {
    const st = this._st;
    if (!st || !st.active || this.busy) return;
    const range = this.dragRange();
    if (st.phase === 'up') {
      const up = this.clamp((st.startY - e.clientY) / range, 0, 1);
      st.h = Math.max(st.h, up);                                          // the leg never sinks while rising (scoring)
      st.maxDev = Math.max(st.maxDev, Math.abs(e.clientX - st.startX));
      const bent = st.maxDev > st.tol;
      this.paintPose(0, 1, up);                                           // the live pose tracks the finger exactly
      this.paintGauge(st.h, bent);
      this.$('act-stage')?.classList.toggle('act-danger', bent);
      if (bent) this.setCallout('bad', this.t(this.TXT.bent));
    } else if (st.phase === 'dropping') {
      const now = performance.now();
      const down = (e.clientY - st.startY) / range;
      if (st.t0 === null && Math.abs(e.clientY - st.startY) > 4) st.t0 = now;   // clock starts when the swipe starts moving
      if (st.tHalf === null && st.t0 !== null && down >= st.need) st.tHalf = now;
      this.paintPose(1, 2, down / Math.max(st.need, 0.001));
      this.paintGauge(this.clamp(st.h - Math.max(0, down), 0, 1), false);
    }
  }

  static swipeUp(e) {
    const st = this._st;
    if (!st || !st.active || this.busy) return;
    st.active = false;
    try { this.$('act-dragzone').releasePointerCapture(e.pointerId); } catch (_) {}
    if (st.phase === 'up') this.commitRise();
    else if (st.phase === 'dropping') {
      if (st.tHalf === null || st.t0 === null) {                            // not a full drop: try again, no penalty
        st.phase = 'raised';
        this.paintPose(0, 1, st.h);
        this.paintGauge(st.h, false);
        this.showHint('down');
        this.setCallout('neutral', this.t(this.TXT.lower));
        return;
      }
      const secs = Math.max(0.03, (st.tHalf - st.t0) / 1000);
      const speed = st.need / secs;                                          // "heights" per second
      this.finishDrop(Math.round(this.clamp((speed - 0.6) / 2.0, 0, 1) * 100));
    }
  }

  // Rise finished: score height + straightness
  static commitRise() {
    const st = this._st;
    if (st.h < 0.25) {                                                       // barely moved: start over
      st.h = 0; st.maxDev = 0;
      this.paintPose(0, 1, 0);
      this.paintGauge(0, false);
      this.$('act-stage')?.classList.remove('act-danger');
      this.setCallout('neutral', this.t(this.TXT.higher));
      return;
    }
    // Height counts for the rise score; a wobbly path (= bent knee) is a separate penalty
    // applied to the whole strike in finishDrop().
    st.riseScore = Math.round(Math.min(1, st.h / 0.9) * 100);
    st.wobble = st.kb ? 0 : this.clamp((st.maxDev - st.tol * 0.5) / (st.tol * 1.5), 0, 1);
    st.phase = 'raised';
    this.paintPose(0, 1, st.h);                                              // hold the reached height
    this.paintGauge(st.h, false);
    this.$('act-stage')?.classList.remove('act-danger');
    this.showHint('down');
    this._last = null; this.renderCallout();
    this.renderTexts();
  }

  static finishDrop(dropScore) {
    const st = this._st;
    this.paintGauge(dropScore / 100, false);
    const score = Math.round((0.4 * st.riseScore + 0.6 * dropScore) * (1 - 0.4 * st.wobble));   // wobble can cost up to 40%
    let msg;
    if (score >= GameConfig.SETTINGS.PASSING_SCORE) {
      msg = { en: 'Power strike! Straight rise, fast drop.', ar: 'ضربة جامدة! طلعة مستقيمة ونزلة سريعة.' };
    } else if (st.wobble > 0.4) {
      msg = { en: 'Keep the swipe straight — a wobble means a bent knee.', ar: 'خلّي السحبة مستقيمة — الاهتزاز معناه إن ركبتك متنية.' };
    } else if (st.riseScore < dropScore) {
      msg = { en: 'Raise the leg higher before you drop it.', ar: 'ارفع رجلك أعلى قبل ما تنزّلها.' };
    } else {
      msg = { en: 'Snap down faster — let gravity do the work.', ar: 'نزّلها أسرع — سيب الجاذبية تشتغل.' };
    }
    // Commit the live blend into the base layer so the scripted result
    // animation in resolveRound() picks up from exactly the pose shown.
    this.showFrame(2);
    const over = this.$('act-fighter-over'); if (over) over.style.opacity = 0;
    this.$('act-hint')?.classList.add('hidden');
    this.$('act-stage')?.classList.remove('act-danger');
    this.resolveRound({ score, kind: score >= 60 ? 'hit' : 'short', power: score / 100, msg });
  }

  // Keyboard alternative: hold ArrowUp to raise (always "straight"), then press
  // ArrowDown / Enter to drop. The drop from the keyboard counts as a fixed,
  // solid strike (90) so the game stays playable without a touch screen.
  static swipeKey(e, isDown) {
    const st = this._st;
    if (this.busy || !st || !st.running) return;
    if (e.key === 'ArrowUp' && st.phase === 'up') {
      e.preventDefault();
      if (isDown) {
        st.kb = true; st.maxDev = 0; st.h = Math.min(1, st.h + 0.05);
        this.paintPose(0, 1, st.h);
        this.paintGauge(st.h, false);
      } else this.commitRise();
    } else if ((e.key === 'ArrowDown' || e.key === 'Enter') && st.phase === 'raised' && isDown) {
      e.preventDefault();
      this.gameState.playSound('kick');
      this.paintPose(1, 2, 1);
      this.finishDrop(90);
    }
  }

  // ==================================================================
  // 3) BIK CHAGI  180 pivot dial
  // ==================================================================
  static startPivot() {
    this._st = { running: true, total: 0, lastA: 0, dragging: false, lastTick: 0 };
    this.setDial(0);
    this.renderTexts();
  }

  static setDial(total) {
    const st = this._st;
    st.total = this.clamp(total, -360, 360);
    const deg = Math.abs(st.total);
    this.$('act-foot')?.setAttribute('transform', `rotate(${st.total} 120 120)`);
    const read = this.$('act-angle-read'); if (read) read.textContent = `${Math.round(deg)}°`;
    this.$('act-dial')?.setAttribute('aria-valuenow', String(Math.round(deg)));
    const tick = Math.floor(deg / 15);
    if (tick !== st.lastTick) { st.lastTick = tick; this.gameState.playSound('ratchet'); }
  }

  static dialAngle(e) {
    const r = this.$('act-dial').getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  }

  static pivotDown(e) {
    const st = this._st;
    if (this.busy || !st || !st.running) return;
    e.preventDefault();
    try { this.$('act-dial').setPointerCapture(e.pointerId); } catch (_) {}
    st.dragging = true; st.lastA = this.dialAngle(e);
  }

  static pivotMove(e) {
    const st = this._st;
    if (!st || !st.dragging || this.busy) return;
    const a = this.dialAngle(e);
    let d = a - st.lastA;
    if (d > 180) d -= 360; else if (d < -180) d += 360;                    // shortest way round
    st.lastA = a;
    this.setDial(st.total + d);
  }

  static pivotUp(e) {
    const st = this._st;
    if (!st) return;
    st.dragging = false;
    try { this.$('act-dial').releasePointerCapture(e.pointerId); } catch (_) {}
  }

  static pivotKey(e) {
    const st = this._st;
    if (this.busy || !st || !st.running) return;
    const step = e.shiftKey ? 1 : 5;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { e.preventDefault(); this.setDial(st.total + step); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); this.setDial(st.total - step); }
    else if (e.key === 'Home') { e.preventDefault(); this.setDial(0); }
    else if (e.key === 'Enter') { e.preventDefault(); this.kickPivot(); }
  }

  static kickPivot() {
    const st = this._st;
    if (this.busy || !st || !st.running) return;
    st.running = false;
    const a = Math.round(Math.abs(st.total));
    const err = Math.abs(a - 180);
    const score = err <= 5 ? 100 : Math.max(0, Math.round(100 - (err - 5) * 1.5));
    let kind, msg;
    if (err <= 5) {
      kind = 'hit';
      msg = { en: 'Perfect 180° pivot! A super side kick.', ar: 'لفّة 180° مظبوطة! ركلة جانبية خارقة.' };
    } else if (err <= 15) {
      kind = 'hit';
      msg = { en: `Good pivot (${a}°) — nearly exact.`, ar: `لفّة حلوة (${a}°) — قريبة من المطلوب.` };
    } else if (a < 180) {
      kind = 'fall';
      msg = { en: `You turned only ${a}° — the hips stay closed and the kick loses power.`, ar: `لفّيت ${a}° بس — الحوض بيفضل مقفول والركلة بتضعف.` };
    } else {
      kind = 'fall';
      msg = { en: `You turned ${a}° — too far. You lose your balance.`, ar: `لفّيت ${a}° — أكتر من اللازم. كده هتفقد توازنك.` };
    }
    this.resolveRound({ score, kind, power: kind === 'hit' ? 0.7 + 0.3 * (score - 77) / 23 : 0.3, msg });
  }
}

