# Publishing Taekwondo Journey on Google Play and the App Store

The game is already a complete offline web app (PWA). There are two ways to ship it
to the stores — pick one:

| | **A. Capacitor (recommended)** | **B. Bubblewrap / TWA** |
|---|---|---|
| Stores | Google Play **and** App Store | Google Play only |
| Needs a website? | No — all files are inside the app | Yes — the game must be hosted on HTTPS |
| Updates | New build to the store | Update the website; the app follows |
| Files here | `capacitor.config.json`, `tools/build-web.py` | `store/twa-manifest.json`, `store/assetlinks.json` |

---

## 0. Before either path (one-time)

1. **Change the app id** `com.example.taekwondojourney` in `capacitor.config.json`
   (and `store/twa-manifest.json`) to your own, e.g. `com.yourclub.taekwondo`.
   It can never change after the first upload.
2. **Support e-mail**: replace the placeholder in `privacy.html` (two places).
3. **Host `privacy.html`** anywhere public (GitHub Pages is free) — both stores ask for its URL.
4. Accounts: Google Play Console (one-time $25), Apple Developer Program ($99/year, needs a Mac with Xcode).
5. Run the checks: `npm install && npx playwright install chromium && npm test`.

## A. Capacitor — Android + iOS

```bash
npm install                                # installs Capacitor + Playwright
npm run build                              # copies the app into www/
npx cap add android                        # creates android/ (once)
npx cap add ios                            # creates ios/ (once, on a Mac)
npx cap sync                               # after every change: npm run build && npx cap sync
npx cap open android                       # Android Studio → Build → Generate Signed Bundle (.aab)
npx cap open ios                           # Xcode → Product → Archive → Distribute
```

- **Icons & splash**: `npm i -D @capacitor/assets && npx capacitor-assets generate --iconBackgroundColor '#ff6b35' --splashBackgroundColor '#0f0f1a'`
  after copying `assets/icons/icon-1024.png` to `resources/icon.png`.
- **Camera permission** (coach scans QR player cards):
  - Android `android/app/src/main/AndroidManifest.xml`: `<uses-permission android:name="android.permission.CAMERA" />`
  - iOS `ios/App/App/Info.plist`: `NSCameraUsageDescription` = "The coach can scan a player's QR card. Nothing is recorded." (add the Arabic in `ar.lproj/InfoPlist.strings`)
- The service worker is skipped automatically inside the app (files are already on the device).
- Orientation: the game works in both; keep both enabled.

## B. Bubblewrap / TWA — Android only

1. Host the whole folder on HTTPS (e.g. `https://YOUR-DOMAIN/taekwondo-journey/`).
2. Edit `store/twa-manifest.json` (replace `YOUR-DOMAIN`, package id).
3. `npx @bubblewrap/cli init --manifest https://YOUR-DOMAIN/taekwondo-journey/manifest.json` then `npx @bubblewrap/cli build`.
4. Put `store/assetlinks.json` at `https://YOUR-DOMAIN/.well-known/assetlinks.json` with the
   SHA-256 of the **Play app signing key** (Play Console → Setup → App signing). Without it the app shows a browser bar.

---

## Google Play — answers for the forms

**Target audience and content** (Families policy): ages **6–8, 9–12** (add 13–15 if you want). Because children
are in the audience the app must follow the [Families policy](https://support.google.com/googleplay/android-developer/answer/9893335) — it already does: no ads, no analytics SDKs, no accounts, no external links except the privacy page.

**Data safety**
- Does the app collect or share user data? → **No.** (Everything stays on the device; nothing is sent.)
- Is data encrypted in transit? → Not applicable (no data transmitted).
- Can users request deletion? → Data is deleted by uninstalling or with "Delete player".
- Camera: used on-device only to read QR codes, not collected → does not count as "collected".

**Content rating (IARC)**: Violence → *cartoon/fantasy violence: mild* (martial-arts kicks on pads/boards, no blood). No user interaction, no location, no purchases. Expected rating: **Everyone / PEGI 3–7**.

**Ads**: No. **In-app purchases**: No. **Government app**: No.

**Store listing**: texts in `store/listing.md`, graphics in `store/` and `assets/store/`
(`node tools/store-screenshots.mjs` and `node tools/feature-graphic.mjs` rebuild them).

## App Store — answers for the forms

- **Kids Category**: Ages 6–8 or 9–11 (optional; if chosen, Apple's kids rules apply — met: no ads, no tracking, no external purchase links; the privacy page link is behind the menu).
- **App Privacy** ("nutrition label"): **Data Not Collected**.
- **Age rating**: Infrequent/Mild Cartoon or Fantasy Violence → **4+**.
- Screenshots: `assets/store/iphone-*.jpg` (6.9") and `assets/store/ipad-*.jpg` (13").
- Review notes: "Fully offline educational taekwondo game for kids. No login. Coach mode demo PIN: create any 4-digit PIN on first use."

## Release checklist

- [ ] `npm test` passes (also runs in GitHub Actions on every push)
- [ ] `python3 tools/update-sw.py` bumped the cache version (web version)
- [ ] App id, support e-mail, hosted privacy URL
- [ ] Version: `package.json` `version` + Android `versionCode` / iOS build number
- [ ] Head coach confirmed the belt syllabus (`js/data/curriculum.js`)
- [ ] Screenshots regenerated after the last UI change
- [ ] Tested on one real low-end Android phone and one iPad
