#!/usr/bin/env python3
"""The kicks, written as key poses → Spine timelines (called by build-rig.py).

Poses are described like a coach would: where the pelvis is, where each planted
foot is, and the angle of each limb of the kicking leg (degrees, 0 = pointing
forward, 90 = straight up, -90 = straight down). Planted legs are solved with
two-bone IK so feet never slide or sink, on any character's proportions.
"""
import math, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pose import world_transforms

def _angle(W, bone): return math.degrees(math.atan2(W[bone][2], W[bone][0]))

class Rig:
    def __init__(self, skel):
        self.skel = skel
        W = world_transforms(skel, {})
        P = lambda b: (W[b][4], W[b][5])
        self.hip = P('hip')
        self.j = {s: {'hip': P('thigh' + s), 'knee': P('shin' + s), 'ankle': P('foot' + s)} for s in 'FB'}
        L = lambda a, b: math.dist(a, b)
        self.len = {s: (L(self.j[s]['hip'], self.j[s]['knee']), L(self.j[s]['knee'], self.j[s]['ankle'])) for s in 'FB'}
        self.leg = self.len['B'][0] + self.len['B'][1]          # unit for distances
        self.ankleY = self.j['B']['ankle'][1]                    # ankle height when the foot is flat
        self.flat = _angle(W, 'footB')                           # world angle of a flat foot
        self.setup_rot = {b['name']: _angle(W, b['name']) for b in skel['bones']}
        self.has_head = 'head' in self.setup_rot

    def ik(self, s, hip, target, bend=1):
        l1, l2 = self.len[s]
        dx, dy = target[0] - hip[0], target[1] - hip[1]
        d = max(1e-3, min(math.hypot(dx, dy), l1 + l2 - 0.5))
        th = math.degrees(math.atan2(dy, dx))
        a = math.degrees(math.acos(max(-1, min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))))
        thigh = th + a * bend
        kx, ky = hip[0] + l1 * math.cos(math.radians(thigh)), hip[1] + l1 * math.sin(math.radians(thigh))
        shin = math.degrees(math.atan2(target[1] - ky, target[0] - kx))
        return thigh, shin

    def pose(self, p):
        """p: {pelvis:(dx,dy) in leg units, lean, F:{...}, B:{...}} where a leg is
           {'plant': x (leg units, ankle x relative to the setup back ankle), 'foot': deg (default flat)}
           or {'thigh': deg, 'shin': deg, 'foot': deg}. Returns {bone: {'rotate'|'x'|'y'}} deltas."""
        u = self.leg
        dx, dy = p.get('pelvis', (0, 0))
        out = {'hip': {'x': dx * u, 'y': dy * u}}
        if 'lean' in p: out['body'] = {'rotate': p['lean']}
        if 'tail' in p: out['ponytail'] = {'rotate': p['tail']}
        if 'head' in p and self.has_head: out['head'] = {'rotate': p['head']}
        world = {}
        for s in 'FB':
            leg = p[s]
            hip = (self.j[s]['hip'][0] + dx * u, self.j[s]['hip'][1] + dy * u)
            if 'plant' in leg:
                tgt = (self.j['B']['ankle'][0] + leg['plant'] * u, self.ankleY + leg.get('lift', 0) * u)
                thigh, shin = self.ik(s, hip, tgt, leg.get('bend', 1))
                foot = leg.get('foot', self.flat)
            else:
                thigh, shin, foot = leg['thigh'], leg['shin'], leg.get('foot', self.flat)
            world.update({'thigh' + s: thigh, 'shin' + s: shin, 'foot' + s: foot})
        # world angles -> local deltas (thigh's parent 'hip' does not rotate; shin/foot are chained)
        for s in 'FB':
            t, sh, f = world['thigh' + s], world['shin' + s], world['foot' + s]
            out['thigh' + s] = {'rotate': _wrap(t - self.setup_rot['thigh' + s])}
            out['shin' + s] = {'rotate': _wrap((sh - t) - (self.setup_rot['shin' + s] - self.setup_rot['thigh' + s]))}
            out['foot' + s] = {'rotate': _wrap((f - sh) - (self.setup_rot['foot' + s] - self.setup_rot['shin' + s]))}
        return out

def _wrap(a): return (a + 180) % 360 - 180

# ------------------------------------------------------------------ the moves
# Leg units: 1.0 = the standing leg's length. 'plant' x is relative to where the
# standing foot is in the source picture. The KICKING leg is F (the near leg,
# drawn in front); in the fighting stance it waits BEHIND, like a real rear-leg kick.
STANCE = {'pelvis': (-0.16, -0.055), 'lean': -2, 'F': {'plant': -0.40, 'bend': 1}, 'B': {'plant': 0.02}}
STANCE_DIP = {'pelvis': (-0.14, -0.075), 'lean': -3, 'F': {'plant': -0.40}, 'B': {'plant': 0.02}}
UPRIGHT = {'pelvis': (0.0, -0.01), 'lean': 0, 'F': {'plant': -0.02}, 'B': {'plant': 0.02}}

def front_kick_poses():
    chamber = {'pelvis': (-0.03, -0.02), 'lean': 3, 'F': {'thigh': 22, 'shin': -78, 'foot': -35}, 'B': {'plant': 0.02}}
    strike = {'pelvis': (0.02, -0.015), 'lean': 9, 'F': {'thigh': 12, 'shin': 12, 'foot': 78}, 'B': {'plant': 0.02, 'foot': None}}
    return chamber, strike

EASE = [0.25, 0.1, 0.25, 1]          # css-like ease
SNAP = [0.1, 0.8, 0.2, 1]            # fast out, soft landing (strikes)
SOFT = [0.42, 0, 0.58, 1]            # ease in-out

def seq(rig, keys, events):
    """keys: [(time, pose, ease)] -> Spine animation dict."""
    tl = {}
    for i, (t, p, ease) in enumerate(keys):
        d = rig.pose(fix(p))
        for bone, ch in d.items():
            for k, v in ch.items():
                tl.setdefault(bone, {}).setdefault('rotate' if k == 'rotate' else 'translate', {}).setdefault(i, {})[k] = v
    anim = {'bones': {}, 'events': events}
    for bone, chans in tl.items():
        for chan, per in chans.items():
            arr = []
            for i, (t, _, ease) in enumerate(keys):
                v = per.get(i, {})
                k = {'time': round(t, 4)}
                if chan == 'rotate': k['value'] = round(v.get('rotate', 0), 3)
                else: k['x'] = round(v.get('x', 0), 2); k['y'] = round(v.get('y', 0), 2)
                if i < len(keys) - 1:
                    t1 = keys[i + 1][0]; e = keys[i][2]
                    if chan == 'rotate':
                        v0 = k['value']; v1 = round(per.get(i + 1, {}).get('rotate', 0), 3)
                        k['curve'] = _bez(t, v0, t1, v1, e)
                    else:
                        x0, y0 = k['x'], k['y']
                        nx = per.get(i + 1, {})
                        k['curve'] = _bez(t, x0, t1, nx.get('x', 0), e) + _bez(t, y0, t1, nx.get('y', 0), e)
                arr.append(k)
            anim['bones'].setdefault(bone, {})[chan] = arr
    return anim

def _bez(t0, v0, t1, v1, e):
    dt, dv = t1 - t0, v1 - v0
    return [round(t0 + e[0] * dt, 4), round(v0 + e[1] * dv, 3), round(t0 + e[2] * dt, 4), round(v0 + e[3] * dv, 3)]

def phases(times): return [{'time': round(t, 4), 'name': 'phase', 'int': i} for i, t in enumerate(times)]

def fix(p):   # drop None foot overrides
    q = dict(p)
    for s in 'FB':
        if s in q: q[s] = {k: v for k, v in q[s].items() if v is not None}
    return q

def build_animations(skel, cfg):
    rig = Rig(skel)
    A = {}
    tail = 'ponytail' in [b['name'] for b in skel['bones']]
    st = STANCE
    # idle: breathing in the fighting stance
    up = dict(st, pelvis=(st['pelvis'][0], st['pelvis'][1] + 0.012), lean=-1)
    A['idle'] = seq(rig, [(0, st, SOFT), (1.0, up, SOFT), (2.0, st, SOFT)], [])
    A['ready'] = seq(rig, [(0, st, SOFT), (0.4, st, SOFT)], phases([0]))

    ch, sk = front_kick_poses()
    A['apchagi'] = seq(rig, [
        (0.00, st, SOFT), (0.12, STANCE_DIP, EASE), (0.34, fix(ch), SNAP), (0.48, fix(sk), EASE),
        (0.60, fix(sk), EASE), (0.76, fix(ch), EASE), (1.02, st, SOFT), (1.25, st, SOFT)],
        phases([0.0, 0.34, 0.50, 0.76, 1.02]) + [{'time': 0.48, 'name': 'impact'}])

    # axe kick: straight leg rises in front, heel drops
    mid = {'pelvis': (-0.06, -0.02), 'lean': 5, 'F': {'thigh': 5, 'shin': 2, 'foot': 30}, 'B': {'plant': 0.02}}
    rise = {'pelvis': (-0.04, -0.01), 'lean': 13, 'F': {'thigh': 84, 'shin': 86, 'foot': 105}, 'B': {'plant': 0.02}}
    drop = {'pelvis': (0.02, -0.03), 'lean': 4, 'F': {'thigh': -12, 'shin': -16, 'foot': 20}, 'B': {'plant': 0.02}}
    rec = {'pelvis': (-0.02, -0.03), 'lean': 1, 'F': {'thigh': -48, 'shin': -112, 'foot': -45}, 'B': {'plant': 0.02}}
    A['naeryeo'] = seq(rig, [
        (0.00, st, SOFT), (0.10, STANCE_DIP, EASE), (0.26, mid, EASE), (0.46, rise, EASE), (0.60, rise, SNAP),
        (0.72, drop, EASE), (0.88, rec, EASE), (1.12, st, SOFT), (1.35, st, SOFT)],
        phases([0.0, 0.46, 0.72, 0.88, 1.12]) + [{'time': 0.72, 'name': 'impact'}])

    # front rising kick: straight leg up and down, no knee bend
    hi = {'pelvis': (-0.04, -0.01), 'lean': 10, 'F': {'thigh': 70, 'shin': 72, 'foot': 95}, 'B': {'plant': 0.02}}
    A['ap-ollyeo'] = seq(rig, [(0, st, SOFT), (0.12, STANCE_DIP, EASE), (0.28, mid, EASE), (0.44, hi, EASE), (0.62, mid, EASE), (0.9, st, SOFT), (1.1, st, SOFT)],
                         phases([0, 0.28, 0.44, 0.62, 0.9]))
    # push kick: high chamber, then push with the whole sole
    pch = {'pelvis': (-0.05, -0.02), 'lean': 6, 'F': {'thigh': 30, 'shin': -55, 'foot': 10}, 'B': {'plant': 0.02}}
    push = {'pelvis': (0.05, -0.02), 'lean': 14, 'F': {'thigh': 6, 'shin': 4, 'foot': 92}, 'B': {'plant': 0.02}}
    A['mireo'] = seq(rig, [(0, st, SOFT), (0.12, STANCE_DIP, EASE), (0.34, pch, EASE), (0.5, push, SNAP), (0.64, push, EASE), (0.8, pch, EASE), (1.05, st, SOFT), (1.25, st, SOFT)],
                     phases([0, 0.34, 0.5, 0.8, 1.05]) + [{'time': 0.5, 'name': 'impact'}])

    # got hit: rock back and recover
    back = {'pelvis': (-0.2, -0.05), 'lean': 16, 'head': 12, 'F': {'plant': -0.42}, 'B': {'plant': 0.02, 'foot': None}}
    A['hit'] = seq(rig, [(0, st, SNAP), (0.12, back, EASE), (0.5, st, SOFT)], [])
    # celebrate: little jump
    crouch = {'pelvis': (-0.1, -0.12), 'lean': -4, 'F': {'plant': -0.2}, 'B': {'plant': 0.02}}
    air = {'pelvis': (-0.08, 0.12), 'lean': -6, 'F': {'thigh': -60, 'shin': -120, 'foot': -60}, 'B': {'thigh': -75, 'shin': -110, 'foot': -40}}
    A['win'] = seq(rig, [(0, st, SOFT), (0.18, crouch, SNAP), (0.4, air, EASE), (0.62, crouch, EASE), (0.9, st, SOFT)], [])
    # walk cycle (in place — the game moves the character)
    w1 = {'pelvis': (-0.1, -0.03), 'lean': -3, 'F': {'plant': -0.30}, 'B': {'plant': 0.10}}
    w2 = {'pelvis': (-0.1, -0.005), 'lean': -3, 'F': {'thigh': -70, 'shin': -110, 'foot': -20}, 'B': {'plant': -0.1}}
    w3 = {'pelvis': (-0.1, -0.03), 'lean': -3, 'F': {'plant': 0.10}, 'B': {'plant': -0.30}}
    w4 = {'pelvis': (-0.1, -0.005), 'lean': -3, 'F': {'plant': -0.1}, 'B': {'thigh': -70, 'shin': -110, 'foot': -20}}
    # Error Hunt pictures: the front kick at impact with ONE mistake each
    ch_, sk_ = front_kick_poses()
    good = dict(sk_, head=0)
    A['err-ok'] = seq(rig, [(0, good, SOFT), (0.1, good, SOFT)], [])
    A['err-head'] = seq(rig, [(0, dict(good, head=-24), SOFT), (0.1, dict(good, head=-24), SOFT)], [])
    bent = dict(good, F={'thigh': 14, 'shin': -38, 'foot': 20})
    A['err-knee'] = seq(rig, [(0, bent, SOFT), (0.1, bent, SOFT)], [])
    lean = dict(good, lean=30, head=10, pelvis=(0.0, -0.02))
    A['err-lean'] = seq(rig, [(0, lean, SOFT), (0.1, lean, SOFT)], [])
    heel = dict(good, pelvis=(0.03, 0.035), B={'plant': 0.05, 'lift': 0.05, 'foot': rig.flat - 38})
    A['err-heel'] = seq(rig, [(0, heel, SOFT), (0.1, heel, SOFT)], [])
    A['walk'] = seq(rig, [(0, w1, SOFT), (0.2, w2, SOFT), (0.4, w3, SOFT), (0.6, w4, SOFT), (0.8, w1, SOFT)], [])
    return A
