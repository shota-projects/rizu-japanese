import { curriculumPath, phraseId, unitsOf, type IndexedPhrase, type Unit } from '../content/course'
import { course, progress } from '../session'

export function unitStats(u: Unit) {
  const seen = u.phrases.filter((p) => progress.state.seen[phraseId(u.id, p.jp)]).length
  const us = progress.unit(u.id)
  const flags = [seen === u.phrases.length, us.listenDone, us.roleplayDone, us.quizBest >= 70]
  const steps = flags.filter(Boolean).length
  return { seen, total: u.phrases.length, ...us, done: steps === 4, steps }
}

export function interleavedUnits(): Unit[] {
  const fam = unitsOf(course, 'family')
  const around = unitsOf(course, 'around')
  const order: Unit[] = []
  const n = Math.max(fam.length, around.length)
  for (let i = 0; i < n; i++) {
    if (fam[i]) order.push(fam[i])
    if (around[i]) order.push(around[i])
  }
  return order
}

export function nextUnit(afterId?: string): Unit {
  const order = interleavedUnits()
  const start = afterId ? Math.max(0, order.findIndex((u) => u.id === afterId) + 1) : 0
  for (let i = start; i < order.length; i++) if (!unitStats(order[i]).done) return order[i]
  for (const u of order) if (!unitStats(u).done) return u
  return order[0]
}

export function alignUnlocked(): void {
  const path = curriculumPath(course)
  let i = 0
  while (i < path.length && progress.state.seen[path[i].id]) i++
  progress.setUnlocked(i)
}

export function nextNewPhrases(count: number): IndexedPhrase[] {
  const path = curriculumPath(course)
  const unlocked = progress.state.curriculum.value.unlocked || 0
  return path.slice(unlocked, unlocked + count)
}

export function peekTomorrow(count: number): IndexedPhrase[] {
  const path = curriculumPath(course)
  const unlocked = progress.state.curriculum.value.unlocked || 0
  const daily = progress.ensureDaily()
  const todayNew = (daily.newIds && daily.newIds.length) || Math.min(count, Math.max(0, path.length - unlocked))
  const start = daily.newDone ? unlocked : unlocked + todayNew
  return path.slice(start, start + Math.min(3, count))
}

export function dailyProgress() {
  const d = progress.ensureDaily()
  const parts = [d.warmDone, d.newDone, d.convoDone, d.listenDone]
  const done = parts.filter(Boolean).length
  return { d, done, total: 4, finished: !!d.done || done === 4 }
}

export function nextDailyHash(): string {
  const { d, finished } = dailyProgress()
  if (finished && d.done) return '#/today/done'
  if (!d.warmDone) return '#/today/warm'
  if (!d.newDone) return '#/today/new'
  if (!d.convoDone) return '#/today/convo'
  if (!d.listenDone) return '#/today/listen'
  return '#/today/done'
}

export function phraseKnown(unit: Unit, jp: string): boolean {
  return progress.box(phraseId(unit.id, jp)) >= 3
}
