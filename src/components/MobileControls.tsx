import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  DotsThreeVertical,
  Copy,
  X,
  TextAa,
  Rows,
  PaintBucket,
  Square,
  TextT,
  Stack,
  Circle,
  Checkerboard,
  Bookmarks,
  GearSix,
  Translate,
  DownloadSimple,
  ArrowCounterClockwise
} from '@phosphor-icons/react'
import { useT } from '../i18n'
import { useAppStore } from '../store/useStore'
import type { Lang } from '../store/useStore'
import { Seg } from './ui'
import { QualityContent } from './QualityButton'
import { useExport } from './export/ExportProvider'
import { TextSection } from './sections/TextSection'
import { LayoutSection } from './sections/LayoutSection'
import { ColorFillSection } from './sections/ColorFillSection'
import { BoxSection } from './sections/BoxSection'
import { ShadowSection } from './sections/ShadowSection'
import { DropShadowSection } from './sections/DropShadowSection'
import { OutlineSection } from './sections/OutlineSection'
import { CanvasSection } from './sections/CanvasSection'
import { PresetsSection } from './sections/PresetsSection'

const SZ = 20

interface MenuItem {
  key: string
  icon: ReactNode
  label: string
  content?: ReactNode
  onActivate?: () => void
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

/** Small, semi-transparent popover that opens to the LEFT of a menu item with a
 * tail on its right edge — so the canvas stays visible while you adjust. */
function GroupPopover({
  anchorRect,
  title,
  onClose,
  children
}: {
  anchorRect: DOMRect
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<{ top: number; tailTop: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const h = el.offsetHeight
    const M = 10
    const itemCenter = anchorRect.top + anchorRect.height / 2
    let top = itemCenter - h / 2
    top = Math.max(M, Math.min(top, window.innerHeight - h - M))
    const tailTop = Math.max(16, Math.min(itemCenter - top, h - 16))
    setLayout({ top, tailTop })
  }, [anchorRect, children])

  const right = Math.round(window.innerWidth - anchorRect.left + 12)

  return createPortal(
    <>
      <div className="mpop-backdrop" onClick={onClose} />
      <div
        ref={ref}
        className="mpop"
        style={{ right, top: layout ? layout.top : -9999, visibility: layout ? 'visible' : 'hidden' }}
      >
        <div className="mpop-tail" style={{ top: (layout?.tailTop ?? 20) - 9 }} />
        <div className="mpop-body">
          <div className="popover-title">{title}</div>
          {children}
        </div>
      </div>
    </>,
    document.body
  )
}

/** Mobile: two floating buttons (⋮ menu + Copy). The ⋮ opens a vertical,
 * scrollable strip of setting-group icons rising above it; tapping one opens
 * that group as a small translucent popover. */
export function MobileControls() {
  const t = useT()
  const { busy, ios, onCopy, onSave } = useExport()
  const resetStyles = useAppStore((s) => s.resetStyles)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState<{ key: string; rect: DOMRect } | null>(null)

  const items: MenuItem[] = [
    { key: 'text', icon: <TextAa size={SZ} />, label: t('section.text'), content: <TextSection /> },
    { key: 'layout', icon: <Rows size={SZ} />, label: t('section.layout'), content: <LayoutSection /> },
    { key: 'colorFill', icon: <PaintBucket size={SZ} />, label: t('section.colorFill'), content: <ColorFillSection /> },
    { key: 'box', icon: <Square size={SZ} />, label: t('section.box'), content: <BoxSection /> },
    { key: 'textShadow', icon: <TextT size={SZ} />, label: t('section.textShadow'), content: <ShadowSection /> },
    { key: 'dropShadow', icon: <Stack size={SZ} />, label: t('section.dropShadow'), content: <DropShadowSection /> },
    { key: 'outline', icon: <Circle size={SZ} />, label: t('section.outline'), content: <OutlineSection /> },
    { key: 'canvas', icon: <Checkerboard size={SZ} />, label: t('section.canvas'), content: <CanvasSection /> },
    { key: 'presets', icon: <Bookmarks size={SZ} />, label: t('section.presets'), content: <PresetsSection /> },
    { key: 'quality', icon: <GearSix size={SZ} />, label: t('export.resolution'), content: <QualityContent /> },
    { key: 'language', icon: <Translate size={SZ} />, label: t('language'), content: <LanguageContent /> },
    { key: 'save', icon: <DownloadSimple size={SZ} />, label: ios ? t('export.saveIos') : t('export.save'), onActivate: onSave },
    { key: 'reset', icon: <ArrowCounterClockwise size={SZ} />, label: t('reset'), onActivate: resetStyles }
  ]

  const activeItem = active ? items.find((i) => i.key === active.key) : null

  function closeAll() {
    setActive(null)
    setMenuOpen(false)
  }

  return (
    <>
      {menuOpen && (
        <>
          <div className="mmenu-backdrop" onClick={closeAll} />
          <nav className="mmenu" aria-label={t('dock.label')}>
            <div className="mmenu-head">
              <button type="button" className="mmenu-close" onClick={closeAll} aria-label={t('export.close')}>
                <X size={15} weight="bold" />
              </button>
            </div>
            <div className="mmenu-list">
              {items.map((it) => (
                <button
                  key={it.key}
                  type="button"
                  className={active?.key === it.key ? 'mmenu-item active' : 'mmenu-item'}
                  title={it.label}
                  aria-label={it.label}
                  onClick={(e) => {
                    if (it.onActivate) {
                      it.onActivate()
                      setActive(null)
                    } else {
                      setActive({ key: it.key, rect: e.currentTarget.getBoundingClientRect() })
                    }
                  }}
                >
                  {it.icon}
                </button>
              ))}
            </div>
          </nav>
        </>
      )}

      {active && activeItem?.content && (
        <GroupPopover anchorRect={active.rect} title={activeItem.label} onClose={() => setActive(null)}>
          {activeItem.content}
        </GroupPopover>
      )}

      <div className="mfab-row">
        <button
          type="button"
          className="mfab-btn mfab-btn--primary"
          disabled={busy}
          onClick={onCopy}
          aria-label={t('export.copy')}
        >
          <Copy size={26} weight="bold" />
        </button>
        <button
          type="button"
          className={menuOpen ? 'mfab-btn mfab-btn--menu active' : 'mfab-btn mfab-btn--menu'}
          onClick={() => (menuOpen ? closeAll() : setMenuOpen(true))}
          aria-label={t('dock.label')}
        >
          <DotsThreeVertical size={28} weight="bold" />
        </button>
      </div>
    </>
  )
}
