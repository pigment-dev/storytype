import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  SKIP_SELECTION_FOCUS_TAG
} from 'lexical'
import type { LexicalEditor } from 'lexical'
import { $patchStyleText } from '@lexical/selection'
import { hexToRgba } from '../utils/color'
import type { SelectionStyle } from '../store/useStore'

/**
 * Apply CSS properties to the current selection. If nothing is meaningfully
 * selected (collapsed cursor or empty editor), apply to ALL text — silently:
 * we patch the whole document then restore the caret, so the user never sees a
 * "select all" highlight and doesn't have to select anything first.
 */
export function applyStyle(editor: LexicalEditor, styles: Record<string, string | null>): void {
  // Is the user actually editing the text right now (caret in the field), or just
  // adjusting a control? We only keep a DOM selection in the first case. On iOS,
  // setting a selection range inside a contentEditable focuses it and pops the
  // keyboard — so when the user is NOT editing we clear the selection entirely
  // after styling, which keeps the keyboard down for every control interaction.
  const rootEl = editor.getRootElement()
  const editing =
    !!rootEl && (rootEl === document.activeElement || rootEl.contains(document.activeElement))
  editor.update(
    () => {
      const sel = $getSelection()
      if ($isRangeSelection(sel) && !sel.isCollapsed()) {
        $patchStyleText(sel, styles)
        return
      }
      const root = $getRoot()
      const saved = $isRangeSelection(sel) ? sel.clone() : null
      const all = root.select(0, root.getChildrenSize())
      $patchStyleText(all, styles)
      if (editing && saved) {
        // Actively typing: restore the caret so nothing visibly selects and the
        // keyboard the user opened stays as they left it.
        $setSelection(saved)
      } else {
        // Styling from a control: no DOM selection → iOS keyboard never opens.
        $setSelection(null)
      }
    },
    // Belt-and-braces with the above: suppress Lexical's own rootElement.focus()
    // during DOM-selection reconciliation for this update.
    { tag: SKIP_SELECTION_FOCUS_TAG }
  )
}

export function setFontFamily(editor: LexicalEditor, family: string): void {
  // Fall back to Vazirmatn (bundled, has Persian + Latin) for any missing glyphs.
  applyStyle(editor, { 'font-family': `'${family}', 'Vazirmatn', sans-serif` })
}

export function setFontSize(editor: LexicalEditor, px: number): void {
  applyStyle(editor, { 'font-size': `${px}px` })
}

export function setFontWeight(editor: LexicalEditor, weight: number): void {
  applyStyle(editor, { 'font-weight': String(weight) })
}

export function setItalic(editor: LexicalEditor, italic: boolean): void {
  applyStyle(editor, { 'font-style': italic ? 'italic' : 'normal' })
}

export function setDecoration(editor: LexicalEditor, underline: boolean, strike: boolean): void {
  const parts = [underline && 'underline', strike && 'line-through'].filter(Boolean)
  applyStyle(editor, { 'text-decoration': parts.length ? parts.join(' ') : 'none' })
}

export function setColor(editor: LexicalEditor, color: string): void {
  applyStyle(editor, { color })
}

export function setStroke(editor: LexicalEditor, width: number, color: string): void {
  applyStyle(editor, {
    '-webkit-text-stroke-width': `${width}px`,
    '-webkit-text-stroke-color': color,
    'paint-order': 'stroke fill'
  })
}

export function setTextShadow(
  editor: LexicalEditor,
  s: Pick<
    SelectionStyle,
    'shadowEnabled' | 'shadowColor' | 'shadowAlpha' | 'shadowBlur' | 'shadowX' | 'shadowY'
  >
): void {
  if (!s.shadowEnabled) {
    applyStyle(editor, { 'text-shadow': null })
    return
  }
  const rgba = hexToRgba(s.shadowColor, s.shadowAlpha)
  applyStyle(editor, { 'text-shadow': `${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${rgba}` })
}
