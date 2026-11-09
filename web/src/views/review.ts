import { course, progress } from '../session'
import { speak } from '../audio/player'
import { mascot } from '../ui/icons'
import { audioButtons, phraseHTML } from '../ui/phrase'
import { celebrate, setTopbar, show } from '../ui/shell'
import { esc } from '../ui/text'
import { canListen } from '../speech/recognize'
import { nextUnit } from './curriculum'
import { bindSpeakCheck } from './practice'

export function viewReview(): void {
  setTopbar('Review', '#/')
  const queue = progress.dueIds().filter((id) => course.byId.has(id))
  const boxBar = () => {
    const boxes = [1, 2, 3, 4, 5].map(
      (b) => Object.keys(progress.state.srs).filter((id) => course.byId.has(id) && progress.state.srs[id].value.box === b).length,
    )
    return `<div class="boxes" aria-label="Leitner boxes">${boxes
      .map((n, i) => `<div class="box"><span class="box-n">${n}</span><span class="box-l">Box ${i + 1}</span></div>`)
      .join('')}</div>`
  }
  if (!queue.length) {
    const total = Object.keys(progress.state.srs).filter((id) => course.byId.has(id)).length
    const learn = nextUnit()
    show(`<div class="done-card">
      ${mascot(total ? 'cheer' : 'wave', 'done-mascot')}
      <p class="jp big-jp" lang="ja">${total ? 'ばっちり！' : 'まだです'}</p>
      <p>${total ? 'Nothing to review right now. Come back tomorrow.' : 'Learn a few phrases first and they’ll show up here.'}</p>
      ${boxBar()}
      <p class="muted small">Phrases move up a box when you get them, and come back less often: same day, then 1, 3, 7, and 16 days.</p>
      <a class="btn primary" href="#/unit/${learn.id}">Learn phrases</a></div>`)
    return
  }
  const session = queue.slice(0, 20)
  const retry = new Set<string>()
  let k = 0
  let got = 0
  const paint = () => {
    if (k >= session.length) {
      show(`<div class="done-card">${mascot('cheer', 'done-mascot')}<p class="jp big-jp" lang="ja">おつかれさま！</p>
        <p>You reviewed ${session.length - retry.size} card${session.length - retry.size === 1 ? '' : 's'} and got ${got} on the first try.</p>
        ${boxBar()}
        <a class="btn primary" href="#/">Home</a></div>`)
      celebrate(document.querySelector('.done-mascot'))
      return
    }
    const id = session[k]
    const item = course.byId.get(id)
    if (!item) {
      k += 1
      paint()
      return
    }
    const { phrase: p, unit: u } = item
    const box = progress.state.srs[id].value.box
    const root = show(`
      <div class="quiz-top"><span>${k + 1} of ${session.length} · Box ${box}</span><div class="bar small"><span style="width:${(k / session.length) * 100}%"></span></div></div>
      <article class="card review-card">
        <p class="q-label">Say it in Japanese</p>
        <p class="q-main">${esc(p.en)}</p>
        <p class="muted small">from “${esc(u.title)}”</p>
        <div id="answer" class="answer hidden">${phraseHTML(p, { big: false, known: progress.box(id) >= 3 })}${audioButtons(p.jp, 'center')}</div>
      </article>
      <div id="rv-actions">
        <div id="rv-speak" class="practice"></div>
        <button type="button" class="btn primary wide" id="reveal">Show answer</button>
      </div>`)
    const speakBox = root.querySelector('#rv-speak') as HTMLElement
    if (canListen()) bindSpeakCheck(speakBox, [p.jp, p.kana].filter((x): x is string => !!x))
    else speakBox.remove()
    root.querySelector('#reveal')?.addEventListener('click', () => {
      document.getElementById('answer')?.classList.remove('hidden')
      void speak(p.jp)
      const actions = document.getElementById('rv-actions') as HTMLElement
      actions.innerHTML = `<div class="rate-row">
        <button type="button" class="btn ghost" id="again">Again</button>
        <button type="button" class="btn soft" id="gotit">Got it</button>
      </div>`
      document.getElementById('again')?.addEventListener('click', () => {
        progress.grade(id, false)
        if (!retry.has(id)) {
          retry.add(id)
          session.push(id)
        }
        k += 1
        paint()
      })
      document.getElementById('gotit')?.addEventListener('click', (ev) => {
        if (!retry.has(id)) {
          progress.grade(id, true)
          got += 1
        }
        celebrate(ev.currentTarget as Element)
        window.setTimeout(() => {
          k += 1
          paint()
        }, 280)
      })
    })
  }
  paint()
}
