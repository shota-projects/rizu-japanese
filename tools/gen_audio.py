#!/usr/bin/env python3
"""Generate Japanese phrase audio with edge-tts (Nanami/Keita)."""
import asyncio, json, hashlib, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'audio'
MANIFEST = ROOT / 'data' / 'audio-manifest.json'
PHRASES = ROOT / 'tools' / 'audio_phrases.json'
VOICE = {'female': 'ja-JP-NanamiNeural', 'male': 'ja-JP-KeitaNeural'}
CONCURRENCY = 6

async def one(sem, edge_tts, item, results):
    text, gender, h = item['text'], item['gender'], item['hash']
    voice = VOICE[gender]
    rel = f'audio/{gender[0]}/{h}.mp3'
    dest = ROOT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix('.raw.mp3')
    async with sem:
        if dest.exists() and dest.stat().st_size > 500:
            results.append({'text': text, 'src': './' + rel, 'voice': voice, 'gender': gender, 'hash': h, 'bytes': dest.stat().st_size})
            return
        try:
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(tmp))
            # normalize to mono 48k mp3
            subprocess.check_call([
                'ffmpeg', '-y', '-i', str(tmp), '-ac', '1', '-ar', '24000', '-b:a', '48k',
                '-loglevel', 'error', str(dest)
            ])
            tmp.unlink(missing_ok=True)
            results.append({'text': text, 'src': './' + rel, 'voice': voice, 'gender': gender, 'hash': h, 'bytes': dest.stat().st_size})
            print('ok', h, gender[0], text[:24])
        except Exception as e:
            print('FAIL', text[:40], e)
            tmp.unlink(missing_ok=True)

async def main():
    import edge_tts
    items = json.loads(PHRASES.read_text())
    sem = asyncio.Semaphore(CONCURRENCY)
    results = []
    await asyncio.gather(*[one(sem, edge_tts, it, results) for it in items])
    by_text = {r['text']: {'src': r['src'], 'voice': r['voice'], 'gender': r['gender'], 'hash': r['hash']} for r in results}
    man = {
        'version': 1,
        'voices': VOICE,
        'count': len(by_text),
        'byText': by_text,
    }
    MANIFEST.write_text(json.dumps(man, ensure_ascii=False, indent=2))
    total = sum(r['bytes'] for r in results)
    print(f'DONE {len(results)} files, {total/1024:.1f} KB total')

if __name__ == '__main__':
    asyncio.run(main())
