import { useState } from 'react'
import { SlidersHorizontal, Copy, DownloadSimple } from '@phosphor-icons/react'
import { useT } from '../i18n'
import { useExport } from './export/ExportProvider'
import { MobileSettingsSheet } from './MobileSettingsSheet'

/** Mobile: a stacked cluster of floating buttons over a full-height canvas —
 * Settings (opens the sheet, labelled), Copy (primary), Save (secondary). */
export function MobileControls() {
  const t = useT()
  const { busy, ios, onCopy, onSave } = useExport()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="mfab-stack">
        <button
          type="button"
          className="mfab mfab--settings"
          onClick={() => setOpen(true)}
          aria-label={t('dock.label')}
        >
          <span className="mfab-label">{t('dock.label')}</span>
          <span className="mfab-circle">
            <SlidersHorizontal size={22} />
          </span>
        </button>
        <button
          type="button"
          className="mfab mfab--primary"
          disabled={busy}
          onClick={onCopy}
          aria-label={t('export.copy')}
        >
          <span className="mfab-circle">
            <Copy size={26} weight="bold" />
          </span>
        </button>
        <button
          type="button"
          className="mfab mfab--soft"
          disabled={busy}
          onClick={onSave}
          aria-label={ios ? t('export.saveIos') : t('export.save')}
        >
          <span className="mfab-circle">
            <DownloadSimple size={22} weight="bold" />
          </span>
        </button>
      </div>
      <MobileSettingsSheet open={open} onClose={() => setOpen(false)} />
    </>
  )
}
