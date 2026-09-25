/* ===================================================================== */
/* 🥋 TAEKWONDO JOURNEY - COMPLETE GAME LOGIC WITH ALL UPDATED FEATURES  */
/* ===================================================================== */

// =====================================================================
// SPRITE ANIMATION ENGINE (Embedded for single file solution)
// =====================================================================

(function (global) {
  'use strict';

  const _imageCache = new Map();
  let _totalImages = 0;
  let _loadedImages = 0;

  function _preloadImage(url) {
    return new Promise((resolve) => {
      if (!url || typeof url !== 'string') return resolve(null);
      const safeUrl = url.replace(/ /g, '%20');
      if (_imageCache.has(safeUrl)) return resolve(safeUrl);
      // No crossOrigin here: these are same-origin assets, and requesting
      // them in CORS mode made every preload fail (and spam the console)
      // when the page is opened as a local file:// double-click instead of
      // through a server — file:// responses carry no CORS headers.
      const img = new Image();
      img.onload = () => {
        _imageCache.set(safeUrl, img);
        _loadedImages++;
        // Decode off the main thread now, so the first time this frame is
        // shown there's no decode hitch mid-animation.
        const done = () => resolve(safeUrl);
        if (img.decode) img.decode().then(done, done); else done();
      };
      img.onerror = () => {
        console.warn(`❌ Failed to load: ${safeUrl}`);
        resolve(null);
      };
      img.src = safeUrl;
    });
  }

  async function _preloadImages(urls) {
    if (!Array.isArray(urls)) return [];
    const validUrls = urls.filter(url => url && typeof url === 'string');
    _totalImages = validUrls.length;
    _loadedImages = 0;
    const results = await Promise.all(validUrls.map(_preloadImage));
    return results.filter(Boolean);
  }

  // Two stacked raster frames cross-fade into one another instead of
  // popping — plus a tiny GPU-only scale/translate "breath" carried across
  // the fade — reads as fluid, tween-like motion out of the same discrete
  // frame set, no new art needed. Heavier than a flat background swap
  // (two live layers, two transitions running every frame) by design —
  // that's the trade the smoother motion is bought with.
  const REDUCE_MOTION = typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class SpriteAnimator {
    constructor(element, animationSet = {}) {
      if (!element) throw new Error('SpriteAnimator requires a DOM element');
      this.element = element;
      this.animationSet = animationSet;
      this.currentAnimation = '';
      this.currentFrames = [];
      this.currentIndex = 0;
      this.frameCount = 0;
      this.fps = 8;
      this.loop = true;
      this.holdLast = 0;
      this.onComplete = null;
      this.onFrameChange = null;
      this._accumulator = 0;
      this._isPlaying = false;
      this._isPaused = false;
      this._frameDuration = 1000 / this.fps;
      this._bounceTick = 0;
      this._initializeElement();
    }

    _initializeElement() {
      const style = this.element.style;
      style.backgroundImage = 'none';
      style.transformOrigin = 'center bottom';
      if (REDUCE_MOTION) {
        // Fall back to the original single flat-image swap — no crossfade,
        // no motion layers — for anyone who asked the OS for less motion.
        style.backgroundSize = 'contain';
        style.backgroundRepeat = 'no-repeat';
        style.backgroundPosition = 'center';
        this._flat = true;
        return;
      }
      this._flat = false;
      // Defensive: a previous animator on this same element (a character
      // slot getCharacterVisual() re-creates on selection change) may have
      // left its own layer pair behind — clear them so layers never stack.
      this.element.querySelectorAll(':scope > .spr-frame-layer').forEach(n => n.remove());
      // Give ourselves a positioning context for the two absolutely-placed
      // frame layers, without clobbering a layout position the page already
      // relies on (absolute/fixed/sticky character slots exist elsewhere).
      const computedPosition = window.getComputedStyle(this.element).position;
      if (computedPosition === 'static') style.position = 'relative';
      style.overflow = style.overflow || 'visible';
      this._layerA = document.createElement('div');
      this._layerB = document.createElement('div');
      [this._layerA, this._layerB].forEach(layer => {
        layer.className = 'spr-frame-layer';
        layer.style.position = 'absolute';
        layer.style.inset = '0';
        layer.style.backgroundSize = 'contain';
        layer.style.backgroundRepeat = 'no-repeat';
        layer.style.backgroundPosition = 'center';
        layer.style.opacity = '0';
        layer.style.willChange = 'opacity, transform';
        layer.style.pointerEvents = 'none';
        this.element.appendChild(layer);
      });
      this._front = this._layerA;
      this._back = this._layerB;
    }

    play(animationName, options = {}) {
      const animation = this.animationSet[animationName];
      if (!animation) {
        if (animationName !== 'IDLE' && this.animationSet['IDLE']) return this.play('IDLE', options);
        return false;
      }
      this.stop();
      const frames = Array.isArray(animation.frames) ? animation.frames : [];
      if (frames.length === 0) return false;
      this.fps = options.fps ?? animation.fps ?? 8;
      this.loop = options.loop ?? animation.loop ?? true;
      this.holdLast = options.holdLast ?? animation.holdLast ?? 0;
      this.onComplete = options.onComplete ?? animation.onComplete ?? null;
      this.onFrameChange = options.onFrameChange ?? animation.onFrameChange ?? null;
      this._frameDuration = 1000 / this.fps;
      this.currentAnimation = animationName;
      this.currentFrames = frames;
      this.currentIndex = 0;
      this.frameCount = frames.length;
      this._showFrame(0);
      this._isPlaying = true;
      this._isPaused = false;
      this._accumulator = 0;
      // A one-frame, non-looping animation has nothing to advance through,
      // so update() never reaches the end — fire completion straight away
      // instead of leaving onComplete hanging forever.
      if (frames.length === 1 && !this.loop) this._completeAnimation();
      else SpriteEngine._wake();
      return true;
    }

    stop() {
      this._isPlaying = false;
      this._isPaused = false;
      this.currentAnimation = '';
      // Cancel a pending holdLast completion, otherwise switching animation
      // during the hold still fires the OLD animation's onComplete.
      if (this._holdTimer) { clearTimeout(this._holdTimer); this._holdTimer = null; }
    }

    // Removes the two crossfade layers this animator added to its element.
    // Must run before the element is handed to a fresh SpriteAnimator,
    // otherwise the old and new layer pairs stack on top of each other.
    destroy() {
      this.stop();
      if (this._layerA) this._layerA.remove();
      if (this._layerB) this._layerB.remove();
      this._layerA = this._layerB = this._front = this._back = null;
    }

    pause() { if (this._isPlaying && !this._isPaused) this._isPaused = true; }
    resume() { if (this._isPlaying && this._isPaused) { this._isPaused = false; SpriteEngine._wake(); } }

    get isActive() { return this._isPlaying && !this._isPaused && this.currentFrames.length > 1; }

    update(deltaTime) {
      if (!this._isPlaying || this._isPaused || this.currentFrames.length <= 1) return;
      this._accumulator += deltaTime;
      while (this._accumulator >= this._frameDuration) {
        this._accumulator -= this._frameDuration;
        this._advanceFrame();
      }
    }

    _advanceFrame() {
      this.currentIndex++;
      if (this.currentIndex >= this.frameCount) {
        if (this.loop) {
          this.currentIndex = 0;
        } else {
          this.currentIndex = this.frameCount - 1;
          this._showFrame(this.currentIndex);
          this._completeAnimation();
          return;
        }
      }
      this._showFrame(this.currentIndex);
    }

    _showFrame(frameIndex) {
      if (frameIndex < 0 || frameIndex >= this.currentFrames.length) return;
      const frameUrl = this.currentFrames[frameIndex];
      const safeUrl = frameUrl.replace(/ /g, '%20');
      if (this._flat) {
        this.element.style.backgroundImage = `url('${safeUrl}')`;
      } else {
        this._crossfadeToFrame(safeUrl);
      }
      if (typeof this.onFrameChange === 'function') {
        this.onFrameChange(this.currentIndex, this.frameCount);
      }
    }

    // Loads the new frame into the hidden layer, then transitions both
    // layers' opacity (and a hairline scale/translate "breath") over the
    // same span as one animation frame, so by the time the next frame is
    // due the cross-fade has just finished — the eye never sees a hard cut.
    _crossfadeToFrame(safeUrl) {
      const dur = Math.max(60, this._frameDuration * 0.92);
      const front = this._front, back = this._back;
      this._bounceTick = (this._bounceTick + 1) % 2;
      const lift = this._bounceTick === 0 ? 'scale(1.012) translateY(-1.5px)' : 'scale(1) translateY(0)';
      back.style.backgroundImage = `url('${safeUrl}')`;
      back.style.transition = 'none';
      back.style.transform = front.style.transform || 'scale(1) translateY(0)';
      // Force a style flush so the transition below actually animates from
      // the values just set, instead of the browser coalescing them away.
      void back.offsetWidth;
      const easing = `opacity ${dur}ms linear, transform ${dur}ms ease-in-out`;
      front.style.transition = easing;
      back.style.transition = easing;
      front.style.opacity = '0';
      back.style.opacity = '1';
      back.style.transform = lift;
      this._front = back;
      this._back = front;
    }

    _completeAnimation() {
      this._isPlaying = false;
      if (this.holdLast > 0) {
        this._holdTimer = setTimeout(() => { this._holdTimer = null; this._fireCompletion(); }, this.holdLast);
      }
      else this._fireCompletion();
    }

    _fireCompletion() {
      if (typeof this.onComplete === 'function') {
        try { this.onComplete(this); } catch (error) { console.error('Error in onComplete callback:', error); }
      }
    }
  }

  const SpriteEngine = {
    _animators: new Set(),
    _isRunning: false,
    _lastTimestamp: 0,
    _animationFrameId: null,

    createAnimator(element, animationSet) {
      const animator = new SpriteAnimator(element, animationSet);
      this._animators.add(animator);
      if (!this._isRunning) this.start();
      return animator;
    },

    removeAnimator(animator) {
      if (animator) {
        animator.destroy();
        this._animators.delete(animator);
      }
    },

    start() {
      if (this._isRunning) return;
      this._isRunning = true;
      this._lastTimestamp = performance.now();
      const animate = (timestamp) => {
        if (!this._isRunning) return;
        // Clamp the delta: after a background tab / phone lock the gap can be
        // many seconds, and the accumulator would then fast-forward dozens of
        // frames in one tick (visible "skip" + a burst of onFrameChange calls).
        const deltaTime = Math.min(timestamp - this._lastTimestamp, 100);
        this._lastTimestamp = timestamp;
        let anyActive = false;
        this._animators.forEach(animator => {
          animator.update(deltaTime);
          if (animator.isActive) anyActive = true;
        });
        // Nothing is moving → go to sleep instead of spinning rAF at 60–120Hz
        // forever (battery drain on tablets). play()/resume() wake it up.
        if (!anyActive) { this._isRunning = false; this._animationFrameId = null; return; }
        this._animationFrameId = requestAnimationFrame(animate);
      };
      this._animationFrameId = requestAnimationFrame(animate);
    },

    _wake() { if (!this._isRunning && !document.hidden) this.start(); },

    stop() {
      this._isRunning = false;
      if (this._animationFrameId) {
        cancelAnimationFrame(this._animationFrameId);
        this._animationFrameId = null;
      }
      this._animators.forEach(animator => animator.stop());
    },

    pauseAll() { this._animators.forEach(animator => animator.pause()); },
    resumeAll() { this._animators.forEach(animator => animator.resume()); },

    async preloadAnimations(animationSets) {
      const allUrls = new Set();
      Object.values(animationSets).forEach(animationSet => {
        Object.values(animationSet).forEach(animation => {
          if (Array.isArray(animation.frames)) {
            animation.frames.forEach(url => {
              if (url) allUrls.add(url.replace(/ /g, '%20'));
            });
          }
        });
      });
      return await _preloadImages(Array.from(allUrls));
    },

    clearCache() {
      _imageCache.clear();
      _totalImages = 0;
      _loadedImages = 0;
    }
  };

  global.SpriteEngine = SpriteEngine;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpriteEngine.start());
  } else {
    SpriteEngine.start();
  }

  // Freeze sprite playback while the tab/app is in the background.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      SpriteEngine._isRunning = false;
      if (SpriteEngine._animationFrameId) cancelAnimationFrame(SpriteEngine._animationFrameId);
      SpriteEngine._animationFrameId = null;
    } else {
      SpriteEngine.start();
    }
  });

})(window);

