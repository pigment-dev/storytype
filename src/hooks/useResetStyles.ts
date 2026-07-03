import { useCallback } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore, DEFAULT_SELECTION } from '../store/useStore'
import {
  setColor,
  setDecoration,
  setFontFamily,
  setFontSize,
  setFontWeight,
  setItalic,
  setStroke,
  setTextShadow
} from '../editor/styleCommands'

/** Reset returns the store to defaults AND re-applies the default inline styles
 * to the actual text in the editor — otherwise the controls snap back but the
 * on-canvas text keeps its old font size/color/etc. */
export function useResetStyles(): () => void {
  const [editor] = useLexicalComposerContext()
  const resetStore = useAppStore((s) => s.resetStyles)
  return useCallback(() => {
    const d = DEFAULT_SELECTION
    setFontFamily(editor, d.fontFamily)
    setFontSize(editor, d.fontSize)
    setFontWeight(editor, d.fontWeight)
    setItalic(editor, d.italic)
    setDecoration(editor, d.underline, d.strike)
    setColor(editor, d.color)
    setStroke(editor, d.strokeWidth, d.strokeColor)
    setTextShadow(editor, d)
    resetStore()
  }, [editor, resetStore])
}
