#!/usr/bin/env python3
"""Keeps sw.js in sync with the project.

Run from the project root after adding, renaming or removing anything in
assets/ (or after changing any code file):

    python tools/update-sw.py

It rewrites APP_SHELL_FILES / IMAGE_FILES / VIDEO_FILES inside sw.js from
what is really on disk, fails loudly if index.html or the code references a
file that does not exist, and bumps CACHE_VERSION so players get the update.
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def arr(name, items):
    return "const %s = [\n%s\n];" % (name, ",\n".join("  './%s'" % i if i else "  './'" for i in items))

anim = sorted(p.replace(os.sep, '/') for p in glob.glob('assets/anim/*/*.*'))
audio = sorted(p.replace(os.sep, '/') for p in glob.glob('assets/audio/**/*.mp3', recursive=True)) + [f for f in ('assets/audio/voice/manifest.json',) if os.path.exists(f)]
shell = [''] + ['index.html', 'style.css'] + [s for s in re.findall(r'<script src="([^"]+)"', open('index.html', encoding='utf-8').read())] \
        + [h for h in re.findall(r'<link[^>]+href="([^"#]+\.(?:css|png|svg))"', open('index.html', encoding='utf-8').read()) if not h.startswith('http')] \
        + ['manifest.json'] + [i['src'].lstrip('./') for i in json.load(open('manifest.json', encoding='utf-8')).get('icons', [])] \
        + [f for f in ('privacy.html',) if os.path.exists(f)] + anim + audio
shell = list(dict.fromkeys(shell))
imgs = sorted(p.replace(os.sep, '/') for e in ('webp', 'png', 'jpg', 'jpeg') for p in glob.glob('assets/images/**/*.' + e, recursive=True) if '_originals' not in p)
vids = sorted(p.replace(os.sep, '/') for p in glob.glob('assets/videos/**/*.mp4', recursive=True))

# every asset path mentioned in the code must exist
missing = []
for f in ['index.html', 'style.css', 'manifest.json'] + [s for s in shell if s.endswith('.js')]:
    if not os.path.exists(f):
        missing.append(f + '  (listed in index.html)'); continue
    for m in re.finditer(r"assets/[^'\"`)\s<>]+?\.(?:webp|png|jpe?g|mp4)", open(f, encoding='utf-8').read()):
        if '${' not in m.group(0) and not os.path.exists(m.group(0)):
            missing.append(f'{m.group(0)}  (in {f})')
if missing:
    print('Missing files:\n  ' + '\n  '.join(sorted(set(missing))))
    sys.exit(1)

sw = open('sw.js', encoding='utf-8').read()
for name, items in (('APP_SHELL_FILES', shell), ('IMAGE_FILES', imgs), ('VIDEO_FILES', vids)):
    sw, n = re.subn(r"const %s = \[[\s\S]*?\];" % name, arr(name, items).replace('\\', '\\\\'), sw)
    if n != 1: sys.exit(f'{name} not found in sw.js')
m = re.search(r"const CACHE_VERSION = 'tkd-v(\d+)';", sw)
ver = int(m.group(1)) + (0 if '--keep-version' in sys.argv else 1)
sw = sw.replace(m.group(0), f"const CACHE_VERSION = 'tkd-v{ver}';")
if '--check' in sys.argv:
    if sw != open('sw.js', encoding='utf-8').read():
        sys.exit('sw.js is out of date - run: python3 tools/update-sw.py')
    print('sw.js is up to date'); sys.exit(0)
open('sw.js', 'w', encoding='utf-8', newline='\n').write(sw)
print(f'sw.js updated: {len(shell)} shell files, {len(imgs)} images, {len(vids)} videos, CACHE_VERSION tkd-v{ver}')
