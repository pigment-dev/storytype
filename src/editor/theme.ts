import type { EditorThemeClasses } from 'lexical'

// Minimal theme. All rich styling is applied as inline CSS via $patchStyleText,
// so we only need classes for structure and RTL/LTR direction handling.
export const theme: EditorThemeClasses = {
  paragraph: 'st-paragraph',
  ltr: 'st-ltr',
  rtl: 'st-rtl',
  text: {
    bold: 'st-bold',
    italic: 'st-italic',
    underline: 'st-underline',
    strikethrough: 'st-strike'
  }
}
