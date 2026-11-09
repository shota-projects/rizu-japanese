import { streakCount, todayKey } from './clock'
import { blankState, blankUnit, DAY_MS, INTERVAL_DAYS, type DailySession, type ProgressRepository, type ProgressState, type Settings, type SrsCard, type UnitProgress } from './types'
import { exportBackup, parseBackup } from './backup'

export interface ProgressStore {
  readonly state: ProgressState
  load(): void
  touchDay(): void
  streak(): number
  markSeen(id: string): void
  grade(id: string, ok: boolean): void
  box(id: string): number
  dueIds(now?: number): string[]
  unit(id: string): UnitProgress
  setUnit(id: string, patch: Partial<UnitProgress>): void
  setting<K extends keyof Settings>(key: K, value?: Settings[K]): Settings[K]
  ensureDaily(): DailySession
  setDaily(patch: Partial<DailySession>): DailySession
  /** Move the curriculum cursor forward to at least `index` (never backward). */
  setUnlocked(index: number): void
  reset(): void
  markBackup(): void
  needsBackupReminder(days?: number): boolean
  exportBackup(): Promise<string>
  importBackup(code: string): Promise<ProgressState>
  replace(next: ProgressState): void
}

export function createStore(repo: ProgressRepository, now: () => number = Date.now): ProgressStore {
  let state = repo.load() ?? blankState(now())

  const persist = () => {
    state.revision += 1
    state.updatedAt = now()
    repo.save(state)
  }

  const api: ProgressStore = {
    get state() {
      return state
    },
    load() {
      state = repo.load() ?? blankState(now())
    },
    replace(next) {
      state = next
      persist()
    },
    touchDay() {
      const key = todayKey(new Date(now()))
      if (state.days[key]) return
      state.days[key] = { value: true, updatedAt: now() }
      const keys = Object.keys(state.days).sort()
      if (keys.length > 400) {
        for (const old of keys.slice(0, keys.length - 400)) delete state.days[old]
      }
      persist()
    },
    streak() {
      return streakCount(Object.keys(state.days), todayKey(new Date(now())))
    },
    markSeen(id) {
      api.touchDay()
      let changed = false
      if (!state.seen[id]) {
        const t = now()
        state.seen[id] = { value: t, updatedAt: t }
        changed = true
      }
      if (!state.srs[id]) {
        const t = now()
        state.srs[id] = { value: { box: 1, due: t }, updatedAt: t }
        changed = true
      }
      if (changed) persist()
    },
    grade(id, ok) {
      api.touchDay()
      const cur: SrsCard = state.srs[id]?.value ?? { box: 1, due: 0 }
      const box = (ok ? Math.min(5, cur.box + 1) : 1) as SrsCard['box']
      const t = now()
      state.srs[id] = { value: { box, due: t + INTERVAL_DAYS[box] * DAY_MS }, updatedAt: t }
      if (!state.seen[id]) state.seen[id] = { value: t, updatedAt: t }
      persist()
    },
    box(id) {
      return state.srs[id]?.value.box ?? 0
    },
    dueIds(at = now()) {
      return Object.keys(state.srs)
        .filter((id) => state.srs[id].value.due <= at)
        .sort((a, b) => state.srs[a].value.box - state.srs[b].value.box || state.srs[a].value.due - state.srs[b].value.due)
    },
    unit(id) {
      return state.units[id]?.value ?? blankUnit()
    },
    setUnit(id, patch) {
      api.touchDay()
      const prev = state.units[id]?.value ?? blankUnit()
      state.units[id] = { value: { ...prev, ...patch }, updatedAt: now() }
      persist()
    },
    setting(key, value) {
      if (value === undefined) return state.settings.value[key]
      state.settings = {
        value: { ...state.settings.value, [key]: value },
        updatedAt: now(),
      }
      persist()
      return value
    },
    ensureDaily() {
      const key = todayKey(new Date(now()))
      const cur = state.daily.value
      if (cur && cur.date === key) return cur
      const fresh: DailySession = {
        date: key,
        warmDone: false,
        newIds: [],
        newDone: false,
        convoDone: false,
        listenDone: false,
        done: false,
      }
      state.daily = { value: fresh, updatedAt: now() }
      persist()
      return fresh
    },
    setDaily(patch) {
      const cur = api.ensureDaily()
      const next = { ...cur, ...patch, date: cur.date }
      state.daily = { value: next, updatedAt: now() }
      persist()
      return next
    },
    setUnlocked(index) {
      const cur = state.curriculum.value.unlocked
      const next = Math.max(cur, Math.max(0, index))
      if (next === cur) return
      state.curriculum = { value: { unlocked: next }, updatedAt: now() }
      persist()
    },
    reset() {
      const settings = state.settings
      state = blankState(now())
      state.settings = settings
      persist()
    },
    markBackup() {
      state.lastBackupAt = now()
      persist()
    },
    needsBackupReminder(days = 7) {
      if (!state.lastBackupAt) return Object.keys(state.seen).length > 0
      return now() - state.lastBackupAt >= days * DAY_MS
    },
    exportBackup() {
      return exportBackup(state)
    },
    async importBackup(code: string) {
      const next = await parseBackup(code, now())
      next.lastBackupAt = now()
      state = next
      persist()
      return state
    },
  }

  return api
}
