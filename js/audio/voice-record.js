// ============================================================================
// VOICE RECORDER — lets the coach record the Egyptian voice-over lines right
// on the phone, no computer needed. Recordings are saved on THIS device only
// (IndexedDB — the app is fully offline, there is no server to upload to) and
// take priority over any shipped assets/audio/voice file with the same line,
// so a coach who records a sentence hears it immediately, everywhere the game
// would have played it.
// ============================================================================
const VoiceRecorder = {
  DB: 'tkdVoiceDB', STORE: 'clips', VERSION: 1,
  _db: null, _urls: new Map(), _lines: null,
  _rec: null, _stream: null, _chunks: [], _activeKey: null,

  db() {
    if (this._db) return Promise.resolve(this._db);
    if (typeof indexedDB === 'undefined') return Promise.reject(new Error('no indexedDB'));
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB, this.VERSION);
      req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(this.STORE)) req.result.createObjectStore(this.STORE, { keyPath: 'key' }); };
      req.onsuccess = () => { this._db = req.result; resolve(this._db); };
      req.onerror = () => reject(req.error);
    });
  },
  // every line the game can read aloud, from the same data the recording
  // checklist (VOICE_SCRIPT.md) is generated from — always in sync with the game
  async lines() {
    if (this._lines) return this._lines;
    try { const r = await fetch('assets/audio/voice/lines.json'); this._lines = r.ok ? (await r.json()).lines || [] : []; }
    catch (e) { this._lines = []; }
    return this._lines;
  },
  async put(key, blob) {
    const db = await this.db();
    await new Promise((res, rej) => {
      const tx = db.transaction(this.STORE, 'readwrite');
      tx.objectStore(this.STORE).put({ key, blob, ts: Date.now() });
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    const old = this._urls.get(key); if (old) URL.revokeObjectURL(old);
    this._urls.set(key, URL.createObjectURL(blob));
  },
  async remove(key) {
    const db = await this.db();
    await new Promise((res, rej) => {
      const tx = db.transaction(this.STORE, 'readwrite');
      tx.objectStore(this.STORE).delete(key);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    const old = this._urls.get(key); if (old) { URL.revokeObjectURL(old); this._urls.delete(key); }
  },
  has(key) { return this._urls.has(key); },
  urlFor(key) { return this._urls.get(key) || null; },
  async loadAll() {
    try {
      const db = await this.db();
      const rows = await new Promise((res, rej) => {
        const tx = db.transaction(this.STORE, 'readonly');
        const req = tx.objectStore(this.STORE).getAll();
        req.onsuccess = () => res(req.result || []); req.onerror = () => rej(req.error);
      });
      rows.forEach(r => { if (r?.key && r.blob) this._urls.set(r.key, URL.createObjectURL(r.blob)); });
    } catch (e) { /* IndexedDB unavailable (private mode, old browser) — recording tool just won't offer playback of saved clips */ }
  },
  async count() { const all = await this.lines(); const total = all.length; let recorded = 0; all.forEach(l => { if (this.has(l.key)) recorded++; }); return { recorded, total }; },

  // ---------- recording (MediaRecorder over getUserMedia)
  supported() { return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder); },
  async start(key) {
    if (this._rec) await this.stop(false);
    this._stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this._chunks = []; this._activeKey = key;
    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(m => window.MediaRecorder.isTypeSupported?.(m));
    this._rec = new MediaRecorder(this._stream, mime ? { mimeType: mime } : undefined);
    this._rec.addEventListener('dataavailable', e => { if (e.data && e.data.size) this._chunks.push(e.data); });
    this._rec.start();
  },
  // stop(save=true) stops the mic and, by default, saves the clip under the key recording started with
  async stop(save = true) {
    if (!this._rec) return null;
    const rec = this._rec, key = this._activeKey;
    const blob = await new Promise(resolve => {
      rec.addEventListener('stop', () => resolve(new Blob(this._chunks, { type: rec.mimeType || 'audio/webm' })), { once: true });
      try { rec.stop(); } catch (e) { resolve(new Blob(this._chunks)); }
    });
    this._stream?.getTracks().forEach(t => { try { t.stop(); } catch (e) {} });
    this._stream = null; this._rec = null; this._activeKey = null; this._chunks = [];
    if (save && key && blob.size) await this.put(key, blob);
    return { key, blob };
  },
  cancel() { return this.stop(false); },
  recording() { return this._activeKey; }
};

// give every recorded clip priority over the shipped manifest file for that
// exact sentence — Voice.play()/fileFor() ask VoiceRecorder first
(function hookVoice() {
  const wire = () => {
    if (typeof Voice === 'undefined') return;
    const origFileFor = Voice.fileFor.bind(Voice);
    Voice.fileFor = function (text, lang) {
      const k = this.key(text);
      const rec = window.VoiceRecorder?.urlFor?.(k);
      return rec || origFileFor(text, lang);
    };
  };
  if (typeof Voice !== 'undefined') wire(); else document.addEventListener('DOMContentLoaded', wire);
  VoiceRecorder.loadAll();
})();

window.VoiceRecorder = VoiceRecorder;
