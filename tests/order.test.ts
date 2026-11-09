import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { curriculumPath, dailyUnits, indexCourse, nextUnseen, phraseId } from '../web/src/content/course.ts'

const course = indexCourse(JSON.parse(readFileSync(new URL('../data/speak.json', import.meta.url), 'utf8')))

test('daily order keeps greetings first, then trains and asking for help', () => {
  const ids = dailyUnits(course).map((u) => u.id)
  assert.deepEqual(ids.slice(0, 4), ['f-meet', 'g-trains', 'g-help', 'f-holiday'])
  assert.ok(ids.includes('f-calls'))
  assert.ok(ids.indexOf('g-trains') < ids.indexOf('g-food'))
  assert.ok(ids.indexOf('g-help') < ids.indexOf('g-shopping'))
})

test('a reorder does not replay learned phrases or skip ones she has not seen', () => {
  const path = curriculumPath(course)
  const seen: Record<string, number> = {}
  for (const unitId of ['f-meet', 'g-food']) {
    const unit = course.units.find((u) => u.id === unitId)!
    for (const phrase of unit.phrases) seen[phraseId(unit.id, phrase.jp)] = 1
  }
  const next = nextUnseen(path, seen, 3)
  assert.equal(next.length, 3)
  assert.ok(next.every((p) => p.unit.id === 'g-trains'))
  assert.equal(next[0].id, phraseId('g-trains', course.units.find((u) => u.id === 'g-trains')!.phrases[0].jp))
  for (const id of Object.keys(seen)) assert.ok(!next.some((p) => p.id === id))
})
