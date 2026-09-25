#!/usr/bin/env python3
"""Debug helper: draw a coordinate grid (and optional polygons/points) over a source image.
   python3 tools/rig/grid.py SRC OUT [x0 y0 x1 y1] [--step 50] [--rig rig.json]"""
import sys, json
from PIL import Image, ImageDraw
a = [x for x in sys.argv[1:] if not x.startswith('--')]
src, out = a[0], a[1]
box = list(map(int, a[2:6])) if len(a) >= 6 else None
step = int(sys.argv[sys.argv.index('--step') + 1]) if '--step' in sys.argv else 50
rig = json.load(open(sys.argv[sys.argv.index('--rig') + 1])) if '--rig' in sys.argv else None
im = Image.open(src).convert('RGBA')
bg = Image.new('RGBA', im.size, (110, 130, 150, 255)); bg.alpha_composite(im)
d = ImageDraw.Draw(bg, 'RGBA')
for x in range(0, im.width, step):
    d.line([(x, 0), (x, im.height)], fill=(255, 0, 0, 90 if x % (step * 2) else 160), width=1)
    d.text((x + 2, (box[1] if box else 0) + 2), str(x), fill=(255, 255, 0, 255))
for y in range(0, im.height, step):
    d.line([(0, y), (im.width, y)], fill=(0, 0, 255, 90 if y % (step * 2) else 160), width=1)
    d.text(((box[0] if box else 0) + 2, y + 2), str(y), fill=(0, 255, 255, 255))
if rig:
    cols = [(255, 0, 0), (0, 200, 0), (0, 120, 255), (255, 0, 255), (255, 160, 0), (0, 220, 220), (140, 70, 255), (255, 255, 0), (120, 60, 0), (0, 0, 0)]
    for i, (n, p) in enumerate(rig['parts'].items()):
        c = cols[i % len(cols)]
        d.polygon([tuple(q) for q in p['poly']], outline=c + (255,), fill=c + (40,))
    for n, b in rig['bones'].items():
        x, y = b['at']; d.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(255, 255, 0, 255), outline=(0, 0, 0, 255)); d.text((x + 8, y - 6), n, fill=(0, 0, 0, 255))
if box: bg = bg.crop(box)
bg.convert('RGB').save(out)
