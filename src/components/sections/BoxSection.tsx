import { useAppStore } from '../../store/useStore'
import { useT } from '../../i18n'
import { ColorField, Row, Slider, Switch } from '../ui'

export function BoxSection() {
  const t = useT()
  const b = useAppStore((st) => st.block)
  const setBlock = useAppStore((st) => st.setBlock)
  const cf = { presetsLabel: t('color.presets'), customLabel: t('color.customColor') }

  return (
    <>
      <Row label={t('toggle.enable')}>
        <Switch checked={b.boxEnabled} onChange={(v) => setBlock({ boxEnabled: v })} />
      </Row>
      {b.boxEnabled && (
        <>
          <Row label={t('box.color')}>
            <ColorField value={b.boxColor} onChange={(v) => setBlock({ boxColor: v })} {...cf} />
          </Row>
          <Row label={t('box.opacity')}>
            <Slider value={b.boxAlpha} min={0} max={1} step={0.05} onChange={(v) => setBlock({ boxAlpha: v })} />
          </Row>
          <Row label={t('box.padding')}>
            <Slider value={b.boxPadding} min={0} max={120} suffix="px" onChange={(v) => setBlock({ boxPadding: v })} />
          </Row>
          <Row label={t('box.radius')}>
            <Slider value={b.boxRadius} min={0} max={120} suffix="px" onChange={(v) => setBlock({ boxRadius: v })} />
          </Row>
          <Row label={t('box.border')}>
            <span className="btn-group">
              <Slider value={b.borderWidth} min={0} max={20} suffix="px" onChange={(v) => setBlock({ borderWidth: v })} />
              <ColorField value={b.borderColor} onChange={(v) => setBlock({ borderColor: v })} {...cf} />
            </span>
          </Row>
        </>
      )}
    </>
  )
}
