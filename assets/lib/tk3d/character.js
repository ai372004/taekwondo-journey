// ============================================================================
//  Taekwondo Journey · procedural 3D character
//  Built only from code (no images). Bone names follow Mixamo, so a real
//  glTF model rigged in Mixamo can later replace the meshes and keep every
//  animation in animations.js.
// ============================================================================
import * as THREE from '../three.module.min.js';

// --- character description (from the boy's JSON prompt) --------------------
export const BOY = {
  name: 'Boy (Student)',
  // v54b — colours and look taken from the reference pictures: fair skin with rosy cheeks,
  // dark-brown swept-up hair, hazel-brown eyes, a white dobok with cool grey shadows
  skin: '#eab193', skinShade: '#d89b7e', cheek: '#e9837f',
  hair: '#33251d', hairLock: '#47332a', hairHi: '#6a4c3b', hairStyle: 'quiff',
  eyes: '#5c3c25', irisIn: '#82593a',
  gi: '#e3e8ef', giShade: '#cbd2dd',
  collar: '#1d1d22',          // black V-neck collar
  belt: '#fdfdfb',            // white belt (v54b: a touch brighter than the jacket, so it shows)
  proportions: { head: 0.235, hipHeight: 0.625, legs: 1.2, headScale: .78 },   // v51: legs ×1.2 · v54: head ×0.78 — closer to the reference kids
};
export const COACH = {
  ...BOY, name: 'Coach Yang',
  skin: '#e9b48f', skinShade: '#e3a985', cheek: '#e58b7c', hair: '#b9b9b6', hairStyle: 'bun', eyes: '#4b3220',
  gi: '#1d1e22', giShade: '#2e3036', cuff: '#34363d', collar: '#2a2c31', belt: '#0f0f11', shoes: true, beard: true,
  proportions: { head: 0.2, hipHeight: 0.625, legs: 1.2 },
};
export const GIRL = {
  ...BOY, name: 'Girl (Student)',
  skin: '#edb79f', hair: '#25262f', hairLock: '#30323e', hairHi: '#4a4e63', hairStyle: 'longtail', eyes: '#4f321e', irisIn: '#755034', cheek: '#ea8590',
  lips: '#cf7480', girl: true,                                     // v54b: long black hair in a low ponytail, lashes
};

// --- skeleton layout (metres, rest pose: arms and legs hang straight down) --
const LAYOUT = [
  // name,            parent,        x,      y,      z
  ['Hips',            null,          0,      0.625,  0],
  ['Spine',           'Hips',        0,      0.07,   0],
  ['Spine1',          'Spine',       0,      0.15,   0],
  ['Neck',            'Spine1',      0,      0.17,   0],
  ['Head',            'Neck',        0,      0.055,  0],
  ['LeftArm',         'Spine1',      0.17,   0.125,  0],
  ['LeftForeArm',     'LeftArm',     0,     -0.20,   0],
  ['LeftHand',        'LeftForeArm', 0,     -0.165,  0],
  ['RightArm',        'Spine1',     -0.17,   0.125,  0],
  ['RightForeArm',    'RightArm',    0,     -0.20,   0],
  ['RightHand',       'RightForeArm',0,     -0.165,  0],
  ['LeftUpLeg',       'Hips',        0.085, -0.04,   0],
  ['LeftLeg',         'LeftUpLeg',   0,     -0.28,   0],
  ['LeftFoot',        'LeftLeg',     0,     -0.27,   0],
  ['LeftToeBase',     'LeftFoot',    0,     -0.03,   0.105],   // v50: the ball of the foot — the toes bend here
  ['RightUpLeg',      'Hips',       -0.085, -0.04,   0],
  ['RightLeg',        'RightUpLeg',  0,     -0.28,   0],
  ['RightFoot',       'RightLeg',    0,     -0.27,   0],
  ['RightToeBase',    'RightFoot',   0,     -0.03,   0.105],
];

// v54b — a lock of hair: a tapered tube along a smooth curve through `pts`, flattened so it lies on
// the head (wide sideways, thin in the direction away from `center`), with a pointed tip
function lockGeometry(pts, w0, w1, thick, center = [0, 0, 0], seg = 22, rad = 10) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, 'centripetal');
  const C = new THREE.Vector3(...center), pos = [], idx = [];
  const T = new THREE.Vector3(), R = new THREE.Vector3(), W = new THREE.Vector3(), P = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const t = i / seg; curve.getPointAt(t, P); curve.getTangentAt(t, T);
    R.copy(P).sub(C); R.addScaledVector(T, -R.dot(T)).normalize();          // outward, square to the lock
    W.crossVectors(T, R).normalize();                                        // across the lock
    let w = w0 + (w1 - w0) * Math.pow(t, 1.3);
    if (t < .1) w *= .55 + .45 * t / .1;                                    // a soft root
    if (i === seg) w = 0.0005;                                              // the tip
    const th = thick * (w / w0);
    for (let j = 0; j <= rad; j++) {
      const a = j / rad * Math.PI * 2, cw = Math.cos(a) * w, sr = Math.sin(a) * th;
      pos.push(P.x + W.x * cw + R.x * sr, P.y + W.y * cw + R.y * sr, P.z + W.z * cw + R.z * sr);
    }
  }
  for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) {
    const a = i * (rad + 1) + j, b = a + rad + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
// a point on a sphere of radius r: `az` round the head (0 = the face), `el` from the face over the top (90 = top, 180 = back)
const onHead = (az, el, r) => { const a = az * Math.PI / 180, e = el * Math.PI / 180; return [r * Math.cos(e) * Math.sin(a), r * Math.sin(e), r * Math.cos(e) * Math.cos(a)]; };

let _ramp = null;
function toonRamp() {
  if (_ramp) return _ramp;
  // v54b: a smooth ramp with soft, light shadows (the reference look) — it was 3 hard tones
  const v = [122, 150, 184, 214, 238, 255], d = new Uint8Array(v.length * 4);
  v.forEach((x, i) => d.set([x, x, x, 255], i * 4));
  _ramp = new THREE.DataTexture(d, v.length, 1, THREE.RGBAFormat);
  _ramp.minFilter = _ramp.magFilter = THREE.LinearFilter; _ramp.generateMipmaps = false; _ramp.needsUpdate = true;
  return _ramp;
}

// v46 — fewer draw calls: every group's still parts that share a material are baked into
// ONE mesh (in the group's own space), so a character costs ~40 draws instead of ~170.
// Parts that animate on their own (mouths, lashes, headband) are left alone.
function mergeStatic(root) {
  const keep = new Set(), F = root.userData.face;
  if (F) { [F.smile, F.open, F.ouch, ...F.lashes].forEach(o => o && keep.add(o)); }
  if (root.userData.headband) keep.add(root.userData.headband);
  const parents = []; root.traverse(o => { if (!o.isMesh) parents.push(o); });
  let before = 0, after = 0;
  for (const P of parents) {
    const byMat = new Map();
    for (const c of P.children) {
      if (!c.isMesh || keep.has(c) || c.children.length || !c.visible) continue;
      before++;
      (byMat.get(c.material) || byMat.set(c.material, []).get(c.material)).push(c);
    }
    for (const [m, list] of byMat) {
      if (list.length < 2) { after++; continue; }
      const pos = [], nor = [], uv = [], idx = []; let base = 0;
      for (const mesh of list) {
        mesh.updateMatrix();
        const g = mesh.geometry.clone(); g.applyMatrix4(mesh.matrix);
        const p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv;
        for (let i = 0; i < p.count; i++) {
          pos.push(p.getX(i), p.getY(i), p.getZ(i));
          nor.push(n ? n.getX(i) : 0, n ? n.getY(i) : 1, n ? n.getZ(i) : 0);
          uv.push(t ? t.getX(i) : 0, t ? t.getY(i) : 0);
        }
        if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + base);
        else for (let i = 0; i < p.count; i++) idx.push(i + base);
        base += p.count; g.dispose(); P.remove(mesh);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(base > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
      geo.computeBoundingSphere();
      const merged = new THREE.Mesh(geo, m); merged.name = 'merged'; P.add(merged); after++;
    }
  }
  root.userData.drawStats = { before, after };
}
export function buildCharacter(desc = BOY) {
  const r = buildCharacterParts(desc);
  mergeStatic(r.root);
  inkLimbs(r.root);
  return r;
}
// v47 — ink lines around the arms and legs ("inverted hull"): a leg raised in front of
// the white jacket now reads as its own shape. The outline drawn around the finished
// picture only rings the silhouette, so a kicking leg over the body used to melt into it.
let _ink = null;
function inkMaterial() {
  if (_ink) return _ink;
  _ink = new THREE.MeshBasicMaterial({ color: '#3a3040', side: THREE.BackSide }); _ink.userData.shared = true;   // one for every character: never disposed
  _ink.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  transformed += normal * 0.008;');   // v54b: finer (was .013)
  };
  return _ink;
}
function inkLimbs(root) {
  const LIMB = /^(Left|Right)(UpLeg|Leg|Foot|ToeBase|Arm|ForeArm|Hand)$/;
  const skip = new Set([root.userData.mat?.patch, root.userData.mat?.red].filter(Boolean));
  const list = [];
  root.traverse(o => { if (o.isMesh && o.parent && LIMB.test(o.parent.name) && !skip.has(o.material) && o.material !== _ink) list.push(o); });
  for (const mesh of list) {
    const hull = new THREE.Mesh(mesh.geometry, inkMaterial());
    hull.name = 'ink'; hull.renderOrder = -1;
    mesh.add(hull);
  }
}
function buildCharacterParts(desc = BOY) {
  const root = new THREE.Group(); root.name = 'TaekwondoCharacter';
  const bones = {};
  // v51 — leg length (1 = the original chibi legs); the hips rise with longer legs so the feet stay on the floor
  const LK = desc.proportions.legs || 1;
  const LEGY = { Hips: .625 + .55 * (LK - 1), LeftLeg: -.28 * LK, RightLeg: -.28 * LK, LeftFoot: -.27 * LK, RightFoot: -.27 * LK };
  for (const [name, parent, x, y0, z] of LAYOUT) {
    const y = LEGY[name] ?? y0;
    const g = new THREE.Group(); g.name = name; g.position.set(x, y, z);
    g.rotation.order = name === 'Hips' ? 'YXZ' : 'XYZ';
    (parent ? bones[parent] : root).add(g); bones[name] = g;
    g.userData.rest = g.position.clone();
  }

  // ---------- materials ----------
  // v45: cartoon (toon) shading — three flat tones instead of smooth plastic shading
  const M = (c, o = {}) => { const { roughness, metalness, ...rest } = o; return new THREE.MeshToonMaterial({ color: c, gradientMap: toonRamp(), ...rest }); };
  const mat = {
    skin: M(desc.skin, { roughness: .5 }), gi: M(desc.gi, { roughness: .85 }),
    giShade: M(desc.giShade, { roughness: .9 }), collar: M(desc.collar, { roughness: .7 }),
    belt: M(desc.belt, { roughness: .8 }), hair: M(desc.hair, { roughness: .55 }),
    white: M('#ffffff', { roughness: .25 }), iris: M(desc.eyes, { roughness: .3 }),
    pupil: M('#120a06', { roughness: .2 }), brow: M(desc.hair, { roughness: .7 }),
    mouth: M(desc.lips || '#b65f63', { roughness: .5 }), cheek: M(desc.cheek, { transparent: true, opacity: .42, roughness: .6 }),
    irisIn: M(desc.irisIn || desc.eyes, { roughness: .3 }), hairLock: M(desc.hairLock || desc.hair, { roughness: .5 }), hairHi: M(desc.hairHi || desc.hairLock || desc.hair, { roughness: .4 }),
    cuff: M(desc.cuff || '#cdd4de', { roughness: .8 }), ink: M('#2a2333', { roughness: .7 }),
    shoe: M('#f4f4f2', { roughness: .45 }), sole: M('#141416', { roughness: .6 }), patch: M('#f2efe8', { roughness: .6 }), red: M('#d22a2a', { roughness: .5 }), blue: M('#1f4fb8', { roughness: .5 }),
  };
  const add = (bone, geo, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = null) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz);
    if (s) mesh.scale.set(...s);
    mesh.castShadow = true; mesh.receiveShadow = true; bones[bone].add(mesh); return mesh;
  };
  // limb segment hanging from the joint, along -Y
  const limb = (bone, rTop, rBot, len, m, y0 = 0, seg = 22) => {
    const g = new THREE.CylinderGeometry(rTop, rBot, len, seg, 1);
    return add(bone, g, m, 0, y0 - len / 2, 0);
  };
  const sphere = (r, w = 24, h = 18) => new THREE.SphereGeometry(r, w, h);

  // ---------- legs: wide dobok pants, joint spheres hide every gap ----------
  for (const s of ['Left', 'Right']) {
    const sx = s === 'Left' ? 1 : -1;
    limb(`${s}UpLeg`, .093, .085, .28 * LK, mat.gi);
    add(`${s}UpLeg`, sphere(.093), mat.gi);                      // hip ball
    add(`${s}Leg`, sphere(.085), mat.gi);                        // knee ball
    limb(`${s}Leg`, .085, .092, .27 * LK - .045, mat.gi);
    add(`${s}Leg`, new THREE.CylinderGeometry(.094, .094, .024, 26, 1, true), mat.cuff, 0, -(.27 * LK - .045) + .012, 0).material.side = THREE.DoubleSide; // hem (v54: a visible cuff)
    limb(`${s}Leg`, .037, .036, .06, mat.skin, -(.27 * LK - .055));   // ankle
    if (desc.shoes) {                                            // white slip-on shoes, black trim and sole
      add(`${s}Foot`, new THREE.CapsuleGeometry(.05, .13, 8, 16), mat.shoe, 0, -.01, .055, Math.PI / 2, 0, 0, [1.08, 1, .66]);
      add(`${s}Foot`, new THREE.BoxGeometry(.1, .016, .23), mat.sole, 0, -.046, .055);
      add(`${s}Foot`, new THREE.TorusGeometry(.04, .007, 6, 20, Math.PI), mat.sole, 0, .02, .1, -Math.PI / 2 + .3, 0, 0);
      continue;
    }
    // bare foot, pointing forward (+Z). v50: the toes sit on their own joint (ToeBase, the ball
    // of the foot), so a kick can pull them back — ball of the foot for Ap Chagi, the heel /
    // blade for Yeop Chagi — and they stay flat on the mat when the heel lifts in a pivot
    add(`${s}Foot`, new THREE.CapsuleGeometry(.044, .075, 8, 16), mat.skin, 0, -.012, .032, Math.PI / 2, 0, 0, [1.05, 1, .62]);
    add(`${s}Foot`, sphere(.047), mat.skin, 0, -.004, -.005, 0, 0, 0, [1, .9, 1]);   // heel
    add(`${s}ToeBase`, sphere(.042, 18, 12), mat.skin, sx * .004, .016, .004, 0, 0, 0, [1.06, .6, .62]);   // ball of the foot
    for (let i = 0; i < 5; i++) {                                // toes
      const t = i / 4, r = .018 - t * .005;
      add(`${s}ToeBase`, sphere(r, 12, 10), mat.skin, sx * (-.026 + t * .05) * -1 + 0, .008, .03 - t * .016);
    }
  }
  // pelvis / seat of the pants
  add('Hips', sphere(.152), mat.gi, 0, -.03, -.005, 0, 0, 0, [1.12, .62, .82]);

  // ---------- torso: jacket, skirt, belt, collar ----------
  add('Spine', new THREE.CylinderGeometry(.157, .168, .2, 28), mat.gi, 0, .07, 0, 0, 0, 0, [1, 1, .78]);
  add('Spine1', new THREE.CylinderGeometry(.168, .155, .2, 28), mat.gi, 0, .045, 0, 0, 0, 0, [1, 1, .8]);
  add('Spine1', sphere(.171), mat.gi, 0, .12, 0, 0, 0, 0, [1.02, .45, .8]);  // shoulders' top
  // jacket skirt follows the hips (so it covers the pants when the chest leans)
  add('Hips', new THREE.CylinderGeometry(.17, .192, .15, 28, 1, true), mat.gi, 0, .005, 0, 0, 0, 0, [1, 1, .82]).material.side = THREE.DoubleSide;
  // belt: band + knot + two tails (on Spine, just above the hips)
  add('Spine', new THREE.CylinderGeometry(.17, .172, .05, 30, 1, true), mat.belt, 0, -.005, 0, 0, 0, 0, [1.01, 1, .8]).material.side = THREE.DoubleSide;
  add('Spine', new THREE.SphereGeometry(.04, 16, 12), mat.belt, 0, -.005, .143, 0, 0, 0, [1.3, .85, .7]);   // the knot
  // v45: the two tails hang from a pivot at the knot, so they can swing (spring in tk3d.js)
  const tails = new THREE.Group(); tails.name = 'BeltTail'; tails.position.set(0, -.012, .146); tails.rotation.order = 'XYZ';
  bones.Spine.add(tails); bones.BeltTail = tails; tails.userData.rest = tails.position.clone();
  const tail = (x, len, rz) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.04, len, .012), mat.belt); m.geometry.translate(0, -len / 2, 0); m.position.set(x, 0, 0); m.rotation.z = rz; tails.add(m); };
  tail(-.018, .25, -.12); tail(.02, .23, .16);                     // v54b: long tails, like a real tied belt
  // v54: thin dark edges on the belt — a white belt on a white jacket used to disappear
  for (const y of [-.03, .02]) add('Spine', new THREE.TorusGeometry(.173, .003, 6, 44), mat.cuff, 0, y, 0, Math.PI / 2, 0, 0, [1.01, .8, 1]);   // soft grey edges
  if (desc.shoes) {
    // wrap-front jacket: a diagonal lapel crossing the chest, and the round dojang patch on the left sleeve
    add('Spine1', new THREE.BoxGeometry(.045, .3, .016), mat.collar, -.02, .06, .14, -.15, 0, .55);
    add('Spine1', new THREE.BoxGeometry(.04, .14, .014), mat.collar, .06, .12, .128, -.2, 0, -.5);
    add('Spine1', new THREE.TorusGeometry(.07, .016, 8, 24, Math.PI), mat.collar, 0, .17, -.01, Math.PI / 2 + .25, 0, Math.PI);
  } else {
  // black V-neck collar: two bands meeting low on the chest + the small square at the tip
  add('Spine1', new THREE.BoxGeometry(.05, .21, .014), mat.collar, .044, .1, .126, -.18, 0, -.43);
  add('Spine1', new THREE.BoxGeometry(.05, .21, .014), mat.collar, -.044, .1, .126, -.18, 0, .43);
  add('Spine1', new THREE.BoxGeometry(.05, .04, .016), mat.collar, 0, .01, .136, -.12, 0, 0);
  add('Spine', new THREE.BoxGeometry(.045, .16, .014), mat.collar, -.032, .085, .127, -.05, -.22, -.4);   // v54c: the wrap-over lapel, down to the belt
  add('Spine1', new THREE.TorusGeometry(.07, .014, 8, 24, Math.PI), mat.collar, 0, .17, -.01, Math.PI / 2 + .25, 0, Math.PI);
  }

  // ---------- arms: wide sleeves, fists ----------
  for (const s of ['Left', 'Right']) {
    add(`${s}Arm`, sphere(.067), mat.gi);                       // shoulder ball
    limb(`${s}Arm`, .063, .058, .2, mat.gi);
    add(`${s}ForeArm`, sphere(.058), mat.gi);                    // elbow ball
    limb(`${s}ForeArm`, .058, .063, .14, mat.gi);
    add(`${s}ForeArm`, new THREE.CylinderGeometry(.065, .065, .022, 24, 1, true), mat.cuff, 0, -.129, 0).material.side = THREE.DoubleSide;   // sleeve cuff
    limb(`${s}ForeArm`, .036, .038, .05, mat.skin, -.12);        // wrist
    add(`${s}Hand`, new THREE.SphereGeometry(.046, 20, 16), mat.skin, 0, -.035, .005, 0, 0, 0, [.92, 1, 1.12]); // fist
    add(`${s}Hand`, new THREE.CapsuleGeometry(.016, .03, 6, 10), mat.skin, (s === 'Left' ? -1 : 1) * .03, -.03, .04, 0, 0, .9);   // thumb
    for (let i = 0; i < 4; i++)                                    // knuckles
      add(`${s}Hand`, sphere(.0145, 10, 8), mat.skin, (-.027 + i * .018), -.066, .03);
  }

  if (!desc.shoes) add('LeftArm', new THREE.BoxGeometry(.012, .045, .04), mat.collar, .064, -.06, .0, 0, 0, 0);   // v54b: the small black patch on the left sleeve
  if (desc.shoes) {
    const patch = add('LeftArm', new THREE.CylinderGeometry(.04, .04, .008, 24), mat.patch, .068, -.07, 0, 0, 0, Math.PI / 2);
    add('LeftArm', new THREE.CylinderGeometry(.018, .018, .01, 20), mat.red, .072, -.07, 0, 0, 0, Math.PI / 2);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2;
      add('LeftArm', sphere(.004, 6, 4), mat.sole, .073, -.07 + Math.sin(a) * .029, Math.cos(a) * .029); }
  }
  // ---------- neck + head ----------
  limb('Neck', .046, .05, .08, mat.skin, .07);
  // v54b — everything on the head lives in one group scaled by proportions.headScale, so the face
  // and hair keep their design sizes while the head gets smaller (the reference proportions)
  const HEAD = new THREE.Group(); HEAD.name = 'HeadContent'; HEAD.scale.setScalar(desc.proportions.headScale || 1); bones.Head.add(HEAD);
  const addH = (geo, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = null) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); if (s) mesh.scale.set(...s);
    mesh.castShadow = true; mesh.receiveShadow = true; HEAD.add(mesh); return mesh;
  };
  const H = desc.proportions.head;
  addH(sphere(H, 40, 32), mat.skin, 0, H * .92, .01, 0, 0, 0, [.98, 1.05, .98]);
  addH(sphere(H * .93, 32, 24), mat.skin, 0, H * .58, .05, 0, 0, 0, [.86, .84, .93]);     // jaw / cheeks (v54c: a softer, narrower chin)
  // v45: a face that can move — each eye is its own group (so it can blink), brows can
  // frown, and there are three mouths: smile, open "kihap!" and a pained "ouch"
  const face = { eyes: [], brows: [], lashes: [] };
  const sub = (parent, geo, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = null) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); if (s) mesh.scale.set(...s); parent.add(mesh); return mesh;
  };
  for (const sx of [1, -1]) {
    const hy = H * .9;
    addH(sphere(.05, 16, 12), mat.skin, sx * H * .97, hy - .02, -.01, 0, 0, 0, [.5, 1, .8]);  // ears
    addH(sphere(.03, 12, 10), mat.cheek, sx * (H * .97 + .012), hy - .02, -.005, 0, 0, 0, [.45, .9, .7]);   // a little rosy
    // big cartoon eyes
    // v54: bigger, sparklier eyes — a large iris, two highlights and a dark upper lid (the lid is
    // in the eye group, so it closes with the blink); the girl's lid is thicker with lash flicks
    const eye = new THREE.Group(); eye.position.set(sx * .089, hy - .004, H * .855); HEAD.add(eye); face.eyes.push(eye);
    sub(eye, sphere(.062, 26, 20), mat.white, 0, 0, 0, 0, 0, 0, [1.02, 1.08, .55]);
    sub(eye, sphere(.045, 22, 18), mat.iris, 0, -.008, .022, 0, 0, 0, [1, 1.1, .5]);
    sub(eye, sphere(.034, 20, 16), mat.irisIn, 0, -.009, .029, 0, 0, 0, [1, 1.08, .5]);
    sub(eye, sphere(.019, 16, 12), mat.pupil, 0, -.009, .038, 0, 0, 0, [1, 1, .45]);
    sub(eye, sphere(.0115, 10, 8), mat.white, sx * -.014 + .002, .016, .046);              // big sparkle
    sub(eye, sphere(.006, 8, 6), mat.white, sx * .012, -.024, .044);                        // small sparkle
    // v54c — an upper eyelid of skin covers the top of the eye, its edge a dark lash line, tilted
    // down toward the nose: the confident look of the reference (inside the eye group: it blinks)
    const lidG = new THREE.Group(); lidG.rotation.z = sx * .1; eye.add(lidG);
    sub(lidG, new THREE.SphereGeometry(.0655, 26, 12, 0, Math.PI * 2, 0, Math.PI * .25), mat.skin, 0, 0, 0, 0, 0, 0, [1.04, 1.08, .86]);
    const edgeY = .0655 * Math.cos(Math.PI * .25) * 1.08;
    sub(lidG, new THREE.TorusGeometry(.0655 * Math.sin(Math.PI * .25) * 1.04, desc.girl ? .0095 : .0072, 6, 28), mat.brow, 0, edgeY, 0, Math.PI / 2, 0, 0, [1, .86, 1]);
    if (desc.girl) for (let i = 0; i < 3; i++)                                              // lash flicks at the outer corner
      sub(lidG, new THREE.ConeGeometry(.0065, .026, 6), mat.brow, sx * (.05 + i * .006), edgeY + .004 + i * .006, .022 - i * .01, 0, 0, sx * -(1.0 + i * .25));
    // eyebrows (thinner for the girl)
    const by = hy + (desc.girl ? .1 : .093);
    const bz = .01 + Math.sqrt(Math.max(0, H * H - ((by - H * .92) / 1.04) ** 2)) * .97;   // sit ON the forehead
    const brow = new THREE.Group(); brow.position.set(sx * .09, by, bz); HEAD.add(brow); brow.userData.sx = sx; face.brows.push(brow);
    sub(brow, new THREE.CapsuleGeometry(desc.girl ? .0095 : .0125, .062, 6, 10), mat.brow, 0, 0, 0, 0, 0, Math.PI / 2 + sx * (desc.girl ? .14 : .2));   // thick, determined (the reference)
    addH(sphere(.036, 14, 10), mat.cheek, sx * .14, hy - .078, H * .73, 0, 0, 0, [1, .66, .4]);   // rosy cheeks
  }
  addH(new THREE.CapsuleGeometry(.016, .034, 6, 12), mat.skin, 0, H * .81, H * .955, .42, 0, 0, [1, 1, .85]);   // v54: a little nose with a bridge
  addH(sphere(.024, 14, 12), mat.skin, 0, H * .765, H * .985, 0, 0, 0, [1.05, .85, .9]);         //   and its round tip
  addH(sphere(.014, 10, 8), mat.cheek, 0, H * .775, H * 1.06, 0, 0, 0, [1, .8, .6]);           // a rosy nose tip
  face.smile = addH(new THREE.TorusGeometry(.03, .0075, 8, 22, Math.PI * .7), mat.mouth, .01, H * .63, .05 + H * .872, 0, 0, Math.PI * 1.15); // a small confident smile (the reference)
  const mouthIn = M('#5a1f22');
  face.open = addH(sphere(.03, 16, 12), mouthIn, .004, H * .58, .05 + H * .862, 0, 0, 0, [1, 1.15, .4]); face.open.visible = false;     // "kihap!"
  face.ouch = addH(sphere(.03, 16, 12), mouthIn, .004, H * .6, .05 + H * .866, 0, 0, 0, [1.35, .45, .4]); face.ouch.visible = false;   // gritted "ouch"
  root.userData.face = face;

  // headband (shop cosmetic) — hidden until a colour is equipped
  const headband = new THREE.Mesh(new THREE.TorusGeometry(H * 1.0, .018, 10, 40), M('#d63a3a', { roughness: .7 }));
  headband.position.set(0, H * 1.08, -.005); headband.rotation.x = Math.PI / 2 - .32; headband.scale.set(1.02, 1.08, 1);
  headband.visible = false; HEAD.add(headband);
  root.userData.mat = mat; root.userData.headband = headband;

  const hairRoot = new THREE.Group(); hairRoot.position.set(0, H * .92, .01); HEAD.add(hairRoot);
  if (desc.beard) {
    // full short grey beard and moustache, slicked-back hair with a top bun, bushy brows
    // jaw-line beard only: a low cap of a sphere, so eyes, nose and cheeks stay visible
    const beard = new THREE.Mesh(new THREE.SphereGeometry(H * 1.0, 32, 14, 0, Math.PI * 2, Math.PI * .6, Math.PI * .4), mat.hair);
    beard.position.set(0, -H * .1, .01); beard.scale.set(1.0, 1.25, 1.06); hairRoot.add(beard);
    const chin = new THREE.Mesh(new THREE.SphereGeometry(.055, 16, 12), mat.hair); chin.position.set(0, -H * .62, H * .66); chin.scale.set(1.35, 1.05, .8); hairRoot.add(chin);
    const stache = new THREE.Mesh(new THREE.CapsuleGeometry(.018, .07, 6, 10), mat.hair); stache.rotation.z = Math.PI / 2;
    stache.position.set(0, -H * .22, H * .93); hairRoot.add(stache);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(H * 1.04, 36, 24, 0, Math.PI * 2, 0, Math.PI * .55), mat.hair);
    cap.rotation.x = -.5; cap.position.set(0, .01, -.03); hairRoot.add(cap);
    const bun = new THREE.Mesh(new THREE.SphereGeometry(.055, 18, 14), mat.hair); bun.position.set(0, H * 1.08, -H * .3); hairRoot.add(bun);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(.035, .01, 6, 16), M('#1b1b1b')); tie.position.set(0, H * 1.0, -H * .28); tie.rotation.x = Math.PI / 2 - .5; hairRoot.add(tie);
    for (const sx of [1, -1]) {
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(.014, .05, 6, 10), mat.hair);
      brow.position.set(sx * .075, H * .1, H * .86); brow.rotation.z = Math.PI / 2 + sx * .15; hairRoot.add(brow);
    }
    root.userData.bones = bones;
    return { root, bones };
  }
  // an ellipsoid of hair: (x, y, z) in the hair space, size (a, b, c), turned (rx, ry, rz)
  const blob = (parent, x, y, z, a, b, c, rx = 0, ry = 0, rz = 0, m = mat.hair) => {
    const o = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), m); o.position.set(x, y, z); o.scale.set(a, b, c); o.rotation.set(rx, ry, rz); o.castShadow = true; parent.add(o); return o;
  };
  // (the locks are a shade lighter than the scalp, so they read as combed hair)
  const lock = (parent, pts, w0, w1, thick, center, m = mat.hairLock) => { const o = new THREE.Mesh(lockGeometry(pts, w0, w1, thick, center), m); o.castShadow = true; parent.add(o); return o; };
  const R0 = H * 1.0;                               // the scalp, in the hair space (its origin is the head's centre)
  if (desc.hairStyle === 'longtail') {
    // v54b — the reference girl: long dark hair combed back from a side parting over the ears
    // into a low ponytail that falls down her back (its own bone, so it swings), and a fringe
    // swept across the forehead from the parting
    const cap = new THREE.Mesh(new THREE.SphereGeometry(H * 1.04, 40, 28, 0, Math.PI * 2, 0, Math.PI * .62), mat.hair);
    cap.rotation.x = -.45; cap.position.set(0, .012, -.03); cap.castShadow = true; hairRoot.add(cap);
    blob(hairRoot, 0, -.05, -.07, H * .98, H * .88, H * .86);                          // the back of the head
    const tieAt = onHead(0, 196, R0 * 1.02);                                            // where the ponytail is tied
    // locks combed back from the hairline to the tie
    for (const az of [-62, -40, -18, 4, 30, 54]) {
      const sa = az + 6;
      lock(hairRoot, [onHead(sa, 36 + Math.abs(az) * .1, R0 * 1.0), onHead(az * .95, 70, R0 * 1.09), onHead(az * .8, 110, R0 * 1.09), onHead(az * .5, 160, R0 * 1.07), [tieAt[0] + az * .0006, tieAt[1] + .01, tieAt[2]]], .055, .03, .022, [0, -.02, 0], az === 4 || az === -18 ? mat.hairHi : mat.hairLock);
    }
    // the fringe, swept from the parting (on her left) across the forehead
    for (const [y0, d] of [[0, 0], [-6, .012], [-12, .02]]) lock(hairRoot, [onHead(28, 82 + y0, R0 * 1.07), onHead(5, 62 + y0, R0 * 1.09), onHead(-30, 46 + y0, R0 * 1.07), onHead(-62, 30 + y0, R0 * 1.03), onHead(-80, 12 + y0, R0 * 1.0)], .055 - d, .025, .02, [0, -.02, 0]);
    // over the ears, back to the tie
    for (const sx of [1, -1]) {
      lock(hairRoot, [onHead(sx * 72, 22, R0 * 1.0), onHead(sx * 100, 22, R0 * 1.05), onHead(sx * 140, 10, R0 * 1.03), onHead(sx * 170, 0, R0 * 1.01)], .06, .03, .025, [0, -.02, 0]);
      lock(hairRoot, [onHead(sx * 80, -8, R0 * .99), onHead(sx * 108, -12, R0 * 1.03), onHead(sx * 150, -14, R0 * 1.0)], .045, .02, .02, [0, -.02, 0]);
    }
    lock(hairRoot, [onHead(-74, 18, R0 * 1.0), onHead(-84, -10, R0 * 1.03), onHead(-82, -40, R0 * 1.03), onHead(-78, -62, R0 * 1.0)], .02, .008, .012, [0, 0, -.1]);   // a loose strand by her cheek
    // the ponytail
    const pt = new THREE.Group(); pt.name = 'Ponytail'; pt.position.set(...tieAt); pt.rotation.order = 'XYZ';
    hairRoot.add(pt); bones.Ponytail = pt; pt.userData.rest = pt.position.clone();
    const tie = new THREE.Mesh(new THREE.TorusGeometry(.03, .013, 8, 20), M('#3a2f45', { roughness: .6 })); tie.rotation.x = Math.PI / 2 - .3; tie.position.set(0, 0, -.02); pt.add(tie);
    blob(pt, 0, -.01, -.035, .05, .055, .045);
    const tc = [0, -.15, .35];                      // the locks are flat toward the back
    lock(pt, [[0, 0, -.04], [0, -.09, -.11], [.012, -.24, -.13], [-.012, -.4, -.11], [.0, -.56, -.08]], .064, .014, .036, tc, mat.hairHi);
    lock(pt, [[.022, 0, -.03], [.038, -.1, -.09], [.044, -.26, -.1], [.028, -.42, -.07], [.036, -.52, -.05]], .05, .012, .03, tc);
    lock(pt, [[-.022, 0, -.03], [-.036, -.1, -.095], [-.04, -.25, -.11], [-.042, -.41, -.09], [-.026, -.5, -.08]], .05, .012, .03, tc);
    lock(pt, [[0, -.01, -.02], [.004, -.12, -.07], [-.01, -.28, -.075], [.01, -.44, -.05], [-.004, -.54, -.03]], .046, .01, .028, tc);
    root.userData.bones = bones;
    return { root, bones };
  }
  if (desc.hairStyle === 'quiff') {
    // v54b — the reference boy: short sides combed back and a quiff of soft locks that lift off
    // the forehead and sweep up and back over the crown (instead of the old spikes)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(H * 1.03, 36, 24, 0, Math.PI * 2, 0, Math.PI * .6), mat.hair);
    cap.rotation.x = -.4; cap.position.set(0, .012, -.02); cap.castShadow = true; hairRoot.add(cap);
    for (const [az, lift, len] of [[-50, 1.12, 1], [-32, 1.2, 1], [-14, 1.26, 1], [4, 1.3, 1], [22, 1.26, 1], [40, 1.18, 1], [56, 1.1, .9]]) {
      const sw = 14;                                                       // the sweep toward his left
      lock(hairRoot, [onHead(az, 38 + Math.abs(az) * .12, R0 * 1.0), onHead(az + sw * .3, 56, R0 * lift), onHead(az * .9 + sw * .6, 82, R0 * (lift - .06)), onHead(az * .8 + sw, 118, R0 * 1.1), onHead(az * .7 + sw, 150 * len, R0 * 1.04)], .07, .035, .04, [0, -.04, -.02], Math.abs(az + 5) < 12 || az === 22 ? mat.hairHi : mat.hairLock);
    }
    for (const az of [-20, 10, 38]) lock(hairRoot, [onHead(az, 100, R0 * 1.06), onHead(az + 6, 135, R0 * 1.07), onHead(az + 8, 165, R0 * 1.03), onHead(az + 6, 190, R0 * .98)], .07, .03, .03, [0, 0, 0]);   // the crown, combed back
    for (const sx of [1, -1]) {     // short sides, combed back over the ears
      lock(hairRoot, [onHead(sx * 70, 30, R0 * 1.0), onHead(sx * 95, 28, R0 * 1.05), onHead(sx * 130, 22, R0 * 1.04), onHead(sx * 160, 12, R0 * 1.0)], .06, .03, .025, [0, -.02, 0]);
      const sb = new THREE.Mesh(new THREE.CapsuleGeometry(.018, .045, 6, 10), mat.hair);
      sb.position.set(sx * H * .93, -.03, .04); sb.castShadow = true; hairRoot.add(sb);
    }
    root.userData.bones = bones;
    return { root, bones };
  }
  // ---------- spiky hair ----------
  const cap = new THREE.Mesh(new THREE.SphereGeometry(H * 1.04, 36, 24, 0, Math.PI * 2, 0, Math.PI * .58), mat.hair);
  cap.rotation.x = -.38; cap.position.set(0, .012, -.02); cap.castShadow = true; hairRoot.add(cap);
  const spike = (theta, phi, len, r) => {   // theta around Y, phi from the top
    const g = new THREE.ConeGeometry(r, len, 10); g.translate(0, len / 2, 0);
    const m = new THREE.Mesh(g, mat.hair); m.castShadow = true;
    const dir = new THREE.Vector3(Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.sin(phi) * Math.cos(theta));
    m.position.copy(dir.clone().multiplyScalar(H * .9));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.add(new THREE.Vector3(0, .55, -.25)).normalize());
    hairRoot.add(m);
  };
  // swept-up quiff at the front, spikes over the crown and back
  for (let i = 0; i < 7; i++) spike(-.9 + i * .3, .38, .17 - Math.abs(i - 3) * .012, .055);
  for (let i = 0; i < 9; i++) spike(i * (Math.PI * 2 / 9) + .2, .75, .13, .05);
  for (let i = 0; i < 7; i++) spike(Math.PI * .55 + i * .3, 1.15, .1, .048);
  spike(0, .1, .19, .06); spike(.6, .18, .16, .055); spike(-.6, .18, .16, .055);
  for (const sx of [1, -1]) {   // sideburns
    const sb = new THREE.Mesh(new THREE.CapsuleGeometry(.022, .06, 6, 10), mat.hair);
    sb.position.set(sx * H * .93, -.02, .03); sb.castShadow = true; hairRoot.add(sb);
  }

  root.userData.bones = bones;
  return { root, bones };
}
