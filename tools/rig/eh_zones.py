#!/usr/bin/env python3
"""Crops the baked Error Hunt pictures, turns each body-part render into a tap polygon,
writes the pictures and rewrites ErrorHuntSystem.ART in js/games/error-hunt.js."""
import json, os, re, shutil, sys
import numpy as np, cv2
jobs = json.load(open(sys.argv[1]))
ART = {'boy': {'levels': {}}, 'girl': {'levels': {}}}
by_ch = {}
for j in jobs: by_ch.setdefault(j['ch'], []).append(j)
os.makedirs('assets/images/error_hunt/_originals', exist_ok=True)
for ch, js in by_ch.items():
    fulls = [cv2.imread(j['full'], cv2.IMREAD_UNCHANGED) for j in js]
    ys, xs = np.nonzero(np.max([f[:, :, 3] for f in fulls], axis=0) > 8)
    x0, y0, x1, y1 = max(0, xs.min() - 30), max(0, ys.min() - 30), xs.max() + 30, ys.max() + 12
    for j, full in zip(js, fulls):
        crop = full[y0:y1, x0:x1]
        rel = f"assets/images/error_hunt/{ch}_{j['lvl']}.webp"
        if os.path.exists(rel) and not os.path.exists(rel.replace('error_hunt/', 'error_hunt/_originals/')):
            shutil.copy2(rel, rel.replace('error_hunt/', 'error_hunt/_originals/'))
        cv2.imwrite(rel, crop, [cv2.IMWRITE_WEBP_QUALITY, 88])
        zones = {}
        for z, f in j['zones'].items():
            a = cv2.imread(f, cv2.IMREAD_UNCHANGED)[y0:y1, x0:x1, 3] > 20
            m = cv2.dilate(a.astype(np.uint8), np.ones((25, 25), np.uint8))       # a bit bigger than the part: easy to tap
            cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            polys = [cv2.approxPolyDP(c, 6, True).reshape(-1, 2).tolist() for c in cs if cv2.contourArea(c) > 400]
            zones[z] = polys
        ART[ch]['levels'][j['lvl']] = {'image': rel, 'w': int(x1 - x0), 'h': int(y1 - y0), 'zones': zones}
p = 'js/games/error-hunt.js'; s = open(p, encoding='utf-8').read()
s2, n = re.subn(r'static ART = \{.*?\};\n', 'static ART = ' + json.dumps(ART, separators=(',', ':')) + ';\n', s, count=1, flags=re.S)
assert n == 1, 'ART not found'
open(p, 'w', encoding='utf-8').write(s2)
print('error hunt: 8 pictures + zones updated')
