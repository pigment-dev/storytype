import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../../store/useStore'
import { setStroke } from '../../editor/styleCommands'
import { toHexInput } from '../../utils/color'
import { useT } from '../../i18n'
import { ColorField, Row, Slider } from '../ui'

export function OutlineSection() {
  const [editor] = useLexicalComposerContext()
  const t = useT()
  const s = useAppStore((st) => st.selection)
  const setSelection = useAppStore((st) => st.setSelection)
  const cf = { presetsLabel: t('color.presets'), customLabel: t('color.customColor') }

  return (
    <>
      <Row label={t('outline.width')}>
        <Slider
          value={s.strokeWidth}
          min={0}
          max={20}
          step={0.5}
          suffix="px"
          onChange={(v) => {
            setStroke(editor, v, s.strokeColor)
            setSelection({ strokeWidth: v })
          }}
        />
      </Row>
      <Row label={t('outline.color')}>
        <ColorField
          value={toHexInput(s.strokeColor, '#000000')}
          onChange={(v) => {
            setStroke(editor, s.strokeWidth, v)
            setSelection({ strokeColor: v })
          }}
          {...cf}
        />
      </Row>
    </>
  )
}
