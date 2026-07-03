import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowCounterClockwise } from '@phosphor-icons/react'
import { useT } from '../i18n'
import { useAppStore } from '../store/useStore'
import type { Lang } from '../store/useStore'
import { Section, Seg } from './ui'
import { SECTIONS } from './sections/registry'
import { QualityContent } from './QualityButton'

/** Bottom sheet holding every settings group + quality/language/reset.
 * Opened by the floating Settings button on mobile. */
export function MobileSettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)
  const resetStyles = useAppStore((s) => s.resetStyles)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="sheet-head">
          <span className="sheet-grabber" aria-hidden="true" />
          <span className="sheet-title">{t('dock.label')}</span>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label={t('export.close')}
          >
            <X size={16} weight="bold" />
          </button>
        </div>
        <div className="sheet-body">
          {SECTIONS.map(({ key, titleKey, Component }) => (
            <Section key={key} title={t(titleKey)}>
              <Component />
            </Section>
          ))}
          <Section title={t('export.resolution')}>
            <QualityContent />
          </Section>
          <Section title={t('language')}>
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
          </Section>
          <button type="button" className="btn btn--ghost btn--block" onClick={resetStyles}>
            <ArrowCounterClockwise size={16} />
            {t('reset')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
