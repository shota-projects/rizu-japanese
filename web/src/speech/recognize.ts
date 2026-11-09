type RecInstance = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((ev: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  abort: () => void
  stop: () => void
}

type RecCtor = new () => RecInstance

function ctor(): RecCtor | null {
  const w = window as Window & { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export function canListen(): boolean {
  return !!ctor()
}

let active: RecInstance | null = null

export function listen(): Promise<string[]> {
  const Rec = ctor()
  if (!Rec) return Promise.reject(new Error('unsupported'))
  if (active) {
    try {
      active.abort()
    } catch {
      /* ignore */
    }
  }
  return new Promise((resolve, reject) => {
    const r = new Rec()
    active = r
    r.lang = 'ja-JP'
    r.interimResults = false
    r.maxAlternatives = 5
    let done = false
    r.onresult = (ev) => {
      done = true
      const alts: string[] = []
      for (let i = 0; i < ev.results.length; i++) {
        const res = ev.results[i]
        for (let j = 0; j < res.length; j++) alts.push(res[j].transcript)
      }
      resolve(alts)
    }
    r.onerror = (ev) => {
      if (!done) {
        done = true
        reject(new Error(ev.error || 'error'))
      }
    }
    r.onend = () => {
      active = null
      if (!done) {
        done = true
        resolve([])
      }
    }
    try {
      r.start()
    } catch (err) {
      reject(err instanceof Error ? err : new Error('error'))
    }
  })
}

export function stopListen(): void {
  if (!active) return
  try {
    active.stop()
  } catch {
    /* ignore */
  }
}
