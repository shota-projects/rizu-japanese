# にほんご for リズちゃん

Speaking practice for Rizu-chan (Eliz): warm family Japanese, then restaurants, trains, and shops. Static site, no backend. Progress stays on the device.

The lesson text and MP3s in `data/` and `audio/` are the approved course (Nanami for her lines, Keita for Dad). The app around them is a small Vite + TypeScript project.

## Pages

GitHub Pages serves the **repository root** from `main` (`https://shota-projects.github.io/rizu-japanese/`). `npm run build` writes the shell (`index.html`, `assets/`, `sw.js`, `manifest.webmanifest`) back to the root so that existing Pages setting keeps working. Pull requests do not change the live site.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173/
npm test
npm run build    # refresh the files Pages serves
```

Open the built site with any static server from the repo root (`npx serve .`). Don’t open `index.html` as a file — lesson JSON and audio need HTTP.

## Progress

Saved under `rizu-jp-v2`. The first launch copies `eliz-jp-v1` if it is still on the device. Each phrase, unit, day, and setting has an `updatedAt`. `mergeProgress` in `web/src/progress/merge.ts` is the hook for a later sync layer; nothing here talks to a server.

Backup codes still start with `EJP1.` and can be copied or shared. Codes from the previous app import too.

## Lessons

Edit `tools/content/*.py`, then `python3 tools/build_content.py`. New kanji need `sh tools/build_fonts.sh`. Audio is regenerated with `tools/gen_audio.py`. Bump a build (`npm run build`) so the service worker picks up a new cache id. Returning visitors see an **Update available** banner; the new version loads when they tap it.
