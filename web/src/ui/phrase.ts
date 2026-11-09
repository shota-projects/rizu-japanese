import { progress } from '../session'
import type { Line } from '../content/course'
import { norm } from '../speech/score'
import { DECO, ICON } from './icons'
import { esc } from './text'

export function kanaFor(line: { jp?: string; kana?: string }): string {
  if (!progress.setting('showKana') || !line.kana || !line.jp) return ''
  return norm(line.kana) !== norm(line.jp) ? line.kana : ''
}

export function romajiHTML(text: string | undefined, cls: string, known: boolean): string {
  if (!text) return ''
  const mode = progress.setting('romaji')
  if (mode === 'hide') return ''
  if (mode === 'fade' && known) {
    return `<button type="button" class="romaji-peek ${cls}" data-reveal="${esc(text)}" data-cls="${cls}">tap for romaji</button>`
  }
  return `<span class="${cls}">${esc(text)}</span>`
}

export function optRomaji(line: { romaji?: string }, known: boolean): string {
  const mode = progress.setting('romaji')
  if (!line.romaji || mode === 'hide' || (mode === 'fade' && known)) return ''
  return `<span class="opt-romaji">${esc(line.romaji)}</span>`
}

export function phraseHTML(p: Line, opts: { big?: boolean; known?: boolean; showEn?: boolean } = {}): string {
  const big = opts.big !== false
  const showEn = opts.showEn !== false
  const kana = kanaFor(p)
  const len = [...(p.jp || '')].length
  const size = len > 18 ? 'xlong' : len > 12 ? 'long' : ''
  const who = p.speaker ? `<p class="phrase-who ${p.speaker === 'Dad' ? 'dad' : p.speaker === 'Mom' ? 'mom' : 'rizu'}">${esc(p.speaker)}</p>` : ''
  return `<div class="phrase ${big ? 'big' : ''} ${size}">
    ${who}
    <div class="jp phrase-jp" lang="ja">${esc(p.jp)}</div>
    ${kana ? `<div class="jp phrase-kana" lang="ja">${esc(kana)}</div>` : ''}
    <div class="phrase-romaji-wrap">${romajiHTML(p.romaji, 'phrase-romaji', !!opts.known)}</div>
    ${showEn ? `<div class="phrase-en">${esc(p.en)}</div>` : ''}
  </div>`
}

export function audioButtons(text: string, extra = ''): string {
  return `<div class="audio-row ${extra}">
    <button type="button" class="pill" data-say="${esc(text)}" aria-label="Play">${ICON.play}<span>Play</span></button>
    <button type="button" class="pill ghost" data-say="${esc(text)}" data-slow="1" aria-label="Play slowly">${ICON.slow}<span>Slow</span></button>
  </div>`
}

export function stepBar(current: 'warm' | 'new' | 'convo' | 'listen'): string {
  const d = progress.ensureDaily()
  const parts: { key: 'warmDone' | 'newDone' | 'convoDone' | 'listenDone'; id: typeof current; label: string }[] = [
    { key: 'warmDone', id: 'warm', label: 'Warm-up' },
    { key: 'newDone', id: 'new', label: 'New' },
    { key: 'convoDone', id: 'convo', label: 'Chat' },
    { key: 'listenDone', id: 'listen', label: 'Listen' },
  ]
  return `<div class="daily-steps" aria-label="Today’s lesson progress">
    ${parts
      .map((p, i) => {
        const done = d[p.key]
        const now = current === p.id
        return `<span class="ds ${done ? 'done' : ''} ${now ? 'now' : ''}">${done ? ICON.check : i + 1}<em>${p.label}</em></span>`
      })
      .join('')}
  </div>`
}

export function deco(kind: keyof typeof DECO): string {
  return DECO[kind]
}
