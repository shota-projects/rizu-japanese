import { stopSpeak, speak } from '../audio/player'
import { canListen, listen } from '../speech/recognize'
import { micPassed, scoreUtterance } from '../speech/score'
import { ICON } from '../ui/icons'
import { celebrate, toast } from '../ui/shell'
import { esc } from '../ui/text'

export function scoreFace(score: number): { cls: string; label: string } {
  if (score >= 80) return { cls: 'great', label: 'すごい！ Great' }
  if (micPassed(score)) return { cls: 'close', label: 'Close, nice' }
  return { cls: 'again', label: 'Let’s try again' }
}

export function scoreHTML(score: number, heard: string): string {
  const face = scoreFace(score)
  return `<div class="score ${face.cls}"><span class="score-num">${score}%</span><span>${face.label}</span></div><p class="heard">Heard: <span class="jp">${esc(heard)}</span></p>`
}

export function bindSpeakCheck(container: HTMLElement, targets: string[], onResult?: (ok: boolean) => void): void {
  if (canListen()) {
    container.innerHTML = `<button type="button" class="mic" data-mic>${ICON.mic}<span>Tap and say it</span></button><div class="result" data-result></div>`
    const btn = container.querySelector('[data-mic]') as HTMLButtonElement
    const out = container.querySelector('[data-result]') as HTMLElement
    btn.addEventListener('click', async () => {
      btn.classList.add('listening')
      const label = btn.querySelector('span')
      if (label) label.textContent = 'Listening…'
      try {
        stopSpeak()
        const alts = await listen()
        if (!alts.length) {
          out.innerHTML = '<p class="muted">I didn’t catch that. Try again a little closer to the mic.</p>'
          return
        }
        const result = scoreUtterance(alts, targets)
        out.innerHTML = scoreHTML(result.score, result.heard)
        if (result.score >= 80) celebrate(out.querySelector('.score'))
        onResult?.(micPassed(result.score))
      } catch (err) {
        const message = err instanceof Error ? err.message : ''
        const blocked = /not-allowed|service-not-allowed/.test(message)
        out.innerHTML = `<p class="muted">${blocked ? 'Microphone access is blocked. You can rate yourself instead.' : 'Speech check isn’t working right now. Rate yourself instead.'}</p>`
        mountSelfRate(container, onResult, true)
      } finally {
        btn.classList.remove('listening')
        if (label) label.textContent = 'Tap and say it'
      }
    })
  } else {
    mountSelfRate(container, onResult, false)
  }
}

export function mountSelfRate(container: HTMLElement, onResult?: (ok: boolean) => void, append = false): void {
  const html = `<p class="muted small">Say it out loud, then be honest:</p>
    <div class="rate-row"><button type="button" class="btn ghost" data-rate="0">Again</button><button type="button" class="btn soft" data-rate="1">Got it</button></div>`
  if (append) container.insertAdjacentHTML('beforeend', html)
  else container.innerHTML = html
  container.querySelectorAll<HTMLButtonElement>('[data-rate]').forEach((b) => {
    b.addEventListener('click', () => {
      container.querySelectorAll('[data-rate]').forEach((x) => x.classList.remove('chosen'))
      b.classList.add('chosen')
      if (b.dataset.rate === '1') b.classList.add('bounce')
      onResult?.(b.dataset.rate === '1')
    })
  })
}

/** Warm-up: hide the answer until a mic attempt or Show answer. Next stays disabled until she rates. */
export function bindWarmPractice(
  practice: HTMLElement,
  targets: string[],
  reveal: () => void,
  onRated: (ok: boolean) => void,
): void {
  let revealed = false
  let micScore: number | null = null
  const showAnswer = () => {
    if (revealed) return
    revealed = true
    reveal()
    practice.querySelector('[data-show-answer]')?.remove()
    practice.querySelector('.warm-memory-hint')?.remove()
    ensureRate()
  }
  const ensureRate = () => {
    if (practice.querySelector('.rate-row')) return
    const forcedMiss = micScore !== null && !micPassed(micScore)
    practice.insertAdjacentHTML(
      'beforeend',
      `<p class="muted small warm-rate-hint">${
        forcedMiss ? 'Under 55% counts as a miss. Tap Again to continue.' : 'Be honest — how did you do?'
      }</p>
      <div class="rate-row">
        <button type="button" class="btn ghost" data-rate="0">Again</button>
        <button type="button" class="btn soft" data-rate="1" ${forcedMiss ? 'disabled' : ''}>Got it</button>
      </div>`,
    )
    practice.querySelectorAll<HTMLButtonElement>('[data-rate]').forEach((b) => {
      b.addEventListener('click', () => {
        if (b.disabled) return
        practice.querySelectorAll('[data-rate]').forEach((x) => x.classList.remove('chosen'))
        b.classList.add('chosen')
        const wantPass = b.dataset.rate === '1'
        const pass = forcedMiss ? false : wantPass
        if (wantPass) b.classList.add('bounce')
        onRated(pass)
      })
    })
  }

  if (canListen()) {
    practice.innerHTML = `<button type="button" class="mic" data-mic>${ICON.mic}<span>Tap and say it</span></button>
      <button type="button" class="btn ghost wide" data-show-answer>Show answer</button>
      <div class="result" data-result></div>`
    const btn = practice.querySelector('[data-mic]') as HTMLButtonElement
    const out = practice.querySelector('[data-result]') as HTMLElement
    practice.querySelector('[data-show-answer]')?.addEventListener('click', () => showAnswer())
    btn.addEventListener('click', async () => {
      btn.classList.add('listening')
      const label = btn.querySelector('span')
      if (label) label.textContent = 'Listening…'
      try {
        stopSpeak()
        const alts = await listen()
        if (!alts.length) {
          out.innerHTML = '<p class="muted">I didn’t catch that. Try again a little closer to the mic.</p>'
          return
        }
        const result = scoreUtterance(alts, targets.filter(Boolean))
        micScore = result.score
        out.innerHTML = scoreHTML(result.score, result.heard)
        if (result.score >= 80) celebrate(out.querySelector('.score'))
        showAnswer()
      } catch (err) {
        const message = err instanceof Error ? err.message : ''
        const blocked = /not-allowed|service-not-allowed/.test(message)
        out.innerHTML = `<p class="muted">${blocked ? 'Microphone access is blocked. Show the answer and rate yourself.' : 'Speech check isn’t working right now. Show the answer and rate yourself.'}</p>`
        if (!practice.querySelector('[data-show-answer]')) {
          practice.insertAdjacentHTML('afterbegin', `<button type="button" class="btn ghost wide" data-show-answer>Show answer</button>`)
          practice.querySelector('[data-show-answer]')?.addEventListener('click', () => showAnswer())
        }
      } finally {
        btn.classList.remove('listening')
        if (label) label.textContent = 'Tap and say it'
      }
    })
  } else {
    practice.innerHTML = `<p class="muted small warm-memory-hint">Say it out loud from memory, then check:</p>
      <button type="button" class="btn soft wide" data-show-answer>Show answer</button>`
    practice.querySelector('[data-show-answer]')?.addEventListener('click', () => showAnswer())
  }
}

export function playLine(text: string | undefined, opts: { slow?: boolean; fast?: boolean } = {}): void {
  if (!text) return
  speak(text, opts).then((ok) => {
    if (!ok) toast('Turn up volume / check silent mode')
  })
}
