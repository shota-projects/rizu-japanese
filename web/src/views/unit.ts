import { phraseId, type ListenItem, type Unit } from '../content/course'
import { course, progress } from '../session'
import { speak } from '../audio/player'
import { canListen, listen } from '../speech/recognize'
import { scoreUtterance } from '../speech/score'
import { DECO, ICON, mascot } from '../ui/icons'
import { audioButtons, kanaFor, optRomaji, phraseHTML, romajiHTML } from '../ui/phrase'
import { celebrate, isCurrent, currentGeneration, setTopbar, show } from '../ui/shell'
import { esc, shuffle } from '../ui/text'
import { nextUnit, phraseKnown, unitStats } from './curriculum'
import { bindSpeakCheck, playLine } from './practice'

function trackTitle(u: Unit): string {
  return course.tracks.find((t) => t.id === u.track)?.title || 'Lesson'
}

function feedback(ok: boolean, title: string, body = ''): string {
  return `<div class="feedback ${ok ? 'good' : 'bad'}">
    ${mascot(ok ? 'cheer' : 'think', 'fb-mascot')}
    <div class="fb-body"><p class="fb-title"><strong>${title}</strong></p>${body}</div>
  </div>`
}

function unitCompleteBanner(u: Unit, wasDone: boolean): string {
  if (wasDone || !unitStats(u).done) return ''
  return `<div class="complete-banner">${DECO.star}<span>Unit complete: ${esc(u.title)}</span>${DECO.star}</div>`
}

export function viewUnit(u: Unit): void {
  setTopbar(esc(trackTitle(u)), '#/')
  const s = unitStats(u)
  const step = (n: number, ok: boolean, href: string, title: string, sub: string) =>
    `<a class="step" href="${href}"><span class="step-num ${ok ? 'ok' : ''}">${ok ? ICON.check : n}</span><div><div class="step-title">${title}</div><div class="step-sub">${sub}</div></div></a>`
  show(`
    <section class="unit-hero">
      <p class="eyebrow jp" lang="ja">${esc(u.jpTitle)}</p>
      <h1>${esc(u.title)}</h1>
      <p class="lede">${esc(u.summary)}</p>
      ${s.done ? `<p class="tag ok">${DECO.star} Unit complete</p>` : ''}
    </section>
    <div class="steps">
      ${step(1, s.seen === s.total, `#/unit/${u.id}/cards/0`, 'Phrases', `${s.seen} of ${s.total} learned · listen and say each one`)}
      ${step(2, s.listenDone, `#/unit/${u.id}/listen`, 'Listening drill', `${u.listening.length} lines at natural speed, no text`)}
      ${step(3, s.roleplayDone, `#/unit/${u.id}/roleplay`, 'Role-play', esc(u.roleplay.title))}
      ${step(4, s.quizBest >= 70, `#/unit/${u.id}/quiz`, 'Quick quiz', s.quizBest ? `Best score ${s.quizBest}%` : '6 questions · 70% to pass')}
    </div>`)
}

export function viewCards(u: Unit, index: number): void {
  const i = Math.max(0, Math.min(u.phrases.length - 1, index || 0))
  const p = u.phrases[i]
  const id = phraseId(u.id, p.jp)
  const known = phraseKnown(u, p.jp)
  progress.markSeen(id)
  setTopbar(esc(u.title), `#/unit/${u.id}`)
  const last = i === u.phrases.length - 1
  const root = show(`
    <div class="progress-dots" aria-label="Card ${i + 1} of ${u.phrases.length}">
      ${u.phrases.map((_, k) => `<span class="${k < i ? 'past' : k === i ? 'now' : ''}"></span>`).join('')}
    </div>
    <article class="card phrase-card" id="phrase-card">
      <span class="card-deco">${DECO.bow}</span>
      ${phraseHTML(p, { known })}
      ${audioButtons(p.jp)}
      ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
      ${p.grammar ? `<details class="grammar"><summary>${DECO.star} Grammar bite</summary><p>${esc(p.grammar)}</p></details>` : ''}
      <div class="practice" id="practice"></div>
    </article>
    <div class="nav-row">
      <a class="btn ghost" href="#/unit/${u.id}/cards/${i - 1}" ${i === 0 ? 'aria-disabled="true" tabindex="-1"' : ''}>Back</a>
      <a class="btn primary" id="next" href="${last ? `#/unit/${u.id}/listen` : `#/unit/${u.id}/cards/${i + 1}`}">${last ? 'On to listening' : 'Next'}</a>
    </div>`)
  bindSpeakCheck(root.querySelector('#practice') as HTMLElement, [p.jp, p.kana].filter((x): x is string => !!x), (ok) => {
    if (!ok) progress.grade(id, false)
  })
  window.setTimeout(() => void speak(p.jp), 250)
}

export function viewListen(u: Unit): void {
  setTopbar('Listening', `#/unit/${u.id}`)
  const items = u.listening
  const known = unitStats(u).done
  let k = 0
  let right = 0
  const paint = () => {
    if (k >= items.length) return end()
    const it = items[k]
    const meanings = shuffle(it.meanings.map((m, i) => ({ m, ok: i === 0 })))
    const root = show(`
      <div class="quiz-top"><span>Line ${k + 1} of ${items.length}</span><div class="bar small"><span style="width:${(k / items.length) * 100}%"></span></div></div>
      <article class="card listen-card" id="listen-card">
        <p class="q-label">${ICON.ear} Listen. No text yet!</p>
        <div class="listen-play">
          <button type="button" class="big-play" data-say="${esc(it.jp)}" aria-label="Play at natural speed">${ICON.play}</button>
          <button type="button" class="pill ghost" data-say="${esc(it.jp)}" data-slow="1">${ICON.slow}<span>Slow</span></button>
        </div>
        <div class="listen-text hidden" id="listen-text">
          ${phraseHTML(it, { big: false, known })}
          ${it.note ? `<p class="note">${esc(it.note)}</p>` : ''}
        </div>
      </article>
      <div id="lstage">
        <p class="prompt"><span class="eyebrow">Step 1</span> What does it mean?</p>
        <div class="options" id="mopts">${meanings.map((o, i) => `<button type="button" class="option" data-i="${i}"><span>${esc(o.m)}</span></button>`).join('')}</div>
      </div>`)
    window.setTimeout(() => void speak(it.jp), 350)
    root.querySelectorAll<HTMLButtonElement>('#mopts .option').forEach((b) => {
      b.addEventListener('click', () => {
        const pick = meanings[Number(b.dataset.i)]
        if (pick.ok) right += 1
        root.querySelectorAll<HTMLButtonElement>('#mopts .option').forEach((x) => {
          x.disabled = true
          const o = meanings[Number(x.dataset.i)]
          if (o.ok) x.classList.add('right')
          else if (o === pick) x.classList.add('wrong')
        })
        const st = document.getElementById('lstage') as HTMLElement
        st.insertAdjacentHTML(
          'beforeend',
          feedback(pick.ok, pick.ok ? 'そうそう！ You understood it.' : 'Close! It means:', `<p>${esc(it.en)}</p>`) +
            `<button type="button" class="btn primary wide" id="to-reply">Now reply</button>`,
        )
        document.getElementById('to-reply')?.addEventListener('click', () => replyStage(it))
      })
    })
  }
  const replyStage = (it: ListenItem) => {
    const opts = shuffle(it.reply.options)
    const correct = it.reply.options[0]
    const st = document.getElementById('lstage') as HTMLElement
    st.innerHTML = `
      <p class="prompt"><span class="eyebrow">Step 2</span> ${esc(it.reply.prompt)}</p>
      <div class="options" id="ropts">${opts
        .map(
          (o, i) =>
            `<button type="button" class="option" data-i="${i}"><span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, known)}</button>`,
        )
        .join('')}</div>
      ${canListen() ? `<button type="button" class="mic small" id="l-mic">${ICON.mic}<span>Or say your reply</span></button><div class="result" id="l-result"></div>` : ''}`
    const choose = (o: (typeof opts)[number]) => {
      const ok = o === correct
      st.querySelectorAll<HTMLButtonElement>('#ropts .option').forEach((x) => {
        x.disabled = true
        const y = opts[Number(x.dataset.i)]
        if (y === correct) x.classList.add('right')
        else if (y === o) x.classList.add('wrong')
      })
      const mic = document.getElementById('l-mic') as HTMLButtonElement | null
      if (mic) mic.disabled = true
      document.getElementById('listen-text')?.classList.remove('hidden')
      st.insertAdjacentHTML(
        'beforeend',
        feedback(
          ok,
          ok ? 'Perfect reply!' : 'A natural reply is:',
          `${ok ? '' : `<p class="jp" lang="ja">${esc(correct.jp)}</p>`}<p class="muted">${esc(correct.en)}</p>`,
        ) + `<button type="button" class="btn primary wide" id="l-next">${k === items.length - 1 ? 'Finish' : 'Next line'}</button>`,
      )
      playLine(correct.jp)
      document.getElementById('l-next')?.addEventListener('click', () => {
        k += 1
        paint()
      })
    }
    st.querySelectorAll<HTMLButtonElement>('#ropts .option').forEach((b) => {
      b.addEventListener('click', () => choose(opts[Number(b.dataset.i)]))
    })
    document.getElementById('l-mic')?.addEventListener('click', async () => {
      const mic = document.getElementById('l-mic') as HTMLButtonElement
      const out = document.getElementById('l-result') as HTMLElement
      mic.classList.add('listening')
      try {
        const alts = await listen()
        let best: { score: number; heard: string; o: (typeof opts)[number] } | null = null
        for (const o of opts) {
          const r = scoreUtterance(alts, [o.jp, o.kana].filter((x): x is string => !!x))
          if (!best || r.score > best.score) best = { ...r, o }
        }
        if (!alts.length || !best || best.score < 45) {
          out.innerHTML = `<p class="muted">Heard “${esc(alts[0] || '…')}”. Try again or tap an answer.</p>`
          return
        }
        out.innerHTML = `<p class="muted">Heard “<span class="jp">${esc(best.heard)}</span>” (${best.score}% match)</p>`
        choose(best.o)
      } catch {
        out.innerHTML = '<p class="muted">Mic isn’t available. Tap an answer instead.</p>'
      } finally {
        mic.classList.remove('listening')
      }
    })
  }
  const end = () => {
    progress.setUnit(u.id, { listenDone: true })
    show(`<div class="done-card" id="done-card">
      ${mascot('cheer', 'done-mascot')}
      <p class="jp big-jp" lang="ja">きけた！</p>
      <p>You understood ${right} of ${items.length} lines at natural speed.</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="l-again">Again</button>
        <a class="btn primary" href="#/unit/${u.id}/roleplay">Role-play</a>
      </div></div>`)
    celebrate(document.querySelector('.done-mascot'))
    document.getElementById('l-again')?.addEventListener('click', () => viewListen(u))
  }
  paint()
}

export function viewRoleplay(u: Unit): void {
  setTopbar('Role-play', `#/unit/${u.id}`)
  const rp = u.roleplay
  const known = unitStats(u).done
  const wasDone = known
  const gen = currentGeneration()
  let step = 0
  let correct = 0
  let asked = 0
  const root = show(`
    <section class="rp-head">
      <p class="eyebrow">${DECO.heart} Role-play</p>
      <h1>${esc(rp.title)}</h1>
      <p class="lede">${esc(rp.setting)}</p>
    </section>
    <div class="chat" id="chat"></div>
    <div class="reply" id="reply"></div>`)
  const chat = root.querySelector('#chat') as HTMLElement
  const reply = root.querySelector('#reply') as HTMLElement
  const bubble = (line: { name?: string; jp?: string; kana?: string; romaji?: string; en?: string; note?: string; fast?: boolean }, who: 'them' | 'you', extra = '') => {
    const el = document.createElement('div')
    el.className = `bubble ${who} ${extra}`
    const kana = kanaFor(line)
    el.innerHTML = `${who === 'them' ? `<div class="who">${esc(line.name || '')}</div>` : '<div class="who">You</div>'}
      <div class="jp bubble-jp" lang="ja">${esc(line.jp)}</div>
      ${kana ? `<div class="jp bubble-kana" lang="ja">${esc(kana)}</div>` : ''}
      <div>${romajiHTML(line.romaji, 'bubble-romaji', known)}</div>
      <div class="bubble-en">${esc(line.en)}</div>
      ${line.note && who === 'them' ? `<div class="bubble-note">${esc(line.note)}</div>` : ''}
      <div class="bubble-audio">
        <button type="button" class="mini" data-say="${esc(line.jp || '')}" ${line.fast ? 'data-fast="1"' : ''} aria-label="Play">${ICON.play}</button>
        <button type="button" class="mini" data-say="${esc(line.jp || '')}" data-slow="1" aria-label="Play slowly">${ICON.slow}</button>
      </div>`
    chat.appendChild(el)
    el.scrollIntoView({ block: 'end' })
  }
  const finish = () => {
    progress.setUnit(u.id, { roleplayDone: true })
    reply.innerHTML = `<div class="done-card">
      ${mascot('cheer', 'done-mascot')}
      ${unitCompleteBanner(u, wasDone)}
      <p class="jp big-jp" lang="ja">おつかれさま！</p>
      <p>You chose the natural reply ${correct} of ${asked} times.</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="rp-again">Play again</button>
        <a class="btn primary" href="#/unit/${u.id}/quiz">Take the quiz</a>
      </div></div>`
    celebrate(reply.querySelector('.done-mascot'))
    document.getElementById('rp-again')?.addEventListener('click', () => viewRoleplay(u))
  }
  const nextLine = () => {
    if (!isCurrent(gen)) return
    if (step >= rp.lines.length) return finish()
    const line = rp.lines[step++]
    if (line.speaker === 'them') {
      bubble(line, 'them')
      reply.innerHTML = ''
      playLine(line.jp, { fast: !!line.fast })
      window.setTimeout(nextLine, 700)
      return
    }
    asked += 1
    const right = line.options?.[0]
    const opts = shuffle(line.options || [])
    if (!right) return nextLine()
    reply.innerHTML = `
      <p class="prompt"><span class="eyebrow">Your turn</span> ${esc(line.prompt)}</p>
      <div class="options">
        ${opts.map((o, i) => `<button type="button" class="option" data-i="${i}"><span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, known)}</button>`).join('')}
      </div>
      ${canListen() ? `<button type="button" class="mic small" id="rp-mic">${ICON.mic}<span>Or say your reply</span></button><div class="result" id="rp-result"></div>` : ''}`
    const choose = (o: (typeof opts)[number]) => {
      const ok = o.jp === right.jp
      if (ok) correct += 1
      reply.querySelectorAll<HTMLButtonElement>('.option').forEach((b) => {
        b.disabled = true
        const y = opts[Number(b.dataset.i)]
        if (y.jp === right.jp) b.classList.add('right')
        else if (y === o) b.classList.add('wrong')
      })
      const mic = document.getElementById('rp-mic') as HTMLButtonElement | null
      if (mic) mic.disabled = true
      reply.insertAdjacentHTML(
        'beforeend',
        feedback(ok, ok ? 'そうです！ That’s it.' : 'Not quite. The natural reply is:', `${ok ? '' : `<p class="jp" lang="ja">${esc(right.jp)}</p>`}<p class="muted">${esc(right.en)}</p>${line.note ? `<p class="note">${esc(line.note)}</p>` : ''}`) +
          '<button type="button" class="btn primary wide" id="rp-next">Continue</button>',
      )
      playLine(right.jp)
      document.getElementById('rp-next')?.addEventListener('click', () => {
        bubble(right, 'you', ok ? '' : 'corrected')
        reply.innerHTML = ''
        window.setTimeout(nextLine, 300)
      })
    }
    reply.querySelectorAll<HTMLButtonElement>('.option').forEach((b) => {
      b.addEventListener('click', () => choose(opts[Number(b.dataset.i)]))
    })
    document.getElementById('rp-mic')?.addEventListener('click', async () => {
      const mic = document.getElementById('rp-mic') as HTMLButtonElement
      const out = document.getElementById('rp-result') as HTMLElement
      mic.classList.add('listening')
      try {
        const alts = await listen()
        let best: { score: number; heard: string; o: (typeof opts)[number] } | null = null
        for (const o of opts) {
          const r = scoreUtterance(alts, [o.jp, o.kana].filter((x): x is string => !!x))
          if (!best || r.score > best.score) best = { ...r, o }
        }
        if (!alts.length || !best || best.score < 45) {
          out.innerHTML = `<p class="muted">Heard “${esc(alts[0] || '…')}”. Try again or tap an answer.</p>`
          return
        }
        out.innerHTML = `<p class="muted">Heard “<span class="jp">${esc(best.heard)}</span>” (${best.score}% match)</p>`
        choose(best.o)
      } catch {
        out.innerHTML = '<p class="muted">Mic isn’t available. Tap an answer instead.</p>'
      } finally {
        mic.classList.remove('listening')
      }
    })
  }
  nextLine()
}

export function viewQuiz(u: Unit): void {
  setTopbar('Quick quiz', `#/unit/${u.id}`)
  const wasDone = unitStats(u).done
  const pool = shuffle(u.phrases).slice(0, Math.min(6, u.phrases.length))
  const types = ['en2jp', 'jp2en', 'listen'] as const
  const qs = pool.map((p, k) => {
    const type = types[k % types.length]
    const distract = shuffle(u.phrases.filter((x) => x !== p)).slice(0, 3)
    return { type, p, all: shuffle([p, ...distract]) }
  })
  let k = 0
  let score = 0
  const paint = () => {
    if (k >= qs.length) return end()
    const q = qs[k]
    const known = phraseKnown(u, q.p.jp)
    const kana = kanaFor(q.p)
    const head =
      q.type === 'en2jp'
        ? `<p class="q-label">How do you say…</p><p class="q-main">${esc(q.p.en)}</p>`
        : q.type === 'jp2en'
          ? `<p class="q-label">What does this mean?</p><p class="q-main jp" lang="ja">${esc(q.p.jp)}</p>${kana ? `<p class="q-kana jp" lang="ja">${esc(kana)}</p>` : ''}<p class="q-sub">${romajiHTML(q.p.romaji, 'q-romaji', known)}</p>`
          : `<p class="q-label">${ICON.ear} Listen. What did you hear?</p>${audioButtons(q.p.jp, 'center')}`
    const root = show(`
      <div class="quiz-top"><span>Question ${k + 1} of ${qs.length}</span><div class="bar small"><span style="width:${(k / qs.length) * 100}%"></span></div></div>
      <article class="card quiz-card">${head}</article>
      <div class="options" id="opts">
        ${q.all
          .map(
            (o, i) =>
              `<button type="button" class="option" data-i="${i}">${
                q.type === 'en2jp'
                  ? `<span class="jp" lang="ja">${esc(o.jp)}</span>${optRomaji(o, phraseKnown(u, o.jp))}`
                  : `<span>${esc(o.en)}</span>`
              }</button>`,
          )
          .join('')}
      </div>
      <div id="qfb"></div>`)
    if (q.type === 'listen') window.setTimeout(() => void speak(q.p.jp), 300)
    root.querySelectorAll<HTMLButtonElement>('#opts .option').forEach((b) => {
      b.addEventListener('click', () => {
        const pick = q.all[Number(b.dataset.i)]
        const ok = pick === q.p
        if (ok) score += 1
        const id = phraseId(u.id, q.p.jp)
        progress.markSeen(id)
        if (!ok) progress.grade(id, false)
        root.querySelectorAll<HTMLButtonElement>('#opts .option').forEach((x) => {
          x.disabled = true
          const o = q.all[Number(x.dataset.i)]
          if (o === q.p) x.classList.add('right')
          else if (o === pick) x.classList.add('wrong')
        })
        const fb = document.getElementById('qfb') as HTMLElement
        fb.innerHTML =
          feedback(ok, ok ? 'せいかい！ Correct!' : 'Not this time. Here it is:', phraseHTML(q.p, { big: false, known })) +
          `<button type="button" class="btn primary wide" id="qnext">${k === qs.length - 1 ? 'See results' : 'Next'}</button>`
        if (q.type !== 'listen') playLine(q.p.jp)
        document.getElementById('qnext')?.addEventListener('click', () => {
          k += 1
          paint()
        })
      })
    })
  }
  const end = () => {
    const pct = Math.round((score / qs.length) * 100)
    const prev = progress.unit(u.id).quizBest
    progress.setUnit(u.id, { quizBest: Math.max(prev, pct) })
    const pass = pct >= 70
    const s = unitStats(u)
    const nxt = nextUnit(u.id)
    show(`<div class="done-card">
      ${mascot(pass ? 'cheer' : 'think', 'done-mascot')}
      ${unitCompleteBanner(u, wasDone)}
      <p class="jp big-jp" lang="ja">${pass ? 'よくできました！' : 'もう一回！'}</p>
      <p class="score-big">${score} / ${qs.length}</p>
      <p class="muted">${
        pass
          ? s.done
            ? 'Missed phrases were sent back to your review queue.'
            : 'Quiz passed. Finish the other steps to complete the unit.'
          : 'Score 70% or more to pass. Missed phrases were sent back to your review queue.'
      }</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="qagain">Try again</button>
        <a class="btn primary" href="${pass ? (s.done ? `#/unit/${nxt.id}` : `#/unit/${u.id}`) : `#/unit/${u.id}/cards/0`}">${pass ? (s.done ? 'Next unit' : 'Back to unit') : 'Review the cards'}</a>
      </div></div>`)
    const m = document.querySelector('.done-mascot')
    if (pass) celebrate(m)
    document.getElementById('qagain')?.addEventListener('click', () => viewQuiz(u))
  }
  paint()
}
