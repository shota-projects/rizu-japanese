export interface Line {
  jp: string
  kana?: string
  romaji?: string
  en: string
  note?: string
  grammar?: string
  fast?: boolean
  name?: string
  /** Who says this line: Rizu, Mom, or Dad. */
  speaker?: string
}

export interface Choice extends Line {
  jp: string
}

export interface RoleLine {
  speaker: 'them' | 'you'
  name?: string
  jp?: string
  kana?: string
  romaji?: string
  en?: string
  note?: string
  fast?: boolean
  prompt?: string
  options?: Choice[]
}

export interface ListenItem extends Line {
  meanings: string[]
  reply: { prompt: string; options: Choice[] }
  speaker?: string
}

export interface Phrase extends Line {
  jp: string
  romaji: string
}

export interface Unit {
  id: string
  track: string
  title: string
  jpTitle: string
  summary: string
  phrases: Phrase[]
  roleplay: { title: string; setting: string; lines: RoleLine[] }
  listening: ListenItem[]
}

export interface Track {
  id: string
  title: string
  jpTitle: string
  blurb: string
}

export interface IndexedPhrase {
  id: string
  phrase: Phrase
  unit: Unit
}

export interface Course {
  tracks: Track[]
  units: Unit[]
  byId: Map<string, IndexedPhrase>
}

export function phraseId(unitId: string, jp: string): string {
  return `${unitId}:${jp}`
}

export function indexCourse(raw: { tracks: Track[]; units: Unit[] }): Course {
  const byId = new Map<string, IndexedPhrase>()
  for (const unit of raw.units) {
    for (const phrase of unit.phrases) {
      const id = phraseId(unit.id, phrase.jp)
      byId.set(id, { id, phrase, unit })
    }
  }
  return { tracks: raw.tracks, units: raw.units, byId }
}

export async function loadCourse(): Promise<Course> {
  const res = await fetch(new URL('data/speak.json', document.baseURI))
  if (!res.ok) throw new Error('Could not load lessons')
  return indexCourse(await res.json())
}

export function unitsOf(course: Course, trackId: string): Unit[] {
  return course.units.filter((u) => u.track === trackId)
}

/**
 * Daily teaching order. Family greetings stay first. Trains and asking for help
 * come next, before cafés, shops, and the later family topics.
 * Phrase ids are still unitId:jp, so a reorder does not touch saved Leitner cards.
 */
export const DAILY_UNIT_IDS = [
  'f-meet',
  'g-trains',
  'g-help',
  'f-holiday',
  'f-family',
  'g-food',
  'f-home',
  'g-shopping',
  'f-dinner',
  'g-konbini',
  'f-chat',
  'f-gifts',
  'f-calls',
] as const

export function dailyUnits(course: Course): Unit[] {
  const byId = new Map(course.units.map((u) => [u.id, u]))
  const ordered: Unit[] = []
  for (const id of DAILY_UNIT_IDS) {
    const unit = byId.get(id)
    if (unit) ordered.push(unit)
  }
  for (const unit of course.units) {
    if (!ordered.includes(unit)) ordered.push(unit)
  }
  return ordered
}

/** Phrases in daily order. */
export function curriculumPath(course: Course): IndexedPhrase[] {
  const path: IndexedPhrase[] = []
  for (const unit of dailyUnits(course)) {
    for (const phrase of unit.phrases) {
      const id = phraseId(unit.id, phrase.jp)
      const indexed = course.byId.get(id)
      if (indexed) path.push(indexed)
    }
  }
  return path
}

/** Next phrases she has not already learned. Ignores the stored cursor so a reorder cannot skip new early units or replay finished ones. */
export function nextUnseen(path: IndexedPhrase[], seen: Record<string, unknown>, count: number): IndexedPhrase[] {
  return path.filter((p) => !seen[p.id]).slice(0, count)
}
