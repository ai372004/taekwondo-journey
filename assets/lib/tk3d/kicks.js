// ============================================================================
//  Taekwondo Journey · 3D animation data (Mixamo bone names, degrees x/y/z)
//  Character faces +Z, kicks with the RIGHT (rear) leg toward +Z.
//    thigh / upper arm x < 0 -> forward   ·  shin x > 0 / forearm x < 0 -> bend
//    Spine x < 0 -> lean back  ·  Hips y -> turn the body  ·  right leg z < 0 -> out to the side
//  Every kick has the game's 5 phase events (0 ready · 1 chamber · 2 extension · 3 recoil · 4 return)
//  plus an 'impact' event, exactly like the 2D rigs, so the lesson card and the arena games
//  read them the same way.
// ============================================================================
export const STANCE = {
  Hips: [0, -40, 0],
  Spine: [3, 8, 0], Spine1: [2, 10, 0], Neck: [0, 10, 0], Head: [-2, 12, 0],
  LeftArm: [-42, 0, 22], LeftForeArm: [-112, 0, 0], LeftHand: [10, 0, 0],
  RightArm: [-28, 0, -20], RightForeArm: [-122, 0, 0], RightHand: [10, 0, 0],
  // v51: knees bent, ready to spring — the front foot flat, the rear foot on its ball, BOTH on the mat
  LeftUpLeg: [-26, 0, 6], LeftLeg: [26, 0, 0], LeftFoot: [0, 0, 0],
  RightUpLeg: [10, 0, -6], RightLeg: [21.5, 0, 0], RightFoot: [-24, 0, 0],
  Ponytail: [14, 0, 0],
};
const S = (o = {}) => ({ ...STANCE, ...o });
const GUARD = { LeftArm: [-38, 0, 18], LeftForeArm: [-126, 0, 0], RightArm: [-20, 0, -14], RightForeArm: [-132, 0, 0] };
// v51: the weight sinks onto the front foot, the rear heel lifts, its toes still on the mat
const ANTIC = { LeftUpLeg: [-22, 0, 6], LeftLeg: [35, 0, 0], LeftFoot: [-13, 0, 0], RightUpLeg: [10, 0, -6], RightLeg: [25.5, 0, 0], RightFoot: [-18.5, 0, 0], Spine: [6, 8, 0] };
const phases = (...t) => t.map((time, int) => ({ time, name: 'phase', int }));

// v49 — the three game kicks follow the game's own lesson text AND published technique
// (Kukkiwon / poomsae guides, coaching references, kinematic studies of Ap-Chagi and
// Yop-Chagi). Every pose below is checked by measuring the 3D body: joint angles, knee /
// foot height against the body, standing-foot pivot, torso lean, striking surface, balance.

// --- Ap chagi -----------------------------------------------------------------
// chamber: knee lifted straight forward and pointing at the target, ~105° between the
//          legs, knee bent ~70° with the foot hanging under it (studies: ~70–83° / 106–111°);
//          standing foot turned outward on its ball (~80°, the game's "~90°"); guard up.
const AP_CH = { ...GUARD, Hips: [0, 9, 0], Spine: [-4, -4, 0], Spine1: [2, -4, 0], Neck: [0, -4, 0], Head: [-2, -4, 0], LeftUpLeg: [-4, 38, -1], LeftLeg: [14, 0, 0], LeftFoot: [-7, 0, 0], RightUpLeg: [-112, 0, 6], RightLeg: [110, 0, 0], RightFoot: [40, 0, 0], RightToeBase: [-15, 0, 0] };
// strike: leg straight, ~111° between the legs (studies: 105–115° at contact), ankle
//         extended so the ball of the foot leads (toes pulled back) at solar-plexus / chest
//         height; hip into the kick, upper body upright, standing leg almost straight.
const AP_EX = { ...GUARD, Hips: [0, 16, 0], Spine: [-4, -6, 0], Spine1: [-2, -4, 0], Neck: [0, -4, 0], Head: [8, -4, 0], LeftUpLeg: [-3, 30, 1], LeftLeg: [8, 0, 0], LeftFoot: [-1, 0, 0], RightUpLeg: [-116, 0, 10], RightLeg: [4, 0, 0], RightFoot: [55, 0, 0], RightToeBase: [-60, 0, 0], Ponytail: [34, 0, 0] };

// --- Naeryeo chagi (axe) ----------------------------------------------------------
// rise: both knees straight, the leg swings straight up in front (foot above the
//       shoulders); upper body stays almost vertical (~10°) — leaning back is the classic
//       mistake that makes kids fall backward; the standing foot turns only a little.
const NR_RISE = { ...GUARD, Hips: [0, -10, 0], Spine: [-10, 0, 0], Spine1: [2, 2, 0], Neck: [0, 10, 0], Head: [8, 6, 0], LeftUpLeg: [-7, -4, -2], LeftLeg: [2, 0, 0], LeftFoot: [11, 0, 0], RightUpLeg: [-116, 0, 12], RightLeg: [2, 0, 0], RightFoot: [-20, 0, 0], RightToeBase: [-15, 0, 0], Ponytail: [28, 0, 0] };
const NR_UP = { Hips: [0, -8, 0], Spine: [-15, 11, 0], Spine1: [5, -6, 0], Neck: [0, 8, -2], Head: [16, 4, 0], LeftArm: [-20, 0, 24], LeftForeArm: [-130, 0, 0], RightArm: [-8, 0, -20], RightForeArm: [-144, 0, 0], LeftUpLeg: [-2, -5, -6], LeftLeg: [0, 0, 0], LeftFoot: [3, 0, 0], RightUpLeg: [-156, 25, -1], RightLeg: [2, 0, 0], RightFoot: [-6, 0, 0], RightToeBase: [-20, 0, 0], Ponytail: [38, 0, 0] };
// strike: hips drive forward, upper body vertical, leg still straight, the heel (foot
//         flexed, toes up) lands at ~45° from vertical on shoulder / collarbone height.
const NR_HIT = { ...GUARD, Hips: [-6, -10, 0], Spine: [2, 0, 0], Spine1: [2, 4, 0], Neck: [0, 8, 0], Head: [4, 6, 0], LeftUpLeg: [-8, -6, -5], LeftLeg: [16, 0, 0], LeftFoot: [2, 0, 0], RightUpLeg: [-128, -5, 9], RightLeg: [6, 0, 0], RightFoot: [-20, 0, 0], RightToeBase: [-25, 0, 0], Ponytail: [12, 0, 0] };
// v56.2 (coach's review): after the strike the leg keeps falling STRAIGHT — the knee does
// not bend — until the foot lands on the mat in front; then a calm step back to the stance.
const NR_FALL = { ...GUARD, Hips: [-4, -12, 0], Spine: [2, -2, 0], Spine1: [2, 6, 0], Neck: [0, 9, 0], Head: [0, 9, 0], LeftUpLeg: [-9, 0, -4], LeftLeg: [12, 0, 0], LeftFoot: [2, 0, 0], RightUpLeg: [-70, -3, 8], RightLeg: [3, 0, 0], RightFoot: [-10, 0, 0] };
const NR_LAND = { ...GUARD, Hips: [0, -16, 0], Spine: [2, 0, 0], Spine1: [2, 8, 0], Neck: [0, 10, 0], Head: [-2, 10, 0], LeftUpLeg: [6, 2, 2], LeftLeg: [6, 0, 0], LeftFoot: [-14, 0, 0], RightUpLeg: [-14, 0, 4], RightLeg: [2, 0, 0], RightFoot: [12, 0, 0] };

// --- Yeop chagi (the game's "Bik Chagi" side kick) --------------------------------
// anticipation: the weight moves onto the front foot while the back foot still touches;
// the turn starts in the hips and the neck turns back, so the eyes stay on the target
const YP_ANT = { Hips: [10, 10, -2], Spine: [-4, -2, 0], Spine1: [2, -2, 0], Neck: [0, -2, 0], Head: [-2, -4, 0], LeftUpLeg: [-20, 28, 6], LeftLeg: [21, 0, 0], LeftFoot: [-6, 0, 0], RightUpLeg: [-4, 0, -6], RightLeg: [10, 0, 0], RightFoot: [-5, 0, 0] };
// v59.7 — Bik Chagi re-posed to the coaches' angles (flexion: 0° = straight). Measured on the
// 3D body: chamber knee 115° · hip 90° · thigh +6° · trunk 5° · standing knee 5°; pivot: the
// standing foot turns 135° from the 45° stance (hips 120°, within ±15°), trunk 10°; extension
// start knee 61° · thigh +15°; strike at belly height, the leg stretched out at the target: knee
// 18° · thigh +4° · hip 79° · trunk back 20° · standing knee 5° · ankle pointed 38°; recoil knee 115° · hip 88°.
const YP_CH = { ...GUARD, Hips: [-16, 48, -14], Spine: [20, -19, 13], Spine1: [0, -12, -4], Neck: [0, -30, 8], Head: [0, -36, 6], LeftUpLeg: [12, 10, -6], LeftLeg: [-5, 0, 0], LeftFoot: [-14, -16, 13], RightUpLeg: [-99, -17, -72], RightLeg: [115, 0, 0], RightFoot: [-35, 0, 0], RightToeBase: [-30, 0, 0] };
const YP_PV = { ...YP_CH, Hips: [-8, 80, -14], Spine: [4, -24, 11], LeftUpLeg: [12, 25, -14], LeftFoot: [-30, -16, 13], RightUpLeg: [-105, -17, -62] };
const YP_EXS = { ...YP_PV, Hips: [-5, 80, -14], RightUpLeg: [-119, -17, -62], RightLeg: [61, 0, 0] };
const YP_EX = { ...GUARD, Hips: [-10, 85, -2], Spine: [27, -14, -20], Spine1: [0, -14, 10], Neck: [0, -34, 10], Head: [11, -40, 12], LeftUpLeg: [-17, 15, 6], LeftLeg: [5, 0, 0], LeftFoot: [2, -1, -1], RightUpLeg: [23, -6, -91], RightLeg: [18, 0, 0], RightFoot: [22, 0, 0], RightToeBase: [10, 0, 0], Ponytail: [30, 0, -25] };
const YP_REC = { ...YP_PV, Hips: [-5, 80, -14], Spine: [4, -25, 11], RightUpLeg: [-105, -17, -64] };

// --- Ap ollyeo chagi (front rising kick): a straight leg swings up and down -------
const AO_UP = { Hips: [0, -14, 0], Spine: [-10, 4, 0], LeftUpLeg: [-4, 0, 4], LeftLeg: [4, 0, 0], LeftFoot: [14, 0, 0], RightUpLeg: [-92, 0, -4], RightLeg: [4, 0, 0], RightFoot: [20, 0, 0] };
const AO_TOP = { ...GUARD, Hips: [0, -12, 0], Spine: [-16, 4, 0], Head: [12, 6, 0], LeftUpLeg: [-2, 0, 4], LeftLeg: [2, 0, 0], LeftFoot: [18, 0, 0], RightUpLeg: [-138, 0, -4], RightLeg: [2, 0, 0], RightFoot: [10, 0, 0] };

// --- Mireo chagi (push kick): knee high, the whole sole pushes, hips drive in -----
const MR_CH = { Hips: [0, -12, 0], Spine: [-6, 4, 0], LeftUpLeg: [-8, 0, 4], LeftLeg: [12, 0, 0], RightUpLeg: [-104, 0, -4], RightLeg: [116, 0, 0], RightFoot: [-40, 0, 0] };
const MR_EX = { ...GUARD, Hips: [0, -8, 0], Spine: [-20, 4, 0], Spine1: [-4, 4, 0], Head: [14, 6, 0], LeftUpLeg: [-4, 0, 4], LeftLeg: [8, 0, 0], LeftFoot: [10, 0, 0], RightUpLeg: [-82, 0, -2], RightLeg: [6, 0, 0], RightFoot: [-62, 0, 0] };

const ATTN = { Hips: [0, 0, 0], Spine: [0, 0, 0], Spine1: [0, 0, 0], Neck: [0, 0, 0], Head: [0, 0, 0],
  LeftArm: [0, 0, 6], LeftForeArm: [-4, 0, 0], LeftHand: [0, 0, 0], RightArm: [0, 0, -6], RightForeArm: [-4, 0, 0], RightHand: [0, 0, 0],
  LeftUpLeg: [0, 0, 1], LeftLeg: [0, 0, 0], LeftFoot: [0, 0, 0], RightUpLeg: [0, 0, -1], RightLeg: [0, 0, 0], RightFoot: [0, 0, 0], Ponytail: [12, 0, 0] };
const CROSSED = { ...ATTN, Hips: [0, -20, 0], Spine: [-3, 0, 0], Head: [-2, 10, 0], LeftUpLeg: [-4, 0, 6], RightUpLeg: [4, 0, -6],
  LeftArm: [-30, -80, 12], LeftForeArm: [-104, 0, 0], RightArm: [-34, 80, -12], RightForeArm: [-100, 0, 0] };
const STAND_WIN = { Hips: [0, -10, 0], Spine: [-6, 0, 0], Spine1: [-4, 0, 0], Neck: [0, 0, 0], Head: [-10, 0, 0],
  RightArm: [-158, 0, -34], RightForeArm: [-28, 0, 0], LeftArm: [8, 0, 26], LeftForeArm: [-92, 0, 0],
  LeftUpLeg: [-8, 0, 8], LeftLeg: [6, 0, 0], LeftFoot: [4, 0, 0], RightUpLeg: [12, 0, -8], RightLeg: [10.5, 0, 0], RightFoot: [-6, 0, 0], Ponytail: [18, 0, 0] };
const HIT = { Hips: [-8, -30, 0], Spine: [24, 4, 0], Spine1: [16, 6, 0], Neck: [10, 0, 0], Head: [14, 4, 0],
  LeftArm: [-30, 0, 10], LeftForeArm: [-135, 0, 0], RightArm: [-24, 0, -8], RightForeArm: [-140, 0, 0],
  LeftUpLeg: [-30, 0, 6], LeftLeg: [30, 0, 0], LeftFoot: [8, 0, 0], RightUpLeg: [28, 0, -6], RightLeg: [26, 0, 0], Ponytail: [-12, 0, 0] };

const HIT_HEAD = { Hips: [4, -34, 0], Spine: [-18, 4, -4], Spine1: [-8, 6, 0], Neck: [-18, -6, 0], Head: [-26, 14, 6],
  LeftArm: [-64, 0, 34], LeftForeArm: [-74, 0, 0], RightArm: [-52, 0, -30], RightForeArm: [-86, 0, 0],
  LeftUpLeg: [-26, 0, 6], LeftLeg: [26, 0, 0], RightUpLeg: [30, 0, -6], RightLeg: [22, 0, 0], Ponytail: [44, 0, 8] };

// a natural walk on the spot: legs and arms swing in opposition, hips bob
const WALK_A = { Hips: [0, 0, 0], Spine: [4, -4, 0], Spine1: [0, -4, 0], Head: [0, 8, 0], Neck: [0, 0, 0],
  LeftUpLeg: [-26, 0, 2], LeftLeg: [8, 0, 0], LeftFoot: [-10, 0, 0], RightUpLeg: [20, 0, -2], RightLeg: [22, 0, 0], RightFoot: [10, 0, 0],
  LeftArm: [20, 0, 10], LeftForeArm: [-30, 0, 0], RightArm: [-24, 0, -10], RightForeArm: [-36, 0, 0], LeftHand: [0, 0, 0], RightHand: [0, 0, 0] };
const WALK_B = { ...WALK_A, Spine: [4, 4, 0], Spine1: [0, 4, 0], Head: [0, -8, 0],
  LeftUpLeg: [20, 0, 2], LeftLeg: [22, 0, 0], LeftFoot: [10, 0, 0], RightUpLeg: [-26, 0, -2], RightLeg: [8, 0, 0], RightFoot: [-10, 0, 0],
  LeftArm: [-24, 0, 10], LeftForeArm: [-36, 0, 0], RightArm: [20, 0, -10], RightForeArm: [-30, 0, 0] };
const WALK_PASS = (side) => ({ ...WALK_A, Spine: [4, 0, 0], Spine1: [0, 0, 0], Head: [0, 0, 0],
  LeftUpLeg: side ? [-4, 0, 2] : [-30, 0, 2], LeftLeg: side ? [4, 0, 0] : [60, 0, 0], LeftFoot: [0, 0, 0],
  RightUpLeg: side ? [-30, 0, -2] : [-4, 0, -2], RightLeg: side ? [60, 0, 0] : [4, 0, 0], RightFoot: [0, 0, 0],
  LeftArm: [0, 0, 10], RightArm: [0, 0, -10] });

// Error Hunt mistakes, each one change away from the correct strike
const ERR_KNEE = { ...AP_EX, RightUpLeg: [AP_EX.RightUpLeg[0] + 14, AP_EX.RightUpLeg[1], AP_EX.RightUpLeg[2]], RightLeg: [72, 0, 0], RightFoot: [20, 0, 0] };
const ERR_HEEL = { ...AP_EX, LeftFoot: [AP_EX.LeftFoot[0] + 38, 0, 0], LeftLeg: [2, 0, 0] };

export const ANIMS = {
  idle: { loop: true, keys: [
    { t: 0, pose: S() },
    { t: .7, pose: S({ Spine1: [4, 10, 0], LeftUpLeg: [-28, 0, 6], LeftLeg: [30, 0, 0], LeftForeArm: [-108, 0, 0], RightForeArm: [-118, 0, 0], Ponytail: [12, 0, 0] }) },   // v51: breathe in = sink a little, both feet stay on the mat
    { t: 1.4, pose: S() }] },
  ready: { keys: [{ t: 0, pose: S() }, { t: .5, pose: S() }], events: phases(0) },

  apchagi: { keys: [
    { t: 0, pose: S() }, { t: .14, pose: S(ANTIC) },
    { t: .3, pose: S(AP_CH) },
    { t: .44, ease: 'snap', pose: S(AP_EX) },
    { t: .52, pose: S({ ...AP_EX, RightUpLeg: [AP_EX.RightUpLeg[0] + 4, AP_EX.RightUpLeg[1], AP_EX.RightUpLeg[2]], RightLeg: [8, 0, 0] }) },
    { t: .66, pose: S(AP_CH) },
    { t: .82, pose: S({ ...ANTIC, RightUpLeg: [10, 0, -6], RightLeg: [20, 0, 0] }) },
    { t: .98, pose: S() }],
    events: [...phases(0, .3, .44, .66, .98), { time: .44, name: 'impact' }] },

  naeryeo: { keys: [
    { t: 0, pose: S() }, { t: .14, pose: S(ANTIC) },
    { t: .3, pose: S(NR_RISE) },
    { t: .42, pose: S(NR_UP) },
    { t: .52, ease: 'drop', pose: S(NR_HIT) },
    { t: .62, pose: S(NR_FALL) },
    { t: .74, pose: S(NR_LAND) },
    { t: .86, pose: S(NR_LAND) }, { t: 1.08, pose: S() }],
    events: [...phases(0, .42, .52, .74, 1.08), { time: .52, name: 'impact' }] },

  yeop: { keys: [
    { t: 0, pose: S() }, { t: .14, pose: S(YP_ANT) },
    { t: .32, pose: S(YP_CH) },                       // 1) chamber (0–30%)
    { t: .48, pose: S(YP_PV) },                       // 2) the standing foot and the hips turn (30–45%)
    { t: .54, pose: S(YP_EXS) },                      // 3) the extension starts (45–52%)
    { t: .62, ease: 'snap', pose: S(YP_EX) },         // 4) the strike at belly height (52–60%)
    { t: .68, pose: S({ ...YP_EX, RightLeg: [30, 0, 0] }) },
    { t: .8, pose: S(YP_REC) },                       // 5) recoil (60–75%)
    { t: .94, pose: S({ ...YP_ANT, RightUpLeg: [14, 0, -6], RightLeg: [22, 0, 0] }) },
    { t: 1.1, pose: S() }],                           // 6) down to the stance (75–100%)
    events: [...phases(0, .48, .62, .8, 1.1), { time: .62, name: 'impact' }] },

  'ap-ollyeo': { keys: [
    { t: 0, pose: S() }, { t: .12, pose: S(ANTIC) },
    { t: .28, pose: S(AO_UP) },
    { t: .42, ease: 'snap', pose: S(AO_TOP) },
    { t: .62, ease: 'drop', pose: S({ ...AO_UP, RightUpLeg: [-40, 0, -4], Spine: [2, 4, 0] }) },
    { t: .9, pose: S() }],
    events: [...phases(0, .28, .42, .62, .9), { time: .42, name: 'impact' }] },

  mireo: { keys: [
    { t: 0, pose: S() }, { t: .14, pose: S(ANTIC) },
    { t: .34, pose: S(MR_CH) },
    { t: .5, ease: 'snap', pose: S(MR_EX) },
    { t: .6, pose: S(MR_EX) },
    { t: .8, pose: S(MR_CH) },
    { t: 1.05, pose: S() }],
    events: [...phases(0, .34, .5, .8, 1.05), { time: .5, name: 'impact' }] },

  hit: { keys: [
    { t: 0, pose: S() }, { t: .07, ease: 'snap', pose: S(HIT) },
    { t: .5, pose: S({ ...HIT, Spine: [20, 4, 0], Spine1: [14, 6, 0] }) }, { t: .9, pose: S() }] },

  win: { keys: [
    { t: 0, pose: S() }, { t: .18, ease: 'snap', pose: S(STAND_WIN) },
    { t: .9, pose: S({ ...STAND_WIN, Hips: [0, -6, 0], Spine: [-8, 0, 0], RightArm: [-162, 0, -30], RightForeArm: [-34, 0, 0], Head: [-12, 0, 0] }) },
    { t: 1.6, pose: S(STAND_WIN) }, { t: 1.8, pose: S() }] },

  // v45 — sparring footwork: a light, springy bounce on the balls of the feet, guard up
  bounce: { loop: true, keys: [
    { t: 0, pose: S({ ...GUARD, LeftUpLeg: [-26, 0, 6], LeftLeg: [24, 0, 0], LeftFoot: [4, 0, 0], RightUpLeg: [9.5, 0, -6], RightLeg: [24, 0, 0], RightFoot: [-20.5, 0, 0], Spine1: [3, 10, 0], Ponytail: [10, 0, 0] }) },
    { t: .29, pose: S({ ...GUARD, LeftUpLeg: [-19, 0, 6], LeftLeg: [10, 0, 0], LeftFoot: [18, 0, 0], RightUpLeg: [12.5, 0, -6], RightLeg: [14, 0, 0], RightFoot: [-9, 0, 0], LeftForeArm: [-130, 0, 0], RightForeArm: [-136, 0, 0], Ponytail: [18, 0, 0] }) },
    { t: .58, pose: S({ ...GUARD, LeftUpLeg: [-26, 0, 6], LeftLeg: [24, 0, 0], LeftFoot: [4, 0, 0], RightUpLeg: [9.5, 0, -6], RightLeg: [24, 0, 0], RightFoot: [-20.5, 0, 0], Spine1: [3, 10, 0], Ponytail: [10, 0, 0] }) }] },
  // v45 — a kick to the head: the head snaps back, the body leans away, arms fly up
  hit_head: { keys: [
    { t: 0, pose: S() },
    { t: .06, ease: 'snap', pose: S(HIT_HEAD) },
    { t: .42, pose: S({ ...HIT_HEAD, Neck: [-8, 0, 0], Head: [-12, 8, 0], Spine: [-10, 4, 0] }) },
    { t: .9, pose: S() }] },

  walk: { loop: true, anchor: 'none', keys: [
    { t: 0, ease: 'lin', pose: WALK_A }, { t: .25, ease: 'lin', pose: WALK_PASS(0) },
    { t: .5, ease: 'lin', pose: WALK_B }, { t: .75, ease: 'lin', pose: WALK_PASS(1) }, { t: 1, ease: 'lin', pose: WALK_A }] },

  // gyeongnye: feet together, hands flat at the sides, a calm 30-degree bow from the hips
  bow: { anchor: 'none', keys: [
    { t: 0, pose: ATTN }, { t: .45, pose: ATTN },
    { t: 1.05, pose: { ...ATTN, Spine: [32, 0, 0], Spine1: [6, 0, 0], Neck: [6, 0, 0], Head: [10, 0, 0] } },
    { t: 1.75, pose: { ...ATTN, Spine: [32, 0, 0], Spine1: [6, 0, 0], Neck: [6, 0, 0], Head: [10, 0, 0] } },
    { t: 2.35, pose: ATTN }, { t: 2.8, pose: ATTN }] },
  // standing with arms crossed, the way Coach Yang waits on the side of the mat
  coach_idle: { loop: true, anchor: 'none', keys: [
    { t: 0, pose: CROSSED }, { t: 1.6, pose: { ...CROSSED, Spine1: [-2, 0, 0], Head: [-4, 4, 0] } }, { t: 3.2, pose: CROSSED }] },

  // Error Hunt: the front kick at full extension with ONE deliberate mistake each
  'err-ok':   { keys: [{ t: 0, pose: S(AP_EX) }, { t: .1, pose: S(AP_EX) }] },
  'err-head': { keys: [{ t: 0, pose: S({ ...AP_EX, Neck: [24, 2, 0], Head: [44, 0, 0] }) }, { t: .1, pose: S({ ...AP_EX, Neck: [24, 2, 0], Head: [44, 0, 0] }) }] },
  // (built on the real strike: the thigh stays where it was, only the knee is left bent)
  'err-knee': { keys: [{ t: 0, pose: S(ERR_KNEE) }, { t: .1, pose: S(ERR_KNEE) }] },
  'err-lean': { keys: [{ t: 0, pose: S({ ...AP_EX, Spine: [-40, 4, 0], Spine1: [-12, 6, 0], Head: [30, 8, 0] }) }, { t: .1, pose: S({ ...AP_EX, Spine: [-40, 4, 0], Spine1: [-12, 6, 0], Head: [30, 8, 0] }) }] },
  'err-heel': { keys: [{ t: 0, pose: S(ERR_HEEL) }, { t: .1, pose: S(ERR_HEEL) }] },
};

// v55 — Mistake Hunter for all three kicks: each pose is the kick's correct key moment
// with exactly ONE thing done wrong; 'ok' (and 'ok-hit') are the matching correct poses
// that the game shows as a green ghost once the child has found the mistake.
const DROP = { LeftArm: [8, 0, 14], LeftForeArm: [-22, 0, 0], RightArm: [10, 0, -14], RightForeArm: [-26, 0, 0] };
const ERRS = {
  apchagi: {
    ok: AP_EX,
    head: { ...AP_EX, Neck: [24, 2, 0], Head: [44, 0, 0] },                       // looks down at the own foot
    knee: ERR_KNEE,                                                               // the knee never straightens
    lean: { ...AP_EX, Spine: [-40, 4, 0], Spine1: [-12, 6, 0], Head: [30, 8, 0] }, // falls back
    heel: ERR_HEEL,                                                               // standing heel up at impact
    guard: { ...AP_EX, ...DROP },                                                 // hands dropped
    pivot: { ...AP_EX, LeftUpLeg: [-3, -56, 1] },                                 // standing foot never turned
    low: { ...AP_EX, RightUpLeg: [-62, 0, 10] },                                  // kicks the knee, not body / face
  },
  narochagi: {
    ok: NR_UP,
    knee: { ...NR_UP, RightUpLeg: [-128, 25, -1], RightLeg: [68, 0, 0], RightFoot: [10, 0, 0] },   // bent knee on the way up
    lean: { ...NR_UP, Spine: [-44, 11, 0], Spine1: [-10, -6, 0], Head: [30, 4, 0] },              // leans far back → falls
    guard: { ...NR_UP, ...DROP },
    pivot: { ...NR_UP, LeftUpLeg: [-2, 95, -6] },                                                  // over-turned (only 0–45°)
    head: { ...NR_UP, Neck: [26, 8, -2], Head: [46, 4, 0] },                                       // eyes on the floor
    'ok-hit': NR_HIT,
    toes: { ...NR_HIT, RightFoot: [48, 0, 0], RightToeBase: [0, 0, 0] },                          // lands with the toes, not the heel
  },
  bakchagi3: {
    ok: YP_EX,
    pivot: { ...YP_EX, LeftFoot: [2, -105, 5] },                                 // standing foot never turned round
    knee: { ...YP_EX, RightLeg: [72, 0, 0] },                                    // the leg never straightens
    foot: { ...YP_EX, RightFoot: [-30, 0, 0], RightToeBase: [-30, 0, 0] },       // v59.7: foot flexed — the heel leads, not the instep
    guard: { ...YP_EX, ...DROP },
    head: { ...YP_EX, Neck: [0, 8, 10], Head: [30, 24, 12] },                    // looks away from the target
    lean: { ...YP_EX, Spine: [62, -16, -9], Spine1: [12, -14, 10] },             // folds at the waist, far past 20°
  },
};
for (const [kick, set] of Object.entries(ERRS)) for (const [id, pose] of Object.entries(set)) {
  ANIMS[`err-${kick}-${id}`] = { keys: [{ t: 0, pose: S(pose) }, { t: .1, pose: S(pose) }] };
}
