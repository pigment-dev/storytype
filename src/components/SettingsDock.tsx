import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Bookmarks,
  Checkerboard,
  TextAa,
  PaintBucket,
  Circle,
  TextT,
  Square,
  Stack,
  Rows,
  Copy,
  DownloadSimple,
  Translate,
  ArrowCounterClockwise,
  GearSix
} from '@phosphor-icons/react'
import { useT } from '../i18n'
import { useAppStore } from '../store/useStore'
import type { Lang } from '../store/useStore'
import { Popover, Seg } from './ui'
import { QualityContent } from './QualityButton'
import { useExport } from './export/ExportProvider'
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
  icon: ReactNode
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
        {item.icon}
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

function LanguageContent() {
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)
  return (
    <div className="quality-content">
      <Seg<Lang>
        options={[
          { value: 'fa', label: 'فارسی' },
          { value: 'en', label: 'English' }
        ]}
        value={lang}
        onChange={setLang}
      />
    </div>
  )
}

const SZ = 20

export function SettingsDock() {
  const t = useT()
  const resetStyles = useAppStore((s) => s.resetStyles)
  const { onCopy, onSave } = useExport()

  const items: DockItem[] = [
    { key: 'presets', icon: <Bookmarks size={SZ} />, label: t('section.presets'), content: <PresetsSection /> },
    { key: 'canvas', icon: <Checkerboard size={SZ} />, label: t('section.canvas'), content: <CanvasSection /> },
    { key: 'text', icon: <TextAa size={SZ} />, label: t('section.text'), content: <TextSection /> },
    { key: 'colorFill', icon: <PaintBucket size={SZ} />, label: t('section.colorFill'), content: <ColorFillSection /> },
    { key: 'outline', icon: <Circle size={SZ} />, label: t('section.outline'), content: <OutlineSection /> },
    { key: 'textShadow', icon: <TextT size={SZ} />, label: t('section.textShadow'), content: <ShadowSection /> },
    { key: 'box', icon: <Square size={SZ} />, label: t('section.box'), content: <BoxSection /> },
    { key: 'dropShadow', icon: <Stack size={SZ} />, label: t('section.dropShadow'), content: <DropShadowSection /> },
    { key: 'layout', icon: <Rows size={SZ} />, label: t('section.layout'), content: <LayoutSection /> },
    { key: 'copy', icon: <Copy size={SZ} />, label: t('export.copy'), onActivate: onCopy },
    { key: 'save', icon: <DownloadSimple size={SZ} />, label: t('export.save'), onActivate: onSave },
    { key: 'language', icon: <Translate size={SZ} />, label: t('language'), content: <LanguageContent /> },
    { key: 'reset', icon: <ArrowCounterClockwise size={SZ} />, label: t('reset'), onActivate: resetStyles },
    { key: 'quality', icon: <GearSix size={SZ} />, label: t('export.resolution'), content: <QualityContent /> }
  ]

  return (
    <nav className="dock" aria-label={t('dock.label')}>
      {items.map((item) => (
        <DockButton key={item.key} item={item} />
      ))}
    </nav>
  )
}
