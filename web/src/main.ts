import './styles.css'
import { speak, stopSpeak, unlock } from './audio/player'
import { stopListen } from './speech/recognize'
import { loadCourse } from './content/course'
import { go, setNavigator } from './nav'
import { registerServiceWorker } from './pwa'
import { course, progress, setCourse } from './session'
import { bumpGeneration, show, toast } from './ui/shell'
import { alignUnlocked, nextDailyHash } from './views/curriculum'
import { viewTodayConvo, viewTodayDone, viewTodayListen, viewTodayNew, viewTodayWarm } from './views/daily'
import { viewHome } from './views/home'
import { viewReview } from './views/review'
import { viewSettings } from './views/settings'
import { viewCards, viewListen, viewQuiz, viewRoleplay, viewUnit } from './views/unit'

function render(): void {
  stopSpeak()
  stopListen()
  bumpGeneration()
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean)
  try {
    if (!parts.length) viewHome()
    else if (parts[0] === 'today') {
      if (!parts[1]) go(nextDailyHash())
      else if (parts[1] === 'warm') viewTodayWarm()
      else if (parts[1] === 'new') viewTodayNew()
      else if (parts[1] === 'convo') viewTodayConvo()
      else if (parts[1] === 'listen') viewTodayListen()
      else if (parts[1] === 'done') viewTodayDone()
      else go('#/today')
    } else if (parts[0] === 'unit') {
      const u = course.units.find((x) => x.id === parts[1])
      if (!u) return go('#/')
      if (parts[2] === 'cards') viewCards(u, Number.parseInt(parts[3] || '0', 10))
      else if (parts[2] === 'listen') viewListen(u)
      else if (parts[2] === 'roleplay') viewRoleplay(u)
      else if (parts[2] === 'quiz') viewQuiz(u)
      else viewUnit(u)
    } else if (parts[0] === 'review') viewReview()
    else if (parts[0] === 'settings') viewSettings()
    else go('#/')
  } catch (err) {
    console.error(err)
    show(`<p class="muted">Something went wrong. <a href="#/">Go home</a></p>`)
  }
}

function bindAudio(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    if (!target) return
    const reveal = target.closest('[data-reveal]') as HTMLElement | null
    if (reveal) {
      e.preventDefault()
      const span = document.createElement('span')
      span.className = reveal.dataset.cls || ''
      span.textContent = reveal.dataset.reveal || ''
      reveal.replaceWith(span)
      return
    }
    const say = target.closest('[data-say]') as HTMLButtonElement | null
    if (!say) return
    unlock()
    say.classList.add('playing')
    speak(say.dataset.say || '', { slow: !!say.dataset.slow, fast: !!say.dataset.fast }).then((ok) => {
      say.classList.remove('playing')
      if (!ok) toast('Turn up volume / check silent mode')
    })
  })
}

export async function boot(): Promise<void> {
  bindAudio()
  setNavigator(render)
  try {
    setCourse(await loadCourse())
  } catch {
    show('<p class="muted">Couldn’t load lessons. Serve this folder instead of opening the file directly.</p>')
    return
  }
  alignUnlocked()
  progress.ensureDaily()
  window.addEventListener('hashchange', render)
  render()
  registerServiceWorker()
}

boot()
