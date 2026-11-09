export interface Line {
  jp: string
  kana?: string
  romaji?: string
  en: string
  note?: string
  grammar?: string
  fast?: boolean
  name?: string
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

/** Family and getting-around units interleaved, then each unit’s phrases in order. */
export function curriculumPath(course: Course): IndexedPhrase[] {
  const fam = unitsOf(course, 'family')
  const around = unitsOf(course, 'around')
  const order: Unit[] = []
  const n = Math.max(fam.length, around.length)
  for (let i = 0; i < n; i++) {
    if (fam[i]) order.push(fam[i])
    if (around[i]) order.push(around[i])
  }
  const path: IndexedPhrase[] = []
  for (const unit of order) {
    for (const phrase of unit.phrases) {
      const id = phraseId(unit.id, phrase.jp)
      const indexed = course.byId.get(id)
      if (indexed) path.push(indexed)
    }
  }
  return path
}
