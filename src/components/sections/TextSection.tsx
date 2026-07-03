import { TextB, TextItalic, TextUnderline, TextStrikethrough } from '@phosphor-icons/react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../../store/useStore'
import { setDecoration, setFontWeight, setItalic } from '../../editor/styleCommands'
import { useT } from '../../i18n'
import { FontPicker } from '../FontPicker'
import { Row, Slider, ToggleBtn } from '../ui'

const SZ = 17

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
            <TextB size={SZ} weight="bold" />
          </ToggleBtn>
          <ToggleBtn
            active={s.italic}
            title="Italic"
            onClick={() => {
              setItalic(editor, !s.italic)
              setSelection({ italic: !s.italic })
            }}
          >
            <TextItalic size={SZ} />
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
            <TextUnderline size={SZ} />
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
            <TextStrikethrough size={SZ} />
          </ToggleBtn>
        </span>
      </Row>
    </>
  )
}
