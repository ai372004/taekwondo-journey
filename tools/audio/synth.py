"""Tiny offline synthesizer used to render the game's sound effects and music
(no samples, no licences needed). Everything is numpy at 44.1 kHz mono."""
import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(7)

def t(dur): return np.arange(int(SR * dur)) / SR
def env(n, a=0.005, d=0.1, s=0.0, r=0.1, hold=0.0):
    a_, d_, h_, r_ = [int(SR * x) for x in (a, d, hold, r)]
    e = np.concatenate([np.linspace(0, 1, max(a_, 1)), np.linspace(1, s, max(d_, 1)), np.full(h_, s), np.linspace(s, 0, max(r_, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]
def expdec(n, tau): return np.exp(-np.arange(n) / (SR * tau))
def noise(n): return rng.uniform(-1, 1, n)
def bp(x, lo, hi, order=2): return signal.sosfilt(signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, 'highpass', fs=SR, output='sos'), x)
def sweep(f0, f1, dur, curve='exp'):
    n = int(SR * dur); k = np.linspace(0, 1, n)
    f = f0 * (f1 / f0) ** k if curve == 'exp' else f0 + (f1 - f0) * k
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def tone(freq, dur, wave='sine', partials=None):
    x = t(dur)
    if partials: return sum(a * np.sin(2 * np.pi * freq * m * x) for m, a in partials)
    if wave == 'tri': return 2 / np.pi * np.arcsin(np.sin(2 * np.pi * freq * x))
    if wave == 'saw': return sum((-1) ** (k + 1) / k * np.sin(2 * np.pi * freq * k * x) for k in range(1, 12)) * 2 / np.pi
    return np.sin(2 * np.pi * freq * x)
def pluck(freq, dur, bright=0.5, decay=0.996):
    """Karplus-Strong string (koto-ish)."""
    n = int(SR * dur); p = max(2, int(SR / freq))
    buf = lp(noise(p), 800 + 6000 * bright, 1)
    out = np.zeros(n); y = np.concatenate([buf, np.zeros(n)])
    for i in range(p, n + p):
        y[i] = decay * 0.5 * (y[i - p] + y[i - p + 1]) if i - p + 1 < len(y) else 0
    out = y[p:p + n]
    return out / (np.max(np.abs(out)) + 1e-9)
def reverb(x, secs=1.2, mix=0.2, bright=4000):
    n = int(SR * secs); ir = noise(n) * expdec(n, secs / 5); ir = lp(ir, bright); ir[0] = 0
    wet = signal.fftconvolve(x, ir)[:len(x) + n]
    wet = np.pad(wet, (0, len(x) + n - len(wet)))
    wet = wet / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(x) + 1e-9)
    dry = np.pad(x, (0, n))
    return (1 - mix) * dry + mix * wet
def norm(x, peak_db=-1.0):
    return x / (np.max(np.abs(x)) + 1e-9) * 10 ** (peak_db / 20)
def fade(x, ms_in=2, ms_out=20):
    a, b = int(SR * ms_in / 1000), int(SR * ms_out / 1000)
    x = x.copy(); x[:a] *= np.linspace(0, 1, a) if a else 1; x[-b:] *= np.linspace(1, 0, b) if b else 1
    return x
def mix(*parts):
    n = max(len(p) for p in parts); out = np.zeros(n)
    for p in parts: out[:len(p)] += p
    return out
def at(x, sec, total):
    out = np.zeros(int(SR * total)); i = int(SR * sec); m = min(len(x), len(out) - i)
    if m > 0: out[i:i + m] += x[:m]
    return out
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}
def hz(name):
    n, o = name[:-1], int(name[-1]); return 440 * 2 ** ((NOTE[n] + 12 * (o + 1) - 69) / 12)

# ------------------------------------------------------------------ drums
def taiko(dur=0.7, f=70, gain=1.0):
    n = int(SR * dur)
    body = sweep(f * 1.8, f, dur) * expdec(n, 0.18)
    skin = bp(noise(n), 200, 900) * expdec(n, 0.025) * 0.6
    return gain * norm(lp(body + skin, 3000), 0)
def rim(dur=0.12):
    n = int(SR * dur); return norm(bp(noise(n), 1800, 5000) * expdec(n, 0.012) + tone(1200, dur) * expdec(n, 0.01) * 0.4, 0)
def shaker(dur=0.09):
    n = int(SR * dur); return norm(bp(noise(n), 4500, 10000) * env(n, 0.01, 0.07, 0, 0.01), 0) * 0.35
def clap(dur=0.2):
    n = int(SR * dur); x = np.zeros(n)
    for k, d in enumerate([0, 0.008, 0.017, 0.026]):
        x += at(bp(noise(int(SR * 0.05)), 900, 3500) * expdec(int(SR * 0.05), 0.012 if k < 3 else 0.06), d, dur)
    return norm(x, 0)
