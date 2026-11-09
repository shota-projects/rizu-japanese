import type { ProgressState, Stamped } from './types'
import { normalizeState } from './migrate'

function later<T>(a: Stamped<T> | undefined, b: Stamped<T> | undefined): Stamped<T> | undefined {
  if (!a) return b
  if (!b) return a
  return b.updatedAt > a.updatedAt ? b : a
}

function mergeMap<T>(a: Record<string, Stamped<T>>, b: Record<string, Stamped<T>>): Record<string, Stamped<T>> {
  const out: Record<string, Stamped<T>> = { ...a }
  for (const [id, item] of Object.entries(b)) {
    const picked = later(out[id], item)
    if (picked) out[id] = picked
  }
  return out
}

/**
 * Last-write-wins per item. A future sync layer can pull a remote snapshot,
 * call this, and save the result. Local wins ties so an in-progress tap is not lost.
 */
export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  const a = normalizeState(local) ?? local
  const b = normalizeState(remote) ?? remote
  const settings = (b.settings.updatedAt > a.settings.updatedAt ? b.settings : a.settings)
  const curriculum = (b.curriculum.updatedAt > a.curriculum.updatedAt ? b.curriculum : a.curriculum)
  const daily = (b.daily.updatedAt > a.daily.updatedAt ? b.daily : a.daily)
  return {
    version: 2,
    revision: Math.max(a.revision, b.revision),
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
    seen: mergeMap(a.seen, b.seen),
    srs: mergeMap(a.srs, b.srs),
    units: mergeMap(a.units, b.units),
    days: mergeMap(a.days, b.days),
    read: mergeMap(a.read, b.read),
    settings,
    curriculum,
    daily,
    lastBackupAt: Math.max(a.lastBackupAt, b.lastBackupAt),
  }
}
