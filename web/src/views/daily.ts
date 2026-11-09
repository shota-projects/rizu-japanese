import { curriculumPath, type IndexedPhrase, type ListenItem } from '../content/course'
import { go } from '../nav'
import { course, progress } from '../session'
import { speak } from '../audio/player'
import { DECO, ICON, mascot } from '../ui/icons'
import { audioButtons, kanaFor, phraseHTML, romajiHTML, stepBar } from '../ui/phrase'
import { celebrate, currentGeneration, isCurrent, setTopbar, show } from '../ui/shell'
import { esc, shuffle } from '../ui/text'
import { nextNewPhrases, peekTomorrow } from './curriculum'
import { bindSpeakCheck, bindWarmPractice, playLine } from './practice'

function targetsOf(p: { jp: string; kana?: string }): string[] {
  return [p.jp, p.kana].filter((x): x is string => !!x)
}

export function viewTodayWarm(): void {
  const d = progress.ensureDaily()
  if (d.warmDone) return go('#/today/new')
  setTopbar('Warm-up', '#/')
  const due = progress
    .dueIds()
    .map((id) => course.byId.get(id))
    .filter((x): x is IndexedPhrase => !!x)
    .slice(0, 8)
  if (!due.length) {
    progress.setDaily({ warmDone: true })
    show(`<div class="done-card">${mascot('wave', 'done-mascot')}${stepBar('warm')}
      <p class="jp big-jp" lang="ja">まだ大丈夫！</p>
      <p>Nothing is due for review yet — first day magic.</p>
      <a class="btn primary wide" id="warm-next" href="#/today/new">New phrases</a></div>`)
    return
  }
  let i = 0
  const paint = () => {
    if (i >= due.length) {
      progress.setDaily({ warmDone: true })
      show(`<div class="done-card">${mascot('cheer', 'done-mascot')}${stepBar('warm')}
        <p class="jp big-jp" lang="ja">おつかれ！</p>
        <p>Warm-up done — ${due.length} phrase${due.length > 1 ? 's' : ''} refreshed.</p>
        <a class="btn primary wide" href="#/today/new">New phrases</a></div>`)
      celebrate(document.querySelector('.done-mascot'))
      return
    }
    const { phrase: p, id } = due[i]
    const known = progress.box(id) >= 3
    const kana = kanaFor(p)
    const len = [...p.jp].length
    const size = len > 18 ? 'xlong' : len > 12 ? 'long' : ''
    const root = show(`
      ${stepBar('warm')}
      <div class="quiz-top"><span>Review ${i + 1} of ${due.length}</span><div class="bar small"><span style="width:${(i / due.length) * 100}%"></span></div></div>
      <article class="card phrase-card warm-card" id="phrase-card">
        <span class="card-deco">${DECO.bow}</span>
        <p class="prompt warm-ask"><span class="eyebrow">Recall</span> How do you say this?</p>
        <div class="phrase-en warm-en">${esc(p.en)}</div>
        <div class="warm-answer hidden" id="warm-answer">
          <div class="phrase big ${size}">
            <div class="jp phrase-jp" lang="ja">${esc(p.jp)}</div>
            ${kana ? `<div class="jp phrase-kana" lang="ja">${esc(kana)}</div>` : ''}
            <div class="phrase-romaji-wrap">${romajiHTML(p.romaji, 'phrase-romaji', known)}</div>
          </div>
          <div id="warm-audio">${audioButtons(p.jp)}</div>
        </div>
        <div class="practice" id="practice"></div>
      </article>
      <button type="button" class="btn primary wide" id="warm-next" disabled>Next</button>`)
    let rated = false
    const next = root.querySelector('#warm-next') as HTMLButtonElement
    bindWarmPractice(
      root.querySelector('#practice') as HTMLElement,
      targetsOf(p),
      () => {
        document.getElementById('warm-answer')?.classList.remove('hidden')
        void speak(p.jp)
      },
      (ok) => {
        progress.grade(id, ok)
        rated = true
        next.disabled = false
      },
    )
    next.addEventListener('click', () => {
      if (!rated) return
      i += 1
      paint()
    })
  }
  paint()
}

export function viewTodayNew(): void {
  const d = progress.ensureDaily()
  if (d.newDone) return go('#/today/convo')
  setTopbar('New phrases', '#/')
  const n = progress.setting('dailyNew') || 3
  const batch: IndexedPhrase[] =
    d.newIds && d.newIds.length
      ? d.newIds.map((id) => course.byId.get(id)).filter((x): x is IndexedPhrase => !!x)
      : nextNewPhrases(n)
  if (!batch.length) {
    progress.setDaily({ newDone: true, newIds: [] })
    show(`<div class="done-card">${mascot('cheer', 'done-mascot')}${stepBar('new')}
      <p class="jp big-jp" lang="ja">全部おぼえた！</p>
      <p>You’ve unlocked every phrase. Free practice keeps the conversation going.</p>
      <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`)
    return
  }
  if (!d.newIds?.length) progress.setDaily({ newIds: batch.map((x) => x.id) })
  let i = 0
  const paint = () => {
    if (i >= batch.length) {
      const path = curriculumPath(course)
      let end = progress.state.curriculum.value.unlocked
      for (const item of batch) {
        const idx = path.findIndex((p) => p.id === item.id)
        if (idx >= 0) end = Math.max(end, idx + 1)
      }
      progress.setUnlocked(end)
      progress.setDaily({ newDone: true })
      show(`<div class="done-card">${mascot('cheer', 'done-mascot')}${stepBar('new')}
        <p class="jp big-jp" lang="ja">新しいことば！</p>
        <p>${batch.length} new phrase${batch.length > 1 ? 's' : ''} unlocked.</p>
        <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`)
      celebrate(document.querySelector('.done-mascot'))
      return
    }
    const item = batch[i]
    const p = item.phrase
    progress.markSeen(item.id)
    const root = show(`
      ${stepBar('new')}
      <div class="quiz-top"><span>New ${i + 1} of ${batch.length}</span><div class="bar small"><span style="width:${(i / batch.length) * 100}%"></span></div></div>
      <article class="card phrase-card" id="phrase-card">
        <span class="card-deco">${DECO.heart}</span>
        ${phraseHTML(p, { known: false })}
        ${audioButtons(p.jp)}
        ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
        ${p.grammar ? `<details class="grammar"><summary>${DECO.star} Grammar bite</summary><p>${esc(p.grammar)}</p></details>` : ''}
        <div class="practice" id="practice"></div>
      </article>
      <button type="button" class="btn primary wide" id="new-next">Next</button>`)
    bindSpeakCheck(root.querySelector('#practice') as HTMLElement, targetsOf(p), (ok) => progress.grade(item.id, ok))
    root.querySelector('#new-next')?.addEventListener('click', () => {
      i += 1
      paint()
    })
    window.setTimeout(() => void speak(p.jp), 250)
  }
  paint()
}

export function viewTodayConvo(): void {
  const d = progress.ensureDaily()
  if (d.convoDone) return go('#/today/listen')
  setTopbar('Mini conversation', '#/')
  const first = (d.newIds || []).map((id) => course.byId.get(id)).find((x) => !!x)
  const unit = first?.unit || course.units[0]
  const lines = unit.roleplay.lines.slice(0, 6)
  const gen = currentGeneration()
  let step = 0
  let asked = 0
  let correct = 0
  const root = show(`
    ${stepBar('convo')}
    <section class="rp-head">
      <p class="eyebrow">${DECO.heart} Mini conversation</p>
      <h1>${esc(unit.roleplay.title)}</h1>
      <p class="lede">${esc(unit.roleplay.setting)} Today’s phrases are mixed in.</p>
    </section>
    <div class="chat" id="chat"></div>
    <div class="reply" id="reply"></div>`)
  const chat = root.querySelector('#chat') as HTMLElement
  const reply = root.querySelector('#reply') as HTMLElement
  const bubble = (line: { name?: string; jp?: string; kana?: string; romaji?: string; en?: string }, who: 'them' | 'you') => {
    const el = document.createElement('div')
    el.className = `bubble ${who}`
    const kana = kanaFor(line)
    el.innerHTML = `${who === 'them' ? `<div class="who">${esc(line.name || '')}</div>` : '<div class="who">You</div>'}
      <div class="jp bubble-jp" lang="ja">${esc(line.jp)}</div>
      ${kana ? `<div class="jp bubble-kana" lang="ja">${esc(kana)}</div>` : ''}
      <div>${romajiHTML(line.romaji, 'bubble-romaji', false)}</div>
      <div class="bubble-en">${esc(line.en)}</div>
      <div class="bubble-audio">
        <button type="button" class="mini" data-say="${esc(line.jp || '')}" aria-label="Play">${ICON.play}</button>
        <button type="button" class="mini" data-say="${esc(line.jp || '')}" data-slow="1" aria-label="Play slowly">${ICON.slow}</button>
      </div>`
    chat.appendChild(el)
    el.scrollIntoView({ block: 'end' })
  }
  const finish = () => {
    progress.setDaily({ convoDone: true })
    reply.innerHTML = `<div class="done-card">${mascot('cheer', 'done-mascot')}
      <p class="jp big-jp" lang="ja">いい会話！</p>
      <p>${correct} of ${asked} replies on point.</p>
      <a class="btn primary wide" href="#/today/listen">Quick listen</a></div>`
    celebrate(reply.querySelector('.done-mascot'))
  }
  const next = () => {
    if (!isCurrent(gen)) return
    if (step >= lines.length) return finish()
    const line = lines[step++]
    if (line.speaker === 'them') {
      bubble(line, 'them')
      reply.innerHTML = ''
      playLine(line.jp, { fast: !!line.fast })
      window.setTimeout(next, 650)
    } else {
      const opts = shuffle(line.options || [])
      const correctOpt = line.options?.[0]
      if (!correctOpt) return next()
      reply.innerHTML = `<p class="prompt">${esc(line.prompt)}</p>
        <div class="options">${opts
          .map(
            (o, idx) =>
              `<button type="button" class="option" data-i="${idx}"><span class="jp" lang="ja">${esc(o.jp)}</span><span class="opt-romaji">${esc(o.romaji || '')}</span></button>`,
          )
          .join('')}</div>`
      reply.querySelectorAll<HTMLButtonElement>('.option').forEach((b) => {
        b.addEventListener('click', () => {
          const pick = opts[Number(b.dataset.i)]
          asked += 1
          const ok = pick.jp === correctOpt.jp
          if (ok) correct += 1
          reply.querySelectorAll<HTMLButtonElement>('.option').forEach((x) => {
            x.disabled = true
            const y = opts[Number(x.dataset.i)]
            if (y.jp === correctOpt.jp) x.classList.add('right')
            else if (y === pick) x.classList.add('wrong')
          })
          bubble(correctOpt, 'you')
          playLine(correctOpt.jp)
          window.setTimeout(next, 700)
        })
      })
    }
  }
  next()
}

export function viewTodayListen(): void {
  const d = progress.ensureDaily()
  if (d.listenDone) return go('#/today/done')
  setTopbar('Quick listen', '#/')
  const items = pickDailyListen(4)
  if (!items.length) {
    progress.setDaily({ listenDone: true, done: true })
    progress.touchDay()
    return go('#/today/done')
  }
  let k = 0
  const paint = () => {
    if (k >= items.length) {
      progress.setDaily({ listenDone: true, done: true })
      progress.touchDay()
      return go('#/today/done')
    }
    const it = items[k]
    const meanings = shuffle(it.meanings.map((m, idx) => ({ m, ok: idx === 0 })))
    const root = show(`
      ${stepBar('listen')}
      <div class="quiz-top"><span>Listen ${k + 1} of ${items.length}</span><div class="bar small"><span style="width:${(k / items.length) * 100}%"></span></div></div>
      <article class="card listen-card" id="listen-card">
        <p class="q-label">${ICON.ear} Listen. No text yet!</p>
        <div class="listen-play">
          <button type="button" class="big-play" data-say="${esc(it.jp)}" aria-label="Play at natural speed">${ICON.play}</button>
          <button type="button" class="pill ghost" data-say="${esc(it.jp)}" data-slow="1">${ICON.slow}<span>Slow</span></button>
        </div>
        <div class="listen-text hidden" id="listen-text">${phraseHTML(it, { big: false })}</div>
      </article>
      <div id="lstage">
        <p class="prompt"><span class="eyebrow">Meaning</span> What did you hear?</p>
        <div class="options" id="mopts">${meanings.map((o, idx) => `<button type="button" class="option" data-i="${idx}"><span>${esc(o.m)}</span></button>`).join('')}</div>
      </div>`)
    window.setTimeout(() => void speak(it.jp), 350)
    root.querySelectorAll<HTMLButtonElement>('#mopts .option').forEach((b) => {
      b.addEventListener('click', () => {
        const pick = meanings[Number(b.dataset.i)]
        root.querySelectorAll<HTMLButtonElement>('#mopts .option').forEach((x) => {
          x.disabled = true
          const o = meanings[Number(x.dataset.i)]
          if (o.ok) x.classList.add('right')
          else if (o === pick) x.classList.add('wrong')
        })
        const st = document.getElementById('lstage') as HTMLElement
        const opts = shuffle(it.reply.options.slice())
        const correct = it.reply.options[0]
        st.innerHTML = `
          <p class="prompt"><span class="eyebrow">Reply out loud</span> ${esc(it.reply.prompt)}</p>
          <div class="options" id="ropts">${opts
            .map(
              (o, idx) =>
                `<button type="button" class="option" data-i="${idx}"><span class="jp" lang="ja">${esc(o.jp)}</span><span class="opt-romaji">${esc(o.romaji || '')}</span></button>`,
            )
            .join('')}</div>
          <div class="practice" id="practice"></div>`
        document.getElementById('listen-text')?.classList.remove('hidden')
        const practice = document.getElementById('practice')
        if (practice) bindSpeakCheck(practice, [correct.jp, correct.kana].filter((x): x is string => !!x))
        st.querySelectorAll<HTMLButtonElement>('#ropts .option').forEach((btn) => {
          btn.addEventListener('click', () => {
            const o = opts[Number(btn.dataset.i)]
            st.querySelectorAll<HTMLButtonElement>('#ropts .option').forEach((x) => {
              x.disabled = true
              const y = opts[Number(x.dataset.i)]
              if (y.jp === correct.jp) x.classList.add('right')
              else if (y === o) x.classList.add('wrong')
            })
            st.insertAdjacentHTML(
              'beforeend',
              `<button type="button" class="btn primary wide" id="l-next">${k === items.length - 1 ? 'Finish' : 'Next'}</button>`,
            )
            playLine(correct.jp)
            document.getElementById('l-next')?.addEventListener('click', () => {
              k += 1
              paint()
            })
          })
        })
      })
    })
  }
  paint()
}

function pickDailyListen(n: number): ListenItem[] {
  const unlockedUnits = new Set<string>()
  const path = curriculumPath(course)
  const upto = progress.state.curriculum.value.unlocked || 0
  path.slice(0, Math.max(upto, 1)).forEach((x) => unlockedUnits.add(x.unit.id))
  if (course.units[0]) unlockedUnits.add(course.units[0].id)
  const pool: ListenItem[] = []
  for (const u of course.units) {
    if (!unlockedUnits.has(u.id) || !u.listening) continue
    pool.push(...u.listening)
  }
  return shuffle(pool).slice(0, Math.min(n, pool.length))
}

export function viewTodayDone(): void {
  const d = progress.ensureDaily()
  if (d.warmDone && d.newDone && d.convoDone && d.listenDone && !d.done) progress.setDaily({ done: true })
  progress.touchDay()
  setTopbar('今日もおつかれさま', '#/')
  const tomorrow = peekTomorrow(progress.setting('dailyNew') || 3)
  const preview = tomorrow.length
    ? `<ul class="tomorrow-list">${tomorrow
        .map((x) => `<li><span class="jp" lang="ja">${esc(x.phrase.jp)}</span> <span class="muted">${esc(x.phrase.en)}</span></li>`)
        .join('')}</ul>`
    : `<p class="muted">More free practice tomorrow — the curriculum is complete.</p>`
  const nudge = progress.needsBackupReminder()
    ? `<aside class="backup-nudge" role="note">
        <span aria-hidden="true">${DECO.bow}</span>
        <div>
          <strong>Save a backup?</strong>
          <p>It’s been a little while. A backup code keeps your streak safe if you switch phones.</p>
          <a class="btn ghost" href="#/settings">Back up my progress</a>
        </div>
      </aside>`
    : ''
  show(`<div class="done-card end-card">
    ${mascot('cheer', 'done-mascot')}
    <p class="jp big-jp" lang="ja">おつかれさま！</p>
    <p>Streak: <strong>${progress.streak()}</strong> day${progress.streak() === 1 ? '' : 's'}. Missing a day never punishes you — just come back when you can.</p>
    ${nudge}
    <div class="tomorrow"><div class="set-title">Coming tomorrow</div>${preview}</div>
    <a class="btn primary wide" href="#/">Home</a>
  </div>`)
  celebrate(document.querySelector('.done-mascot'))
}
