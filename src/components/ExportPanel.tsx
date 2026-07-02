import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useAppStore } from '../store/useStore'
import { canvasToBlob, exportPng, renderToCanvas, trimTransparent } from '../services/export'
import { copyImage, downloadImage, isIOS, shareImage } from '../services/share'
import { useT } from '../i18n'
import { blurActiveEditable } from '../utils/dom'

interface Preview {
  url: string
  width: number
  height: number
}

export function ExportPanel({ captureRef }: { captureRef: RefObject<HTMLDivElement | null> }) {
  const t = useT()
  const settings = useAppStore((s) => s.export)
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

  async function onSave() {
    const node = captureRef.current
    if (!node || busy) return
    setBusy(true)
    try {
      blurActiveEditable()
      const { blob, url, width, height } = await exportPng(node, { scale: settings.scale })
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
    copyImage(async () => {
      blurActiveEditable()
      let canvas = await renderToCanvas(node, settings.scale)
      canvas = trimTransparent(canvas, Math.round(settings.scale))
      const blob = await canvasToBlob(canvas)
      showPreview(URL.createObjectURL(blob), canvas.width, canvas.height)
      return blob
    })
      .then((ok) => flash(ok ? t('export.copied') : t('export.copyFail')))
      .finally(() => setBusy(false))
  }

  function dismissPreview() {
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current)
    lastUrl.current = null
    setPreview(null)
  }

  return (
    <div className="exportbar">
      {toast && <div className="toast">{toast}</div>}

      {preview && (
        <div className="export-preview">
          <button type="button" className="export-preview-close" onClick={dismissPreview} aria-label={t('export.close')}>
            ×
          </button>
          <div className="export-preview-canvas">
            <img src={preview.url} alt="preview" />
          </div>
          <div className="export-preview-meta">
            {preview.width}×{preview.height}px · {t('export.meta')}
          </div>
          {ios && <div className="hint">{t('export.iosHint')}</div>}
        </div>
      )}

      <div className="exportbar-actions">
        <button type="button" className="btn primary big" disabled={busy} onClick={onCopy}>
          {busy ? t('export.rendering') : t('export.copy')}
        </button>
        <button type="button" className="btn" disabled={busy} onClick={onSave} title={t('export.save')}>
          {ios ? t('export.saveIos') : t('export.save')}
        </button>
      </div>
    </div>
  )
}
