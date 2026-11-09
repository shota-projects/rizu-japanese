import { DECO } from './icons'
import { progress } from '../session'

let generation = 0
let toastTimer = 0

export function bumpGeneration(): number {
  generation += 1
  return generation
}

export function currentGeneration(): number {
  return generation
}

export function isCurrent(gen: number): boolean {
  return gen === generation
}

export function appRoot(): HTMLElement {
  const el = document.getElementById('app')
  if (!el) throw new Error('missing app')
  return el
}

export function show(html: string): HTMLElement {
  const root = appRoot()
  root.innerHTML = html
  window.scrollTo(0, 0)
  return root
}

export function toast(msg: string): void {
  const el = document.getElementById('toast')
  if (!el) return
  el.textContent = msg
  el.classList.add('show')
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 2200)
}

export function setTopbar(title: string, back: string | null): void {
  const top = document.getElementById('topbar')
  if (!top) return
  if (!back) {
    top.classList.add('hidden')
    top.innerHTML = ''
    return
  }
  top.classList.remove('hidden')
  top.innerHTML = `<a class="iconbtn" href="${back}" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a><div class="topbar-title">${title}</div><span class="streak-mini" title="Day streak">${DECO.star}${progress.streak()}日</span>`
}

export function sparkle(el: Element | null): void {
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  const layer = document.createElement('div')
  layer.className = 'sparkles'
  layer.style.left = `${r.left + r.width / 2}px`
  layer.style.top = `${r.top + Math.min(r.height / 2, 80)}px`
  const kinds = [DECO.star, DECO.heart, DECO.star, DECO.bow]
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span')
    const a = (i / 8) * Math.PI * 2
    const d = 46 + Math.random() * 36
    s.style.setProperty('--dx', `${Math.cos(a) * d}px`)
    s.style.setProperty('--dy', `${Math.sin(a) * d}px`)
    s.className = `spark c${i % 3}`
    s.innerHTML = kinds[i % kinds.length]
    layer.appendChild(s)
  }
  document.body.appendChild(layer)
  window.setTimeout(() => layer.remove(), 900)
}

export function celebrate(el: Element | null): void {
  el?.classList.add('bounce')
  sparkle(el)
}
