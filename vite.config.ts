import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as {
  version: string
}

// Build id = UTC timestamp (YYYYMMDD.HHmm) + short git hash when available.
function buildId(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const stamp = `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}.${p(
    d.getUTCHours()
  )}${p(d.getUTCMinutes())}`
  try {
    const git = execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .toString()
      .trim()
    return git ? `${stamp}+${git}` : stamp
  } catch {
    return stamp
  }
}

// Deployed at https://pigment.dev/storytype (GitHub Pages project path).
// If you deploy at the domain root instead, change `base` to '/'.
export default defineConfig({
  base: '/storytype/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_ID__: JSON.stringify(buildId())
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'favicon.svg'],
      manifest: {
        name: 'StoryType — Persian & English story text',
        short_name: 'StoryType',
        description:
          'Type Persian or English, style it, and export a transparent PNG for your stories.',
        lang: 'en',
        theme_color: '#0e0e12',
        background_color: '#0e0e12',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,json,png,svg}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      }
    })
  ]
})
