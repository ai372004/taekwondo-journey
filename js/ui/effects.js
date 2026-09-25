// =====================================================================
// IMPACT PARTICLES & SCREEN SHAKE
// =====================================================================
// Honour the OS "reduce motion" setting in JS-driven effects too (the CSS
// media query only covers CSS animations, not canvas / sprite / shake).
const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class ImpactEffects {
  static init() {
    if (this.canvas) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'impact-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this._rafId = null;
    this._last = 0;

    const resize = () => {
      // Size the backing store in device pixels so sparks are crisp on
      // retina phones/tablets instead of blurry and upscaled.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(window.innerWidth  * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let resizeRaf = null;
    window.addEventListener('resize', () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => { resizeRaf = null; resize(); });
    });
    resize();
  }

  static burst(x, y, color = '#ff6b35') {
    if (prefersReducedMotion()) return;
    this.init();
    const palette = [color, '#ffffff', color, '#ff6b35'];
    for (let i = 0; i < 32; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 180 + Math.random() * 420;          // px / second
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 120,               // slight upward kick
        size: 2 + Math.random() * 4,
        color: palette[i % palette.length],
        age: 0,
        ttl: 0.45 + Math.random() * 0.35                 // seconds
      });
    }
    // Cap so rapid repeated bursts can't pile up thousands of particles.
    if (this.particles.length > 300) this.particles.splice(0, this.particles.length - 300);
    this._startLoop();
  }

  static _startLoop() {
    if (this._rafId) return;
    this._last = performance.now();
    const loop = (now) => {
      // Time-based physics: same speed on 60Hz and 120Hz screens.
      const dt = Math.min((now - this._last) / 1000, 0.05);
      this._last = now;
      const alive = this.update(dt);
      this._rafId = alive ? requestAnimationFrame(loop) : null;
    };
    this._rafId = requestAnimationFrame(loop);
  }

  // Returns false once every particle is gone, so the loop can stop instead
  // of running at full frame rate for the rest of the session.
  static update(dt) {
    const ctx = this.ctx;
    if (!ctx) return false;
    // Always clear — previously the clear was skipped once the array emptied,
    // leaving the last faint frame of sparks frozen on screen.
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const drag = Math.pow(0.02, dt);  // strong air drag → punchy burst that settles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.ttl) { this.particles.splice(i, 1); continue; }
      p.vx *= drag;
      p.vy = p.vy * drag + 900 * dt;   // gravity
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const t = 1 - p.age / p.ttl;
      ctx.globalAlpha = t * t;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.5 + 0.5 * t), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    return this.particles.length > 0;
  }
}
function toggleSound() {
  if (!GameStateInstance) return;
  GameStateInstance.soundEnabled = !GameStateInstance.soundEnabled;
  if (GameStateInstance.audioGain) {
    GameStateInstance.audioGain.gain.value = GameStateInstance.soundEnabled ? 0.3 : 0;
  }
  GameStateInstance.saveToStorage();

  const icon = document.getElementById('soundIcon');
  const btn = document.getElementById('soundToggleBtn');
  if (icon && btn) {
    if (GameStateInstance.soundEnabled) {
      icon.className = 'fas fa-volume-up';
      btn.classList.remove('muted');
      GameStateInstance.playSound('click');
    } else {
      icon.className = 'fas fa-volume-mute';
      btn.classList.add('muted');
    }
  }
}

// تفعيل تأثير الشرارة والاهتزاز عند الوصول للشكل الممتاز
const originalPlayReward = FormControlSystem.playRewardAnimation;
FormControlSystem.playRewardAnimation = function() {
  originalPlayReward.call(this);
  const stage = document.getElementById('form-stage');
  if (stage) {
    if (!prefersReducedMotion()) {
      stage.classList.remove('screen-kick-shake');
      void stage.offsetWidth;
      stage.classList.add('screen-kick-shake');
      // animationend bubbles up from child animations too — only react to the shake itself.
      const onEnd = (e) => {
        if (e.animationName !== 'kickShake') return;
        stage.classList.remove('screen-kick-shake');
        stage.removeEventListener('animationend', onEnd);
      };
      stage.addEventListener('animationend', onEnd);
    }
    const rect = stage.getBoundingClientRect();
    ImpactEffects.burst(rect.left + rect.width * 0.55, rect.top + rect.height * 0.45, '#ffd700');
    GameStateInstance?.playSound('strike');
  }
};