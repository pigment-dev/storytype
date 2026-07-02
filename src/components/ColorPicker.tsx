import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { hexToRgb, hsvToRgb, rgbToHex, rgbToHsv } from '../utils/color'
import type { HSV } from '../utils/color'
import { blurActiveEditable } from '../utils/dom'

const PRESETS = [
  '#ffffff', '#000000', '#8e8e93', '#ff2d55', '#ff375f', '#ff9500',
  '#ffcc00', '#34c759', '#00c7be', '#30b0c7', '#007aff', '#5856d6',
  '#af52de', '#ff6da3', '#7c8cff', '#b06dff', '#a2845e', '#f2c14e'
]

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/** WordPress Iris–style picker: saturation/value box + hue bar + hex + presets. Outputs #rrggbb. */
export function ColorPicker({
  value,
  onChange
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const [hsv, setHsv] = useState<HSV>(() => rgbToHsv(hexToRgb(value)))
  const [hexText, setHexText] = useState(() => rgbToHex(hexToRgb(value)))
  const hsvRef = useRef(hsv)
  hsvRef.current = hsv
  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  // Sync when value changes from outside, unless it already matches our state.
  useEffect(() => {
    const incoming = rgbToHex(hexToRgb(value)).toLowerCase()
    if (incoming !== rgbToHex(hsvToRgb(hsvRef.current)).toLowerCase()) {
      setHsv(rgbToHsv(hexToRgb(value)))
      setHexText(incoming)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function commit(next: HSV) {
    setHsv(next)
    const hex = rgbToHex(hsvToRgb(next))
    setHexText(hex)
    onChange(hex)
  }

  function applySV(clientX: number, clientY: number) {
    const el = svRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const s = clamp01((clientX - r.left) / r.width)
    const v = clamp01(1 - (clientY - r.top) / r.height)
    commit({ ...hsvRef.current, s, v })
  }
  function applyHue(clientX: number) {
    const el = hueRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    commit({ ...hsvRef.current, h: clamp01((clientX - r.left) / r.width) * 360 })
  }

  function startDrag(handler: (x: number, y: number) => void) {
    return (e: ReactPointerEvent) => {
      e.preventDefault()
      blurActiveEditable()
      handler(e.clientX, e.clientY)
      const move = (ev: PointerEvent) => handler(ev.clientX, ev.clientY)
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    }
  }

  function onHex(v: string) {
    setHexText(v)
    if (/^#?[0-9a-fA-F]{6}$/.test(v.trim()) || /^#?[0-9a-fA-F]{3}$/.test(v.trim())) {
      const hex = (v.startsWith('#') ? v : '#' + v).trim()
      setHsv(rgbToHsv(hexToRgb(hex)))
      onChange(rgbToHex(hexToRgb(hex)))
    }
  }

  const hueColor = rgbToHex(hsvToRgb({ h: hsv.h, s: 1, v: 1 }))
  const current = rgbToHex(hsvToRgb(hsv))

  return (
    <div className="cp">
      <div
        ref={svRef}
        className="cp-sv"
        style={{
          backgroundColor: hueColor,
          backgroundImage:
            'linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgba(255,255,255,0))'
        }}
        onPointerDown={startDrag(applySV)}
      >
        <div className="cp-sv-cursor" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }} />
      </div>

      <div ref={hueRef} className="cp-hue" onPointerDown={startDrag((x) => applyHue(x))}>
        <div className="cp-hue-thumb" style={{ left: `${(hsv.h / 360) * 100}%` }} />
      </div>

      <div className="cp-row">
        <span className="cp-preview" style={{ background: current }} />
        <input
          className="cp-hex"
          value={hexText}
          spellCheck={false}
          onChange={(e) => onHex(e.target.value)}
          aria-label="hex color"
        />
      </div>

      <div className="cp-swatches">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            className="cp-swatch"
            style={{ background: c }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => commit(rgbToHsv(hexToRgb(c)))}
          />
        ))}
      </div>
    </div>
  )
}
