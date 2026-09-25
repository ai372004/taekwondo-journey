#!/usr/bin/env python3
"""Turns ONE existing character picture into a cut-out skeleton (Spine 4.1 JSON + .atlas).

    python3 tools/rig/build-rig.py tools/rig/boy.rig.json [--debug DIR]

The rig file says where the joints are and where to cut (in source-image pixels).
Output: assets/anim/<name>/<name>.json, <name>.atlas, <name>.webp
Hidden areas (the top of a thigh under the jacket, the ankle under the trouser
cuff) are painted in from the surrounding pixels so no holes show when a limb turns.
"""
import json, math, os, sys
import numpy as np, cv2

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cfg_path = sys.argv[1]
cfg = json.load(open(cfg_path, encoding='utf-8'))
DEBUG = sys.argv[sys.argv.index('--debug') + 1] if '--debug' in sys.argv else None
src = cv2.imread(os.path.join(ROOT, cfg['source']), cv2.IMREAD_UNCHANGED)
if src.shape[2] == 3: src = cv2.cvtColor(src, cv2.COLOR_BGR2BGRA)
H, W = src.shape[:2]
A = src[:, :, 3] > 8
J = {k: np.array(v, float) for k, v in cfg['joints'].items()}
yy, xx = np.mgrid[0:H, 0:W]

def interp_x(poly, y):   # polyline x as a function of y (poly sorted by y)
    p = np.array(poly, float); return np.interp(y, p[:, 1], p[:, 0])
def interp_y(poly, x):   # polyline y as a function of x (poly sorted by x)
    p = np.array(poly, float); return np.interp(x, p[:, 0], p[:, 1])
def proj(a, b):          # position of every pixel along a->b (0 at a, len at b) and signed side distance
    d = b - a; L = np.linalg.norm(d); u = d / L; n = np.array([-u[1], u[0]])
    return (xx - a[0]) * u[0] + (yy - a[1]) * u[1], (xx - a[0]) * n[0] + (yy - a[1]) * n[1], L
def disc(c, r): return (xx - c[0]) ** 2 + (yy - c[1]) ** 2 <= r * r
def capsule(a, b, r):
    t, s, L = proj(a, b); tc = np.clip(t, 0, L)
    return ((t - tc) ** 2 + s ** 2) <= r * r

cuts = cfg['cuts']
masks = {}
if cfg.get('mode', 'raised') == 'raised' or True:
    front = A & (xx > interp_x(cuts['front_leg_left_edge'], yy)) & (yy < cuts['front_leg_max_y'])
    if 'front_leg_exclude' in cuts:
        for poly in cuts['front_leg_exclude']:
            m = np.zeros((H, W), np.uint8); cv2.fillPoly(m, [np.array(poly, np.int32)], 1); front &= ~m.astype(bool)
    # keep only pixels inside the leg's tube (the jacket flap next to the thigh stays on the body)
    if 'tubeF' in cfg:
        t_, s_, L_ = proj(J['hipF'], J['ankleF'])
        front &= (np.abs(s_) <= cfg['tubeF']) | (t_ > L_ - 10)
    back = A & ~front & (yy > interp_y(cuts['hem'], xx))
    if 'tubeB' in cfg:
        t_, s_, L_ = proj(J['hipB'], J['ankleB'])
        back &= (np.abs(s_) <= cfg['tubeB']) | (t_ > L_ - 30)
    body = A & ~front & ~back

def split_leg(leg, hip, knee, ankle, footcut, side):
    t, s, L = proj(hip, knee)
    t2, s2, L2 = proj(knee, ankle)
    fc = np.array(footcut, float)
    # foot = beyond the trouser cuff, measured along the shin
    tf = (fc - knee) @ ((ankle - knee) / L2)
    foot = leg & (t2 > tf)
    thigh = leg & ~foot & (t <= L)
    shin = leg & ~foot & ~thigh
    return thigh, shin, foot

parts = {}
for side, leg in (('F', front), ('B', back)):
    th, sh, ft = split_leg(leg, J['hip' + side], J['knee' + side], J['ankle' + side], cfg['footcut' + side], side)
    parts['thigh' + side], parts['shin' + side], parts['foot' + side] = th, sh, ft
extras = cfg.get('extras', [])
for ex in extras:
    m = np.zeros((H, W), np.uint8); cv2.fillPoly(m, [np.array(ex['poly'], np.int32)], 1)
    m = m.astype(bool) & body
    parts[ex['name']] = m; body = body & ~m
    J[ex['name'] + '_at'] = np.array(ex['at'], float); J[ex['name'] + '_tip'] = np.array(ex['tip'], float)
parts['body'] = body

# which pixels each piece is allowed to paint in (hidden areas) — radius from config
fills = {}
w = cfg['widths']
for side in 'FB':
    hip, knee, ankle = J['hip' + side], J['knee' + side], J['ankle' + side]
    rT, rS, rA = w['thigh' + side], w['shin' + side], w['ankle' + side]
    # thigh: its top continues up to the hip joint; knee cap disc overlaps the shin
    fills['thigh' + side] = capsule(hip, hip + (knee - hip) * cfg.get('hipReach' + side, 0.45), rT) | (disc(knee, rS * 0.98) & parts['shin' + side])
    fills['shin' + side] = np.zeros((H, W), bool)
    fills['foot' + side] = disc(ankle, rA * 0.9)
fills['body'] = np.zeros((H, W), bool)
for ex in extras: fills[ex['name']] = disc(J[ex['name'] + '_at'], ex.get('fill', 0)) if ex.get('fill') else np.zeros((H, W), bool)

def paint(piece_mask, extra):
    """Colour for the extra (hidden) pixels, grown out of the piece itself."""
    add = extra & ~piece_mask
    known = piece_mask & (src[:, :, 3] > 220)      # grow colour only from solid pixels (edges are tinted)
    if not add.any(): return src.copy(), known
    bgr = src[:, :, :3].copy()
    # grow colours outward from the known pixels (nearest known pixel), then smooth only the new area
    dist, lab = cv2.distanceTransformWithLabels((~known).astype(np.uint8), cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    ky, kx = np.nonzero(known)
    idx = np.zeros(lab.max() + 1, np.int64)
    zero = (~known).astype(np.uint8) == 0
    idx[lab[zero]] = np.arange(zero.sum())
    flat = bgr[zero]
    grown = flat[idx[lab]]
    grown = grown.reshape(H, W, 3)
    blur = cv2.GaussianBlur(grown, (0, 0), 9)
    out = src.copy()
    out[:, :, :3][add] = blur[add]
    out[:, :, 3][add] = 255
    return out, piece_mask | add

pieces = {}
for name, m in parts.items():
    img, mask = paint(m, fills[name])
    piece = img.copy(); piece[:, :, 3] = np.where(mask, np.where(m, src[:, :, 3], 255), 0)
    ys, xs = np.nonzero(mask)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    pad = 2; x0, y0 = max(0, x0 - pad), max(0, y0 - pad); x1, y1 = min(W, x1 + pad), min(H, y1 + pad)
    pieces[name] = {'img': piece[y0:y1, x0:x1], 'box': (int(x0), int(y0), int(x1), int(y1))}

# ---------------------------------------------------------------- pack atlas (shelf)
order = sorted(pieces, key=lambda n: -(pieces[n]['box'][3] - pieces[n]['box'][1]))
AW = 2048; x = y = sh = 0; PAD = 2
for n in order:
    bw = pieces[n]['box'][2] - pieces[n]['box'][0]; bh = pieces[n]['box'][3] - pieces[n]['box'][1]
    if x + bw > AW: x = 0; y += sh + PAD; sh = 0
    pieces[n]['at'] = (x, y); x += bw + PAD; sh = max(sh, bh)
AH = y + sh
AH = 1 << (AH - 1).bit_length()
atlas = np.zeros((AH, AW, 4), np.uint8)
for n, p in pieces.items():
    ax, ay = p['at']; h, w_ = p['img'].shape[:2]; atlas[ay:ay + h, ax:ax + w_] = p['img']
# trim width
used = max(p['at'][0] + p['img'].shape[1] for p in pieces.values())
AW2 = 1 << (used - 1).bit_length(); atlas = atlas[:, :AW2]

name = cfg['name']
out_dir = os.path.join(ROOT, 'assets', 'anim', name); os.makedirs(out_dir, exist_ok=True)
cv2.imwrite(os.path.join(out_dir, f'{name}.webp'), atlas, [cv2.IMWRITE_WEBP_QUALITY, 92])
with open(os.path.join(out_dir, f'{name}.atlas'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(f'{name}.webp\nsize:{atlas.shape[1]},{atlas.shape[0]}\nfilter:Linear,Linear\n')
    for n, p in pieces.items():
        h, w_ = p['img'].shape[:2]
        f.write(f'{n}\nbounds:{p["at"][0]},{p["at"][1]},{w_},{h}\n')

# ---------------------------------------------------------------- skeleton (Spine 4.1 JSON, y up)
G = cfg['ground']
def up(p): return np.array([p[0] - J['pelvis'][0], G - p[1]])   # image px -> skeleton space (root under the pelvis, on the floor)
def ang(a, b): d = up(b) - up(a); return math.degrees(math.atan2(d[1], d[0]))
bones = [('root', None, np.array([J['pelvis'][0], G]), 0.0)]
bones.append(('hip', 'root', J['pelvis'], 0.0))
bones.append(('body', 'hip', J['pelvis'], 90.0))
for s in 'FB':
    bones.append((f'thigh{s}', 'hip', J['hip' + s], ang(J['hip' + s], J['knee' + s])))
    bones.append((f'shin{s}', f'thigh{s}', J['knee' + s], ang(J['knee' + s], J['ankle' + s])))
    bones.append((f'foot{s}', f'shin{s}', J['ankle' + s], ang(J['ankle' + s], J['toe' + s])))
pending = list(extras); placed = {b[0] for b in bones}
while pending:                     # parents first (the ponytail hangs from the head)
    ex = next(e for e in pending if e.get('parent', 'body') in placed)
    bones.append((ex['name'], ex.get('parent', 'body'), J[ex['name'] + '_at'], ang(J[ex['name'] + '_at'], J[ex['name'] + '_tip'])))
    placed.add(ex['name']); pending.remove(ex)
world = {}
out_bones = []
for bn, parent, pos, rot in bones:
    wp = up(pos)
    if parent is None: lx, ly, lr = 0.0, 0.0, 0.0
    else:
        pp, pr = world[parent]
        d = wp - pp; c, s_ = math.cos(math.radians(-pr)), math.sin(math.radians(-pr))
        lx, ly = d[0] * c - d[1] * s_, d[0] * s_ + d[1] * c; lr = rot - pr
    world[bn] = (wp, rot)
    b = {'name': bn}
    if parent: b['parent'] = parent
    if abs(lx) > 1e-3: b['x'] = round(lx, 2)
    if abs(ly) > 1e-3: b['y'] = round(ly, 2)
    if abs(lr) > 1e-3: b['rotation'] = round(lr, 2)
    nxt = {'thighF': 'kneeF', 'shinF': 'ankleF', 'footF': 'toeF', 'thighB': 'kneeB', 'shinB': 'ankleB', 'footB': 'toeB'}.get(bn)
    nxt = nxt or (bn + '_tip' if bn + '_tip' in J else None)
    if nxt: b['length'] = round(float(np.linalg.norm(J[nxt] - pos)), 2)
    out_bones.append(b)
slot_order = [e['name'] for e in extras if e.get('behind')] + ['footB', 'shinB', 'thighB', 'footF', 'shinF', 'thighF', 'body'] + [e['name'] for e in extras if not e.get('behind')]
slots, atts = [], {}
for n in slot_order:
    bn = n
    p = pieces[n]; x0, y0, x1, y1 = p['box']
    cimg = up(((x0 + x1) / 2, (y0 + y1) / 2))
    bp, br = world[bn]
    d = cimg - bp; c, s_ = math.cos(math.radians(-br)), math.sin(math.radians(-br))
    ax, ay = d[0] * c - d[1] * s_, d[0] * s_ + d[1] * c
    slots.append({'name': n, 'bone': bn, 'attachment': n})
    atts[n] = {n: {'x': round(ax, 2), 'y': round(ay, 2), 'rotation': round(-br, 2), 'width': x1 - x0, 'height': y1 - y0}}
skel = {
    'skeleton': {'spine': '4.1.00', 'x': -J['pelvis'][0], 'y': 0, 'width': W, 'height': G, 'images': './', 'hash': f'tkd-{name}',
                 'tkd': {'source': cfg['source'], 'ground': G, 'height': int(G - np.nonzero(A)[0].min()),
                         'ankleB': [round(v, 1) for v in up(J['ankleB'])], 'toeF': [round(v, 1) for v in up(J['toeF'])]}},
    'bones': out_bones, 'slots': slots, 'skins': [{'name': 'default', 'attachments': atts}],
    'events': {'phase': {'int': 0}, 'impact': {}}, 'animations': {}
}
anim_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'animate.py')
if os.path.exists(anim_file):
    sys.path.insert(0, os.path.dirname(anim_file))
    from animate import build_animations
    skel['animations'] = build_animations(skel, cfg)
json.dump(skel, open(os.path.join(out_dir, f'{name}.json'), 'w', encoding='utf-8'), separators=(',', ':'))
print(f'{name}: {len(pieces)} parts, atlas {atlas.shape[1]}x{atlas.shape[0]}, {len(skel["animations"])} animations')

if DEBUG:
    os.makedirs(DEBUG, exist_ok=True)
    col = {'ponytail': (0, 128, 255), 'head': (128, 0, 255), 'body': (200, 200, 200), 'thighF': (0, 0, 255), 'shinF': (0, 200, 255), 'footF': (0, 255, 0), 'thighB': (255, 0, 0), 'shinB': (255, 0, 200), 'footB': (255, 255, 0)}
    vis = np.full((H, W, 3), 60, np.uint8)
    for n, m in parts.items(): vis[m] = (np.array(col[n]) * 0.5 + src[:, :, :3][m] * 0.5).astype(np.uint8)
    for n, m in fills.items():
        add = m & ~parts[n]; vis[add] = (np.array(col.get(n, (255, 255, 255))) * 0.3 + 120).astype(np.uint8)
    for k, v in J.items(): cv2.circle(vis, tuple(int(q) for q in v), 7, (0, 0, 0), -1); cv2.putText(vis, k, (int(v[0]) + 8, int(v[1])), 0, 0.5, (255, 255, 255), 1)
    cv2.imwrite(os.path.join(DEBUG, f'{name}-parts.png'), vis)
    cv2.imwrite(os.path.join(DEBUG, f'{name}-atlas.png'), cv2.cvtColor(atlas, cv2.COLOR_BGRA2BGR) if False else atlas)
