// ============================================================================
// AUDIO (v28) — real sound effects, background music and recorded voice.
//   • SFX    rendered hit / whoosh / crack / chime samples (assets/audio/sfx),
//            with small random pitch changes so repeated hits never sound robotic.
//            Falls back to the old synthesized sounds if a file can't load.
//   • Music  two seamless loops: "dojo" (menus, lessons) and "arena" (games,
//            warm-up). Crossfades between screens, ducks under speech, has its
//            own 🎵 switch, and only starts after the first tap (browser rule).
//   • Voice  every time the game reads something aloud it first looks for a
//            recorded Egyptian voice line (assets/audio/voice/<lang>/…mp3, listed
//            in manifest.json); only if none exists it uses the phone's voice.
// ============================================================================
const AudioKit = {
  gs: () => (typeof GameStateInstance !== 'undefined' ? GameStateInstance : null),
  ctx() { const g = this.gs(); return g && g.audioContext; },
  buffers: {}, loading: {},
  async buffer(url) {
    const ctx = this.ctx(); if (!ctx) return null;
    if (this.buffers[url]) return this.buffers[url];
    if (!this.loading[url]) this.loading[url] = fetch(url).then(r => (r.ok ? r.arrayBuffer() : null))
      .then(b => (b ? new Promise((res) => ctx.decodeAudioData(b, res, () => res(null))) : null))
      .then(buf => (this.buffers[url] = buf)).catch(() => null);
    return this.loading[url];
  },
  SFX: ['whoosh-1', 'whoosh-2', 'whoosh-3', 'hit-1', 'hit-2', 'hit-3', 'hit-heavy', 'board-crack', 'bag-thud', 'ui-click', 'ui-pop', 'success', 'error', 'win', 'star', 'gong', 'tick', 'taiko', 'rim', 'clap'],
  preload() { if (this._pre) return; this._pre = true; this.SFX.forEach(n => this.buffer(`assets/audio/sfx/${n}.mp3`)); },
  // play a sample now; returns false if it isn't ready (caller then uses the old synth)
  sfx(name, { gain = 1, rate = 1, vary = 0.05 } = {}) {
    const g = this.gs(), ctx = this.ctx();
    if (!g || !g.soundEnabled || !ctx || !g.audioGain) return true;          // muted → "handled"
    const pick = /-\d$/.test(name) || this.buffers[`assets/audio/sfx/${name}.mp3`] ? name
      : (['1', '2', '3'].map(k => `${name}-${k}`).filter(n => this.buffers[`assets/audio/sfx/${n}.mp3`])[Math.floor(Math.random() * 3)] || name);
    const buf = this.buffers[`assets/audio/sfx/${pick}.mp3`];
    if (!buf) { this.preload(); return false; }
    const src = ctx.createBufferSource(); src.buffer = buf;
    src.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * vary);
    const gn = ctx.createGain(); gn.gain.value = gain;
    src.connect(gn); gn.connect(g.audioGain); src.start();
    return true;
  }
};

// ---------------------------------------------------------------- music
const Music = {
  KEY: 'taekwondoJourneyMusic',
  VOLUME: 0.32,
  ARENA: ['warmup', 'board-break', 'paddle-reflex', 'phase-rhythm', 'sparring-duel', 'balance-hold', 'heavy-bag', 'quiz-blast', 'action', 'versus'],
  enabled() { try { return localStorage.getItem(this.KEY) !== 'off'; } catch (e) { return true; } },
  setEnabled(on) { try { localStorage.setItem(this.KEY, on ? 'on' : 'off'); } catch (e) {} this.sync(); this.paintBtn(); },
  trackFor(screenId) { return this.ARENA.includes(screenId) ? 'arena' : 'dojo'; },
  master() {
    const ctx = AudioKit.ctx(); if (!ctx) return null;
    if (!this.out) { this.out = ctx.createGain(); this.out.gain.value = 0; this.out.connect(ctx.destination); }
    return this.out;
  },
  target() {
    const g = AudioKit.gs();
    if (!g || !g.soundEnabled || !this.enabled() || document.hidden || !this.unlocked) return 0;
    const video = document.querySelector('video:not([muted])');
    const playingVideo = video && !video.paused && !video.muted;
    return this.VOLUME * (this.ducked ? 0.3 : 1) * (playingVideo ? 0 : 1);
  },
  async sync() {
    const ctx = AudioKit.ctx(), out = this.master(); if (!ctx || !out) return;
    const id = (document.querySelector('.screen.active')?.id || 'home-screen').replace(/-screen$/, '');
    const want = this.trackFor(id);
    out.gain.setTargetAtTime(this.target(), ctx.currentTime, 0.25);
    if (!this.target() || want === this.current) return;
    const buf = await AudioKit.buffer(`assets/audio/music/${want}.mp3`);
    if (!buf || want !== this.trackFor((document.querySelector('.screen.active')?.id || '').replace(/-screen$/, ''))) return;
    if (want === this.current) return;
    // crossfade: old voice fades out, new one fades in
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const g = ctx.createGain(); g.gain.value = 0; src.connect(g); g.connect(out);
    src.start(); g.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
    if (this.voice) { const old = this.voice; old.g.gain.setTargetAtTime(0, ctx.currentTime, 0.4); setTimeout(() => { try { old.src.stop(); } catch (e) {} }, 2500); }
    this.voice = { src, g }; this.current = want;
  },
  duck(on) { this.ducked = on; const ctx = AudioKit.ctx(); if (ctx && this.out) this.out.gain.setTargetAtTime(this.target(), ctx.currentTime, 0.15); },
  paintBtn() {
    const b = document.getElementById('musicToggleBtn'); if (!b) return;
    const on = this.enabled();
    b.classList.toggle('muted', !on);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', on ? (TKD.ar ? 'اقفل المزيكا' : 'Music off') : (TKD.ar ? 'شغّل المزيكا' : 'Music on'));
    b.innerHTML = on ? '🎵' : '<span style="opacity:.55">🎵</span>';
  },
  mount() {
    const ctrls = document.querySelector('.header-controls');
    if (ctrls && !document.getElementById('musicToggleBtn')) {
      const b = document.createElement('button');
      b.type = 'button'; b.id = 'musicToggleBtn'; b.className = 'sound-toggle-btn music-toggle-btn';
      b.addEventListener('click', () => this.setEnabled(!this.enabled()));
      ctrls.insertBefore(b, ctrls.firstChild);
      this.paintBtn();
    }
    const unlock = () => { this.unlocked = true; AudioKit.preload(); this.sync(); };
    document.addEventListener('pointerdown', unlock, { once: true, capture: true });
    document.addEventListener('keydown', unlock, { once: true, capture: true });
    document.addEventListener('tkd:screen', () => this.sync());
    document.addEventListener('visibilitychange', () => this.sync());
    document.addEventListener('play', () => this.sync(), true);     // a lesson video started → music steps aside
    document.addEventListener('pause', () => this.sync(), true);
    document.addEventListener('click', (e) => { if (e.target.closest('#soundToggleBtn')) setTimeout(() => this.sync(), 50); }, true);
  }
};

// ---------------------------------------------------------------- voice
const Voice = {
  manifest: null,
  // same key for the same sentence, whatever emojis / punctuation / diacritics it carries
  norm(s) { return String(s || '').normalize('NFC').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().toLowerCase(); },
  key(s) { const t = this.norm(s); let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); },
  async load() {
    if (this.manifest) return this.manifest;
    try { const r = await fetch('assets/audio/voice/manifest.json'); this.manifest = r.ok ? await r.json() : {}; } catch (e) { this.manifest = {}; }
    return this.manifest;
  },
  fileFor(text, lang) {
    const L = lang && lang.startsWith('ar') ? 'ar' : lang && lang.startsWith('ko') ? 'ko' : 'en';
    const f = this.manifest?.[L]?.[this.key(text)];
    return f ? `assets/audio/voice/${L}/${f}` : null;
  },
  stop() { if (this.el) { try { this.el.pause(); } catch (e) {} this.el = null; } Music.duck(false); },
  // plays the recording if there is one; returns true when it did
  play(text, lang, btn) {
    const url = this.fileFor(text, lang); if (!url) return false;
    this.stop(); try { window.speechSynthesis?.cancel(); } catch (e) {}
    const a = new Audio(url); this.el = a;
    Music.duck(true); btn?.classList.add('speaking');
    const done = () => { btn?.classList.remove('speaking'); if (this.el === a) { this.el = null; Music.duck(false); } };
    a.addEventListener('ended', done); a.addEventListener('error', done);
    a.play().catch(done);
    return true;
  },
  // short praise / cue lines that exist ONLY as recordings (never robotic TTS)
  CUES: {
    bravo: { ar: 'برافو عليك!', en: 'Well done!' }, great: { ar: 'جامد جدًا!', en: 'Awesome!' }, again: { ar: 'قربت! جرّب تاني', en: 'So close — try again!' },
    record: { ar: 'رقم قياسي جديد!', en: 'New personal record!' }, levelup: { ar: 'طلعت مستوى جديد!', en: 'You levelled up!' },
    ready: { ar: 'استعد…', en: 'Get ready…' }, go: { ar: 'يلا!', en: 'Go!' }, kihap: { ar: 'كياي!', en: 'Kihap!' },
    welcome: { ar: 'أهلًا بيك يا بطل!', en: 'Welcome, champion!' }, warmupDone: { ar: 'برافو، خلّصت الإحماء!', en: 'Warm-up done — great job!' }
  },
  cue(id) {
    const c = this.CUES[id]; if (!c || AudioKit.gs()?.soundEnabled === false) return;
    const ar = TKD.ar; this.play(ar ? c.ar : c.en, ar ? 'ar-EG' : 'en-US');
  },
  hook() {
    const orig = SpeechHelper.speak.bind(SpeechHelper);
    SpeechHelper.speak = (text, lang = 'en-US', btn = null) => {
      if (this.play(text, lang, btn)) return;
      // phone voice: duck the music while it talks
      try {
        Music.duck(true);
        clearTimeout(this._undo);
        this._undo = setTimeout(() => Music.duck(false), Math.min(9000, 700 + String(text).length * 75));
      } catch (e) {}
      orig(text, lang, btn);
    };
  }
};

// ---------------------------------------------------------------- wire into the existing sound calls
(function wire() {
  const GP = (typeof GameState !== 'undefined') && GameState.prototype;
  if (GP && GP.playSound) {
    const orig = GP.playSound;
    const MAP = { kick: ['whoosh', { gain: 0.9 }], strike: ['hit', { gain: 1 }], success: ['success', { gain: 0.8, vary: 0 }], error: ['error', { gain: 0.8, vary: 0 }],
                  win: ['win', { gain: 0.7, vary: 0 }], click: ['ui-click', { gain: 0.6, vary: 0.08 }] };
    GP.playSound = function (type, frequency) {
      const m = MAP[type];
      if (m && AudioKit.sfx(m[0], m[1])) return;
      return orig.call(this, type, frequency);
    };
  }
  if (typeof ArenaSound !== 'undefined') {
    const wrap = (name, sample, opts) => { const o = ArenaSound[name].bind(ArenaSound); ArenaSound[name] = (...a) => { if (!AudioKit.sfx(sample, opts)) o(...a); }; };
    wrap('smack', 'hit', { gain: 1 });
    wrap('thud', 'bag-thud', { gain: 1 });
    wrap('crack', 'board-crack', { gain: 1, vary: 0.03 });
    wrap('whoosh', 'whoosh', { gain: 0.8 });
    wrap('buzz', 'error', { gain: 0.6, vary: 0 });
    const drum = ArenaSound.drum.bind(ArenaSound);
    ArenaSound.drum = (kind) => {
      const s = { kick: 'taiko', snare: 'clap' }[kind];
      if (s && AudioKit.sfx(s, { gain: 0.7, vary: 0.02 })) return;
      drum(kind);
    };
  }
  Voice.hook(); Voice.load();
  const start = () => Music.mount();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
window.AudioKit = AudioKit; window.Music = Music; window.Voice = Voice;
