// =====================================================================
// CLIENT ERROR LOG — this game runs on real kids' devices in gyms and
// schools with zero telemetry; without this, a crash on some tablet is
// invisible to us. Keeps the last few errors in localStorage only (never
// sent anywhere — no backend exists to send them to) so a hidden debug
// screen or a dev with the device in hand can see what actually broke.
// Loaded FIRST (before every other script) so it also catches mistakes
// during their initial execution, not just later at runtime.
// =====================================================================
(function () {
  const KEY = 'taekwondoJourneyErrorLog';
  const MAX = 25;

  function record(entry) {
    try {
      const log = JSON.parse(localStorage.getItem(KEY) || '[]');
      log.push(entry);
      while (log.length > MAX) log.shift();
      localStorage.setItem(KEY, JSON.stringify(log));
    } catch {
      /* storage full or unavailable (private mode) — nothing more we can do */
    }
  }

  window.addEventListener('error', (e) => {
    record({
      t: Date.now(),
      type: 'error',
      message: String(e.message || '').slice(0, 500),
      source: `${e.filename || ''}:${e.lineno || 0}:${e.colno || 0}`,
      stack: String((e.error && e.error.stack) || '').slice(0, 1000),
      url: location.href,
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    record({
      t: Date.now(),
      type: 'promise',
      message: String((reason && reason.message) || reason || '').slice(0, 500),
      stack: String((reason && reason.stack) || '').slice(0, 1000),
      url: location.href,
    });
  });

  window.TKDErrorLog = {
    all: () => {
      try {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
      } catch {
        return [];
      }
    },
    clear: () => {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* nothing to clean up */
      }
    },
  };
})();
