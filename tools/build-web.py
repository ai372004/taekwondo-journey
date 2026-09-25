#!/usr/bin/env python3
"""Copies only the files the app needs into www/ (the folder the store apps
are built from), then minifies the .js and .css among them with esbuild
(via npx) so the shipped bundle is smaller. Tests, tools, docs, store
screenshots and git files stay out. Falls back to unminified copies with a
warning if esbuild isn't available (e.g. `npm install` was never run).

    python3 tools/build-web.py          then   npx cap sync
"""
import os, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'www')
FILES = ['index.html', 'privacy.html', 'style.css', 'manifest.json', 'sw.js']
DIRS = ['js', 'assets']
SKIP = {os.path.join('assets', 'store')}
MINIFY_EXT = {'.js', '.css'}

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

to_minify = [os.path.join(OUT, f) for f in FILES if os.path.splitext(f)[1] in MINIFY_EXT]
for base, dirs, files in os.walk(os.path.join(OUT, 'js')):
    for f in files:
        if os.path.splitext(f)[1] in MINIFY_EXT:
            to_minify.append(os.path.join(base, f))

before = sum(os.path.getsize(p) for p in to_minify)
minified = 0
for path in to_minify:
    tmp = path + '.min.tmp'
    try:
        subprocess.run(
            ['npx', '--no-install', 'esbuild', path, '--minify', f'--outfile={tmp}'],
            check=True, cwd=ROOT, capture_output=True, text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        msg = e.stderr if isinstance(e, subprocess.CalledProcessError) else str(e)
        print(f'  ! could not minify {os.path.relpath(path, OUT)}, keeping it as-is: {msg}', file=sys.stderr)
        if os.path.exists(tmp):
            os.remove(tmp)
        continue
    os.replace(tmp, path)
    minified += 1

if minified:
    after = sum(os.path.getsize(p) for p in to_minify)
    print(f'minified {minified}/{len(to_minify)} .js/.css files: {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB')
else:
    print('esbuild not available (run `npm install` first) — shipped .js/.css unminified', file=sys.stderr)
