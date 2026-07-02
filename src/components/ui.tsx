import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject
} from 'react'
import { ColorPicker } from './ColorPicker'
import { blurActiveEditable } from '../utils/dom'

export function Section({
  title,
  children,
  action
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="section">
      <header className="section-h">
        <span>{title}</span>
        {action}
      </header>
      <div className="section-body">{children}</div>
    </section>
  )
}

export function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="row">
      {label !== undefined && <span className="row-label">{label}</span>}
      <span className="row-control">{children}</span>
    </div>
  )
}

/** Custom pointer-driven slider (native <input type=range> was janky to drag). */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = ''
}: {
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  suffix?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [local, setLocal] = useState(value)
  const v = dragging ? local : value
  const pct = max > min ? ((v - min) / (max - min)) * 100 : 0

  function valueFromX(clientX: number): number {
    const el = trackRef.current
    if (!el) return v
    const r = el.getBoundingClientRect()
    let ratio = (clientX - r.left) / r.width
    if (getComputedStyle(el).direction === 'rtl') ratio = 1 - ratio
    ratio = Math.max(0, Math.min(1, ratio))
    let val = min + ratio * (max - min)
    val = Math.round(val / step) * step
    val = Math.max(min, Math.min(max, val))
    return parseFloat(val.toFixed(4))
  }

  function onPointerDown(e: ReactPointerEvent) {
    e.preventDefault()
    blurActiveEditable()
    if (e.pointerType !== 'touch') trackRef.current?.focus()
    setDragging(true)
    const first = valueFromX(e.clientX)
    setLocal(first)
    onChange(first)
    const move = (ev: PointerEvent) => {
      const n = valueFromX(ev.clientX)
      setLocal(n)
      onChange(n)
    }
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    let nv = v
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') nv = v + step
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') nv = v - step
    else if (e.key === 'Home') nv = min
    else if (e.key === 'End') nv = max
    else return
    e.preventDefault()
    onChange(parseFloat(Math.max(min, Math.min(max, nv)).toFixed(4)))
  }

  return (
    <span className="slider">
      <div
        ref={trackRef}
        className="slider-track"
        role="slider"
        tabIndex={0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={v}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <div className="slider-rail" />
        <div className="slider-fill" style={{ width: `${pct}%` }} />
        <div className="slider-thumb" style={{ insetInlineStart: `${pct}%` }} />
      </div>
      <span className="slider-val">
        {Math.round(v * 100) / 100}
        {suffix}
      </span>
    </span>
  )
}

/** Color field: a swatch that opens a custom Iris-style color picker in a portal. */
export function ColorField({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
  presetsLabel?: string
  customLabel?: string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!open) return
    const reposition = () => {
      const el = btnRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const W = 236
      const H = 328
      const M = 8
      let left = Math.min(r.left, window.innerWidth - W - M)
      left = Math.max(M, left)
      let top = r.bottom + 8
      if (top + H > window.innerHeight - M) top = Math.max(M, r.top - H - 8)
      setPos({ top, left })
    }
    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

  return (
    <span className="colorfield">
      <button
        ref={btnRef}
        type="button"
        className="color-swatch"
        style={{ background: value }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        aria-label="color"
      />
      {open &&
        createPortal(
          <>
            <div className="popover-backdrop" onClick={() => setOpen(false)} />
            <div className="color-pop" style={{ top: pos.top, left: pos.left }}>
              <ColorPicker value={value} onChange={onChange} />
            </div>
          </>,
          document.body
        )}
    </span>
  )
}

interface PopoverPos {
  left: number
  tailLeft: number
  flip: boolean
  offset: number
  maxHeight: number
}

/** Generic anchored popover with a triangular tail pointing at its trigger.
 * Flips above/below the anchor depending on available viewport space. */
export function Popover({
  anchorRef,
  open,
  onClose,
  children
}: {
  anchorRef: RefObject<HTMLElement | null>
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const [pos, setPos] = useState<PopoverPos | null>(null)

  useEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const reposition = () => {
      const el = anchorRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const M = 8
      const W = Math.min(320, window.innerWidth - M * 2)
      let left = r.left + r.width / 2 - W / 2
      left = Math.max(M, Math.min(left, window.innerWidth - W - M))
      const spaceAbove = r.top
      const spaceBelow = window.innerHeight - r.bottom
      const flip = spaceAbove > spaceBelow
      const offset = flip ? window.innerHeight - r.top + 10 : r.bottom + 10
      const tailLeft = Math.max(16, Math.min(r.left + r.width / 2 - left, W - 16))
      // Clamp the box height to whatever room the chosen side actually has, so it
      // can never render with its top above 0 or its bottom past innerHeight —
      // the CSS max-height (min(70vh, 520px)) alone doesn't account for a cramped
      // anchor position, only for viewport size.
      const naturalMax = Math.min(window.innerHeight * 0.7, 520)
      const available = (flip ? spaceAbove : spaceBelow) - 10 - M
      // No artificial floor here: any floor above 0 can exceed `available` on
      // cramped viewports and push the popover past the viewport edge. The
      // only safe floor is 0, guarding against a negative/zero `available`
      // (e.g. an off-screen anchor) producing an invalid negative max-height.
      // overflow-y: auto (in CSS) keeps content scrollable if it doesn't fit.
      const maxHeight = Math.max(0, Math.min(naturalMax, available))
      setPos({ left, tailLeft, flip, offset, maxHeight })
    }
    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !pos) return null

  return createPortal(
    <>
      <div className="popover-backdrop" onClick={onClose} />
      <div
        className={pos.flip ? 'popover popover-up' : 'popover popover-down'}
        style={{
          left: pos.left,
          maxHeight: pos.maxHeight,
          ...(pos.flip ? { bottom: pos.offset } : { top: pos.offset })
        }}
      >
        <div className="popover-tail" style={{ left: pos.tailLeft }} />
        <div className="popover-body">{children}</div>
      </div>
    </>,
    document.body
  )
}

export function Seg<T extends string>({
  options,
  value,
  onChange
}: {
  options: { value: T; label: ReactNode; title?: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <span className="seg">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          className={o.value === value ? 'seg-btn active' : 'seg-btn'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </span>
  )
}

export function ToggleBtn({
  active,
  onClick,
  title,
  children
}: {
  active: boolean
  onClick: () => void
  title?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      className={active ? 'tbtn active' : 'tbtn'}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function Switch({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={checked ? 'switch on' : 'switch'}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onChange(!checked)}
    >
      <span className="knob" />
    </button>
  )
}
