// =====================================================================
// IMAGE FALLBACK — verifies each skill/phase image actually loads; if an
// asset is missing (e.g. Naeryeo Chagi / Bik Chagi frames not yet supplied),
// swaps to a generated placeholder instead of leaving a broken image icon.
// Elements opt in by carrying data-img-url (and optionally data-img-color).
// =====================================================================
function _verifyOneImage(el) {
  const url = el.dataset.imgUrl;
  if (!url || el.dataset.imgCheckedUrl === url) return;
  el.dataset.imgCheckedUrl = url;
  el.classList.remove('img-pending');
  const img = new Image();
  img.onerror = () => {
    if (el.dataset.imgUrl !== url) return; // url changed since this check started
    el.style.backgroundImage = 'none';
    el.classList.add('img-pending');
    const color = el.dataset.imgColor;
    if (color) el.style.setProperty('--pending-color', color);
  };
  img.src = url.replace(/ /g, '%20');
}

function scanAndVerifyImages(root) {
  const scope = root || document;
  if (scope.nodeType === 1 && scope.matches && scope.matches('[data-img-url]')) _verifyOneImage(scope);
  scope.querySelectorAll('[data-img-url]').forEach(_verifyOneImage);
}

// For direct (non-template) background-image assignments: sets the image
// optimistically, then verifies it and falls back to the placeholder look
// if it 404s.
function setBgWithFallback(el, url, color) {
  if (!el || !url) return;
  const safeUrl = url.replace(/ /g, '%20');
  el.style.backgroundImage = `url('${safeUrl}')`;
  el.classList.remove('img-pending');
  el.dataset.imgUrl = safeUrl;
  if (color) el.dataset.imgColor = color;
  delete el.dataset.imgCheckedUrl;
  scanAndVerifyImages(el);
}

// Lesson/warm-up videos are lazy (preload="metadata", fetched only when the
// player reaches that screen — see sw.js's precacheVideos()). On slow gym
// wifi that left a blank frozen player with nothing telling a kid whether
// it was still loading or broken. This puts a spinner over the video's
// parent while it isn't ready to play yet.
function watchVideoLoading(video) {
  if (!video || video.dataset.loadingWatched) return;
  video.dataset.loadingWatched = '1';
  const wrap = video.parentElement;
  if (!wrap) return;
  wrap.classList.add('tkd-video-wrap');
  const mark = () => wrap.classList.toggle('tkd-video-loading', video.readyState < 3 && !video.error);
  ['loadstart', 'waiting', 'canplay', 'playing', 'error', 'emptied'].forEach(ev => video.addEventListener(ev, mark));
  mark();
}

// =====================================================================
// SPEECH / AUDIO DICTIONARY — uses the browser's built-in Web Speech API
// (no audio files needed) to (a) pronounce Korean Taekwondo terms and
// (b) read instructions aloud for kids who can't read fluently yet.
// =====================================================================
const SpeechHelper = {
  supported: typeof window !== 'undefined' && 'speechSynthesis' in window,

  speak(text, lang = 'en-US', btn = null) {
    if (!this.supported || !text) return;
    try {
      window.speechSynthesis.cancel(); // don't stack overlapping utterances
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      // Arabic: prefer an Egyptian voice (the texts are Egyptian colloquial),
      // then any Arabic voice the device has.
      if (lang.startsWith('ar')) {
        const voices = window.speechSynthesis.getVoices() || [];
        const v = voices.find(x => /^ar[-_]EG/i.test(x.lang)) || voices.find(x => /^ar\b/i.test(x.lang));
        if (v) { utter.voice = v; utter.lang = v.lang; }
      }
      utter.rate = 0.9;
      if (btn) {
        btn.classList.add('speaking');
        utter.onend = () => btn.classList.remove('speaking');
        utter.onerror = () => btn.classList.remove('speaking');
      }
      window.speechSynthesis.speak(utter);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  },

  // Renders a small round speaker button that speaks `text` when tapped.
  // koreanText: optional Korean/romanized term spoken with a Korean voice
  // (falls back to the main text/lang if not provided) — this is the
  // "audio dictionary" for terms like Junbi, Ap Chagi, Kihap.
  makeButton(text, lang = 'en-US', koreanText = null) {
    if (!this.supported) return null;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'speak-btn';
    btn.title = 'Listen';
    btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.speak(koreanText || text, koreanText ? 'ko-KR' : lang, btn);
    });
    return btn;
  }
};

