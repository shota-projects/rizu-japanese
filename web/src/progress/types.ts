/** Local progress shape. Every learnable item carries updatedAt so a future sync layer can merge without a rewrite. */

export const STORAGE_KEY = 'rizu-jp-v2'
export const LEGACY_KEY = 'eliz-jp-v1'
export const PASS_SCORE = 55
export const DAY_MS = 86_400_000

/** Leitner box → days until the card is due again. Box 1 is due immediately. */
export const INTERVAL_DAYS: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 16,
}

export interface Stamped<T> {
  value: T
  updatedAt: number
}

export interface SrsCard {
  box: 1 | 2 | 3 | 4 | 5
  due: number
}

export interface UnitProgress {
  quizBest: number
  roleplayDone: boolean
  listenDone: boolean
}

export interface Settings {
  showKana: boolean
  romaji: 'show' | 'fade' | 'hide'
  dailyNew: 3 | 5 | 7
}

export interface DailySession {
  date: string
  warmDone: boolean
  newIds: string[]
  newDone: boolean
  convoDone: boolean
  listenDone: boolean
  done: boolean
}

export interface ProgressState {
  version: 2
  /** Bumped on every local write. Handy for a future sync cursor. */
  revision: number
  updatedAt: number
  seen: Record<string, Stamped<number>>
  srs: Record<string, Stamped<SrsCard>>
  units: Record<string, Stamped<UnitProgress>>
  /** Practice days, keyed by YYYY-MM-DD. */
  days: Record<string, Stamped<true>>
  read: Record<string, Stamped<true>>
  settings: Stamped<Settings>
  curriculum: Stamped<{ unlocked: number }>
  daily: Stamped<DailySession | null>
  lastBackupAt: number
}

/** What the UI and a future sync client call. Implementations stay local for now. */
export interface ProgressRepository {
  load(): ProgressState | null
  save(state: ProgressState): void
}

export interface LegacySnapshot {
  seen: Record<string, number>
  srs: Record<string, { box: number; due: number }>
  units: Record<string, UnitProgress>
  read: Record<string, boolean>
  days: string[]
  settings: Settings
  curriculum: { unlocked: number }
  daily: DailySession | null
  lastBackupAt: number
}

export const DEFAULT_SETTINGS: Settings = { showKana: true, romaji: 'show', dailyNew: 3 }

export function blankUnit(): UnitProgress {
  return { quizBest: 0, roleplayDone: false, listenDone: false }
}

export function blankState(now = Date.now()): ProgressState {
  return {
    version: 2,
    revision: 0,
    updatedAt: now,
    seen: {},
    srs: {},
    units: {},
    days: {},
    read: {},
    settings: { value: { ...DEFAULT_SETTINGS }, updatedAt: now },
    curriculum: { value: { unlocked: 0 }, updatedAt: now },
    daily: { value: null, updatedAt: now },
    lastBackupAt: 0,
  }
}
