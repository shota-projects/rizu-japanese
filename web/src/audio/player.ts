import type { AudioManifest } from './manifest'

const SILENT =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='

let manifest: AudioManifest | null = null
let unlocked = false

const player = new Audio()
player.preload = 'auto'
player.setAttribute('playsinline', '')
player.setAttribute('webkit-playsinline', '')

const unlockPlayer = new Audio()

export function audioSrc(text: string): string | null {
  const entry = manifest?.byText[text]
  return entry?.src ?? null
}

export function playerSrc(): string {
  return player.currentSrc || player.src || ''
}

export function unlock(): void {
  if (unlocked) return
  unlocked = true
  try {
    unlockPlayer.muted = true
    unlockPlayer.src = SILENT
    const p = unlockPlayer.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  } catch {
    /* ignore */
  }
}

function onFirstGesture() {
  unlock()
  document.removeEventListener('pointerdown', onFirstGesture, true)
  document.removeEventListener('touchstart', onFirstGesture, true)
}

document.addEventListener('pointerdown', onFirstGesture, true)
document.addEventListener('touchstart', onFirstGesture, true)

/**
 * Play a pre-generated MP3. play() is called synchronously so iPhone Safari and Chrome
 * keep the user-gesture. There is no speechSynthesis fallback.
 */
export function speak(text: string, opts: { slow?: boolean; fast?: boolean } = {}): Promise<boolean> {
  if (!text) return Promise.resolve(false)
  const src = audioSrc(text)
  if (!src) return Promise.resolve(false)
  return new Promise((resolve) => {
    let settled = false
    const done = (ok: boolean) => {
      if (settled) return
      settled = true
      resolve(ok)
    }
    try {
      unlock()
      player.onended = () => done(true)
      player.onerror = () => done(false)
      player.pause()
      try {
        player.currentTime = 0
      } catch {
        /* ignore */
      }
      player.volume = 1
      player.muted = false
      player.playbackRate = opts.slow ? 0.75 : opts.fast ? 1.15 : 1
      player.src = new URL(src, document.baseURI).href
      const pending = player.play()
      if (pending && typeof pending.catch === 'function') pending.catch(() => done(false))
      window.setTimeout(() => done(false), 20000)
    } catch {
      done(false)
    }
  })
}

export function stopSpeak(): void {
  try {
    player.pause()
  } catch {
    /* ignore */
  }
}

export async function loadManifest(): Promise<void> {
  try {
    const res = await fetch(new URL('data/audio-manifest.json', document.baseURI))
    if (res.ok) manifest = (await res.json()) as AudioManifest
  } catch {
    manifest = null
  }
}
