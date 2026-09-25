// ============================================================================
// DAILY MISSION (v31) — a small box on the map: "play 2 things today, get a
// gift". Riding on the existing attempts log and practice streak, not a new
// tracking system. The reward is bonus stars, spendable in the Star Shop.
// ============================================================================
const Mission = {
  TARGET: 2,
  REWARD: 5,

  key() { return `taekwondoJourneyMission:${TKD.pid() || 'guest'}`; },
  data() {
    const d = TKD.read(this.key(), null);
    const today = TKD.dayKey();
    if (d && d.day === today) return d;
    return { day: today, claimed: false, bonusStars: d?.bonusStars || 0 };
  },
  save(d) { TKD.write(this.key(), d); },

  // however many things the child played today, regardless of which
  progressToday() {
    const pid = TKD.pid(), day = TKD.dayKey();
    if (!pid) return 0;
    try { return PlayerSystem.getAttempts().filter(a => a.playerId === pid && TKD.dayKey(a.ts) === day).length; }
    catch (e) { return 0; }
  },
  progress() { return Math.min(this.TARGET, this.progressToday()); },
  isDone() { return this.progressToday() >= this.TARGET; },
  isClaimed() { return this.data().claimed; },
  bonusStars() { return this.data().bonusStars || 0; },

  claim() {
    const d = this.data();
    if (d.claimed || !this.isDone()) return false;
    d.claimed = true; d.bonusStars = (d.bonusStars || 0) + this.REWARD;
    this.save(d);
    return true;
  },

  // ---------------------------------------------------------------- UI
  html() {
    const done = this.isDone(), claimed = this.isClaimed(), p = this.progress();
    const cls = claimed ? 'is-claimed' : done ? 'is-done' : '';
    const body = claimed
      ? `<b>${TKD.t('Today’s mission — done!', 'مهمة اليوم — خلصت!')}</b><small>${TKD.t('Come back tomorrow for a new one', 'تعال بكرة لمهمة جديدة')}</small>`
      : done
        ? `<b>${TKD.t('Mission complete — claim your gift!', 'خلصت المهمة — خد هديتك!')}</b><small>${TKD.t('Tap to collect ⭐ %n stars', 'دوس تاخد ⭐ %n نجوم').replace('%n', TKD.num(this.REWARD))}</small>`
        : `<b>${TKD.t('Today’s mission', 'مهمة اليوم')}</b><small>${TKD.t(`Play ${this.TARGET} things today for a gift`, `العب ${TKD.num(this.TARGET)} حاجة النهارده وخد هدية`)}</small>`;
    return `<button type="button" class="mission-box ${cls}" id="mission-box" ${claimed ? 'disabled' : ''}>
      <span class="mission-ico">${claimed ? '✅' : done ? '🎁' : '📋'}</span>
      <span class="mission-text">${body}</span>
      ${!claimed ? `<span class="mission-dots" aria-hidden="true">${Array.from({ length: this.TARGET }, (_, i) => `<i class="${i < p ? 'on' : ''}"></i>`).join('')}</span>` : ''}
    </button>`;
  },
  mount() {
    const board = document.querySelector('.jr-map .jr-head');
    if (!board || !board.parentNode) return;
    const host = board.parentNode;
    const prev = host.querySelector('#mission-box');
    const wasClaimed = prev?.classList.contains('is-claimed');
    const html = this.html();
    if (prev) { if (prev.outerHTML === html) return; prev.outerHTML = html; }
    else host.insertBefore(document.createRange().createContextualFragment(html), board.nextSibling);
    const box = document.getElementById('mission-box');
    box?.addEventListener('click', () => {
      if (!this.claim()) return;
      AudioKit?.sfx?.('star', { gain: 0.6 });
      TKD.toast(TKD.t(`Gift claimed — +${this.REWARD} stars!`, `أخدت الهدية — +${TKD.num(this.REWARD)} نجوم!`), 'success');
      this.mount();
    });
    if (!wasClaimed && this.isDone() && !this.isClaimed()) box?.classList.add('mission-pop');
  },
  init() {
    document.addEventListener('tkd:screen', (e) => { if (e.detail?.screenId === 'home') setTimeout(() => this.mount(), 80); });
    // a game just finished — the mission's progress dots (and gift, once
    // earned) should be there the moment the child gets back to the map
    document.addEventListener('tkd:player-changed', () => this.mount());
  }
};
window.Mission = Mission;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Mission.init()); else Mission.init();
