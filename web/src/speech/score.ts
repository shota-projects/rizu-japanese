/** Speech-score helpers. Pure functions so warm-up grading can be tested without a microphone. */

export const PASS_SCORE = 55

const toHira = (s: string) =>
  s.replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))

export function norm(s: string): string {
  return toHira((s || '').normalize('NFKC').toLowerCase()).replace(/[\s、。！？!?,.・「」『』（）()〜~ー-]/g, '')
}

function lev(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[n]
}

export function similarity(a: string, b: string): number {
  a = norm(a)
  b = norm(b)
  if (!a || !b) return 0
  return 1 - lev(a, b) / Math.max(a.length, b.length)
}

export function scoreUtterance(heard: string[], targets: string[]): { score: number; heard: string } {
  let best = 0
  let bestHeard = heard[0] || ''
  for (const h of heard) {
    for (const t of targets) {
      let s = similarity(h, t)
      if (norm(h).includes(norm(t)) && norm(t).length >= 2) s = Math.max(s, 0.95)
      if (s > best) {
        best = s
        bestHeard = h
      }
    }
  }
  return { score: Math.round(best * 100), heard: bestHeard }
}

/** A mic score under 55 is a miss. She can still self-rate when there is no score. */
export function micPassed(score: number): boolean {
  return score >= PASS_SCORE
}
