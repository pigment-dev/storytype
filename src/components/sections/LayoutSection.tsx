import { useAppStore } from '../../store/useStore'
import type { BlockStyle } from '../../store/useStore'
import { useT } from '../../i18n'
import { Row, Seg, Slider } from '../ui'

export function LayoutSection() {
  const t = useT()
  const b = useAppStore((st) => st.block)
  const setBlock = useAppStore((st) => st.setBlock)

  return (
    <>
      <Row label={t('layout.align')}>
        <Seg<BlockStyle['textAlign']>
          options={[
            { value: 'start', label: '⇤', title: 'Start' },
            { value: 'center', label: '↔', title: 'Center' },
            { value: 'end', label: '⇥', title: 'End' },
            { value: 'justify', label: '☰', title: 'Justify' }
          ]}
          value={b.textAlign}
          onChange={(v) => setBlock({ textAlign: v })}
        />
      </Row>
      <Row label={t('layout.direction')}>
        <Seg<BlockStyle['direction']>
          options={[
            { value: 'auto', label: t('dir.auto') },
            { value: 'rtl', label: t('dir.rtl') },
            { value: 'ltr', label: t('dir.ltr') }
          ]}
          value={b.direction}
          onChange={(v) => setBlock({ direction: v })}
        />
      </Row>
      <Row label={t('layout.lineHeight')}>
        <Slider value={b.lineHeight} min={-1} max={3} step={0.05} onChange={(v) => setBlock({ lineHeight: v })} />
      </Row>
      <Row label={t('layout.letterSpacing')}>
        <Slider
          value={b.letterSpacing}
          min={-10}
          max={40}
          step={0.5}
          suffix="px"
          onChange={(v) => setBlock({ letterSpacing: v })}
        />
      </Row>
    </>
  )
}
