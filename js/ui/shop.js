// ============================================================================
// STAR SHOP (v31) — stars earned across every kick buy cosmetics for the
// fighter: coloured belts (matching real taekwondo ranks) and headbands.
// Purely cosmetic — never touches real skill/belt progress. Shows up on the
// map, the winner screen, in the arena games and in lessons, wherever the
// skeletal rig is drawn (RigFighter/RigOpponent/RigSprite/RigView).
// ============================================================================
const Shop = {
  BELTS: [
    { id: 'belt-white', slot: 'belt', color: '#f4f1e8', cost: 0, en: 'White', ar: 'أبيض' },
    { id: 'belt-yellow', slot: 'belt', color: '#ffd93d', cost: 15, en: 'Yellow', ar: 'أصفر' },
    { id: 'belt-green', slot: 'belt', color: '#2a9d8f', cost: 25, en: 'Green', ar: 'أخضر' },
    { id: 'belt-blue', slot: 'belt', color: '#3d7dff', cost: 35, en: 'Blue', ar: 'أزرق' },
    { id: 'belt-red', slot: 'belt', color: '#e63946', cost: 45, en: 'Red', ar: 'أحمر' },
    { id: 'belt-black', slot: 'belt', color: '#1d2b36', cost: 60, en: 'Black', ar: 'أسود' }
  ],
  HEADBANDS: [
    { id: 'hb-none', slot: 'headband', color: null, cost: 0, en: 'None', ar: 'بدون' },
    { id: 'hb-red', slot: 'headband', color: '#e63946', cost: 10, en: 'Red headband', ar: 'عصابة حمرا' },
    { id: 'hb-blue', slot: 'headband', color: '#3d7dff', cost: 10, en: 'Blue headband', ar: 'عصابة زرقا' },
    { id: 'hb-gold', slot: 'headband', color: '#ffd166', cost: 20, en: 'Gold headband', ar: 'عصابة دهبي' }
  ],
  items() { return [...this.BELTS, ...this.HEADBANDS]; },
  find(id) { return this.items().find(x => x.id === id); },

  key() { return `taekwondoJourneyShop:${TKD.pid() || 'guest'}`; },
  data() {
    const d = TKD.read(this.key(), null);
    if (d && d.owned && d.equipped) return d;
    return { owned: ['belt-white', 'hb-none'], equipped: { belt: 'belt-white', headband: 'hb-none' }, spent: 0 };
  },
  save(d) { TKD.write(this.key(), d); },

  // stars earned across every kick, whether that kick is unlocked yet or
  // not, plus any daily-mission gifts the child has claimed
  earned() {
    let n = 0;
    (GameConfig.SKILL_ORDER || []).forEach(id => {
      try { n += window.Journey.starTotal(window.Journey.steps(id)); } catch (e) { /* not ready yet */ }
    });
    try { n += window.Mission?.bonusStars() || 0; } catch (e) { /* not ready yet */ }
    return n;
  },
  balance() { return Math.max(0, this.earned() - this.data().spent); },
  owns(id) { return this.data().owned.includes(id); },
  equipped(slot) { return this.data().equipped[slot]; },

  buy(id) {
    const item = this.find(id); if (!item) return false;
    const d = this.data();
    if (!d.owned.includes(id)) {
      if (this.balance() < item.cost) return false;
      d.owned.push(id); d.spent += item.cost;
    }
    d.equipped[item.slot] = id;
    this.save(d);
    return true;
  },
  equip(id) {
    const item = this.find(id); if (!item || !this.owns(id)) return false;
    const d = this.data(); d.equipped[item.slot] = id; this.save(d);
    return true;
  },
  cosmetics() {
    const d = this.data();
    const belt = this.find(d.equipped.belt) || this.BELTS[0];
    const hb = this.find(d.equipped.headband) || this.HEADBANDS[0];
    return { belt: belt.color, headband: hb.color };
  },

  // ---------------------------------------------------------------- drawing
  // Anchors a coloured band to a point in a bone's own local space (found by
  // eye against every kick + the idle map sprite) — the same point→screen
  // mapping the rig engine uses for real atlas pieces, so it moves, rotates
  // and scales with the fighter through every kick.
  _frame(sk, ctx, x, y, scale, flip, boneName, lx, ly) {
    const i = sk.data.boneIndex[boneName]; if (i === undefined) return null;
    const w = i * 6, W = sk.world;
    const fx = flip ? -scale : scale;
    const p = sk.point(boneName, lx, ly);
    const ang = Math.atan2(-W[w + 2], (flip ? -1 : 1) * W[w]);
    return { x: x + fx * p.x, y: y - scale * p.y, ang };
  },
  drawCosmetics(sk, ctx, x, y, scale, flip = false, alpha = 1) {
    if (!sk || !sk.data || alpha <= 0) return;
    const cos = this.cosmetics();
    if (!cos.belt && !cos.headband) return;
    const H = sk.data.extra?.height || 1000, s = Math.abs(scale);
    ctx.save(); ctx.globalAlpha *= alpha;
    const round = (c, rx, ry, rw, rh, r) => { c.beginPath(); c.roundRect ? c.roundRect(rx, ry, rw, rh, r) : c.rect(rx, ry, rw, rh); c.fill(); };
    if (cos.belt) {
      // 'body' bone's own origin sits near the collar; the waist is a fixed
      // stretch further down its local x-axis. In the band's own frame +x runs
      // up the torso and +y across it, so the wrap is thin in x, wide in y,
      // and the knot's tails hang back down -x.
      const fr = this._frame(sk, ctx, x, y, scale, flip, 'body', H * 0.036, 0);
      if (fr) {
        const t = H * 0.038 * s, w = H * 0.155 * s, front = (flip ? -1 : 1) * w * 0.32;
        ctx.save(); ctx.translate(fr.x, fr.y); ctx.rotate(fr.ang);
        ctx.fillStyle = cos.belt;
        round(ctx, -t / 2, -w * 0.56, t, w, t * 0.34);                     // the wrap around the waist
        // two thin tails hanging down (-x) from the knot at the front
        const tw = t * 0.5, tl = H * 0.085 * s;
        [-0.8, 0.8].forEach((off, i) => {
          ctx.save();
          ctx.translate(-t * 0.2, front + off * tw);
          ctx.rotate((i ? -1 : 1) * 0.13);
          round(ctx, -tl, -tw / 2, tl, tw, tw * 0.45);
          ctx.restore();
        });
        round(ctx, -t * 0.62, front - t * 0.62, t * 1.24, t * 1.24, t * 0.3); // the knot itself
        ctx.fillStyle = 'rgba(0,0,0,.18)';                                 // a crease so it reads as cloth
        ctx.fillRect(-t / 2, -w / 2, t * 0.26, w);
        ctx.restore();
      }
    }
    if (cos.headband) {
      // 'head' bone's origin is at the neck; a short way along it lands on
      // the forehead, just above the eyes.
      const fr = this._frame(sk, ctx, x, y, scale, flip, 'head', 120, 0);
      if (fr) {
        const hL = sk.data.bones[sk.data.boneIndex.head]?.length || 160;
        const t = hL * 0.17 * s, w = hL * 0.72 * s, back = (flip ? 1 : -1) * w * 0.5;
        ctx.save(); ctx.translate(fr.x, fr.y); ctx.rotate(fr.ang);
        ctx.fillStyle = cos.headband;
        round(ctx, -t / 2, -w / 2, t, w, t * 0.45);                        // the band across the brow
        // its knot streams backwards off the back of the head (-y), angled down
        const tw = t * 0.36, tl = hL * 0.2 * s, dir = flip ? 1 : -1;
        [-0.7, 0.7].forEach((off, i) => {
          ctx.save();
          ctx.translate(-t * 0.12 + off * tw, back);
          ctx.rotate((i ? -1 : 1) * 0.22 * dir);
          round(ctx, -tw / 2, dir < 0 ? -tl : 0, tw, tl, tw * 0.5);
          ctx.restore();
        });
        ctx.fillStyle = 'rgba(0,0,0,.14)';
        ctx.fillRect(-t / 2, -w / 2, t * 0.25, w);
        ctx.restore();
      }
    }
    ctx.restore();
  },

  // ------------------------------------------------ cosmetics over a PHOTO
  // Most screens draw the fighter with the skeletal rig, so drawCosmetics()
  // above just rides along. The pose game ("form control") is the exception:
  // it shows the canonical *photos* of each kick phase. The rig was cut from
  // those same photos, so posing an off-screen skeleton at the same phase
  // tells us exactly where that photo's waist and forehead are — we then draw
  // only the belt/headband onto a transparent canvas laid over the picture.
  //
  // Anchoring needs three numbers per picture, measured from the picture
  // itself (they differ per kick set): where the figure's feet are, where the
  // standing foot is across, and how many pixels one rig unit is worth. They
  // are measured once per character+kick from a downscaled copy (cheap: ~20k
  // pixels) and cached, so nothing has to ship or go stale when art changes.
  _photoCache: {},
  _loadImg(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; }); },
  // What a drawn figure occupies: its alpha box plus where the standing foot
  // is across. Used on BOTH the picture and an off-screen render of the rig in
  // the same pose, so the two can be matched without assuming anything about
  // how either was framed.
  _silhouette(ctx, W, H) {
    let d; try { d = ctx.getImageData(0, 0, W, H).data; } catch (e) { return null; }
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
      if (d[(y * W + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    const band = Math.max(1, Math.round((y1 - y0) * 0.025));    // the few rows the feet stand on
    let sx = 0, n = 0;
    for (let y = y1 - band; y <= y1; y++) for (let x = x0; x <= x1; x++)
      if (d[(y * W + x) * 4 + 3] > 24) { sx += x; n++; }
    return { x0, y0, x1, y1, footX: n ? sx / n : (x0 + x1) / 2 };
  },
  _measureImage(img) {                                          // in the picture's own pixels
    const W = 96, H = Math.max(1, Math.round(img.height / img.width * W));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, W, H);
    const s = this._silhouette(g, W, H);
    if (!s) return null;
    const k = img.width / W;
    return { top: s.y0 * k, bottom: s.y1 * k, footX: s.footX * k, iw: img.width, ih: img.height };
  },
  _measureRig(skel) {                                           // draw it once off-screen and look
    const W = 220, H = 190, ox = W / 2, oy = H - 9, s = (H - 26) / (skel.data.extra?.height || 1000);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true });
    try { skel.draw(g, ox, oy, s); } catch (e) { return null; }
    const m = this._silhouette(g, W, H);
    if (!m) return null;
    // everything relative to the origin the rig was drawn from, in rig units
    return { height: (m.y1 - m.y0) / s, footDX: (m.footX - ox) / s, footDY: (m.y1 - oy) / s };
  },
  async photoAnchors(ch, skillId, frames) {
    const cacheKey = `${ch}|${skillId}`;
    if (this._photoCache[cacheKey]) return this._photoCache[cacheKey];
    this._photoCache[cacheKey] = (async () => {
      // Needs the rig's data purely as a measuring stick for where cosmetics
      // sit on the PHOTO — unrelated to whether the live skeleton is drawn
      // on screen (TKDAnim.enabled()), which stays off by default.
      if (!window.TKDAnim) return null;
      const rig = await TKDAnim.character(ch);
      const anim = rig && TKDAnim.kickAnim(rig.data, skillId);
      if (!anim) return null;                                   // e.g. the side kick keeps its pictures
      return { rig, anim, times: rig.player.phaseTimes(anim), skel: new TKDAnim.Skeleton(rig.data), per: {}, keys: Object.keys(frames) };
    })();
    return this._photoCache[cacheKey];
  },
  // one phase's numbers, worked out the first time that phase is shown — a
  // child usually passes through two or three, so measuring all five up front
  // would be work thrown away on a slow phone
  async phaseAnchor(A, frames, phaseKey) {
    if (!A) return null;
    if (phaseKey in A.per) return A.per[phaseKey];
    const i = A.keys.indexOf(phaseKey);
    const img = await this._loadImg(frames[phaseKey]);
    const pic = img && this._measureImage(img);
    let out = null;
    if (pic) {
      TKDAnim.poseAt(A.skel, A.anim, A.times[i < 0 ? 0 : i] ?? 0);
      const r = this._measureRig(A.skel);
      // same pose, same character → the two silhouettes differ only by a
      // scale and a shift, which these three numbers pin down exactly
      if (r && r.height) {
        const unit = (pic.bottom - pic.top) / r.height;          // picture pixels per rig unit
        out = { ...pic, unit, originX: pic.footX - r.footDX * unit, originY: pic.bottom - r.footDY * unit };
      }
    }
    if (out) A.per[phaseKey] = out;        // a picture that wasn't ready yet deserves another go
    return out;
  },
  // Draw the equipped cosmetics over an element whose background-image is the
  // phase picture (background-size: contain; background-position: 50% 100%).
  // → true drew it · false nothing to draw here (no cosmetics, or a kick with
  //   no skeleton) · null not ready yet, worth another go in a moment
  async drawOnPhoto(host, { ch = 'boy', skillId = 'apchagi', frames = {}, phaseKey = '' } = {}) {
    if (!host) return false;
    const cos = this.cosmetics();
    let cv = host.querySelector('.cos-photo');
    if (!cos.belt && !cos.headband) { cv?.remove(); return false; }
    const A = await this.photoAnchors(ch, skillId, frames);
    if (!A) { cv?.remove(); return false; }                     // e.g. the side kick keeps its pictures
    const m = await this.phaseAnchor(A, frames, phaseKey);
    cv = host.querySelector('.cos-photo');                      // may have changed while loading
    // loading is async: by now the child may have moved on to another phase,
    // kick or character, and painting the old one would leave it stranded
    // …and a late one must not wipe the layer a newer paint already drew
    const showing = getComputedStyle(host).backgroundImage || '';
    const want = (frames[phaseKey] || '').split('/').pop();
    if (!m || (want && !showing.includes(want))) return null;
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return null;
    if (!cv) { cv = document.createElement('canvas'); cv.className = 'cos-photo'; cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv); }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    // where `contain` actually puts the picture inside the box (bottom-centred)
    const k = Math.min(w / m.iw, h / m.ih);
    const left = (w - m.iw * k) / 2, top = h - m.ih * k;
    const i = A.keys.indexOf(phaseKey);
    TKDAnim.poseAt(A.skel, A.anim, A.times[i < 0 ? 0 : i] ?? 0);
    this.drawCosmetics(A.skel, g, left + m.originX * k, top + m.originY * k, m.unit * k);
    return true;
  },

  // ---------------------------------------------------------------- UI
  cardHTML(item) {
    const owned = this.owns(item.id), on = this.equipped(item.slot) === item.id;
    const label = TKD.t(item.en, item.ar);
    const swatch = item.color ? `<span class="shop-swatch" style="--c:${item.color}"></span>` : `<span class="shop-swatch shop-swatch-none">✕</span>`;
    return `<button type="button" class="shop-card ${on ? 'is-on' : ''}" data-buy="${item.id}">
      ${swatch}
      <b>${TKD.esc(label)}</b>
      ${on ? `<small class="shop-tag shop-tag-on">${TKD.t('Wearing', 'شغّال دلوقتي')}</small>`
        : owned ? `<small class="shop-tag">${TKD.t('Owned — tap to wear', 'عندك — دوس تلبسه')}</small>`
        : `<small class="shop-tag shop-tag-cost">⭐ ${TKD.num(item.cost)}</small>`}
    </button>`;
  },
  html() {
    const bal = this.balance();
    return `<div class="shop-modal" id="shop-modal">
      <div class="shop-card-sheet">
        <button type="button" class="shop-close" aria-label="${TKD.t('Close', 'قفل')}">✕</button>
        <h2>🛍️ ${TKD.t('Star Shop', 'متجر النجوم')}</h2>
        <p class="shop-balance">⭐ <b>${TKD.num(bal)}</b> ${TKD.t('stars to spend', 'نجمة معاك')}</p>
        <h3>${TKD.t('Belt colour', 'لون الحزام')}</h3>
        <div class="shop-grid">${this.BELTS.map(i => this.cardHTML(i)).join('')}</div>
        <h3>${TKD.t('Headband', 'عصابة الراس')}</h3>
        <div class="shop-grid">${this.HEADBANDS.map(i => this.cardHTML(i)).join('')}</div>
      </div>
    </div>`;
  },
  open() {
    document.getElementById('shop-modal')?.remove();
    document.body.insertAdjacentHTML('beforeend', this.html());
    this.bind();
    AudioKit?.sfx?.('ui-pop', { gain: 0.4 });
  },
  refresh() {
    const m = document.getElementById('shop-modal'); if (!m) return;
    m.outerHTML = this.html();
    this.bind();
  },
  bind() {
    const m = document.getElementById('shop-modal'); if (!m) return;
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('.shop-close')) { m.remove(); return; }
      const btn = e.target.closest('[data-buy]'); if (!btn) return;
      const id = btn.dataset.buy, item = this.find(id);
      if (!item) return;
      if (this.owns(id)) { this.equip(id); AudioKit?.sfx?.('click', { gain: 0.4 }); }
      else if (this.balance() >= item.cost) {
        this.buy(id);
        AudioKit?.sfx?.('star', { gain: 0.5 });
        TKD.toast(TKD.t(`Bought the ${TKD.t(item.en, item.ar)}!`, `اشتريت ${item.ar}!`), 'success');
      } else {
        TKD.toast(TKD.t('Not enough stars yet — play more kicks!', 'مش معاك نجوم كفاية — كمّل لعب!'), 'info');
        return;
      }
      this.refresh();
    });
  },
  mountEntryPoints() {
    // the map's star badge — cheap to re-mark every time (the map redraws
    // its own DOM after every game, not just on a screen change); the click
    // itself is handled by a delegated listener below so it never goes stale
    const stars = document.querySelector('.jr-stars');
    if (stars && !stars.hasAttribute('role')) { stars.setAttribute('role', 'button'); stars.setAttribute('tabindex', '0'); }
    // the trophy room — where a kid already comes to see what they earned
    const tr = document.querySelector('#trophy-room-screen .game-container');
    if (tr && !tr.querySelector('.shop-open-btn')) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'shop-open-btn';
      b.innerHTML = `🛍️ ${TKD.t('Star Shop', 'متجر النجوم')}`;
      b.addEventListener('click', () => this.open());
      tr.insertBefore(b, tr.querySelector('.trophy-room-counter') || tr.firstChild.nextSibling);
    }
  },
  init() {
    document.addEventListener('tkd:screen', (e) => {
      const id = e.detail?.screenId;
      if (id === 'trophy-room' || id === 'home') setTimeout(() => this.mountEntryPoints(), 60);
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('.jr-stars')) this.open();
    });
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.jr-stars')) { e.preventDefault(); this.open(); }
    });
  }
};
window.Shop = Shop;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Shop.init()); else Shop.init();
