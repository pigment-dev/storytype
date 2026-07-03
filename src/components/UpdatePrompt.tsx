import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

// How often to poll for a new deployed version while the tab stays open.
const UPDATE_CHECK_INTERVAL_MS = 60_000

type Lang = 'fa' | 'en'

function readLang(): Lang {
  try {
    const raw = localStorage.getItem('storytype:settings')
    if (!raw) return 'en'
    const parsed = JSON.parse(raw) as { state?: { lang?: string } }
    return parsed?.state?.lang === 'fa' ? 'fa' : 'en'
  } catch {
    return 'en'
  }
}

const COPY: Record<Lang, { title: string; button: string }> = {
  fa: { title: 'نسخهٔ جدید در دسترس است', button: 'بارگذاری مجدد' },
  en: { title: 'A new version is available', button: 'Reload' }
}

export function UpdatePrompt() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(_swUrl, r) {
      // periodically check for a new deploy WHILE the app is running
      if (r) {
        registrationRef.current = r
        setInterval(() => {
          r.update()
        }, UPDATE_CHECK_INTERVAL_MS)
      }
    },
    onRegisterError(e) {
      console.error('SW registration error', e)
    }
  })

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        registrationRef.current?.update()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  if (!needRefresh) return null

  const lang = readLang()
  const copy = COPY[lang]

  const pillStyle: CSSProperties = {
    position: 'fixed',
    left: '50%',
    bottom: 'calc(env(safe-area-inset-bottom) + 76px)',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#1c1c26',
    border: '1px solid #2a2a37',
    borderRadius: 999,
    padding: '10px 14px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 1.3,
    maxWidth: 'calc(100vw - 24px)',
    animation: 'storytype-update-prompt-fade-in 0.2s ease-out'
  }

  const buttonStyle: CSSProperties = {
    flexShrink: 0,
    background: 'linear-gradient(135deg, #7c8cff, #5f6dff)',
    color: '#ffffff',
    border: 'none',
    borderRadius: 999,
    padding: '8px 14px',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer'
  }

  const dismissStyle: CSSProperties = {
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    color: '#9a9aa8',
    fontSize: 16,
    lineHeight: 1,
    cursor: 'pointer',
    padding: '2px 4px'
  }

  return (
    <div style={pillStyle} role="status" data-storytype-update-prompt>
      <style>
        {`@media (prefers-reduced-motion: reduce) {
          [data-storytype-update-prompt] { animation: none !important; }
        }
        @keyframes storytype-update-prompt-fade-in {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }`}
      </style>
      <span style={{ whiteSpace: 'nowrap' }}>{copy.title}</span>
      <button type="button" style={buttonStyle} onClick={() => updateServiceWorker(true)}>
        {copy.button}
      </button>
      <button
        type="button"
        style={dismissStyle}
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export default UpdatePrompt
