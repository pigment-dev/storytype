import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $getSelectionStyleValueForProperty } from '@lexical/selection'
import { useAppStore } from '../store/useStore'

function firstFamily(v: string): string {
  const first = (v.split(',')[0] ?? '').trim()
  return first.replace(/^['"]|['"]$/g, '').trim()
}

function parseShadowNumbers(s: string): { x: number; y: number; blur: number } | null {
  const m = s.match(/(-?\d*\.?\d+)px\s+(-?\d*\.?\d+)px\s+(\d*\.?\d+)px/)
  if (!m) return null
  return { x: parseFloat(m[1]), y: parseFloat(m[2]), blur: parseFloat(m[3]) }
}

/**
 * Reflects the current selection's inline styles into the store so the toolbar
 * shows them. On EMPTY reads (unstyled text, empty editor, or mixed selection)
 * we keep the current control value rather than resetting to a default — this
 * prevents sliders/colors from snapping back while editing.
 */
export function SelectionStatePlugin() {
  const [editor] = useLexicalComposerContext()
  const setSelection = useAppStore((s) => s.setSelection)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const sel = $getSelection()
        if (!$isRangeSelection(sel)) return
        const g = (p: string) => $getSelectionStyleValueForProperty(sel, p, '')
        const cur = useAppStore.getState().selection

        const famRaw = g('font-family')
        const sizeRaw = g('font-size')
        const weightRaw = g('font-weight')
        const styleRaw = g('font-style')
        const decRaw = g('text-decoration')
        const colorRaw = g('color')
        const strokeWRaw = g('-webkit-text-stroke-width')
        const strokeCRaw = g('-webkit-text-stroke-color')
        const shadowRaw = g('text-shadow')
        const shadowNums = parseShadowNumbers(shadowRaw)

        setSelection({
          fontFamily: famRaw ? firstFamily(famRaw) : cur.fontFamily,
          fontSize: parseFloat(sizeRaw) || cur.fontSize,
          fontWeight: parseInt(weightRaw, 10) || cur.fontWeight,
          italic: styleRaw ? styleRaw === 'italic' : cur.italic,
          underline: decRaw ? decRaw.includes('underline') : cur.underline,
          strike: decRaw ? decRaw.includes('line-through') : cur.strike,
          color: colorRaw || cur.color,
          strokeWidth: strokeWRaw !== '' ? parseFloat(strokeWRaw) || 0 : cur.strokeWidth,
          strokeColor: strokeCRaw || cur.strokeColor,
          shadowEnabled: shadowRaw ? shadowRaw !== 'none' : cur.shadowEnabled,
          ...(shadowNums
            ? { shadowX: shadowNums.x, shadowY: shadowNums.y, shadowBlur: shadowNums.blur }
            : {})
        })
      })
    })
  }, [editor, setSelection])

  return null
}
