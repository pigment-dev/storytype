import { useAppStore } from '../../store/useStore'
import { useT } from '../../i18n'
import { ColorField, Row, Slider, Switch } from '../ui'

export function DropShadowSection() {
  const t = useT()
  const b = useAppStore((st) => st.block)
  const setBlock = useAppStore((st) => st.setBlock)
  const cf = { presetsLabel: t('color.presets'), customLabel: t('color.customColor') }

  return (
    <>
      <Row label={t('toggle.enable')}>
        <Switch checked={b.dropEnabled} onChange={(v) => setBlock({ dropEnabled: v })} />
      </Row>
      {b.dropEnabled && (
        <>
          <Row label={t('shadow.color')}>
            <ColorField value={b.dropColor} onChange={(v) => setBlock({ dropColor: v })} {...cf} />
          </Row>
          <Row label={t('shadow.opacity')}>
            <Slider value={b.dropAlpha} min={0} max={1} step={0.05} onChange={(v) => setBlock({ dropAlpha: v })} />
          </Row>
          <Row label={t('shadow.blur')}>
            <Slider value={b.dropBlur} min={0} max={60} suffix="px" onChange={(v) => setBlock({ dropBlur: v })} />
          </Row>
          <Row label={t('shadow.offsetX')}>
            <Slider value={b.dropX} min={-60} max={60} suffix="px" onChange={(v) => setBlock({ dropX: v })} />
          </Row>
          <Row label={t('shadow.offsetY')}>
            <Slider value={b.dropY} min={-60} max={60} suffix="px" onChange={(v) => setBlock({ dropY: v })} />
          </Row>
        </>
      )}
    </>
  )
}
