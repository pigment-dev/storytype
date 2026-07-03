import {
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
  ArrowsHorizontal,
  ArrowRight,
  ArrowLeft
} from '@phosphor-icons/react'
import { useAppStore } from '../../store/useStore'
import type { BlockStyle } from '../../store/useStore'
import { useT } from '../../i18n'
import { Row, Seg, Slider } from '../ui'

const SZ = 16

export function LayoutSection() {
  const t = useT()
  const b = useAppStore((st) => st.block)
  const setBlock = useAppStore((st) => st.setBlock)

  return (
    <>
      <Row label={t('layout.align')}>
        <Seg<BlockStyle['textAlign']>
          ltr
          options={[
            { value: 'start', label: <TextAlignLeft size={SZ} />, title: t('align.start') },
            { value: 'center', label: <TextAlignCenter size={SZ} />, title: t('align.center') },
            { value: 'end', label: <TextAlignRight size={SZ} />, title: t('align.end') },
            { value: 'justify', label: <TextAlignJustify size={SZ} />, title: t('align.justify') }
          ]}
          value={b.textAlign}
          onChange={(v) => setBlock({ textAlign: v })}
        />
      </Row>
      <Row label={t('layout.direction')}>
        <Seg<BlockStyle['direction']>
          ltr
          options={[
            { value: 'auto', label: <ArrowsHorizontal size={SZ} />, title: t('dir.auto') },
            { value: 'rtl', label: <ArrowLeft size={SZ} />, title: t('dir.rtl') },
            { value: 'ltr', label: <ArrowRight size={SZ} />, title: t('dir.ltr') }
          ]}
          value={b.direction}
          onChange={(v) => setBlock({ direction: v })}
        />
      </Row>
      <Row label={t('layout.lineHeight')}>
        <Slider value={b.lineHeight} min={0} max={3} step={0.05} onChange={(v) => setBlock({ lineHeight: v })} />
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
