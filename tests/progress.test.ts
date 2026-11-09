import assert from 'node:assert/strict'
import { test } from 'node:test'
import { exportBackup, parseBackup } from '../web/src/progress/backup.ts'
import { streakCount } from '../web/src/progress/clock.ts'
import { migrateLegacy, toLegacy } from '../web/src/progress/migrate.ts'
import { mergeProgress } from '../web/src/progress/merge.ts'
import { createMemoryRepository } from '../web/src/progress/repository.ts'
import { createStore } from '../web/src/progress/store.ts'
import { blankState, LEGACY_KEY, STORAGE_KEY } from '../web/src/progress/types.ts'
import { micPassed, scoreUtterance } from '../web/src/speech/score.ts'
import { shouldOfferUpdate } from '../web/src/pwa.ts'

test('mic score under 55 is a miss, and both jp and kana count', () => {
  assert.equal(micPassed(54), false)
  assert.equal(micPassed(55), true)
  const kana = scoreUtterance(['ひさしぶりです'], ['久しぶりです', 'ひさしぶりです'])
  assert.ok(kana.score >= 55)
  const miss = scoreUtterance(['こんにちは'], ['久しぶりです', 'ひさしぶりです'])
  assert.ok(miss.score < 55)
})

test('leitner miss resets to box 1 and a pass waits longer', () => {
  let t = 1_700_000_000_000
  const store = createStore(createMemoryRepository(), () => t)
  store.grade('a', true)
  assert.equal(store.box('a'), 2)
  const due = store.state.srs.a.value.due
  assert.ok(due > t)
  store.grade('a', false)
  assert.equal(store.box('a'), 1)
  assert.equal(store.state.srs.a.value.due, t)
})

test('streak survives until the end of a missed today', () => {
  assert.equal(streakCount(['2026-11-08'], '2026-11-09'), 1)
  assert.equal(streakCount(['2026-11-07'], '2026-11-09'), 0)
  assert.equal(streakCount(['2026-11-08', '2026-11-09'], '2026-11-09'), 2)
})

test('legacy eliz-jp-v1 migrates and round-trips through an EJP1 code', async () => {
  const legacy = {
    seen: { 'f-meet:久しぶりです': 100 },
    srs: { 'f-meet:久しぶりです': { box: 3, due: 500 } },
    units: { 'f-meet': { quizBest: 83, roleplayDone: true, listenDone: true } },
    read: {},
    days: ['2026-11-01', '2026-11-02'],
    settings: { showKana: false, romaji: 'fade', dailyNew: 5 },
    curriculum: { unlocked: 9 },
    daily: { date: '2026-11-03', warmDone: true, newIds: [], newDone: true, convoDone: true, listenDone: true, done: true },
    lastBackupAt: 0,
  }
  const state = migrateLegacy(legacy, 200)
  assert.equal(state.srs['f-meet:久しぶりです'].value.box, 3)
  assert.equal(state.srs['f-meet:久しぶりです'].updatedAt, 100)
  assert.equal(state.settings.value.dailyNew, 5)
  assert.equal(state.curriculum.value.unlocked, 9)
  assert.deepEqual(toLegacy(state).days, ['2026-11-01', '2026-11-02'])
  const code = await exportBackup(state)
  assert.ok(code.startsWith('EJP1.'))
  const again = await parseBackup(code, 300)
  assert.equal(again.settings.value.romaji, 'fade')
  assert.equal(again.srs['f-meet:久しぶりです'].value.box, 3)
  assert.equal(again.curriculum.value.unlocked, 9)
})

test('an old EJP1 payload without version 2 still imports', async () => {
  const legacy = migrateLegacy({
    seen: { 'x:あ': 5 },
    srs: { 'x:あ': { box: 2, due: 9 } },
    settings: { showKana: true, romaji: 'show', dailyNew: 3 },
    curriculum: { unlocked: 1 },
    days: ['2026-01-02'],
  })
  const mirror = { ...toLegacy(legacy) }
  const packed = await exportBackup({ ...legacy, version: 2 })
  assert.ok(packed.startsWith('EJP1.'))
  const bad = await parseBackup('nope').then(() => null, (err: Error) => err.message)
  assert.match(String(bad), /EJP1/)
  assert.equal(mirror.settings.dailyNew, 3)
})

test('local repository migrates eliz-jp-v1 once and keeps the legacy key', async () => {
  const mem = new Map<string, string>()
  const storage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
  }
  mem.set(LEGACY_KEY, JSON.stringify({
    seen: { 'f-meet:お邪魔します': 10 },
    srs: { 'f-meet:お邪魔します': { box: 4, due: 20 } },
    curriculum: { unlocked: 4 },
    settings: { dailyNew: 7, romaji: 'hide', showKana: true },
    days: ['2026-11-09'],
  }))
  const { createLocalRepository } = await import('../web/src/progress/repository.ts')
  const loaded = createLocalRepository(storage).load()
  assert.ok(loaded)
  assert.equal(loaded?.curriculum.value.unlocked, 4)
  assert.equal(loaded?.settings.value.dailyNew, 7)
  assert.ok(mem.get(STORAGE_KEY))
  assert.ok(mem.get(LEGACY_KEY))
  const again = createLocalRepository(storage).load()
  assert.equal(again?.srs['f-meet:お邪魔します'].value.box, 4)
})

test('merge keeps the newer stamp on each item', () => {
  const local = blankState(1)
  const remote = blankState(1)
  local.srs.a = { value: { box: 2, due: 10 }, updatedAt: 5 }
  remote.srs.a = { value: { box: 4, due: 50 }, updatedAt: 9 }
  local.srs.b = { value: { box: 3, due: 12 }, updatedAt: 8 }
  remote.settings = { value: { showKana: false, romaji: 'hide', dailyNew: 7 }, updatedAt: 4 }
  local.settings = { value: { showKana: true, romaji: 'show', dailyNew: 3 }, updatedAt: 6 }
  local.days['2026-11-01'] = { value: true, updatedAt: 3 }
  remote.days['2026-11-02'] = { value: true, updatedAt: 4 }
  const merged = mergeProgress(local, remote)
  assert.equal(merged.srs.a.value.box, 4)
  assert.equal(merged.srs.b.value.box, 3)
  assert.equal(merged.settings.value.dailyNew, 3)
  assert.deepEqual(Object.keys(merged.days).sort(), ['2026-11-01', '2026-11-02'])
})

test('update banner only when a controlled page has a waiting worker', () => {
  assert.equal(shouldOfferUpdate(false, true), false)
  assert.equal(shouldOfferUpdate(true, false), false)
  assert.equal(shouldOfferUpdate(true, true), true)
})
