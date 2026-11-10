// =====================================================================
// «جرّب بنفسك» — the club's computer-vision kick analyzers, ported line by line from their
// Python (Streamlit + MediaPipe) apps: AP CHAGI (analyzer v14) and NAERYO CHAGI.
// Pure JavaScript, no DOM in here: the same numbers in → the same score out as the Python
// (checked by scratch tests that run the Python analyzer on the same measurements).
// BIK CHAGI has no Python: it is built here on the Ap Chagi machine (the same five steps, the
// same limits) plus what makes it Bik Chagi — the standing foot turns (the heel to the target).
// What a frame is: m = { t, R: leg, L: leg, lean, fist, guard_fist, hands_n }
//                  leg = { knee, thigh, shin, hip, height, lift, grounded, guard, footx, reach }
// =====================================================================
(function (root) {
  'use strict';

  // ---- shared constants (the same in both Python apps)
  const VIS_MIN = 0.3;            // minimum landmark visibility to trust a frame
  const GUARD_LINE = 0.5;         // a hand is 'up' above this share of the way from the shoulders to the hips
  const HAND_NEAR = 0.4;          // a detected hand is the student's only within this many torso lengths of his wrist
  const THIGH_START = 25.0;       // the kick starts when the thigh is > 25° from vertical (and the foot is lifted)
  const STANCE_MAX_THIGH = 80.0;
  const KICK_MIN_THIGH = 45.0;    // a leg that went up this high (and was put down) is a real kick
  const FOOT_DOWN = 0.15;         // a foot is 'down' less than this many leg-lengths above the other ankle
  const MAX_KICK_SECONDS = 20.0;
  const GUARD_PTS = 5, STANCE_PTS = 5;
  const GUARD_STRICT = 0.88, GUARD_MIN_SEEN = 0.25, GUARD_MIN_FRAMES = 5, HAND_SMOOTH = 5;
  const KEYS = ['knee', 'thigh', 'shin', 'hip', 'height', 'lean'];

  // ---- per kick
  const KICKS = {
    apchagi: {
      version: 14, SNAP: true,
      EXT_RISE: 20.0,           // knee opening this much above its minimum = snap started
      RETR_DROP: 15.0,          // knee closing this much below its maximum = retraction started
      CHAMBER_FOLD: 160.0,      // chamber = the lifted knee went below this angle (any bend counts)
      RETRACT_FOLD: 150.0,      // retract = after the peak the knee must bend back below this angle
      CHAMBER_PTS: 26,
      CHAMBER_VALID_MAX: 120.0,
      OPEN_UP: ['p_knee', 'r_knee', 'support'],
      REFERENCE: { p_knee: [100, 180], r_knee: [30, 180], support: [164, 180] },
      WEIGHTS: [['p_knee', 'Peak', 24, 30], ['r_knee', 'Retract', 24, 30], ['support', 'Support leg', 16, 40]],
      GROUP_ORDER: ['Chamber', 'Peak', 'Retract', 'Support leg', 'Guard & fist']
    },
    narochagi: {
      version: 14,
      STRAIGHT_KNEE: 145.0,     // while the leg is lifted the knee must stay at this angle or more
      BEND_MIN_FRAMES: 3,
      LIFT_REPEAT_DROP: 25.0,   // the leg coming down this much and going up again = a second lift
      PEN_BEND_BEFORE: 30, PEN_BEND_AFTER: 30, PEN_NO_EXTEND: 30, PEN_EXTRA_MOVE: 30,
      OPEN_UP: ['p_knee', 'support'],
      REFERENCE: { p_knee: [100, 180], support: [164, 180] },
      WEIGHTS: [['p_knee', 'Peak', 54, 30], ['support', 'Support leg', 36, 40]],
      GROUP_ORDER: ['Peak', 'Support leg', 'Guard & fist']
    },
    // Bik Chagi (the roundhouse): the Ap Chagi steps and limits, the points shared with one more
    // check — the standing foot must turn. Not from the club's Python (they wrote none for it).
    bakchagi3: {
      version: 1, SNAP: true,
      EXT_RISE: 20.0, RETR_DROP: 15.0, CHAMBER_FOLD: 160.0, RETRACT_FOLD: 150.0,
      CHAMBER_PTS: 22,
      CHAMBER_VALID_MAX: 120.0,
      // the whip is fast: in a blurred picture the tracker loses the leg and shows both feet down
      // for a moment. The foot has landed only when it stays down this long (seconds).
      LAND_HOLD: 0.45,
      FOOT_RATIO: 0.2,          // a foot seen from the side (heel → toes) is about this share of the leg length
      OPEN_UP: ['p_knee', 'r_knee', 'support', 'pivot'],
      // pivot = how far the standing foot has turned away from the target at the extension, in degrees:
      // 0 = the toes still point at the target, 90 = across, 180 = the heel points at the target.
      // Taught: about 135. Asked for: 110 or more (a front kick's small turn, about 85 on the club's own
      // Ap Chagi video, is not enough); the points fade out down to 70.
      REFERENCE: { p_knee: [100, 180], r_knee: [30, 180], support: [164, 180], pivot: [110, 180] },
      WEIGHTS: [['pivot', 'Pivot', 14, 40], ['p_knee', 'Peak', 22, 30], ['r_knee', 'Retract', 20, 30], ['support', 'Support leg', 12, 40]],
      GROUP_ORDER: ['Chamber', 'Pivot', 'Peak', 'Retract', 'Support leg', 'Guard & fist']
    }
  };
  // the steps as the club names them on screen
  const GROUP_TITLES = {
    'Chamber': { ar: 'رفع الركبة', en: 'Knee lift' },
    'Pivot': { ar: 'لفّ قدم الارتكاز', en: 'Turning the standing foot' },
    'Peak': { ar: 'مد الرجل للهدف', en: 'Extending to the target' },
    'Retract': { ar: 'سحب الرجل', en: 'Pulling the leg back' },
    'Support leg': { ar: 'العودة لوضع الاستعداد', en: 'Back to the ready stance' },
    'Guard & fist': { ar: 'وضع الاستعداد', en: 'Ready stance' }
  };

  // ---- maths (numpy's behaviour)
  const clamp01 = (x) => Math.max(0.0, Math.min(1.0, x));
  function rangeCloseness(v, lo, hi, tol) {
    if (lo <= v && v <= hi) return 1.0;
    const d = v < lo ? lo - v : v - hi;
    return clamp01(1 - d / tol);
  }
  const gradeLabel = (s) => (s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 60 ? 'Fair' : 'Needs work');
  function calculateAngle(a, b, c) {
    const rad = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    const ang = Math.abs(rad * 180 / Math.PI);
    return ang > 180.0 ? 360 - ang : ang;
  }
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  // angle between p_from→p_to and straight DOWN (0 = hanging down, 90 = horizontal, >90 = pointing up)
  function angleFromDown(pFrom, pTo) {
    const vx = pTo[0] - pFrom[0], vy = pTo[1] - pFrom[1], n = Math.hypot(vx, vy);
    if (n < 1e-6) return 0.0;
    return Math.acos(Math.max(-1.0, Math.min(1.0, vy / n))) * 180 / Math.PI;
  }
  function median(vals) {
    const a = vals.slice().sort((x, y) => x - y), n = a.length;
    return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
  }
  const med = (vals) => { const v = vals.filter(x => x !== null && x !== undefined); return v.length ? median(v) : null; };
  const windowMedian = (frames, idx, key, half) => med(frames.slice(Math.max(0, idx - half), idx + half + 1).map(f => f[key]));
  // median of the last n values per key (kills single-frame spikes without flattening peaks)
  class Smoother {
    constructor(n = 3) { this.n = n; this.buf = {}; }
    push(key, v) {
      const d = this.buf[key] || (this.buf[key] = []);
      d.push(+v); if (d.length > this.n) d.shift();
      return median(d);
    }
  }
  const argmin = (a) => { let k = 0; for (let i = 1; i < a.length; i++) if (a[i] < a[k]) k = i; return k; };
  const argmaxBy = (idx, f) => { let best = idx[0]; for (const j of idx) if (f(j) > f(best)) best = j; return best; };   // first maximum, like Python's max()
  const pct = (x, n) => (n ? 100.0 * x / n : 0.0);

  // ---- score items
  function rangeItem(K, key, group, pts, tol, value, lo, hi, missing) {
    if (tol === null) tol = lo > 0 ? lo : 1.0;
    const base = { key, group, max: pts, lo, hi, openUp: K.OPEN_UP.includes(key) };
    if (value === null || value === undefined) return Object.assign(base, { got: 0.0, lost: pts, value: null, status: missing ? 'not_reached' : 'not_measured' });
    let d = 0.0, side = '';
    if (value < lo) { d = lo - value; side = 'low'; } else if (value > hi) { d = value - hi; side = 'high'; }
    const got = pts * clamp01(1 - d / tol);
    return Object.assign(base, { got, lost: pts - got, value, d, status: d <= 0 ? 'ok' : side });
  }
  function stanceItem(stanceOk) {
    const got = stanceOk ? STANCE_PTS : 0.0;
    return { key: 'stance', group: 'Guard & fist', max: STANCE_PTS, got, lost: STANCE_PTS - got, status: stanceOk ? 'ok' : 'no_stance' };
  }
  // STRICT but fair: in the frames where the camera SEES the hand it must be above the chest AND closed;
  // unseen frames are neutral, but the hand must be seen in at least GUARD_MIN_SEEN of the movement
  function guardItem(h) {
    const n = h.total, cnt = h.cnt, seen = cnt.ok + cnt.open + cnt.low;
    const ratio = seen ? cnt.ok / seen : 0.0, cover = n ? seen / n : 0.0;
    const enough = n >= GUARD_MIN_FRAMES && seen >= GUARD_MIN_FRAMES && cover >= GUARD_MIN_SEEN;
    const passed = enough && ratio >= GUARD_STRICT;
    const got = passed ? GUARD_PTS : 0.0;
    let status = 'ok', main = null;
    if (!passed) {
      if (n < GUARD_MIN_FRAMES) status = 'too_short';
      else if (!enough) status = 'not_seen';
      else { status = 'broken'; main = cnt.open >= cnt.low ? (cnt.open ? 'open' : null) : 'low'; if (cnt.low > cnt.open) main = 'low'; }
    }
    return { key: 'guard', group: 'Guard & fist', max: GUARD_PTS, got, lost: GUARD_PTS - got, status, ratio, cover, main,
      openPct: pct(cnt.open, seen), lowPct: pct(cnt.low, seen), failT: h.fail_t };
  }

  // =====================================================================
  // The phase machine for one kick.
  //   Ap Chagi : P0 stance → P1/P2 chamber → P3/P4 snap + impact → P5–P7 retract, landing
  //   Naeryo   : P0 stance → P1 lift and extend the leg (peak) → landing
  //   Bik Chagi: the Ap Chagi machine (K.SNAP), a landing that must last (K.LAND_HOLD), and the pivot
  // Nothing is scored in update(): the score is calculated by finalizeNow().
  // =====================================================================
  class KickAnalyzer {
    constructor(kick = 'apchagi', flex = 0) {
      this.kick = KICKS[kick] ? kick : 'apchagi';
      this.K = KICKS[this.kick];
      this.flex = flex;            // degrees taken off every minimum (0 = the limit is the limit)
      this.p = this.K.REFERENCE;
      this.reset();
    }
    reset() {
      this.phase = 'P0'; this.armed = false; this.side = null;
      this.rise = []; this.snap = []; this.post = [];
      this.kick_n = 0; this.support_sum = 0.0;
      this.stance_seen = false; this.frames_seen = 0;
      this.h_total = 0; this.h_cnt = { ok: 0, nohand: 0, open: 0, low: 0 };
      this.h_t0 = null; this.h_fail_t = null; this.h_last = null; this.h_win = [];
      this.landed = false; this.t_land = null; this.last_t = 0.0;
      this.t_start = this.t_chamber = this.t_peak = null;
      this.chamber_ok = false; this.chamber = {}; this.peak = {};
      this.bent_run = 0; this.live_warn = false;
      this.down_t = null;
      this.trace = []; this.final = null; this.note = '';
    }
    // what to tell the child right now
    hint() {
      if (this.landed) return 'done';
      if (this.phase === 'P0') return this.armed ? 'ready' : 'stand';
      if (!this.K.SNAP) return 'lift_extend';
      if (this.phase === 'P1') return 'chamber';
      if (this.phase === 'P3') return 'snap';
      return 'retract';
    }
    // 'ok' = a CLOSED hand above the chest; otherwise why not: 'nohand' / 'open' / 'low'
    static handState(m) {
      const R = m.R, L = m.L;
      if (m.guard_fist || (m.fist && (R.guard || L.guard))) return 'ok';
      const hn = m.hands_n !== undefined && m.hands_n !== null ? m.hands_n : (m.fist ? 1 : 0);
      if (!hn) return 'nohand';
      if (!m.fist) return 'open';
      return 'low';
    }
    _trackHand(m, t) {
      if (!(this.armed || this.phase !== 'P0')) return;      // the movement has not started yet
      const raw = KickAnalyzer.handState(m);
      let st;
      if (raw === 'nohand') st = 'nohand';                    // not seen: neutral, and not in the smoothing window
      else {
        this.h_win.push(raw); if (this.h_win.length > HAND_SMOOTH) this.h_win.shift();
        const oks = this.h_win.filter(x => x === 'ok').length;
        if (oks * 2 >= this.h_win.length) st = 'ok';          // at least half of the recent seen frames were fine
        else {
          const bads = this.h_win.filter(x => x !== 'ok');
          const o = bads.filter(x => x === 'open').length, l = bads.length - o;
          st = l > o ? 'low' : 'open';
        }
      }
      this.h_last = st;
      if (this.h_total === 0) this.h_t0 = t;
      this.h_total += 1;
      this.h_cnt[st] += 1;
      if ((st === 'open' || st === 'low') && this.h_fail_t === null) this.h_fail_t = t - this.h_t0;
    }
    handRatio() { const s = this.h_cnt.ok + this.h_cnt.open + this.h_cnt.low; return s ? this.h_cnt.ok / s : 0.0; }
    handCover() { const s = this.h_cnt.ok + this.h_cnt.open + this.h_cnt.low; return this.h_total ? s / this.h_total : 0.0; }
    _softReset(note) { this.reset(); this.note = note; }

    update(m) {
      if (this.final !== null || this.landed) return;
      const K = this.K, t = m.t;
      this.last_t = t;
      const R = m.R, L = m.L;

      if (this.phase === 'P0') {
        this.frames_seen += 1;
        if (!this.armed) this.armed = true;                   // the ready stance is NOT checked: it counts right away
        const tk = R.thigh >= L.thigh ? 'R' : 'L', lk = m[tk];
        // the kick starts when the thigh is up AND the foot has left the ground (or the thigh is clearly above a stance)
        if (!(lk.thigh > THIGH_START && (!lk.grounded || lk.thigh > STANCE_MAX_THIGH))) { this._trackHand(m, t); return; }
        this.side = tk; this.phase = 'P1'; this.t_start = t; this.note = ''; this.stance_seen = this.armed;
      }

      this._trackHand(m, t);                                  // every frame from the stance until landing
      const leg = m[this.side], other = m[this.side === 'R' ? 'L' : 'R'];
      const rec = { t, knee: leg.knee, thigh: leg.thigh, shin: leg.shin, hip: leg.hip, height: leg.height, lean: m.lean, grounded: leg.grounded, support: other.knee };
      if (K.LAND_HOLD) {
        // how far the standing foot points along the kick (+ = the toes at the target, − = the heel at the target)
        const fx = other.footx, rc = leg.reach;
        rec.pivot = fx === null || fx === undefined || !rc ? null : fx * Math.sign(rc);
        if (leg.grounded && leg.thigh < 40) {
          // the foot looks down: a landing only if it stays down; otherwise the tracker lost a fast leg
          if (this.down_t === null) this.down_t = t;
          if (t - this.down_t < K.LAND_HOLD) return;
        } else this.down_t = null;
      }
      this.kick_n += 1;
      this.support_sum += other.knee;
      this.trace.push({ t: t - this.t_start, knee: leg.knee, thigh: leg.thigh, support: other.knee, phase: this.phase });

      if (t - this.t_start > MAX_KICK_SECONDS) { this._softReset('too_long'); return; }

      if (!K.SNAP) {
        // ---------------- P1: lift and extend the leg, until the foot lands ----------------
        if (this.phase === 'P1') {
          this.rise.push(rec);
          if (!leg.grounded && leg.thigh > THIGH_START && leg.knee < K.STRAIGHT_KNEE - this.flex) this.bent_run += 1; else this.bent_run = 0;
          this.live_warn = this.bent_run >= K.BEND_MIN_FRAMES;
          if (leg.grounded && leg.thigh < 40) {
            // the foot is back on the ground: a real kick if the leg really went up, otherwise a false start
            const nUp = this.rise.filter(f => !f.grounded).length, top = Math.max(...this.rise.map(f => f.thigh));
            if (nUp >= 3 && top >= KICK_MIN_THIGH) { this.snap = this.rise.slice(); this._closePeak(); this._markLanded(t); return; }
            if (leg.thigh < 15) { this._softReset('down_early'); return; }
          }
        }
        return;
      }

      // ---------------- Ap Chagi · P1/P2: raise the knee and fold it ----------------
      if (this.phase === 'P1') {
        this.rise.push(rec);
        if (leg.grounded && leg.thigh < 40) {
          // the foot is back on the ground. A leg that really went up but was never folded is still a kick:
          // only the Chamber points are lost. Otherwise it was a false start.
          const nUp = this.rise.filter(f => !f.grounded).length, top = Math.max(...this.rise.map(f => f.thigh));
          if (nUp >= 3 && top >= KICK_MIN_THIGH) { this._closeNoChamber(); this._closePeak(); this.phase = 'P5'; this._markLanded(t); return; }
          if (leg.thigh < 15) { this._softReset('down_early'); return; }
        }
        const n = this.rise.length, ks = this.rise.map(f => f.knee), iMin = argmin(ks);
        if (n >= 3 && rec.knee >= ks[iMin] + K.EXT_RISE && iMin < n - 1) this._closeChamber(iMin);
        return;
      }
      // ---------------- P3/P4: snap to the peak ----------------
      if (this.phase === 'P3') {
        this.snap.push(rec);
        const ks = this.snap.map(f => f.knee), kmax = Math.max(...ks);
        if (ks.length >= 3 && kmax >= this.p.p_knee[0] && rec.knee <= kmax - K.RETR_DROP) { this._closePeak(); this.phase = 'P5'; }
        else if (leg.grounded && leg.thigh < 40) { this._closePeak(); this._markLanded(t); }
        return;
      }
      // ---------------- P5–P7: retract, hold, land ----------------
      if (this.phase === 'P5') {
        this.post.push(rec);
        const landed = leg.grounded && leg.thigh < 40 && this.post.length >= 3;
        if (landed || t - this.t_peak > 4.0) this._markLanded(t);
      }
    }
    // Chamber = the leg was folded while lifted, before the extension (knee only, any angle below CHAMBER_FOLD)
    _closeChamber(iMin) {
      const lifted = this.rise.filter(f => !f.grounded).map(f => f.knee);
      this.chamber_ok = lifted.length > 0 && Math.min(...lifted) <= this.K.CHAMBER_FOLD;
      this.t_chamber = this.rise[iMin].t;
      this.chamber = {}; for (const k of KEYS) this.chamber[k] = windowMedian(this.rise, iMin, k, 2);
      this.chamber.knee = lifted.length ? Math.min(...lifted) : null;
      this.snap = this.rise.slice(iMin);
      this.phase = 'P3';
    }
    // the leg went up but was never folded: the kick is still analysed, only the Chamber points are lost
    _closeNoChamber() {
      this.chamber_ok = false; this.t_chamber = this.rise[0].t; this.chamber = {};
      this.snap = this.rise.slice(); this.phase = 'P3';
    }
    // with LAND_HOLD the foot came down when it first touched, not when the wait was over
    _markLanded(t) { this.landed = true; this.t_land = this.K.LAND_HOLD && this.down_t !== null ? this.down_t : t; }
    _closePeak() {
      const ks = this.snap.map(f => f.knee), tmax = Math.max(...this.snap.map(f => f.thigh));
      // the extension happens while the leg is up: straightening again on the way down (landing) is not a kick
      let cand = []; this.snap.forEach((f, j) => { if (f.thigh >= tmax - 40 && !(f.grounded && f.thigh < 40)) cand.push(j); });
      if (!cand.length) cand = ks.map((_, j) => j);
      const i = argmaxBy(cand, j => ks[j]);
      this.peak = {}; for (const k of KEYS) this.peak[k] = windowMedian(this.snap, i, k, 1);
      this.peak.knee = ks[i];
      this.t_peak = this.snap[i].t;
      if (this.K.SNAP) this.post = this.snap.slice(i);
      if (this.K.LAND_HOLD) this.peak.pivot = windowMedian(this.snap, i, 'pivot', 2);
    }
    // the standing foot's turn, in degrees (null = the foot was not seen): from the extension on, for as
    // long as the leg is still up (the foot finishes its turn in the whip and keeps it through the pull-back)
    _pivotAngle() {
      const top = this.post.length ? Math.max(...this.post.map(f => f.thigh)) : 0;
      const up = this.post.filter(f => f.thigh >= top - 40 && !(f.grounded && f.thigh < 40)).map(f => f.pivot).filter(x => x !== null && x !== undefined);
      const v = up.length >= 3 ? median(up) : this.peak.pivot;
      if (v === null || v === undefined) return null;
      return Math.acos(Math.max(-1.0, Math.min(1.0, v / this.K.FOOT_RATIO))) * 180 / Math.PI;
    }
    // how many separate lifts the leg made (Naeryo)
    _liftCount() {
      const vals = this.snap.map(f => f.thigh), D = this.K.LIFT_REPEAT_DROP;
      if (!vals.length) return 0;
      let peaks = 0, mode = 'low', lo = vals[0], hi = vals[0];
      for (const v of vals) {
        if (mode === 'low') { lo = Math.min(lo, v); if (v - lo >= D) { mode = 'high'; hi = v; } }
        else { hi = Math.max(hi, v); if (hi - v >= D) { mode = 'low'; lo = v; peaks += 1; } }
      }
      return peaks + (mode === 'high' ? 1 : 0);
    }
    // Naeryo = ONLY: ready stance → a straight leg goes up → it comes down. Anything else is a penalty.
    _movementCheck() {
      const K = this.K, fr = this.snap, lim = K.STRAIGHT_KNEE - this.flex, pens = [];
      const lifted = []; fr.forEach((f, j) => { if (!f.grounded && f.thigh > THIGH_START) lifted.push(j); });
      const longestRun = (js) => { let best = 0, cur = 0, prev = null; for (const j of js) { cur = prev !== null && j === prev + 1 ? cur + 1 : 1; best = Math.max(best, cur); prev = j; } return best; };
      const straight = lifted.filter(j => fr[j].knee >= lim);
      if (lifted.length && !straight.length) pens.push({ key: 'no_extend', points: K.PEN_NO_EXTEND, lim });
      else if (straight.length) {
        const first = straight[0], last = straight[straight.length - 1];
        const iTop = argmaxBy(fr.map((_, j) => j), j => fr[j].thigh);
        const bent = lifted.filter(j => fr[j].knee < lim);
        const before = bent.filter(j => j < first || (j < last && j < iTop));
        const after = bent.filter(j => j > last || (j < last && j >= iTop));
        if (longestRun(before) >= K.BEND_MIN_FRAMES) pens.push({ key: 'bend_before', points: K.PEN_BEND_BEFORE, lim });
        if (longestRun(after) >= K.BEND_MIN_FRAMES) pens.push({ key: 'bend_after', points: K.PEN_BEND_AFTER, lim });
      }
      if (this._liftCount() >= 2) pens.push({ key: 'extra_move', points: K.PEN_EXTRA_MOVE, lim });
      return pens;
    }
    // the button "Calculate score": returns { ok, reason }
    finalizeNow() {
      if (this.final !== null) return { ok: true };
      if (this.phase === 'P0') return { ok: false, reason: this.armed ? 'not_started' : 'no_stance' };
      if (this.phase === 'P1') {
        if (!this.rise.length) return { ok: false, reason: 'no_data' };
        if (!this.K.SNAP) { if (!Object.keys(this.peak).length) { this.snap = this.rise.slice(); this._closePeak(); } }
        else {
          const lifted = this.rise.filter(f => !f.grounded).map(f => f.knee);
          if (lifted.length && Math.min(...lifted) <= this.K.CHAMBER_FOLD) this._closeChamber(argmin(this.rise.map(f => f.knee)));
          else this._closeNoChamber();
        }
      }
      if (this.K.SNAP && this.phase === 'P3') { if (this.snap.length) this._closePeak(); this.phase = 'P5'; }
      this._finalize(this.t_land !== null ? this.t_land : this.last_t);
      return { ok: true };
    }
    _finalize(tEnd) {
      const K = this.K, p = this.p, n = Math.max(this.kick_n, 1), pk = this.peak, flex = this.flex, hasPeak = Object.keys(pk).length > 0;
      const items = [];
      let rKnee = null;
      if (K.SNAP) {
        const series = this.post.slice(1).map(f => f.knee);
        if (series.length >= 3) { rKnee = Infinity; for (let i = 0; i + 2 < series.length; i++) rKnee = Math.min(rKnee, median(series.slice(i, i + 3))); }
        else if (series.length) rKnee = Math.min(...series);
        const ch = this.chamber_ok;
        items.push({ key: 'c_knee', group: 'Chamber', max: K.CHAMBER_PTS, got: ch ? K.CHAMBER_PTS : 0.0, lost: ch ? 0.0 : K.CHAMBER_PTS,
          value: ch ? this.chamber.knee : null, status: ch ? 'ok' : 'not_folded' });
      }
      const vals = { p_knee: hasPeak ? pk.knee : null, r_knee: rKnee, support: this.support_sum / n, pivot: hasPeak && K.LAND_HOLD ? this._pivotAngle() : null };
      for (const [key, group, pts, tol0] of K.WEIGHTS) {
        let [lo, hi] = p[key]; lo = lo - flex; if (!K.OPEN_UP.includes(key)) hi = hi + flex;
        const tol = tol0 === null ? null : tol0 * (1 + flex / 30.0);       // the points also fade out more slowly
        const missing = ((key.startsWith('p_') || key === 'pivot') && !hasPeak) || (key === 'r_knee' && rKnee === null);
        if (key === 'r_knee' && rKnee !== null && rKnee > K.RETRACT_FOLD) {
          // the leg came down still straight: there was no retraction at all
          items.push({ key, group, max: pts, got: 0.0, lost: pts, value: rKnee, lo, hi, status: 'no_retract' });
          continue;
        }
        items.push(rangeItem(K, key, group, pts, tol, vals[key], lo, hi, missing));
      }
      items.push(stanceItem(this.armed));
      items.push(guardItem({ total: this.h_total, cnt: Object.assign({}, this.h_cnt), fail_t: this.h_fail_t }));

      const base = items.reduce((a, i) => a + i.got, 0);
      const pens = K.SNAP ? [] : this._movementCheck();
      const total = Math.max(0.0, base - pens.reduce((a, x) => a + x.points, 0));
      const groups = K.GROUP_ORDER.map(g => { const gi = items.filter(i => i.group === g);
        return { id: g, name: GROUP_TITLES[g], got: gi.reduce((a, i) => a + i.got, 0), max: gi.reduce((a, i) => a + i.max, 0), ok: gi.length > 0 && gi.every(i => i.lost < 0.5), items: gi }; });
      const biggest = items[argmaxBy(items.map((_, j) => j), j => items[j].lost)];
      const tC = this.t_chamber !== null ? this.t_chamber : tEnd, tP = this.t_peak !== null ? this.t_peak : tEnd;
      this.t_end = tEnd;
      this.final = { kick: this.kick, total, base, grade: gradeLabel(total), items, groups, biggest, penalties: pens, side: this.side, flex,
        trace: this.trace.slice(), marks: { chamber: tC - this.t_start, peak: tP - this.t_start, end: tEnd - this.t_start } };
    }
  }

  // ---- measurements from the landmarks (pixels)
  function buildLeg(hip, knee, ankle, shoulder, wrist, otherAnkle, midSh, legLen, sm, tag) {
    const raw = {
      knee: calculateAngle(hip, knee, ankle),
      thigh: angleFromDown(hip, knee),
      shin: angleFromDown(knee, ankle),
      hip: calculateAngle(midSh, hip, knee),
      height: (hip[1] - ankle[1]) / legLen,        // ankle above hip, in leg lengths
      lift: otherAnkle[1] - ankle[1]               // ankle above the other ankle (pixels)
    };
    const out = {};
    for (const k of Object.keys(raw)) out[k] = sm.push(tag + ':' + k, raw[k]);
    out.grounded = out.lift < FOOT_DOWN * legLen;
    const chestLevel = shoulder[1] + (hip[1] - shoulder[1]) * GUARD_LINE;
    out.guard = wrist[1] < chestLevel;
    return out;
  }
  // MediaPipe pose landmark numbers
  const PL = { L_SHOULDER: 11, R_SHOULDER: 12, L_WRIST: 15, R_WRIST: 16, L_HIP: 23, R_HIP: 24, L_KNEE: 25, R_KNEE: 26, L_ANKLE: 27, R_ANKLE: 28, L_HEEL: 29, R_HEEL: 30, L_FOOT: 31, R_FOOT: 32 };
  const NEEDED = [PL.R_HIP, PL.R_KNEE, PL.R_ANKLE, PL.R_SHOULDER, PL.L_HIP, PL.L_KNEE, PL.L_ANKLE, PL.L_SHOULDER];
  const poseOk = (lm) => NEEDED.every(i => (lm[i].visibility === undefined ? 1 : lm[i].visibility) > VIS_MIN);
  const FINGERS = [[5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]];   // MCP, PIP, DIP, TIP of index..pinky
  // Fist = at least 3 of the 4 fingers curled (thumb ignored); a finger is curled when 2 of 3 tests agree
  function checkFist(lm, w = 1, h = 1) {
    const hd = (i, j) => Math.hypot((lm[i].x - lm[j].x) * w, (lm[i].y - lm[j].y) * h);
    let closed = 0;
    for (const [mcp, pip, dip, tip] of FINGERS) {
      const dTip = hd(tip, 0), dPip = hd(pip, 0), dMcp = hd(mcp, 0);
      const length = hd(mcp, pip) + hd(pip, dip) + hd(dip, tip);
      const votes = (dTip < dPip ? 1 : 0) + (length > 0 && hd(tip, mcp) / length < 0.75 ? 1 : 0) + (dTip < dMcp * 1.4 ? 1 : 0);
      if (votes >= 2) closed += 1;
    }
    return closed >= 3;
  }
  // one frame → m (or null when the body is not seen well enough). lm = pose landmarks (normalised),
  // hands = list of hand-landmark lists (normalised), w/h = frame size in pixels, sm = Smoother(3)
  function measure(lm, hands, w, h, t, sm) {
    if (!lm || !poseOk(lm)) return null;
    const P = (i) => [lm[i].x * w, lm[i].y * h];
    const r = { HIP: P(PL.R_HIP), KNEE: P(PL.R_KNEE), ANKLE: P(PL.R_ANKLE), FOOT: P(PL.R_FOOT), SHOULDER: P(PL.R_SHOULDER), WRIST: P(PL.R_WRIST) };
    const l = { HIP: P(PL.L_HIP), KNEE: P(PL.L_KNEE), ANKLE: P(PL.L_ANKLE), FOOT: P(PL.L_FOOT), SHOULDER: P(PL.L_SHOULDER), WRIST: P(PL.L_WRIST) };
    const midSh = [(r.SHOULDER[0] + l.SHOULDER[0]) / 2, (r.SHOULDER[1] + l.SHOULDER[1]) / 2];
    const midHip = [(r.HIP[0] + l.HIP[0]) / 2, (r.HIP[1] + l.HIP[1]) / 2];
    const legLen = Math.max(dist(r.HIP, r.KNEE) + dist(r.KNEE, r.ANKLE), dist(l.HIP, l.KNEE) + dist(l.KNEE, l.ANKLE), 1.0);
    const mR = buildLeg(r.HIP, r.KNEE, r.ANKLE, r.SHOULDER, r.WRIST, l.ANKLE, midSh, legLen, sm, 'R');
    const mL = buildLeg(l.HIP, l.KNEE, l.ANKLE, l.SHOULDER, l.WRIST, r.ANKLE, midSh, legLen, sm, 'L');
    // Bik Chagi's pivot: each foot's direction (heel → toes) and each ankle's side of the other one,
    // in leg lengths, along the picture's width. Not in the club's Python; nothing above depends on it.
    const vis0 = (i) => (lm[i].visibility === undefined ? 1 : lm[i].visibility);
    const footx = (heel, toe, tag) => (vis0(heel) > VIS_MIN && vis0(toe) > VIS_MIN ? sm.push(tag + ':footx', (lm[toe].x - lm[heel].x) * w / legLen) : null);
    mR.footx = footx(PL.R_HEEL, PL.R_FOOT, 'R'); mL.footx = footx(PL.L_HEEL, PL.L_FOOT, 'L');
    mR.reach = sm.push('R:reach', (r.ANKLE[0] - l.ANKLE[0]) / legLen); mL.reach = -mR.reach;
    // torso lean: negative = leaning back (facing direction from the toes)
    const facing = ((r.FOOT[0] - r.ANKLE[0]) + (l.FOOT[0] - l.ANKLE[0])) >= 0 ? 1.0 : -1.0;
    const lean = sm.push('b:lean', Math.atan2((midSh[0] - midHip[0]) * facing, -(midSh[1] - midHip[1])) * 180 / Math.PI);
    // only hands that belong to THIS person: close to one of his own pose wrists
    const torso = Math.max(dist(midSh, midHip), 1.0);
    const vis = (i) => (lm[i].visibility === undefined ? 1 : lm[i].visibility);
    const anchors = []; if (vis(PL.R_WRIST) > 0.2) anchors.push(r.WRIST); if (vis(PL.L_WRIST) > 0.2) anchors.push(l.WRIST);
    let handsN = 0, fist = false; const closedYs = [], mine = [];
    for (const hl of hands || []) {
      const hx = hl[0].x * w, hy = hl[0].y * h;
      if (anchors.length && Math.min(...anchors.map(a => dist([hx, hy], a))) > HAND_NEAR * torso) continue;
      handsN += 1; mine.push(hl);
      if (checkFist(hl, w, h)) { fist = true; closedYs.push(hy); }
    }
    const chestY = midSh[1] + (midHip[1] - midSh[1]) * GUARD_LINE;
    return { t, R: mR, L: mL, lean, fist, guard_fist: closedYs.some(y => y < chestY), hands_n: handsN,
      _px: { r, l, midSh, midHip, legLen }, _hands: mine };
  }

  // ---- step-by-step mode (one step at a time, no score): returns { acc 0..1, ok, msg, seen }
  function stepCheck(kick, step, m, flex, state) {
    const K = KICKS[kick] || KICKS.apchagi, side = m.R.thigh >= m.L.thigh ? 'R' : 'L';
    const leg = m[side], knee = leg.knee, thigh = leg.thigh, kicking = !leg.grounded && thigh > THIGH_START, stol = flex;
    const kLo = K.REFERENCE.p_knee[0];
    if (K.LAND_HOLD && step === 2) {
      // Bik Chagi: extended AND the standing foot turned
      const o = m[side === 'R' ? 'L' : 'R'], pv = o.footx === null || o.footx === undefined || !leg.reach ? null
        : Math.acos(Math.max(-1.0, Math.min(1.0, o.footx * Math.sign(leg.reach) / K.FOOT_RATIO))) * 180 / Math.PI;
      // the leg must really be up (not the first moment the foot leaves the floor), in two pictures in a row
      const up = kicking && thigh >= KICK_MIN_THIGH;
      const pLo = K.REFERENCE.pivot[0], kOk = up && knee >= kLo - stol, pOk = pv !== null && pv >= pLo - stol;
      const kAcc = up ? clamp01((knee - 60) / (kLo - 60)) : 0.0, pAcc = up && pv !== null ? clamp01(pv / pLo) : 0.0;
      state.run = kOk && pOk ? (state.run || 0) + 1 : 0;
      return { acc: (kAcc + pAcc) / 2, ok: state.run >= 2, msg: kOk && !pOk ? 'pivot' : 'extend', lim: kLo, pivot: pv };
    }
    if (!K.SNAP || step === 2) {
      return { acc: kicking ? clamp01((knee - 60) / (kLo - 60)) : 0.0, ok: kicking && knee >= kLo - stol, msg: 'extend', lim: kLo };
    }
    if (step === 1) return { acc: kicking ? clamp01((180 - knee) / (180 - K.CHAMBER_FOLD)) : 0.0, ok: kicking && knee <= K.CHAMBER_FOLD, msg: 'fold' };
    const rLo = K.REFERENCE.r_knee[0];
    if (thigh > THIGH_START && rLo - stol <= knee && knee <= K.CHAMBER_VALID_MAX) state.seen = true;
    const seen = !!state.seen;
    let down = seen && leg.grounded && thigh < 40;
    if (K.LAND_HOLD) {
      // Bik Chagi: the foot must STAY down (a blurred whip shows both feet down for a moment)
      if (!down) state.down_t = null; else if (state.down_t === null || state.down_t === undefined) state.down_t = m.t;
      down = down && m.t - state.down_t >= K.LAND_HOLD;
    }
    return { acc: (rangeCloseness(knee, rLo, 180, 30) + (seen ? 1.0 : 0.0) + (seen && leg.grounded ? 1.0 : 0.0)) / 3,
      ok: down, msg: seen ? 'land' : 'pull_back', lim: rLo };
  }

  const api = { KICKS, GROUP_TITLES, KickAnalyzer, Smoother, measure, buildLeg, checkFist, stepCheck, poseOk, PL,
    calculateAngle, angleFromDown, gradeLabel, clamp01, rangeCloseness, median, CONST: { VIS_MIN, GUARD_LINE, HAND_NEAR, THIGH_START, FOOT_DOWN, STANCE_PTS, GUARD_PTS, GUARD_STRICT, GUARD_MIN_SEEN } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.TryItCV = api;
})(typeof window !== 'undefined' ? window : globalThis);
