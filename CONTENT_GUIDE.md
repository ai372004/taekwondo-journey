# Content guide — pictures and videos for the full curriculum

The whole belt syllabus is already **in the game** (`js/data/curriculum.js`, screen
"📚 Belt Syllabus"): 6 belts, 50 techniques, 10 poomsae, 13 kicks — with names in
romanized Korean, Hangul, English and Egyptian Arabic, key points and common mistakes.
Three kicks are fully playable today (Ap Chagi, Naeryeo Chagi, Yeop/Bik Chagi).

Everything else is waiting only for **media**. Drop a file at the right path and it shows
up by itself — no code change. To see what's missing:

```bash
python3 tools/check-curriculum.py                          # summary per belt
python3 tools/check-curriculum.py --csv media-checklist.csv  # full list for the artists
```
(`store/media-checklist.csv` is a ready copy of the list: **211 files**.)

After adding files run `python3 tools/update-sw.py` so they also work offline.

---

## 1. Who needs to do what

| Who | What | Count |
|---|---|---|
| **Head coach** | Confirm/re-order the syllabus per belt (it is a common Kukkiwon club template) and check the key points | 50 items |
| **Illustrator** (same style as the current boy/girl characters) | Stance/block/strike pictures, boy + girl | 27 items × 2 = 54 |
| **Illustrator** | Kick frames: 5 phases × boy + girl | 10 kicks × 10 = 100 |
| **Illustrator** | Poomsae floor diagrams (the Taegeuk "王"-shaped line pattern with numbered steps) | 10 |
| **Videographer + a student/coach** | Short demo clips | 47 |
| **Voice** (optional) | Egyptian-Arabic voice-over for the clips | — |

## 2. Specs

### Pictures (`.webp`)
- **Characters**: same art style, same boy and girl as `assets/images/characters/*/apchagi/*.webp`.
- Size **~950×1400** (portrait), transparent or plain light background, whole body visible, feet on the same baseline in every frame.
- White dobok; belt colour = the belt of that item (yellow for yellow-belt items, etc.).
- Export WebP quality ~82 (each file < 150 KB).

### Kick frames — 5 phases
`assets/images/characters/{boy|girl}_char/<kick-id>/<phase>_{boy|girl}.webp`
with phases **ready → chamber → extension → recoil → return** (same as the playable kicks).
Example: `assets/images/characters/girl_char/dollyo-chagi/chamber_girl.webp`.
When a kick has all 10 frames + video, it can become a full playable path by adding a
`GameConfig.SKILLS` entry (copy the `apchagi` block — phases, tips, quiz).

### Stances / blocks / strikes / basics
`assets/images/curriculum/<id>_boy.webp` and `assets/images/curriculum/<id>_girl.webp`
— one picture of the finished position.

### Poomsae
`assets/images/curriculum/<id>_diagram.webp` — the floor pattern, **1200×1200**, numbered steps, start mark "●".

### Videos (`.mp4`)
- Kicks: `assets/videos/<kick-id>-tutorial.mp4` · everything else: `assets/videos/curriculum/<id>.mp4`
- **H.264 + AAC, 1280×720, 24–30 fps, 8–20 s** (poomsae: full form, ≤ 90 s), < 4 MB each (`ffmpeg -i in.mov -vf scale=1280:-2 -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 96k -movflags +faststart out.mp4`).
- Film from the side the kick is best seen, plain background, one slow + one full-speed repetition.
- ⚠️ Only film children with written parental consent; prefer the coach or an adult student.

## 3. All items by belt

| Belt | Items (id) |
|---|---|
| White | gyeongnye, junbi, gihap, counting, naranhi-seogi, ap-seogi, ap-kubi, arae-makki, momtong-an-makki, momtong-jireugi, **apchagi ▶**, ap-ollyeo-chagi, taegeuk-1 |
| Yellow | olgul-makki, bakkat-makki, dubeon-jireugi, sonnal-mok-chigi, dollyo-chagi, bandal-chagi, **naeryeo-chagi ▶**, taegeuk-2, taegeuk-3 |
| Green | dwit-kubi, beom-seogi, juchum-seogi, sonnal-makki, deung-jumeok, palkup-chigi, **yeop-chagi ▶**, mireo-chagi, taegeuk-4, taegeuk-5 |
| Blue | hecheo-makki, pyeonsonkkeut, dwi-chagi, huryeo-chagi, twio-ap-chagi, hanbeon-kyorugi, taegeuk-6, taegeuk-7 |
| Red | dwi-huryeo-chagi, twio-dollyo-chagi, narae-chagi, kyorugi, gyeokpa, taegeuk-8 |
| Black | hakdari-seogi, koryo, taegeuk-review, free-kyorugi |

▶ = already playable.

## 4. Changing the syllabus
- Move an item to another belt: move its line in `js/data/curriculum.js`.
- Add an item: copy a line, give it a new `id`, run `python3 tools/check-curriculum.py` — it lists the new media slots.
- `npm test` checks that every item still has names in all 4 forms and at least one key point.
