import { Copy, DownloadSimple } from '@phosphor-icons/react'
import { useT } from '../../i18n'
import { useExport } from './ExportProvider'

/** Desktop: labeled Copy + circular Save, docked at the bottom of the panel. */
export function ExportBar() {
  const t = useT()
  const { busy, ios, onCopy, onSave } = useExport()
  return (
    <div className="exportbar">
      <button type="button" className="btn btn--primary btn--lg btn--block" disabled={busy} onClick={onCopy}>
        <Copy size={18} weight="bold" />
        {busy ? t('export.rendering') : t('export.copy')}
      </button>
      <button
        type="button"
        className="fab"
        disabled={busy}
        onClick={onSave}
        title={ios ? t('export.saveIos') : t('export.save')}
        aria-label={ios ? t('export.saveIos') : t('export.save')}
      >
        <DownloadSimple size={22} weight="bold" />
      </button>
    </div>
  )
}

/** Mobile: two floating circular buttons over the canvas (Copy + Save). */
export function ExportFabs() {
  const t = useT()
  const { busy, ios, onCopy, onSave } = useExport()
  return (
    <div className="canvas-fabs">
      <button
        type="button"
        className="fab fab--soft"
        disabled={busy}
        onClick={onCopy}
        title={t('export.copy')}
        aria-label={t('export.copy')}
      >
        <Copy size={22} weight="bold" />
      </button>
      <button
        type="button"
        className="fab"
        disabled={busy}
        onClick={onSave}
        title={ios ? t('export.saveIos') : t('export.save')}
        aria-label={ios ? t('export.saveIos') : t('export.save')}
      >
        <DownloadSimple size={22} weight="bold" />
      </button>
    </div>
  )
}
