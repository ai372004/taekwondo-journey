/* =====================================================================
   TAEKWONDO JOURNEY — ARENA GAMES (v20)
   Three extra mini-games that work for EVERY kick, drawn on a <canvas>
   with a small animation engine (sprite cross-fades, motion trails,
   particles, shockwaves, slow-motion, camera shake):

     🪵 Board Break   — pick the right striking surface, aim, time the power,
                         then watch the boards split.
     🎯 Target Paddles — hit ONLY the paddle held at a real target for this
                         kick, as fast as you can.
     🥁 Kick Rhythm    — play the 5 phases of the kick in order, on the beat;
                         every hit poses your fighter, a full combo lands a kick.

   Loaded after game.js (uses GameConfig, GameState, WinnerSystem,
   ScreenManager, screenTimeout, prefersReducedMotion …).
   ===================================================================== */
'use strict';

// ---------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------
const AG = {
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  rand: (a, b) => a + Math.random() * (b - a),
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  easeOutBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  gs: () => (typeof GameStateInstance !== 'undefined' ? GameStateInstance : null),
  ar: () => AG.gs()?.currentLanguage === 'ar',
  t: (pair) => (AG.ar() ? pair.ar : pair.en),
  $: (id) => document.getElementById(id),
  reduced: () => (typeof prefersReducedMotion === 'function' ? prefersReducedMotion() : false)
};

// ---------------------------------------------------------------------
// Synth sounds that the core playSound() doesn't have (wood crack, drums,
// paddle smack). Routed through the game's master gain so mute works.
// ---------------------------------------------------------------------
const ArenaSound = {
  _noise: null,
  ctx() {
    const gs = AG.gs();
    if (!gs || !gs.soundEnabled || !gs.audioContext) return null;
    return gs.audioContext;
  },
  noiseBuf(ctx) {
    if (this._noise) return this._noise;
    const len = Math.floor(ctx.sampleRate * 0.6);
    const b = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return (this._noise = b);
  },
  burst({ dur = 0.2, freq = 1200, q = 1, type = 'bandpass', gain = 0.6, decay = 0.08 }) {
    const ctx = this.ctx(); if (!ctx) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuf(ctx);
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + Math.max(decay, 0.02) + dur * 0.2);
    src.connect(f); f.connect(g); g.connect(AG.gs().audioGain);
    src.start(now); src.stop(now + dur + 0.05);
  },
  tone({ f0 = 200, f1 = 60, dur = 0.15, type = 'sine', gain = 0.6 }) {
    const ctx = this.ctx(); if (!ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, now);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), now + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g); g.connect(AG.gs().audioGain);
    o.start(now); o.stop(now + dur + 0.02);
  },
  crack() {        // splitting wood: sharp snap + low thump + crackle tail
    this.burst({ dur: 0.08, freq: 3200, q: 0.8, type: 'highpass', gain: 0.9, decay: 0.03 });
    this.tone({ f0: 160, f1: 45, dur: 0.22, type: 'triangle', gain: 0.8 });
    setTimeout(() => this.burst({ dur: 0.25, freq: 1800, q: 2, gain: 0.35, decay: 0.12 }), 40);
  },
  thud() { this.tone({ f0: 110, f1: 50, dur: 0.18, type: 'sine', gain: 0.7 }); this.burst({ dur: 0.06, freq: 400, gain: 0.3, decay: 0.04, type: 'lowpass' }); },
  smack() { this.burst({ dur: 0.07, freq: 2400, q: 1.2, gain: 0.8, decay: 0.035 }); this.tone({ f0: 240, f1: 90, dur: 0.12, type: 'triangle', gain: 0.5 }); },
  whoosh() { this.burst({ dur: 0.22, freq: 900, q: 3, gain: 0.45, decay: 0.16 }); },
  drum(kind) {
    if (kind === 'kick') this.tone({ f0: 150, f1: 42, dur: 0.16, type: 'sine', gain: 0.9 });
    else if (kind === 'hat') this.burst({ dur: 0.04, freq: 8000, q: 0.7, type: 'highpass', gain: 0.25, decay: 0.025 });
    else if (kind === 'snare') { this.burst({ dur: 0.12, freq: 1800, q: 0.6, gain: 0.5, decay: 0.07 }); this.tone({ f0: 220, f1: 140, dur: 0.08, type: 'triangle', gain: 0.25 }); }
  },
  chime(i = 0) {    // rising notes for rhythm hits
    const notes = [523.25, 587.33, 659.25, 783.99, 880];
    this.tone({ f0: notes[i % notes.length], f1: notes[i % notes.length] * 1.01, dur: 0.18, type: 'triangle', gain: 0.35 });
  },
  buzz() { this.tone({ f0: 140, f1: 90, dur: 0.2, type: 'sawtooth', gain: 0.25 }); }
};

// ---------------------------------------------------------------------
// Image metadata: tight alpha bounding box, where the standing foot is,
// and the "strike point" (the furthest opaque pixel forward = the kicking
// foot). Computed once per image on a small offscreen copy.
// ---------------------------------------------------------------------
const ArenaImages = {
  cache: new Map(),
  load(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const p = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve({ img, meta: this.measure(img) });
      img.onerror = () => resolve(null);
      img.src = url.replace(/ /g, '%20');
    });
    this.cache.set(url, p);
    return p;
  },
  measure(img) {
    const W = img.naturalWidth, H = img.naturalHeight;
    const fallback = { w: W, h: H, x0: 0, y0: 0, x1: W, y1: H, footX: W * 0.42, strikeX: W * 0.9, strikeY: H * 0.4, topX: W * 0.5, topY: 0 };
    try {
      const s = Math.min(1, 220 / Math.max(W, H));
      const w = Math.max(1, Math.round(W * s)), h = Math.max(1, Math.round(H * s));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      const A = (x, y) => d[(y * w + x) * 4 + 3];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (A(x, y) > 40) {
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
      if (x1 < 0) return fallback;
      // standing foot: mean x of opaque pixels in the lowest 8% of the figure
      const band = Math.max(2, Math.round((y1 - y0) * 0.08));
      let sx = 0, n = 0;
      for (let y = y1 - band; y <= y1; y++) for (let x = x0; x <= x1; x++) if (A(x, y) > 40) { sx += x; n++; }
      const footX = n ? sx / n : (x0 + x1) / 2;
      // strike point: right-most opaque pixel above the lower 25% (the foot of a kick)
      let strikeX = x0, strikeY = (y0 + y1) / 2;
      const limitY = y1 - (y1 - y0) * 0.25;
      for (let y = y0; y < limitY; y++) for (let x = x1; x >= x0; x--) if (A(x, y) > 40) { if (x > strikeX) { strikeX = x; strikeY = y; } break; }
      // highest point (head, or the foot of an axe-kick rise)
      let topX = (x0 + x1) / 2;
      for (let x = x0; x <= x1; x++) if (A(x, y0) > 40) { topX = x; break; }
      const k = 1 / s;
      return { w: W, h: H, x0: x0 * k, y0: y0 * k, x1: (x1 + 1) * k, y1: (y1 + 1) * k, footX: footX * k, strikeX: strikeX * k, strikeY: strikeY * k, topX: topX * k, topY: y0 * k };
    } catch (e) {
      return fallback; // file:// or tainted canvas — use sensible defaults
    }
  }
};

// ---------------------------------------------------------------------
// ArenaStage — canvas, loop, camera, particles, texts
// ---------------------------------------------------------------------
class ArenaStage {
  constructor(canvas, { mat = true } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mat = mat;
    this.W = 800; this.H = 450; this.dpr = 1;
    this.particles = [];
    this.texts = [];
    this.rings = [];
    this.timeScale = 1;
    this._slow = null;
    this._shake = { mag: 0, t: 0, dur: 0 };
    this._flash = { a: 0, color: '#fff' };
    this._raf = 0;
    this._running = false;
    this.time = 0;
    this.motes = Array.from({ length: window.TKDLite?.() ? 8 : 22 }, () => ({ x: Math.random(), y: Math.random(), r: AG.rand(0.6, 2.2), v: AG.rand(0.004, 0.015), a: AG.rand(0.08, 0.28) }));
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(canvas);
    this.resize();
  }
  // v30: render scale. Sharpness costs pixels, and on a slow phone the pixel count
  // (not the game code) decides the frame rate — 1.5× fewer pixels ≈ 2× the fps.
  // So: never more than ~1 MP, and if frames get slow the stage quietly renders at
  // a lower scale (remembered for next time). The canvas keeps its size on screen.
  static get quality() {
    try { const q = +localStorage.getItem('tkdRenderQ'); if (q) return q; } catch (e) {}
    // first run: a small/old phone (≤4 cores or ≤3 GB) starts one step lower
    return ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3) ? 0.75 : 1;
  }
  static set quality(q) { try { localStorage.setItem('tkdRenderQ', String(q)); } catch (e) {} }
  pickDpr(w, h) {
    const want = Math.min(window.devicePixelRatio || 1, 2) * ArenaStage.quality;
    const budget = Math.sqrt(1.0e6 / Math.max(1, w * h));            // ≈ 1 megapixel max
    return Math.max(1, Math.min(want, budget));
  }
  watchFrames(raw) {
    const f = this._fw || (this._fw = { n: 0, sum: 0, warm: 0 });
    if (document.hidden || raw <= 0) return;
    if (f.warm < 1.2) { f.warm += raw; return; }                        // ignore the first second (loading, decoding)
    f.n++; f.sum += raw;
    if (f.n < 45) return;
    const avg = f.sum / f.n; f.n = 0; f.sum = 0;
    if (avg > 1 / 42 && this.dpr > 1.01) {                              // under ~42 fps → step down
      ArenaStage.quality = Math.max(0.5, +(ArenaStage.quality - 0.25).toFixed(2));
      document.documentElement.classList.add('lite');                     // the rest of the app eases off too
      f.warm = 0.6;
      this.resize();
    } else if (avg < 1 / 58 && ArenaStage.quality < 1) {                // plenty of headroom → creep back up slowly
      f.good = (f.good || 0) + 1;
      if (f.good >= 8) { f.good = 0; ArenaStage.quality = Math.min(1, ArenaStage.quality + 0.25); this.resize(); }
    }
  }
  resize() {
    const r = this.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.dpr = this.pickDpr(r.width, r.height);
    this.W = r.width; this.H = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.onResize && this.onResize(this.W, this.H);
  }
  start(update, draw) {
    this.update = update; this.draw = draw;
    if (this._running) return;
    this._running = true;
    let last = performance.now();
    const loop = (now) => {
      if (!this._running) return;
      // v27.1: a game left running on a screen the player already left stops itself —
      // before, every visited arena kept a hidden 60 fps loop and the app got heavier and heavier
      const scr = this._screen || (this._screen = this.canvas.closest('.screen'));
      if (!this.canvas.isConnected || (scr && !scr.classList.contains('active'))) { this.stop(); return; }
      const raw = Math.min((now - last) / 1000, 0.05);
      last = now;
      // v27.1: the game pauses (and stops drawing) while the menu is open, so the menu stays smooth
      const nav = this._nav || (this._nav = document.getElementById('collapsibleNav'));
      if (!document.hidden && !(nav && nav.classList.contains('active'))) { this.step(raw); this.watchFrames(raw); }
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }
  stop() {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  }
  destroy() { this.stop(); this._ro?.disconnect(); this.particles = []; this.texts = []; this.rings = []; }

  slowmo(scale, dur) { if (!AG.reduced()) this._slow = { scale, t: dur }; }
  shake(mag, dur = 0.3) { if (!AG.reduced()) this._shake = { mag, t: dur, dur }; }
  flash(color = '#fff', a = 0.6) { if (!AG.reduced()) this._flash = { a, color }; }

  step(raw) {
    if (this._slow) { this._slow.t -= raw; if (this._slow.t <= 0) this._slow = null; }
    this.timeScale = this._slow ? this._slow.scale : 1;
    const dt = raw * this.timeScale;
    this.time += dt;
    this.update && this.update(dt, raw);
    this.stepFx(dt, raw);
    this.render();
  }
  stepFx(dt, raw) {
    const g = 1100;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.ttl) { this.particles.splice(i, 1); continue; }
      const drag = Math.pow(p.drag ?? 0.15, dt);
      p.vx *= drag; p.vy = p.vy * drag + (p.grav ?? g) * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.spin) p.rot += p.spin * dt;
      if (p.floor && p.y > p.floor) { p.y = p.floor; p.vy *= -0.35; p.vx *= 0.6; p.spin *= 0.5; }
    }
    for (let i = this.texts.length - 1; i >= 0; i--) { const t = this.texts[i]; t.age += raw; if (t.age >= t.ttl) this.texts.splice(i, 1); }
    for (let i = this.rings.length - 1; i >= 0; i--) { const r = this.rings[i]; r.age += dt; if (r.age >= r.ttl) this.rings.splice(i, 1); }
    if (this._shake.t > 0) this._shake.t -= raw;
    if (this._flash.a > 0) this._flash.a = Math.max(0, this._flash.a - raw * 3.2);
    this.motes.forEach(m => { m.y -= m.v * raw; if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } });
  }

  // ---- spawners --------------------------------------------------------
  sparks(x, y, color = '#ffd166', n = 26, speed = 520) {
    if (AG.reduced()) n = Math.min(n, 6); else if (window.TKDLite?.()) n = Math.ceil(n * 0.6);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = AG.rand(0.35, 1) * speed;
      this.particles.push({ kind: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120, age: 0, ttl: AG.rand(0.3, 0.6), size: AG.rand(1.5, 3.5), color: AG.pick([color, '#ffffff', color]), drag: 0.05, grav: 700 });
    }
  }
  chips(x, y, n = 28, dir = 1, colors = ['#d9a55b', '#c0843f', '#f0c987', '#8f5a25'], floor = null) {
    if (AG.reduced()) n = Math.min(n, 8);
    for (let i = 0; i < n; i++) {
      const a = AG.rand(-1.1, 0.5) + (dir < 0 ? Math.PI : 0);
      const s = AG.rand(220, 720);
      this.particles.push({ kind: 'chip', x, y, vx: Math.cos(a) * s * dir, vy: Math.sin(a) * s - 180, age: 0, ttl: AG.rand(0.8, 1.6), w: AG.rand(3, 11), h: AG.rand(1.5, 3), rot: Math.random() * 6, spin: AG.rand(-18, 18), color: AG.pick(colors), drag: 0.35, floor });
    }
  }
  dust(x, y, n = 10, color = 'rgba(255,240,220,') {
    if (AG.reduced()) n = 3;
    for (let i = 0; i < n; i++) this.particles.push({ kind: 'dust', x: x + AG.rand(-20, 20), y: y + AG.rand(-6, 6), vx: AG.rand(-90, 90), vy: AG.rand(-70, -10), age: 0, ttl: AG.rand(0.5, 1), r: AG.rand(8, 20), color, drag: 0.08, grav: -30 });
  }
  confetti(x, y, n = 40) {
    if (AG.reduced()) n = 8;
    const cols = ['#ff6b35', '#2a9d8f', '#e9c46a', '#e76f51', '#ffd700', '#4dc9ff', '#b388ff'];
    for (let i = 0; i < n; i++) { const a = AG.rand(-Math.PI * 0.9, -Math.PI * 0.1); const s = AG.rand(260, 620); this.particles.push({ kind: 'chip', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, age: 0, ttl: AG.rand(1.2, 2), w: AG.rand(5, 9), h: AG.rand(3, 5), rot: Math.random() * 6, spin: AG.rand(-12, 12), color: AG.pick(cols), drag: 0.25, grav: 600 }); }
  }
  ring(x, y, color = '#fff', r1 = 90, ttl = 0.45, width = 5) { this.rings.push({ x, y, color, r1, ttl, age: 0, width }); }
  text(x, y, str, { color = '#fff', size = 30, ttl = 1.1, rise = 60, stroke = 'rgba(0,0,0,0.65)', weight = 900 } = {}) {
    this.texts.push({ x, y, str, color, size, ttl, rise, stroke, weight, age: 0 });
  }

  // ---- drawing ---------------------------------------------------------
  floorY() { return this.H * 0.88; }
  render() {
    const c = this.ctx, W = this.W, H = this.H;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    c.save();
    if (this._shake.t > 0) {
      const k = this._shake.mag * (this._shake.t / this._shake.dur);
      c.translate(AG.rand(-k, k), AG.rand(-k, k));
    }
    this.drawBackdrop(c);
    this.draw && this.draw(c, W, H);
    this.drawFx(c);
    c.restore();
    if (this._flash.a > 0) { c.globalAlpha = this._flash.a; c.fillStyle = this._flash.color; c.fillRect(0, 0, W, H); c.globalAlpha = 1; }
    this.drawOverlay && this.drawOverlay(c, W, H);
  }
  // v30: the wall, spotlight and mat never change during a round, so they are
  // painted ONCE into an off-screen canvas and copied each frame (one blit
  // instead of two full-screen gradients + 17 lines). 17 → 40 fps on a slow phone.
  drawBackdrop(c) {
    const W = this.W, H = this.H, fy = this.floorY();
    const key = `${W}|${H}|${this.dpr}|${this.spotX ?? ''}|${this.mat ? 1 : 0}`;
    if (this._bdKey !== key) {
      const oc = this._bd || (this._bd = document.createElement('canvas'));
      oc.width = Math.max(1, Math.round(W * this.dpr)); oc.height = Math.max(1, Math.round(H * this.dpr));
      const o = oc.getContext('2d');
      o.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.paintBackdrop(o, W, H, fy);
      this._bdKey = key;
    }
    c.drawImage(this._bd, 0, 0, W, H);
    // floating dust motes (alive, so drawn every frame — cheap)
    c.fillStyle = '#ffe9c7';
    this.motes.forEach(m => { c.globalAlpha = m.a; c.beginPath(); c.arc(m.x * W, m.y * fy, m.r, 0, Math.PI * 2); c.fill(); });
    c.globalAlpha = 1;
  }
  paintBackdrop(c, W, H, fy) {
    // back wall glow
    const wall = c.createLinearGradient(0, 0, 0, fy);
    wall.addColorStop(0, 'rgba(6,14,20,0.35)'); wall.addColorStop(1, 'rgba(10,24,32,0.8)');
    c.fillStyle = wall; c.fillRect(0, 0, W, fy);
    // spotlight cone
    const sx = this.spotX ?? W * 0.4;
    const spot = c.createRadialGradient(sx, fy, 10, sx, fy - H * 0.3, H * 0.9);
    spot.addColorStop(0, 'rgba(255,190,120,0.22)'); spot.addColorStop(1, 'rgba(255,190,120,0)');
    c.fillStyle = spot; c.fillRect(0, 0, W, H);
    // mat
    if (this.mat) {
      const mg = c.createLinearGradient(0, fy, 0, H);
      mg.addColorStop(0, '#1d4f91'); mg.addColorStop(1, '#0f2a52');
      c.fillStyle = mg; c.fillRect(0, fy, W, H - fy);
      c.fillStyle = 'rgba(220,60,60,0.85)'; c.fillRect(0, fy, W, 3);
      c.strokeStyle = 'rgba(255,255,255,0.07)'; c.lineWidth = 1;
      for (let i = -8; i <= 8; i++) { const x = W / 2 + i * W * 0.09; c.beginPath(); c.moveTo(x, fy); c.lineTo(W / 2 + i * W * 0.2, H); c.stroke(); }
    }
  }
  drawFx(c) {
    this.rings.forEach(r => {
      const t = r.age / r.ttl, e = AG.easeOutCubic(t);
      c.globalAlpha = 1 - t; c.strokeStyle = r.color; c.lineWidth = r.width * (1 - t) + 1;
      c.beginPath(); c.arc(r.x, r.y, 8 + r.r1 * e, 0, Math.PI * 2); c.stroke();
    });
    this.particles.forEach(p => {
      const t = p.age / p.ttl;
      c.globalAlpha = p.kind === 'dust' ? (1 - t) * 0.5 : Math.min(1, (1 - t) * 1.6);
      if (p.kind === 'spark') {
        c.strokeStyle = p.color; c.lineWidth = p.size; c.lineCap = 'round';
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); c.stroke();
      } else if (p.kind === 'chip') {
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.color; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore();
      } else if (p.kind === 'dust') {
        const rr = p.r * (1 + t * 1.5);
        const gr = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
        gr.addColorStop(0, p.color + '0.55)'); gr.addColorStop(1, p.color + '0)');
        c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y, rr, 0, Math.PI * 2); c.fill();
      }
    });
    c.globalAlpha = 1;
    this.texts.forEach(t => {
      const k = t.age / t.ttl;
      const pop = k < 0.18 ? AG.easeOutBack(k / 0.18) : 1;
      c.save();
      c.translate(t.x, t.y - t.rise * AG.easeOutCubic(k));
      c.scale(pop, pop);
      c.globalAlpha = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
      c.font = `${t.weight} ${t.size}px Cairo, Roboto, system-ui, sans-serif`;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = Math.max(3, t.size * 0.16); c.strokeStyle = t.stroke; c.lineJoin = 'round';
      c.strokeText(t.str, 0, 0); c.fillStyle = t.color; c.fillText(t.str, 0, 0);
      c.restore();
    });
    c.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------------
// ArenaFighter — draws the player's own kick photos on the canvas with a
// cross-fade between poses, the standing foot pinned to one spot, a
// motion trail while kicking and a little squash on impact.
// ---------------------------------------------------------------------
class ArenaFighter {
  constructor(stage, urls, { shared = false, mirror = false } = {}) {
    this.stage = stage;
    this.urls = urls;
    this.shared = shared;       // all frames share one canvas → one transform
    this.mirror = mirror;       // face LEFT (two-player duel: the right-hand fighter)
    this.frames = [];
    this.pose = 0; this.prev = 0; this.fade = 1; this.fadeDur = 0.09;
    this.x = 200; this.floor = 400; this.height = 300;
    this.lunge = 0; this.lungeTarget = 0;
    this.squash = 0;
    this.ghosts = [];
    this.alpha = 1;
    this.bob = 0;
    this.wobble = 0;
    this.tilt = 0;              // extra lean (radians) around the standing foot — Balance Hold
    this._seq = null;
  }
  async load() {
    const res = await Promise.all(this.urls.map(u => ArenaImages.load(u)));
    this.frames = res;
    this.ready = res.some(Boolean);
    return this.ready;
  }
  layout(x, floor, height) { this.x = x; this.floor = floor; this.height = height; }
  // transform for frame i: returns {s, ox, oy} so screen = (px*s+ox, py*s+oy)
  xf(i) {
    const f = this.frames[i] || this.frames.find(Boolean);
    if (!f) return null;
    const ref = this.shared ? (this.frames[0] || f) : f;
    const m = ref.meta;
    const s = this.height / Math.max(1, (m.y1 - m.y0));
    const ox = this.x + this.lunge - m.footX * s;
    const oy = this.floor - m.y1 * s;
    return { s, ox, oy, f };
  }
  get dir() { return this.mirror ? -1 : 1; }
  // screen x of the standing foot (lunge moves the fighter toward the side it faces)
  footScreenX() { return this.x + this.lunge * this.dir; }
  strikePoint(i) {
    const t = this.xf(i); if (!t) return { x: this.x + this.height * 0.5 * this.dir, y: this.floor - this.height * 0.6 };
    const x = t.f.meta.strikeX * t.s + t.ox, y = t.f.meta.strikeY * t.s + t.oy;
    if (!this.mirror) return { x, y };
    const px = this.x + this.lunge;                  // xf() places the unmirrored figure here
    return { x: 2 * px - x - 2 * this.lunge, y };
  }
  setPose(i, fadeDur = 0.09, ghost = false) {
    if (i === this.pose && this.fade >= 1) return;
    if (ghost && !AG.reduced()) this.ghosts.push({ pose: this.pose, a: 0.32, x: this.lunge });
    this.prev = this.pose; this.pose = i; this.fade = fadeDur > 0 ? 0 : 1; this.fadeDur = fadeDur;
  }
  // steps: [{pose, hold (s), fade (s), lunge (px), hit: fn}]
  play(steps, done) {
    this._seq = { steps, i: -1, t: 0, done };
    this._next();
  }
  _next() {
    const q = this._seq; if (!q) return;
    q.i++;
    if (q.i >= q.steps.length) { const d = q.done; this._seq = null; d && d(); return; }
    const st = q.steps[q.i];
    q.t = st.hold ?? 0.1;
    this.setPose(st.pose, st.fade ?? 0.07, st.ghost !== false);
    if (st.lunge !== undefined) this.lungeTarget = st.lunge;
    st.hit && st.hit();
  }
  update(dt) {
    if (this.fade < 1) this.fade = Math.min(1, this.fade + dt / Math.max(0.001, this.fadeDur));
    this.lunge = AG.lerp(this.lunge, this.lungeTarget, 1 - Math.pow(0.0005, dt));
    this.squash = Math.max(0, this.squash - dt * 4);
    this.wobble = Math.max(0, this.wobble - dt * 1.4);
    this.bob += dt;
    this.ghosts.forEach(g => (g.a -= dt * 1.6));
    this.ghosts = this.ghosts.filter(g => g.a > 0);
    if (this._seq) { this._seq.t -= dt; if (this._seq.t <= 0) this._next(); }
  }
  drawFrame(c, i, alpha, lungeOverride) {
    const t = this.xf(i); if (!t || alpha <= 0) return;
    const f = t.f;
    const lx = lungeOverride !== undefined ? lungeOverride - this.lunge : 0;
    const sq = this.squash;
    const breathe = this._seq ? 0 : Math.sin(this.bob * 2.2) * 0.008;
    c.save();
    c.globalAlpha = alpha * this.alpha;
    const px = this.x + this.lunge + lx, py = this.floor;
    if (this.mirror) {                                 // flip around the standing foot, then shift so lunge goes left
      c.translate(-2 * (this.lunge + lx), 0);
      c.translate(px, py); c.scale(-1, 1); c.translate(-px, -py);
    }
    c.translate(px, py);
    if (this.wobble > 0) c.rotate(Math.sin(this.bob * 22) * 0.08 * this.wobble);
    if (this.tilt) c.rotate(this.tilt);
    c.scale(1 + sq * 0.05, 1 - sq * 0.04 + breathe);
    c.translate(-px, -py);
    const dw = f.meta.w * t.s, dh = f.meta.h * t.s;
    c.drawImage(this.scaled(f, dw, dh), t.ox + lx, t.oy, dw, dh);
    c.restore();
  }
  // v30: the kick photos are big; shrinking one from full size every frame was
  // the fighter's whole cost. Each frame is resized once per layout and reused.
  scaled(f, dw, dh) {
    const dpr = this.stage?.dpr || 1, w = Math.max(1, Math.round(dw * dpr)), h = Math.max(1, Math.round(dh * dpr));
    if (!f.img || !f.img.width || w >= f.img.width) return f.img;       // already small enough
    const key = w + 'x' + h, sc = f._sc || (f._sc = new Map());      // frames are shared → keep a few sizes
    if (sc.has(key)) return sc.get(key);
    if (sc.size >= 4) sc.delete(sc.keys().next().value);
    const oc = document.createElement('canvas');
    oc.width = w; oc.height = h;
    const o = oc.getContext('2d'); o.imageSmoothingQuality = 'high';
    o.drawImage(f.img, 0, 0, w, h);
    sc.set(key, oc);
    return oc;
  }
  draw(c) {
    if (!this.ready) return;
    // soft floor shadow
    c.save();
    c.scale(1, 0.22);
    const fx = this.footScreenX();
    const sh = c.createRadialGradient(fx, this.floor / 0.22, 2, fx, this.floor / 0.22, this.height * 0.3);
    sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh; c.beginPath(); c.arc(fx, this.floor / 0.22, this.height * 0.3, 0, Math.PI * 2); c.fill();
    c.restore();
    this.ghosts.forEach(g => this.drawFrame(c, g.pose, g.a, g.x));
    if (this.fade < 1) this.drawFrame(c, this.prev, 1 - this.fade);
    this.drawFrame(c, this.pose, this.fade < 1 ? Math.min(1, this.fade * 1.4) : 1);
  }
}

// Frames for the current kick & character, in phase order
// (0 ready · 1 chamber · 2 extension/strike · 3 recoil · 4 return).
function arenaKickFrames(skillId, isBoy) {
  const skill = GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi;
  return skill.phases.map(p => (isBoy ? p.image.boy : p.image.girl));
}
function arenaSharedCanvas(skillId) { return skillId === 'narochagi' || skillId === 'apchagi'; }   // v27: both sets are baked on one canvas

// Striking-surface icons (side view of a foot, toes to the right).
function footIconSVG(part) {
  const hi = {
    ball:   '<ellipse cx="80" cy="57" rx="11" ry="6"/>',
    heel:   '<ellipse cx="22" cy="57" rx="10" ry="7"/>',
    instep: '<path d="M44 26 Q62 30 80 40 L76 46 Q60 38 42 34 Z"/>',
    blade:  '<path d="M14 60 Q54 66 94 58 L94 63 Q54 71 14 65 Z"/>'
  }[part] || '';
  return `<svg viewBox="0 0 110 72" aria-hidden="true">
    <path class="foot" d="M24 2 L42 2 L44 24 Q60 28 84 40 Q100 46 100 54 Q100 62 90 62 L24 62 Q12 62 12 50 Q12 42 20 36 Z"/>
    <circle class="foot" cx="95" cy="52" r="5"/><circle class="foot" cx="88" cy="47" r="4"/>
    <g class="hl">${hi}</g></svg>`;
}

// ---------------------------------------------------------------------
// Shared lifecycle for the three games
// ---------------------------------------------------------------------
class ArenaGameBase {
  // subclasses set: static SCREEN, GAME_ID, PREFIX, COPY
  static get ar() { return AG.ar(); }
  static t(pair) { return AG.t(pair); }
  static $(suffix) { return AG.$(`${this.PREFIX}-${suffix}`); }

  static async initialize(gameState) {
    this.teardown();
    this.gs = gameState;
    this.skillId = GameConfig.SKILLS[gameState.currentSkill] ? gameState.currentSkill : 'apchagi';
    this.isBoy = gameState.playerCharacter === 'boy';
    this.scores = [];
    this.round = 0;
    this.over = false;
    this.token = (this.token || 0) + 1;
    const tok = this.token;
    // v23: difficulty (easy / normal / hard) — the daily challenge is always normal
    this.D = window.TKDDifficulty ? TKDDifficulty.factors(this.GAME_ID) : { level: 'normal', speed: 1, window: 1, tol: 1 };
    this.applyDifficulty && this.applyDifficulty(this.D);
    this.abort = new AbortController();

    const canvas = this.$('canvas');
    if (!canvas) return;
    this.stage = new ArenaStage(canvas);
    this.fighter = (window.arenaMakeFighter || ((st, sk, b, o) => new ArenaFighter(st, arenaKickFrames(sk, b), { shared: arenaSharedCanvas(sk), ...o })))(this.stage, this.skillId, this.isBoy);
    this.stage.onResize = () => this.layout();
    this.renderTexts();
    this.setupUI();
    window.TKDDifficulty?.mountPicker(this);
    this.stage.start((dt, raw) => this.update(dt, raw), (c, W, H) => this.draw(c, W, H));
    await this.fighter.load();
    if (tok !== this.token) return;              // left the screen while loading
    this.layout();
    this.begin();
  }

  static teardown() {
    this.token = (this.token || 0) + 1;
    this.abort?.abort(); this.abort = null;
    this.stage?.destroy(); this.stage = null;
    (this._timers || []).forEach(clearTimeout); this._timers = [];
  }

  static later(fn, ms) {
    const tok = this.token;
    const id = setTimeout(() => { if (tok === this.token) fn(); }, ms);
    (this._timers ||= []).push(id);
    return id;
  }

  static on(el, ev, fn, opts = {}) { el?.addEventListener(ev, fn, { ...opts, signal: this.abort.signal }); }

  static setChip(suffix, text) { const el = this.$(suffix); if (el) el.textContent = text; }

  static renderTexts() {
    const C = this.COPY;
    this.setChip('title', this.t(C.title));
    this.setChip('how', this.t(C.how[this.skillId] || C.how.all));
    this.renderHud();
  }

  static renderHud() {
    const ar = this.ar;
    const total = this.totalRounds();
    this.setChip('round', ar ? `الجولة ${Math.min(Math.max(this.round, 1), total)} / ${total}` : `Round ${Math.min(Math.max(this.round, 1), total)} / ${total}`);
    const avg = this.average();
    this.setChip('score', ar ? `النتيجة: ${avg === null ? '—' : avg + '%'}` : `Score: ${avg === null ? '—' : avg + '%'}`);
  }

  static average() { return this.scores.length ? Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length) : null; }

  static refresh() { if (this.stage) { this.renderTexts(); this.refreshUI && this.refreshUI(); } }

  static finish(extra = {}) {
    if (this.over) return;
    this.over = true;
    const gs = this.gs;
    const acc = this.average() ?? 0;
    this.lastMeta = { ...(this.lastMeta || {}), level: this.D?.level || 'normal' };
    window.TKDDifficulty?.onResult(this.GAME_ID, acc);
    this.later(() => {
      if (acc >= GameConfig.SETTINGS.PASSING_SCORE) {
        const first = gs.completeGame(this.GAME_ID, acc, this.lastMeta || null);
        gs.playSound('win');
        WinnerSystem.show(this.GAME_ID, acc, gs, first);
      } else {
        gs.playSound('error'); window.Voice?.cue('again');
        gs.showNotification(this.ar ? `${acc}% — قربت! جرّب تاني عشان توصل ${GameConfig.SETTINGS.PASSING_SCORE}%` : `${acc}% — so close! Try again to reach ${GameConfig.SETTINGS.PASSING_SCORE}%`, 'warning');
        if (gs.trackFailure(acc, this.GAME_ID, this.lastMeta || null)) return;
        this.showRetry(acc);
      }
    }, extra.delay ?? 900);
  }

  static showRetry(acc) {
    const ui = this.$('ui'); if (!ui) return;
    const ar = this.ar;
    ui.innerHTML = `<div class="ag-card ag-center">
        <div class="ag-big">${acc}%</div>
        <p>${ar ? `محتاج ${GameConfig.SETTINGS.PASSING_SCORE}% عشان تعدّي. جرّب تاني!` : `You need ${GameConfig.SETTINGS.PASSING_SCORE}% to pass. Have another go!`}</p>
        <button type="button" class="btn btn-success" id="${this.PREFIX}-retry"><i class="fas fa-redo"></i> ${ar ? 'جرّب تاني' : 'Try again'}</button>
      </div>`;
    this.on(this.$('retry'), 'click', () => this.initialize(this.gs));
  }
}

// =====================================================================
// 🪵 BOARD BREAK
// =====================================================================
class BoardBreakGame extends ArenaGameBase {
  static SCREEN = 'board-break';
  static GAME_ID = 'board-break';
  static PREFIX = 'bb';
  static ROUNDS = [
    { boards: 1, aimSpeed: 1.0, powerSpeed: 0.9, zone: 0.16 },
    { boards: 1, aimSpeed: 1.3, powerSpeed: 1.15, zone: 0.14 },
    { boards: 2, aimSpeed: 1.6, powerSpeed: 1.35, zone: 0.12 },
    { boards: 3, aimSpeed: 1.9, powerSpeed: 1.6, zone: 0.11 }
  ];
  static totalRounds() { return this.ROUNDS.length; }

  static COPY = {
    title: { en: '🪵 Board Break', ar: '🪵 كسر الألواح' },
    how: {
      apchagi:   { en: 'Choose the part of the foot, aim at the centre of the board, then stop the power bar in the gold zone. The board is held in front of you at chest height.', ar: 'اختار جزء القدم الصح، صوّب على نص اللوح، ووقّف عداد القوة في المنطقة الذهبية. اللوح متمسك قدامك في مستوى الصدر.' },
      narochagi: { en: 'Choose the part of the foot, aim at the centre of the board held flat above head height, then stop the power bar in the gold zone — the heel comes down on it.', ar: 'اختار جزء القدم الصح، صوّب على نص اللوح اللي متمسك بالعرض فوق مستوى الراس، ووقّف عداد القوة في المنطقة الذهبية — الكعب بينزل عليه.' },
      bakchagi3: { en: 'Choose the part of the foot, aim at the centre of the board held at your side, then stop the power bar in the gold zone.', ar: 'اختار جزء القدم الصح، صوّب على نص اللوح اللي على جنبك، ووقّف عداد القوة في المنطقة الذهبية.' }
    }
  };

  static SURFACES = {
    ball:   { en: 'Ball of the foot', ar: 'مقدمة القدم (الكرة)' },
    heel:   { en: 'Heel', ar: 'الكعب' },
    instep: { en: 'Top of the foot (instep)', ar: 'ظهر القدم' },
    blade:  { en: 'Outer edge (blade)', ar: 'حافة القدم الخارجية' }
  };
  // full = 1, partial = 0.6
  static SURFACE_OK = {
    apchagi:   { ball: 1, instep: 0.6 },
    narochagi: { heel: 1 },
    bakchagi3: { blade: 1, heel: 1 }
  };
  static SURFACE_WHY = {
    apchagi:   { en: 'Ap Chagi strikes with the ball of the foot — toes pulled back.', ar: 'الآب تشاجي بيضرب بمقدمة القدم — والصوابع مشدودة لورا.' },
    narochagi: { en: 'Naeryeo Chagi drops the heel straight down onto the target.', ar: 'النارو تشاجي بينزّل الكعب لتحت على الهدف.' },
    bakchagi3: { en: 'The side kick lands with the heel / outer blade of the foot.', ar: 'الركلة الجانبية بتضرب بالكعب أو حافة القدم الخارجية.' }
  };

  static setupUI() {
    const wrap = this.$('wrap');
    this.on(wrap, 'pointerdown', (e) => { if (e.target.closest('button')) return; e.preventDefault(); this.tap(); });
    this.on(document, 'keydown', (e) => {
      if (!AG.$('board-break-screen')?.classList.contains('active')) return;
      if (e.code === 'Space' || e.code === 'Enter') { if (document.activeElement?.closest?.('button')) return; e.preventDefault(); this.tap(); }
    });
    this.on(this.$('action'), 'click', () => this.tap());
  }

  static begin() { this.nextRound(); }

  static layout() {
    const st = this.stage; if (!st) return;
    const W = st.W, H = st.H, fy = st.floorY();
    const figH = Math.min(H * 0.74, W * 0.62);
    const fx = W * (this.skillId === 'narochagi' ? 0.3 : 0.27);
    this.fighter.layout(fx, fy, figH);
    st.spotX = fx + figH * 0.2;
    // board sits where the kicking foot lands in the strike frame
    const hitPose = 2;
    const sp = this.fighter.strikePoint(hitPose);
    const thick = Math.max(10, figH * 0.035);
    const len = figH * 0.34;
    if (this.skillId === 'narochagi') {
      // axe kick: board held flat at head height; the heel travels from the
      // top of the rise down through it to the drop position
      const top = this.fighter.strikePoint(1);
      const y = AG.clamp(AG.lerp(top.y, sp.y, 0.55), fy - figH * 0.98, fy - figH * 0.72);
      this.board = { orient: 'h', x: sp.x - len * 0.55, y, len, thick };
    } else {
      this.board = { orient: 'v', x: sp.x + thick * 0.4, y: sp.y - len * 0.5, len, thick };
    }
    // keep the board on screen
    if (this.board.orient === 'v') this.board.x = Math.min(this.board.x, W - thick * 4 - 70);
    else this.board.x = Math.min(this.board.x, W - len - 70);
  }

  static nextRound() {
    this.round++;
    if (this.round > this.totalRounds()) { this.finish(); return; }
    const R = this.ROUNDS[this.round - 1];
    this.cfg = R;
    this.phase = 'surface';
    this.surfaceScore = 0; this.aim = 0; this.power = 0;
    this.aimT = Math.random() * 3; this.powerT = 0;
    this.pieces = null; this.broken = false; this.wob = 0;
    this.fighter.setPose(0, 0.12, false); this.fighter.lungeTarget = 0;
    this.renderHud();
    this.showSurfacePicker();
  }

  static showSurfacePicker() {
    const ui = this.$('ui'); if (!ui) return;
    const ar = this.ar;
    const parts = AG.shuffle(['ball', 'heel', 'instep', 'blade']);
    ui.innerHTML = `<div class="ag-card ag-surface">
        <p class="ag-q">${ar ? 'بأنهي جزء من القدم هتكسر اللوح؟' : 'Which part of the foot breaks the board?'}</p>
        <div class="ag-surface-grid">${parts.map(p => `
          <button type="button" class="ag-surface-btn" data-part="${p}">${footIconSVG(p)}<span>${this.t(this.SURFACES[p])}</span></button>`).join('')}
        </div></div>`;
    ui.querySelectorAll('.ag-surface-btn').forEach(b => this.on(b, 'click', (e) => { e.stopPropagation(); this.chooseSurface(b.dataset.part, b); }));
    this.setAction(null);
  }

  static chooseSurface(part, btn) {
    if (this.phase !== 'surface') return;
    const ok = this.SURFACE_OK[this.skillId] || {};
    this.surfaceScore = ok[part] || 0;
    window.Review?.note('surface', this.surfaceScore >= Math.max(...Object.values(ok)), { skill: this.skillId });
    const ui = this.$('ui');
    ui?.querySelectorAll('.ag-surface-btn').forEach(b => {
      const v = ok[b.dataset.part] || 0;
      b.disabled = true;
      if (v === 1) b.classList.add('is-right');
      if (b === btn && v < 1) b.classList.add(v > 0 ? 'is-partial' : 'is-wrong');
    });
    const why = this.t(this.SURFACE_WHY[this.skillId]);
    const msg = this.surfaceScore === 1 ? (this.ar ? '✅ صح! ' : '✅ Right! ') : this.surfaceScore > 0 ? (this.ar ? '🟡 قربت — ' : '🟡 Almost — ') : (this.ar ? '❌ لأ — ' : '❌ Not that one — ');
    const p = document.createElement('p'); p.className = 'ag-why'; p.textContent = msg + why;
    ui?.querySelector('.ag-card')?.appendChild(p);
    this.gs.playSound(this.surfaceScore > 0 ? 'success' : 'error');
    this.later(() => this.startAim(), this.surfaceScore === 1 ? 1100 : 2000);
  }

  static setAction(label) {
    const b = this.$('action'); if (!b) return;
    b.hidden = !label;
    if (label) b.querySelector('span').textContent = label;
  }

  static startAim() {
    this.phase = 'aim';
    const ui = this.$('ui'); if (ui) ui.innerHTML = `<div class="ag-hint">${this.ar ? '🎯 دوس لما النيشان يبقى في نص اللوح' : '🎯 Tap when the target is in the middle of the board'}</div>`;
    this.setAction(this.ar ? '🎯 صوّب' : '🎯 Aim');
  }
  static startPower() {
    this.phase = 'power';
    this.powerT = 0;
    const ui = this.$('ui'); if (ui) ui.innerHTML = `<div class="ag-hint">${this.ar ? '⚡ وقّف العداد في المنطقة الذهبية!' : '⚡ Stop the power bar in the gold zone!'}</div>`;
    this.setAction(this.ar ? '⚡ اركل!' : '⚡ KICK!');
  }

  static aimValue() { return Math.sin(this.aimT * Math.PI) ; }                 // -1..1 along the board
  static powerValue() { const x = (this.powerT % 2); return x < 1 ? x : 2 - x; } // 0..1 triangle wave

  static tap() {
    if (this.over) return;
    if (this.phase === 'aim') {
      const off = Math.abs(this.aimValue());
      this.aim = AG.clamp(1 - off / 0.85, 0, 1);
      this.aimLocked = this.aimValue();
      this.gs.playSound('click');
      this.stage.text(this.boardCenter().x, this.boardCenter().y - 40, this.aim > 0.85 ? (this.ar ? 'في النص بالظبط!' : 'Bullseye!') : `${Math.round(this.aim * 100)}%`, { color: this.aim > 0.85 ? '#ffd166' : '#fff', size: 24 });
      this.later(() => this.startPower(), 350);
    } else if (this.phase === 'power') {
      const v = this.powerValue();
      const top = 0.92, z = this.cfg.zone;
      const dist = Math.abs(v - top);
      this.power = dist <= z / 2 ? 1 : AG.clamp(1 - (dist - z / 2) / 0.45, 0, 1);
      this.powerLocked = v;
      this.gs.playSound('click');
      this.kick();
    }
  }

  static boardCenter() {
    const b = this.board;
    return b.orient === 'v' ? { x: b.x + b.thick * this.cfg.boards / 2, y: b.y + b.len / 2 } : { x: b.x + b.len / 2, y: b.y + b.thick * this.cfg.boards / 2 };
  }

  static kick() {
    this.phase = 'kick';
    this.setAction(null);
    const ui = this.$('ui'); if (ui) ui.innerHTML = '';
    const need = 0.55 + 0.1 * (this.cfg.boards - 1);
    const quality = (this.aim * 0.5 + this.power * 0.5);
    const breaks = this.surfaceScore > 0 && quality >= need;
    const score = Math.round(100 * (0.3 * this.surfaceScore + 0.35 * this.aim + 0.35 * this.power));
    const f = this.fighter, st = this.stage;
    const reach = this.skillId === 'narochagi' ? 0 : this.fighter.height * 0.04;
    const steps = this.skillId === 'narochagi'
      ? [{ pose: 0, hold: 0.12 }, { pose: 1, hold: 0.2, fade: 0.1 }, { pose: 2, hold: 0.28, fade: 0.06, hit: () => this.impact(breaks, score) }, { pose: 3, hold: 0.25, fade: 0.1 }, { pose: 4, hold: 0.3, fade: 0.12 }, { pose: 0, hold: 0.1, fade: 0.2 }]
      : [{ pose: 0, hold: 0.1 }, { pose: 1, hold: 0.14, fade: 0.08 }, { pose: 2, hold: 0.3, fade: 0.05, lunge: reach, hit: () => this.impact(breaks, score) }, { pose: 3, hold: 0.2, fade: 0.08, lunge: 0 }, { pose: 4, hold: 0.3, fade: 0.12 }, { pose: 0, hold: 0.1, fade: 0.2 }];
    ArenaSound.whoosh();
    f.play(steps, () => {
      this.scores.push(score);
      this.renderHud();
      this.later(() => this.nextRound(), 700);
    });
  }

  static impact(breaks, score) {
    const st = this.stage, b = this.board, c = this.boardCenter();
    const hit = { x: b.orient === 'v' ? b.x : c.x, y: b.orient === 'v' ? b.y + b.len / 2 + (this.aimLocked || 0) * b.len * 0.42 : b.y };
    if (b.orient === 'h') hit.x = b.x + b.len / 2 + (this.aimLocked || 0) * b.len * 0.42;
    this.fighter.squash = 1;
    if (breaks) {
      this.broken = true;
      ArenaSound.crack();
      st.slowmo(0.25, 0.35);
      st.shake(10 + this.cfg.boards * 3, 0.45);
      st.flash('#fff', 0.55);
      st.ring(hit.x, hit.y, '#ffd166', 120, 0.5, 7);
      st.sparks(hit.x, hit.y, '#ffd166', 30);
      st.chips(hit.x, hit.y, 26 + this.cfg.boards * 10, b.orient === 'v' ? 1 : 1, undefined, st.floorY());
      st.dust(hit.x, hit.y, 12);
      st.text(c.x, c.y - 70, this.ar ? 'اتكسر! 💥' : 'CRACK! 💥', { color: '#ffd166', size: 40 });
      st.text(c.x, c.y - 26, `+${score}`, { color: '#b8f5ec', size: 26, ttl: 1.3 });
      this.makePieces(hit);
    } else {
      ArenaSound.thud();
      st.shake(5, 0.25);
      st.ring(hit.x, hit.y, '#ff6b6b', 60, 0.35, 4);
      this.wob = 1;
      this.fighter.wobble = 0.6;
      const why = this.surfaceScore === 0 ? (this.ar ? 'جزء القدم غلط!' : 'Wrong part of the foot!') : this.aim < 0.5 ? (this.ar ? 'بعيد عن النص!' : 'Off centre!') : (this.ar ? 'قوة مش كفاية!' : 'Not enough power!');
      st.text(c.x, c.y - 60, this.ar ? 'آي! 😣' : 'Ouch! 😣', { color: '#ffb3b9', size: 34 });
      st.text(c.x, c.y - 22, why, { color: '#fff', size: 18, ttl: 1.6 });
    }
  }

  static makePieces(hit) {
    const b = this.board, n = this.cfg.boards;
    this.pieces = [];
    for (let i = 0; i < n; i++) {
      const d = i * 0.06;
      if (b.orient === 'v') {
        const x = b.x + i * b.thick, split = hit.y;
        this.pieces.push({ x, y: b.y, w: b.thick, h: split - b.y, px: x + b.thick / 2, py: split, rot: 0, vr: AG.rand(-6, -3), vx: AG.rand(150, 300), vy: AG.rand(-360, -200), delay: d });
        this.pieces.push({ x, y: split, w: b.thick, h: b.y + b.len - split, px: x + b.thick / 2, py: split, rot: 0, vr: AG.rand(3, 6), vx: AG.rand(120, 260), vy: AG.rand(-120, 20), delay: d });
      } else {
        const y = b.y + i * b.thick, split = hit.x;
        this.pieces.push({ x: b.x, y, w: split - b.x, h: b.thick, px: split, py: y + b.thick / 2, rot: 0, vr: AG.rand(2.5, 5), vx: AG.rand(-160, -60), vy: AG.rand(-60, 80), delay: d });
        this.pieces.push({ x: split, y, w: b.x + b.len - split, h: b.thick, px: split, py: y + b.thick / 2, rot: 0, vr: AG.rand(-5, -2.5), vx: AG.rand(60, 160), vy: AG.rand(-60, 80), delay: d });
      }
    }
    this.pieces.forEach(p => { p.ox = 0; p.oy = 0; });
  }

  static update(dt) {
    if (!this.fighter) return;
    this.fighter.update(dt);
    const R = this.cfg; if (!R) return;
    if (this.phase === 'aim') this.aimT += dt * R.aimSpeed;
    if (this.phase === 'power') this.powerT += dt * R.powerSpeed * 1.4;
    if (this.wob > 0) this.wob = Math.max(0, this.wob - dt * 1.6);
    if (this.pieces) {
      const floor = this.stage.floorY();
      this.pieces.forEach(p => {
        if (p.delay > 0) { p.delay -= dt; return; }
        p.vy += 1500 * dt; p.ox += p.vx * dt; p.oy += p.vy * dt; p.rot += p.vr * dt;
        if (p.py + p.oy > floor - 4) { p.oy = floor - 4 - p.py; p.vy *= -0.3; p.vx *= 0.6; p.vr *= 0.5; }
      });
    }
  }

  static drawWood(c, x, y, w, h, orient) {
    const g = orient === 'v' ? c.createLinearGradient(x, 0, x + w, 0) : c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, '#f2cf8f'); g.addColorStop(0.5, '#d9a55b'); g.addColorStop(1, '#a8702f');
    c.fillStyle = g; c.fillRect(x, y, w, h);
    c.strokeStyle = 'rgba(110,62,20,0.35)'; c.lineWidth = 1;
    const n = 5;
    for (let i = 1; i < n; i++) {
      c.beginPath();
      if (orient === 'v') { const xx = x + (w * i) / n; c.moveTo(xx, y); for (let yy = y; yy <= y + h; yy += 8) c.lineTo(xx + Math.sin(yy * 0.08 + i) * 1.2, yy); }
      else { const yy = y + (h * i) / n; c.moveTo(x, yy); for (let xx = x; xx <= x + w; xx += 8) c.lineTo(xx, yy + Math.sin(xx * 0.08 + i) * 1.2); }
      c.stroke();
    }
    c.strokeStyle = 'rgba(70,40,10,0.6)'; c.lineWidth = 1.5; c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }

  static draw(c, W, H) {
    if (!this.board || !this.cfg) { this.fighter?.draw(c); return; }
    const b = this.board, n = this.cfg.boards, fy = this.stage.floorY();
    // holder stand
    c.fillStyle = '#39444f'; c.strokeStyle = '#1c232a'; c.lineWidth = 2;
    if (b.orient === 'v') {
      const cx = b.x + (b.thick * n) / 2 + b.thick * 2.2;
      c.fillRect(cx - 4, b.y + b.len * 0.2, 8, fy - b.y - b.len * 0.2);
      c.fillRect(cx - 26, fy - 6, 52, 6);
      c.fillStyle = '#5a6977';
      c.fillRect(b.x + b.thick * n - 2, b.y + b.len * 0.18, cx - (b.x + b.thick * n) + 4, 8);
      c.fillRect(b.x + b.thick * n - 2, b.y + b.len * 0.74, cx - (b.x + b.thick * n) + 4, 8);
    } else {
      [b.x + 8, b.x + b.len - 16].forEach(px => { c.fillRect(px, b.y + b.thick * n, 8, fy - b.y - b.thick * n); c.fillRect(px - 14, fy - 6, 36, 6); });
    }
    const wob = this.wob > 0 ? Math.sin(this.stage.time * 40) * 3 * this.wob : 0;
    // fighter behind the board for side-on kicks
    this.fighter.draw(c);
    if (!this.pieces) {
      for (let i = 0; i < n; i++) {
        if (b.orient === 'v') this.drawWood(c, b.x + i * b.thick + wob, b.y, b.thick, b.len, 'v');
        else this.drawWood(c, b.x, b.y + i * b.thick + wob, b.len, b.thick, 'h');
      }
    } else {
      this.pieces.forEach(p => {
        c.save(); c.translate(p.px + p.ox, p.py + p.oy); c.rotate(p.rot); c.translate(-p.px, -p.py);
        this.drawWood(c, p.x, p.y, p.w, p.h, b.orient); c.restore();
      });
    }
    // aim target + track
    if (this.phase === 'aim' || this.phase === 'power') {
      const v = this.phase === 'aim' ? this.aimValue() : this.aimLocked;
      const cx = b.orient === 'v' ? b.x + (b.thick * n) / 2 : b.x + b.len / 2 + v * b.len * 0.42;
      const cy = b.orient === 'v' ? b.y + b.len / 2 + v * b.len * 0.42 : b.y + (b.thick * n) / 2;
      // centre mark
      c.strokeStyle = 'rgba(255,215,0,0.9)'; c.lineWidth = 2; c.setLineDash([4, 4]);
      c.beginPath();
      if (b.orient === 'v') { c.moveTo(b.x - 14, b.y + b.len / 2); c.lineTo(b.x + b.thick * n + 14, b.y + b.len / 2); }
      else { c.moveTo(b.x + b.len / 2, b.y - 14); c.lineTo(b.x + b.len / 2, b.y + b.thick * n + 14); }
      c.stroke(); c.setLineDash([]);
      const pulse = 1 + Math.sin(this.stage.time * 10) * 0.08;
      c.strokeStyle = this.phase === 'power' ? '#7ee0cf' : '#ff6b35'; c.lineWidth = 3;
      c.beginPath(); c.arc(cx, cy, 13 * pulse, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(cx - 20, cy); c.lineTo(cx - 6, cy); c.moveTo(cx + 6, cy); c.lineTo(cx + 20, cy); c.moveTo(cx, cy - 20); c.lineTo(cx, cy - 6); c.moveTo(cx, cy + 6); c.lineTo(cx, cy + 20); c.stroke();
    }
    // power meter (right edge)
    if (this.phase === 'power' || this.phase === 'kick') {
      const mx = W - 48, my = H * 0.12, mh = H * 0.66, mw = 26;
      c.fillStyle = 'rgba(0,0,0,0.55)'; c.beginPath(); c.roundRect(mx - 6, my - 6, mw + 12, mh + 12, 14); c.fill();
      const zc = 0.92, z = this.cfg.zone;
      const grad = c.createLinearGradient(0, my + mh, 0, my);
      grad.addColorStop(0, '#2a9d8f'); grad.addColorStop(0.6, '#e9c46a'); grad.addColorStop(1, '#e63946');
      c.fillStyle = grad; c.globalAlpha = 0.35; c.fillRect(mx, my, mw, mh); c.globalAlpha = 1;
      c.fillStyle = 'rgba(255,215,0,0.85)'; c.fillRect(mx - 3, my + mh * (1 - zc - z / 2), mw + 6, mh * z);
      const v = this.phase === 'power' ? this.powerValue() : (this.powerLocked ?? 0);
      c.fillStyle = grad; c.fillRect(mx, my + mh * (1 - v), mw, mh * v);
      c.fillStyle = '#fff'; c.fillRect(mx - 8, my + mh * (1 - v) - 2, mw + 16, 4);
      c.font = '800 13px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffe68a';
      c.fillText('⚡', mx + mw / 2, my - 14);
    }
    // boards count badge
    c.font = '800 14px Cairo, Roboto, sans-serif'; c.textAlign = 'left'; c.fillStyle = 'rgba(255,255,255,0.85)';
    c.fillText(`🪵 × ${n}`, 14, 24);
  }
}

// =====================================================================
// 🎯 TARGET PADDLES — reaction + "where does this kick land?"
// =====================================================================
class PaddleReflexGame extends ArenaGameBase {
  static SCREEN = 'paddle-reflex';
  static GAME_ID = 'paddle-reflex';
  static PREFIX = 'pr';
  static ROUNDS = 10;
  static totalRounds() { return this.ROUNDS; }

  static COPY = {
    title: { en: '🎯 Target Paddles', ar: '🎯 مضارب الأهداف' },
    how: {
      apchagi:   { en: 'Paddles pop up around you. Tap ONLY the one held at a real Ap Chagi target — the face or the abdomen — as fast as you can. Leave the others!', ar: 'مضارب بتظهر حواليك. دوس بس على المضرب اللي عند هدف حقيقي للآب تشاجي — الوش أو البطن — بأسرع ما تقدر. سيب الباقي!' },
      narochagi: { en: 'Paddles pop up around you. Tap ONLY the one held flat above the head — the axe kick drops onto the head / shoulder from above.', ar: 'مضارب بتظهر حواليك. دوس بس على المضرب اللي متمسك بالعرض فوق الراس — الركلة المطرقية بتنزل على الراس / الكتف من فوق.' },
      bakchagi3: { en: 'Paddles pop up around you. Tap ONLY the one at a real side-kick target — the ribs or the knee.', ar: 'مضارب بتظهر حواليك. دوس بس على المضرب اللي عند هدف حقيقي للركلة الجانبية — الضلوع أو الركبة.' }
    }
  };

  // Positions are relative to the fighter: dx/dy in body-heights.
  static ZONES = {
    overhead: { dx: 0.34, dy: 1.12, flat: true,  label: { en: 'Head (from above)', ar: 'الراس (من فوق)' } },
    face:     { dx: 0.66, dy: 0.88, label: { en: 'Face', ar: 'الوش' } },
    abdomen:  { dx: 0.86, dy: 0.56, label: { en: 'Abdomen', ar: 'البطن' } },
    ribs:     { dx: 1.02, dy: 0.7,  label: { en: 'Ribs', ar: 'الضلوع' } },
    knee:     { dx: 0.7,  dy: 0.3,  label: { en: 'Knee', ar: 'الركبة' } },
    foot:     { dx: 1.12, dy: 0.15,  label: { en: 'Foot', ar: 'القدم' } },
    behind:   { dx: -0.55, dy: 0.62, label: { en: 'Behind you', ar: 'وراك' } }
  };
  static VALID = { apchagi: ['face', 'abdomen'], narochagi: ['overhead'], bakchagi3: ['ribs', 'knee'] };
  static DECOYS = { apchagi: ['overhead', 'knee', 'foot', 'behind'], narochagi: ['abdomen', 'knee', 'foot', 'behind'], bakchagi3: ['overhead', 'foot', 'behind', 'abdomen'] };

  static setupUI() {
    const canvas = this.$('canvas');
    this.on(canvas, 'pointerdown', (e) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      this.tapAt(e.clientX - r.left, e.clientY - r.top);
    });
    this.on(document, 'keydown', (e) => {
      if (!AG.$('paddle-reflex-screen')?.classList.contains('active') || !this.paddles?.length) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= this.paddles.length) { e.preventDefault(); const p = this.paddles[n - 1]; this.hitPaddle(p); }
    });
    const ui = this.$('ui'); if (ui) ui.innerHTML = '';
  }

  static begin() {
    this.combo = 0; this.best = 0; this.rts = [];
    this.paddles = [];
    this.showLegend();
    this.later(() => this.nextRound(), 1600);
  }

  static showLegend() {
    const ui = this.$('ui'); if (!ui) return;
    const valid = this.VALID[this.skillId].map(z => this.t(this.ZONES[z].label)).join(this.ar ? ' أو ' : ' or ');
    ui.innerHTML = `<div class="ag-hint ag-hint-top">${this.ar ? `🎯 اضرب: <b>${valid}</b>` : `🎯 Hit: <b>${valid}</b>`}</div>`;
  }
  static refreshUI() { this.showLegend(); }

  static layout() {
    const st = this.stage; if (!st) return;
    const W = st.W, H = st.H, fy = st.floorY();
    const narrow = W < 640;
    const figH = narrow ? Math.min(H * 0.5, W * 0.56) : Math.min(H * 0.6, W * 0.42);
    const fx = W * (narrow ? 0.26 : 0.34);
    this.fighter.layout(fx, fy, figH);
    st.spotX = fx;
    (this.paddles || []).forEach(p => this.placePaddle(p));
  }

  static placePaddle(p) {
    const f = this.fighter, z = this.ZONES[p.zone];
    const W = this.stage.W;
    p.x = AG.clamp(f.x + z.dx * f.height, 50, W - 50);
    p.y = f.floor - z.dy * f.height;
    p.r = Math.max(22, f.height * 0.1);
  }

  static nextRound() {
    if (this.over) return;
    this.round++;
    if (this.round > this.ROUNDS) { this.finish(); return; }
    this.renderHud();
    const valid = AG.pick(this.VALID[this.skillId]);
    const decoys = AG.shuffle(this.DECOYS[this.skillId]).slice(0, this.round < 4 ? 1 : 2);
    const zones = AG.shuffle([valid, ...decoys]);
    const now = this.stage.time;
    this.life = AG.lerp(2.6, 1.35, (this.round - 1) / (this.ROUNDS - 1));
    this.paddles = zones.map((zone, i) => {
      const p = { zone, valid: zone === valid, born: now + i * 0.05, state: 'in', vx: 0, vy: 0, rot: 0, vr: 0, idx: i + 1 };
      this.placePaddle(p);
      return p;
    });
    this.roundStart = now;
    this.resolved = false;
    ArenaSound.tone({ f0: 700, f1: 900, dur: 0.08, type: 'sine', gain: 0.2 });
  }

  static tapAt(x, y) {
    if (!this.paddles?.length || this.resolved) return;
    let best = null, bd = Infinity;
    this.paddles.forEach(p => { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } });
    if (best && bd < best.r * 2.1) this.hitPaddle(best);
  }

  static hitPaddle(p) {
    if (this.resolved || !p || p.state !== 'in') return;
    this.resolved = true;
    const rt = (this.stage.time - this.roundStart) / Math.max(0.2, this.stage.timeScale || 1);
    const st = this.stage, f = this.fighter;
    if (p.valid) {
      const score = Math.round(AG.clamp(100 - Math.max(0, rt - 0.45) * 55, 45, 100));
      this.combo++; this.best = Math.max(this.best, this.combo);
      this.rts.push(rt);
      this.scores.push(score);
      const high = this.ZONES[p.zone].flat;
      const reach = (p.x - f.x) - f.height * 0.45;
      f.play([
        { pose: 1, hold: 0.07, fade: 0.05 },
        { pose: 2, hold: 0.2, fade: 0.04, lunge: AG.clamp(reach * 0.5, -10, f.height * 0.2), hit: () => {
          p.state = 'out'; p.vx = high ? 40 : 420; p.vy = high ? 520 : -260; p.vr = AG.rand(-14, 14);
          ArenaSound.smack();
          st.ring(p.x, p.y, '#ffd166', 90, 0.4, 6); st.sparks(p.x, p.y, '#ffd166', 22, 460);
          st.shake(6, 0.2); f.squash = 1;
          if (this.combo >= 3) st.slowmo(0.35, 0.18);
          st.text(p.x, p.y - p.r - 18, `+${score}`, { color: '#b8f5ec', size: 28 });
          st.text(p.x, p.y + p.r + 18, `${rt.toFixed(2)}s`, { color: '#ffe68a', size: 16, rise: 20 });
          if (this.combo >= 3) st.text(st.W / 2, st.H * 0.14, (this.ar ? `🔥 كومبو × ${this.combo}` : `🔥 Combo × ${this.combo}`), { color: '#ff9f6b', size: 26, rise: 10 });
        } },
        { pose: 3, hold: 0.1, fade: 0.06, lunge: 0 },
        { pose: 0, hold: 0.05, fade: 0.14 }
      ]);
      ArenaSound.whoosh();
      this.paddles.forEach(q => { if (q !== p) { q.state = 'fade'; } });
    } else {
      this.combo = 0;
      this.scores.push(0);
      p.state = 'wrong';
      ArenaSound.buzz(); this.gs.playSound('error');
      st.shake(4, 0.2); f.wobble = 0.8;
      const valid = this.paddles.find(q => q.valid);
      if (valid) valid.state = 'reveal';
      st.text(p.x, p.y - p.r - 20, this.ar ? '✖ مش هدف صح' : '✖ Not a target', { color: '#ffb3b9', size: 20 });
    }
    this.renderHud();
    this.later(() => { this.paddles = []; this.later(() => this.nextRound(), 380); }, p.valid ? 650 : 1300);
  }

  static timeout() {
    if (this.resolved) return;
    this.resolved = true;
    this.combo = 0;
    this.scores.push(0);
    const valid = this.paddles.find(q => q.valid);
    if (valid) { valid.state = 'reveal'; this.stage.text(valid.x, valid.y - valid.r - 20, this.ar ? '⏰ اتأخرت!' : '⏰ Too slow!', { color: '#ffe68a', size: 20 }); }
    this.paddles.forEach(q => { if (!q.valid) q.state = 'fade'; });
    this.gs.playSound('error');
    this.renderHud();
    this.later(() => { this.paddles = []; this.later(() => this.nextRound(), 380); }, 1200);
  }

  static update(dt) {
    if (!this.fighter) return;
    this.fighter.update(dt);
    if (!this.paddles?.length) return;
    if (!this.resolved && this.stage.time - this.roundStart > this.life) this.timeout();
    this.paddles.forEach(p => {
      if (p.state === 'out') { p.vy += 1400 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; }
      if (p.state === 'fade') p.fadeT = (p.fadeT || 0) + dt;
    });
  }

  static drawPaddle(c, p) {
    const now = this.stage.time;
    const age = now - p.born;
    if (age < 0) return;
    const inT = AG.clamp(age / 0.28, 0, 1);
    let s = AG.easeOutBack(inT);
    let alpha = 1;
    if (p.state === 'fade') { alpha = Math.max(0, 1 - (p.fadeT || 0) * 3); s *= 1 - Math.min(1, (p.fadeT || 0)) * 0.5; }
    if (alpha <= 0) return;
    const z = this.ZONES[p.zone];
    const bob = p.state === 'in' ? Math.sin(now * 5 + p.idx) * 3 : 0;
    c.save();
    c.globalAlpha = alpha;
    c.translate(p.x, p.y + bob);
    c.rotate(p.rot + (z.flat ? Math.PI / 2 : 0));
    c.scale(s, s);
    const r = p.r;
    // handle
    c.fillStyle = '#222'; c.beginPath(); c.roundRect(-r * 0.16, r * 0.85, r * 0.32, r * 0.95, r * 0.1); c.fill();
    // pad (two-tone kick paddle)
    const wrong = p.state === 'wrong', reveal = p.state === 'reveal';
    c.shadowColor = reveal ? '#7ee0cf' : wrong ? '#ff4d4d' : 'rgba(0,0,0,0.5)'; c.shadowBlur = reveal || wrong ? 22 : 10;
    c.fillStyle = wrong ? '#7a1f27' : '#c1121f';
    c.beginPath(); c.ellipse(0, 0, r * 0.72, r, 0, 0, Math.PI * 2); c.fill();
    c.shadowBlur = 0;
    c.fillStyle = wrong ? '#3c1b5a' : '#1d4ed8';
    c.beginPath(); c.ellipse(-r * 0.2, 0, r * 0.42, r * 0.82, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 2.5;
    c.beginPath(); c.ellipse(0, 0, r * 0.72, r, 0, 0, Math.PI * 2); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-r * 0.3, -r * 0.45, r * 0.12, r * 0.28, 0.2, 0, Math.PI * 2); c.fill();
    c.restore();
    // countdown ring + label (not rotated)
    if (p.state === 'in' && !this.resolved) {
      const left = 1 - AG.clamp((now - this.roundStart) / this.life, 0, 1);
      c.save(); c.globalAlpha = alpha * 0.9;
      c.strokeStyle = left < 0.3 ? '#ff6b6b' : '#ffffff'; c.lineWidth = 3;
      c.beginPath(); c.arc(p.x, p.y + bob, r * 1.25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left); c.stroke();
      c.restore();
    }
    if (p.state !== 'out') {
      c.save(); c.globalAlpha = alpha;
      c.font = `800 ${Math.max(11, r * 0.42)}px Cairo, Roboto, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'top';
      const label = `${p.idx} · ${this.t(z.label)}`;
      const tw = c.measureText(label).width + 14;
      const ly = p.y + bob + (z.flat ? r * 0.9 : r * 1.35) + 6;
      c.fillStyle = reveal ? 'rgba(42,157,143,0.9)' : 'rgba(0,0,0,0.6)';
      c.beginPath(); c.roundRect(p.x - tw / 2, ly - 3, tw, Math.max(11, r * 0.42) + 8, 8); c.fill();
      c.fillStyle = '#fff'; c.fillText(label, p.x, ly);
      c.restore();
    }
  }

  static draw(c) {
    this.fighter?.draw(c);
    (this.paddles || []).forEach(p => this.drawPaddle(c, p));
    const st = this.stage;
    if (this.combo >= 2) {
      c.font = '900 16px Cairo, Roboto, sans-serif'; c.textAlign = 'right'; c.fillStyle = '#ff9f6b';
      c.fillText(`🔥 × ${this.combo}`, st.W - 14, 26);
    }
  }

  static finish() {
    this.paddles = [];
    const avgRt = this.rts.length ? this.rts.reduce((a, b) => a + b, 0) / this.rts.length : 0;
    this.lastMeta = { avgReaction: +avgRt.toFixed(2), bestCombo: this.best };
    super.finish();
  }
}

// =====================================================================
// 🥁 KICK RHYTHM — the 5 phases in order, on the beat
// =====================================================================
class PhaseRhythmGame extends ArenaGameBase {
  static SCREEN = 'phase-rhythm';
  static GAME_ID = 'phase-rhythm';
  static PREFIX = 'rh';
  static COMBOS = [72, 84, 96, 108];          // BPM of each 5-note combo
  static LEAD = 1.7;                          // seconds a note takes to fall to the line
  static WIN = { perfect: 0.085, great: 0.16, good: 0.23 };
  static LANE_COLORS = ['#2a9d8f', '#e76f51', '#ff6b35', '#e9c46a', '#457b9d'];
  static totalRounds() { return this.COMBOS.length; }

  static COPY = {
    title: { en: '🥁 Kick Rhythm', ar: '🥁 إيقاع الركلة' },
    how: {
      all: { en: 'Notes fall in the order of the 5 phases. Tap the matching phase (or press 1–5) exactly when a note reaches the line. Every hit moves your fighter — land a whole combo to finish the kick!', ar: 'النوتات بتنزل بترتيب المراحل الخمسة. دوس على المرحلة اللي زيها (أو الأرقام ١–٥) لما النوتة توصل للخط بالظبط. كل ضربة بتحرّك لاعبك — كمّل الكومبو كله عشان تخلّص الركلة!' }
    }
  };

  static phaseNames() {
    const skill = GameConfig.SKILLS[this.skillId];
    return skill.phases.map(p => this.t(p.title).replace(/^\S+\s/, '').replace(/\s*\(.*\)\s*$/, ''));
  }

  static setupUI() {
    const pads = this.$('pads'); if (!pads) return;
    const frames = arenaKickFrames(this.skillId, this.isBoy);
    const names = this.phaseNames();
    pads.innerHTML = names.map((n, i) => `
      <button type="button" class="rh-pad" data-lane="${i}" style="--lane:${this.LANE_COLORS[i]}">
        <span class="rh-pad-img" style="background-image:url('${frames[i].replace(/ /g, '%20')}')"></span>
        <span class="rh-pad-num">${i + 1}</span><span class="rh-pad-name">${n}</span>
      </button>`).join('');
    pads.querySelectorAll('.rh-pad').forEach(b => this.on(b, 'pointerdown', (e) => { e.preventDefault(); this.press(+b.dataset.lane); }));
    this.on(document, 'keydown', (e) => {
      if (!AG.$('phase-rhythm-screen')?.classList.contains('active') || e.repeat) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 5) { e.preventDefault(); this.press(n - 1); }
    });
    const ui = this.$('ui'); if (ui) ui.innerHTML = '';
  }
  static refreshUI() {
    const names = this.phaseNames();
    this.$('pads')?.querySelectorAll('.rh-pad-name').forEach((el, i) => { el.textContent = names[i]; });
  }

  static layout() {
    const st = this.stage; if (!st) return;
    const W = st.W, H = st.H;
    this.narrow = W < 640;
    this.hitY = H * 0.82;
    if (this.narrow) {
      this.lx0 = 10; this.lx1 = W - 10;
      this.fighter.layout(W * 0.5, st.floorY(), H * 0.7);
      this.fighter.alpha = 0.3;
    } else {
      this.lx0 = W * 0.44; this.lx1 = W - 14;
      this.fighter.layout(W * 0.2, st.floorY(), Math.min(H * 0.72, W * 0.36));
      this.fighter.alpha = 1;
    }
    st.spotX = this.narrow ? W / 2 : W * 0.22;
  }
  static laneX(i) { const w = (this.lx1 - this.lx0) / 5; return this.lx0 + w * (i + 0.5); }
  static laneW() { return (this.lx1 - this.lx0) / 5; }

  static begin() {
    // build the chart: 4-beat count-in, then combos separated by 3 beats
    this.notes = []; this.beats = [];
    let t = 0;
    const first = 60 / this.COMBOS[0];
    for (let i = 0; i < 4; i++) { this.beats.push({ t, kind: i === 3 ? 'snare' : 'hat', count: 3 - i }); t += first; }
    this.COMBOS.forEach((bpm, ci) => {
      const b = 60 / bpm;
      for (let k = 0; k < 5; k++) {
        this.notes.push({ t, lane: k, combo: ci, judged: null });
        this.beats.push({ t, kind: k % 2 === 0 ? 'kick' : 'snare' });
        this.beats.push({ t: t + b / 2, kind: 'hat' });
        t += b;
      }
      t += b * 3;
    });
    this.songEnd = t;
    this.beatIdx = 0;
    this.comboHits = {};
    this.streak = 0; this.bestStreak = 0;
    this.startAt = performance.now() / 1000 + this.LEAD;   // song time 0 = first count-in beat
    this.round = 1; this.renderHud();
    this.judgeText = null;
    this.laneFlash = [0, 0, 0, 0, 0];
  }
  static songTime() { return performance.now() / 1000 - this.startAt; }

  static press(lane) {
    if (this.over || !this.notes) return;
    const t = this.songTime();
    this.laneFlash[lane] = 1;
    const cand = this.notes.filter(n => n.lane === lane && !n.judged && Math.abs(n.t - t) <= this.WIN.good)
      .sort((a, b) => Math.abs(a.t - t) - Math.abs(b.t - t))[0];
    if (!cand) { this.laneFlash[lane] = -1; return; }
    const d = Math.abs(cand.t - t);
    const kind = d <= this.WIN.perfect ? 'perfect' : d <= this.WIN.great ? 'great' : 'good';
    this.judge(cand, kind);
  }

  static judge(note, kind) {
    const val = { perfect: 100, great: 80, good: 55, miss: 0 }[kind];
    if (kind !== 'good') window.Review?.note('phase', kind !== 'miss', { skill: this.skillId, phase: note.lane, weight: 0.5 });
    note.judged = kind; note.score = val;
    this.scores.push(val);
    const st = this.stage, x = this.laneX(note.lane), y = this.hitY;
    const label = { perfect: this.ar ? 'برافو!' : 'PERFECT!', great: this.ar ? 'جامد!' : 'GREAT!', good: this.ar ? 'كويس' : 'GOOD', miss: this.ar ? 'فاتتك' : 'MISS' }[kind];
    const color = { perfect: '#ffd166', great: '#7ee0cf', good: '#b3c7ff', miss: '#ff8a8a' }[kind];
    if (kind !== 'miss') {
      this.streak++; this.bestStreak = Math.max(this.bestStreak, this.streak);
      this.fighter.setPose(note.lane, 0.07, true);
      if (note.lane === 2) { const sp = this.fighter.strikePoint(2); if (!this.narrow) { st.sparks(sp.x, sp.y, this.LANE_COLORS[2], 10, 300); } }
      ArenaSound.chime(note.lane);
      st.sparks(x, y, this.LANE_COLORS[note.lane], kind === 'perfect' ? 18 : 10, 380);
      st.ring(x, y, color, this.laneW() * 0.6, 0.35, 4);
      (this.comboHits[note.combo] ||= []).push(kind);
      if (this.comboHits[note.combo].length === 5 && this.comboHits[note.combo].every(k => k === 'perfect' || k === 'great')) this.comboKick();
    } else {
      this.streak = 0;
      this.fighter.wobble = 0.4;
    }
    this.judgeText = { label, color, t: 0, x, lane: note.lane };
    st.text(x, y - 36, label, { color, size: kind === 'perfect' ? 22 : 18, ttl: 0.7, rise: 30 });
    this.renderHud();
  }

  static comboKick() {
    const st = this.stage, f = this.fighter;
    const sp = f.strikePoint(2);
    f.play([{ pose: 1, hold: 0.06, fade: 0.04 }, { pose: 2, hold: 0.28, fade: 0.04, lunge: f.height * 0.03, hit: () => {
      f.squash = 1; ArenaSound.smack();
      if (!this.narrow) { st.ring(sp.x, sp.y, '#ffd166', 110, 0.5, 7); st.sparks(sp.x, sp.y, '#ffd166', 26, 520); }
      st.shake(7, 0.25);
      st.text(st.W / 2, st.H * 0.2, this.ar ? '💥 كومبو كامل!' : '💥 FULL COMBO!', { color: '#ffd166', size: 32, rise: 20 });
    } }, { pose: 3, hold: 0.12, fade: 0.06, lunge: 0 }, { pose: 4, hold: 0.2, fade: 0.1 }]);
  }

  static renderHud() {
    const ar = this.ar;
    const total = this.COMBOS.length;
    const open = this.notes?.find(n => !n.judged);
    const current = open ? open.combo + 1 : total;
    this.setChip('round', ar ? `كومبو ${Math.min(current, total)} / ${total}` : `Combo ${Math.min(current, total)} / ${total}`);
    const avg = this.average();
    this.setChip('score', ar ? `الدقة: ${avg === null ? '—' : avg + '%'}` : `Accuracy: ${avg === null ? '—' : avg + '%'}`);
  }

  static update(dt, raw) {
    if (!this.fighter) return;
    this.fighter.update(dt);
    if (!this.notes || this.over) return;
    const t = this.songTime();
    while (this.beatIdx < this.beats.length && this.beats[this.beatIdx].t <= t) {
      const b = this.beats[this.beatIdx++];
      ArenaSound.drum(b.kind);
      if (b.count !== undefined) this.stage.text(this.stage.W * (this.narrow ? 0.5 : 0.72), this.stage.H * 0.4, b.count === 0 ? (this.ar ? 'يلا!' : 'GO!') : String(b.count), { color: '#fff', size: 54, ttl: 0.55, rise: 0 });
    }
    this.notes.forEach(n => { if (!n.judged && t - n.t > this.WIN.good) this.judge(n, 'miss'); });
    this.laneFlash = this.laneFlash.map(v => (v > 0 ? Math.max(0, v - raw * 4) : v < 0 ? Math.min(0, v + raw * 4) : 0));
    if (t > this.songEnd + 0.3 && this.notes.every(n => n.judged)) {
      this.lastMeta = { bestStreak: this.bestStreak };
      this.finish({ delay: 600 });
    }
  }

  // v30: a glowing note used to be a shadowBlur + gradient + text EVERY frame for
  // every note (the slowest thing in the app). Now each lane's note is painted
  // once into a small sprite and stamped.
  static noteSprite(lane, w, h) {
    const dpr = this.stage?.dpr || 1, key = `${lane}|${Math.round(w)}|${dpr}`;
    this._spr = this._spr || {};
    if (this._spr[key]) return this._spr[key];
    const pad = 18, cw = w + pad * 2, ch = h + pad * 2;
    const oc = document.createElement('canvas');
    oc.width = Math.ceil(cw * dpr); oc.height = Math.ceil(ch * dpr); oc._w = cw; oc._h = ch;
    const c = oc.getContext('2d'); c.scale(dpr, dpr);
    const col = this.LANE_COLORS[lane], x = cw / 2, y = ch / 2;
    c.shadowColor = col; c.shadowBlur = 16;
    const g = c.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, col); g.addColorStop(1, col);
    c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 12); c.fill();
    c.shadowBlur = 0;
    c.fillStyle = '#10222b'; c.font = '900 15px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(lane + 1), x, y + 1);
    return (this._spr[key] = oc);
  }

  static draw(c, W, H) {
    this.fighter?.draw(c);
    if (!this.notes) return;
    const t = this.songTime();
    const lw = this.laneW();
    // lanes
    if (this._laneH !== H) {                    // one gradient for all lanes, rebuilt only on resize
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(255,255,255,0.02)'); g.addColorStop(1, 'rgba(255,255,255,0.08)');
      this._laneG = g; this._laneH = H;
    }
    for (let i = 0; i < 5; i++) {
      const x = this.lx0 + lw * i;
      c.fillStyle = this._laneG; c.fillRect(x + 3, 8, lw - 6, H - 16);
      const fl = this.laneFlash[i];
      if (fl !== 0) {
        c.fillStyle = fl > 0 ? this.LANE_COLORS[i] : '#ff4d4d';
        c.globalAlpha = Math.abs(fl) * 0.35; c.fillRect(x + 3, 8, lw - 6, H - 16); c.globalAlpha = 1;
      }
    }
    // hit line
    c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(this.lx0 + 3, this.hitY); c.lineTo(this.lx1 - 3, this.hitY); c.stroke();
    for (let i = 0; i < 5; i++) {
      const x = this.laneX(i);
      c.strokeStyle = this.LANE_COLORS[i]; c.lineWidth = 3; c.globalAlpha = 0.9;
      c.beginPath(); c.roundRect(x - lw * 0.36, this.hitY - 14, lw * 0.72, 28, 10); c.stroke();
      c.globalAlpha = 1;
      c.font = '900 14px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = 'rgba(255,255,255,0.7)';
      c.fillText(String(i + 1), x, this.hitY);
    }
    // notes
    const speed = (this.hitY - 10) / this.LEAD;
    this.notes.forEach(n => {
      if (n.judged && n.judged !== 'miss') return;
      const y = this.hitY - (n.t - t) * speed;
      if (y < -30 || y > H + 30) return;
      const x = this.laneX(n.lane);
      const w = lw * 0.72, h = 26, spr = this.noteSprite(n.lane, w, h);
      c.globalAlpha = n.judged === 'miss' ? 0.3 : 1;
      c.drawImage(spr, x - spr._w / 2, y - spr._h / 2, spr._w, spr._h);
      c.globalAlpha = 1;
    });
    // streak
    if (this.streak >= 3) {
      c.font = '900 16px Cairo, Roboto, sans-serif'; c.textAlign = this.narrow ? 'center' : 'left'; c.fillStyle = '#ff9f6b';
      c.fillText(`🔥 × ${this.streak}`, this.narrow ? W / 2 : 14, 24);
    }
  }
}

// ---------------------------------------------------------------------
// registry used by game.js (screen init / teardown / language refresh)
// ---------------------------------------------------------------------
const ArenaGames = {
  byScreen: { 'board-break': BoardBreakGame, 'paddle-reflex': PaddleReflexGame, 'phase-rhythm': PhaseRhythmGame },
  init(screenId, gs) { const G = this.byScreen[screenId]; if (G) G.initialize(gs); return !!G; },
  teardownExcept(screenId) { Object.entries(this.byScreen).forEach(([id, G]) => { if (id !== screenId) G.teardown(); }); },
  refresh(screenId) { this.byScreen[screenId]?.refresh(); }
};
window.ArenaGames = ArenaGames;
