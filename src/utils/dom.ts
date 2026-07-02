/** Blurs the currently focused element (e.g. the Lexical contenteditable),
 * so a mobile on-screen keyboard doesn't stay open while dragging a
 * slider or color picker that lives outside the text field. */
export function blurActiveEditable(): void {
  const el = document.activeElement as HTMLElement | null
  el?.blur?.()
}
