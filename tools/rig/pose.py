#!/usr/bin/env python3
"""Minimal Python renderer for the Spine-subset skeletons (used to preview poses and
to bake phase frames). Mirrors js/anim/skeleton.js."""
import json, math, os
import numpy as np, cv2

def load(name, root):
    d = os.path.join(root, 'assets', 'anim', name)
    skel = json.load(open(os.path.join(d, name + '.json'), encoding='utf-8'))
    atlas_img = cv2.imread(os.path.join(d, name + '.webp'), cv2.IMREAD_UNCHANGED)
    regions, cur = {}, None
    for line in open(os.path.join(d, name + '.atlas'), encoding='utf-8').read().splitlines()[3:]:
        if not line.strip(): continue
        if ':' not in line: cur = line.strip(); continue
        k, v = line.split(':', 1)
        if k.strip() == 'bounds': regions[cur] = list(map(int, v.split(',')))
    return skel, atlas_img, regions

def world_transforms(skel, pose):
    """pose: {bone: {'rotate': deg (added to setup), 'x':, 'y': (added)}} -> {bone: (a,b,c,d,wx,wy)}"""
    W = {}
    for b in skel['bones']:
        p = pose.get(b['name'], {})
        x = b.get('x', 0) + p.get('x', 0); y = b.get('y', 0) + p.get('y', 0)
        r = math.radians(b.get('rotation', 0) + p.get('rotate', 0))
        la, lb, lc, ld = math.cos(r), -math.sin(r), math.sin(r), math.cos(r)
        if 'parent' not in b: W[b['name']] = (la, lb, lc, ld, x, y); continue
        pa, pb, pc, pd, px, py = W[b['parent']]
        W[b['name']] = (pa * la + pb * lc, pa * lb + pb * ld, pc * la + pd * lc, pc * lb + pd * ld, pa * x + pb * y + px, pc * x + pd * y + py)
    return W

def render(skel, atlas, regions, pose, size=(1100, 1200), origin=(560, 1150), scale=1.0, bg=None):
    """Returns BGRA image. origin = pixel where skeleton (0,0) lands; y up in skeleton."""
    Wt = world_transforms(skel, pose)
    out = np.zeros((size[1], size[0], 4), np.float32)
    if bg is not None: out[:] = bg
    atts = skel['skins'][0]['attachments']
    for s in skel['slots']:
        att = atts[s['name']][s['attachment']]
        bx, by, bw, bh = regions[s['attachment']]
        img = atlas[by:by + bh, bx:bx + bw].astype(np.float32)
        a, b, c, d, wx, wy = Wt[s['bone']]
        r = math.radians(att.get('rotation', 0))
        # attachment local: centre (x,y), rotation r; image pixel (u,v) (v down) -> attachment local (u-w/2, h/2-v)
        cr, sr = math.cos(r), math.sin(r)
        # local point = R(r) * (u - w/2, h/2 - v) + (ax, ay); world = M * local + (wx, wy); screen = origin + scale*(X, -Y)
        M = np.array([[a, b], [c, d]]) @ np.array([[cr, -sr], [sr, cr]])
        t = np.array([[a, b], [c, d]]) @ np.array([att['x'], att['y']]) + np.array([wx, wy])
        # screen = S*(M @ [u - w/2, h/2 - v] + t) with S = diag(scale, -scale) + origin
        S = np.array([[scale, 0], [0, -scale]])
        L = S @ M @ np.array([[1, 0], [0, -1]])
        off = S @ (M @ np.array([-bw / 2, bh / 2]) + t) + np.array(origin)
        aff = np.hstack([L, off.reshape(2, 1)])
        warped = cv2.warpAffine(img, aff, size, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
        al = warped[:, :, 3:4] / 255.0
        out[:, :, :3] = warped[:, :, :3] * al + out[:, :, :3] * (1 - al)
        out[:, :, 3:4] = warped[:, :, 3:4] + out[:, :, 3:4] * (1 - al)
    return np.clip(out, 0, 255).astype(np.uint8)

def bone_world(skel, pose, bone, local=(0, 0)):
    a, b, c, d, wx, wy = world_transforms(skel, pose)[bone]
    return (a * local[0] + b * local[1] + wx, c * local[0] + d * local[1] + wy)

LIMBS = ['thighF', 'shinF', 'footF', 'thighB', 'shinB', 'footB']

def pose_from_world(skel, spec):
    """spec: {'thighF': world angle (deg, y-up, 0 = pointing forward/right, -90 = straight down), ...,
              'lean': body tilt deg (+ = lean back), 'hipX','hipY': pelvis offset (skeleton px),
              'ponytail': extra deg}
    -> pose deltas usable by render() / as Spine timeline values."""
    pose = {}
    if 'hipX' in spec or 'hipY' in spec: pose['hip'] = {'x': spec.get('hipX', 0), 'y': spec.get('hipY', 0)}
    if 'lean' in spec: pose['body'] = {'rotate': spec['lean']}
    if 'hipRot' in spec: pose.setdefault('hip', {})['rotate'] = spec['hipRot']
    for k in LIMBS:
        if k in spec:
            W = world_transforms(skel, pose)
            cur = math.degrees(math.atan2(W[k][2], W[k][0]))
            d = spec[k] - cur
            d = (d + 180) % 360 - 180
            pose[k] = {'rotate': d}
    for k in ('ponytail', 'head'):
        if k in spec: pose[k] = {'rotate': spec[k]}
    return pose
