/* =====================================================================
   TAEKWONDO JOURNEY — SERVICE WORKER
   Caches the whole game so it keeps working inside a gym with no signal:
   the app shell (HTML/CSS/JS/manifest, 3D + skeleton rigs, sounds), the backgrounds,
   and the lesson / warm-up videos are stored on the first online visit.
   - HTML: network-first (fresh version when online, cached shell offline,
     never waits more than NAV_TIMEOUT_MS on a dead gym wifi).
   - JS/CSS/JSON: stale-while-revalidate, so code updates still arrive.
   - Images/videos: precached; videos answer Range requests from the cache.
   The file lists below must match what is on disk; bump CACHE_VERSION
   whenever anything changes so players get the update.
   ===================================================================== */

const CACHE_VERSION = 'tkd-v56c';
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;     // precached images + videos, never trimmed
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;  // anything else same-origin, trimmed
const RUNTIME_MAX_ENTRIES = 250;
const NAV_TIMEOUT_MS = 4000;

const APP_SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './assets/icons/icons.css',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './privacy.html',
  './assets/anim/boy/boy.atlas',
  './assets/anim/boy/boy.json',
  './assets/anim/boy/boy.webp',
  './assets/anim/girl/girl.atlas',
  './assets/anim/girl/girl.json',
  './assets/anim/girl/girl.webp',
  './assets/lib/three.module.min.js',
  './assets/lib/tk3d/tk3d.js',
  './assets/lib/tk3d/character.js',
  './assets/lib/tk3d/kicks.js',
  './club-config.js',
  './assets/lib/cloud/backend.js',
  './assets/audio/music/arena.mp3',
  './assets/audio/music/dojo.mp3',
  './assets/audio/sfx/bag-thud.mp3',
  './assets/audio/sfx/board-crack.mp3',
  './assets/audio/sfx/clap.mp3',
  './assets/audio/sfx/error.mp3',
  './assets/audio/sfx/gong.mp3',
  './assets/audio/sfx/hit-1.mp3',
  './assets/audio/sfx/hit-2.mp3',
  './assets/audio/sfx/hit-3.mp3',
  './assets/audio/sfx/hit-heavy.mp3',
  './assets/audio/sfx/rim.mp3',
  './assets/audio/sfx/star.mp3',
  './assets/audio/sfx/success.mp3',
  './assets/audio/sfx/taiko.mp3',
  './assets/audio/sfx/tick.mp3',
  './assets/audio/sfx/ui-click.mp3',
  './assets/audio/sfx/ui-pop.mp3',
  './assets/audio/sfx/whoosh-1.mp3',
  './assets/audio/sfx/whoosh-2.mp3',
  './assets/audio/sfx/whoosh-3.mp3',
  './assets/audio/sfx/win.mp3',
  './assets/audio/voice/manifest.json',
  './assets/audio/voice/manifest.js',
  './assets/videos/apchagi-tutorial.ar.vtt',
  './assets/videos/apchagi-tutorial.en.vtt',
  './assets/videos/naeryeochagi-tutorial.ar.vtt',
  './assets/videos/naeryeochagi-tutorial.en.vtt',
  './assets/videos/bikchagi-tutorial.ar.vtt',
  './assets/videos/bikchagi-tutorial.en.vtt'
];

const IMAGE_FILES = [
  './assets/images/backgrounds/arena_bg.webp',
  './assets/images/backgrounds/basic_techniques_bg.webp',
  './assets/images/backgrounds/belt_training_bg.webp',
  './assets/images/backgrounds/dojo_interior_bg.webp',
  './assets/images/backgrounds/forms_practice_bg.webp',
  './assets/images/backgrounds/main_menu_bg.webp',
  './assets/images/backgrounds/memory_dojo_bg.webp',
  './assets/images/backgrounds/puzzle_challenge_bg.webp',
  './assets/images/backgrounds/quiz_room_bg.webp',
  './assets/images/backgrounds/reflex_arena_bg.webp',
  './assets/images/backgrounds/sparring_training_bg.webp',
  './assets/images/backgrounds/technique_quiz_bg.webp',
  './assets/videos/apchagi-tutorial.webp',
  './assets/videos/naeryeochagi-tutorial.webp',
  './assets/videos/bikchagi-tutorial.webp'
];

const VIDEO_FILES = [
  './assets/videos/apchagi-tutorial.mp4',
  './assets/videos/bikchagi-tutorial.mp4',
  './assets/videos/naeryeochagi-tutorial.mp4',
  './assets/videos/warmup/double_leg_hamstring.mp4',
  './assets/videos/warmup/forward_lunge.mp4',
  './assets/videos/warmup/jumping_jacks.mp4',
  './assets/videos/warmup/lateral_lunge.mp4',
  './assets/videos/warmup/single_leg_hamstring.mp4',
  './assets/videos/warmup/straddle_fold.mp4',
  './assets/videos/warmup/straddle_side_reach.mp4'
];

// cache.addAll() is all-or-nothing: if ANY single file 404s, everything
// silently fails to cache. Cache each file independently instead.
function addOne(cache, file) {
  return cache.add(new Request(file, { cache: 'reload' })).catch((err) =>
    console.warn(`SW install: failed to cache ${file}`, err)
  );
}

// Videos are big (several MB in total), so they are fetched one at a time and
// skipped when already stored. Safe to call repeatedly; concurrent calls share
// one run. Any file that fails (connection dropped) is retried next time.
let videoPrecacheRun = null;
function precacheVideos() {
  if (!videoPrecacheRun) {
    videoPrecacheRun = (async () => {
      const cache = await caches.open(ASSET_CACHE);
      for (const file of VIDEO_FILES) {
        const url = new Request(file).url;
        if (await cache.match(url)) continue;
        await addOne(cache, file);
      }
    })().finally(() => { videoPrecacheRun = null; });
  }
  return videoPrecacheRun;
}

// v55 — the coach's recorded voice lines (assets/audio/voice/<lang>/<file>, listed in
// manifest.json) are stored too, so the coach's voice also plays in a gym with no signal.
let voicePrecacheRun = null;
function precacheVoice() {
  if (!voicePrecacheRun) {
    voicePrecacheRun = (async () => {
      const res = await fetch('./assets/audio/voice/manifest.json', { cache: 'no-cache' }).catch(() => null);
      if (!res || !res.ok) return;
      const man = await res.json().catch(() => ({}));
      const cache = await caches.open(ASSET_CACHE);
      for (const [lang, files] of Object.entries(man || {})) {
        for (const f of Object.values(files || {})) {
          const file = `./assets/audio/voice/${lang}/${f}`;
          if (await cache.match(new Request(file).url)) continue;
          await addOne(cache, file);
        }
      }
    })().catch(() => {}).finally(() => { voicePrecacheRun = null; });
  }
  return voicePrecacheRun;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(APP_SHELL_CACHE);
    const assets = await caches.open(ASSET_CACHE);
    await Promise.all([
      ...APP_SHELL_FILES.map((file) => addOne(shell, file)),
      ...IMAGE_FILES.map((file) => addOne(assets, file))
    ]);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keep = [APP_SHELL_CACHE, ASSET_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('tkd-') && !keep.includes(key))
            .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      // Started after activation and NOT awaited, so the big video download
      // never holds up page loads. Navigations re-trigger it (see networkFirst).
      .then(() => { precacheVideos().catch(() => {}); precacheVoice(); })
  );
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  // Cache Storage keeps insertion order, so the oldest entries come first.
  for (let i = 0; i < keys.length - maxEntries; i++) await cache.delete(keys[i]);
}

// HTML: try the network (fresh version); fall back to the cached shell when
// offline OR when the network takes longer than NAV_TIMEOUT_MS to answer.
async function networkFirst(event, req) {
  const cache = await caches.open(APP_SHELL_CACHE);
  const fallback = async () =>
    (await cache.match(req, { ignoreSearch: true })) ||
    (await cache.match('./index.html')) ||
    null;

  const network = fetch(req).then((response) => {
    if (response && response.ok) {
      const copy = response.clone();
      cache.put('./index.html', copy).catch(() => {});
    }
    return response;
  });

  const cached = await fallback();
  if (!cached) return network.catch(() => Response.error());   // first ever visit

  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NAV_TIMEOUT_MS));
  try {
    const winner = await Promise.race([network, timeout]);
    if (winner) {
      event.waitUntil(Promise.all([precacheVideos().catch(() => {}), precacheVoice()]));   // online: top up any missing videos / voice lines
      return winner;
    }
    event.waitUntil(network.catch(() => {}));                  // let the slow request still refresh the cache
    return cached;
  } catch (err) {
    return cached;
  }
}

// Our own JS/CSS: answer instantly from cache, refresh in the
// background — so an update to game.js/style.css reaches players on their
// next visit instead of being stuck behind cache-first forever.
async function staleWhileRevalidate(event, req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req, { ignoreSearch: cacheName === APP_SHELL_CACHE });
  const network = fetch(req)
    .then((response) => {
      // type 'opaque' (status 0) is accepted too, for links without crossorigin.
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(req, response.clone());
      }
      return response;
    })
    .catch(() => null);
  if (cached) {
    event.waitUntil(network);
    return cached;
  }
  return (await network) || Response.error();
}

// Videos: serve from the cache whenever the file is stored — including the
// Range requests <video> makes for playback and seeking (answered as 206).
// Not stored yet → let the network handle it untouched.
// v55: sounds too — the music and the coach's voice play through <audio>, which also asks
// with Range headers; before, those went straight to the network and stayed silent offline.
async function serveVideo(req) {
  const cached = await caches.match(req.url);   // any of our caches, by URL only (ignores the Range header)
  if (!cached) {
    try { return await fetch(req); } catch (err) { return Response.error(); }
  }
  const rangeHeader = req.headers.get('range');
  if (!rangeHeader) return cached;

  const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!m || (m[1] === '' && m[2] === '')) return cached;
  const blob = await cached.blob();
  const size = blob.size;
  let start, end;
  if (m[1] === '') {                        // "bytes=-N" → the last N bytes
    start = Math.max(0, size - parseInt(m[2], 10));
    end = size - 1;
  } else {
    start = parseInt(m[1], 10);
    end = m[2] === '' ? size - 1 : Math.min(parseInt(m[2], 10), size - 1);
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || (/\.(mp3|m4a|ogg|wav|aac)$/i.test(new URL(req.url).pathname) ? 'audio/mpeg' : 'video/mp4'),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}

// Same-origin images and other media: cache-first, fill cache at runtime.
async function cacheFirst(event, req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const response = await fetch(req);
    // Only cache complete, successful same-origin responses.
    if (response && response.status === 200 && response.type === 'basic') {
      const copy = response.clone();
      event.waitUntil(
        caches.open(RUNTIME_CACHE)
          .then((cache) => cache.put(req, copy))
          .then(() => trimCache(RUNTIME_CACHE, RUNTIME_MAX_ENTRIES))
      );
    }
    return response;
  } catch (err) {
    return Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isVideoAsset = req.destination === 'video' || req.destination === 'audio' || /\.(mp4|webm|mov|m4v|mp3|m4a|ogg|wav|aac)$/i.test(url.pathname);

  if (url.origin === self.location.origin && isVideoAsset) {
    event.respondWith(serveVideo(req));
    return;
  }

  // Any other Range request: let the browser handle it directly.
  if (req.headers.has('range')) return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(event, req));
    return;
  }

  if (url.origin !== self.location.origin) return; // other cross-origin: don't touch

  if (/\.(js|css|json)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event, req, APP_SHELL_CACHE));
    return;
  }

  event.respondWith(cacheFirst(event, req));
});