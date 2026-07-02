import { useRef, useState } from 'react'
import { useAppStore } from '../store/useStore'
import { useT } from '../i18n'
import { Popover, Seg } from './ui'

/** Bare quality Seg, reused standalone by the mobile SettingsDock. */
export function QualityContent() {
  const t = useT()
  const settings = useAppStore((s) => s.export)
  const setExport = useAppStore((s) => s.setExport)
  return (
    <div className="quality-popover">
      <span className="quality-label">{t('export.resolution')}</span>
      <Seg
        options={[
          { value: '2', label: '2×' },
          { value: '3', label: '3×' },
          { value: '4', label: '4×' },
          { value: '5', label: '5×' }
        ]}
        value={String(settings.scale)}
        onChange={(v) => setExport({ scale: Number(v) })}
      />
    </div>
  )
}

/** Gear icon + popover, used in the header. */
export function QualityButton() {
  const t = useT()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="icon-btn"
        title={t('export.resolution')}
        aria-label={t('export.resolution')}
        onClick={() => setOpen((o) => !o)}
      >
        ⚙
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <QualityContent />
      </Popover>
    </>
  )
}
