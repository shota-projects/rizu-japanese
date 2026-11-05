# にほんご for Eliz

A small, speaking-first Japanese course for a complete beginner. Plain HTML/CSS/JS, no backend, progress saved in `localStorage` on the device. Installable as a PWA and works offline.

## Run it

```sh
cd eliz-japanese
python3 -m http.server 8765   # then open http://localhost:8765/
```

(Opening `index.html` straight from disk won't load the lessons; serve the folder.)

## What's in it

Home shows two **Speak** tracks plus **Review**:

- **Family** (かぞくとはなそう, first): meeting the family, family words, home phrases, the dinner table, small talk, gifts/thanks/sorry, phone & video calls. Defaults to polite です/ます, with notes on when family speech gets casual.
- **Getting around** (まちで): restaurants & cafés, directions & trains, shopping & prices, convenience store & checkout, asking for help.

Each unit has four steps: **phrases** (taught as whole chunks, with optional grammar notes), a **listening drill** (natural speed, no text; pick the meaning, try a reply, then the text is revealed), a **role-play**, and a **quick quiz**. Phrases go into a 5-box spaced-repetition **review** (same day, 1, 3, 7, 16 days).

Audio uses the browser's Japanese voice (`speechSynthesis`). Speaking practice uses speech recognition where the browser has it (Chrome, Safari) and falls back to self-rating.

**Settings** (gear on home): hiragana readings on/off, and romaji *show / fade / hide*. Fade hides romaji (tap to peek) on phrases in review box 3+ and in finished units.

## Editing lessons

- Lesson data: `data/speak.json` (`tracks` + `units`). You can edit it directly.
- Source of truth for regenerating it: `tools/content/f*.py` (Family) and `g*.py` (Getting around), one unit per file. Then run `python3 tools/build_content.py`, which validates and rewrites `data/speak.json`.
- After changing content, run `sh tools/build_fonts.sh` to refresh the self-hosted font subset (new kanji otherwise fall back to the system font), and bump `VERSION` in `sw.js` so installed copies update.

## Code layout

- `js/parts/*.js` → concatenated into `js/app.js` by `sh tools/build_app.sh` (edit the parts, not app.js).
- `css/parts/*.css` → `css/style.css` (`cat css/parts/*.css > css/style.css`).
- `js/store.js` progress + settings, `js/speech.js` audio and recognition.
- `img/` mascot poses, `icons/` PWA icons, `fonts/` M PLUS Rounded 1c subset (SIL Open Font License).

## Reading course (parked)

`data/read.json` and the read views (`js/parts/06-read.js`) are kept but unlinked. To bring them back, set `FEATURES.read = true` in `js/parts/01-core.js`, rebuild, and add a link on home.

## Tests

`tests/smoke.playwright.js` runs the main flows headless at 390×844, checks for zero console errors and offline mode, and writes screenshots to `screenshots/`.
