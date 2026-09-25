/* =====================================================================
   QR CODE ENCODER (byte mode, error-correction level M, versions 1–15)
   Small, dependency-free — the app must work offline, so no CDN library.
   QRCode.matrix(text) → boolean[][] ; QRCode.toCanvas(text, scale) → <canvas>
   ===================================================================== */
(function (root) {
  'use strict';
  // [total codewords, EC codewords per block, [blocks, data codewords]...]  (level M)
  const SPEC = [null,
    [26, 10, [1, 16]], [44, 16, [1, 28]], [70, 26, [1, 44]], [100, 18, [2, 32]], [134, 24, [2, 43]],
    [172, 16, [4, 27]], [196, 18, [4, 31]], [242, 22, [2, 38], [2, 39]], [292, 22, [3, 36], [2, 37]],
    [346, 26, [4, 43], [1, 44]], [404, 30, [1, 50], [4, 51]], [466, 22, [6, 36], [2, 37]],
    [532, 22, [8, 37], [1, 38]], [581, 24, [4, 40], [5, 41]], [655, 24, [5, 41], [5, 42]]];
  const ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46],
    [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70]];
  const REMAINDER = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 3, 3];

  // GF(256) with polynomial 0x11D
  const EXP = new Array(512), LOG = new Array(256);
  (function () { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11D; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
  function rsGenerator(n) {
    let g = [1];
    for (let i = 0; i < n; i++) {
      const next = new Array(g.length + 1).fill(0);
      for (let j = 0; j < g.length; j++) { next[j] ^= g[j]; next[j + 1] ^= mul(g[j], EXP[i]); }
      g = next;
    }
    return g;
  }
  function rsRemainder(data, n) {
    const gen = rsGenerator(n);
    const res = data.concat(new Array(n).fill(0));
    for (let i = 0; i < data.length; i++) {
      const c = res[i];
      if (c) for (let j = 0; j < gen.length; j++) res[i + j] ^= mul(gen[j], c);
    }
    return res.slice(data.length);
  }

  function utf8(text) { return Array.from(new TextEncoder().encode(text)); }
  function dataCapacity(v) { const s = SPEC[v]; return s.slice(2).reduce((t, [b, d]) => t + b * d, 0); }

  function encodeData(bytes, v) {
    const bits = [];
    const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(0b0100, 4);
    put(bytes.length, v < 10 ? 8 : 16);
    bytes.forEach(b => put(b, 8));
    const cap = dataCapacity(v) * 8;
    put(0, Math.min(4, cap - bits.length));
    while (bits.length % 8) bits.push(0);
    const out = [];
    for (let i = 0; i < bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    for (let pad = 0xEC; out.length < cap / 8; pad = pad === 0xEC ? 0x11 : 0xEC) out.push(pad);
    return out;
  }

  function interleave(data, v) {
    const s = SPEC[v], ecn = s[1];
    const blocks = []; let k = 0;
    s.slice(2).forEach(([n, d]) => { for (let i = 0; i < n; i++) { blocks.push(data.slice(k, k + d)); k += d; } });
    const ecs = blocks.map(b => rsRemainder(b, ecn));
    const out = [];
    const maxD = Math.max(...blocks.map(b => b.length));
    for (let i = 0; i < maxD; i++) blocks.forEach(b => { if (i < b.length) out.push(b[i]); });
    for (let i = 0; i < ecn; i++) ecs.forEach(e => out.push(e[i]));
    return out;
  }

  function bchFormat(data) { // 5 bits → 15 bits
    let d = data << 10;
    for (let i = 14; i >= 10; i--) if ((d >>> i) & 1) d ^= 0x537 << (i - 10);
    return ((data << 10) | d) ^ 0x5412;
  }
  function bchVersion(v) { // 6 bits → 18 bits
    let d = v << 12;
    for (let i = 17; i >= 12; i--) if ((d >>> i) & 1) d ^= 0x1F25 << (i - 12);
    return (v << 12) | d;
  }

  const MASKS = [
    (r, c) => (r + c) % 2 === 0, (r) => r % 2 === 0, (r, c) => c % 3 === 0, (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0, (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0, (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
  ];

  function build(v, codewords, mask) {
    const N = v * 4 + 17;
    const M = Array.from({ length: N }, () => new Array(N).fill(null));   // null = free
    const set = (r, c, val) => { if (r >= 0 && r < N && c >= 0 && c < N) M[r][c] = val; };
    const finder = (r0, c0) => {
      for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
        const on = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        set(r0 + r, c0 + c, on);
      }
    };
    finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
    for (let i = 8; i < N - 8; i++) { M[6][i] = i % 2 === 0; M[i][6] = i % 2 === 0; }
    const al = ALIGN[v];
    const last = al.length - 1;
    al.forEach((r, i) => al.forEach((c, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;   // finder corners
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) M[r + dr][c + dc] = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
    }));
    M[N - 8][8] = true;                       // dark module
    // reserve format + version areas
    const fmtCells = [];
    for (let i = 0; i <= 8; i++) { if (i !== 6) { fmtCells.push([8, i]); fmtCells.push([i, 8]); } }
    for (let i = 0; i < 8; i++) { fmtCells.push([8, N - 1 - i]); fmtCells.push([N - 1 - i, 8]); }
    fmtCells.forEach(([r, c]) => { if (M[r][c] === null) M[r][c] = false; });
    if (v >= 7) for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { M[i][N - 11 + j] = false; M[N - 11 + j][i] = false; }
    const reserved = M.map(row => row.map(x => x !== null));
    // data
    const bits = [];
    codewords.forEach(b => { for (let i = 7; i >= 0; i--) bits.push((b >>> i) & 1); });
    for (let i = 0; i < REMAINDER[v]; i++) bits.push(0);
    let k = 0, up = true;
    for (let c = N - 1; c > 0; c -= 2) {
      if (c === 6) c = 5;
      for (let i = 0; i < N; i++) {
        const r = up ? N - 1 - i : i;
        for (let dc = 0; dc < 2; dc++) {
          const cc = c - dc;
          if (reserved[r][cc]) continue;
          let bit = k < bits.length ? bits[k] === 1 : false; k++;
          if (MASKS[mask](r, cc)) bit = !bit;
          M[r][cc] = bit;
        }
      }
      up = !up;
    }
    // format info (EC level M = 00)
    const f = bchFormat((0b00 << 3) | mask);
    const fb = (i) => ((f >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) M[8][i] = fb(14 - i);
    M[8][7] = fb(8); M[8][8] = fb(7); M[7][8] = fb(6);
    for (let i = 9; i < 15; i++) M[14 - i][8] = fb(14 - i);
    for (let i = 0; i < 7; i++) M[N - 1 - i][8] = fb(14 - i);    // bits 14..8, bottom-left (row N-8 is the dark module)
    for (let i = 0; i < 8; i++) M[8][N - 1 - i] = fb(i);          // bits 0..7, top-right
    if (v >= 7) {
      const vb = bchVersion(v);
      for (let i = 0; i < 18; i++) {
        const bit = ((vb >>> i) & 1) === 1;
        const a = Math.floor(i / 3), b = i % 3 + N - 11;
        M[a][b] = bit; M[b][a] = bit;
      }
    }
    return M;
  }

  function penalty(M) {
    const N = M.length; let p = 0;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < N; i++) {
        let run = 1;
        for (let j = 1; j < N; j++) {
          const a = pass ? M[j][i] : M[i][j], b = pass ? M[j - 1][i] : M[i][j - 1];
          if (a === b) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1;
        }
      }
    }
    for (let i = 0; i < N - 1; i++) for (let j = 0; j < N - 1; j++) { const c = M[i][j]; if (c === M[i + 1][j] && c === M[i][j + 1] && c === M[i + 1][j + 1]) p += 3; }
    const pat = [true, false, true, true, true, false, true, false, false, false, false];
    const patR = pat.slice().reverse();
    for (let i = 0; i < N; i++) for (let j = 0; j <= N - 11; j++) {
      let h1 = true, h2 = true, v1 = true, v2 = true;
      for (let k = 0; k < 11; k++) {
        if (M[i][j + k] !== pat[k]) h1 = false; if (M[i][j + k] !== patR[k]) h2 = false;
        if (M[j + k][i] !== pat[k]) v1 = false; if (M[j + k][i] !== patR[k]) v2 = false;
      }
      p += 40 * (h1 + h2 + v1 + v2);
    }
    let dark = 0; M.forEach(r => r.forEach(x => { if (x) dark++; }));
    p += Math.floor(Math.abs(dark * 20 - N * N * 10) / (N * N)) * 10;
    return p;
  }

  function matrix(text) {
    const bytes = utf8(text);
    let v = 1;
    while (v <= 15 && (bytes.length + (v < 10 ? 2 : 3)) > dataCapacity(v)) v++;
    if (v > 15) throw new Error('QR: text too long');
    const cw = interleave(encodeData(bytes, v), v);
    let best = null, bestP = Infinity;
    for (let m = 0; m < 8; m++) { const M = build(v, cw, m); const p = penalty(M); if (p < bestP) { bestP = p; best = M; } }
    return best;
  }

  function toCanvas(text, scale = 6, quiet = 4) {
    const M = matrix(text), N = M.length, size = (N + quiet * 2) * scale;
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, size, size); g.fillStyle = '#000';
    M.forEach((row, r) => row.forEach((on, col) => { if (on) g.fillRect((col + quiet) * scale, (r + quiet) * scale, scale, scale); }));
    c.className = 'tkd-qr-canvas';
    return c;
  }

  const api = { matrix, toCanvas };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.QRCode = api;
})(typeof window !== 'undefined' ? window : globalThis);
