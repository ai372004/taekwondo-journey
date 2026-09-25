# 🥋 Taekwondo Journey

An offline-ready, bilingual (Arabic / English) web game that teaches kids three
Taekwondo kicks — **Ap Chagi** (front kick), **Naeryeo Chagi** (axe kick) and
**Bik Chagi** (side kick) — through a warm-up, video lessons, mini-games and a test.

Open `index.html` through any static web server (e.g. `python -m http.server`)
so the service worker can cache everything for offline use in the gym.

## Project layout

```
index.html              all screens (markup only) + the ordered <script> list
privacy.html            privacy policy (AR/EN) — linked from the menu, needed by the stores
style.css               all styles (newest sections at the bottom, marked by version)
js/
  core/                 sprite-engine, config (GameConfig), helpers, state (GameState + i18n),
                        screens (ScreenManager), players (PlayerSystem, attempt log)
  data/curriculum.js    the full belt syllabus: 6 belts, 50 techniques, 10 poomsae (media slots)
  learn/                learning (5-phase lessons), warmup, curriculum-screen, review (smart review)
  games/                form-control, puzzle, performance, action, error-hunt, quiz-blast, quiz,
                        arena-engine (canvas engine + Board Break, Paddles, Rhythm),
                        arena-games-2 (Sparring Duel, Balance Hold, Heavy Bag)
  ui/                   journey (the adventure map), tabbar (bottom tabs), winner, trophy-room, cooldown, report, skill-menu, certificate, effects, dashboard
  social/               competition (start screen, home hub, difficulty, hints, challenge, league,
                        coach mode, player cards, gym board), versus (duel + tournament), profile (hero pages)
  audio/audio.js        sound effects (samples), background music, recorded voice with phone-voice fallback
  anim/skeleton.js      skeletal-animation runtime (reads Spine JSON 3.8/4.x + .atlas)
  anim/rig-views.js     RigView (lessons), RigFighter / RigOpponent (arena games, duels, sparring)
  lib/qr.js             small offline QR-code encoder
  app/main.js           boot + global handlers used by onclick=""
sw.js                   service worker (offline cache) — kept in sync by tools/update-sw.py
manifest.json           PWA / store manifest (maskable icons, screenshots, shortcuts)
tests/run.mjs           automated tests (npm test) — also run by .github/workflows/test.yml
tests/audit.mjs         kid-style audit: every screen on 2 phones + a tablet (tap sizes, covered buttons, cut text)
tests/kid-flow.mjs      "plays like a kid": sign-up, tabs, warm-up, lesson, random taps in every game, duel
tools/
  update-sw.py          rewrites the file lists in sw.js, checks every path, bumps CACHE_VERSION (--check for CI)
  build-icons.py        builds assets/icons/icons.css (the app's own offline icon set)
  check-curriculum.py   lists the curriculum pictures/videos still missing (--csv for a checklist)
  build-web.py          copies only the app files into www/ for the store builds (Capacitor)
  audio/                make-sfx.py, make-music.py (render the sounds/music), voice-script.mjs (recording script),
                        voice-manifest.py (clean recordings + list them for the game)
  rig/                  builds the boy/girl skeletons from the existing art (build-rig.py + *.rig.json),
                        the moves (animate.py), preview.html, bake.mjs (→ picture frames), bake-errorhunt.mjs
  store-screenshots.mjs / feature-graphic.mjs   regenerate the store images
capacitor.config.json   Android + iOS app wrapper (see STORE_GUIDE.md)
store/                  listing texts, feature graphics, TWA config, assetlinks template, media checklist
STORE_GUIDE.md          step-by-step publishing on Google Play and the App Store
CONTENT_GUIDE.md        every picture/video the curriculum still needs, with paths and specs
VOICE_SCRIPT.md         every sentence to record in Egyptian Arabic (+ Korean terms for the coach), with file names
ART_BRIEF.md            the characters: what the skeleton does now and exactly what art is still needed
assets/
  anim/boy, anim/girl   the skeletons: <name>.json + <name>.atlas + <name>.webp (Spine format)
  icons/                app icons (any + maskable + 1024) and icons.css
  store/                store screenshots (phone, tablet, iPhone, iPad × AR/EN)
  images/
    backgrounds/        one background per screen
    characters/         boy_char/ girl_char/ (apchagi/ narochagi/ bikchagi/ + idle, win, walk, hit), coach_yang/
    curriculum/         (new) pictures for the syllabus — see CONTENT_GUIDE.md
    error_hunt/         the 8 Error Hunt pictures
  videos/
    *-tutorial.mp4      one lesson video per kick
    warmup/             7 warm-up clips
    curriculum/         (new) demo clips for the syllabus
```

Scripts are classic (not modules) and share one global scope, so **the order of the
`<script>` tags in index.html matters**; `tools/update-sw.py` reads that same list.

### Everyday commands
```bash
npm install && npx playwright install chromium   # once
npm test                                         # all tests (~2 min); npm test -- curriculum  to filter
npm run serve                                    # http://localhost:8765
python3 tools/update-sw.py                       # after any change you ship (bumps the offline cache)
python3 tools/check-curriculum.py                # what media is still missing
```

Every kick folder uses the same five file names:
`ready_*.webp · chamber_*.webp (rise_* for the axe kick) · extension_*.webp (drop_*) · recoil_*.webp · return_*.webp`.
To replace a picture, save the new one (transparent WebP, figure facing right)
with the same name, then run `python tools/update-sw.py` (it updates `sw.js`,
fails if any path in the code points at a missing file, and bumps `CACHE_VERSION`).

## What changed in v34.3 — Torso Twists dropped, videos only in warm-up

- **🎥 Warm-up is now 7 exercises, all with a real clip**: Torso Twists was the one exercise with no filmed
  clip (its recovered clip didn't hold up — see v34) and fell back to a hand-drawn animation instead. Rather
  than keep a drawing-only exercise in a warm-up that's otherwise all video, it's been dropped, so every
  remaining exercise now has its own real clip. Its unused hand-drawn animation and side-kick "key exercise"
  badge were removed with it.

## What changed in v34.2 — the new character art, applied as given

- **🎨 New character pictures for all three kicks (front, side, turning), both characters**: replaced with a
  fresh set of images provided directly, at the child's explicit request to use them exactly as supplied rather
  than cherry-picked. Before making the change, the mismatches below were shown and confirmed — they're real,
  known, and intentionally left as-is rather than patched over:
  - The front kick's boy pictures now kick to the opposite side from the rest of the app's convention, so the
    hit-effect in the sparring arena lands behind the fighter instead of toward the opponent.
    (`tests/run.mjs` documents this so a future correction is easy to spot.)
  - Several new pictures (girl front kick's strike frame, all of the girl turning kick, most of the side kick for
    both characters) come with their own studio photo or a solid black/white background baked in, instead of a
    transparent one — so a faint box or backdrop can show up behind the character on those frames.
  - The set no longer uses one consistent-looking character per kick; some phases now noticeably differ in art
    style or size from their neighbors within the same kick.
  - The girl front kick has no "return to stance" picture in the new set, so that one frame was left as it was.
  - None of this crashes anything — every screen (lessons, arena games, the pose game's cosmetics overlay) still
    loads and plays; it's a visual mismatch, not a functional break. The full test suite (`node tests/run.mjs`)
    passes with the new baseline recorded.

## What changed in v34 — real body proportions everywhere, warm-up clips are back, no more spoiler labels

- **🧍 The character's real (chubbier) proportions now show everywhere, not the thinner rig**: the live skeleton
  used in lessons, the six arena games, duels and the sparring partner is rebuilt by slicing one photo into
  bone-shaped pieces, and that particular photo reads noticeably thinner than the character everywhere else
  (menus, celebrations, the puzzle game's pictures). Rather than ship two different-looking bodies, the skeleton
  is now **off by default** — every one of those screens shows the same correct-body picture frames the puzzle
  game and the side kick already used, and the little idle character on the home map falls back to the same
  photo instead of a bobbing pointer emoji. The skeleton itself is untouched and still fully covered by tests —
  it's now an opt-in (`localStorage.taekwondoJourneyAnim = 'skeleton'`) for whenever new art is sliced for it
  that actually matches.
- **🎥 The warm-up's demo clips are back**: real filmed clips for 7 of the 8 warm-up exercises (they'd been
  dropped in an earlier version) play behind each exercise, with the hand-drawn animation as the fallback if a
  clip is missing or won't play on that device — the corner badge says which one is showing. Torso Twists has no
  clip (its recovered one didn't hold up) and always shows its drawing.
- **🧩 Puzzle game no longer gives the order away**: each empty slot named its own phase ("Preparation",
  "Chamber", …), which told the child the answer before they'd tried anything. Empty slots are blank now; the
  name reappears once a piece actually lands there, as confirmation.
- **🎉 The "win" celebration pose was actually the wrong picture**: `boy_win_1/2.webp` and `girl_win_1.webp` had
  somehow ended up as a leaning side pose (not a celebration at all) instead of the arms-up cheer they're meant
  to be — the correct originals were still sitting untouched in `_originals/` and are now back in place.

## What changed in v33 — the belt shows in the pose game too, and a way to prove CSS is safe

- **🥋 The bought belt and headband now appear in the pose game as well**: every other screen draws the fighter
  with the skeleton, so the Star Shop's cosmetics rode along for free. The pose game is the one screen that shows
  the canonical *photographs* of each kick phase, so it was left out. It now measures the photo's own silhouette
  and an off-screen render of the rig in the same pose — same character, same pose, so the two differ only by a
  scale and a shift — and paints just the belt and headband onto a transparent layer over the picture, following
  the child through every phase. Kicks with no skeletal animation (the side kick) keep their plain pictures.
- **🎀 The belt and headband were redrawn**: the old belt was a single slab about twice the width of the child's
  waist. Both are now proper cloth — a wrap sized to the torso with a knot and two tails hanging at the front, and
  a brow band with its knot streaming behind the head. This shows everywhere the fighter appears, not just here.
- **🧪 `tools/css-snapshot.mjs`**: records the full computed style of every element on every screen (3 sizes ×
  2 languages × 28 screens ≈ 16,000 elements) so a stylesheet refactor can be *proven* not to change what is
  drawn, instead of being eyeballed. `npm run css:snapshot` before, `npm run css:check` after.
- **🎨 99 repeated colour literals became the tokens that already existed** (`var(--shadow-color)`,
  `var(--primary-color)` …), and the two values that repeated most without a name got one (`--star-gold`,
  `--surface-tint` — 75 more). Verified with the tool above: not one of the ~16,000 elements changed.
- **🖼️ A test now pins the character art**: every kick's pictures must be one character at one size with no
  background baked in. The side kick is listed as the one known exception (three different children at three
  different sizes) — when that art is finally redrawn the test says so instead of quietly passing. The exact
  files and what is wrong with each are in `ART_BRIEF.md`.
- **⚡ Performance re-checked after v31–v33**: every animated screen still runs at 58–61 fps with the CPU slowed
  4× (a mid-range Android). The one new cost — working out where a photo's waist is — is now measured per phase
  as the child reaches it (~70 ms once, then free) instead of all five up front.

## What changed in v32 — coach tools: a stuck-report, in-app voice recording, a safer PIN

- **🧩 Coach report — where kids get stuck**: the coach panel already flagged which *player* needed help (low
  scores, a fail streak, no training for a week). It now also has a "Where kids get stuck" section that looks
  across *every* player and surfaces which station — a specific kick × mini-game combo, e.g. "Naeryeo Chagi ·
  Strike" — has the worst miss rate, and how many different kids hit it. That's the number that tells a coach
  what to spend the next lesson's time on, not just who needs a hand.
- **🎙️ Record the Egyptian voice, right on the phone**: a new "Record voice" tab in the coach panel lists every
  sentence the game can say (the same script `VOICE_SCRIPT.md` is generated from) with a progress bar, and lets
  the coach record each line with the device's own microphone — no computer, no external tools. Recordings are
  saved on that device only (there's no server) and take priority over the built-in voice/manifest recordings
  and the phone's own text-to-speech the instant they're saved, everywhere that line is spoken.
- **🔑 A coach PIN that can't be a giveaway**: the coach PIN has always required the coach to pick their own
  4 digits on first use (there never was a hardcoded default). It now also turns down obviously-guessable
  choices — `1234`, `0000`, `1212`, four digits running in order, and a few other common weak PINs — asking the
  coach to pick something a curious kid couldn't just try.
- **🧹 Cleaned up `style.css`**: ~380 lines of dead rules from earlier redesigns (an old warm-up layout replaced
  by "wu2", an old character-preview/joint-dot scheme, an unused Korean-audio button, a couple of leftover arena
  classes) were removed after checking, file by file, that nothing in the game still creates those class names —
  including the ones built dynamically (e.g. `` `is-${state}` ``), which were kept. Nothing about how any screen
  looks or behaves changed; the full test suite, the kid-tap simulator and the phone/tablet audit all still pass.

## What changed in v31 — read it out loud, a shop for stars, a daily gift

- **🔊 Read-aloud, for the 6-year-olds who can't read yet**: a 🔊 button on every screen reads its title and
  instructions out loud, a small 🔊 on every game card reads its name and what to do, and the quiz's speaker now
  reads the question *and* all four answers (it used to read only the question). A 🗣️ switch in the header turns on
  "read everything to me by myself" — each screen, each new quiz question and the map's next step are then spoken
  automatically a beat after they appear (never twice for the same question). Speech goes through the existing
  recorded-voice pipeline, so a real Egyptian recording is used before falling back to the phone's voice.
- **🛍️ Star Shop — spend stars on the fighter's look**: every star earned across *every* kick (not just the one on
  screen) is spendable on a belt colour (white → yellow → green → blue → red → black, echoing the real taekwondo
  ranks) and a headband (red/blue/gold). Tapping the map's ⭐ counter, or a new button in the Trophy Room, opens the
  shop. Cosmetics are purely visual — they never touch real skill or belt progress — and are drawn by the same
  skeletal rig everywhere the fighter appears: the map, the lesson, every arena game, duels and the sparring
  opponent, all tracking the kick's motion frame by frame.
- **🎁 Today's mission**: a small box under the map's header — "play 2 things today for a gift" — fills in as the
  child plays (a dot per attempt) and pops once it's done; tapping it claims a bonus 5 stars that lands straight in
  the Star Shop's balance. One gift per day, riding on the attempts log that already powers the practice streak.

## What changed in v30 — the adventure map, smoother animation everywhere

- **«مغامرة آب تشاجي» — the adventure map** replaces the row of five dots on the home screen. Eight stations per kick
  (🔥 الإحماء · 🎓 اتعلمها · 🎭 الوضعية · 🧩 رتّبها · 👁️ عين الحكم · ⚡ الضربة · 📝 الاختبار · 🎁 الكنز) sit on a road that
  snakes across the card like a board game. The road fills up to where the child is, the child's own animated fighter
  stands next to the station that is next, and that station glows and bobs; finished stations keep a ✓ and their stars.
  The big «next step» button now sits right under the title, so it is on screen even on a 640 px phone.
- **Stars ⭐**: every game and the test give 1–3 stars (anything / 75+ / 90+), shown on the map, on each game card and on
  the winner screen (they pop in one by one with a sound). The map counts them («⭐ ١١/٢١»).
- **Coming back after a game is a small show**: the station pops with sparks, its stars fly in, the counter counts up, the
  road fills to the next station and the fighter hops there.
- **The treasure**: finishing a kick's test opens a treasure-chest pop-up (the chest shakes, bursts into the medal, rays
  and confetti) and the map moves on to the next kick; a signpost at the end of the road already teases it.
- **Games center**: a compact two-column grid on phones (was one 450 px card per row — the page is 60 % shorter), with
  ★★★ on every card and the game to play next spanning the full width.
- **Winner screen**: stars first, then one big «الخطوة الجاية» button right under the score (it used to be below the
  certificate, under the tab bar), «جرّب تاني» next, the rest after.
- **Animation performance** (measured with the new `tests/perf.mjs`: phone viewport, CPU slowed 4×):
  - canvas games went from **15–24 fps to 54–61 fps**: the arena backdrop (two full-screen gradients + mat lines) is
    painted once and copied; rhythm-game notes are pre-rendered sprites instead of a shadow-blur + gradient per note per
    frame; kick photos are resized once per layout instead of every frame; and the canvas renders at most ~1 megapixel and
    **lowers its own render scale when frames get slow** (remembered for next time; small/old phones start one step lower).
  - page animations that repainted every frame (glowing box-shadows, sliding gradients, pulsing text-shadows, border
    colours) were rebuilt as transform/opacity layers that run on the GPU; decorations play a few times and rest — only
    the one thing to tap next keeps moving; the full-screen backdrop blur is gone.
  - **lite mode**: on phones with ≤ 4 cores or ≤ 3 GB, or once a game had to lower its quality, decorative loops switch off
    and particle counts drop.

## What changed in v29 — one clear path, and a lot more life on screen

- **«رحلتي» — the journey path** on the home screen: five stations (🔥 الإحماء · 🎓 انعلمها · 🎮 العب ٤ ألعاب ·
  📝 الاختبار · 🏅 الوسام). Done stations carry a ✓, the current one pulses, later ones stay locked (a tap on a locked
  station shakes it and says «خلّص اللي قبلها الأول 😊»). One big button always says exactly what to do next, and the
  little fighter next to it kicks before the screen changes.
- **A brand-new child sees one thing only**: the path, plus Coach Yang popping up to say hello («أهلًا! أنا الكوتش يانج
  👋 … امشي على الطريق») with one big «يلا بينا! 🚀». Everything else (challenge, league, cards) waits behind
  «✨ وريني حاجات تانية» until the child asks for it.
- **No dead ends**: the warm-up, the lesson and the winner screen all end with the same «الخطوة الجاية: …» button, so a
  child is never returned to a menu to guess what comes next. Games and the skill menu mark the next required card with
  «👉 ابدأ من هنا».
- **Full-screen play**: in the canvas games (Sparring Duel, Heavy Bag, Board Break, Paddles, Rhythm, Balance, Action) the
  tab bar steps aside the way it already did in the warm-up, so «اركل!» and «ارجع للألعاب» are both on screen with nothing
  on top of them; a play area taller than the phone is now scrolled to its **bottom** (where the buttons are) instead of
  its middle. The puzzle lights up and scrolls to «اتأكد من الترتيب» the moment the last piece is placed.
- **Nothing hides behind the tab bar**: on phones and tablets a game's own buttons (اتأكد من الشكل / ابدأ من جديد) are
  pinned just above the tabs, the main green one first and full width; the game's feedback now also appears as a toast
  where the child is looking, and toasts no longer land on the header buttons. A new test fails if a main button ever
  ends up under the bar again.
- **Two bugs the pass uncovered**: the little animated characters (home path, winner screen) never drew a single frame —
  their frame clock never started; and a mouse resting on the bottom edge of any button made it flicker forever, because
  the hover lift moved the button out from under the cursor.
- **Visual + motion pass**: unified cards and gradient screen titles with a soft underline, staggered card entrance,
  pop/press/focus states on everything tappable (hover now scales instead of jumping, which also stopped the flicker on
  a mouse), animated counting numbers on results, sparkles when a station is completed, live animated characters on the
  home path and the winner screen, and the play area scrolls itself to the middle of a phone screen when a game opens.
  Every animation respects «تقليل الحركة» (prefers-reduced-motion).

## What changed in v28 — made for small hands, sound, smart review

- **Bottom tab bar** replaces the 20-button side menu: 🥋 اتمرّن · 🎮 العب · ⭐ إنجازاتي · 👩‍🏫 المدرب. Each tab opens a
  sheet of big tiles; the tab of the current screen is lit; hidden during the full-screen warm-up.
- **Kid-style audit** (`tests/audit.mjs`, `tests/kid-flow.mjs`) on 360/390/820 px, touch, Arabic. Fixed what it found:
  the warm-up card was wider than a phone (drawing cut off, timer on top of it), 38 controls under 44 px, English labels
  inside the warm-up drawings, long instructions pushing the games off screen on phones (now fold to 2 lines + "read all"),
  the menu button sitting on top of every title (gone with the tab bar).
- **Sound**: 20 rendered sound effects (pad hits with 3 variations, whooshes, board crack, bag thud, gong, fanfare…) and
  two seamless music loops (calm "dojo", energetic "arena") that follow the screen, fade under speech and lesson videos,
  and have their own 🎵 switch. All made by `tools/audio/*.py` — no licences needed.
- **Recorded voice, ready for a real Egyptian voice**: the game plays a recording whenever one exists and only falls back to
  the phone's voice otherwise. `VOICE_SCRIPT.md` lists all 141 sentences (38 first) and 50 Korean terms with exact file
  names; `tools/audio/voice-manifest.py --process <folder>` trims, cleans and levels the raw recordings.
- **Smart review**: games report what went wrong (lesson step, part of the foot, legal targets, timing, eyes/knee/back/heel),
  mistakes fade over ~10 days and good answers cancel them. Home shows **one** card — e.g. «🧠 مراجعة النهارده: رفع الركبة
  في آب تشاجي» — that opens that exact lesson step or game; the hero page lists the top 3. The daily challenge stays the same
  for everyone so the league ranking stays fair.

## What changed in v27.1 — fixes from play-testing

- **Menu** opened and closed again in the same tap (the icon was re-created, so the "tap outside closes it"
  check thought the tap was outside). Now it opens with one tap every time.
- **Duel (1×1)**: keys use the physical key, so **A / L work with an Arabic keyboard** (ش / م) — before, nothing
  happened and every exchange ended "Nobody kicked!". Shift/Enter also work. The two buttons glow and say
  "legal target? kick!" while the board is up; the hint pop-up no longer covers a running match.
- **Hints never swallow a tap** any more; the first tap both closes the hint and plays.
- **Speed**: games, duels and the lesson animation stopped only when replaced — every visited game kept a hidden
  60 fps loop. They now stop as soon as you leave the screen (test included).
- **Warm-up**: the rendered 3-D demo videos were removed; every exercise uses its animated drawing (−3.8 MB).
- **Coach PIN**: the screen explains there is no ready-made PIN (you choose any 4 numbers, then type them again),
  and "Forgot the PIN?" resets it after a grown-up question.

## What changed in v27 — one boy, one girl, real skeletal animation

- **One consistent cast**: the brown-haired boy and the ponytail girl are now the characters everywhere
  (kick phases, Error Hunt, avatars, win frames). Older art is kept in `_originals/` folders (not cached offline).
- **Skeletal animation built from the existing art** (`tools/rig/`): each character is cut into head, body,
  thigh/shin/foot ×2 (+ ponytail with spring physics); hidden areas are painted in so joints never gap.
  Moves are written as coach-style key poses with two-bone IK for planted feet (`tools/rig/animate.py`):
  idle, front kick, axe kick, front rising kick, push kick, hit, win, walk, 5 Error-Hunt poses.
- **Runtime** `js/anim/skeleton.js` reads Spine JSON (3.8/4.x) + .atlas: a professional Spine export can
  replace `assets/anim/*` without code changes. Cross-fades, segment playback, events, spring bones.
- **In the game**: lessons show the character moving into each phase (slow motion + onion skin, "Whole kick",
  "Slow"); the six arena games and 1×1 duels use `RigFighter` for the front and axe kicks; the sparring partner is
  a `RigOpponent`. The side kick keeps its pictures until new art exists. `localStorage.taekwondoJourneyAnim = 'frames'`
  switches back to the old pictures.
- Picture frames and Error Hunt pictures (with tap zones measured from the body parts) are **baked from the rig**
  (`tools/rig/bake.mjs`, `bake-errorhunt.mjs`), so every screen matches.
- 4 new tests (atlas/curves, rigs + foot planting, lessons/arena/sparring use the skeleton, Error Hunt zones).
- `ART_BRIEF.md`: what still needs an artist (side kick, turning kicks, arms, coach, expressions) and the exact list.

## What changed in v26 — store-ready, split code + tests, full curriculum

**Store-ready**
- No internet needed at all, even on the first launch: Font Awesome and Google Fonts are gone;
  the app now has its own 47-icon SVG set (`assets/icons/icons.css`, same `fas fa-*` classes) and uses
  the phone's Arabic/Latin system fonts.
- Manifest: app id, separate maskable icons, 1024 icon, screenshots, categories, and three
  app-icon shortcuts (Train / Today's challenge / Syllabus → `?go=`).
- `privacy.html` (Arabic + English, kid-safe: no data leaves the device; camera only for QR).
- Capacitor config + `npm run build` (→ `www/`) for Android and iOS; Bubblewrap/TWA option for Play only.
- Store listing text (AR/EN), feature graphics, 48 screenshots (Play phone/tablet, iPhone 6.9", iPad 13"),
  and `STORE_GUIDE.md` with the Families-policy / Data-safety / App-privacy answers.
- Small phones: the header title no longer breaks into a vertical column.

**Code split + automated tests**
- `game.js` (one 10 000-line file) is split into modules under `js/` — byte-for-byte the same code, verified.
- `tests/run.mjs`: 25 tests — unit (week keys, challenge, league points, QR, player cards, achievements,
  progress rebuild) and flows (first visit, per-player saves, every screen × 3 sizes × 2 languages with no
  errors or sideways scroll, challenge, league rollover, difficulty, duel + tournament, coach, hero page,
  warm-up, curriculum, shortcuts) plus file checks (offline cache, no network URLs, icons, manifest).
- GitHub Actions runs them on every push.

**Full curriculum (waiting for pictures/videos)**
- New "📚 Belt Syllabus" screen (menu + home): white → black belt, 50 techniques in 7 groups
  (basics, stances, blocks, strikes, kicks, poomsae, sparring), Taegeuk 1–8 + Koryo, 13 kicks.
  Every item: romanized Korean, Hangul, English, Egyptian Arabic, key points, common mistakes, "say it".
- The 3 existing kicks are marked playable and open their training path; the rest show a
  "picture coming soon" slot and appear automatically when the file is added.
- Each player can tick "I practised this at the dojo" → a per-belt checklist and progress bar.
- `CONTENT_GUIDE.md` + `tools/check-curriculum.py` + `store/media-checklist.csv`: the 211 files still needed.
- ⚠️ The syllabus follows a common Kukkiwon club template — the head coach should confirm it.

## What changed in v25 — medal thresholds calibrated

Calibrated for a typical gym kid (about 3 training days a week, each with a warm-up, ~5 games and the daily
challenge; about 45% of games passed and 5% perfect), and checked with a 20-week simulation. Targets: bronze in
1–2 weeks, silver in about 2 months, gold in about a season (4–5 months). Skill medals (strongest kick, fastest
reaction, kicks mastered, league) depend on skill, not time.

| Medal | Bronze / Silver / Gold |
|---|---|
| 🔥 Warm-ups | 5 / 25 / 60 |
| 📅 Training days | 4 / 20 / 50 |
| ⚡ **Weeks in a row** with 2+ training days (was *days* in a row, which gym kids training on alternate days could never earn) | 2 / 6 / 12 |
| 🎮 Games played | 20 / 100 / 300 |
| ✅ Passes (85%+) | 5 / 40 / 120 |
| 💯 Perfect 100% | 1 / 5 / 15 |
| 🧭 Different games (**gold was 15, but there are only 13 games**) | 4 / 8 / 13 |
| 🏆 Daily challenges | 3 / 15 / 40 |
| 🥇 Days ranked #1 | 1 / 4 / 10 |
| ⚔️ Duels won | 1 / 8 / 25 |
| 👑 Tournaments | 1 / 2 / 4 |
| 🎖️ Weekly awards | 1 / 3 / 6 |
| 💥 Strongest kick (N) | 450 / 650 / 850 |
| ⚡ Fastest average reaction (s) | 1.1 / 0.85 / 0.65 |

Coach mode → Settings → **Medal difficulty** (easier ×0.7 / normal / harder ×1.4) rescales the training medals
for your group without code changes. The hero card and the all-players page now show the weekly streak.

## What changed in v24

**🏅 Hero page for every player** (menu → My Hero Page, the "My page" button on Home, or tap any player in the
league / all-players list):
- **Hero card:** character, name, level (goes up every 3 medals), league, belt, and 4 tiles (streak, week points,
  gold medals, trophies). "Save my card" makes a PNG to send to family.
- **This week vs last week:** points, games, average and warm-up days, each with ▲▼, plus an encouraging line.
  Players are compared with themselves, not with others.
- **Kick mastery rings** for all three kicks.
- **16 tiered achievements** (bronze → silver → gold, with a progress bar and "next medal at …"): warm-ups,
  training days, streak, games, passes, 100% scores, kicks mastered, games tried, daily challenges, days ranked
  #1, duels won, tournaments, weekly awards, league reached, strongest kick, fastest reaction. The classic
  15 trophies show next to them.
- **Personal records:** fastest reaction, strongest kick, most points in a fight, longest rhythm streak, best
  paddle combo, best balance with no falls, best challenge score, longest streak, best week, each with its date.
- **Training calendar:** a month view, darker on busier days, 🔥 on warm-up days, with a count of days trained.
- **My journey:** a timeline of first warm-up, new kicks started, tests passed, first 100%, awards, first #1 day,
  first duel won.
- A pop-up the moment you set a **new record** or reach a **new achievement** medal.

**👥 All players:** gym records (highest level, fastest reaction, strongest kick, most points, longest streak,
best challenge) with who holds each one, plus every player as a card (level, league, belt, streak, week points,
medals, trophies), sortable by week points / level / streak / warm-ups / recent. Tap a card to open that
player's page, and "Challenge" them from it.

## What changed in v23

**Each player has their own progress.** Before, everyone on one tablet shared the same unlocks. Now every player has
their own save (`taekwondoJourney:p:<id>`). On an upgraded device each existing player's progress is rebuilt from
their own attempt history. Backups now include every player.

**Easier to use**
- One start screen, "who's training today?": tap your card, or add a new player (name + boy/girl) in one step.
  The language follows the device the first time.
- Home starts with one big **«يلا نتمرن!»** button that goes straight to the next step, plus cards for today's
  challenge, the league and "challenge a friend". The tall banner is now a slim top bar.
- First time in any game: an animated hand shows where to tap, with one short sentence, read aloud.
  🔊 reads any instructions aloud; 💡 shows the hint again.
- Arena games have **Easy / Normal / Hard**; after two misses in a row the game steps down one level by itself.

**Competition (all offline, on the device)**
- 🏆 **Daily challenge:** the same game + kick for everyone each day, always on Normal; the best of the first
  3 tries counts (the coach can change the number). There's a ranking for today.
- 🏅 **Weekly league** (week = Saturday–Friday): Bronze → Silver → Gold → Diamond → Champions. Points = best
  challenge score each day + 20 per warm-up day + 10 per training day, so practising well and regularly wins,
  not grinding. The top 3 with 150+ points go up a league. Nobody goes down.
- 🎖️ **Weekly awards:** Champion of the Week, Most Improved and Warm-up King, plus a celebration the next time
  the winner opens the app and a printable PNG certificate.
- ⚔️ **Challenge a friend:** two players on one screen, each with their own big button (or A / L keys).
  The first to kick a legal target scores (+2 body, +3 head). Kicking a trap or kicking early gives the other
  player +1. First to 10, golden point on a tie. Win/loss table.
- 👑 **Knockout tournament** for 3–8 players, with byes, a bracket, a champion badge and a certificate.
- 👩‍🏫 **Coach mode** (4-digit PIN): a "needs help" list (low scores, repeated misses, a week without
  training), per-player actions (play as, move to a kick, give back today's tries, QR card, delete),
  league settings, backup.
- 📇 **Player QR cards + gym leaderboard:** each player has a QR card (or a copyable code). The coach scans it
  with the camera (where the browser supports it), from a picture, or by pasting the code, to rank players from
  different devices together. There's no server, so cards are a snapshot and players re-share them to update.

## What changed in v22

- **Egyptian Arabic:** all of the game's Arabic text (about 1,100 strings: lessons, tips, quizzes, games,
  warm-up, dashboard, certificates, messages) is rewritten in Egyptian colloquial Arabic (عامية مصرية) for kids.
  Kick names and Taekwondo terms are unchanged.
- Spoken Arabic uses an Egyptian voice (`ar-EG`) when the device has one, otherwise any Arabic voice.
- Switching language now also redraws the Home badges (streak, "continue training", belt), which used to stay in
  the previous language.

## What changed in v21

**Files & paths**
- The project folder had the *original* `game.js`, `index.html`, `style.css`, videos and old image names copied
  back over the v20 work (so exercises 2 and 3 were duplicates again and the `(Strike Moment) boy (2).webp`-style
  names were back). v21 is rebuilt from the v20 commit plus the newer `dashboard.js` / `games-arena.js`.
- `sw.js` had never actually been regenerated: it precached 14 files that don't exist (incl. `warmup3d.js`) and
  missed `games-arena.js` / `dashboard.js`, so offline installs were incomplete. It is now generated by
  `tools/update-sw.py`, which also refuses to run if any code path points at a missing file.
- Removed editor leftovers (`.claude/`, `.vscode/`) and added a `.gitignore`.

**Warm-up (exercises 2 and 3)**
- Exercise 2 (Torso Twists) now has its own video, `warmup/torso_twist.mp4` — a 12-second seamless loop of an
  athlete in a white dobok and black belt on the same grey studio set as the other clips (rendered, not filmed).
  Exercise 3 keeps the forward-lunge clip. Every exercise now has a different clip.
- Step chips are clickable (jump to any exercise; keyboard accessible); ← / → go back / forward; a revisited
  clip starts from the beginning.

**Player dashboard** — now actually reachable (menu, Home, Report): every player, kick mastery rings per player
(learning / main games / test from their own attempt log), insights, score trend, best-score heat map, practice
mix, recent activity, all-player table, CSV export for one player or everyone.

**Three new games — every kick** (bonus; the 4 main games still unlock the test)
- 🥊 **Sparring Duel** — the other character is your opponent, with a WT-style scoreboard. Kick only when a legal
  target for *this* kick opens (+2 body, +3 head); hold on traps (leg = foul, covered target, wrong target).
  Miss an opening and the opponent counter-kicks.
- ⚖️ **Balance Hold** — hold chamber → strike → recoil on one leg while gusts push you; ◀ ▶ / arrow keys / tap
  left-right to stay in the green zone.
- 🥋 **Heavy Bag** — a bag with real pendulum physics, pushed by Coach Yang; kick so the foot meets the bag as it
  swings back (too early = air, too late = jammed); power in newtons.
- New trophies: Ring Champion, Iron Balance, Power Kicker.

**Art**
- The boy's side-kick strike picture (`boy_char/bikchagi/extension_boy.webp`) had a photo of a dojo baked in; the
  character was cut out onto a transparent background.

## What changed in v20

**Files & paths**
- File names with spaces and brackets (`Kick Extension (Strike Moment) boy (2).webp` …) were renamed to the
  `apchagi/ready_boy.webp` pattern the other kicks already used; every reference was updated.
- `narochagi_live_assets/` (wrong name — the code asked for `narochagi_live/` — and each copy held both
  characters' files) was merged into `narochagi/`.
- The page loaded `warmup3d.js`, which didn't exist; the dead 3D hook and the Three.js import map were removed.
- The service-worker asset lists were regenerated to match what is really on disk.

**Art clean-up** (no new art, only fixes to existing pictures)
- Removed the black / white / photo-floor backgrounds baked into the girl's front-kick, axe-kick and side-kick
  pictures, the red arrows on the axe-kick pictures and the ✦ watermarks.
- The boy's axe-kick "drop" frame was identical to "rise" (and the girl's "recoil" identical to "drop");
  proper drop / recoil frames were made from the rise pose so the kick actually moves.
- The girl's side-kick pictures were mirrored so every fighter kicks to the right.
- Oversized images were scaled to 1400 px high (≈25 % smaller download).

**Warm-up**
- Exercises 2 and 3 showed the same video: `torso_twist.mp4` was a byte-for-byte copy of
  `forward_lunge.mp4`. The copy was deleted; the torso twist has its own animated demo.
- The "‹" back-button from a phone screen recording, burnt into every warm-up clip, and the ✦ watermark on the
  lesson videos were removed; clips were re-encoded (16 MB → 7 MB).
- Names and descriptions now match what each clip shows; timers are 15 s (moving) / 20 s (stretches);
  "switch legs" cue half-way through the single-leg stretch; 3-2-1 beeps; spoken exercise names.
- New layout: big video, step chips, rest screen that previews the next exercise (the clip pre-loads
  behind it), "⭐ key for this kick" badges, pause/skip/exit, keyboard shortcuts (Space, →, Esc).
- A warm-up counts for every kick for 3 hours, so switching kicks doesn't force a repeat.

**New games — available for every kick** (bonus games; the 4 main games still unlock the test)
- 🪵 **Board Break** — choose the striking surface, aim, time the power; boards split with splinters,
  slow-motion and camera shake. The board is placed where that kick really lands.
- 🎯 **Target Paddles** — hit only the paddle at a real target for the kick (face/abdomen, head from
  above, ribs/knee), measured in reaction time with combos.
- 🥁 **Kick Rhythm** — the 5 phases fall as notes on the beat; each hit poses your fighter, a full combo
  lands the kick.

**Player dashboard** (menu → Player Dashboard, also from Home and the Report screen)
- Every player on the device, filters by kick and period, KPI tiles, insights (strongest / weakest game,
  trend, warm-up habit, reaction time, next step), score-over-time chart, best-score heat map,
  practice mix, recent activity and an all-player comparison table. CSV export.

## Remaining art that needs regenerating
Some pictures can only be fixed by generating new art (see `IMAGE_AUDIT.md`):
the boy's side-kick "extension" is now transparent but is still drawn as a slightly different character; the girl's
side-kick set is drawn in a darker style than the rest; the boy's front-kick set mixes two outfits.
