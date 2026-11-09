#!/usr/bin/env python3
"""Generate MP3s only for Japanese lines that are not already in the audio manifest.

Uses the same edge-tts voices, rate, pitch, soften(), and ffmpeg chain as tools/gen_audio.py.
Existing files and manifest entries are left untouched.
"""
import asyncio
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gen_audio import FFMPEG_AF, RATE, PITCH, VOICE, file_hash, soften  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'data' / 'audio-manifest.json'
PHRASES = ROOT / 'tools' / 'audio_phrases.json'
SPEAK = ROOT / 'data' / 'speak.json'


def gender_for(name: str | None) -> str:
    return 'male' if name == 'Dad' else 'female'


def collect(data: dict) -> dict[str, str]:
    """Map display text -> gender. First assignment wins so Dad's voice is kept."""
    found: dict[str, str] = {}

    def add(text: str | None, gender: str):
        if text and text not in found:
            found[text] = gender

    for unit in data['units']:
        for phrase in unit['phrases']:
            add(phrase['jp'], gender_for(phrase.get('speaker')))
        for line in unit['roleplay']['lines']:
            if line['speaker'] == 'them':
                add(line['jp'], gender_for(line.get('name')))
            else:
                for opt in line['options']:
                    add(opt['jp'], 'female')
        for item in unit['listening']:
            add(item['jp'], gender_for(item.get('speaker')))
            for opt in item['reply']['options']:
                add(opt['jp'], 'female')
    return found


async def synth(edge_tts, text: str, gender: str) -> dict:
    spoken = soften(text)
    h = file_hash(text)
    voice = VOICE[gender]
    rel = f'audio/{gender[0]}/{h}.mp3'
    dest = ROOT / rel
    if dest.exists() and dest.stat().st_size > 500:
        raise SystemExit(f'refusing to overwrite existing audio: {rel}')
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix('.raw.mp3')
    communicate = edge_tts.Communicate(spoken, voice, rate=RATE, pitch=PITCH)
    await communicate.save(str(tmp))
    subprocess.check_call([
        'ffmpeg', '-y', '-i', str(tmp),
        '-af', FFMPEG_AF,
        '-ac', '1', '-ar', '24000', '-b:a', '64k',
        '-loglevel', 'error', str(dest),
    ])
    tmp.unlink(missing_ok=True)
    print('ok', h, gender[0], '=' if spoken == text else '~', text[:40])
    return {
        'text': text,
        'spoken': spoken,
        'src': './' + rel,
        'voice': voice,
        'gender': gender,
        'hash': h,
    }


async def main():
    import edge_tts
    manifest = json.loads(MANIFEST.read_text())
    by_text = manifest['byText']
    before = len(by_text)
    needed = collect(json.loads(SPEAK.read_text()))
    missing = [(text, gender) for text, gender in needed.items() if text not in by_text]
    if not missing:
        print('nothing new')
        return
    print(f'generating {len(missing)} new lines')
    sem = asyncio.Semaphore(4)

    async def guarded(text, gender):
        async with sem:
            return await synth(edge_tts, text, gender)

    made = await asyncio.gather(*[guarded(t, g) for t, g in missing])
    for row in made:
        by_text[row['text']] = {
            'src': row['src'],
            'voice': row['voice'],
            'gender': row['gender'],
            'hash': row['hash'],
            'spoken': row['spoken'],
        }
    if len(by_text) != before + len(made):
        raise SystemExit('manifest size mismatch')
    manifest['count'] = len(by_text)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    if PHRASES.exists():
        phrases = json.loads(PHRASES.read_text())
        have = {p['text'] for p in phrases}
        for row in made:
            if row['text'] not in have:
                phrases.append({
                    'text': row['text'],
                    'spoken': row['spoken'],
                    'gender': row['gender'],
                    'hash': row['hash'],
                })
        PHRASES.write_text(json.dumps(phrases, ensure_ascii=False, indent=2) + '\n')
    print(f'added {len(made)}; manifest count {manifest["count"]}')


if __name__ == '__main__':
    asyncio.run(main())
