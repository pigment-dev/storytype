// Shared types for StoryType.

export type FontCategory =
  | 'sans-serif'
  | 'serif'
  | 'display'
  | 'handwriting'
  | 'monospace'
  | 'nastaliq'

export interface FontFileEntry {
  weight: number
  style: 'normal' | 'italic'
  format: 'woff2' | 'woff' | 'ttf'
  /** Path relative to the app base (e.g. "fonts/vazirmatn/Regular.woff2") or an absolute URL. */
  src: string
  /** Named subset — the loader maps this to a standard unicode-range (merges Persian + Latin). */
  subset?: 'arabic' | 'latin'
  /** Explicit CSS unicode-range; overrides `subset` if both are present. */
  unicodeRange?: string
}

export interface FontAxis {
  tag: string
  min: number
  max: number
  default: number
}

export interface FontEntry {
  id: string
  family: string
  displayName: { en: string; fa?: string }
  category: FontCategory
  languages: string[]
  subsets: string[]
  direction: 'rtl' | 'ltr' | 'both'
  source: 'bundled' | 'google' | 'url'
  license?: { id: string; name: string; url?: string }
  credit?: string
  preview?: string
  variable?: boolean
  axes?: FontAxis[]
  files: FontFileEntry[]
}

export interface FontManifest {
  version: number
  fonts: FontEntry[]
}

/** Trimmed-down Google Fonts catalog entry (a subset of the Developer API response we cache). */
export interface GoogleFontMeta {
  family: string
  category: string
  variants: string[]
  subsets: string[]
}

export interface GoogleFontsCatalog {
  updated?: string
  items: GoogleFontMeta[]
}
