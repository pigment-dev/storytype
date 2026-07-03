import { useEffect, useRef } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { theme } from './editor/theme'
import { Stage } from './components/Stage'
import { Controls } from './components/Controls'
import { QualityButton } from './components/QualityButton'
import { AboutButton } from './components/AboutButton'
import { Logo } from './components/Logo'
import { Seg } from './components/ui'
import { ExportProvider } from './components/export/ExportProvider'
import { ExportBar } from './components/export/ExportActions'
import { MobileControls } from './components/MobileControls'
import { UpdatePrompt } from './components/UpdatePrompt'
import { useAppStore } from './store/useStore'
import type { Lang } from './store/useStore'
import { useT } from './i18n'
import { ensureBundledFont, loadGoogleCatalog, loadManifest } from './services/fonts'
import { useIsMobile } from './hooks/useIsMobile'

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
  const isMobile = useIsMobile()

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }, [lang])

  // Any pointer-down outside the text field drops the editor's focus, so tapping
  // a control or dragging a slider never (re)opens the mobile keyboard. The
  // keyboard only appears when the user taps directly into the text.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null
      if (target && target.closest('.editable')) return
      const active = document.activeElement as HTMLElement | null
      if (active && (active.isContentEditable || active.classList.contains('editable'))) {
        active.blur()
      }
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [])

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

  const langSeg = (
    <Seg<Lang>
      options={[
        { value: 'fa', label: 'فا' },
        { value: 'en', label: 'EN' }
      ]}
      value={lang}
      onChange={setLang}
    />
  )

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <Logo />
            <div className="brand-text">
              <h1>StoryType</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <AboutButton />
          </div>
        </header>

        <main className={isMobile ? 'workspace workspace-mobile' : 'workspace'}>
          <ExportProvider captureRef={captureRef}>
            <Stage captureRef={captureRef} />
            {isMobile ? (
              <MobileControls />
            ) : (
              <aside className="panel">
                <div className="panel-toolbar">
                  {langSeg}
                  <span className="spacer" />
                  <QualityButton />
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={resetStyles}
                    title={t('reset')}
                    aria-label={t('reset')}
                  >
                    <ArrowCounterClockwise size={18} />
                  </button>
                </div>
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
                <ExportBar />
              </aside>
            )}
          </ExportProvider>
        </main>
        <UpdatePrompt />
      </div>
    </LexicalComposer>
  )
}
