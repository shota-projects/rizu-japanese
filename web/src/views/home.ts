import { unitsOf } from '../content/course'
import { course, progress } from '../session'
import { DECO, ICON, mascot } from '../ui/icons'
import { esc } from '../ui/text'
import { show } from '../ui/shell'
import { dailyProgress, nextDailyHash, unitStats } from './curriculum'
import { todayKey } from '../progress/clock'

function greeting(): { html: string; en: string } {
  const h = new Date().getHours()
  const phrase = h < 11 ? 'おはよう' : h < 18 ? 'こんにちは' : 'こんばんは'
  const en = h < 11 ? 'Good morning' : h < 18 ? 'Hello' : 'Good evening'
  return {
    html: `<span class="greet-phrase">${phrase}、</span><span class="greet-name">リズちゃん</span>`,
    en,
  }
}

function heatmap(): string {
  const days = new Set(Object.keys(progress.state.days))
  const cells: string[] = []
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - 27)
  const today = todayKey()
  for (let i = 0; i < 28; i++) {
    const key = todayKey(d)
    cells.push(`<span class="hm-cell ${days.has(key) ? 'on' : ''} ${key === today ? 'today' : ''}" title="${key}"></span>`)
    d.setDate(d.getDate() + 1)
  }
  return `<div class="heatmap" aria-label="Practice days">${cells.join('')}</div>`
}

function encourage(): string {
  const { finished, done } = dailyProgress()
  const st = progress.streak()
  if (finished) return st >= 3 ? `Streak ${st} — you’re on a roll.` : '今日もおつかれさま. Come back tomorrow.'
  if (done === 0) return 'A cozy ten minutes. Missing a day is fine — we just pick up again.'
  return `${done} of 4 parts done. Keep going when you’re ready.`
}

function unitRow(u: (typeof course.units)[number], i: number): string {
  const s = unitStats(u)
  return `<a class="unit-card ${s.done ? 'done' : ''}" href="#/unit/${u.id}">
    <span class="unit-num">${s.done ? ICON.check : i + 1}</span>
    <div class="unit-body">
      <div class="unit-title">${esc(u.title)}</div>
      <div class="jp unit-jp" lang="ja">${esc(u.jpTitle)}</div>
      <div class="bar small"><span style="width:${Math.round((s.steps / 4) * 100)}%"></span></div>
    </div>
  </a>`
}

export function viewHome(): void {
  const top = document.getElementById('topbar')
  if (top) {
    top.classList.add('hidden')
    top.innerHTML = ''
  }
  const seen = course.units.reduce((n, u) => n + unitStats(u).seen, 0)
  const due = progress.dueIds().filter((id) => course.byId.has(id)).length
  const greet = greeting()
  const { finished, done } = dailyProgress()
  const href = finished ? '#/today/done' : nextDailyHash()
  const ctaMain = finished ? 'Lesson complete' : done ? 'Continue today’s lesson' : 'Today’s lesson'
  const ctaSub = finished ? 'Peek at free practice, or come back tomorrow' : 'Warm-up · new phrases · chat · listen'
  const nudge =
    progress.needsBackupReminder()
      ? `<aside class="backup-nudge home-nudge" role="note">
          <span aria-hidden="true">${DECO.bow}</span>
          <div>
            <strong>Save a backup?</strong>
            <p>A backup code keeps your streak safe if you switch phones. About once a week is plenty.</p>
            <a class="btn ghost" href="#/settings">Back up my progress</a>
          </div>
        </aside>`
      : ''
  show(`
    <section class="hero">
      <a class="iconbtn hero-gear" href="#/settings" aria-label="Settings">${ICON.gear}</a>
      <div class="hero-row">
        <div class="hero-text">
          <p class="eyebrow">${DECO.heart} for リズちゃん</p>
          <h1 class="jp hero-jp" lang="ja">${greet.html}</h1>
          <p class="hero-en">${greet.en}, Rizu-chan. ${esc(encourage())}</p>
        </div>
        ${mascot(finished ? 'cheer' : 'wave', 'hero-mascot')}
      </div>
      <div class="stats">
        <div class="stat"><span class="stat-num">${progress.streak()}</span><span class="stat-label">day streak</span></div>
        <div class="stat"><span class="stat-num">${seen}</span><span class="stat-label">phrases</span></div>
        <div class="stat"><span class="stat-num">${due}</span><span class="stat-label">due review</span></div>
      </div>
      ${heatmap()}
      <a class="btn primary wide cta daily-cta ${finished ? 'done' : ''}" href="${href}" id="start-cta">
        <span class="cta-main">${ctaMain}</span>
        <span class="cta-sub">${ctaSub}</span>
      </a>
      ${nudge}
    </section>
    <details class="free-practice" id="free-practice">
      <summary>
        <span class="track-icon">${DECO.star}</span>
        <div>
          <div class="unit-title">Free practice</div>
          <div class="unit-sub">Open any unit’s phrases, role-play, listening, or quiz</div>
        </div>
      </summary>
      ${course.tracks
        .map((t) => {
          const units = unitsOf(course, t.id)
          const doneN = units.filter((u) => unitStats(u).done).length
          return `<section class="track track-${t.id}" id="track-${t.id}">
            <div class="track-head">
              <span class="track-icon">${t.id === 'family' ? DECO.heart : DECO.star}</span>
              <div>
                <h2 class="track-title">${esc(t.title)} <span class="jp track-jp" lang="ja">${esc(t.jpTitle)}</span></h2>
                <p class="track-blurb">${esc(t.blurb)}</p>
              </div>
              <span class="tag">${doneN}/${units.length}</span>
            </div>
            <div class="units">${units.map(unitRow).join('')}</div>
          </section>`
        })
        .join('')}
      <a class="review-card-home ${due ? 'has-due' : ''}" href="#/review" id="review-cta">
        <span class="track-icon">${DECO.bow}</span>
        <div><div class="unit-title">Review bank</div><div class="unit-sub">${due ? `${due} phrase${due > 1 ? 's' : ''} ready` : 'Leitner spaced review'}</div></div>
        <span class="tag ${due ? 'hot' : ''}">${due}</span>
      </a>
    </details>
    <footer class="foot">${DECO.skull}<span>がんばって、リズちゃん</span>${DECO.skull}</footer>`)
}
