import { useEffect, useRef } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import { theme } from './editor/theme'
import { Stage } from './components/Stage'
import { Controls } from './components/Controls'
import { ExportPanel } from './components/ExportPanel'
import { QualityButton } from './components/QualityButton'
import { Seg } from './components/ui'
import { useAppStore } from './store/useStore'
import type { Lang } from './store/useStore'
import { useT } from './i18n'
import { ensureBundledFont, loadGoogleCatalog, loadManifest } from './services/fonts'

const initialConfig: InitialConfigType = {
  namespace: 'StoryType',
  theme,
  onError(error) {
    console.error(error)
  }
}

export default function App() {
  const captureRef = useRef<HTMLDivElement | null>(null)
  const t = useT()
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)
  const resetStyles = useAppStore((s) => s.resetStyles)
  const setFonts = useAppStore((s) => s.setFonts)
  const setGoogleFonts = useAppStore((s) => s.setGoogleFonts)
  const setFontsReady = useAppStore((s) => s.setFontsReady)
  const markLoaded = useAppStore((s) => s.markLoaded)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        const fonts = await loadManifest()
        if (!alive) return
        setFonts(fonts)
        await Promise.all(
          fonts
            .filter((f) => f.source === 'bundled')
            .map(async (f) => {
              await ensureBundledFont(f)
              markLoaded(f.family)
            })
        )
        if (alive) setFontsReady(true)
      } catch (e) {
        console.error('Failed to load bundled fonts', e)
      }
      const catalog = await loadGoogleCatalog()
      if (alive) setGoogleFonts(catalog)
    })()
    return () => {
      alive = false
    }
  }, [setFonts, setGoogleFonts, setFontsReady, markLoaded])

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <span className="logo" aria-hidden="true">
              S
            </span>
            <div className="brand-text">
              <h1>StoryType</h1>
              <p>{t('app.tagline')}</p>
            </div>
          </div>
          <div className="topbar-actions">
            <QualityButton />
            <button type="button" className="ghost-btn" onClick={resetStyles}>
              {t('reset')}
            </button>
            <Seg<Lang>
              options={[
                { value: 'fa', label: 'فا' },
                { value: 'en', label: 'EN' }
              ]}
              value={lang}
              onChange={setLang}
            />
          </div>
        </header>

        <main className="workspace">
          <Stage captureRef={captureRef} />
          <aside className="panel">
            <div className="panel-scroll">
              <Controls />
              <div className="app-footer">
                <a href="https://pigment.dev" target="_blank" rel="noreferrer">
                  Pigment Development
                </a>
                <span>
                  v{__APP_VERSION__} · build {__BUILD_ID__}
                </span>
              </div>
            </div>
            <ExportPanel captureRef={captureRef} />
          </aside>
        </main>
      </div>
    </LexicalComposer>
  )
}
