import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../../store/useStore'
import type { SelectionStyle } from '../../store/useStore'
import { setTextShadow } from '../../editor/styleCommands'
import { useT } from '../../i18n'
import { ColorField, Row, Slider, Switch } from '../ui'

export function ShadowSection() {
  const [editor] = useLexicalComposerContext()
  const t = useT()
  const s = useAppStore((st) => st.selection)
  const setSelection = useAppStore((st) => st.setSelection)
  const cf = { presetsLabel: t('color.presets'), customLabel: t('color.customColor') }

  function updateShadow(patch: Partial<SelectionStyle>) {
    const next = { ...s, ...patch }
    setSelection(patch)
    setTextShadow(editor, next)
  }

  return (
    <>
      <Row label={t('toggle.enable')}>
        <Switch checked={s.shadowEnabled} onChange={(v) => updateShadow({ shadowEnabled: v })} />
      </Row>
      {s.shadowEnabled && (
        <>
          <Row label={t('shadow.color')}>
            <ColorField value={s.shadowColor} onChange={(v) => updateShadow({ shadowColor: v })} {...cf} />
          </Row>
          <Row label={t('shadow.opacity')}>
            <Slider value={s.shadowAlpha} min={0} max={1} step={0.05} onChange={(v) => updateShadow({ shadowAlpha: v })} />
          </Row>
          <Row label={t('shadow.blur')}>
            <Slider value={s.shadowBlur} min={0} max={40} suffix="px" onChange={(v) => updateShadow({ shadowBlur: v })} />
          </Row>
          <Row label={t('shadow.offsetX')}>
            <Slider value={s.shadowX} min={-40} max={40} suffix="px" onChange={(v) => updateShadow({ shadowX: v })} />
          </Row>
          <Row label={t('shadow.offsetY')}>
            <Slider value={s.shadowY} min={-40} max={40} suffix="px" onChange={(v) => updateShadow({ shadowY: v })} />
          </Row>
        </>
      )}
    </>
  )
}
