#!/bin/sh
# Re-download the self-hosted M PLUS Rounded 1c subset (only the characters the app uses),
# so the font works offline. Run after editing lesson content: sh tools/build_fonts.sh
set -e
cd "$(dirname "$0")/.."
T=$(python3 - <<'PY'
import glob, urllib.parse
s = set(chr(c) for c in range(32, 127)) | set('āīūēōĀĪŪĒŌ…’‘“”·—–×→←✓★♥')
for f in ['data/speak.json', 'data/read.json', 'index.html', 'manifest.json', 'js/store.js', 'js/speech.js'] + glob.glob('js/parts/*.js'):
    s |= set(open(f, encoding='utf-8').read())
print(urllib.parse.quote(''.join(sorted(c for c in s if ord(c) >= 32))))
PY
)
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
mkdir -p fonts
for w in 500 700 800; do
  u=$(curl -s -A "$UA" "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@$w&text=$T" | grep -o "https://fonts.gstatic.com[^)]*" | head -1)
  curl -s "$u" -o "fonts/mplus-rounded-$w.woff2"
  echo "fonts/mplus-rounded-$w.woff2 $(wc -c < fonts/mplus-rounded-$w.woff2) bytes"
done
