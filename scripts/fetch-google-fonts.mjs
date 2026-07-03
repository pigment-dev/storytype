// Refresh the cached Google Fonts catalog used by the font picker.
//
// Usage:
//   npm run fetch:gfonts
//
// Uses Google Fonts' public, keyless metadata endpoint, which lists EVERY
// family on fonts.google.com (~1900+) with its category and script subsets.
// The result is written to public/data/google-fonts.json and shipped as a
// static asset, so the browser never calls Google's API at runtime.
//
// (The old key-based Web Fonts Developer API is no longer required.)

import { writeFile } from 'node:fs/promises'

const ENDPOINT = 'https://fonts.google.com/metadata/fonts'

const res = await fetch(ENDPOINT)
if (!res.ok) {
  console.error('Google Fonts metadata error:', res.status, await res.text())
  process.exit(1)
}

// The endpoint prefixes its JSON with an anti-JSON-hijacking guard: )]}'
const text = (await res.text()).replace(/^\)\]\}'?\r?\n?/, '')
const data = JSON.parse(text)
const families = data.familyMetadataList ?? []

const CATEGORY = {
  'Sans Serif': 'sans-serif',
  Serif: 'serif',
  Display: 'display',
  Handwriting: 'handwriting',
  Monospace: 'monospace'
}

const items = families
  .map((f) => ({
    family: f.family,
    category: CATEGORY[f.category] ?? 'sans-serif',
    // fonts is keyed by weight ("400", "700", "400i" for italics)
    variants: Object.keys(f.fonts ?? { 400: 1 }).map((k) =>
      k.endsWith('i') ? `${k.slice(0, -1)}italic` : k
    ),
    // "menu" is Google's tiny name-preview subset, not a real script — drop it
    subsets: (f.subsets ?? []).filter((s) => s !== 'menu')
  }))
  .filter((f) => f.subsets.length > 0)

const out = { updated: new Date().toISOString(), items }
const dest = new URL('../public/data/google-fonts.json', import.meta.url)
await writeFile(dest, JSON.stringify(out))

const arabic = items.filter((i) => i.subsets.includes('arabic')).length
const latin = items.filter((i) => i.subsets.includes('latin')).length
console.log(
  `Wrote ${items.length} families to public/data/google-fonts.json ` +
    `(${arabic} Arabic/Persian, ${latin} Latin).`
)
