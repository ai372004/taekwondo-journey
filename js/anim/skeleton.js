// ============================================================================
// TKDAnim — a small skeletal-animation runtime (v27).
//
// Reads the same files the Spine editor exports (JSON 3.8/4.x + .atlas), limited
// to what a 2D kids' game needs: bones, slots, region attachments, draw order,
// rotate / translate / scale timelines with linear, stepped and bezier curves,
// events, cross-fading between animations and springy "secondary motion" bones
// (a ponytail, a belt tail). Meshes, IK and skins beyond "default" are ignored —
// an artist exporting from Spine should stick to region attachments.
//
// The game's own rigs (assets/anim/boy, assets/anim/girl) are built from the
// existing character art by tools/rig/build-rig.py and use exactly this format,
// so a professional Spine export can replace them file-for-file.
// ============================================================================
const TKDAnim = (() => {
  const DEG = Math.PI / 180;

  // ------------------------------------------------------------------ atlas
  function parseAtlas(text) {
    const pages = []; let page = null, region = null;
    const lines = text.split(/\r?\n/);
    for (let raw of lines) {
      const line = raw.trim();
      if (!line) { page = null; region = null; continue; }
      const kv = line.match(/^([a-zA-Z]+)\s*:\s*(.*)$/);
      if (!kv) {
        if (!page) { page = { name: line, regions: {} }; pages.push(page); region = null; }
        else { region = { name: line, x: 0, y: 0, w: 0, h: 0, rotate: 0, ox: 0, oy: 0, ow: 0, oh: 0 }; page.regions[line] = region; }
        continue;
      }
      const [, k, v] = kv; const n = v.split(',').map(s => s.trim());
      if (!region) { if (k === 'size') { page.w = +n[0]; page.h = +n[1]; } continue; }
      if (k === 'bounds') { [region.x, region.y, region.w, region.h] = n.map(Number); }
      else if (k === 'xy') { region.x = +n[0]; region.y = +n[1]; }
      else if (k === 'size') { region.w = +n[0]; region.h = +n[1]; }
      else if (k === 'offsets') { [region.ox, region.oy, region.ow, region.oh] = n.map(Number); }
      else if (k === 'orig') { region.ow = +n[0]; region.oh = +n[1]; }
      else if (k === 'offset') { region.ox = +n[0]; region.oy = +n[1]; }
      else if (k === 'rotate') { region.rotate = n[0] === 'true' ? 90 : n[0] === 'false' ? 0 : +n[0]; }
    }
    pages.forEach(p => Object.values(p.regions).forEach(r => {
      if (r.rotate === 90 || r.rotate === 270) { /* stored sideways: w/h are the ORIGINAL size in 4.x "bounds" */ }
      if (!r.ow) { r.ow = r.w; r.oh = r.h; }
    }));
    return pages;
  }

  // ------------------------------------------------------------------ curves
  // Spine 4.x: curve = 'stepped' | [cx1, cy1, cx2, cy2, ...] (absolute time/value per channel)
  // Spine 3.8: curve = 'stepped' | number cx1 with c2, c3, c4 (normalised 0..1)
  function bezierY(t0, v0, t1, v1, cx1, cy1, cx2, cy2, time) {
    // solve x(s) = time for s in [0,1] (bisection is robust and plenty fast for a few bones)
    let lo = 0, hi = 1, s = 0.5;
    for (let i = 0; i < 18; i++) {
      s = (lo + hi) / 2;
      const u = 1 - s, x = u * u * u * t0 + 3 * u * u * s * cx1 + 3 * u * s * s * cx2 + s * s * s * t1;
      if (x < time) lo = s; else hi = s;
    }
    const u = 1 - s;
    return u * u * u * v0 + 3 * u * u * s * cy1 + 3 * u * s * s * cy2 + s * s * s * v1;
  }
  // keys: [{time, v:[...values], curve}] -> values at time
  function sample(keys, time, n) {
    if (!keys.length) return null;
    if (time <= keys[0].time) return keys[0].v;
    const last = keys[keys.length - 1];
    if (time >= last.time) return last.v;
    let i = 0; while (i < keys.length - 2 && keys[i + 1].time <= time) i++;
    const a = keys[i], b = keys[i + 1];
    if (a.curve === 'stepped') return a.v;
    const out = [];
    for (let c = 0; c < n; c++) {
      const v0 = a.v[c], v1 = b.v[c];
      if (Array.isArray(a.curve)) {
        if (a.curve.length >= 4 * (c + 1)) {
          const k = a.curve.slice(4 * c, 4 * c + 4);
          out.push(bezierY(a.time, v0, b.time, v1, k[0], k[1], k[2], k[3], time));
          continue;
        }
      } else if (a.curve && a.curve.c38) {
        const k = a.curve.c38, dt = b.time - a.time;
        out.push(bezierY(a.time, v0, b.time, v1, a.time + k[0] * dt, v0 + k[1] * (v1 - v0), a.time + k[2] * dt, v0 + k[3] * (v1 - v0), time));
        continue;
      }
      const p = (time - a.time) / (b.time - a.time);
      out.push(v0 + (v1 - v0) * p);
    }
    return out;
  }
  function readCurve(k) {
    if (k.curve === 'stepped') return 'stepped';
    if (Array.isArray(k.curve)) return k.curve;
    if (typeof k.curve === 'number') return { c38: [k.curve, k.c2 ?? 0, k.c3 ?? 1, k.c4 ?? 1] };
    return null;
  }

  // ------------------------------------------------------------------ data
  class SkeletonData {
    constructor(json, atlasPages, images) {
      this.json = json;
      this.bones = json.bones.map(b => ({
        name: b.name, parent: -1, x: b.x || 0, y: b.y || 0, rotation: b.rotation || 0,
        scaleX: b.scaleX ?? 1, scaleY: b.scaleY ?? 1, length: b.length || 0
      }));
      const idx = {}; this.bones.forEach((b, i) => (idx[b.name] = i));
      json.bones.forEach((b, i) => { if (b.parent) this.bones[i].parent = idx[b.parent]; });
      this.boneIndex = idx;
      const regions = {}; const pageImg = {};
      atlasPages.forEach(p => { pageImg[p.name] = images[p.name]; Object.values(p.regions).forEach(r => (regions[r.name] = { ...r, img: images[p.name] })); });
      const skin = (Array.isArray(json.skins) ? json.skins.find(s => s.name === 'default') : json.skins?.default);
      const atts = skin ? (skin.attachments || skin) : {};
      this.slots = json.slots.map(s => ({ name: s.name, bone: idx[s.bone], attachment: s.attachment || null }));
      this.attachments = {};
      for (const [slot, list] of Object.entries(atts)) {
        for (const [name, a] of Object.entries(list)) {
          if (a.type && a.type !== 'region') continue;
          const r = regions[a.path || name]; if (!r) continue;
          this.attachments[slot + '/' + name] = { x: a.x || 0, y: a.y || 0, rotation: a.rotation || 0, scaleX: a.scaleX ?? 1, scaleY: a.scaleY ?? 1, width: a.width ?? r.ow, height: a.height ?? r.oh, region: r };
        }
      }
      this.events = json.events || {};
      this.animations = {};
      for (const [name, a] of Object.entries(json.animations || {})) this.animations[name] = this.readAnimation(a);
      this.extra = json.skeleton?.tkd || {};
    }
    readAnimation(a) {
      const bones = {}; let duration = 0;
      for (const [bn, tl] of Object.entries(a.bones || {})) {
        const bi = this.boneIndex[bn]; if (bi === undefined) continue;
        const t = {};
        if (tl.rotate) t.rotate = tl.rotate.map(k => ({ time: k.time || 0, v: [k.value ?? k.angle ?? 0], curve: readCurve(k) }));
        if (tl.translate) t.translate = tl.translate.map(k => ({ time: k.time || 0, v: [k.x || 0, k.y || 0], curve: readCurve(k) }));
        if (tl.scale) t.scale = tl.scale.map(k => ({ time: k.time || 0, v: [k.x ?? 1, k.y ?? 1], curve: readCurve(k) }));
        Object.values(t).forEach(keys => keys.length && (duration = Math.max(duration, keys[keys.length - 1].time)));
        bones[bi] = t;
      }
      const events = (a.events || []).map(e => ({ time: e.time || 0, name: e.name, int: e.int ?? this.events[e.name]?.int ?? 0, string: e.string ?? '' }));
      events.forEach(e => (duration = Math.max(duration, e.time)));
      return { bones, events, duration };
    }
  }

  // ------------------------------------------------------------------ pose
  // local pose = Float32Array per bone: [x, y, rotation, scaleX, scaleY]
  function setupPose(data) { const p = new Float32Array(data.bones.length * 5); data.bones.forEach((b, i) => p.set([b.x, b.y, b.rotation, b.scaleX, b.scaleY], i * 5)); return p; }
  function applyAnimation(data, anim, time, out) {
    out.set(setupPose(data));
    for (const [bi, t] of Object.entries(anim.bones)) {
      const o = bi * 5, b = data.bones[bi];
      if (t.rotate) { const v = sample(t.rotate, time, 1); out[o + 2] = b.rotation + v[0]; }
      if (t.translate) { const v = sample(t.translate, time, 2); out[o] = b.x + v[0]; out[o + 1] = b.y + v[1]; }
      if (t.scale) { const v = sample(t.scale, time, 2); out[o + 3] = b.scaleX * v[0]; out[o + 4] = b.scaleY * v[1]; }
    }
    return out;
  }
  function blend(a, b, t, out) {
    for (let i = 0; i < a.length; i++) {
      if (i % 5 === 2) { let d = ((b[i] - a[i]) % 360 + 540) % 360 - 180; out[i] = a[i] + d * t; }
      else out[i] = a[i] + (b[i] - a[i]) * t;
    }
    return out;
  }

  // ------------------------------------------------------------------ mip levels
  // Shrinking a big atlas on every frame is the most expensive part of drawing a
  // character on a phone. Keep halved copies (built once, by halving so they stay
  // sharp) and draw from the smallest one that still has enough pixels.
  function mip(img, eff) {
    if (!img || eff >= 0.7 || typeof document === 'undefined') return { img, k: 1 };
    const levels = img._tkdMips || (img._tkdMips = [{ img, k: 1 }]);
    let k = 1;
    while (k / 2 >= eff * 1.15 && k > 0.126) k /= 2;
    let lv = levels.find(l => l.k === k);
    if (lv) return lv;
    let prev = levels[levels.length - 1];
    while (prev.k > k) {
      const nk = prev.k / 2, c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * nk)); c.height = Math.max(1, Math.round(img.height * nk));
      const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
      g.drawImage(prev.img, 0, 0, c.width, c.height);
      prev = { img: c, k: nk }; levels.push(prev);
    }
    return prev;
  }

  // ------------------------------------------------------------------ skeleton instance
  class Skeleton {
    constructor(data) {
      this.data = data;
      this.local = setupPose(data);
      this.world = new Float32Array(data.bones.length * 6);   // a b c d x y
      this.springs = [];           // [{bone, k, damp, gain, angle, vel}]
      this._prevBody = null;
      this.updateWorld();
    }
    addSpring(boneName, { stiffness = 60, damping = 7, gain = 1.2 } = {}) {
      const bone = this.data.boneIndex[boneName]; if (bone === undefined) return;
      this.springs.push({ bone, k: stiffness, damp: damping, gain, angle: 0, vel: 0 });
    }
    updateWorld() {
      const L = this.local, W = this.world;
      this.data.bones.forEach((b, i) => {
        const o = i * 5, r = L[o + 2] * DEG, sx = L[o + 3], sy = L[o + 4];
        const la = Math.cos(r) * sx, lb = -Math.sin(r) * sy, lc = Math.sin(r) * sx, ld = Math.cos(r) * sy;
        const w = i * 6;
        if (b.parent < 0) { W.set([la, lb, lc, ld, L[o], L[o + 1]], w); return; }
        const p = b.parent * 6, pa = W[p], pb = W[p + 1], pc = W[p + 2], pd = W[p + 3];
        W[w] = pa * la + pb * lc; W[w + 1] = pa * lb + pb * ld; W[w + 2] = pc * la + pd * lc; W[w + 3] = pc * lb + pd * ld;
        W[w + 4] = pa * L[o] + pb * L[o + 1] + W[p + 4]; W[w + 5] = pc * L[o] + pd * L[o + 1] + W[p + 5];
      });
    }
    // springs react to how fast their parent bone moves (hair lags behind, then swings back)
    stepSprings(dt) {
      if (!this.springs.length || dt <= 0) return;
      dt = Math.min(dt, 1 / 30);
      this.springs.forEach(s => {
        const p = this.data.bones[s.bone].parent * 6, W = this.world;
        const px = W[p + 4], py = W[p + 5], ang = Math.atan2(W[p + 2], W[p]);
        const prev = s.prev || { px, py, ang };
        const vx = (px - prev.px) / dt, dAng = ((ang - prev.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        s.prev = { px, py, ang };
        const force = -s.k * s.angle - s.damp * s.vel + (vx * 0.9 + dAng / dt * 60) * s.gain;
        s.vel += force * dt; s.angle += s.vel * dt;
        s.angle = Math.max(-35, Math.min(35, s.angle));
        this.local[s.bone * 5 + 2] += s.angle;
      });
      this.updateWorld();
    }
    // world point of a bone-local point
    point(boneName, lx = 0, ly = 0) {
      const i = this.data.boneIndex[boneName]; if (i === undefined) return { x: 0, y: 0 };
      const W = this.world, w = i * 6;
      return { x: W[w] * lx + W[w + 1] * ly + W[w + 4], y: W[w + 2] * lx + W[w + 3] * ly + W[w + 5] };
    }
    boneTip(boneName, f = 1) { const b = this.data.bones[this.data.boneIndex[boneName]]; return this.point(boneName, (b?.length || 0) * f, 0); }
    // draw with the skeleton origin (0,0 = floor under the pelvis) at screen (x, y); scale in px per skeleton unit
    draw(ctx, x, y, scale, flip = false, alpha = 1, only = null) {
      const W = this.world, fx = flip ? -scale : scale;
      const B = ctx.getTransform();             // keep whatever the caller set up (DPR, camera shake, mirroring)
      const Ba = B.a, Bb = B.b, Bc = B.c, Bd = B.d, Be = B.e, Bf = B.f;
      // on-screen pixels per atlas pixel → pick a pre-shrunk copy of the atlas (much cheaper to draw)
      const eff = Math.abs(scale) * Math.hypot(Ba, Bb);
      ctx.save();
      ctx.globalAlpha *= alpha;
      for (const s of this.data.slots) {
        if (!s.attachment || (only && !only.includes(s.name))) continue;
        const att = this.data.attachments[s.name + '/' + s.attachment]; if (!att || !att.region.img) continue;
        const w = s.bone * 6;
        // screen = T(x,y) * S(fx,-scale) * Bone * T(att) * R(att) * S(att) * flipY
        const a = W[w], b = W[w + 1], c = W[w + 2], d = W[w + 3];
        const r = att.rotation * DEG, cr = Math.cos(r), sr = Math.sin(r);
        const ma = (a * cr + b * sr) * att.scaleX, mb = (-a * sr + b * cr) * att.scaleY;
        const mc = (c * cr + d * sr) * att.scaleX, md = (-c * sr + d * cr) * att.scaleY;
        const tx = a * att.x + b * att.y + W[w + 4], ty = c * att.x + d * att.y + W[w + 5];
        // combine with screen scale and the image's y-down space (flip Y)
        const la = fx * ma, lb = -scale * mc, lc = -fx * mb, ld = scale * md, le = x + fx * tx, lf = y - scale * ty;
        ctx.setTransform(Ba * la + Bc * lb, Bb * la + Bd * lb, Ba * lc + Bc * ld, Bb * lc + Bd * ld, Ba * le + Bc * lf + Be, Bb * le + Bd * lf + Bf);
        const R = att.region, iw = att.width, ih = att.height;
        const m = mip(R.img, eff), k = m.k;
        if (R.rotate === 90) { ctx.rotate(-Math.PI / 2); ctx.drawImage(m.img, R.x * k, R.y * k, R.h * k, R.w * k, -ih / 2, -iw / 2, ih, iw); }
        else ctx.drawImage(m.img, R.x * k, R.y * k, R.w * k, R.h * k, -iw / 2, -ih / 2, iw, ih);
      }
      ctx.restore();
    }
  }

  // ------------------------------------------------------------------ player (animation state)
  class Player {
    constructor(skeleton) {
      this.sk = skeleton; this.data = skeleton.data;
      this.cur = null; this.time = 0; this.loop = false; this.speed = 1;
      this.from = null; this.mix = 0; this.mixDur = 0;
      this.onEvent = null; this.onComplete = null;
      this._a = setupPose(this.data); this._b = setupPose(this.data);
      this.hold = null;                     // {pose} when frozen on a static pose
    }
    // until: stop and hold at this time (plays one segment of a move, e.g. chamber → strike)
    play(name, { loop = false, mix = 0.15, speed = 1, from = 0, until = null } = {}) {
      const anim = this.data.animations[name]; if (!anim) return false;
      if (this.cur || this.hold) this.from = this.snapshot(); else this.from = null;
      this.mix = 0; this.mixDur = this.from ? mix : 0;
      this.cur = anim; this.curName = name; this.time = from; this.loop = loop; this.speed = speed; this.hold = null; this._done = false;
      this.until = until;
      return true;
    }
    // freeze on the pose an animation has at `time` (used for the 5 lesson phases), blending there smoothly
    pose(name, time, mix = 0.25) {
      const anim = this.data.animations[name]; if (!anim) return false;
      const target = applyAnimation(this.data, anim, time, setupPose(this.data));
      this.from = (this.cur || this.hold) ? this.snapshot() : null;
      this.mix = 0; this.mixDur = this.from ? mix : 0;
      this.hold = target; this.cur = null; this.curName = name;
      return true;
    }
    snapshot() { return Float32Array.from(this.sk.local); }
    update(dt) {
      const sk = this.sk;
      if (this.hold) sk.local.set(this.hold);
      else if (this.cur) {
        const prev = this.time;
        this.time += dt * this.speed;
        const D = this.cur.duration || 0.0001;
        // events between prev and now
        for (const e of this.cur.events) if (e.time > prev && e.time <= this.time) this.onEvent && this.onEvent(e, this.curName);
        if (this.until !== null && this.until !== undefined && this.time >= this.until) {
          this.time = this.until;
          applyAnimation(this.data, this.cur, this.time, sk.local);
          this.hold = Float32Array.from(sk.local); this.cur = null; this.until = null;
          this.onComplete && this.onComplete(this.curName);
        } else if (this.time >= D) {
          if (this.loop) { this.time %= D; for (const e of this.cur.events) if (e.time <= this.time) this.onEvent && this.onEvent(e, this.curName); }
          else if (!this._done) { this._done = true; this.time = D; this.onComplete && this.onComplete(this.curName); }
        }
        if (this.cur) applyAnimation(this.data, this.cur, this.time, sk.local);
      }
      if (this.from && this.mix < this.mixDur) {
        this.mix += dt;
        const t = Math.min(1, this.mix / this.mixDur), e = t * t * (3 - 2 * t);
        blend(this.from, Float32Array.from(sk.local), e, sk.local);
        if (t >= 1) this.from = null;
      }
      sk.updateWorld();
      sk.stepSprings(dt);
    }
    phaseTimes(name) { return (this.data.animations[name]?.events || []).filter(e => e.name === 'phase').sort((a, b) => a.int - b.int).map(e => e.time); }
  }

  // pose a skeleton instantly at `time` of an animation (for measuring, onion skins, baking)
  function poseAt(sk, name, time) {
    const anim = sk.data.animations[name]; if (!anim) return false;
    applyAnimation(sk.data, anim, time, sk.local); sk.updateWorld(); return true;
  }

  // ------------------------------------------------------------------ loading
  const cache = {};
  function loadImage(src) {
    return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  }
  async function load(base) {            // base: 'assets/anim/boy/boy' → .json + .atlas + page images
    if (cache[base]) return cache[base];
    cache[base] = (async () => {
      try {
        const [json, atlasText] = await Promise.all([fetch(base + '.json').then(r => r.ok ? r.json() : null), fetch(base + '.atlas').then(r => r.ok ? r.text() : null)]);
        if (!json || !atlasText) return null;
        const pages = parseAtlas(atlasText);
        const dir = base.slice(0, base.lastIndexOf('/') + 1);
        const imgs = {};
        await Promise.all(pages.map(async p => { imgs[p.name] = await loadImage(dir + p.name); }));
        if (pages.some(p => !imgs[p.name])) return null;
        return new SkeletonData(json, pages, imgs);
      } catch (e) { console.warn('TKDAnim: could not load', base, e); return null; }
    })();
    return cache[base];
  }
  const CHAR = { boy: 'assets/anim/boy/boy', girl: 'assets/anim/girl/girl' };
  async function character(ch) {
    const data = await load(api.base + CHAR[ch === 'girl' ? 'girl' : 'boy']);
    if (!data) return null;
    const sk = new Skeleton(data);
    if (data.boneIndex.ponytail !== undefined) sk.addSpring('ponytail', { stiffness: 70, damping: 8, gain: 0.05 });
    return { data, skeleton: sk, player: new Player(sk) };
  }
  // which kicks have a skeletal animation (others keep their picture frames)
  const KICK_ANIM = { apchagi: 'apchagi', narochagi: 'naeryeo', 'ap-ollyeo-chagi': 'ap-ollyeo', 'mireo-chagi': 'mireo' };
  // the animations below exist only with frames? — checked at runtime
  function kickAnim(data, skillId) { const n = KICK_ANIM[skillId]; return n && data?.animations[n] ? n : null; }
  // The skeleton is rebuilt from a single sliced photo, so every joint is
  // exactly as wide as that one photo's limb was — on the front and hammer
  // kicks this reads thinner ("lean") than the character's real, chubbier
  // body everywhere else (menus, celebrations, the puzzle game's pictures).
  // Until the rig is re-sliced from art that matches, picture frames (the
  // same correct photos used everywhere else) are the default; the
  // skeleton is opt-in only, for whoever wants to test it.
  const enabled = () => { try { return localStorage.getItem('taekwondoJourneyAnim') === 'skeleton'; } catch (e) { return false; } };

  const api = { base: '', poseAt, parseAtlas, SkeletonData, Skeleton, Player, load, character, kickAnim, KICK_ANIM, enabled, sample, bezierY };
  return api;
})();
if (typeof window !== 'undefined') window.TKDAnim = TKDAnim;
