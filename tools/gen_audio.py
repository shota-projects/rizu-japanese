#!/usr/bin/env python3
"""Generate Japanese phrase audio — round2 style (Nanami/Keita, -10%, +0Hz, post)."""
import asyncio, json, hashlib, re, shutil, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'audio'
MANIFEST = ROOT / 'data' / 'audio-manifest.json'
PHRASES = ROOT / 'tools' / 'audio_phrases.json'
VOICE = {'female': 'ja-JP-NanamiNeural', 'male': 'ja-JP-KeitaNeural'}
RATE = '-10%'
PITCH = '+0Hz'
STYLE = 'r2'  # salted into hash so filenames never collide with old clips
CONCURRENCY = 6

# Display text -> spoken text (audio-only). Keep meaning; smoother prosody.
OVERRIDES = {
    'あら、リズちゃん！久しぶり！上がって上がって。': 'あら、リズちゃん。久しぶりね。さあ、上がって。',
    'お父さんは元気だよ。…あれ、しょうたは？また寝てるの？': 'お父さんは元気だよ。あれ、しょうたは、また寝てるの。',
    'あら、久しぶり！元気だった？': 'あら、久しぶり。元気だった？',
    'いらっしゃい！': 'いらっしゃい。',
    'はい、今行きます！': 'はい、今行きます。',
    'はい、とてもおいしいです！': 'はい、とてもおいしいです。',
    'ぜひ！一緒に作りたいです。': 'ぜひ、一緒に作りたいです。',
    'ただいま！': 'ただいま。',
    'おかえり！': 'おかえり。',
    'ご飯ですよ！': 'ご飯ですよ。',
    '助けてください！': '助けてください。',
    '本当にすみません！': '本当にすみません。',
    '元気ですよ。…あれ？聞こえる？': '元気ですよ。あれ？聞こえる？',
    'すごいですね！': 'すごいですね。',
    'お母さん、久しぶりです！また会えてうれしいです。お邪魔します。':
        'お母さん、久しぶりです。また会えてうれしいです。お邪魔します。',
    'はい、久しぶりです！元気です。': 'はい、久しぶりです。元気です。',
}


def soften(text: str) -> str:
    if text in OVERRIDES:
        return OVERRIDES[text]
    t = text.replace('…', '、').replace('...', '、')
    t = t.replace('！', '。').replace('!', '。')
    t = re.sub(r'。{2,}', '。', t)
    t = t.replace('。、', '、').replace('、。', '。')
    t = t.replace('？。', '？').replace('?。', '？')
    return t


def file_hash(display_text: str) -> str:
    return hashlib.sha1(f'{display_text}|{STYLE}'.encode('utf-8')).hexdigest()[:12]


FFMPEG_AF = (
    'silenceremove=start_periods=1:start_silence=0.04:start_threshold=-38dB:detection=peak,'
    'areverse,'
    'silenceremove=start_periods=1:start_silence=0.04:start_threshold=-38dB:detection=peak,'
    'areverse,'
    'apad=pad_dur=0.15,'
    'loudnorm=I=-16:TP=-1.5:LRA=11,'
    'treble=g=-2:f=5500,'
    'aecho=0.85:0.8:22:0.12'
)


async def one(sem, edge_tts, item, results):
    text = item['text']  # displayed text (manifest key)
    gender = item['gender']
    spoken = item.get('spoken') or soften(text)
    h = item['hash']
    voice = VOICE[gender]
    rel = f'audio/{gender[0]}/{h}.mp3'
    dest = ROOT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix('.raw.mp3')
    async with sem:
        try:
            communicate = edge_tts.Communicate(spoken, voice, rate=RATE, pitch=PITCH)
            await communicate.save(str(tmp))
            subprocess.check_call([
                'ffmpeg', '-y', '-i', str(tmp),
                '-af', FFMPEG_AF,
                '-ac', '1', '-ar', '24000', '-b:a', '64k',
                '-loglevel', 'error', str(dest),
            ])
            tmp.unlink(missing_ok=True)
            results.append({
                'text': text,
                'spoken': spoken,
                'src': './' + rel,
                'voice': voice,
                'gender': gender,
                'hash': h,
                'bytes': dest.stat().st_size,
            })
            mark = '~' if spoken != text else '='
            print('ok', h, gender[0], mark, text[:28])
        except Exception as e:
            print('FAIL', text[:40], e)
            tmp.unlink(missing_ok=True)


async def main():
    import edge_tts
    items = json.loads(PHRASES.read_text())
    sem = asyncio.Semaphore(CONCURRENCY)
    results = []
    await asyncio.gather(*[one(sem, edge_tts, it, results) for it in items])
    if len(results) != len(items):
        raise SystemExit(f'incomplete: {len(results)}/{len(items)}')
    by_text = {
        r['text']: {
            'src': r['src'],
            'voice': r['voice'],
            'gender': r['gender'],
            'hash': r['hash'],
            'spoken': r['spoken'],
        }
        for r in results
    }
    man = {
        'version': 2,
        'style': STYLE,
        'rate': RATE,
        'pitch': PITCH,
        'voices': VOICE,
        'count': len(by_text),
        'byText': by_text,
    }
    MANIFEST.write_text(json.dumps(man, ensure_ascii=False, indent=2))
    total = sum(r['bytes'] for r in results)
    print(f'DONE {len(results)} files, {total/1024:.1f} KB ({total/1024/1024:.2f} MB)')


if __name__ == '__main__':
    asyncio.run(main())
