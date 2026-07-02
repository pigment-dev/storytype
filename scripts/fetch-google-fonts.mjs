// Refresh the cached Google Fonts catalog used by the font picker.
//
// Usage:
//   GOOGLE_FONTS_API_KEY=xxxx npm run fetch:gfonts
//
// Enable the "Web Fonts Developer API" in Google Cloud and create an API key:
//   https://developers.google.com/fonts/docs/developer_api
// The key is only used at build/refresh time — it never ships in the browser.

import { writeFile } from 'node:fs/promises'

const key = process.env.GOOGLE_FONTS_API_KEY
if (!key) {
  console.error('Missing GOOGLE_FONTS_API_KEY environment variable.')
  process.exit(1)
}

const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=POPULARITY&capability=WOFF2`
const res = await fetch(url)
if (!res.ok) {
  console.error('Google Fonts API error:', res.status, await res.text())
  process.exit(1)
}

const data = await res.json()
const items = (data.items ?? []).map((f) => ({
  family: f.family,
  category: f.category,
  variants: f.variants,
  subsets: f.subsets
}))

const out = { updated: new Date().toISOString(), items }
const dest = new URL('../public/data/google-fonts.json', import.meta.url)
await writeFile(dest, JSON.stringify(out))
console.log(`Wrote ${items.length} font families to public/data/google-fonts.json`)
