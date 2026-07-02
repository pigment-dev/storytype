import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../../store/useStore'
import { setDecoration, setFontWeight, setItalic } from '../../editor/styleCommands'
import { useT } from '../../i18n'
import { FontPicker } from '../FontPicker'
import { Row, Slider, ToggleBtn } from '../ui'

export function TextSection() {
  const [editor] = useLexicalComposerContext()
  const t = useT()
  const s = useAppStore((st) => st.selection)
  const setSelection = useAppStore((st) => st.setSelection)

  return (
    <>
      <Row label={t('text.font')}>
        <FontPicker />
      </Row>
      <Row label={t('text.weight')}>
        <Slider
          value={s.fontWeight}
          min={100}
          max={900}
          step={100}
          onChange={(v) => {
            setFontWeight(editor, v)
            setSelection({ fontWeight: v })
          }}
        />
      </Row>
      <Row label={t('text.style')}>
        <span className="btn-group">
          <ToggleBtn
            active={s.fontWeight >= 600}
            title="Bold"
            onClick={() => {
              const w = s.fontWeight >= 600 ? 400 : 700
              setFontWeight(editor, w)
              setSelection({ fontWeight: w })
            }}
          >
            <b>B</b>
          </ToggleBtn>
          <ToggleBtn
            active={s.italic}
            title="Italic"
            onClick={() => {
              setItalic(editor, !s.italic)
              setSelection({ italic: !s.italic })
            }}
          >
            <i>I</i>
          </ToggleBtn>
          <ToggleBtn
            active={s.underline}
            title="Underline"
            onClick={() => {
              const v = !s.underline
              setDecoration(editor, v, s.strike)
              setSelection({ underline: v })
            }}
          >
            <u>U</u>
          </ToggleBtn>
          <ToggleBtn
            active={s.strike}
            title="Strikethrough"
            onClick={() => {
              const v = !s.strike
              setDecoration(editor, s.underline, v)
              setSelection({ strike: v })
            }}
          >
            <s>S</s>
          </ToggleBtn>
        </span>
      </Row>
    </>
  )
}
