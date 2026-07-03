import { useRef, useState } from 'react'
import { GearSix } from '@phosphor-icons/react'
import { useAppStore } from '../store/useStore'
import { useT } from '../i18n'
import { Popover, Seg } from './ui'

/** Bare quality control (the segmented scale). The surrounding context — a
 * popover title or a toolbar label — names it, so this renders no label of its
 * own (which previously duplicated the popover title on mobile). */
export function QualityContent() {
  const settings = useAppStore((s) => s.export)
  const setExport = useAppStore((s) => s.setExport)
  return (
    <div className="quality-content">
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

/** Gear icon + popover — used in the desktop panel toolbar. */
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
        <GearSix size={18} />
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="popover-title">{t('export.resolution')}</div>
        <QualityContent />
      </Popover>
    </>
  )
}
