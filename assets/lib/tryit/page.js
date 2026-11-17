// =====================================================================
// «جرّب بنفسك» 🎥 — the child kicks in front of the camera (or picks a video) and the club's
// computer-vision analyzer (assets/lib/tryit/analyzer.js, ported from their Python) scores the
// kick out of 100 and says which step went wrong. MediaPipe pose + hands run IN THE BROWSER:
// the picture never leaves the device. Ap Chagi and Naeryo Chagi (the two kicks the club wrote)
// and Bik Chagi (built here on the Ap Chagi analyzer, plus the standing foot's turn).
// =====================================================================
(function () {
  'use strict';
  const CV = window.TryItCV, T = (en, ar) => TKD.t(en, ar), N = (n) => (TKD.ar ? TKD.num(n) : String(n));
  const BASE = 'assets/lib/mediapipe';
  const HAND_LINES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
  const ALL_KICKS = [
    { id: 'apchagi', video: 'assets/videos/tryit/apchagi-coach.mp4' },
    { id: 'narochagi', video: 'assets/videos/tryit/naeryeochagi-coach.mp4' },
    { id: 'bakchagi3', video: 'assets/videos/tryit/bikchagi-coach.mp4' }
  ];
  // The club opens the page one kick at a time: Ap Chagi first. Naeryo and Bik Chagi are built and
  // tested (analyzer.js, their coach clips) — add their ids here to show them (and their clips to
  // VIDEO_FILES in sw.js).
  const OPEN_KICKS = ['apchagi', 'narochagi'];
  const KICKS = ALL_KICKS.filter(k => OPEN_KICKS.includes(k.id));
  const snapKick = (id) => !!CV.KICKS[id].SNAP;            // lift and fold → extend → pull back (Ap Chagi, Bik Chagi)
  // v65.4: phones (iPhone above all) crash the page ("a problem repeatedly occurred") when a big phone
  // video is decoded at full size and run through the full models every picture: on a phone the
  // the CPU on iPhone (its GPU path in Safari is fragile), pictures shrunk to 640px
  // before tracking, hands every 3rd picture, and at most MAX_FILE_SECONDS of a chosen video.
  const UA = navigator.userAgent || '';
  const IS_IOS = /iP(hone|ad|od)/.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const IS_PHONE = IS_IOS || /Android|Mobile/.test(UA);
  const MAX_FILE_SECONDS = 30;
  const GRADE = { 'Excellent': ['Excellent', 'ممتاز'], 'Good': ['Good', 'جيد'], 'Fair': ['Fair', 'مقبول'], 'Needs work': ['Needs work', 'يحتاج إلى تمرين'] };

  const TryIt = {
    kick: 'apchagi', mode: 'full', step: 1, source: 'cam', facing: 'user',
    running: false, live: true, an: null, sm: null, mp: null, pose: null, hands: null, stream: null,
    diag: { total: 0, poseOk: 0 }, stepState: {}, stepDone: false, gen: 0,

    root() { return document.getElementById('try-root'); },
    $(s) { return this.root()?.querySelector(s); },
    bestKey() { return `taekwondoJourneyTryIt:${TKD.pid() || 'guest'}`; },
    best() { return TKD.read(this.bestKey(), {}) || {}; },
    kickName(id) { return TKD.skillName ? TKD.skillName(id) : id; },

    // ------------------------------------------------------------------ the screen
    render() {
      const r = this.root(); if (!r) return;
      if (!KICKS.some(k => k.id === this.kick)) { this.kick = KICKS[0].id; this.step = snapKick(this.kick) ? 1 : 2; }
      const best = this.best()[this.kick];
      const bik = this.kick === 'bakchagi3';
      const steps = snapKick(this.kick)
        ? [[1, T('1 — Lift and fold the knee', '١ — ارفع الرجل واثنِ الركبة')], [2, bik ? T('2 — Turn the standing foot and extend', '٢ — لفّ قدم الارتكاز ومدّ الرجل') : T('2 — Extend the leg', '٢ — مدّ الرجل')], [3, T('3 — Pull back, then land', '٣ — اسحب الرجل ثم انزل')]]
        : [[2, T('Lift the leg and extend it', 'ارفع الرجل ومدّها')]];
      r.innerHTML = `
        <h2>🎥 ${T('Try it yourself', 'جرّب بنفسك')}</h2>
        <p class="description">${T('Kick in front of the camera and get a score out of 100. Put the phone far enough to see your whole body, from head to feet, and stand sideways.', 'اركل أمام الكاميرا واحصل على درجة من ١٠٠. ضع الهاتف بعيدًا ليظهر جسمك كله من الرأس إلى القدمين، وقف بالجانب.')}</p>
        <div class="ty-row" role="group" aria-label="${T('Kick', 'الركلة')}">
          ${KICKS.map(k => `<button type="button" class="ty-chip${k.id === this.kick ? ' on' : ''}" data-tykick="${k.id}">${TKD.esc(this.kickName(k.id))}</button>`).join('')}
        </div>
        <div class="ty-row" role="group" aria-label="${T('Mode', 'الوضع')}">
          <button type="button" class="ty-chip${this.mode === 'full' ? ' on' : ''}" data-mode="full">🔥 ${T('Full kick (score)', 'الركلة كاملة (درجة)')}</button>
          <button type="button" class="ty-chip${this.mode === 'step' ? ' on' : ''}" data-mode="step">🎯 ${T('Step by step', 'خطوة بخطوة')}</button>
        </div>
        ${this.mode === 'step' ? `<div class="ty-row">${steps.map(([n, t]) => `<button type="button" class="ty-chip ty-small${n === this.step ? ' on' : ''}" data-step="${n}">${t}</button>`).join('')}</div>` : ''}
        <p class="ty-status" id="ty-status" role="status"></p>
        <div class="ty-btns">
          <button type="button" class="btn btn-success" id="ty-start">📷 ${T('Start the camera', 'شغّل الكاميرا')}</button>
          <label class="btn ty-file">📁 ${T('Choose a video', 'اختر فيديو')}<input type="file" id="ty-file" accept="video/*" hidden></label>
          <button type="button" class="btn" id="ty-calc" hidden>🧮 ${T('Calculate the score', 'احسب الدرجة')}</button>
          <button type="button" class="btn" id="ty-again" hidden>🔄 ${T('Again', 'من جديد')}</button>
          <button type="button" class="btn" id="ty-flip" hidden>🔁 ${T('Other camera', 'الكاميرا الأخرى')}</button>
          <button type="button" class="btn" id="ty-stop" hidden>⏹ ${T('Stop', 'أوقف')}</button>
        </div>
        <div class="ty-stage">
          <figure class="ty-pane ty-coach"><video id="ty-coach" src="${KICKS.find(k => k.id === this.kick).video}" poster="${KICKS.find(k => k.id === this.kick).video.replace('.mp4', '.webp')}" muted loop playsinline preload="metadata"></video>
            <figcaption>📺 ${T('Watch', 'شاهد')}</figcaption></figure>
          <figure class="ty-pane ty-me"><video id="ty-video" muted playsinline aria-hidden="true"></video><canvas id="ty-canvas" width="360" height="640"></canvas>
            <div class="ty-hud" id="ty-hud" aria-live="polite"></div>
            <div class="ty-idle" id="ty-idle"><span>📷</span><p>${T('You will appear here', 'ستظهر هنا')}</p></div>
            <figcaption>🧍 ${T('You', 'أنت')}</figcaption></figure>
        </div>
        <div class="ty-acc" id="ty-acc" hidden><span>${T('Step accuracy', 'دقة الخطوة')}</span><div class="ty-bar"><i id="ty-acc-fill"></i></div><b id="ty-acc-n">0%</b></div>
        <div class="ty-result" id="ty-result" hidden></div>
        <p class="ty-best" id="ty-best">${best ? `🏅 ${T('Your best', 'أفضل نتيجة لك')}: <b>${N(Math.round(best))}</b> / ${N(100)}` : ''}</p>
        <p class="ty-privacy">🔒 ${T('The camera stays on this device — nothing is recorded or sent.', 'الكاميرا تبقى على هذا الجهاز — لا شيء يُسجَّل أو يُرسَل.')}</p>
        <div class="center-buttons"><button type="button" class="btn back-btn" id="ty-back">← ${T('Back to my road', 'ارجع إلى الطريق')}</button></div>`;
      r.querySelectorAll('[data-tykick]').forEach(b => b.addEventListener('click', () => { this.stop(); this.kick = b.dataset.tykick; this.step = snapKick(this.kick) ? 1 : 2; this.render(); }));
      r.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { this.stop(); this.mode = b.dataset.mode; this.step = snapKick(this.kick) ? 1 : 2; this.render(); }));
      r.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { this.step = +b.dataset.step; const run = this.running; if (!run) return this.render(); this.resetRun(); r.querySelectorAll('[data-step]').forEach(x => x.classList.toggle('on', x === b)); }));
      this.$('#ty-start').addEventListener('click', () => this.startCamera());
      this.$('#ty-file').addEventListener('change', (e) => { const f = e.target.files?.[0]; if (f) this.startFile(f); e.target.value = ''; });
      this.$('#ty-calc').addEventListener('click', () => this.calc(true));
      this.$('#ty-again').addEventListener('click', () => { this.resetRun(); this.showResult(null); });
      this.$('#ty-flip').addEventListener('click', () => { this.facing = this.facing === 'user' ? 'environment' : 'user'; this.startCamera(); });
      this.$('#ty-stop').addEventListener('click', () => { this.stop(); this.render(); });
      this.$('#ty-back').addEventListener('click', () => switchScreen('home'));
      const coach = this.$('#ty-coach'); coach.play?.().catch(() => {});
    },
    status(t, kind) { const s = this.$('#ty-status'); if (s) { s.textContent = t || ''; s.className = 'ty-status' + (kind ? ' ' + kind : ''); } },
    buttons() {
      const on = this.running, full = this.mode === 'full';
      const show = (id, v) => { const b = this.$(id); if (b) b.hidden = !v; };
      show('#ty-start', !on); show('#ty-stop', on); show('#ty-flip', on && this.live);
      show('#ty-calc', on && full && this.live && !(this.an && this.an.final));
      show('#ty-again', on && this.live);
      const f = this.root()?.querySelector('.ty-file'); if (f) f.hidden = on;
      const acc = this.$('#ty-acc'); if (acc) acc.hidden = !(on && !full);
    },

    // ------------------------------------------------------------------ the engine
    async engine(fresh) {
      if (!this.mp) {
        const mod = await import(new URL(`${BASE}/vision_bundle.mjs`, document.baseURI).href);
        const files = await mod.FilesetResolver.forVisionTasks(new URL(`${BASE}/wasm`, document.baseURI).href);
        this.mp = { mod, files };
      }
      if (this.pose && this.hands && !fresh) return;
      try { this.pose?.close(); this.hands?.close(); } catch (e) {}
      const { mod, files } = this.mp;
      const make = async (delegate) => {
        const pose = await mod.PoseLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: `${BASE}/pose_landmarker_${this.lite ? 'lite' : 'full'}.task`, delegate },
          runningMode: 'VIDEO', numPoses: 1, minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5, minTrackingConfidence: 0.5 });
        const hands = await mod.HandLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: `${BASE}/hand_landmarker.task`, delegate },
          runningMode: 'VIDEO', numHands: 2, minHandDetectionConfidence: 0.3, minHandPresenceConfidence: 0.3, minTrackingConfidence: 0.3 });
        return [pose, hands];
      };
      if (IS_IOS && !this.delegate) this.delegate = 'CPU';
      try { [this.pose, this.hands] = await make(this.delegate || 'GPU'); this.delegate = this.delegate || 'GPU'; }
      catch (e) { this.delegate = 'CPU'; [this.pose, this.hands] = await make('CPU'); }
      this.ts = 0;
    },
    resetRun() {
      this.an = new CV.KickAnalyzer(this.kick, 0);
      this.sm = new CV.Smoother(3);
      this.diag = { total: 0, poseOk: 0 }; this.stepState = {}; this.stepDone = false; this.fc = 0; this.handsRes = null; this.noteUntil = 0; this.autoAt = 0;
      this.fps = 0; this.tPrev = 0; this.slow = 0; this.steadyAt = 0; this.goAt = 0; this.go = !this.live; this.lastBeep = -1;
      this.buttons();
    },
    async begin() {
      this.gen++; const gen = this.gen;
      this.status(T('Getting the camera eyes ready… (the first time takes a little longer)', 'نجهّز عيون الكاميرا… (أول مرة تأخذ وقتًا أطول قليلًا)'), 'wait');
      try { await this.engine(!this.live); }
      catch (e) { console.error('TryIt engine', e); this.status(T('This device could not start the body tracker. Try another browser or device.', 'تعذّر تشغيل متتبّع الجسم على هذا الجهاز. جرّب متصفحًا أو جهازًا آخر.'), 'bad'); return false; }
      if (gen !== this.gen) return false;
      this.running = true; this.resetRun(); this.showResult(null);
      const idle = this.$('#ty-idle'); if (idle) idle.hidden = true;
      this.status('');
      return true;
    },
    async startCamera() {
      this.stop(true);
      this.live = true; this.source = 'cam';
      const v = this.$('#ty-video'); if (!v) return;
      if (!navigator.mediaDevices?.getUserMedia) { this.status(T('This browser does not give access to the camera. Open the game from its https link.', 'هذا المتصفح لا يسمح بالكاميرا. افتح اللعبة من رابطها (https).'), 'bad'); return; }
      this.status(T('Asking for the camera…', 'نطلب الإذن بالكاميرا…'), 'wait');
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: this.facing, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } } });
      } catch (e) {
        this.status(e && e.name === 'NotAllowedError' ? T('The camera was not allowed. Allow it from the browser, then try again.', 'لم يُسمح بالكاميرا. اسمح بها من المتصفح ثم حاول مرة أخرى.')
          : T('No camera was found on this device. You can choose a video instead.', 'لم نجد كاميرا على هذا الجهاز. يمكنك اختيار فيديو بدلًا منها.'), 'bad');
        return;
      }
      v.srcObject = this.stream; v.removeAttribute('src');
      try { await v.play(); } catch (e) {}
      const set = this.stream.getVideoTracks()[0]?.getSettings?.() || {};
      this.mirror = (set.facingMode || this.facing) !== 'environment';
      this.$('#ty-canvas')?.classList.toggle('is-mirror', this.mirror);
      if (!(await this.begin())) return;
      this.loop();
    },
    async startFile(file) {
      this.stop(true);
      this.live = false; this.source = 'file'; this.mirror = false;
      const v = this.$('#ty-video'); if (!v) return;
      this.$('#ty-canvas')?.classList.remove('is-mirror');
      this.fileUrl = URL.createObjectURL(file);
      v.srcObject = null; v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.disableRemotePlayback = true; v.preload = 'auto';
      v.src = this.fileUrl; v.load();
      // iPhone (Safari) loads a chosen video only as far as its size (no picture) until it is played
      // once, and a phone video can be large (HEVC .mov): wait for the size, then play it a moment
      // (muted) so a first picture is decoded, then pause and read it frame by frame.
      const wait = (ev, ms) => new Promise(res => { let done = false; const fin = (x) => { if (!done) { done = true; v.removeEventListener(ev, on); v.removeEventListener('error', no); res(x); } };
        const on = () => fin(true), no = () => fin(false); v.addEventListener(ev, on); v.addEventListener('error', no); setTimeout(() => fin(null), ms); });
      this.status(T('Opening the video…', 'نفتح الفيديو…'), 'wait');
      let ok = v.readyState >= 1 || await wait('loadedmetadata', 20000);
      if (ok !== false && v.readyState < 2) { try { await v.play(); } catch (e) {} ok = v.readyState >= 2 || await wait('loadeddata', 15000); try { v.pause(); } catch (e) {} }
      ok = ok !== false && v.readyState >= 2;
      if (!ok || !v.videoWidth) { this.status(T('This video could not be opened on this phone. Try a shorter video (a few seconds, just the kick), or record it with the camera here.', 'تعذّر فتح هذا الفيديو على هذا الهاتف. جرّب فيديو أقصر (ثوانٍ قليلة للركلة فقط)، أو صوّره بالكاميرا من هنا.'), 'bad'); return; }
      if (!(await this.begin())) return;
      const gen = this.gen, dt = IS_PHONE ? 1 / 15 : 1 / 30, live = () => this.running && gen === this.gen;
      // v65.3: iPhone may not know the length yet (0 / NaN / Infinity) — wait for it a little
      for (let k = 0; k < 30 && !(isFinite(v.duration) && v.duration > 0.3); k++) await new Promise(r => setTimeout(r, 100));
      const dur = isFinite(v.duration) && v.duration > 0 ? Math.min(v.duration, MAX_FILE_SECONDS) : 0;
      if (v.duration > MAX_FILE_SECONDS + 1) TKD.toast(T(`Only the first ${MAX_FILE_SECONDS} seconds are read — a short video of just the kick works best.`, `نقرأ أول ${N(MAX_FILE_SECONDS)} ثانية فقط — الأفضل فيديو قصير للركلة وحدها.`), 'warning');
      const pct = (t) => { if (dur) this.status(T(`Reading the video… ${Math.round(100 * Math.min(t, dur) / dur)}%`, `نقرأ الفيديو… ${N(Math.round(100 * Math.min(t, dur) / dur))}٪`), 'wait'); };
      // 1) every frame, in order (like the Python on an uploaded video): the same video → the same score
      const seek = (t) => new Promise(res => { let moved = false; const done = () => { v.removeEventListener('seeked', done); res(moved); }; v.addEventListener('seeked', () => { moved = true; }, { once: true }); v.addEventListener('seeked', done); v.currentTime = t; setTimeout(done, 1500); });
      let missed = 0, frames = 0;
      for (let t = 0, i = 0; t < dur && live(); t += dt, i++) {
        if (!(await seek(t))) missed++;
        this.process(t, v); frames++;
        if (this.mode === 'step' && this.stepDone) break;
        if (missed >= 4 && missed > frames / 2) break;          // this browser does not step through the video: play it instead
        if (i % 3 === 0) { pct(t); await new Promise(r => setTimeout(r, 0)); }
      }
      // 2) iPhone: stepping did not work (or the length was unknown) — play the video, slowly, and
      //    read every picture it shows (like the live camera)
      const stepped = dur && frames >= Math.min(20, dur * 30 * 0.5) && missed <= frames / 2;
      if (live() && !stepped && !(this.mode === 'step' && this.stepDone)) {
        this.resetRun(); this.running = true;
        v.currentTime = 0; v.playbackRate = 0.5; v.loop = false;
        await new Promise(res => {
          let lastT = -1; const rvfc = typeof v.requestVideoFrameCallback === 'function';
          const end = () => { v.removeEventListener('ended', end); res(); };
          v.addEventListener('ended', end);
          const tick = (now, meta) => {
            if (!live() || v.ended) return end();
            const t = meta && typeof meta.mediaTime === 'number' ? meta.mediaTime : v.currentTime;
            if (t > MAX_FILE_SECONDS) { v.pause(); return end(); }
            if (t !== lastT && v.readyState >= 2) { lastT = t; this.process(t, v); pct(t); }
            if (this.mode === 'step' && this.stepDone) { v.pause(); return end(); }
            rvfc ? v.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
          };
          v.play().then(() => (rvfc ? v.requestVideoFrameCallback(tick) : requestAnimationFrame(tick))).catch(end);
          setTimeout(end, Math.max(20000, (dur || 30) * 2500));
        });
        try { v.pause(); } catch (e) {}
      }
      if (gen !== this.gen || !this.running) return;
      this.status('');
      if (this.mode === 'full') this.calc(true);
      else if (!this.stepDone) this.status(T('The step was not seen in this video.', 'لم نرَ الخطوة في هذا الفيديو.'), 'bad');
    },
    loop() {
      const gen = this.gen, v = this.$('#ty-video');
      const tick = () => {
        if (!this.running || gen !== this.gen || !document.querySelector('#try-screen.active')) return;
        if (v && v.readyState >= 2 && v.videoWidth && v.currentTime !== this.lastVT) { this.lastVT = v.currentTime; this.process(performance.now() / 1000, v); }
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    },
    // one frame: track → measure → evaluate → draw
    process(t, v) {
      const W = 640, H = Math.round(640 * v.videoHeight / v.videoWidth);
      const now = performance.now(); this.ts = Math.max(this.ts + 1, Math.round(now));
      let lm = null;
      // the picture is shrunk to 640px wide before tracking (a phone video can be 4K: too much to track)
      let src = v;
      if (v.videoWidth > 720) {
        const wk = this.work || (this.work = document.createElement('canvas'));
        if (wk.width !== W || wk.height !== H) { wk.width = W; wk.height = H; }
        wk.getContext('2d', { willReadFrequently: false }).drawImage(v, 0, 0, W, H); src = wk;
      }
      try {
        lm = this.pose.detectForVideo(src, this.ts).landmarks?.[0] || null;
        this.fc++;
        // hands are heavy: every 3rd picture live and on phones; a chosen video on a computer: every picture
        if ((!this.live && !IS_PHONE) || this.fc % 3 === 1) this.handsRes = this.hands.detectForVideo(src, this.ts);
      } catch (e) { console.warn('TryIt frame', e); return; }
      this.diag.total++;
      const m = lm ? CV.measure(lm, (this.handsRes && this.handsRes.landmarks) || [], W, H, t, this.sm) : null;
      if (m) this.diag.poseOk++;
      if (this.live) { const dt = this.tPrev ? (now - this.tPrev) / 1000 : 0; this.tPrev = now; if (dt > 0) this.fps = this.fps ? 0.9 * this.fps + 0.1 / dt : 1 / dt; }
      const hud = [], an = this.an, full = this.mode === 'full';
      if (!m) hud.push(['warn', T('Show your whole body, from head to feet!', 'أظهر جسمك كله من الرأس إلى القدمين!')]);
      else if (full) {
        // v65.3 (the testers): with the camera the child needs time to put the phone down, step back
        // and stand. Nothing is counted until the whole body has been seen standing still (both feet
        // down) for a moment, then a 3-2-1 countdown; only then does the kick start to count.
        if (!this.go) {
          const still = m.R.grounded && m.L.grounded;
          if (!still) { this.steadyAt = 0; this.goAt = 0; hud.push(['warn', T('Stand ready with both feet down, whole body in the picture', 'قف مستعدًّا والقدمان على الأرض، وجسمك كله في الصورة')]); }
          else if (!this.steadyAt) this.steadyAt = now;
          if (still && !this.goAt && now - this.steadyAt > 1200) this.goAt = now + 3000;
          if (this.goAt) {
            const left = Math.ceil((this.goAt - now) / 1000);
            if (left !== this.lastBeep) { this.lastBeep = left; TKD.gs()?.playSound(left > 0 ? 'click' : 'success'); }
            if (left > 0) hud.push(['ok big', T(`Get ready… ${left}`, `استعد… ${N(left)}`)]);
            else { this.go = true; this.sm = new CV.Smoother(3); }
          } else if (still) hud.push(['info', T('Stay still…', 'اثبت مكانك…')]);
          if (!this.go) { this.draw(v, m, W, H); const hudEl = this.$('#ty-hud'); const html = hud.map(([c, x]) => `<span class="${c}">${TKD.esc(x)}</span>`).join(''); if (hudEl && hudEl.dataset.h !== html) { hudEl.dataset.h = html; hudEl.innerHTML = html; } return; }
        }
        if (an.final === null && !an.landed) {
          const hs = CV.KickAnalyzer.handState(m);
          hud.push([hs === 'ok' ? 'ok' : hs === 'nohand' ? 'warn' : 'bad', { ok: T('Hand up, fist closed ✓', 'اليد مرفوعة والقبضة مغلقة ✓'), nohand: T('Hand not seen (not counted against you)', 'اليد غير ظاهرة (لا تُحسب عليك)'),
            open: T('Close your fist!', 'أغلق قبضتك!'), low: T('Raise your fist above the chest!', 'ارفع قبضتك فوق الصدر!') }[hs]]);
          an.update(m);
          if (an.note) { this.noteUntil = now + 2200; an.note = ''; }
          const h = an.hint();
          hud.push([an.landed ? 'ok' : 'info', { stand: T('Stand ready, both feet down', 'قف مستعدًّا والقدمان على الأرض'), ready: T('Ready — start the kick!', 'جاهز — ابدأ الركلة!'),
            chamber: T('Lift the leg and fold the knee', 'ارفع الرجل واثنِ الركبة'), snap: this.kick === 'bakchagi3' ? T('Turn the standing foot and extend the leg!', 'لفّ قدم الارتكاز ومدّ الرجل!') : T('Extend the leg fully!', 'مدّ الرجل تمامًا!'), retract: T('Pull the knee back, then land', 'اسحب الركبة ثم انزل'),
            lift_extend: T('Lift the leg straight, then bring it down', 'ارفع الرجل مفرودة ثم أنزلها'), done: T('Kick complete!', 'اكتملت الركلة!') }[h]]);
          if (an.live_warn) hud.push(['bad', T('Keep the leg STRAIGHT!', 'أبقِ الرجل مفرودة!')]);
          if (now < this.noteUntil) hud.push(['bad', T('The kick was not completed — try again', 'لم تكتمل الركلة — حاول مرة أخرى')]);
          if (an.landed && this.live && !this.autoAt) this.autoAt = now + 500;      // the foot landed: the score comes by itself
        }
      } else if (!this.stepDone) {
        const s = CV.stepCheck(this.kick, this.step, m, 0, this.stepState);
        const fill = this.$('#ty-acc-fill'), n = this.$('#ty-acc-n'); if (fill) fill.style.width = `${Math.round(s.acc * 100)}%`; if (n) n.textContent = `${N(Math.round(s.acc * 100))}%`;
        if (s.ok) { this.stepDone = true; TKD.gs()?.playSound('success'); }
        else hud.push(['info', { fold: T('Lift the leg and fold the knee', 'ارفع الرجل واثنِ الركبة'), extend: T('Lift the leg and extend the knee', 'ارفع الرجل ومدّ الركبة'), pivot: T('Turn the standing foot: the heel toward the target', 'لفّ قدم الارتكاز: الكعب في اتجاه الهدف'),
          pull_back: T('Pull the knee back (folded), then land', 'اسحب الركبة (مثنيّة) ثم انزل'), land: T('Now land the foot', 'الآن أنزل القدم') }[s.msg]]);
      }
      if (!full && this.stepDone) hud.push(['ok big', T('Well done! ✓', 'أحسنت! ✓')]);
      if (this.live && this.fps && this.fps < 15) { this.slow++; hud.push(['warn', T('This device is slow: part of the kick may be missed', 'الجهاز بطيء: قد يفوتنا جزء من الركلة')]); }
      this.draw(v, m, W, H);
      const hudEl = this.$('#ty-hud'); const html = hud.map(([c, x]) => `<span class="${c}">${TKD.esc(x)}</span>`).join('');
      if (hudEl && hudEl.dataset.h !== html) { hudEl.dataset.h = html; hudEl.innerHTML = html; }
      if (this.autoAt && now >= this.autoAt && an.final === null) { this.autoAt = 0; this.calc(false); }
      // (v65.6: no switch to the light body model any more — it measures the knee ~15° lower, and a
      //  correct Naeryo Chagi was penalised as "bent". The full model is used everywhere.)
    },
    draw(v, m, W, H) {
      const cv = this.$('#ty-canvas'); if (!cv) return;
      const cw = Math.min(540, v.videoWidth), chh = Math.round(cw * v.videoHeight / v.videoWidth);
      if (cv.width !== cw || cv.height !== chh) { cv.width = cw; cv.height = chh; }
      const g = cv.getContext('2d'), k = cw / W;
      g.drawImage(v, 0, 0, cw, chh);
      if (!m) return;
      g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.85)';
      for (const hl of m._hands) for (const [a, b] of HAND_LINES) { g.beginPath(); g.moveTo(hl[a].x * cw, hl[a].y * chh); g.lineTo(hl[b].x * cw, hl[b].y * chh); g.stroke(); }
      const P = m._px, side = (this.an && this.an.side) || (m.R.thigh >= m.L.thigh ? 'R' : 'L');
      const leg = (o, col) => { g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(o.HIP[0] * k, o.HIP[1] * k); g.lineTo(o.KNEE[0] * k, o.KNEE[1] * k); g.lineTo(o.ANKLE[0] * k, o.ANKLE[1] * k); g.lineTo(o.FOOT[0] * k, o.FOOT[1] * k); g.stroke(); };
      leg(side === 'R' ? P.l : P.r, 'rgba(126,232,214,.9)'); leg(side === 'R' ? P.r : P.l, 'rgba(255,209,102,.95)');
      g.fillStyle = '#ffeb3b';
      for (const o of [P.r, P.l]) for (const q of [o.HIP, o.KNEE, o.ANKLE, o.FOOT]) { g.beginPath(); g.arc(q[0] * k, q[1] * k, 5, 0, 6.3); g.fill(); }
    },

    // ------------------------------------------------------------------ the score
    calc(byButton) {
      const an = this.an; if (!an || this.mode !== 'full') return;
      const r = an.finalizeNow();
      if (!r.ok) {
        const d = this.diag;
        const why = { no_stance: T('I have not seen you standing ready yet: your whole body must be in the picture.', 'لم أرَك واقفًا مستعدًّا بعد: يجب أن يظهر جسمك كله في الصورة.'),
          not_started: T('I saw you standing, but the kick has not started yet.', 'رأيتك واقفًا، لكن الركلة لم تبدأ بعد.'), no_data: T('Not enough of the kick was seen yet.', 'لم نرَ ما يكفي من الركلة بعد.') }[r.reason] || '';
        const seen = d.total ? T(` (Your body was seen well in ${d.poseOk} of ${d.total} pictures.)`, ` (ظهر جسمك جيدًا في ${N(d.poseOk)} من ${N(d.total)} صورة.)`) : '';
        this.status(why + seen, 'bad');
        return;
      }
      this.status('');
      const f = an.final;
      TKD.gs()?.playSound(f.total >= 60 ? 'win' : 'click');
      const b = this.best(); if (!(b[this.kick] >= f.total)) { b[this.kick] = f.total; TKD.write(this.bestKey(), b); }
      this.showResult(f);
      this.buttons();
    },
    itemWhy(it, f) {
      const v = it.value === null || it.value === undefined ? null : Math.round(it.value), deg = (x) => `${N(Math.round(x))}°`;
      const name = { c_knee: T('Folding the leg before the extension', 'ثني الرجل قبل المدّ'), p_knee: T('Knee angle at full extension', 'زاوية الركبة عند تمام المدّ'), r_knee: T('The knee after the kick', 'الركبة بعد الركلة'),
        support: T('The standing knee (average)', 'ركبة رجل الارتكاز (المتوسط)'), pivot: T('The standing foot\'s turn at the extension', 'لفّة قدم الارتكاز عند المدّ'), stance: T('Ready stance', 'وقفة الاستعداد'), guard: T('Guard and fist (the whole movement)', 'الحراسة والقبضة (طوال الحركة)') }[it.key];
      let why = '';
      if (it.status === 'ok') why = T('Correct.', 'سليم.');
      else if (it.status === 'not_folded') why = T('The leg was not folded before extending. Lift the thigh and bend the knee first.', 'لم تُثنَ الرجل قبل المدّ. ارفع الفخذ واثنِ الركبة أولًا.');
      else if (it.status === 'no_retract') why = T(`The leg did not come back folded after the kick (${deg(it.value)}). Bend the knee again before putting the foot down.`, `لم ترجع الرجل مثنيّة بعد الركلة (${deg(it.value)}). اثنِ الركبة مرة أخرى قبل إنزال القدم.`);
      else if (it.key === 'pivot' && it.status === 'low') why = T(`${deg(it.value)}: the standing foot did not turn enough. Turn it until the heel points at the target (${deg(it.lo)} or more; the lesson says about 135°).`, `${deg(it.value)}: قدم الارتكاز لم تلفّ كفاية. لفّها حتى يتّجه الكعب إلى الهدف (${deg(it.lo)} أو أكثر، وفي الدرس حوالي ١٣٥°).`);
      else if (it.key === 'pivot' && it.status === 'not_measured') why = T('The standing foot was not seen well enough to measure its turn.', 'لم تظهر قدم الارتكاز جيدًا لقياس لفّتها.');
      else if (it.status === 'not_reached') why = T('The movement did not get this far.', 'لم تصل الحركة إلى هذه النقطة.');
      else if (it.status === 'not_measured') why = T('Could not be measured (the body was not seen well enough).', 'تعذّر القياس (لم يظهر الجسم جيدًا).');
      else if (it.status === 'low') why = it.key === 'support' ? T(`${deg(it.value)}: the standing leg was bent. Keep it straight and steady (${deg(it.lo)} or more).`, `${deg(it.value)}: رجل الارتكاز مثنيّة. أبقِها مفرودة وثابتة (${deg(it.lo)} أو أكثر).`)
        : it.key === 'r_knee' ? T(`${deg(it.value)}: the knee folded too tightly (${deg(it.lo)} or more).`, `${deg(it.value)}: الركبة مثنيّة أكثر من اللازم (${deg(it.lo)} أو أكثر).`)
        : T(`${deg(it.value)}: not fully extended. Straighten the knee more (${deg(it.lo)} or more).`, `${deg(it.value)}: المدّ ناقص. افرد الركبة أكثر (${deg(it.lo)} أو أكثر).`);
      else if (it.key === 'stance') why = T('No ready stance was seen before the kick.', 'لم نرَ وقفة استعداد قبل الركلة.');
      else if (it.key === 'guard') {
        const p = (x) => `${N(Math.round(x * 100))}٪`;
        why = it.status === 'too_short' ? T('The movement was too short to judge the hand.', 'الحركة أقصر من أن نحكم على اليد.')
          : it.status === 'not_seen' ? T(`The camera did not see your hand enough (${p(it.cover)} of the movement). Keep your hand in front of the camera.`, `لم ترَ الكاميرا يدك كفاية (${p(it.cover)} من الحركة). أبقِ يدك أمام الكاميرا.`)
          : T(`Hand up and closed in only ${p(it.ratio)} of the pictures (88% needed). ${it.lowPct > it.openPct ? 'The fist dropped below the chest.' : 'The hand was open.'}`,
              `اليد مرفوعة ومغلقة في ${p(it.ratio)} فقط من الصور (المطلوب ٨٨٪). ${it.lowPct > it.openPct ? 'القبضة نزلت تحت الصدر.' : 'اليد كانت مفتوحة.'}`);
      }
      return { name, why, v };
    },
    showResult(f) {
      const box = this.$('#ty-result'); if (!box) return;
      if (!f) { box.hidden = true; box.innerHTML = ''; return; }
      const R1 = (x) => N(Math.round(x * 10) / 10), g = GRADE[f.grade];
      const pens = f.penalties || [];
      const penWhy = (p) => ({ no_extend: T(`The leg was never straight while lifted. The kick is a straight leg going up.`, `لم تُفرد الرجل وهي مرفوعة. المطلوب رجل مفرودة ترتفع إلى أعلى.`),
        bend_before: T('The leg was bent before the extension. It must go up straight.', 'ثُنيت الرجل قبل المدّ. يجب أن ترتفع مفرودة.'),
        bend_after: T('The leg was bent after the extension. It must come down straight.', 'ثُنيت الرجل بعد المدّ. يجب أن تنزل مفرودة.'),
        extra_move: T('The leg went up more than once before landing. One straight lift, then down.', 'ارتفعت الرجل أكثر من مرة قبل النزول. المطلوب رفعة واحدة مفرودة ثم نزول.') }[p.key]);
      const lostBy = { stance: T('the ready stance', 'وقفة الاستعداد'), guard: T('the hand (guard / fist)', 'اليد (الحراسة / القبضة)') };
      const lines = f.groups.map(G => {
        const title = TKD.ar ? G.name.ar : G.name.en;
        if (G.ok) return `<li class="ok">✅ ${T(`${title}: done well`, `تم أداء «${title}» بنجاح`)}</li>`;
        if (G.id === 'Guard & fist') return G.items.filter(i => i.lost >= 0.5).map(i => `<li class="bad">❌ ${T(`${title}: ${Math.round(i.lost)} points lost because of ${lostBy[i.key]}`, `«${title}»: نقص ${N(Math.round(i.lost))} نقاط بسبب ${lostBy[i.key]}`)}</li>`).join('');
        return `<li class="bad">❌ ${T(`${title}: not done correctly`, `لم يُؤدَّ «${title}» بشكل صحيح`)}</li>`;
      }).join('');
      box.hidden = false;
      box.innerHTML = `<div class="ty-score"><div class="ty-ring" style="--p:${Math.round(f.total)}"><b>${N(Math.round(f.total))}</b><small>/ ${N(100)}</small></div>
          <div><h3>${T(g[0], g[1])}</h3><p>${TKD.esc(this.kickName(f.kick))}</p></div></div>
        ${pens.length ? `<div class="ty-pens"><b>⚠️ ${T('Not the required movement', 'ليست الحركة المطلوبة')}</b>${pens.map(p => `<p>❌ ${T(`${p.points} points off: `, `خصم ${N(p.points)} نقطة: `)}${penWhy(p)}</p>`).join('')}
          <small>${T('Score before the penalty', 'الدرجة قبل الخصم')}: ${N(Math.round(f.base))} / ${N(100)}</small></div>` : ''}
        <ul class="ty-lines">${lines}</ul>
        <div class="ty-groups">${f.groups.map(G => `<div><small>${TKD.esc(TKD.ar ? G.name.ar : G.name.en)}</small><b>${R1(G.got)}<i>/${N(G.max)}</i></b></div>`).join('')}</div>
        <details class="ty-det"><summary>${T('Details for the coach', 'تفاصيل للمدرّب')}</summary><ul>${f.items.map(it => { const x = this.itemWhy(it, f);
          return `<li><b>${TKD.esc(x.name)}</b> <span>${R1(it.got)} / ${N(it.max)}</span><p>${TKD.esc(x.why)}</p></li>`; }).join('')}</ul></details>
        <button type="button" class="btn btn-success" id="ty-retry">🔄 ${T('Try again', 'حاول مرة أخرى')}</button>`;
      box.querySelector('#ty-retry').addEventListener('click', () => { if (this.live && this.running) { this.resetRun(); this.showResult(null); } else { this.stop(); this.render(); } });
      const best = this.best()[this.kick], be = this.$('#ty-best'); if (be && best) be.innerHTML = `🏅 ${T('Your best', 'أفضل نتيجة لك')}: <b>${N(Math.round(best))}</b> / ${N(100)}`;
      box.scrollIntoView({ block: 'nearest', behavior: window.prefersReducedMotion?.() ? 'auto' : 'smooth' });
    },

    stop(keepUi) {
      this.gen++; this.running = false;
      cancelAnimationFrame(this.raf);
      try { this.stream?.getTracks().forEach(t => t.stop()); } catch (e) {}
      this.stream = null;
      const v = this.$('#ty-video'); if (v) { try { v.pause(); } catch (e) {} v.srcObject = null; if (v.getAttribute('src')) { v.removeAttribute('src'); v.load(); } }
      if (this.fileUrl) { URL.revokeObjectURL(this.fileUrl); this.fileUrl = null; }
      if (!keepUi) this.buttons();
    }
  };
  window.TryIt = TryIt;

  document.addEventListener('tkd:screen', (e) => {
    if (e.detail?.screenId === 'try') { TryIt.stop(true); TryIt.render(); }
    else if (e.detail?.previousScreen === 'try' || TryIt.running) TryIt.stop(true);      // leaving: the camera goes off
  });
  document.addEventListener('tkd:lang', () => { if (document.querySelector('#try-screen.active') && !TryIt.running) TryIt.render(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && TryIt.running && TryIt.live) { TryIt.stop(); TryIt.render(); } });
})();
