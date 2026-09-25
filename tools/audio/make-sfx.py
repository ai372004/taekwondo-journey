#!/usr/bin/env python3
"""Renders every sound effect into assets/audio/sfx/*.mp3 (ffmpeg needed).
    python3 tools/audio/make-sfx.py"""
import os, subprocess, sys, tempfile
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from synth import *

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'assets', 'audio', 'sfx')

def whoosh(dur=0.32, lo=300, hi=2600, seed=0):
    n = int(SR * dur); k = np.linspace(0, 1, n)
    x = noise(n)
    # moving band-pass: rises then falls (air torn by the leg)
    out = np.zeros(n); seg = 256
    for i in range(0, n, seg):
        c = lo + (hi - lo) * np.sin(np.pi * min(1, k[i] * 1.3)) ** 1.5
        out[i:i + seg] = bp(x[i:i + seg], max(80, c * 0.6), min(15000, c * 1.4), 1)
    return norm(fade(out * np.sin(np.pi * k) ** 1.2, 2, 30), -3)
def pad_hit(f=150, bright=1.0):
    n = int(SR * 0.35)
    click = hp(noise(int(SR * 0.012)), 3000) * expdec(int(SR * 0.012), 0.003)
    slap = bp(noise(n), 700 * bright, 3200 * bright) * expdec(n, 0.03)
    thump = sweep(f * 1.6, f * 0.6, 0.35) * expdec(n, 0.07)
    x = mix(click * 0.8, slap * 0.7, thump)
    return norm(reverb(lp(x, 9000), 0.35, 0.12), -1)
def heavy_hit():
    x = mix(pad_hit(110, 0.8), np.pad(taiko(0.6, 55) * 0.6, (int(SR * 0.004), 0)))
    return norm(reverb(x, 0.6, 0.15), -1)
def board_crack():
    n = int(SR * 0.6)
    snap = hp(noise(int(SR * 0.02)), 2500) * expdec(int(SR * 0.02), 0.004)
    crackle = np.zeros(n)
    for i in range(14):
        s = int(SR * (0.01 + rng.uniform(0, 0.18))); L = int(SR * 0.01)
        if s + L < n: crackle[s:s + L] += bp(noise(L), 1500, 6000) * expdec(L, 0.002) * rng.uniform(0.2, 0.7)
    body = sweep(220, 70, 0.4) * expdec(int(SR * 0.4), 0.06)
    return norm(reverb(mix(snap, crackle, body * 0.8), 0.5, 0.12), -1)
def bag_thud():
    n = int(SR * 0.5)
    x = mix(sweep(120, 45, 0.5) * expdec(n, 0.09), lp(noise(n), 500) * expdec(n, 0.04) * 0.6, np.pad(bp(noise(int(SR * 0.3)), 200, 800) * expdec(int(SR * 0.3), 0.08) * 0.3, (int(SR * 0.05), 0)))
    return norm(x, -1)
def chime(notes, step=0.09, dur=0.9, bright=1.0):
    total = step * len(notes) + dur; out = np.zeros(int(SR * total))
    for i, nm in enumerate(notes):
        f = hz(nm); L = int(SR * dur)
        s = (tone(f, dur, partials=[(1, 1), (2, 0.35 * bright), (3, 0.12 * bright), (4.2, 0.06)]) * expdec(L, 0.28))
        out += at(s * env(L, 0.004, 0.05, 1, 0.05, dur - 0.1), i * step, total)
    return norm(reverb(out, 1.0, 0.18), -2)
def click():
    n = int(SR * 0.05); return norm(tone(1600, 0.05, 'tri') * expdec(n, 0.006) + hp(noise(n), 4000) * expdec(n, 0.002) * 0.3, -6)
def pop():
    n = int(SR * 0.12); return norm(sweep(500, 1400, 0.12) * env(n, 0.002, 0.1, 0, 0.018), -4)
def error_boop():
    total = 0.5; out = at(tone(hz('E4'), 0.18, 'tri') * env(int(SR * 0.18), 0.005, 0.1, 0.4, 0.07), 0, total) + at(tone(hz('C4'), 0.28, 'tri') * env(int(SR * 0.28), 0.005, 0.15, 0.3, 0.12), 0.16, total)
    return norm(lp(out, 2500), -4)
def gong():
    dur = 2.2; n = int(SR * dur)
    parts = [(1, 1), (1.47, 0.6), (2.09, 0.45), (2.76, 0.3), (3.41, 0.2), (4.1, 0.1)]
    x = sum(a * np.sin(2 * np.pi * 180 * m * t(dur) + rng.uniform(0, 6)) * expdec(n, 0.9 / m ** 0.5) for m, a in parts)
    x += bp(noise(n), 300, 3000) * expdec(n, 0.02) * 0.3
    return norm(reverb(x * env(n, 0.003, 0.05, 1, 0.3, dur - 0.4), 1.8, 0.25), -2)
def tick():
    n = int(SR * 0.06); return norm(rim(0.06) * 0.6 + tone(900, 0.06) * expdec(n, 0.01), -6)
def star():
    total = 0.9; out = np.zeros(int(SR * total))
    for i, f in enumerate([1568, 2093, 2637, 3136]):
        L = int(SR * 0.5); out += at(tone(f, 0.5) * expdec(L, 0.12) * 0.5, i * 0.05, total)
    return norm(reverb(out, 0.8, 0.3), -5)
def fanfare():
    notes = [('C5', 0, .16), ('E5', .15, .16), ('G5', .3, .16), ('C6', .45, .5), ('G5', .75, .14), ('C6', .9, .7)]
    total = 1.9; out = np.zeros(int(SR * total))
    for nm, s, d in notes:
        f = hz(nm); L = int(SR * (d + 0.25))
        b = tone(f, d + 0.25, partials=[(1, 1), (2, .5), (3, .33), (4, .2), (5, .12)]) * env(L, 0.01, 0.08, 0.7, 0.2, d - 0.08)
        out += at(b, s, total)
    out += at(taiko(0.8, 60) * 0.5, 0.45, total) + at(taiko(0.8, 60) * 0.6, 0.9, total)
    return norm(reverb(lp(out, 7000), 1.2, 0.2), -1)

SFX = {
    'whoosh-1': whoosh(0.30, 300, 2400), 'whoosh-2': whoosh(0.36, 250, 2000), 'whoosh-3': whoosh(0.26, 400, 3000),
    'hit-1': pad_hit(150, 1.0), 'hit-2': pad_hit(170, 1.15), 'hit-3': pad_hit(135, 0.9), 'hit-heavy': heavy_hit(),
    'board-crack': board_crack(), 'bag-thud': bag_thud(),
    'ui-click': click(), 'ui-pop': pop(), 'success': chime(['C5', 'E5', 'G5']), 'error': error_boop(),
    'win': fanfare(), 'star': star(), 'gong': gong(), 'tick': tick(),
    'taiko': norm(taiko(0.7, 70), -2), 'rim': norm(rim(), -4), 'clap': norm(clap(), -4),
}

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for name, x in SFX.items():
            w = os.path.join(tmp, name + '.wav')
            wavfile.write(w, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', w, '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '96k', os.path.join(OUT, name + '.mp3')], check=True)
    print(f'{len(SFX)} sound effects in assets/audio/sfx/')
