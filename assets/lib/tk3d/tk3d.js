// ============================================================================
//  TKD3D — the 3D twin of TKDAnim.
//  character(ch) returns { data, skeleton, player } with the SAME methods the
//  2D runtime offers (play / pose / update / phaseTimes / draw / boneTip …), so
//  RigView, RigFighter, RigOpponent and RigSprite run on it unchanged.
//  Each character is a real 3D model on a 19-bone Mixamo skeleton. It is
//  rendered by one shared WebGL renderer and painted into the game's 2D canvas,
//  so every screen keeps its own layout, shadows, effects and mirroring.
// ============================================================================
import * as THREE from '../three.module.min.js';
import { buildCharacter, BOY, GIRL, COACH } from './character.js';
import { ANIMS, STANCE } from './kicks.js';

const D2R = Math.PI / 180;
const EASE = {
  ease: u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  snap: u => 1 - Math.pow(1 - u, 4),
  drop: u => Math.pow(u, 2.4),
  lin: u => u,
};

// ------------------------------------------------------------------ renderer
const RT = 1024;                          // one square drawing buffer, viewport-cropped per draw
let renderer = null, camera = null, failed = false;
// v42 — adaptive quality: the measured cost of a render steers the resolution, so
// cheap phones drop to a lighter image instead of dropping frames.
const Q = { scale: 1, ema: 0, MIN: 0.45, spent: 0, budget: 12, skipped: 0, culled: 0, armed: false };
// v45 — a per-frame budget: when this frame already spent its share on 3D renders,
// a character that HAS a recent picture reuses it for one more frame.
function armFrame() { if (Q.armed) return; Q.armed = true; requestAnimationFrame(() => { Q.spent = 0; Q.armed = false; }); }
function noteCost(ms) {
  Q.spent += ms; armFrame();
  Q.renders = (Q.renders || 0) + 1;
  Q.ema = Q.ema ? Q.ema * 0.85 + ms * 0.15 : ms;
  if (Q.ema > 9 && Q.scale > Q.MIN) Q.scale = Math.max(Q.MIN, Q.scale * 0.9);
  else if (Q.ema < 3.5 && Q.scale < 1) Q.scale = Math.min(1, Q.scale * 1.05);
}
export const quality = Q;
function getRenderer() {
  if (renderer || failed) return renderer;
  try {
    const canvas = document.createElement('canvas');
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: false, premultipliedAlpha: true });
    renderer.setPixelRatio(1); renderer.setSize(RT, RT, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    renderer.setScissorTest(true);
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 30);
    camera.position.set(-10, 0, 0); camera.lookAt(0, 0, 0);    // looking along +X: screen-right = +Z (the way the fighter faces)
  } catch (e) { console.warn('TKD3D: WebGL unavailable', e); renderer = null; failed = true; }
  return renderer;
}
export function supported() { return !!getRenderer(); }
// v51: how many meshes / textures live on the GPU (to check nothing piles up)
export function gpuInfo() { return renderer ? { ...renderer.info.memory } : null; }

// ------------------------------------------------------------------ data
const DESC = { boy: BOY, girl: GIRL, coach: COACH };
const dataCache = {};
class Data3D {
  constructor(ch) {
    this.ch = ch; this.desc = DESC[ch];
    const probe = buildCharacter(this.desc);
    this.boneNames = Object.keys(probe.bones);
    this.boneIndex = Object.fromEntries(this.boneNames.map((n, i) => [n, i]));
    this.animations = {};
    for (const [name, a] of Object.entries(ANIMS)) {
      const keys = a.keys.map(k => ({ t: k.t, ease: k.ease || 'ease',
        q: this.boneNames.map(n => {
          const v = k.pose[n] || STANCE[n] || [0, 0, 0];
          return new THREE.Quaternion().setFromEuler(new THREE.Euler(v[0] * D2R, v[1] * D2R, v[2] * D2R, probe.bones[n].rotation.order));
        }) }));
      const events = (a.events || []).map(e => ({ time: e.time, name: e.name, int: e.int ?? 0, string: '' }));
      const duration = Math.max(keys[keys.length - 1].t, ...events.map(e => e.time));
      const imp = events.find(e => e.name === 'impact'), ph = events.filter(e => e.name === 'phase').sort((x, y) => x.int - y.int).map(e => e.time);
      this.animations[name] = { name, keys, events, duration, loop: !!a.loop, anchor: a.anchor || 'left', impact: imp ? imp.time : null, phases: ph };
    }
    // measure the stance once: floor, height, where the feet stand → the 2D "rig units"
    const sk = new Skeleton3D(this, probe);
    applyAnimation(this, this.animations.idle, 0, sk.local); sk.anchor = 'none'; sk.updateWorld();
    sk.root.updateMatrixWorld(true);
    this.anchorTarget = sk.bones.LeftToeBase.getWorldPosition(new THREE.Vector3());
    // v54: the girl's high ponytail and bow stand above her head — they don't count for her
    // height, so both children keep the same size (and every "rig unit") as before
    const pt = sk.bones.Ponytail, ptParent = pt?.parent; if (pt) ptParent.remove(pt);
    const box = new THREE.Box3().setFromObject(sk.root);
    if (pt) ptParent.add(pt);
    const la = sk.bones.LeftFoot.getWorldPosition(new THREE.Vector3()), ra = sk.bones.RightFoot.getWorldPosition(new THREE.Vector3());
    this.floor = box.min.y; this.z0 = (la.z + ra.z) / 2;
    this.K = 1000 / (box.max.y - box.min.y);                     // rig units per metre: the stance is 1000 tall
    // v50: the standing foot's direction in the ready stance — "pivot" angles are measured from it
    const lt = sk.bones.LeftToeBase.getWorldPosition(new THREE.Vector3()).sub(la);
    this.stanceFootYaw = Math.atan2(lt.x, lt.z) / D2R;
    this.extra = { height: 1000, ankleB: [0, 0], ankleF: [0, 0] };
  }
}

// ------------------------------------------------------------------ pose maths
const _qa = new THREE.Quaternion();
function applyAnimation(data, anim, time, out) {
  const keys = anim.keys;
  let i = 0; while (i < keys.length - 2 && time > keys[i + 1].t) i++;
  const a = keys[i], b = keys[i + 1] || a, span = b.t - a.t;
  const u = span > 0 ? Math.min(1, Math.max(0, (time - a.t) / span)) : 1;
  const w = EASE[b.ease](u);
  for (let n = 0; n < a.q.length; n++) {
    _qa.copy(a.q[n]).slerp(b.q[n], w);
    out[n * 4] = _qa.x; out[n * 4 + 1] = _qa.y; out[n * 4 + 2] = _qa.z; out[n * 4 + 3] = _qa.w;
  }
  return out;
}
const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
function blend(a, b, t, out) {
  for (let n = 0; n < a.length; n += 4) {
    _q1.set(a[n], a[n + 1], a[n + 2], a[n + 3]); _q2.set(b[n], b[n + 1], b[n + 2], b[n + 3]); _q1.slerp(_q2, t);
    out[n] = _q1.x; out[n + 1] = _q1.y; out[n + 2] = _q1.z; out[n + 3] = _q1.w;
  }
  return out;
}

// ------------------------------------------------------------------ skeleton (one 3D model)
const MAP2D = { footF: 'RightFoot', footB: 'LeftFoot', shinF: 'RightLeg', shinB: 'LeftLeg', thighF: 'RightUpLeg', thighB: 'LeftUpLeg', head: 'Head', body: 'Spine1', hip: 'Hips', root: 'Hips' };
const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _qt = new THREE.Quaternion();
export const OUTLINE = { on: true, color: '#3a3142' };   // v54b: a finer, softer ink line (see draw)
export class Skeleton3D {
  constructor(data, prebuilt = null) {
    this.data = data; this.is3D = true;
    const { root, bones } = prebuilt || buildCharacter(data.desc);
    this.root = root; this.bones = bones; this.list = data.boneNames.map(n => bones[n]);
    this.local = new Float32Array(this.list.length * 4);
    this.list.forEach((b, i) => { this.local[i * 4 + 3] = 1; });
    this.anchor = 'left'; this.viewYaw = 0; this.viewPitch = 0; this.mirror = false;   // v50: viewPitch — look from above (+) / below (−)
    this.spring = { a: 0, v: 0, prev: null };                 // kept for older callers: the ponytail spring
    // v45: springs — ponytail behind the head and the belt tails at the knot
    this.springs = [];
    if (bones.Ponytail) this.springs.push(Object.assign(this.spring, { bone: bones.Ponytail, ref: bones.Head, gz: 40, gy: 25, k: 80, c: 7, lim: 40 }));
    if (bones.BeltTail) this.springs.push({ a: 0, v: 0, prev: null, bone: bones.BeltTail, ref: bones.BeltTail, gz: 55, gy: 30, k: 110, c: 6, lim: 55, b: 0, bv: 0 });
    // v45: a living face — blinks, shouts "kihap!" at impact, winces when hit, beams on a win
    this.faceRig = this.root.userData.face || null;
    this.face = { blink: 0, next: 1.5 + Math.random() * 2.5, mouth: 'smile', key: '' };
    if (this.faceRig) for (const l of this.faceRig.lashes) l.userData.y0 = l.position.y;
    this.scene = new THREE.Scene();
    this.yaw = new THREE.Group(); this.yaw.rotation.order = 'ZYX'; this.yaw.add(root); this.scene.add(this.yaw);   // turn (Y) first, then tilt the view (Z)
    // v54b: softer light (the reference look) — the skin keeps its warm colour instead of washing out
    this.scene.add(new THREE.HemisphereLight('#fffaf4', '#c3c8d4', 1.0));
    const key = new THREE.DirectionalLight('#fff6ec', 1.7); key.position.set(-3, 4, 2.5); this.scene.add(key);
    const rim = new THREE.DirectionalLight('#e2ecff', .9); rim.position.set(2, 2.5, -3); this.scene.add(rim);
    const fill = new THREE.DirectionalLight('#fff4e6', .4); fill.position.set(-2, 1, -2); this.scene.add(fill);
    this._cos = '';
  }
  updateWorld() {
    const L = this.local;
    this.list.forEach((b, i) => b.quaternion.set(L[i * 4], L[i * 4 + 1], L[i * 4 + 2], L[i * 4 + 3]));
    const hips = this.bones.Hips; hips.position.copy(hips.userData.rest);
    this.root.scale.x = this.mirror ? -1 : 1;                   // v45: left-leg kicker = the mirror image
    this.yaw.rotation.y = 0;
    this.root.updateMatrixWorld(true);
    if (this.anchor === 'left' && this.data.anchorTarget) {     // keep the support toes planted
      this.bones.LeftToeBase.getWorldPosition(_v);
      _w.copy(this.data.anchorTarget); if (this.mirror) _w.x = -_w.x;
      _w.sub(_v); if (this.mirror) _w.x = -_w.x;                 // the root is mirrored in X (depth)
      hips.position.add(_w);
      this.root.updateMatrixWorld(true);
    }
    this.groundToes();
  }
  // v50 — a foot standing on the mat keeps its toes flat on it: when the heel lifts (a pivot
  // on the ball of the foot, a step) the toes bend at the ball instead of digging into the floor
  groundToes() {
    for (const s of ['Left', 'Right']) {
      const tb = this.bones[s + 'ToeBase']; if (!tb) continue;
      tb.getWorldPosition(_v);
      if (_v.y - this.data.floor > 0.05) continue;               // that foot is in the air
      _w.set(0, 0, 1).applyQuaternion(tb.getWorldQuaternion(_qt));
      const pitch = Math.asin(Math.max(-1, Math.min(1, _w.y)));   // < 0: the toes point into the floor
      if (pitch < -0.01) { tb.rotateX(pitch); tb.updateMatrixWorld(true); }
    }
  }
  // v50 — the character measures itself: the angles a lesson talks about, in degrees.
  //   knee / supKnee: kicking / standing knee (180 = straight) · legs: angle between the thighs
  //   thigh: kicking thigh above horizontal · pivot: standing foot turned out from the stance
  //   hips: where the hips face (0 = the target) · lean: torso back (+) / forward (−)
  //   tilt: torso away from vertical · toes: kicking toes bent at the ball · heelUp: standing heel lift
  //   foot: the kicking foot's height on the body (knee … head) — measured at the striking
  //   part: part = 'ball' (Ap Chagi) or 'heel' (axe / side kick)
  measure(part = 'heel') {
    this.root.updateMatrixWorld(true);
    const P = n => this.bones[n].getWorldPosition(new THREE.Vector3());
    const F = n => new THREE.Vector3(0, 0, 1).applyQuaternion(this.bones[n].getWorldQuaternion(new THREE.Quaternion()));
    const deg = r => Math.round(r / D2R);
    const m = this.mirror ? -1 : 1, yaw = v => Math.atan2(v.x * m, v.z) / D2R;
    const hip = P('RightUpLeg'), knee = P('RightLeg'), ank = P('RightFoot');
    const lhip = P('LeftUpLeg'), lknee = P('LeftLeg'), lank = P('LeftFoot'), ltoe = P('LeftToeBase');
    const ang = (a, b, c) => deg(a.clone().sub(b).angleTo(c.clone().sub(b)));
    const thigh = knee.clone().sub(hip), torso = P('Neck').sub(P('Hips'));
    const fl = this.data.floor, y = v => v.y - fl;
    const sp = P('Spine'), sp1 = P('Spine1'), head = P('Head');
    const marks = [['knee', y(lknee)], ['belly', y(sp)], ['chest', y(sp1) + .1], ['shoulder', y(sp1) + .125], ['face', y(head) + .14], ['head', y(head) + .3]];
    const hit = part === 'ball' ? P('RightToeBase') : ank;
    let foot = 'floor'; for (const [k, h] of marks) if (y(hit) >= h - .05) foot = k;
    const sf = ltoe.clone().sub(lank); sf.y = 0;
    let pivot = Math.round(yaw(sf) - this.data.stanceFootYaw); if (pivot < -90) pivot += 360;
    return {
      knee: ang(hip, knee, ank), supKnee: ang(lhip, lknee, lank),
      legs: deg(thigh.angleTo(lknee.clone().sub(lhip))), thigh: deg(Math.asin(thigh.y / thigh.length())),
      pivot, hips: Math.round(yaw(F('Hips'))), lean: deg(Math.atan2(-torso.z, torso.y)), tilt: deg(torso.angleTo(new THREE.Vector3(0, 1, 0))),
      toes: deg(F('RightFoot').angleTo(F('RightToeBase'))), heelUp: Math.round((y(lank) - y(ltoe)) * 100) / 100,
      foot, footH: Math.round(y(hit) * this.data.K)
    };
  }
  stepSprings(dt) {                                             // ponytail + belt tails swing behind the motion
    if (dt <= 0 || !this.springs.length) return;
    dt = Math.min(dt, 1 / 30);
    for (const s of this.springs) {
      const p = s.ref.getWorldPosition(_v);
      if (s.prev) {
        const vz = (p.z - s.prev.z) / dt, vy = (p.y - s.prev.y) / dt;
        s.v += (vz * s.gz - vy * s.gy) * dt * 10;
        if (s.b !== undefined) { const vx = (p.x - s.prev.x) / dt; s.bv += vx * 30 * dt * 10; }
      } else s.prev = new THREE.Vector3();
      s.prev.copy(p);
      s.v += (-s.k * s.a - s.c * s.v) * dt; s.a += s.v * dt; s.a = Math.max(-s.lim, Math.min(s.lim, s.a));
      s.bone.rotateX(s.a * D2R);
      if (s.b !== undefined) { s.bv += (-s.k * s.b - s.c * s.bv) * dt; s.b += s.bv * dt; s.b = Math.max(-30, Math.min(30, s.b)); s.bone.rotateZ(s.b * D2R); }
    }
    this.root.updateMatrixWorld(true);
  }
  // v45 — the face: mouth chosen by the player (kihap / ouch / big smile), eyes blink on their own
  stepFace(dt, mouth) {
    const F = this.faceRig, f = this.face; if (!F) return;
    if (dt > 0) {
      f.next -= dt;
      if (f.blink > 0) { f.blink -= dt; if (f.blink <= 0) f.blink = 0; }
      else if (f.next <= 0) { f.blink = .13; f.next = 2.4 + Math.random() * 2.4; if (Math.random() < .18) f.next = .28; }   // sometimes a double blink
    }
    const shut = mouth === 'ouch' ? .25 : (f.blink > 0 ? Math.max(.08, Math.abs(f.blink - .065) / .065) : 1);
    const sy = mouth === 'kihap' ? 1.12 : shut;
    const ep = -(this.eyePitch || 0) * 0.5 * D2R;                 // v46: the eyes look up / down too
    for (const e of F.eyes) { e.scale.y = sy; e.rotation.x = ep; }
    for (const l of F.lashes) { l.scale.y = Math.max(.3, sy); l.position.y = l.userData.y0 - (1 - Math.min(1, sy)) * .035; }
    // v54: the brows had their signs swapped — "kihap!" looked worried and "ouch" looked angry.
    // Now: kihap = fierce (inner ends down), ouch = pained (inner ends up), cheer = happy (raised)
    const frown = mouth === 'kihap' ? .3 : mouth === 'ouch' ? -.36 : mouth === 'cheer' ? -.14 : 0;
    for (const b of F.brows) { b.rotation.z = frown * b.userData.sx; b.position.y = (b.userData.y0 ??= b.position.y) + (mouth === 'ouch' || mouth === 'cheer' ? .012 : mouth === 'kihap' ? -.008 : 0); }
    F.smile.visible = mouth === 'smile';
    F.open.visible = mouth === 'kihap' || mouth === 'cheer';
    F.open.scale.y = mouth === 'cheer' ? .8 : 1.15; F.open.scale.x = mouth === 'cheer' ? 1.45 : 1;
    F.ouch.visible = mouth === 'ouch';
    f.mouth = mouth; f.key = mouth + (sy < .99 ? Math.round(sy * 4) : '') + '|' + Math.round((this.eyePitch || 0) / 3);
  }
  // 2D rig units: x along the facing direction from the feet, y up from the floor
  // v46: follows the view angle (¾ view in the games), so game logic matches the picture
  toRig(v) {
    const a = this.viewYaw; if (!a) return { x: (v.z - this.data.z0) * this.data.K, y: (v.y - this.data.floor) * this.data.K };
    return { x: (-v.x * Math.sin(a) + v.z * Math.cos(a) - this.data.z0) * this.data.K, y: (v.y - this.data.floor) * this.data.K };
  }
  point(name, lx = 0, ly = 0) {
    const b = this.bones[MAP2D[name] || name]; if (!b) return { x: 0, y: 0 };
    return this.toRig(b.getWorldPosition(_v));
  }
  boneTip(name, f = 1) {
    const n = MAP2D[name] || name;
    if (n === 'RightFoot' || n === 'LeftFoot') {                // f < .4 → heel (axe / side kick), else the ball of the foot
      const b = f < .4 ? this.bones[n] : this.bones[n.replace('Foot', 'ToeBase')];
      return this.toRig(b.getWorldPosition(_v));
    }
    return this.point(n);
  }
  // screen position of a joint as the viewer sees it (follows the 360° view), in rig units
  project(name) {
    const b = this.bones[MAP2D[name] || name]; if (!b) return { x: 0, y: 0 };
    b.getWorldPosition(_v);
    return this._toScreen(_v);
  }
  // screen position (rig units) of a world point, through the 360° turn and the v50 up/down tilt
  _toScreen(v) {
    const c = Math.cos(this.viewYaw), s = Math.sin(this.viewYaw);
    const depth = v.x * c + v.z * s, right = -v.x * s + v.z * c;
    const p = this.viewPitch || 0, up = p ? depth * Math.sin(p) + v.y * Math.cos(p) : v.y;
    return { x: (right - this.data.z0) * this.data.K, y: (up - this.data.floor) * this.data.K };
  }
  toScreen(v) { return this._toScreen(v); }
  // v51 — a joint's place in the world (metres, before the view turns) — to follow it through
  // time: the foot path and the stroboscope project these with the current view
  world(name, lx = 0, ly = 0, lz = 0) {
    const b = this.bones[MAP2D[name] || name]; if (!b) return null;
    _v.set(lx, ly, lz); b.localToWorld(_v);
    return { x: _v.x, y: _v.y, z: _v.z };
  }
  // v51 — free the GPU copies of this character (each lesson card builds new ones)
  dispose() {
    this.root.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach(x => !x.userData?.shared && x.dispose && x.dispose());
    });
    this._cache = null; this.disposed = true;
  }
  // like project(), for a point given in the bone's own frame (metres) — e.g. the middle of the head
  projectAt(name, lx = 0, ly = 0, lz = 0) {
    const b = this.bones[name]; if (!b) return { x: 0, y: 0 };
    _v.set(lx, ly, lz); b.localToWorld(_v);
    return this._toScreen(_v);
  }
  // the real 3D angle at joint b between a and c, in degrees (same from every side)
  angle(a, b, c) {
    const A = this.bones[a].getWorldPosition(new THREE.Vector3()), B = this.bones[b].getWorldPosition(new THREE.Vector3()), C = this.bones[c].getWorldPosition(new THREE.Vector3());
    return Math.round(A.sub(B).angleTo(C.sub(B)) / D2R);
  }
  applyCosmetics() {
    if (this.data.ch === 'coach' || this.noCosmetics) return;  // the shop dresses the player — not Coach Yang, not the partner
    const c = (typeof window !== 'undefined' && window.Shop?.cosmetics) ? window.Shop.cosmetics() : null;
    const key = c ? `${c.belt}|${c.headband}` : '';
    if (key === this._cos) return; this._cos = key;
    const mat = this.root.userData.mat, hb = this.root.userData.headband;
    mat.belt.color.set(c?.belt || this.data.desc.belt);
    if (hb) { hb.visible = !!c?.headband; if (c?.headband) hb.material.color.set(c.headband); }
  }
  // paint the model into a 2D canvas: (x, y) = the feet on the floor, scale = px per rig unit
  draw(ctx, x, y, scale, flip = false, alpha = 1) {
    const r = getRenderer(); if (!r || alpha <= 0) return;
    this.applyCosmetics();
    const d = this.data, K = d.K;
    const zMin = d.z0 - .95, zMax = d.z0 + 1.4, yMin = d.floor - .04, yMax = d.floor + 1.95;
    const left = x + (zMin - d.z0) * K * scale, top = y - (yMax - d.floor) * K * scale;
    const w = (zMax - zMin) * K * scale, h = (yMax - yMin) * K * scale;
    const T = ctx.getTransform(), eff = Math.hypot(T.a, T.b) || 1;
    let pw = Math.max(2, Math.round(w * eff * Q.scale)), ph = Math.max(2, Math.round(h * eff * Q.scale));
    const cap = Math.min(1, RT / Math.max(pw, ph)); pw = Math.round(pw * cap); ph = Math.round(ph * cap);
    // v42: only re-render when the picture would really change (pose, view, size or
    // clothes); otherwise reuse the last image. A character standing still costs
    // almost nothing, and the slow idle breathing re-renders a few times a second.
    // v45: off-screen characters cost nothing
    const cv = ctx.canvas;
    if (cv && cv.width) {
      const xs = [T.a * left + T.c * top + T.e, T.a * (left + w) + T.c * top + T.e, T.a * left + T.c * (top + h) + T.e, T.a * (left + w) + T.c * (top + h) + T.e];
      const ys = [T.b * left + T.d * top + T.f, T.b * (left + w) + T.d * top + T.f, T.b * left + T.d * (top + h) + T.f, T.b * (left + w) + T.d * (top + h) + T.f];
      const fx = flip ? 2 * (T.a * x + T.e) : 0;
      const mn = Math.min(...xs), mx = Math.max(...xs), lo = flip ? Math.min(mn, fx - mx) : mn, hi = flip ? Math.max(mx, fx - mn) : mx;
      if (hi < -4 || lo > cv.width + 4 || Math.max(...ys) < -4 || Math.min(...ys) > cv.height + 4) { Q.culled++; return; }
    }
    const c = this._cache || (this._cache = { cv: document.createElement('canvas'), tmp: document.createElement('canvas'), pose: new Float32Array(this.local.length), yaw: NaN, pw: 0, ph: 0, cos: null, sp: new Float32Array(4), face: '', mir: false });
    const sp = this.springs;
    let same = c.pw === pw && c.ph === ph && Math.abs(c.yaw - this.viewYaw) < 0.002 && Math.abs((c.pitch || 0) - this.viewPitch) < 0.002 && c.cos === this._cos && c.face === this.face.key && c.mir === this.mirror;
    if (same) for (let i = 0; i < sp.length; i++) if (Math.abs(c.sp[i * 2] - sp[i].a) > 0.4 || Math.abs(c.sp[i * 2 + 1] - (sp[i].b || 0)) > 0.4) { same = false; break; }
    if (same) for (let i = 0; i < this.local.length; i++) if (Math.abs(this.local[i] - c.pose[i]) > 0.0025) { same = false; break; }
    // over this frame's budget and holding a picture of the same size → reuse it once
    if (!same && c.pw === pw && c.ph === ph && Q.spent > Q.budget && !c.stale) { c.stale = true; Q.skipped++; same = true; }
    else if (!same) c.stale = false;
    if (!same) {
      const t0 = performance.now();
      camera.left = zMin; camera.right = zMax; camera.top = yMax; camera.bottom = yMin;
      camera.position.set(-10, 0, 0); camera.updateProjectionMatrix();
      this.yaw.rotation.y = this.viewYaw; this.yaw.rotation.z = this.viewPitch; this.root.scale.x = this.mirror ? -1 : 1; this.yaw.updateMatrixWorld(true);
      r.setViewport(0, 0, pw, ph); r.setScissor(0, 0, pw, ph);
      r.clear(); r.render(this.scene, camera);
      this.yaw.rotation.y = 0; this.yaw.rotation.z = 0; this.yaw.updateMatrixWorld(true);
      if (c.cv.width !== pw || c.cv.height !== ph) { c.cv.width = pw; c.cv.height = ph; c.tmp.width = pw; c.tmp.height = ph; }
      // copy straight away (the WebGL buffer is not preserved), then add the cartoon ink line:
      // the silhouette is stamped 8 times around itself in a dark ink, the model goes on top
      const t = c.tmp.getContext('2d'); t.clearRect(0, 0, pw, ph);
      t.drawImage(r.domElement, 0, RT - ph, pw, ph, 0, 0, pw, ph);
      const g = c.cv.getContext('2d'); g.clearRect(0, 0, pw, ph);
      const o = OUTLINE.on ? Math.max(1, Math.min(2, ph / 360)) : 0;
      if (o) {
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.drawImage(c.tmp, Math.cos(a) * o, Math.sin(a) * o); }
        g.globalCompositeOperation = 'source-in'; g.fillStyle = OUTLINE.color; g.fillRect(0, 0, pw, ph);
        g.globalCompositeOperation = 'source-over';
      }
      g.drawImage(c.tmp, 0, 0);
      c.pose.set(this.local); c.yaw = this.viewYaw; c.pitch = this.viewPitch; c.pw = pw; c.ph = ph; c.cos = this._cos; c.face = this.face.key; c.mir = this.mirror;
      for (let i = 0; i < sp.length; i++) { c.sp[i * 2] = sp[i].a; c.sp[i * 2 + 1] = sp[i].b || 0; }
      noteCost(performance.now() - t0);
    }
    ctx.save();
    ctx.globalAlpha *= alpha;
    if (flip) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); }
    ctx.drawImage(c.cv, 0, 0, pw, ph, left, top, w, h);
    ctx.restore();
  }
}

const AIM_AXIS = { apchagi: 'x', 'ap-ollyeo': 'x', mireo: 'x', yeop: 'z' };
// lift / lower the kicking thigh by deg; a high kick also leans the upper body back (as real kickers do)
function aimBones(sk, ax, deg) {
  const L = sk.local, rot = (bone, axis, d) => {
    const n = sk.data.boneIndex[bone]; if (n === undefined || !d) return; const i = n * 4;
    _q2.setFromAxisAngle(axis, d * D2R);
    _q1.set(L[i], L[i + 1], L[i + 2], L[i + 3]).premultiply(_q2);
    L[i] = _q1.x; L[i + 1] = _q1.y; L[i + 2] = _q1.z; L[i + 3] = _q1.w;
  };
  rot('RightUpLeg', ax === 'z' ? _AZ : _AX, -deg);
  if (deg > 0 && ax === 'x') { rot('Spine', _AX, -deg * 0.32); rot('Head', _AX, deg * 0.25); }   // lean back, eyes stay on target
}
const _AX = new THREE.Vector3(1, 0, 0), _AZ = new THREE.Vector3(0, 0, 1);
// ------------------------------------------------------------------ player (same API as TKDAnim.Player)
export class Player3D {
  constructor(sk) {
    this.sk = sk; this.data = sk.data;
    this.cur = null; this.time = 0; this.loop = false; this.speed = 1;
    this.from = null; this.mix = 0; this.mixDur = 0; this.hold = null;
    this.onEvent = null; this.onComplete = null; this._tmp = new Float32Array(sk.local.length);
    this.aim = 0; this.holdTime = 0;                              // v45: aim layer (+deg higher, −deg lower)
    this.look = 0; this.lookTo = 0;                               // v46: gaze pitch (+deg = up), eased
    this.iHead = this.data.boneIndex.Head; this.iNeck = this.data.boneIndex.Neck;
    this.iThigh = this.data.boneIndex.RightUpLeg;
  }
  // which mouth the face should wear right now
  mouth() {
    const n = this.curName, A = this.data.animations[n], t = this.cur ? this.time : this.holdTime;
    if (!A) return 'smile';
    if (A.impact !== null && !this.hold && t > A.impact - .07 && t < A.impact + .34) return 'kihap';
    if ((n === 'hit' || n === 'hit_head') && t < .6) return 'ouch';
    if (n === 'win' && t > .08 && t < 1.65) return 'cheer';
    return 'smile';
  }
  // v45 — the aim layer: lifts or lowers the kicking thigh around the strike, so one kick
  // can go to the head, the body or the legs. Weight rises from the chamber to the impact
  // and fades out in the recoil.
  // v46 — gaze: the head and eyes turn up/down toward what the fighter is looking at
  applyLook(dt) {
    this.look += (this.lookTo - this.look) * Math.min(1, dt * 8);
    const L = this.sk.local, k = this.look; if (Math.abs(k) < 0.3) return;
    for (const [i, w] of [[this.iHead, 0.55], [this.iNeck, 0.3]]) {
      if (i === undefined) continue;
      _q2.setFromAxisAngle(_AX, -k * w * D2R);
      _q1.set(L[i * 4], L[i * 4 + 1], L[i * 4 + 2], L[i * 4 + 3]).premultiply(_q2);
      L[i * 4] = _q1.x; L[i * 4 + 1] = _q1.y; L[i * 4 + 2] = _q1.z; L[i * 4 + 3] = _q1.w;
    }
  }
  applyAim() {
    const A = this.cur, ax = A && AIM_AXIS[this.curName];
    if (!ax || !this.aim || A.impact === null) return;
    const p = A.phases, t = this.time, a0 = (p[1] ?? A.impact - .15) - .1, a1 = A.impact, a2 = (p[3] ?? A.impact + .2) + .06;
    let w = t <= a0 || t >= a2 ? 0 : t < a1 ? (t - a0) / (a1 - a0) : 1 - (t - a1) / (a2 - a1);
    w = w * w * (3 - 2 * w); if (w <= 0) return;
    aimBones(this.sk, ax, this.aim * w);
  }
  play(name, { loop = false, mix = .15, speed = 1, from = 0, until = null } = {}) {
    const anim = this.data.animations[name]; if (!anim) return false;
    this.from = (this.cur || this.hold) ? this.snapshot() : null;
    this.mix = 0; this.mixDur = this.from ? mix : 0;
    this.cur = anim; this.curName = name; this.time = from; this.loop = loop; this.speed = speed; this.hold = null; this._done = false;
    this.until = until; this.sk.anchor = anim.anchor;
    return true;
  }
  pose(name, time, mix = .25) {
    const anim = this.data.animations[name]; if (!anim) return false;
    const target = applyAnimation(this.data, anim, time, new Float32Array(this.sk.local.length));
    this.from = (this.cur || this.hold) ? this.snapshot() : null;
    this.mix = 0; this.mixDur = this.from ? mix : 0;
    this.hold = target; this.cur = null; this.curName = name; this.holdTime = time; this.sk.anchor = anim.anchor;
    return true;
  }
  snapshot() { return Float32Array.from(this.sk.local); }
  update(dt) {
    const sk = this.sk;
    if (this.hold) sk.local.set(this.hold);
    else if (this.cur) {
      const prev = this.time; this.time += dt * this.speed;
      const D = this.cur.duration || 1e-4;
      for (const e of this.cur.events) if (e.time > prev && e.time <= this.time) this.onEvent && this.onEvent(e, this.curName);
      if (this.until !== null && this.until !== undefined && this.time >= this.until) {
        this.time = this.until;
        applyAnimation(this.data, this.cur, this.time, sk.local); this.applyAim();   // v45: the held strike keeps its aim
        this.hold = Float32Array.from(sk.local); this.holdTime = this.time; this.cur = null; this.until = null;   // v51: holdTime too (the lesson's time slider reads it)
        this.onComplete && this.onComplete(this.curName);
      } else if (this.time >= D) {
        if (this.loop) this.time %= D;
        else if (!this._done) { this._done = true; this.time = D; this.onComplete && this.onComplete(this.curName); }
      }
      if (this.cur) { applyAnimation(this.data, this.cur, this.time, sk.local); this.applyAim(); }
    }
    if (this.from && this.mix < this.mixDur) {
      this.mix += dt;
      const t = Math.min(1, this.mix / this.mixDur), e = t * t * (3 - 2 * t);
      this._tmp.set(sk.local); blend(this.from, this._tmp, e, sk.local);
      if (t >= 1) this.from = null;
    }
    this.applyLook(dt); sk.eyePitch = this.look;
    sk.updateWorld(); sk.stepSprings(dt); sk.stepFace(dt, this.mouth());
  }
  phaseTimes(name) { return (this.data.animations[name]?.events || []).filter(e => e.name === 'phase').sort((a, b) => a.int - b.int).map(e => e.time); }
}

export function poseAt(sk, name, time, aim = 0) {
  const anim = sk.data.animations[name]; if (!anim) return false;
  applyAnimation(sk.data, anim, time, sk.local);
  const ax = aim && AIM_AXIS[name];
  if (ax) aimBones(sk, ax, aim);                                  // v46: the aimed strike, at full weight
  sk.anchor = anim.anchor; sk.updateWorld();
  sk.stepFace(0, anim.impact !== null && Math.abs(time - anim.impact) < .2 ? 'kihap' : 'smile'); return true;
}

// ------------------------------------------------------------------ public
export const KICK_ANIM = { apchagi: 'apchagi', narochagi: 'naeryeo', bakchagi3: 'yeop', 'ap-ollyeo-chagi': 'ap-ollyeo', 'mireo-chagi': 'mireo' };
export function kickAnim(data, skillId) { const n = KICK_ANIM[skillId]; return n && data?.animations[n] ? n : null; }
// v45 — compile every material once at start-up, so the first kick never stutters
export function warmup() {
  const r = getRenderer(); if (!r) return false;
  for (const ch of ['boy', 'girl', 'coach']) {
    const data = dataCache[ch] || (dataCache[ch] = new Data3D(ch));
    const sk = new Skeleton3D(data);                              // thrown away after: the compiled programs stay cached
    applyAnimation(data, data.animations.idle, 0, sk.local); sk.updateWorld();
    try { r.compile(sk.scene, camera); } catch (e) { /* older drivers: the first draw compiles instead */ }
    r.setViewport(0, 0, 8, 8); r.setScissor(0, 0, 8, 8); r.clear(); r.render(sk.scene, camera);
  }
  return true;
}
export function character(ch) {
  if (!supported()) return null;
  ch = ch === 'girl' || ch === 'coach' ? ch : 'boy';
  const data = dataCache[ch] || (dataCache[ch] = new Data3D(ch));
  const sk = new Skeleton3D(data);
  const player = new Player3D(sk);
  player.play('idle', { loop: true, mix: 0 }); player.update(0);
  return { data, skeleton: sk, player, is3D: true,
           newSkeleton: () => new Skeleton3D(data), poseAt, kickAnim: (d, s) => kickAnim(d, s) };
}
