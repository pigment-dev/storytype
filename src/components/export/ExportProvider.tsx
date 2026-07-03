import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { canvasToBlob, exportPng, renderToCanvas, trimTransparent } from '../../services/export'
import { copyImage, downloadImage, isIOS, shareImage } from '../../services/share'
import { useT } from '../../i18n'
import { useAppStore } from '../../store/useStore'
import { blurActiveEditable } from '../../utils/dom'
import { playDing } from '../../utils/sound'

// Read the export scale lazily at call time so it always reflects the latest store value.
function getScale(): number {
  return useAppStore.getState().export.scale
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

/** Owns export state (busy + a single small toast) so Copy/Save can be triggered
 * from anywhere and share one toast. No preview modal — the toast is enough. */
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
  const ios = isIOS()

  function flash(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2400)
  }

  async function onSave() {
    const node = captureRef.current
    if (!node || busy) return
    setBusy(true)
    setToast(t('export.rendering')) // persistent loading toast — iOS can lag before the save/share panel
    try {
      blurActiveEditable()
      const { blob } = await exportPng(node, { scale: getScale() })
      if (ios) {
        const shared = await shareImage(blob)
        if (!shared) {
          downloadImage(blob)
          flash(t('export.downloaded'))
          playDing()
        } else {
          setToast('') // native share sheet is now up
        }
      } else {
        downloadImage(blob)
        flash(t('export.downloaded'))
        playDing()
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
    setToast(t('export.rendering')) // persistent loading toast until the copy resolves
    const scale = getScale()
    copyImage(async () => {
      blurActiveEditable()
      let canvas = await renderToCanvas(node, scale)
      canvas = trimTransparent(canvas, Math.round(scale))
      return canvasToBlob(canvas)
    })
      .then((ok) => {
        flash(ok ? t('export.copied') : t('export.copyFail'))
        if (ok) playDing()
      })
      .finally(() => setBusy(false))
  }

  const api = useMemo<ExportApi>(() => ({ busy, ios, onCopy, onSave }), [busy, ios])

  return (
    <ExportCtx.Provider value={api}>
      {children}
      {toast &&
        createPortal(
          <div className="export-overlay">
            <div className="toast">{toast}</div>
          </div>,
          document.body
        )}
    </ExportCtx.Provider>
  )
}
