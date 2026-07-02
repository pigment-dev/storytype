import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useT } from '../i18n'
import { useAppStore } from '../store/useStore'
import { Popover } from './ui'
import { QualityContent } from './QualityButton'
import { PresetsSection } from './sections/PresetsSection'
import { CanvasSection } from './sections/CanvasSection'
import { TextSection } from './sections/TextSection'
import { ColorFillSection } from './sections/ColorFillSection'
import { OutlineSection } from './sections/OutlineSection'
import { ShadowSection } from './sections/ShadowSection'
import { BoxSection } from './sections/BoxSection'
import { DropShadowSection } from './sections/DropShadowSection'
import { LayoutSection } from './sections/LayoutSection'

interface DockItem {
  key: string
  icon: string
  label: string
  content?: ReactNode
  onActivate?: () => void
}

function DockButton({ item }: { item: DockItem }) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={open ? 'dock-btn active' : 'dock-btn'}
        title={item.label}
        aria-label={item.label}
        onClick={() => (item.onActivate ? item.onActivate() : setOpen((o) => !o))}
      >
        <span aria-hidden="true">{item.icon}</span>
      </button>
      {item.content && (
        <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
          <div className="popover-title">{item.label}</div>
          {item.content}
        </Popover>
      )}
    </>
  )
}

export function SettingsDock() {
  const t = useT()
  const resetStyles = useAppStore((s) => s.resetStyles)

  const items: DockItem[] = [
    { key: 'presets', icon: '⭐', label: t('section.presets'), content: <PresetsSection /> },
    { key: 'canvas', icon: '▚', label: t('section.canvas'), content: <CanvasSection /> },
    { key: 'text', icon: 'Aa', label: t('section.text'), content: <TextSection /> },
    { key: 'colorFill', icon: '🎨', label: t('section.colorFill'), content: <ColorFillSection /> },
    { key: 'outline', icon: '◯', label: t('section.outline'), content: <OutlineSection /> },
    { key: 'textShadow', icon: '🔤', label: t('section.textShadow'), content: <ShadowSection /> },
    { key: 'box', icon: '▢', label: t('section.box'), content: <BoxSection /> },
    { key: 'dropShadow', icon: '▣', label: t('section.dropShadow'), content: <DropShadowSection /> },
    { key: 'layout', icon: '☰', label: t('section.layout'), content: <LayoutSection /> },
    { key: 'quality', icon: '⚙', label: t('export.resolution'), content: <QualityContent /> },
    { key: 'reset', icon: '↺', label: t('reset'), onActivate: resetStyles }
  ]

  return (
    <nav className="dock" aria-label={t('section.text')}>
      {items.map((item) => (
        <DockButton key={item.key} item={item} />
      ))}
    </nav>
  )
}
