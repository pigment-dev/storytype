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
  editor.update(
    () => {
      const sel = $getSelection()
      if ($isRangeSelection(sel) && !sel.isCollapsed()) {
        $patchStyleText(sel, styles)
        return
      }
      const root = $getRoot()
      const hasText = root.getTextContent().length > 0
      const saved = $isRangeSelection(sel) ? sel.clone() : null
      const all = root.select(0, root.getChildrenSize())
      $patchStyleText(all, styles)
      // Restore the caret so no visible selection remains (only when there's text;
      // for an empty editor we keep the selection so the pending style applies to typing).
      if (saved && hasText) $setSelection(saved)
    },
    // Sliders (font size/weight, stroke, shadow, ...) call applyStyle() while the
    // contentEditable has been deliberately blurred for the duration of a drag
    // (see blurActiveEditable() in ../utils/dom.ts). Lexical's DOM-selection
    // reconciliation would otherwise call rootElement.focus() here because the
    // active element isn't the editor root, silently reopening the mobile
    // keyboard mid-drag. This tag suppresses that refocus at the source.
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
