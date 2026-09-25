/* =====================================================================
   TAEKWONDO JOURNEY — ARENA GAMES, PART 2 (v21)
   Three more mini-games for EVERY kick, built on the arena engine in
   games-arena.js (ArenaStage / ArenaFighter / ArenaGameBase / ArenaSound):

     🥊 Sparring Duel — a real opponent (the other character) opens and
                        closes targets. Kick only when a LEGAL target for
                        this kick opens (+2 body, +3 head); hold on traps.
     ⚖️ Balance Hold  — hold chamber → strike → recoil on one leg while
                        wind gusts push you; keep your fighter upright.
     🥋 Heavy Bag     — a swinging bag with real pendulum physics; time the
                        kick so the foot meets the bag at the sweet spot.

   Loaded after games-arena.js.
   ===================================================================== */
'use strict';

// ---------------------------------------------------------------------
// Opponent: the other character, mirrored to face left. Frames of one
// character share a canvas, so they are scaled by one reference frame
// (the guard) and each frame is anchored by its own feet.
// ---------------------------------------------------------------------
const OPPONENT_SETS = {
  boy: {
    name: { en: 'Omar', ar: 'عمر' },
    guard: ['boy_walk_1', 'boy_walk_2', 'boy_walk_3', 'boy_walk_4', 'boy_walk_5', 'boy_walk_6'].map(n => `assets/images/characters/boy_char/${n}.webp`),
    hitHead: 'assets/images/characters/boy_char/boy_hit_1.webp',
    hitBody: 'assets/images/characters/boy_char/boy_hit_3.webp',
    attack: 'assets/images/characters/boy_char/boy_hit_2.webp',
    block: 'assets/images/characters/boy_char/boy_idle.webp',
    win: 'assets/images/characters/boy_char/boy_win_1.webp'
  },
  girl: {
    name: { en: 'Mariam', ar: 'مريم' },
    guard: ['girl_hit_2', 'girl_walk_1', 'girl_hit_2', 'girl_walk_2'].map(n => `assets/images/characters/girl_char/${n}.webp`),
    hitHead: 'assets/images/characters/girl_char/girl_hit_1.webp',
    hitBody: 'assets/images/characters/girl_char/girl_hit_1.webp',
    attack: 'assets/images/characters/girl_char/apchagi/extension_girl.webp',
    block: 'assets/images/characters/girl_char/girl_hit_1.webp',
    win: 'assets/images/characters/girl_char/girl_win_1.webp'
  }
};

class ArenaOpponent {
  constructor(stage, set) {
    this.stage = stage; this.set = set;
    this.frames = {};
    this.x = 600; this.floor = 400; this.height = 300;
    this.pose = 'guard'; this.poseT = 0;
    this.gi = 0; this.gt = 0;
    this.kx = 0; this.kv = 0;          // knock-back spring (px, px/s)
    this.flashT = 0; this.bob = 0;
    this.stepX = 0; this.stepTarget = 0;
  }
  async load() {
    const keys = [...this.set.guard.map((u, i) => [`guard${i}`, u]), ['hitHead', this.set.hitHead], ['hitBody', this.set.hitBody], ['attack', this.set.attack], ['block', this.set.block], ['win', this.set.win]];
    const res = await Promise.all(keys.map(([, u]) => ArenaImages.load(u)));
    keys.forEach(([k], i) => { this.frames[k] = res[i]; });
    this.ref = this.frames.guard0;
    this.ready = !!this.ref;
    return this.ready;
  }
  layout(x, floor, height) { this.x = x; this.floor = floor; this.height = height; }
  setPose(p, hold = 0) { this.pose = p; this.poseT = hold; }
  knock(v) { this.kv += v; }
  // points on the body, in screen space (front = the side facing the player)
  zone(name) {
    const h = this.height, x = this.x + this.kx + this.stepX;
    const y = { head: 0.87, body: 0.6, leg: 0.24 }[name] ?? 0.6;
    return { x: x - h * (name === 'leg' ? 0.08 : 0.1), y: this.floor - h * y };
  }
  update(dt) {
    this.bob += dt;
    this.gt += dt;
    if (this.gt > 0.15) { this.gt = 0; this.gi = (this.gi + 1) % this.set.guard.length; }
    this.kv += (-this.kx * 70 - this.kv * 10) * dt;
    this.kx += this.kv * dt;
    this.stepX = AG.lerp(this.stepX, this.stepTarget, 1 - Math.pow(0.002, dt));
    if (this.poseT > 0) { this.poseT -= dt; if (this.poseT <= 0) this.pose = 'guard'; }
    this.flashT = Math.max(0, this.flashT - dt * 3.5);
  }
  scaleFor(key, f) {
    const r = this.ref.meta;
    if (key.startsWith('guard') || key === 'block' || key === 'win') return this.height / Math.max(1, r.y1 - r.y0);
    // other frames: same pixel scale as the guard when they share its canvas
    // size, otherwise fit by their own height (kick frames drawn apart)
    if (f.meta.w === r.w && f.meta.h === r.h) return this.height / Math.max(1, r.y1 - r.y0);
    return (this.height * 1.02) / Math.max(1, f.meta.y1 - f.meta.y0);
  }
  draw(c) {
    if (!this.ready) return;
    const key = this.pose === 'guard' ? `guard${this.gi}` : this.pose;
    const f = this.frames[key] || this.ref;
    const m = f.meta, s = this.scaleFor(key, f);
    const cx = this.x + this.kx + this.stepX;
    // shadow
    c.save(); c.scale(1, 0.22);
    const sh = c.createRadialGradient(cx, this.floor / 0.22, 2, cx, this.floor / 0.22, this.height * 0.3);
    sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh; c.beginPath(); c.arc(cx, this.floor / 0.22, this.height * 0.3, 0, Math.PI * 2); c.fill();
    c.restore();
    c.save();
    c.translate(cx, this.floor);
    c.scale(-1, 1);                                    // face left, toward the player
    const breathe = this.pose === 'guard' ? Math.sin(this.bob * 2.4) * 0.01 : 0;
    c.scale(1, 1 + breathe);
    if (this.flashT > 0) c.filter = `brightness(${1 + this.flashT * 1.4}) saturate(${1 - this.flashT * 0.5})`;
    c.drawImage(f.img, -m.footX * s, -m.y1 * s, m.w * s, m.h * s);
    c.restore();
  }
}

// small shared helpers
const AG2 = {
  roundRectPath(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); },
  phaseTitle(skillId, i) {
    const ph = (GameConfig.SKILLS[skillId] || GameConfig.SKILLS.apchagi).phases[i];
    return ph ? AG.t(ph.title).replace(/^\S+\s/, '') : '';
  }
};

// =====================================================================
// 🥊 SPARRING DUEL
// =====================================================================
class SparringDuelGame extends ArenaGameBase {
  static SCREEN = 'sparring-duel';
  static GAME_ID = 'sparring-duel';
  static PREFIX = 'sd';
  static EXCHANGES = 10;
  static totalRounds() { return this.EXCHANGES; }

  static COPY = {
    title: { en: '🥊 Sparring Duel', ar: '🥊 نزال القتال' },
    how: {
      apchagi:   { en: 'Your opponent keeps moving. When a target lights up, decide fast: Ap Chagi scores on the BODY (+2) or the FACE (+3). If the target is the leg or the guard is covering it — don\'t kick! Tap the arena, press KICK or Space.', ar: 'المنافس بيتحرك طول الوقت. لما هدف ينوّر، قرّر بسرعة: الآب تشاجي بيجيب نقط على الجسم (+٢) أو الوش (+٣). لو الهدف الرجل أو الحراسة مغطياه — ماتركلش! دوس على الساحة أو زرار اركل أو المسافة.' },
      narochagi: { en: 'Your opponent keeps moving. Naeryeo Chagi only scores on the HEAD, from above (+3). Body, leg or a covered head — hold back! Tap the arena, press KICK or Space.', ar: 'المنافس بيتحرك طول الوقت. النارو تشاجي بيجيب نقط بس على الراس من فوق (+٣). الجسم أو الرجل أو راس متغطية — استنى! دوس على الساحة أو زرار اركل أو المسافة.' },
      bakchagi3: { en: 'Your opponent keeps moving. Bik Chagi scores on the BODY — ribs and chest (+2). Leg (below the belt is a foul!) or a covered body — hold back! Tap the arena, press KICK or Space.', ar: 'المنافس بيتحرك طول الوقت. البيك تشاجي بيجيب نقط على الجسم — الضلوع والصدر (+٢). الرجل (تحت الحزام مخالفة!) أو جسم متغطي — استنى! دوس على الساحة أو زرار اركل أو المسافة.' }
    }
  };

  static VALID = { apchagi: ['body', 'head'], narochagi: ['head'], bakchagi3: ['body'] };
  static OFF = { apchagi: [], narochagi: ['body'], bakchagi3: ['head'] };   // legal, but not this kick's target
  static LABEL = {
    head: { en: 'Head', ar: 'الراس' }, body: { en: 'Body', ar: 'الجسم' }, leg: { en: 'Leg', ar: 'الرجل' }
  };

  static setupUI() {
    const wrap = this.$('wrap');
    this.on(wrap, 'pointerdown', (e) => { if (e.target.closest('button')) return; e.preventDefault(); this.kick(); });
    this.on(this.$('action'), 'click', (e) => { e.stopPropagation(); this.kick(); });
    this.on(document, 'keydown', (e) => {
      if (!AG.$('sparring-duel-screen')?.classList.contains('active')) return;
      if (e.code === 'Space' || e.code === 'Enter') { if (document.activeElement?.closest?.('button') && document.activeElement !== this.$('action')) return; e.preventDefault(); this.kick(); }
    });
    const ui = this.$('ui'); if (ui) ui.innerHTML = '';
  }

  static async begin() {
    const oppKey = this.isBoy ? 'girl' : 'boy';
    this.oppSet = OPPONENT_SETS[oppKey];
    this.opp = window.arenaMakeOpponent ? arenaMakeOpponent(this.stage, this.oppSet, oppKey) : new ArenaOpponent(this.stage, this.oppSet);
    const tok = this.token;
    await this.opp.load();
    if (tok !== this.token) return;
    this.blue = 0; this.red = 0; this.fouls = 0; this.rts = []; this.hits = 0;
    this.state = 'intro';
    this.layout();
    this.setAction(this.ar ? '🦶 اركل!' : '🦶 KICK!');
    this.stage.text(this.stage.W / 2, this.stage.H * 0.42, this.ar ? 'كيونغ ري!' : 'Kyung-rye!', { color: '#fff', size: 34, ttl: 1.2, rise: 10 });
    this.later(() => this.stage && this.stage.text(this.stage.W / 2, this.stage.H * 0.42, this.ar ? 'شي-جاك! 🔔' : 'Shi-jak! 🔔', { color: '#ffd166', size: 40, ttl: 1.1, rise: 10 }), 1100);
    this.later(() => { ArenaSound.tone({ f0: 880, f1: 880, dur: 0.35, type: 'triangle', gain: 0.35 }); this.nextExchange(); }, 1900);
  }

  static setAction(label) {
    const b = this.$('action'); if (!b) return;
    b.hidden = !label;
    if (label) b.querySelector('span').textContent = label;
  }

  static layout() {
    const st = this.stage; if (!st) return;
    const W = st.W, H = st.H, fy = st.floorY();
    const narrow = W < 640;
    const figH = narrow ? Math.min(H * 0.52, W * 0.5) : Math.min(H * 0.64, W * 0.36);
    this.fighter.layout(W * (narrow ? 0.2 : 0.27), fy, figH);
    this.opp?.layout(W * (narrow ? 0.8 : 0.72), fy, figH * 1.0);
    st.spotX = W * 0.5;
  }

  static nextExchange() {
    if (this.over || !this.stage) return;
    this.round++;
    if (this.round > this.EXCHANGES) { this.endMatch(); return; }
    this.renderHud();
    this.state = 'wait';
    this.target = null;
    this.opp.stepTarget = AG.rand(-1, 1) * this.fighter.height * 0.06;
    const wait = AG.rand(0.7, 1.7);
    this.later(() => this.openTarget(), wait * 1000);
  }

  static openTarget() {
    if (this.over || this.state !== 'wait') return;
    const valid = this.VALID[this.skillId];
    const traps = ['leg', 'guard', ...this.OFF[this.skillId]];
    const isValid = Math.random() < 0.6 || this.round === 1;
    let zone, kind;
    if (isValid) { zone = AG.pick(valid); kind = 'open'; }
    else {
      const t = AG.pick(traps);
      if (t === 'guard') { zone = AG.pick(valid); kind = 'guard'; }
      else { zone = t; kind = t === 'leg' ? 'illegal' : 'off'; }
    }
    this.target = { zone, kind, valid: kind === 'open', born: this.stage.time };
    this.window = AG.lerp(1.7, 0.95, (this.round - 1) / (this.EXCHANGES - 1));
    this.state = 'open';
    if (kind === 'guard') this.opp.setPose('block', this.window + 0.2);
    ArenaSound.tone({ f0: 620, f1: 760, dur: 0.07, type: 'sine', gain: 0.18 });
  }

  static kick() {
    if (this.over || !this.opp) return;
    if (this.state === 'wait') {           // jumped the gun: a whiff, no penalty beyond losing the tempo
      if (this._whiffCool > this.stage.time) return;
      this._whiffCool = this.stage.time + 0.8;
      this.playKick(null);
      this.stage.text(this.fighter.x + this.fighter.height * 0.4, this.fighter.floor - this.fighter.height * 1.05, this.ar ? 'استنى الفتحة!' : 'Wait for an opening!', { color: '#ffe68a', size: 18 });
      return;
    }
    if (this.state !== 'open') return;
    this.state = 'resolving';
    const t = this.target;
    const rt = (this.stage.time - t.born) / Math.max(0.2, this.stage.timeScale || 1);
    this.playKick(t, rt);
  }

  static playKick(t, rt) {
    const f = this.fighter;
    const sp0 = f.strikePoint(2);
    const baseX = sp0.x - f.lunge;
    const aim = t ? this.opp.zone(t.zone) : { x: this.opp.x - this.opp.height * 0.2 };
    const reach = AG.clamp(aim.x - baseX, 0, this.stage.W * 0.5);
    ArenaSound.whoosh();
    f.play([
      { pose: 0, hold: 0.04 },
      { pose: 1, hold: 0.13, fade: 0.06, lunge: reach * 0.85 },
      { pose: 2, hold: 0.08, fade: 0.05, lunge: t ? reach : reach * 0.6 },          // foot travels in…
      { pose: 2, hold: 0.2, fade: 0, ghost: false, hit: () => t && this.resolveKick(t, rt) },   // …then lands
      { pose: 3, hold: 0.12, fade: 0.07, lunge: reach * 0.4 },
      { pose: 4, hold: 0.14, fade: 0.1, lunge: 0 },
      { pose: 0, hold: 0.05, fade: 0.18 }
    ], () => { if (!t) return; });
  }

  static resolveKick(t, rt) {
    const st = this.stage, o = this.opp, z = o.zone(t.zone);
    const ar = this.ar;
    if (t.kind === 'open') {
      const pts = t.zone === 'head' ? 3 : 2;
      this.blue += pts; this.hits++;
      window.Review?.note('target', true, { skill: this.skillId });
      this.rts.push(rt);
      const score = Math.round(AG.clamp(100 - Math.max(0, rt - 0.4) * 60, 50, 100));
      this.scores.push(score);
      o.setPose(t.zone === 'head' ? 'hitHead' : 'hitBody', 0.55);
      o.knock(this.fighter.height * 2.6); o.flashT = 1;
      ArenaSound.smack(); ArenaSound.tone({ f0: 1320, f1: 1320, dur: 0.12, type: 'square', gain: 0.12 });   // electronic hogu "beep"
      st.flash('#ffffff', 0.35); st.shake(t.zone === 'head' ? 12 : 8, 0.3);
      st.ring(z.x, z.y, '#4dc9ff', 110, 0.45, 7); st.sparks(z.x, z.y, '#8fd8ff', 28, 520);
      if (t.zone === 'head') st.slowmo(0.28, 0.3);
      st.text(z.x, z.y - 40, `+${pts}`, { color: '#6ec8ff', size: 46, ttl: 1.2 });
      st.text(z.x, z.y + 6, `${rt.toFixed(2)}s`, { color: '#ffe68a', size: 16, rise: 24 });
      this.scorePop = { side: 'blue', t: 1 };
      this.gs.playSound('success');
    } else if (t.kind === 'guard') {
      this.scores.push(0);
      o.knock(this.fighter.height * 0.6);
      ArenaSound.thud(); st.shake(4, 0.2); this.fighter.wobble = 0.5;
      st.text(z.x, z.y - 36, ar ? '🛡️ اتصدّت!' : '🛡️ Blocked!', { color: '#ffe68a', size: 28 });
      st.text(z.x, z.y + 4, ar ? 'الحراسة كانت مغطية الهدف' : 'The guard was covering it', { color: '#fff', size: 15, ttl: 1.6, rise: 16 });
    } else {
      // leg = below the belt → foul (gam-jeom gives the opponent 1 point); off = legal but not this kick's target
      this.scores.push(0);
      if (t.kind === 'illegal') {
        this.fouls++; this.red += 1; this.scorePop = { side: 'red', t: 1 };
        window.Review?.note('target', false, { skill: this.skillId });
        ArenaSound.buzz(); this.gs.playSound('error');
        st.text(st.W / 2, st.H * 0.3, ar ? '⚠️ گام-جوم! تحت الحزام' : '⚠️ Gam-jeom! Below the belt', { color: '#ff8a8a', size: 26, ttl: 1.6, rise: 16 });
      } else {
        ArenaSound.thud();
        st.text(z.x, z.y - 36, ar ? 'الركلة دي مش على الهدف ده' : 'Not a target for this kick', { color: '#ffe68a', size: 20, ttl: 1.5 });
      }
      o.knock(this.fighter.height * 0.5);
    }
    this.renderHud();
    this.state = 'rest';
    this.later(() => { this.opp && (this.opp.pose = 'guard'); this.nextExchange(); }, 1100);
  }

  static windowExpired() {
    const t = this.target, st = this.stage, ar = this.ar;
    this.state = 'resolving';
    if (t.valid) {
      // a missed opening: the opponent counters
      this.scores.push(0);
      window.Review?.note('timing', false, { skill: this.skillId, weight: 0.5 });
      this.red += 2; this.scorePop = { side: 'red', t: 1 };
      const o = this.opp;
      o.setPose('attack', 0.45);
      o.stepTarget = -Math.max(0, (o.x - this.fighter.x) - this.fighter.height * 0.75);
      this.later(() => {
        if (!this.stage) return;
        ArenaSound.smack(); st.shake(7, 0.25); st.flash('#ff4d4d', 0.25);
        this.fighter.wobble = 1; this.fighter.squash = 0.6;
        const px = this.fighter.x + this.fighter.height * 0.1, py = this.fighter.floor - this.fighter.height * 0.6;
        st.ring(px, py, '#ff6b6b', 80, 0.4, 5); st.sparks(px, py, '#ff8a8a', 16, 380);
        st.text(px, py - 50, ar ? '+٢ للمنافس' : '+2 Red', { color: '#ff8a8a', size: 26 });
        st.text(st.W / 2, st.H * 0.28, ar ? '⏰ الفتحة فاتتك!' : '⏰ Missed the opening!', { color: '#ffe68a', size: 22, ttl: 1.4, rise: 12 });
        this.gs.playSound('error');
      }, 180);
      this.later(() => { if (this.opp) this.opp.stepTarget = 0; }, 650);
    } else {
      this.scores.push(100);
      const z = this.opp.zone(t.zone);
      st.text(z.x, z.y - 40, ar ? '👀 قريتها صح!' : '👀 Good read!', { color: '#9be8d8', size: 24 });
      st.text(z.x, z.y - 8, t.kind === 'illegal' ? (ar ? 'تحت الحزام ممنوع' : 'Below the belt is illegal') : t.kind === 'guard' ? (ar ? 'الحراسة كانت مغطية' : 'It was covered') : (ar ? 'الركلة دي مش على الهدف ده' : 'Not this kick\'s target'), { color: '#fff', size: 15, rise: 16, ttl: 1.4 });
      ArenaSound.chime(2);
    }
    this.renderHud();
    this.later(() => { this.state = 'rest'; this.nextExchange(); }, 1300);
  }

  static renderHud() {
    const ar = this.ar;
    const total = this.EXCHANGES;
    this.setChip('round', ar ? `الجولة ${Math.min(Math.max(this.round, 1), total)} / ${total}` : `Exchange ${Math.min(Math.max(this.round, 1), total)} / ${total}`);
    const avg = this.average();
    this.setChip('score', ar ? `النتيجة: ${avg === null ? '—' : avg + '%'}` : `Score: ${avg === null ? '—' : avg + '%'}`);
  }

  static endMatch() {
    this.state = 'done';
    this.setAction(null);
    const st = this.stage, ar = this.ar;
    const won = this.blue > this.red;
    if (won) {
      this.opp.setPose('hitBody', 99);
      st.confetti(st.W * 0.3, st.H * 0.3, 60);
      st.text(st.W / 2, st.H * 0.36, ar ? `🏆 كسبت ${this.blue} – ${this.red}` : `🏆 You win ${this.blue} – ${this.red}`, { color: '#ffd166', size: 34, ttl: 2.2, rise: 10 });
    } else {
      this.opp.setPose('win', 99);
      st.text(st.W / 2, st.H * 0.36, ar ? `${this.blue} – ${this.red} · المرة الجاية إن شاء الله!` : `${this.blue} – ${this.red} · Next time!`, { color: '#ffe68a', size: 30, ttl: 2.2, rise: 10 });
    }
    const avgRt = this.rts.length ? this.rts.reduce((a, b) => a + b, 0) / this.rts.length : 0;
    this.lastMeta = { points: this.blue, against: this.red, fouls: this.fouls, avgReaction: +avgRt.toFixed(2) };
    this.finish({ delay: 1800 });
  }

  static update(dt) {
    if (!this.fighter) return;
    this.fighter.update(dt);
    this.opp?.update(dt);
    if (this.state === 'open' && this.target && this.stage.time - this.target.born > this.window) this.windowExpired();
    if (this.scorePop) { this.scorePop.t -= dt * 2; if (this.scorePop.t <= 0) this.scorePop = null; }
  }

  static drawTarget(c) {
    const t = this.target; if (!t || this.state !== 'open') return;
    const z = this.opp.zone(t.zone), now = this.stage.time;
    const age = now - t.born, left = 1 - AG.clamp(age / this.window, 0, 1);
    const r = this.fighter.height * (t.zone === 'leg' ? 0.075 : 0.095);
    const pop = AG.easeOutBack(AG.clamp(age / 0.2, 0, 1));
    const pulse = 1 + Math.sin(now * 14) * 0.06;
    c.save();
    c.translate(z.x, z.y); c.scale(pop * pulse, pop * pulse);
    const g = c.createRadialGradient(0, 0, 2, 0, 0, r * 1.6);
    g.addColorStop(0, 'rgba(255,214,102,0.55)'); g.addColorStop(1, 'rgba(255,214,102,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * 1.6, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#ffd166'; c.lineWidth = 3;
    c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 2; c.globalAlpha = 0.7; c.beginPath(); c.arc(0, 0, r * 0.55, 0, Math.PI * 2); c.stroke();
    c.globalAlpha = 1;
    if (t.kind === 'guard') { c.font = `${Math.round(r * 0.9)}px system-ui`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('🛡️', 0, 0); }
    c.restore();
    // countdown arc
    c.strokeStyle = left < 0.3 ? '#ff6b6b' : 'rgba(255,255,255,0.9)'; c.lineWidth = 3;
    c.beginPath(); c.arc(z.x, z.y, r * 1.28, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left); c.stroke();
    // label
    const label = this.t(this.LABEL[t.zone]) + (t.kind === 'guard' ? (this.ar ? ' · متغطي' : ' · covered') : '');
    c.font = '800 14px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const tw = c.measureText(label).width + 16;
    c.fillStyle = 'rgba(0,0,0,0.65)'; c.beginPath(); c.roundRect(z.x - tw / 2, z.y + r * 1.4, tw, 22, 8); c.fill();
    c.fillStyle = '#fff'; c.fillText(label, z.x, z.y + r * 1.4 + 11);
  }

  static drawScoreboard(c, W) {
    const w = Math.min(360, W * 0.62), h = 54, x = (W - w) / 2, y = 10;
    const ar = this.ar;
    c.save();
    c.fillStyle = 'rgba(5,10,16,0.82)'; c.beginPath(); c.roundRect(x - 4, y - 4, w + 8, h + 8, 14); c.fill();
    const half = (w - 8) / 2;
    const pop = (side) => (this.scorePop?.side === side ? 1 + this.scorePop.t * 0.25 : 1);
    [['blue', x, '#1f5fd1', '#123a80', this.blue, ar ? 'إنت' : 'YOU'], ['red', x + half + 8, '#d12a37', '#7d1720', this.red, this.t(this.oppSet?.name || { en: 'Rival', ar: 'المنافس' })]].forEach(([side, bx, c1, c2, val, name]) => {
      const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, c1); g.addColorStop(1, c2);
      c.fillStyle = g; c.beginPath(); c.roundRect(bx, y, half, h, 10); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.85)'; c.font = '800 11px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
      c.fillText(name, bx + half / 2, y + 5);
      c.save(); c.translate(bx + half / 2, y + 35); c.scale(pop(side), pop(side));
      c.font = '900 26px "Roboto Mono", Roboto, monospace'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(String(val), 0, 0);
      c.restore();
    });
    c.restore();
  }

  static draw(c, W, H) {
    this.fighter?.draw(c);
    this.opp?.draw(c);
    this.drawTarget(c);
    if (this.opp) this.drawScoreboard(c, W);
  }
}

// =====================================================================
// ⚖️ BALANCE HOLD
// =====================================================================
class BalanceHoldGame extends ArenaGameBase {
  static SCREEN = 'balance-hold';
  static GAME_ID = 'balance-hold';
  static PREFIX = 'bh';
  static HOLD_POSES = [1, 2, 3];            // chamber / strike / recoil
  static ROUNDS = [
    { dur: 4, drift: 0.55, gust: 0.0 },
    { dur: 4.5, drift: 0.8, gust: 0.9 },
    { dur: 5, drift: 1.05, gust: 1.4 }
  ];
  static LIMIT = 0.42; static GREEN = 0.1; static YELLOW = 0.22;
  static totalRounds() { return this.ROUNDS.length * this.HOLD_POSES.length; }

  static COPY = {
    title: { en: '⚖️ Balance Hold', ar: '⚖️ اثبت واتوازن' },
    how: {
      all: { en: 'Hold each phase of the kick on one leg. Your fighter sways and the wind pushes — lean the other way with ◀ ▶ (or the arrow keys, or tap the left / right side) to keep the needle in the green zone.', ar: 'اثبت على رجل واحدة في كل مرحلة من الركلة. لاعبك بيتمايل والهوا بيزقّه — ميّل للناحية التانية بـ ◀ ▶ (أو الأسهم، أو دوس يمين / شمال الساحة) عشان المؤشر يفضل في الأخضر.' }
    }
  };

  static setupUI() {
    const wrap = this.$('wrap');
    this.input = { l: false, r: false, ptr: 0 };
    const ui = this.$('ui'); if (ui) ui.innerHTML = '';
    const pads = this.$('pads');
    if (pads) {
      pads.innerHTML = `<button type="button" class="bh-pad" data-dir="-1" aria-label="${this.ar ? 'ميّل شمال' : 'Lean left'}">◀</button><button type="button" class="bh-pad" data-dir="1" aria-label="${this.ar ? 'ميّل يمين' : 'Lean right'}">▶</button>`;
      pads.querySelectorAll('.bh-pad').forEach(b => {
        const dir = +b.dataset.dir;
        const down = (e) => { e.preventDefault(); b.setPointerCapture?.(e.pointerId); b.classList.add('on'); if (dir < 0) this.input.l = true; else this.input.r = true; };
        const up = () => { b.classList.remove('on'); if (dir < 0) this.input.l = false; else this.input.r = false; };
        this.on(b, 'pointerdown', down); this.on(b, 'pointerup', up); this.on(b, 'pointercancel', up); this.on(b, 'lostpointercapture', up);
      });
    }
    const canvas = this.$('canvas');
    this.on(canvas, 'pointerdown', (e) => {
      e.preventDefault(); canvas.setPointerCapture?.(e.pointerId);
      const r = canvas.getBoundingClientRect();
      this.input.ptr = (e.clientX - r.left) < r.width / 2 ? -1 : 1;
    });
    const release = () => { this.input.ptr = 0; };
    this.on(canvas, 'pointerup', release); this.on(canvas, 'pointercancel', release); this.on(canvas, 'lostpointercapture', release);
    this.on(document, 'keydown', (e) => {
      if (!AG.$('balance-hold-screen')?.classList.contains('active')) return;
      if (e.key === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); this.input.l = true; }
      if (e.key === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); this.input.r = true; }
    });
    this.on(document, 'keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.code === 'KeyA') this.input.l = false;
      if (e.key === 'ArrowRight' || e.code === 'KeyD') this.input.r = false;
    });
    this.on(window, 'blur', () => { this.input.l = this.input.r = false; this.input.ptr = 0; });
  }

  static begin() {
    this.theta = 0; this.omega = 0; this.hold = null; this.wind = 0; this.gust = null;
    this.windLines = Array.from({ length: 14 }, () => ({ x: Math.random(), y: Math.random() * 0.75, l: AG.rand(0.04, 0.1), v: AG.rand(0.6, 1.2) }));
    this.calm = 0; this.falls = 0; this.greenTotal = 0; this.timeTotal = 0;
    this.later(() => this.nextHold(), 700);
  }

  static layout() {
    const st = this.stage; if (!st) return;
    const W = st.W, H = st.H, fy = st.floorY();
    const figH = Math.min(H * 0.62, W * 0.55);
    this.fighter.layout(W * 0.42, fy, figH);
    st.spotX = W * 0.42;
  }

  static nextHold() {
    if (this.over || !this.stage) return;
    this.round++;
    if (this.round > this.totalRounds()) { this.finishGame(); return; }
    const ri = Math.floor((this.round - 1) / this.HOLD_POSES.length);
    const pi = (this.round - 1) % this.HOLD_POSES.length;
    this.cfg = this.ROUNDS[ri];
    const pose = this.HOLD_POSES[pi];
    this.renderHud();
    this.theta = AG.rand(-0.03, 0.03); this.omega = 0;
    this.fighter.setPose(pose, 0.18, true);
    this.hold = { pose, t: 0, dur: this.cfg.dur, green: 0, yellow: 0, fell: false, ready: 0.9, phase: AG.rand(0, 6), phase2: AG.rand(0, 6) };
    this.nextGustAt = AG.rand(1.0, 2.0);
    const st = this.stage;
    const name = AG2.phaseTitle(this.skillId, pose);
    const f0 = this.fighter, tx0 = Math.min(st.W - 90, f0.x + f0.height * 0.75), ty0 = f0.floor - f0.height * 0.62;
    st.text(tx0, ty0, `${name}`, { color: '#ffd166', size: 26, ttl: 1.4, rise: 8 });
    st.text(tx0, ty0 + 32, this.ar ? 'اثبت!' : 'Hold it!', { color: '#fff', size: 18, ttl: 1.3, rise: 8 });
    ArenaSound.tone({ f0: 520, f1: 700, dur: 0.12, type: 'triangle', gain: 0.25 });
  }

  static endHold() {
    const h = this.hold; if (!h) return;
    const frac = (h.green + 0.5 * h.yellow) / h.dur;
    const score = Math.round(AG.clamp(frac * 100 * (h.fell ? 0.7 : 1), 0, 100));
    this.scores.push(score);
    if (!h.fell && score >= 70) window.Review?.note('phase', true, { skill: this.skillId, phase: h.pose });
    this.hold = null;
    const st = this.stage, f = this.fighter;
    const tx = Math.min(st.W - 90, f.x + f.height * 0.75), ty = f.floor - f.height * 0.45;
    if (!h.fell) {
      st.text(tx, ty, score >= 90 ? (this.ar ? 'ثابت زي الصخرة! 🪨' : 'Rock solid! 🪨') : `${score}%`, { color: score >= 85 ? '#9be8d8' : '#fff', size: 26 });
      if (score >= 90) { st.sparks(tx, ty + 40, '#9be8d8', 18, 300); ArenaSound.chime(4); } else ArenaSound.chime(1);
    }
    this.renderHud();
    this.fighter.setPose(0, 0.2, false);
    this.later(() => this.nextHold(), 800);
  }

  static fall() {
    const h = this.hold; if (!h || h.fell) return;
    h.fell = true; this.falls++;
    window.Review?.note('phase', false, { skill: this.skillId, phase: h.pose });
    const st = this.stage, f = this.fighter;
    ArenaSound.thud(); this.gs.playSound('error');
    st.shake(6, 0.3); st.dust(f.x + Math.sign(this.theta) * f.height * 0.2, f.floor, 12);
    st.text(Math.min(st.W - 90, f.x + f.height * 0.75), f.floor - f.height * 0.55, this.ar ? 'أوبس! 😅' : 'Oops! 😅', { color: '#ffb3b9', size: 28 });
    f.setPose(0, 0.15, false);
    this.theta = 0; this.omega = 0;
    // the hold ends here; time left counts as off-balance
    this.later(() => { if (this.hold === h) this.endHold(); }, 700);
  }

  static update(dt, raw) {
    if (!this.fighter) return;
    this.fighter.update(dt);
    const h = this.hold;
    // wind streaks drift in the wind direction
    const wdir = this.gust ? Math.sign(this.gust.f) : Math.sign(this.wind || 1);
    (this.windLines || []).forEach(l => { l.x += wdir * l.v * raw * (this.gust ? 1.4 : 0.35); if (l.x > 1.1) l.x = -0.1; if (l.x < -0.1) l.x = 1.1; });
    if (!h) { this.fighter.tilt = AG.lerp(this.fighter.tilt, 0, 1 - Math.pow(0.001, dt)); return; }
    if (h.fell) { this.fighter.tilt = AG.lerp(this.fighter.tilt, 0, 1 - Math.pow(0.001, dt)); return; }
    if (h.ready > 0) { h.ready -= dt; this.fighter.tilt = this.theta; return; }
    h.t += dt;
    // wind: slow drift + gusts that are announced before they hit
    const tt = h.t;
    this.wind = this.cfg.drift * (Math.sin(tt * 0.9 + h.phase) * 0.6 + Math.sin(tt * 2.1 + h.phase2) * 0.4);
    let gustF = 0;
    if (this.cfg.gust > 0) {
      if (!this.gust && tt > this.nextGustAt) this.gust = { f: (Math.random() < 0.5 ? -1 : 1) * this.cfg.gust, t: 0 };
      if (this.gust) {
        this.gust.t += dt;
        if (this.gust.t > 0.55) gustF = this.gust.f * Math.sin(Math.min(1, (this.gust.t - 0.55) / 0.7) * Math.PI);   // 0.55 s warning first
        if (this.gust.t > 1.25) { this.gust = null; this.nextGustAt = tt + AG.rand(1.2, 2.2); }
      }
    }
    const inp = (this.input.r ? 1 : 0) - (this.input.l ? 1 : 0) || this.input.ptr;
    // inverted pendulum: gravity makes any lean grow; the player leans back against it
    const acc = 2.4 * this.theta + this.wind + gustF + inp * 2.4 - 2.2 * this.omega;   // ▶ moves the body right, ◀ left
    this.omega += acc * dt;
    this.theta += this.omega * dt;
    this.fighter.tilt = this.theta;
    const a = Math.abs(this.theta);
    if (a < this.GREEN) { h.green += dt; this.calm += dt; } else { this.calm = 0; if (a < this.YELLOW) h.yellow += dt; }
    if (this.calm > 2 && Math.random() < dt * 3) { const f = this.fighter; this.stage.sparks(f.x + AG.rand(-1, 1) * f.height * 0.3, f.floor - f.height * AG.rand(0.4, 1), '#fff4b0', 4, 120); }
    if (a > this.YELLOW && Math.random() < dt * 6) {
      const f = this.fighter;
      this.stage.particles.push({ kind: 'spark', x: f.x + Math.sin(this.theta) * f.height * 0.9, y: f.floor - f.height * 0.92, vx: AG.rand(-60, 60), vy: -80, age: 0, ttl: 0.6, size: 3, color: '#8fd8ff', drag: 0.3, grav: 600 });
    }
    if (a > this.LIMIT) this.fall();
    else if (h.t >= h.dur) this.endHold();
  }

  static drawGauge(c, W) {
    const f = this.fighter;
    const cx = W * 0.5, cy = Math.max(70, f.floor - f.height * 1.12), R = Math.min(90, W * 0.16);
    const span = Math.PI * 0.7, toA = (th) => -Math.PI / 2 + (th / this.LIMIT) * span / 2;
    c.save();
    c.lineCap = 'round';
    c.lineWidth = 12; c.strokeStyle = 'rgba(0,0,0,0.45)';
    c.beginPath(); c.arc(cx, cy, R, toA(-this.LIMIT), toA(this.LIMIT)); c.stroke();
    const band = (a0, a1, col) => { c.strokeStyle = col; c.lineWidth = 8; c.beginPath(); c.arc(cx, cy, R, toA(a0), toA(a1)); c.stroke(); };
    band(-this.LIMIT, -this.YELLOW, '#c1121f'); band(this.YELLOW, this.LIMIT, '#c1121f');
    band(-this.YELLOW, -this.GREEN, '#e9c46a'); band(this.GREEN, this.YELLOW, '#e9c46a');
    band(-this.GREEN, this.GREEN, '#2a9d8f');
    const th = AG.clamp(this.theta || 0, -this.LIMIT, this.LIMIT);
    const na = toA(th);
    c.strokeStyle = '#fff'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(na) * (R + 8), cy + Math.sin(na) * (R + 8)); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI * 2); c.fill();
    // hold progress
    const h = this.hold;
    if (h && !h.fell) {
      const p = AG.clamp(h.t / h.dur, 0, 1);
      c.fillStyle = 'rgba(0,0,0,0.5)'; c.beginPath(); c.roundRect(cx - R, cy + 16, R * 2, 8, 4); c.fill();
      c.fillStyle = '#ffd166'; c.beginPath(); c.roundRect(cx - R, cy + 16, R * 2 * p, 8, 4); c.fill();

    }
    c.restore();
  }

  static draw(c, W, H) {
    // wind streaks
    const gusting = this.gust && this.gust.t > 0;
    c.save();
    c.strokeStyle = gusting ? 'rgba(200,235,255,0.55)' : 'rgba(200,235,255,0.18)'; c.lineWidth = 2; c.lineCap = 'round';
    (this.windLines || []).forEach(l => { const x = l.x * W, y = l.y * H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - l.l * W * Math.sign(this.gust?.f || this.wind || 1), y); c.stroke(); });
    c.restore();
    this.fighter?.draw(c);
    if (this.gust && this.gust.t < 1.2) {
      const dir = Math.sign(this.gust.f);
      const x = dir > 0 ? 40 : W - 40;
      c.save(); c.font = '34px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.globalAlpha = 0.6 + 0.4 * Math.sin(this.stage.time * 18);
      c.translate(x, H * 0.45); if (dir < 0) c.scale(-1, 1); c.fillText('💨', 0, 0); c.restore();
    }
    this.drawGauge(c, W);
  }

  static finishGame() {
    const total = this.scores.length;
    this.lastMeta = { falls: this.falls, holds: total };
    this.finish();
  }
}

// =====================================================================
// 🥋 HEAVY BAG — pendulum physics, timing + distance
// =====================================================================
class HeavyBagGame extends ArenaGameBase {
  static SCREEN = 'heavy-bag';
  static GAME_ID = 'heavy-bag';
  static PREFIX = 'hb';
  static ROUNDS = 8;
  static totalRounds() { return this.ROUNDS; }

  static COPY = {
    title: { en: '🥋 Heavy Bag', ar: '🥋 كيس الملاكمة' },
    how: {
      all: { en: 'Coach Yang swings the bag. Kick (tap, KICK or Space) so your foot meets the bag just as it swings back to you — the glowing band shows where your kick lands. Too early = air, too late = jammed.', ar: 'الكوتش يانج بيزق الكيس. اركل (دوس أو زرار اركل أو المسافة) بحيث رجلك تقابل الكيس وهو راجع ناحيتك — الشريط المنوّر بيوريك ركلتك هتنزل فين. بدري = هوا، متأخر = الكيس هيزنقك.' }
    }
  };

  static setupUI() {
    this.powers = []; this.bestPower = 0; this.phi = 0; this.omega = 0; this.dent = 0; this.chainJ = 0; this.coachPush = 0; this.coach = null;
    const wrap = this.$('wrap');
    this.on(wrap, 'pointerdown', (e) => { if (e.target.closest('button')) return; e.preventDefault(); this.kick(); });
    this.on(this.$('action'), 'click', (e) => { e.stopPropagation(); this.kick(); });
    this.on(document, 'keydown', (e) => {
      if (!AG.$('heavy-bag-screen')?.classList.contains('active')) return;
      if (e.code === 'Space' || e.code === 'Enter') { if (document.activeElement?.closest?.('button') && document.activeElement !== this.$('action')) return; e.preventDefault(); this.kick(); }
    });
    const ui = this.$('ui'); if (ui) ui.innerHTML = '';
  }

  static setAction(label) {
    const b = this.$('action'); if (!b) return;
    b.hidden = !label;
    if (label) b.querySelector('span').textContent = label;
  }

  static async begin() {
    this.coach = await ArenaImages.load('assets/images/characters/coach_yang/coach_idle.webp');
    if (!this.stage) return;
    this.phi = 0; this.omega = 0; this.dent = 0; this.dentY = 0; this.chainJ = 0;
    this.powers = []; this.bestPower = 0; this.coachPush = 0;
    this.layout();
    this.setAction(this.ar ? '🦶 اركل!' : '🦶 KICK!');
    this.later(() => this.nextRound(), 600);
  }

  static layout() {
    const st = this.stage; if (!st) return;
    const W = st.W, H = st.H, fy = st.floorY();
    const narrow = W < 640;
    const figH = narrow ? Math.min(H * 0.5, W * 0.5) : Math.min(H * 0.64, W * 0.36);
    this.fighter.layout(W * (narrow ? 0.2 : 0.26), fy, figH);
    st.spotX = W * 0.4;
    const sp = this.fighter.strikePoint(2);
    this.strike = { x: sp.x - this.fighter.lunge, y: sp.y };
    this.bw = figH * 0.13;                              // bag half-width
    this.my = -H * 0.02;                                // ceiling mount (just above the frame)
    this.bagTop = Math.max(H * 0.1, this.strike.y - figH * 0.42);
    this.bagBot = Math.min(fy - figH * 0.08, this.strike.y + figH * 0.3);
    // at rest the bag's front face sits a little out of reach
    this.mx = this.strike.x + this.bw + figH * 0.1;
    this.L = this.bagBot - this.my;                     // pendulum length to the bag bottom (for physics)
  }

  // front (left) face x of the bag at height y, for the current angle
  static faceX(y) {
    const d = (y - this.my) / Math.max(0.2, Math.cos(this.phi));
    return this.mx + d * Math.sin(this.phi) - this.bw / Math.max(0.2, Math.cos(this.phi));
  }

  static nextRound() {
    if (this.over || !this.stage) return;
    this.round++;
    if (this.round > this.ROUNDS) { this.finishGame(); return; }
    this.renderHud();
    this.kicked = false;
    this.roundStart = this.stage.time;
    // coach pushes the bag away from you — it will swing back
    const amp = AG.lerp(0.9, 1.5, (this.round - 1) / (this.ROUNDS - 1)) * (this.PUSH || 1);
    this.omega += amp * AG.rand(0.9, 1.1);
    this.coachPush = 1;
    ArenaSound.thud();
    this.assist = this.round <= (this.ASSIST_ROUNDS ?? 3);
  }

  static kick() {
    if (this.over || this.kicked || !this.coach || this.round < 1) return;
    this.kicked = true;
    ArenaSound.whoosh();
    this.fighter.play([
      { pose: 0, hold: 0.03 },
      { pose: 1, hold: 0.09, fade: 0.05 },
      { pose: 2, hold: 0.24, fade: 0.04, lunge: this.fighter.height * 0.03, hit: () => this.impact() },
      { pose: 3, hold: 0.12, fade: 0.07, lunge: 0 },
      { pose: 4, hold: 0.14, fade: 0.1 },
      { pose: 0, hold: 0.05, fade: 0.18 }
    ]);
  }

  static impact() {
    const st = this.stage, ar = this.ar, bw = this.bw;
    const sx = this.strike.x + this.fighter.lunge, sy = this.strike.y;
    const gap = this.faceX(sy) - sx;                    // + = bag still away from the foot
    const toward = -this.omega;                          // bag moving toward the fighter → counter-impact bonus
    let q, verdict;
    const T = this.TOL || 1;
    if (gap > bw * 1.5 * T) { q = 0; verdict = 'air'; }
    else if (gap < -bw * 1.3 * T) { q = 0.3; verdict = 'jammed'; }
    else { q = AG.clamp(1 - Math.abs(gap - bw * 0.1) / (bw * 1.5 * T), 0.35, 1); verdict = q > 0.85 ? 'perfect' : 'good'; }
    if (q > 0 && toward > 0) q = Math.min(1, q + Math.min(0.12, toward * 0.08));
    const score = Math.round(q * 100);
    this.scores.push(score);
    if (verdict === 'air') {
      this.fighter.wobble = 0.7;
      st.text(sx + 20, sy - 40, ar ? 'هوا! 💨 بدري' : 'Air! 💨 Too early', { color: '#ffe68a', size: 22 });
      this.gs.playSound('error');
    } else {
      const power = Math.round((380 + 70 * this.round) * q + AG.rand(-15, 15));
      this.powers.push(power); this.bestPower = Math.max(this.bestPower, power);
      this.omega += 0.9 + q * 1.3;                     // the bag flies away from the kick
      this.dent = q; this.dentY = sy; this.chainJ = 1;
      const hx = this.faceX(sy);
      ArenaSound.smack(); ArenaSound.tone({ f0: 90, f1: 40, dur: 0.25, type: 'sine', gain: 0.8 * q + 0.2 });
      st.shake(4 + q * 10, 0.3); st.ring(hx, sy, '#ffd166', 70 + q * 70, 0.45, 6);
      st.dust(hx, sy, 6 + Math.round(q * 10), 'rgba(255,230,200,');
      if (verdict === 'perfect') { st.slowmo(0.3, 0.22); st.flash('#fff', 0.3); st.sparks(hx, sy, '#ffd166', 24, 480); }
      if (verdict === 'jammed') { this.fighter.wobble = 0.8; st.text(hx, sy - 50, ar ? 'اتزنقت! قرّبت أوي' : 'Jammed! Too close', { color: '#ffb3b9', size: 22 }); }
      else st.text(hx, sy - 54, verdict === 'perfect' ? (ar ? 'في الجون! 💥' : 'PERFECT! 💥') : (ar ? 'حلوة! 👍' : 'Good! 👍'), { color: verdict === 'perfect' ? '#ffd166' : '#b8f5ec', size: verdict === 'perfect' ? 34 : 26 });
      st.text(hx + 40, sy - 18, `⚡ ${power} N`, { color: '#fff', size: 18, rise: 30 });
      this.gs.playSound(verdict === 'jammed' ? 'click' : 'success');
    }
    this.renderHud();
    this.later(() => this.nextRound(), 1300);
  }

  static update(dt) {
    if (!this.fighter) return;
    this.fighter.update(dt);
    if (this.L) {
      const g = 9.8 * (this.fighter.height / 1.3);      // px/s² at kid scale
      const alpha = -(g / this.L) * Math.sin(this.phi) * 1.6 - 0.35 * this.omega;
      this.omega += alpha * dt;
      this.phi += this.omega * dt;
      this.phi = AG.clamp(this.phi, -0.9, 0.9);
    }
    this.dent = Math.max(0, this.dent - dt * 3);
    this.chainJ = Math.max(0, this.chainJ - dt * 2.5);
    this.coachPush = Math.max(0, this.coachPush - dt * 3);
    // a round with no kick times out
    if (this.round >= 1 && !this.kicked && !this.over && this.stage.time - this.roundStart > 6) {
      this.kicked = true; this.scores.push(0); this.renderHud();
      this.stage.text(this.stage.W / 2, this.stage.H * 0.3, this.ar ? '⏰ اركل أسرع!' : '⏰ Kick sooner!', { color: '#ffe68a', size: 22 });
      this.later(() => this.nextRound(), 900);
    }
  }

  static inSweetSpot() {
    const gap = this.faceX(this.strike.y) - this.strike.x;
    return gap < this.bw * 0.9 && gap > -this.bw * 0.6 && this.omega < 0;
  }

  static drawBag(c) {
    const mx = this.mx, my = this.my, bw = this.bw;
    const top = this.bagTop, bot = this.bagBot;
    const dTop = top - my, dBot = bot - my;
    c.save();
    c.translate(mx, my);
    c.rotate(-this.phi);
    // chain
    const j = this.chainJ * Math.sin(this.stage.time * 60) * 2;
    c.strokeStyle = '#9aa4ad'; c.lineWidth = 3;
    for (let y = 0; y < dTop - 10; y += 14) { c.beginPath(); c.ellipse(j * (y / dTop), y + 7, 4, 7, 0, 0, Math.PI * 2); c.stroke(); }
    // straps to the top cap
    c.strokeStyle = '#6b737a'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, dTop - 14); c.lineTo(-bw * 0.8, dTop + 4); c.moveTo(0, dTop - 14); c.lineTo(bw * 0.8, dTop + 4); c.stroke();
    // body (dent squashes it around the impact height)
    const dentLocal = this.dentY - my;
    const sq = this.dent * 0.16;
    const grad = c.createLinearGradient(-bw, 0, bw, 0);
    grad.addColorStop(0, '#5c0f16'); grad.addColorStop(0.28, '#b3202a'); grad.addColorStop(0.45, '#d8434b'); grad.addColorStop(0.7, '#9b1a23'); grad.addColorStop(1, '#4a0b11');
    c.fillStyle = grad;
    c.beginPath();
    const steps = 18;
    for (let i = 0; i <= steps; i++) {
      const y = dTop + (dBot - dTop) * (i / steps);
      const k = Math.exp(-Math.pow((y - dentLocal) / (bw * 1.6), 2));
      const x = -bw * (1 - sq * k * 1.4);
      i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    for (let i = steps; i >= 0; i--) {
      const y = dTop + (dBot - dTop) * (i / steps);
      const k = Math.exp(-Math.pow((y - dentLocal) / (bw * 1.6), 2));
      c.lineTo(bw * (1 + sq * k * 0.5), y);
    }
    c.closePath(); c.fill();
    // caps + seams + label
    c.fillStyle = '#1b1b1f';
    c.beginPath(); c.roundRect(-bw * 1.02, dTop - 6, bw * 2.04, 14, 6); c.fill();
    c.beginPath(); c.roundRect(-bw * 1.02, dBot - 8, bw * 2.04, 14, 7); c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 2;
    [0.3, 0.62].forEach(t => { const y = dTop + (dBot - dTop) * t; c.beginPath(); c.moveTo(-bw, y); c.lineTo(bw, y); c.stroke(); });
    c.fillStyle = 'rgba(255,255,255,0.14)'; c.beginPath(); c.roundRect(-bw * 0.55, dTop + 12, bw * 0.22, (dBot - dTop) - 26, 6); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.85)'; c.font = `900 ${Math.round(bw * 0.42)}px Cairo, Roboto, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('태권도', 0, dTop + (dBot - dTop) * 0.46);
    c.restore();
    // target band where the kick lands
    const sy = this.strike.y, sweet = this.inSweetSpot();
    const fx = this.faceX(sy);
    c.save();
    c.globalAlpha = 0.55 + (sweet && this.assist ? 0.35 * Math.sin(this.stage.time * 20) : 0);
    c.strokeStyle = sweet && this.assist ? '#7ee0cf' : '#ffd166'; c.lineWidth = 3; c.setLineDash([6, 5]);
    c.beginPath(); c.moveTo(fx - 4, sy); c.lineTo(fx + bw * 2, sy); c.stroke();
    c.restore();
  }

  static draw(c, W, H) {
    if (!this.strike) { this.fighter?.draw(c); return; }
    // coach behind the bag
    if (this.coach) {
      const m = this.coach.meta, ch = this.fighter.height * 0.95, s = ch / Math.max(1, m.y1 - m.y0);
      const cx = Math.min(W - 40, this.mx + this.bw * 3.4) - this.coachPush * 14;
      c.save(); c.globalAlpha = 0.95;
      c.drawImage(this.coach.img, cx - m.footX * s, this.stage.floorY() - m.y1 * s, m.w * s, m.h * s);
      c.restore();
    }
    this.drawBag(c);
    this.fighter.draw(c);
    // sweet-spot assist marker at the fighter's strike height (first rounds only)
    if (this.assist && !this.kicked) {
      c.save(); c.font = '800 13px Cairo, Roboto, sans-serif'; c.textAlign = 'center'; c.fillStyle = this.inSweetSpot() ? '#7ee0cf' : 'rgba(255,255,255,0.6)';
      c.fillText(this.inSweetSpot() ? (this.ar ? 'دلوقتي!' : 'NOW!') : (this.ar ? 'استنى الكيس…' : 'Wait for the bag…'), this.strike.x, this.strike.y - this.fighter.height * 0.22);
      c.restore();
    }
    // power meter
    const last = this.powers[this.powers.length - 1] || 0;
    c.save(); c.font = '800 14px Cairo, Roboto, sans-serif'; c.textAlign = 'left'; c.fillStyle = 'rgba(255,255,255,0.85)';
    c.fillText(`⚡ ${this.ar ? 'آخر' : 'Last'}: ${last} N   🏅 ${this.ar ? 'أقوى' : 'Best'}: ${this.bestPower} N`, 14, 24);
    c.restore();
  }

  static finishGame() {
    this.lastMeta = { bestPower: this.bestPower, kicks: this.powers.length };
    this.finish();
  }
}

// register with the shared arena registry (screen init / teardown / language refresh)
Object.assign(ArenaGames.byScreen, { 'sparring-duel': SparringDuelGame, 'balance-hold': BalanceHoldGame, 'heavy-bag': HeavyBagGame });
