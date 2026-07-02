import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
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
