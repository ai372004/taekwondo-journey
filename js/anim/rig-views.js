// ============================================================================
// Smooth skeletal animation in the game (v27).
//   • RigView     — the lesson card: the character moves INTO each phase
//                   (slow motion, with a faint "onion skin" of the previous
//                   phase) and can play the whole kick at full speed.
//   • RigFighter  — drop-in replacement for ArenaFighter in the 6 arena games
//                   and in 1×1 duels: same API (setPose / play / strikePoint).
//   • RigOpponent — the sparring partner, same idea.
// Everything falls back to the picture frames if the rig can't load or the
// kick has no skeletal animation yet (e.g. the side kick).
// ============================================================================

const RigSupport = {
  animFor(data, skillId) { return TKDAnim.enabled() ? TKDAnim.kickAnim(data, skillId) : null; },
  ch(isBoy) { return isBoy ? 'boy' : 'girl'; },
  // quick check without loading: which kicks CAN animate
  has(skillId) { return TKDAnim.enabled() && !!TKDAnim.KICK_ANIM[skillId]; }
};

// ---------------------------------------------------------------- lesson view
class RigView {
  constructor(host, { ch = 'boy', skillId = 'apchagi', color = '#ff6b35', ar = false } = {}) {
    this.host = host; this.ch = ch; this.skillId = skillId; this.color = color; this.ar = ar;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'phase-rig';
    this.canvas.setAttribute('role', 'img');
    this.phase = 0; this.loopT = 0; this.mode = 'phase';
    this.alive = true;
  }
  async start(phase) {
    const rig = await TKDAnim.character(this.ch);
    if (!rig || !this.alive) return false;
    this.anim = RigSupport.animFor(rig.data, this.skillId);
    if (!this.anim) return false;
    this.rig = rig;
    this.onion = new TKDAnim.Skeleton(rig.data);
    this.times = rig.player.phaseTimes(this.anim);
    this.host.appendChild(this.canvas);
    this.host.classList.add('has-rig');
    this.controls();
    this.showPhase(phase, true);
    this.last = 0;
    const tick = t => {
      const scr = this.canvas.closest('.screen');
      if (!this.alive || !this.canvas.isConnected || (scr && !scr.classList.contains('active'))) { this.alive = false; return; }   // left the lesson → stop
      const dt = this.last ? Math.min(0.05, (t - this.last) / 1000) : 0; this.last = t;
      this.update(dt); this.draw();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return true;
  }
  controls() {
    const b = document.createElement('div');
    b.className = 'rig-controls';
    b.innerHTML = `<button type="button" class="rig-btn" data-a="full" aria-label="${this.ar ? 'شغّل الركلة كاملة' : 'Play the whole kick'}">▶ ${this.ar ? 'الركلة كاملة' : 'Whole kick'}</button>
      <button type="button" class="rig-btn" data-a="slow" aria-pressed="false">🐢 ${this.ar ? 'بطيء' : 'Slow'}</button>`;
    this.host.appendChild(b);
    b.querySelector('[data-a="full"]').addEventListener('click', () => this.playFull());
    const slow = b.querySelector('[data-a="slow"]');
    slow.addEventListener('click', () => { this.slow = !this.slow; slow.setAttribute('aria-pressed', this.slow); slow.classList.toggle('on', this.slow); if (this.mode === 'full') this.rig.player.speed = this.slow ? 0.3 : 1; });
  }
  showPhase(i, instant = false) {
    this.phase = i; this.mode = 'phase'; this.loopT = 0;
    const p = this.rig.player;
    if (i === 0) { p.play('idle', { loop: true, mix: instant ? 0 : 0.3 }); return; }
    // slow-motion from the previous phase into this one, then hold
    p.play(this.anim, { from: this.times[i - 1], until: this.times[i], speed: 0.45, mix: instant ? 0 : 0.2 });
  }
  playFull() {
    this.mode = 'full';
    const p = this.rig.player;
    p.play(this.anim, { speed: this.slow ? 0.3 : 1, mix: 0.15 });
    p.onComplete = () => { p.onComplete = null; if (this.mode === 'full') this.showPhase(this.phase); };
  }
  update(dt) {
    this.rig.player.update(dt);
    if (this.mode === 'phase' && this.phase > 0) {
      this.loopT += dt;
      if (this.loopT > 3.2) this.showPhase(this.phase);          // repeat the demonstration
    }
  }
  draw() {
    const c = this.canvas, dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth || 240, h = c.clientHeight || 300;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const d = this.rig.data.extra;
    const s = Math.min(h * 0.66, w * 0.95) / d.height;
    const ground = h * 0.95, x = w * 0.46 - (d.ankleB?.[0] || 0) * s;
    // floor
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.beginPath(); g.ellipse(w * 0.46, ground, w * 0.3, h * 0.025, 0, 0, Math.PI * 2); g.fill();
    // onion skin: the previous phase, faint, so kids see where the leg came from
    if (this.mode === 'phase' && this.phase > 0) {
      TKDAnim.poseAt(this.onion, this.anim, this.times[this.phase - 1]);
      this.onion.draw(g, x, ground, s, false, 0.22);
    }
    this.rig.skeleton.draw(g, x, ground, s);
    window.Shop?.drawCosmetics(this.rig.skeleton, g, x, ground, s);
  }
  destroy() { this.alive = false; this.canvas.remove(); }
}

// ---------------------------------------------------------------- arena fighter
class RigFighter extends ArenaFighter {
  constructor(stage, urls, opts, { ch, skillId }) {
    super(stage, urls, opts);
    this.ch = ch; this.skillId = skillId;
    this.rig = null; this.rigGhosts = [];
  }
  async load() {
    const rig = await TKDAnim.character(this.ch);
    const anim = rig && RigSupport.animFor(rig.data, this.skillId);
    if (!anim) return super.load();                          // side kick etc. → picture frames
    this.rig = rig; this.anim = anim;
    this.times = rig.player.phaseTimes(anim);
    this.scratch = new TKDAnim.Skeleton(rig.data);
    this._strike = {};
    rig.player.play('idle', { loop: true, mix: 0 });
    this.ready = true;
    return true;
  }
  get scale() { return this.height / (this.rig.data.extra.height || 1000); }
  originX(lx = 0) { return this.x + this.lunge + lx - (this.rig.data.extra.ankleB?.[0] || 0) * this.scale; }
  strikePoint(i) {
    if (!this.rig) return super.strikePoint(i);
    if (!this._strike[i]) {
      TKDAnim.poseAt(this.scratch, this.anim, this.times[i] ?? 0);
      // axe kick lands with the heel, the others with the ball / sole of the foot
      this._strike[i] = this.scratch.boneTip('footF', this.anim === 'naeryeo' ? 0.15 : 0.8);
    }
    const p = this._strike[i], s = this.scale;
    const x = this.originX() + p.x * s, y = this.floor - p.y * s;
    if (!this.mirror) return { x, y };
    const px = this.x + this.lunge;
    return { x: 2 * px - x - 2 * this.lunge, y };
  }
  setPose(i, fadeDur = 0.09, ghost = false) {
    if (!this.rig) return super.setPose(i, fadeDur, ghost);
    if (i === this.pose && this._settled) return;
    const P = this.rig.player;
    if (ghost && !AG.reduced()) this.rigGhosts.push({ pose: Float32Array.from(this.rig.skeleton.local), a: 0.3, x: this.lunge });
    const from = this.pose;
    this.prev = this.pose; this.pose = i; this.fade = 1; this._settled = false;
    const t0 = P.curName === this.anim && P.cur ? P.time : (this.times[from] ?? 0);
    if (i === 0) { P.play('idle', { loop: true, mix: Math.max(0.12, fadeDur * 2) }); this._settled = true; return; }
    if (i > from || (P.cur && P.curName === this.anim && t0 < this.times[i])) {
      const span = Math.max(0.001, this.times[i] - t0);
      const dur = Math.max(0.06, Math.min(span * 0.9, Math.max(fadeDur * 1.6, 0.08)));
      P.play(this.anim, { from: t0, until: this.times[i], speed: span / dur, mix: 0.04 });
    } else {
      P.pose(this.anim, this.times[i], Math.max(0.08, fadeDur * 1.5));
    }
  }
  update(dt) {
    super.update(dt);
    if (!this.rig) return;
    this.rig.player.update(dt);
    this.rigGhosts.forEach(g => (g.a -= dt * 1.6));
    this.rigGhosts = this.rigGhosts.filter(g => g.a > 0);
  }
  drawRig(c, local, alpha, lungeOverride) {
    const sk = this.rig.skeleton;
    let saved = null;
    if (local) { saved = Float32Array.from(sk.local); sk.local.set(local); sk.updateWorld(); }
    const lx = lungeOverride !== undefined ? lungeOverride - this.lunge : 0;
    c.save();
    const px = this.x + this.lunge + lx, py = this.floor;
    if (this.mirror) { c.translate(-2 * (this.lunge + lx), 0); c.translate(px, py); c.scale(-1, 1); c.translate(-px, -py); }
    c.translate(px, py);
    if (this.wobble > 0) c.rotate(Math.sin(this.bob * 22) * 0.08 * this.wobble);
    if (this.tilt) c.rotate(this.tilt);
    const sq = this.squash; c.scale(1 + sq * 0.05, 1 - sq * 0.04);
    c.translate(-px, -py);
    sk.draw(c, this.originX(lx), this.floor, this.scale, false, alpha * this.alpha);
    window.Shop?.drawCosmetics(sk, c, this.originX(lx), this.floor, this.scale, false, alpha * this.alpha);
    c.restore();
    if (saved) { sk.local.set(saved); sk.updateWorld(); }
  }
  draw(c) {
    if (!this.rig) return super.draw(c);
    if (!this.ready) return;
    c.save(); c.scale(1, 0.22);
    const fx = this.footScreenX();
    const sh = c.createRadialGradient(fx, this.floor / 0.22, 2, fx, this.floor / 0.22, this.height * 0.3);
    sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh; c.beginPath(); c.arc(fx, this.floor / 0.22, this.height * 0.3, 0, Math.PI * 2); c.fill();
    c.restore();
    this.rigGhosts.forEach(g => this.drawRig(c, g.pose, g.a, g.x));
    this.drawRig(c, null, 1);
  }
}

// the one place that decides: skeleton or picture frames
function arenaMakeFighter(stage, skillId, isBoy, opts = {}) {
  const urls = arenaKickFrames(skillId, isBoy);
  const o = { shared: arenaSharedCanvas(skillId), ...opts };
  if (typeof TKDAnim !== 'undefined' && RigSupport.has(skillId)) return new RigFighter(stage, urls, o, { ch: RigSupport.ch(isBoy), skillId });
  return new ArenaFighter(stage, urls, o);
}

// ---------------------------------------------------------------- sparring partner
class RigOpponent extends ArenaOpponent {
  constructor(stage, set, ch) { super(stage, set); this.ch = ch; this.rig = null; this.lastPose = null; }
  async load() {
    const rig = await TKDAnim.character(this.ch);
    if (!rig || !TKDAnim.enabled()) return super.load();
    this.rig = rig; this.ready = true;
    rig.player.play('idle', { loop: true, mix: 0 });
    return true;
  }
  sync() {
    if (this.pose === this.lastPose) return;
    this.lastPose = this.pose;
    const P = this.rig.player;
    ({
      guard: () => P.play('idle', { loop: true, mix: 0.2 }),
      hitHead: () => P.play('hit', { mix: 0.05, speed: 1.1 }),
      hitBody: () => P.play('hit', { mix: 0.05 }),
      attack: () => P.play('apchagi', { from: 0.12, until: 0.5, mix: 0.08, speed: 1.2 }),
      block: () => P.play('hit', { until: 0.08, mix: 0.08 }),
      win: () => P.play('win', { loop: true, mix: 0.15 })
    }[this.pose] || (() => {}))();
  }
  update(dt) { super.update(dt); if (this.rig) { this.sync(); this.rig.player.update(dt); } }
  draw(c) {
    if (!this.rig) return super.draw(c);
    const cx = this.x + this.kx + this.stepX;
    c.save(); c.scale(1, 0.22);
    const sh = c.createRadialGradient(cx, this.floor / 0.22, 2, cx, this.floor / 0.22, this.height * 0.3);
    sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh; c.beginPath(); c.arc(cx, this.floor / 0.22, this.height * 0.3, 0, Math.PI * 2); c.fill();
    c.restore();
    const d = this.rig.data.extra, s = this.height / (d.height || 1000);
    c.save();
    c.translate(cx, this.floor); c.scale(-1, 1); c.translate(-cx, -this.floor);   // face left, toward the player
    if (this.flashT > 0) c.filter = `brightness(${1 + this.flashT * 1.4}) saturate(${1 - this.flashT * 0.5})`;
    this.rig.skeleton.draw(c, cx - (d.ankleB?.[0] || 0) * s, this.floor, s);
    window.Shop?.drawCosmetics(this.rig.skeleton, c, cx - (d.ankleB?.[0] || 0) * s, this.floor, s);
    c.restore();
  }
}
function arenaMakeOpponent(stage, set, ch) {
  return (typeof TKDAnim !== 'undefined' && TKDAnim.enabled()) ? new RigOpponent(stage, set, ch) : new ArenaOpponent(stage, set);
}
window.RigView = RigView; window.RigFighter = RigFighter; window.arenaMakeFighter = arenaMakeFighter; window.arenaMakeOpponent = arenaMakeOpponent;

// ---------------------------------------------------------------- small live character
// A little animated character for the home journey card, the winner screen, …
class RigSprite {
  constructor(host, { ch = 'boy', anim = 'idle', height = 120, tap = 'win', headroom = 1.0 } = {}) {
    this.host = host; this.ch = ch; this.animName = anim; this.h = height; this.tapAnim = tap; this.headroom = headroom;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'rig-sprite';
    this.canvas.setAttribute('aria-hidden', 'true');
  }
  async start() {
    if (!window.TKDAnim || !TKDAnim.enabled()) return false;
    const rig = await TKDAnim.character(this.ch);
    if (!rig || !rig.data.animations[this.animName]) return false;
    this.rig = rig;
    this.host.appendChild(this.canvas);
    this.canvas.addEventListener('click', () => this.play(this.tapAnim));
    rig.player.play(this.animName, { loop: true, mix: 0 });
    rig.player.update(0); this.draw();       // paint at once — no empty box while the first frame is waited for
    let last = 0;
    const tick = (t) => {
      const scr = this.canvas.closest('.screen');
      if (!this.canvas.isConnected || (scr && !scr.classList.contains('active'))) { this.stop = true; return; }
      if (document.hidden || !last) { last = t; if (!this.stop) requestAnimationFrame(tick); return; }
      const dt = Math.min(0.08, (t - last) / 1000);
      if (dt < 1 / 32) { if (!this.stop) requestAnimationFrame(tick); return; }   // 30 fps is plenty for a little idle character
      last = t;
      rig.player.update(dt); this.draw();
      if (!this.stop) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return true;
  }
  play(name) {
    const p = this.rig?.player; if (!p || !this.rig.data.animations[name]) return;
    window.AudioKit?.sfx('ui-pop', { gain: 0.35 });
    p.play(name, { mix: 0.12 });
    p.onComplete = () => { p.onComplete = null; p.play(this.animName, { loop: true, mix: 0.25 }); };
  }
  draw() {
    const c = this.canvas, dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth || 100, h = c.clientHeight || this.h;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    const d = this.rig.data.extra;
    const s = (h * 0.9 / this.headroom) / d.height;
    const ground = h * 0.97, x = w / 2 - (d.ankleB?.[0] || 0) * s;
    g.fillStyle = 'rgba(0,0,0,.25)';
    g.beginPath(); g.ellipse(w / 2, ground, w * 0.26, h * 0.025, 0, 0, Math.PI * 2); g.fill();
    this.rig.skeleton.draw(g, x, ground, s);
    window.Shop?.drawCosmetics(this.rig.skeleton, g, x, ground, s);
  }
}
window.RigSprite = RigSprite;
