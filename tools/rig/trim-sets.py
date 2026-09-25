#!/usr/bin/env python3
"""Crops every baked kick set to the union box of its 5 frames (same canvas for the set,
so games that align frames by the feet still line up), leaving a little air around it."""
import os
from PIL import Image
C = 'assets/images/characters'
SETS = {'apchagi': ['ready', 'chamber', 'extension', 'recoil', 'return'], 'narochagi': ['ready', 'rise', 'drop', 'recoil', 'return']}
for ch in ('boy', 'girl'):
    for k, names in SETS.items():
        files = [f'{C}/{ch}_char/{k}/{n}_{ch}.webp' for n in names]
        ims = [Image.open(f).convert('RGBA') for f in files]
        boxes = [im.getbbox() for im in ims]
        x0 = min(b[0] for b in boxes); y0 = min(b[1] for b in boxes); x1 = max(b[2] for b in boxes); y1 = max(b[3] for b in boxes)
        pad = 24; x0, y0 = max(0, x0 - pad), max(0, y0 - pad); x1, y1 = min(ims[0].width, x1 + pad), min(ims[0].height, y1 + 8)
        for f, im in zip(files, ims): im.crop((x0, y0, x1, y1)).save(f, 'WEBP', quality=88)
        print(ch, k, (x1 - x0, y1 - y0))
for f in [f'{C}/boy_char/boy_win_1.webp', f'{C}/boy_char/boy_win_2.webp', f'{C}/girl_char/girl_win_1.webp']:
    im = Image.open(f).convert('RGBA'); b = im.getbbox(); im.crop((max(0, b[0] - 20), max(0, b[1] - 20), b[2] + 20, b[3] + 6)).save(f, 'WEBP', quality=88)
