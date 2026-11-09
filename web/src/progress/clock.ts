export function todayKey(d = new Date()): string {
  const z = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}

export function shiftDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, (m || 1) - 1, d || 1)
  dt.setDate(dt.getDate() + delta)
  return todayKey(dt)
}

/** Streak counts back from today, and still counts yesterday if she has not practiced yet today. */
export function streakCount(days: Iterable<string>, today = todayKey()): number {
  const set = new Set(days)
  let cursor = today
  if (!set.has(cursor)) cursor = shiftDays(cursor, -1)
  let n = 0
  while (set.has(cursor)) {
    n++
    cursor = shiftDays(cursor, -1)
  }
  return n
}
