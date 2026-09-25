#!/usr/bin/env python3
"""Renders the two looping music tracks (seamless loops) into assets/audio/music/.
   dojo  — calm, for menus and lessons (84 bpm, D minor pentatonic, koto + pad + soft taiko)
   arena — energetic, for games and the warm-up (112 bpm, taiko groove + bass + riff)
    python3 tools/audio/make-music.py"""
import os, subprocess, sys, tempfile
import numpy as np
from scipy.io import wavfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from synth import *

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'assets', 'audio', 'music')
CHORDS = [['D3', 'F3', 'A3'], ['A#2', 'D3', 'F3'], ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3']]   # Dm Bb C Am
ROOTS = ['D2', 'A#1', 'C2', 'A1']

def pad_chord(notes, dur):
    n = int(SR * dur); x = np.zeros(n)
    for nm in notes:
        f = hz(nm)
        for det in (-0.12, 0.0, 0.11):
            x += tone(f * 2 ** (det / 12), dur, 'saw')
    x = lp(x, 850, 2) * env(n, 0.6, 0.3, 0.8, 0.8, dur - 1.7)
    return x / len(notes) / 3

class Track:
    def __init__(self, bpm, bars):
        self.beat = 60 / bpm; self.bar = self.beat * 4; self.L = self.bar * bars; self.bars = bars
        self.buf = np.zeros(int(SR * (self.L + 3)))
    def put(self, x, sec, gain=1.0):
        i = int(SR * sec); m = min(len(x), len(self.buf) - i)
        if m > 0: self.buf[i:i + m] += x[:m] * gain
    def loop(self):
        n = int(SR * self.L); body = self.buf[:n].copy(); tail = self.buf[n:]
        body[:len(tail)] += tail                      # wrap the reverb/decay tail to the start → seamless
        return body

def melody_line(tr, notes, start_bar, gain, octave_shift=0, bright=0.45):
    """notes: list of (beat offset from start_bar, note name or None, length in beats)"""
    for off, nm, ln in notes:
        if not nm: continue
        f = hz(nm) * 2 ** octave_shift
        p = pluck(f, max(0.4, ln * tr.beat + 0.6), bright, 0.9975)
        tr.put(p * env(len(p), 0.002, 0.05, 1, 0.3, len(p) / SR - 0.35), (start_bar * 4 + off) * tr.beat, gain)

PHRASE_A = [(0, 'A4', 1), (1, 'C5', 0.5), (1.5, 'D5', 1.5), (4, 'F5', 1), (5, 'D5', 1), (6, 'C5', 2), (8, 'A4', 1), (9, 'G4', 1), (10, 'A4', 1), (11, 'C5', 1),
            (12, 'D5', 3), (15, None, 1)]
PHRASE_B = [(0, 'D5', 0.5), (0.5, 'F5', 0.5), (1, 'G5', 1.5), (3, 'F5', 1), (4, 'D5', 2), (6, 'C5', 1), (7, 'A4', 1), (8, 'C5', 1.5), (9.5, 'D5', 0.5), (10, 'F5', 1),
            (11, 'D5', 1), (12, 'A4', 4)]

def dojo():
    tr = Track(84, 16)
    for b in range(16):
        c = b % 4
        tr.put(pad_chord(CHORDS[c], tr.bar + 1.2), b * tr.bar, 0.55)
        bass = tone(hz(ROOTS[c]), tr.beat * 1.8) * env(int(SR * tr.beat * 1.8), 0.01, 0.2, 0.6, 0.3, tr.beat)
        tr.put(bass, b * tr.bar, 0.35); tr.put(bass, b * tr.bar + 2 * tr.beat, 0.25)
        if b >= 2: tr.put(taiko(0.9, 62), b * tr.bar, 0.35)
        if b >= 4:
            for k in range(8): tr.put(shaker(), b * tr.bar + k * tr.beat / 2 + tr.beat / 4, 0.06 if k % 2 else 0.035)
    for sb, ph in [(4, PHRASE_A), (8, PHRASE_B), (12, PHRASE_A)]:
        melody_line(tr, ph, sb, 0.33)
    x = reverb(tr.loop(), 2.2, 0.28, 3500)[:int(SR * tr.L)]
    return x

RIFF = [(0, 'D4', .5), (.5, 'D4', .5), (1, 'F4', .5), (1.5, 'G4', .5), (2.5, 'A4', .5), (3, 'G4', .5), (3.5, 'F4', .5)]
HOOK = [(0, 'A5', 1), (1, 'G5', .5), (1.5, 'F5', .5), (2, 'D5', 1), (3, 'F5', 1), (4, 'G5', 1.5), (5.5, 'A5', .5), (6, 'C6', 2),
        (8, 'A5', 1), (9, 'G5', .5), (9.5, 'F5', .5), (10, 'D5', 1), (11, 'C5', 1), (12, 'D5', 4)]

def arena():
    tr = Track(112, 16)
    for b in range(16):
        c = b % 4; s = b * tr.bar; B = tr.beat
        # drums: DON . . ka | DON DON . ka  (taiko groove) + rim on 2 & 4 + claps from bar 4
        for off, g in [(0, .9), (1.5, .45), (2, .8), (2.5, .5), (3.5, .35)]: tr.put(taiko(0.6, 72 if off % 1 == 0 else 95), s + off * B, g * 0.55)
        for off in (1, 3): tr.put(rim(), s + off * B, 0.28)
        if b >= 4: tr.put(clap(), s + 3 * B, 0.22)
        if b >= 2:
            for k in range(16): tr.put(shaker(), s + k * B / 4, 0.05 if k % 2 == 0 else 0.03)
        # bass: 8ths on the chord root
        for k in range(8):
            f = hz(ROOTS[c]) * (2 if k in (3, 7) else 1)
            bs = lp(tone(f, B * 0.45, 'saw'), 600) * env(int(SR * B * 0.45), 0.005, 0.1, 0.5, 0.08, B * 0.2)
            tr.put(bs, s + k * B / 2, 0.30)
        tr.put(pad_chord(CHORDS[c], tr.bar + 0.8), s, 0.22)
        if b >= 2: melody_line(tr, RIFF, b, 0.24, 0, 0.6)
    for sb in (8, 12): melody_line(tr, HOOK, sb, 0.30, 0, 0.55)
    x = reverb(tr.loop(), 1.2, 0.18, 5000)[:int(SR * tr.L)]
    return x

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for name, fn in (('dojo', dojo), ('arena', arena)):
            x = norm(fn(), -3)
            w = os.path.join(tmp, name + '.wav')
            wavfile.write(w, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', w, '-af', 'loudnorm=I=-20:TP=-2:LRA=11', '-ar', '44100', '-ac', '1',
                            '-codec:a', 'libmp3lame', '-b:a', '96k', os.path.join(OUT, name + '.mp3')], check=True)
            print(name, f'{len(x) / SR:.1f}s')
