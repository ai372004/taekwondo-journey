#!/usr/bin/env python3
"""Curriculum media report — which pictures/videos are still missing.

    python3 tools/check-curriculum.py                 # report
    python3 tools/check-curriculum.py --csv out.csv   # checklist for the artists
    python3 tools/check-curriculum.py --strict-data   # fail on broken data only (CI)
    python3 tools/check-curriculum.py --strict        # fail if ANY media is missing (release)

Reads js/data/curriculum.js (through node), so the list is always the one the game uses.
"""
import csv, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
js = open('js/data/curriculum.js', encoding='utf-8').read()
out = subprocess.run(['node', '-e', js + '\nprocess.stdout.write(JSON.stringify({belts: Curriculum.BELTS, kinds: Curriculum.KINDS}))'],
                     capture_output=True, text=True, encoding='utf-8')
if out.returncode:
    sys.exit('curriculum.js does not run:\n' + out.stderr)
data = json.loads(out.stdout)

errors, rows = [], []
seen = set()
for b in data['belts']:
    for it in b['items']:
        if it['id'] in seen: errors.append(f"duplicate id {it['id']}")
        seen.add(it['id'])
        for f in ('ko', 'hangul'):
            if not it.get(f): errors.append(f"{it['id']}: missing {f}")
        if not (it['name'].get('en') and it['name'].get('ar')): errors.append(f"{it['id']}: missing en/ar name")
        if not it['points']: errors.append(f"{it['id']}: no key points")
        for p in it['points'] + it['mistakes']:
            if not (p.get('en') and p.get('ar')): errors.append(f"{it['id']}: a point is missing en or ar")
        if it['kind'] not in data['kinds']: errors.append(f"{it['id']}: unknown kind {it['kind']}")
        if it['status'] == 'playable':
            continue  # playable kicks use their own GameConfig frames (checked by update-sw.py)
        media = it['media']
        for path in media['frames'] + [media['video']]:
            rows.append({'belt': b['id'], 'id': it['id'], 'name': it['ko'], 'kind': it['kind'],
                         'type': 'video' if path.endswith('.mp4') else 'image', 'path': path, 'exists': os.path.exists(path)})

missing = [r for r in rows if not r['exists']]
print(f"Curriculum: {len(data['belts'])} belts · {len(seen)} items · {len(rows)} media slots · {len(rows) - len(missing)} present · {len(missing)} missing")
by_belt = {}
for r in missing: by_belt.setdefault(r['belt'], set()).add(r['id'])
for b in data['belts']:
    n = len(by_belt.get(b['id'], ()))
    print(f"  {b['id']:<7} {n:>3} item(s) still waiting for media")
if '--csv' in sys.argv:
    dest = sys.argv[sys.argv.index('--csv') + 1]
    with open(dest, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=['belt', 'id', 'name', 'kind', 'type', 'path', 'exists'])
        w.writeheader(); w.writerows(rows)
    print(f'checklist written to {dest}')
if errors:
    print('Data errors:\n  ' + '\n  '.join(errors)); sys.exit(1)
if '--strict' in sys.argv and missing:
    sys.exit(1)
