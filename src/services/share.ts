// Delivery: iOS-aware share / save / copy.
//
//  - Share (files): iOS share sheet -> "Save Image" to Photos (primary path).
//  - Download <a download>: desktop path (on iOS this saves to Files, not Photos).
//  - Copy: Safari needs the ClipboardItem value to be a Promise<Blob> created
//    synchronously inside the user gesture — do NOT await the blob first.

export function isIOS(): boolean {
  const ua = navigator.userAgent
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function canShareFile(file: File): boolean {
  return (
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  )
}

/** Returns true if the share sheet was shown (whether or not the user saved). */
export async function shareImage(blob: Blob, filename = 'storytype.png'): Promise<boolean> {
  const file = new File([blob], filename, { type: 'image/png' })
  if (!canShareFile(file)) return false
  try {
    await navigator.share({ files: [file], title: 'StoryType' })
    return true
  } catch (err) {
    if ((err as Error).name === 'AbortError') return true // user dismissed — still "handled"
    console.warn('[share] navigator.share failed', err)
    return false
  }
}

export function downloadImage(blob: Blob, filename = 'storytype.png'): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/**
 * Copy a PNG to the clipboard.
 * `makeBlob` is invoked synchronously so the resulting Promise<Blob> is created
 * inside the user gesture (required by Safari).
 */
export async function copyImage(makeBlob: () => Promise<Blob>): Promise<boolean> {
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return false
  // Attempt 1: Safari-friendly — pass a Promise<Blob> created inside the gesture.
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': makeBlob() })])
    return true
  } catch (err1) {
    // Attempt 2: Chromium/Firefox — resolve the blob first, then write.
    try {
      const blob = await makeBlob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return true
    } catch (err2) {
      console.warn('[share] clipboard copy failed', err1, err2)
      return false
    }
  }
}
