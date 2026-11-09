export interface AudioEntry {
  src: string
  voice: string
  gender?: string
  hash?: string
  spoken?: string
}

export interface AudioManifest {
  version?: number
  count?: number
  voices?: Record<string, string>
  byText: Record<string, AudioEntry>
}
