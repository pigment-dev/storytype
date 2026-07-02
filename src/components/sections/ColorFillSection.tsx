import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../../store/useStore'
import { setColor } from '../../editor/styleCommands'
import { toHexInput } from '../../utils/color'
import { useT } from '../../i18n'
import { ColorField, Row, Slider, Switch } from '../ui'

export function ColorFillSection() {
  const [editor] = useLexicalComposerContext()
  const t = useT()
  const s = useAppStore((st) => st.selection)
  const b = useAppStore((st) => st.block)
  const base = useAppStore((st) => st.base)
  const setSelection = useAppStore((st) => st.setSelection)
  const setBlock = useAppStore((st) => st.setBlock)
  const cf = { presetsLabel: t('color.presets'), customLabel: t('color.customColor') }

  return (
    <>
      <Row label={t('color.text')}>
        <ColorField
          value={toHexInput(s.color, base.color)}
          onChange={(v) => {
            setColor(editor, v)
            setSelection({ color: v })
          }}
          {...cf}
        />
      </Row>
      <Row label={t('color.gradient')}>
        <Switch checked={b.gradientEnabled} onChange={(v) => setBlock({ gradientEnabled: v })} />
      </Row>
      {b.gradientEnabled && (
        <>
          <div className="hint">{t('color.gradientHint')}</div>
          <Row label={t('color.fromTo')}>
            <span className="btn-group">
              <ColorField value={b.gradientFrom} onChange={(v) => setBlock({ gradientFrom: v })} {...cf} />
              <ColorField value={b.gradientTo} onChange={(v) => setBlock({ gradientTo: v })} {...cf} />
            </span>
          </Row>
          <Row label={t('color.angle')}>
            <Slider
              value={b.gradientAngle}
              min={0}
              max={360}
              suffix="°"
              onChange={(v) => setBlock({ gradientAngle: v })}
            />
          </Row>
        </>
      )}
    </>
  )
}
