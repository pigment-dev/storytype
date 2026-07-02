// Rasterize a DOM node to a transparent, tightly-cropped PNG.
//
// Primary: snapdom (fast, high @font-face fidelity, Safari warm-up).
// Fallback: html-to-image (rendered twice for font embedding).
// Then: scan the alpha channel and crop to the non-transparent bounding box.

import { snapdom } from '@zumer/snapdom'
import * as htmlToImage from 'html-to-image'

export interface ExportResult {
  blob: Blob
  url: string
  width: number
  height: number
}

export interface ExportOptions {
  scale?: number
  trim?: boolean
}

export async function renderToCanvas(
  node: HTMLElement,
  scale: number
): Promise<HTMLCanvasElement> {
  await document.fonts.ready
  // 1) snapdom — omit backgroundColor => transparent.
  try {
    const api = snapdom as unknown as {
      toCanvas?: (el: HTMLElement, o?: Record<string, unknown>) => Promise<HTMLCanvasElement>
    }
    if (typeof api.toCanvas === 'function') {
      return await api.toCanvas(node, { scale, embedFonts: true })
    }
    const capture = await (snapdom as unknown as (
      el: HTMLElement,
      o?: Record<string, unknown>
    ) => Promise<{ toCanvas: () => Promise<HTMLCanvasElement> }>)(node, {
      scale,
      embedFonts: true
    })
    return await capture.toCanvas()
  } catch (err) {
    console.warn('[export] snapdom failed, falling back to html-to-image', err)
  }
  // 2) html-to-image — render twice so fonts embed on the second pass.
  await htmlToImage.toCanvas(node, { pixelRatio: scale, cacheBust: true }).catch(() => {})
  return htmlToImage.toCanvas(node, { pixelRatio: scale, cacheBust: true })
}

/** Crop a canvas to the bounding box of its non-transparent pixels. */
export function trimTransparent(src: HTMLCanvasElement, padding = 0): HTMLCanvasElement {
  const ctx = src.getContext('2d')
  if (!ctx) return src
  const { width, height } = src
  if (!width || !height) return src
  const { data } = ctx.getImageData(0, 0, width, height)

  let top = height,
    left = width,
    right = 0,
    bottom = 0
  let found = false
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] !== 0) {
        found = true
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }
  if (!found) return src

  left = Math.max(0, left - padding)
  top = Math.max(0, top - padding)
  right = Math.min(width - 1, right + padding)
  bottom = Math.min(height - 1, bottom + padding)

  const w = right - left + 1
  const h = bottom - top + 1
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  out.getContext('2d')!.drawImage(src, left, top, w, h, 0, 0, w, h)
  return out
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('canvas.toBlob returned null'))),
      'image/png'
    )
  })
}

export async function exportPng(
  node: HTMLElement,
  opts: ExportOptions = {}
): Promise<ExportResult> {
  const scale = opts.scale ?? 3
  const trim = opts.trim ?? true
  let canvas = await renderToCanvas(node, scale)
  if (trim) canvas = trimTransparent(canvas, Math.round(scale)) // keep 1px of breathing room
  const blob = await canvasToBlob(canvas)
  return { blob, url: URL.createObjectURL(blob), width: canvas.width, height: canvas.height }
}
