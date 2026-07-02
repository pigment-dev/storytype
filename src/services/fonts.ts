// Font loading: bundled manifest + Google Fonts catalog + runtime registration.
//
// Golden rules from research:
//  - Declare fonts as real CSS @font-face rules (same-origin) so the rasterizer
//    can embed them; also force-load + await document.fonts.ready before render.
//  - Google-served fonts are cross-origin: they display fine but may not embed
//    cleanly on export (we surface that caveat in the UI).

import type {
  FontEntry,
  FontFileEntry,
  FontManifest,
  GoogleFontMeta,
  GoogleFontsCatalog
} from '../types'

const BASE = import.meta.env.BASE_URL // e.g. "/storytype/"

export async function loadManifest(): Promise<FontEntry[]> {
  const res = await fetch(`${BASE}fonts/fonts.json`)
  if (!res.ok) throw new Error(`fonts.json not found (${res.status})`)
  const data = (await res.json()) as FontManifest
  return data.fonts ?? []
}

export async function loadGoogleCatalog(): Promise<GoogleFontMeta[]> {
  try {
    const res = await fetch(`${BASE}data/google-fonts.json`)
    if (!res.ok) return []
    const data = (await res.json()) as GoogleFontsCatalog
    return data.items ?? []
  } catch {
    return []
  }
}

function formatKeyword(f: FontFileEntry['format']): string {
  return f === 'ttf' ? 'truetype' : f === 'woff' ? 'woff' : 'woff2'
}

// Standard unicode-ranges (matching Google Fonts' subset boundaries) so a
// family's Persian and Latin files can coexist and merge for mixed text.
const SUBSET_RANGE: Record<string, string> = {
  arabic:
    'U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200E,U+2010-2011,U+FB50-FDFF,U+FE70-FEFF',
  latin:
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2212,U+2215,U+FEFF,U+FFFD'
}

function rangeFor(f: FontFileEntry): string {
  const r = f.unicodeRange ?? (f.subset ? SUBSET_RANGE[f.subset] : '')
  return r ? `unicode-range:${r};` : ''
}

function faceWeight(font: FontEntry, file: FontFileEntry): string {
  const wght = font.axes?.find((a) => a.tag === 'wght')
  return font.variable && wght ? `${wght.min} ${wght.max}` : String(file.weight)
}

const injected = new Set<string>()

function injectFaceCss(family: string, css: string) {
  const el = document.createElement('style')
  el.setAttribute('data-font', family)
  el.textContent = css
  document.head.appendChild(el)
}

/** Register a bundled/url font via @font-face and force-load it. Idempotent. */
export async function ensureBundledFont(font: FontEntry): Promise<void> {
  if (!injected.has(font.family)) {
    const css = font.files
      .map((f) => {
        const url = /^https?:/.test(f.src) ? f.src : `${BASE}${f.src}`
        const range = rangeFor(f)
        return `@font-face{font-family:'${font.family}';src:url('${url}') format('${formatKeyword(
          f.format
        )}');font-weight:${faceWeight(font, f)};font-style:${f.style};font-display:swap;${range}}`
      })
      .join('\n')
    injectFaceCss(font.family, css)
    injected.add(font.family)
  }
  await Promise.all(
    font.files.map((f) =>
      document.fonts.load(
        `${f.style === 'italic' ? 'italic ' : ''}${f.weight} 48px '${font.family}'`
      )
    )
  ).catch(() => {})
  await document.fonts.ready
}

/** Load a Google font family at runtime via the keyless css2 endpoint. */
export async function ensureGoogleFont(
  family: string,
  weights: number[] = [400, 700]
): Promise<void> {
  const id = 'gf-' + family.replace(/\s+/g, '-')
  if (!document.getElementById(id)) {
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
      /\s+/g,
      '+'
    )}:wght@${weights.join(';')}&display=swap`
    document.head.appendChild(link)
  }
  await Promise.all(
    weights.map((w) => document.fonts.load(`${w} 48px '${family}'`))
  ).catch(() => {})
  await document.fonts.ready
}
