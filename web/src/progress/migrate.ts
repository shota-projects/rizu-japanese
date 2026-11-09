import {
  blankState,
  blankUnit,
  DEFAULT_SETTINGS,
  type DailySession,
  type LegacySnapshot,
  type ProgressState,
  type Settings,
  type SrsCard,
  type UnitProgress,
} from './types'

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {}
}

function stampNum(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function normalizeSettings(raw: unknown): Settings {
  const s = asRecord(raw)
  const dailyNew = s.dailyNew === 5 || s.dailyNew === 7 ? s.dailyNew : 3
  const romaji = s.romaji === 'fade' || s.romaji === 'hide' ? s.romaji : 'show'
  return {
    showKana: s.showKana !== false,
    romaji,
    dailyNew,
  }
}

function normalizeDaily(raw: unknown): DailySession | null {
  const d = asRecord(raw)
  if (typeof d.date !== 'string') return null
  const ids = Array.isArray(d.newIds) ? d.newIds.filter((x) => typeof x === 'string') : []
  return {
    date: d.date,
    warmDone: !!d.warmDone,
    newIds: ids as string[],
    newDone: !!d.newDone,
    convoDone: !!d.convoDone,
    listenDone: !!d.listenDone,
    done: !!d.done,
  }
}

function normalizeCard(raw: unknown): SrsCard {
  const c = asRecord(raw)
  const box = c.box === 2 || c.box === 3 || c.box === 4 || c.box === 5 ? c.box : 1
  return { box, due: stampNum(c.due, 0) }
}

function normalizeUnit(raw: unknown): UnitProgress {
  const u = asRecord(raw)
  return {
    quizBest: stampNum(u.quizBest, 0),
    roleplayDone: !!u.roleplayDone,
    listenDone: !!u.listenDone,
  }
}

/** Turn an eliz-jp-v1 (or EJP1) object into the stamped v2 state. */
export function migrateLegacy(data: unknown, now = Date.now()): ProgressState {
  const src = asRecord(data)
  const state = blankState(now)
  const backupAt = stampNum(src.lastBackupAt, 0)
  const seenRaw = asRecord(src.seen)
  for (const [id, ts] of Object.entries(seenRaw)) {
    const t = stampNum(ts, backupAt || now)
    state.seen[id] = { value: t, updatedAt: t }
  }
  const srsRaw = asRecord(src.srs)
  for (const [id, card] of Object.entries(srsRaw)) {
    const t = state.seen[id]?.updatedAt ?? (backupAt || now)
    state.srs[id] = { value: normalizeCard(card), updatedAt: t }
  }
  const unitsRaw = asRecord(src.units)
  for (const [id, unit] of Object.entries(unitsRaw)) {
    state.units[id] = { value: normalizeUnit(unit), updatedAt: backupAt || now }
  }
  const readRaw = asRecord(src.read)
  for (const [id, on] of Object.entries(readRaw)) {
    if (on) state.read[id] = { value: true, updatedAt: backupAt || now }
  }
  if (Array.isArray(src.days)) {
    for (const day of src.days) {
      if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) continue
      const t = Date.parse(`${day}T12:00:00`)
      state.days[day] = { value: true, updatedAt: Number.isFinite(t) ? t : now }
    }
  }
  const settings = normalizeSettings(src.settings ?? DEFAULT_SETTINGS)
  state.settings = { value: settings, updatedAt: backupAt || now }
  const curriculum = asRecord(src.curriculum)
  const unlocked =
    typeof curriculum.unlocked === 'number'
      ? curriculum.unlocked
      : Object.keys(state.seen).length
  state.curriculum = { value: { unlocked: Math.max(0, unlocked) }, updatedAt: backupAt || now }
  state.daily = { value: normalizeDaily(src.daily), updatedAt: backupAt || now }
  state.lastBackupAt = backupAt
  state.updatedAt = now
  return state
}

export function isProgressState(data: unknown): data is ProgressState {
  const s = asRecord(data)
  return s.version === 2 && !!s.settings && !!s.curriculum && typeof s.seen === 'object'
}

/** Fill any holes so a partial saved blob cannot crash the app. */
export function normalizeState(data: unknown, now = Date.now()): ProgressState | null {
  if (!isProgressState(data)) return null
  const base = blankState(now)
  const src = data as ProgressState
  const settings = normalizeSettings(src.settings?.value)
  return {
    ...base,
    ...src,
    version: 2,
    revision: stampNum(src.revision, 0),
    updatedAt: stampNum(src.updatedAt, now),
    seen: src.seen && typeof src.seen === 'object' ? src.seen : {},
    srs: src.srs && typeof src.srs === 'object' ? src.srs : {},
    units: src.units && typeof src.units === 'object' ? src.units : {},
    days: src.days && typeof src.days === 'object' ? src.days : {},
    read: src.read && typeof src.read === 'object' ? src.read : {},
    settings: { value: settings, updatedAt: stampNum(src.settings?.updatedAt, now) },
    curriculum: {
      value: { unlocked: Math.max(0, stampNum(src.curriculum?.value?.unlocked, 0)) },
      updatedAt: stampNum(src.curriculum?.updatedAt, now),
    },
    daily: {
      value: normalizeDaily(src.daily?.value),
      updatedAt: stampNum(src.daily?.updatedAt, now),
    },
    lastBackupAt: stampNum(src.lastBackupAt, 0),
  }
}

export function toLegacy(state: ProgressState): LegacySnapshot {
  const seen: LegacySnapshot['seen'] = {}
  for (const [id, item] of Object.entries(state.seen)) seen[id] = item.value
  const srs: LegacySnapshot['srs'] = {}
  for (const [id, item] of Object.entries(state.srs)) srs[id] = { box: item.value.box, due: item.value.due }
  const units: LegacySnapshot['units'] = {}
  for (const [id, item] of Object.entries(state.units)) units[id] = { ...blankUnit(), ...item.value }
  const read: LegacySnapshot['read'] = {}
  for (const [id, item] of Object.entries(state.read)) if (item.value) read[id] = true
  return {
    seen,
    srs,
    units,
    read,
    days: Object.keys(state.days).sort(),
    settings: state.settings.value,
    curriculum: { unlocked: state.curriculum.value.unlocked },
    daily: state.daily.value,
    lastBackupAt: state.lastBackupAt,
  }
}

export function legacyLooksLikeProgress(data: unknown): boolean {
  const o = asRecord(data)
  return ['seen', 'srs', 'units', 'read', 'days', 'settings', 'curriculum', 'daily'].some((k) => k in o)
}
