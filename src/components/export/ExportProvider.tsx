import { createContext, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'
import { canvasToBlob, exportPng, renderToCanvas, trimTransparent } from '../../services/export'
import { copyImage, downloadImage, isIOS, shareImage } from '../../services/share'
import { useT } from '../../i18n'
import { useAppStore } from '../../store/useStore'
import { blurActiveEditable } from '../../utils/dom'

// Read the export scale lazily at call time so it always reflects the latest store value.
function getScale(): number {
  return useAppStore.getState().export.scale
}

interface Preview {
  url: string
  width: number
  height: number
}

interface ExportApi {
  busy: boolean
  ios: boolean
  onCopy: () => void
  onSave: () => void
}

const ExportCtx = createContext<ExportApi | null>(null)

export function useExport(): ExportApi {
  const ctx = useContext(ExportCtx)
  if (!ctx) throw new Error('useExport must be used inside <ExportProvider>')
  return ctx
}

/** Owns export state (busy/toast/preview) and the shared overlay, so Copy/Save
 * can be triggered from anywhere (desktop bar, mobile fabs, dock) and share one
 * toast + one preview dialog. */
export function ExportProvider({
  captureRef,
  children
}: {
  captureRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}) {
  const t = useT()
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)
  const lastUrl = useRef<string | null>(null)
  const ios = isIOS()

  function flash(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2600)
  }
  function showPreview(url: string, width: number, height: number) {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current)
    lastUrl.current = url
    setPreview({ url, width, height })
  }
  function dismissPreview() {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current)
    lastUrl.current = null
    setPreview(null)
  }

  async function onSave() {
    const node = captureRef.current
    if (!node || busy) return
    setBusy(true)
    try {
      blurActiveEditable()
      const { blob, url, width, height } = await exportPng(node, { scale: getScale() })
      showPreview(url, width, height)
      if (ios) {
        const shared = await shareImage(blob)
        if (!shared) {
          downloadImage(blob)
          flash(t('export.downloaded'))
        }
      } else {
        downloadImage(blob)
        flash(t('export.downloaded'))
      }
    } catch (err) {
      console.error(err)
      flash(t('export.failed'))
    } finally {
      setBusy(false)
    }
  }

  // Copy must build the ClipboardItem synchronously inside the gesture (Safari).
  function onCopy() {
    const node = captureRef.current
    if (!node || busy) return
    setBusy(true)
    const scale = getScale()
    copyImage(async () => {
      blurActiveEditable()
      let canvas = await renderToCanvas(node, scale)
      canvas = trimTransparent(canvas, Math.round(scale))
      const blob = await canvasToBlob(canvas)
      showPreview(URL.createObjectURL(blob), canvas.width, canvas.height)
      return blob
    })
      .then((ok) => flash(ok ? t('export.copied') : t('export.copyFail')))
      .finally(() => setBusy(false))
  }

  const api = useMemo<ExportApi>(() => ({ busy, ios, onCopy, onSave }), [busy, ios])

  return (
    <ExportCtx.Provider value={api}>
      {children}
      {(toast || preview) &&
        createPortal(
          <div className="export-overlay">
            {toast && <div className="toast">{toast}</div>}
            {preview && (
              <div className="preview-backdrop" onClick={dismissPreview}>
                <div className="preview-card" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="preview-close"
                    onClick={dismissPreview}
                    aria-label={t('export.close')}
                  >
                    <X size={16} weight="bold" />
                  </button>
                  <div className="preview-canvas">
                    <img src={preview.url} alt="preview" />
                  </div>
                  <div className="preview-meta">
                    {preview.width}×{preview.height}px · {t('export.meta')}
                  </div>
                  {ios && <div className="hint">{t('export.iosHint')}</div>}
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </ExportCtx.Provider>
  )
}
