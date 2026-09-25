#!/usr/bin/env python3
"""Copies only the files the app needs into www/ (the folder the store apps
are built from). Tests, tools, docs, store screenshots and git files stay out.

    python3 tools/build-web.py          then   npx cap sync
"""
import os, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'www')
FILES = ['index.html', 'privacy.html', 'style.css', 'manifest.json', 'sw.js']
DIRS = ['js', 'assets']
SKIP = {os.path.join('assets', 'store')}

if os.path.exists(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)
for f in FILES:
    shutil.copy2(os.path.join(ROOT, f), os.path.join(OUT, f))
total = 0
for d in DIRS:
    for base, dirs, files in os.walk(os.path.join(ROOT, d)):
        rel = os.path.relpath(base, ROOT)
        if any(rel == s or rel.startswith(s + os.sep) for s in SKIP):
            continue
        os.makedirs(os.path.join(OUT, rel), exist_ok=True)
        for f in files:
            shutil.copy2(os.path.join(base, f), os.path.join(OUT, rel, f))
            total += os.path.getsize(os.path.join(base, f))
print(f'www/ ready: {total / 1e6:.1f} MB of assets + {len(FILES)} root files')
