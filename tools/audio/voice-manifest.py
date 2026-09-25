#!/usr/bin/env python3
"""Voice-over files → assets/audio/voice/manifest.json (the game only plays what is listed).

    python3 tools/audio/voice-manifest.py                  # rebuild the manifest + report
    python3 tools/audio/voice-manifest.py --process RAW    # clean raw recordings first:
        trims silence, removes rumble, evens the loudness (-16 LUFS), mono mp3 → assets/audio/voice/<lang>/
        RAW may contain ar/, en/, ko/ sub-folders (or files straight inside = Arabic).
        File names: the names from VOICE_SCRIPT.md (the part after the last '-' is what matters).
"""
import json, os, re, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VOICE = os.path.join(ROOT, 'assets', 'audio', 'voice')
AUDIO = ('.wav', '.m4a', '.mp3', '.ogg', '.aac', '.flac', '.webm', '.opus')

def process(raw):
    n = 0
    for lang in ('ar', 'en', 'ko'):
        src = os.path.join(raw, lang) if os.path.isdir(os.path.join(raw, lang)) else (raw if lang == 'ar' else None)
        if not src: continue
        os.makedirs(os.path.join(VOICE, lang), exist_ok=True)
        for f in sorted(os.listdir(src)):
            if not f.lower().endswith(AUDIO): continue
            out = os.path.join(VOICE, lang, os.path.splitext(f)[0] + '.mp3')
            af = ('highpass=f=80,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,'
                  'areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,'
                  'loudnorm=I=-16:TP=-1.5:LRA=7')
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', os.path.join(src, f), '-af', af, '-ac', '1', '-ar', '44100',
                            '-codec:a', 'libmp3lame', '-b:a', '80k', out], check=True)
            n += 1
    print(f'processed {n} recording(s)')

def build():
    man = {}
    for lang in ('ar', 'en', 'ko'):
        d = os.path.join(VOICE, lang); man[lang] = {}
        if not os.path.isdir(d): continue
        for f in sorted(os.listdir(d)):
            m = re.search(r'-([0-9a-z]+)\.mp3$', f)
            if m: man[lang][m.group(1)] = f
    json.dump(man, open(os.path.join(VOICE, 'manifest.json'), 'w'), indent=1, sort_keys=True)
    lines = json.load(open(os.path.join(VOICE, 'lines.json'), encoding='utf-8')) if os.path.exists(os.path.join(VOICE, 'lines.json')) else {'lines': [], 'korean': []}
    need = {l['key'] for l in lines['lines']}; p1 = {l['key'] for l in lines['lines'] if l['priority'] == 1}
    have = set(man['ar'])
    print(f"Arabic: {len(have & need)}/{len(need)} recorded (priority 1: {len(have & p1)}/{len(p1)}) · English: {len(man['en'])} · Korean: {len(man['ko'])}/{len(lines['korean'])}")
    stale = have - need
    if stale: print('recordings that no longer match any sentence (text changed?):', ', '.join(man['ar'][k] for k in stale))

if __name__ == '__main__':
    if '--process' in sys.argv: process(sys.argv[sys.argv.index('--process') + 1])
    build()
