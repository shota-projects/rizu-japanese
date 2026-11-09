import { legacyLooksLikeProgress, migrateLegacy, normalizeState, toLegacy } from './migrate'
import type { ProgressState } from './types'

export const BACKUP_PREFIX = 'EJP1.'

const enc = new TextEncoder()
const dec = new TextDecoder()

function bytesToB64Url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deflateOrRaw(utf8: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === 'function') {
    try {
      const cs = new CompressionStream('deflate')
      const stream = new Blob([utf8 as unknown as BlobPart]).stream().pipeThrough(cs)
      const compressed = new Uint8Array(await new Response(stream).arrayBuffer())
      const out = new Uint8Array(1 + compressed.length)
      out[0] = 1
      out.set(compressed, 1)
      return out
    } catch {
      /* fall through */
    }
  }
  const out = new Uint8Array(1 + utf8.length)
  out[0] = 0
  out.set(utf8, 1)
  return out
}

async function inflateOrRaw(bytes: Uint8Array): Promise<Uint8Array> {
  if (!bytes.length) throw new Error('empty')
  const flag = bytes[0]
  const body = bytes.subarray(1)
  if (flag === 0) return body
  if (flag === 1) {
    if (typeof DecompressionStream !== 'function') throw new Error('This browser can’t read compressed backups')
    const ds = new DecompressionStream('deflate')
    const stream = new Blob([body as unknown as BlobPart]).stream().pipeThrough(ds)
    return new Uint8Array(await new Response(stream).arrayBuffer())
  }
  throw new Error('Unknown backup format')
}

export async function exportBackup(state: ProgressState): Promise<string> {
  const payload = { version: 2 as const, state, ...toLegacy(state) }
  const packed = await deflateOrRaw(enc.encode(JSON.stringify(payload)))
  return BACKUP_PREFIX + bytesToB64Url(packed)
}

export async function parseBackup(code: string, now = Date.now()): Promise<ProgressState> {
  const cleaned = String(code || '').trim().replace(/\s+/g, '')
  if (!cleaned.startsWith(BACKUP_PREFIX)) {
    throw new Error('That doesn’t look like a backup code. It should start with EJP1.')
  }
  let jsonBytes: Uint8Array
  try {
    jsonBytes = await inflateOrRaw(b64UrlToBytes(cleaned.slice(BACKUP_PREFIX.length)))
  } catch {
    throw new Error('Couldn’t read that code. Double-check you copied the whole thing.')
  }
  let data: unknown
  try {
    data = JSON.parse(dec.decode(jsonBytes))
  } catch {
    throw new Error('That code isn’t valid. Try copying it again.')
  }
  const record = data && typeof data === 'object' ? (data as { version?: number; state?: unknown }) : null
  if (record?.version === 2 && record.state) {
    const normalized = normalizeState(record.state, now)
    if (normalized) return normalized
  }
  if (!legacyLooksLikeProgress(data)) {
    throw new Error('That code doesn’t have progress data in it.')
  }
  return migrateLegacy(data, now)
}
