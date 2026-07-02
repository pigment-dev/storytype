<div align="center">

# StoryType

**Type Persian or English, style it, and export a transparent PNG for your Instagram stories.**

Free & open-source · runs entirely in your browser · by [Pigment Development](https://pigment.dev)

</div>

---

StoryType is a free, web-based alternative to apps like "Story Font". Write Persian
(Farsi/RTL) or English text, style it like a word processor — **select a word and
change its font, weight, colour, outline or shadow** — then export a **tightly
cropped, transparent-background PNG** you can drop straight onto an Instagram story.

Everything runs client-side. There is no server, no account, and nothing is uploaded.

## Features

- ✍️ **Rich per-selection styling** — highlight any part of the text and change font,
  size, weight, italic, underline/strike, colour, outline and shadow for just that
  selection (powered by [Lexical](https://github.com/facebook/lexical)).
- 🇮🇷 **First-class Persian/Arabic** — correct letter joining, RTL and bidi handled by
  the browser's own text engine; mixed Persian + English "just works".
- 🎨 **Effects** — text colour, gradient fill, outline/thickness (`paint-order` stroke),
  text-shadow, whole-text drop-shadow, and a background box (colour, padding, radius,
  border).
- 🖼️ **Transparent PNG export** — tight-cropped (alpha-trimmed), high-DPI (2×/3×/4×),
  rasterized with [snapdom](https://github.com/zumerlab/snapdom) (falls back to
  html-to-image, then a manual canvas).
- 📱 **iOS-aware delivery** — **Share → “Save Image”** to Photos, long-press-to-save on
  the preview, and copy-to-clipboard (using Safari's synchronous-`Promise` pattern).
- 🔤 **13 bundled open-source fonts** (all SIL OFL) + an optional **Google Fonts** toggle.
- ➕ **Add your own fonts** by dropping a `.woff2` and adding one line to a JSON manifest.
- 📦 **Installable PWA** — works offline once loaded.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173/storytype/
npm run build      # -> dist/
npm run preview    # serve the production build locally
```

> The app is served under the `/storytype/` base path (see `vite.config.ts`). If you
> deploy at a domain root instead, change `base` to `'/'`.

## Add your own font

### A bundled (self-hosted, export-safe) font

1. Drop the `.woff2` file(s) into `public/fonts/<your-font>/`.
2. Add an entry to [`public/fonts/fonts.json`](public/fonts/fonts.json):

```json
{
  "id": "my-font",
  "family": "My Font",
  "displayName": { "en": "My Font", "fa": "فونت من" },
  "category": "display",
  "languages": ["fa", "en"],
  "subsets": ["arabic", "latin"],
  "direction": "both",
  "source": "bundled",
  "license": { "id": "OFL-1.1", "name": "SIL Open Font License 1.1", "url": "…" },
  "credit": "Author name",
  "preview": "سلام Aa",
  "files": [
    { "weight": 400, "style": "normal", "format": "woff2", "src": "fonts/my-font/regular.woff2", "subset": "arabic" },
    { "weight": 400, "style": "normal", "format": "woff2", "src": "fonts/my-font/latin.woff2", "subset": "latin" }
  ]
}
```

The `subset` field (`arabic` | `latin`) auto-applies the right `unicode-range` so a
font's Persian and Latin files merge for mixed text. Missing glyphs fall back to
Vazirmatn automatically.

> ⚠️ **Only bundle fonts you have the right to redistribute** (SIL OFL or similar).
> Never ship commercial Persian fonts (IRANYekan, IRANSans, Dana, Kalameh, Yekan Bakh,
> Morvarich…). See [`licenses/CREDITS.md`](licenses/CREDITS.md).

### Google Fonts

Flip the **Google Fonts** switch in the font picker. A curated catalog ships in
`public/data/google-fonts.json`. To use the **full** catalog, refresh it (a Google
Cloud "Web Fonts Developer API" key is only used at build time, never in the browser):

```bash
GOOGLE_FONTS_API_KEY=xxxx npm run fetch:gfonts
```

Google-served fonts render fine but may not embed perfectly on export — **bundled fonts
are export-safe**.

## Deploy to GitHub Pages / pigment.dev/storytype

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to
`main` (enable Pages → “GitHub Actions” in repo settings).

To serve at **pigment.dev/storytype**: host the org site at `pigment.dev` and add this
as a project repo named `storytype` — GitHub then serves it at `pigment.dev/storytype`,
matching the Vite `base`.

## Tech

Vite · React · TypeScript · Zustand · Lexical · snapdom / html-to-image · vite-plugin-pwa.

## Licence

App code: **MIT** (see [`LICENSE`](LICENSE)). Bundled fonts: **SIL OFL 1.1** — see
[`licenses/CREDITS.md`](licenses/CREDITS.md).
