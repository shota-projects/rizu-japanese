import { LEGACY_KEY, STORAGE_KEY, type ProgressRepository, type ProgressState } from './types'
import { migrateLegacy, normalizeState } from './migrate'

interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/**
 * Local-only persistence. A sync layer can wrap this later:
 * load the local snapshot, mergeProgress with the remote one, then save.
 * This module never opens a network connection.
 */
export function createLocalRepository(storage: KeyValueStore): ProgressRepository {
  return {
    load() {
      try {
        const raw = storage.getItem(STORAGE_KEY)
        if (raw) {
          const normalized = normalizeState(JSON.parse(raw))
          if (normalized) return normalized
        }
      } catch {
        /* try the legacy key */
      }
      try {
        const legacy = storage.getItem(LEGACY_KEY)
        if (!legacy) return null
        const state = migrateLegacy(JSON.parse(legacy))
        storage.setItem(STORAGE_KEY, JSON.stringify(state))
        return state
      } catch {
        return null
      }
    },
    save(state: ProgressState) {
      storage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
  }
}

export function createMemoryRepository(initial: ProgressState | null = null): ProgressRepository & { snapshot(): ProgressState | null } {
  let current = initial ? structuredClone(initial) : null
  return {
    load: () => (current ? structuredClone(current) : null),
    save: (state) => {
      current = structuredClone(state)
    },
    snapshot: () => (current ? structuredClone(current) : null),
  }
}
