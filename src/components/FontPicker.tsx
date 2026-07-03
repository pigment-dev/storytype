import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CaretDown, X } from '@phosphor-icons/react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useAppStore } from '../store/useStore'
import { ensureBundledFont, ensureGoogleFont } from '../services/fonts'
import { setFontFamily } from '../editor/styleCommands'
import { useT } from '../i18n'
import { Seg, Switch } from './ui'
import type { FontEntry } from '../types'

type Subset = 'all' | 'arabic' | 'latin'

interface FontItem {
  family: string
  label: string
  source: 'bundled' | 'google'
  entry?: FontEntry
  subsets: string[]
}

const matches = (s: string, q: string) => !q || s.toLowerCase().includes(q.toLowerCase())
const subsetOk = (subsets: string[], subset: Subset) => subset === 'all' || subsets.includes(subset)
const sampleFor = (subsets: string[]) => (subsets.includes('arabic') ? 'سلام' : 'Ag')

function FontCard({
  item,
  active,
  fav,
  onPick,
  onFav
}: {
  item: FontItem
  active: boolean
  fav: boolean
  onPick: () => void
  onFav: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(item.source === 'bundled')

  useEffect(() => {
    if (ready) return
    const el = ref.current
    if (!el) return
    let done = false
    const io = new IntersectionObserver(
      (entries) => {
        if (!done && entries.some((e) => e.isIntersecting)) {
          done = true
          io.disconnect()
          ensureGoogleFont(item.family).catch(() => {}).finally(() => setReady(true))
        }
      },
      { rootMargin: '160px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ready, item.family])

  return (
    <div
      ref={ref}
      className={`fc${active ? ' active' : ''}${ready ? '' : ' loading'}`}
      role="button"
      tabIndex={0}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onPick()
        }
      }}
    >
      <button
        type="button"
        className={fav ? 'fc-star on' : 'fc-star'}
        title="favorite"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation()
          onFav()
        }}
      >
        {fav ? '★' : '☆'}
      </button>
      <div className="fc-preview" style={{ fontFamily: `'${item.family}', 'Vazirmatn', sans-serif` }}>
        {sampleFor(item.subsets)}
      </div>
      <div className="fc-name">{item.label}</div>
    </div>
  )
}

export function FontPicker() {
  const [editor] = useLexicalComposerContext()
  const lang = useAppStore((s) => s.lang)
  const fonts = useAppStore((s) => s.fonts)
  const googleFonts = useAppStore((s) => s.googleFonts)
  const googleEnabled = useAppStore((s) => s.googleEnabled)
  const setGoogleEnabled = useAppStore((s) => s.setGoogleEnabled)
  const current = useAppStore((s) => s.selection.fontFamily)
  const favorites = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const setSelection = useAppStore((s) => s.setSelection)
  const markLoaded = useAppStore((s) => s.markLoaded)
  const t = useT()

  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [subset, setSubset] = useState<Subset>('all')

  const items = useMemo<FontItem[]>(() => {
    const list: FontItem[] = []
    for (const f of fonts) {
      if (!subsetOk(f.subsets, subset)) continue
      list.push({
        family: f.family,
        label: (lang === 'fa' && f.displayName.fa) || f.displayName.en,
        source: 'bundled',
        entry: f,
        subsets: f.subsets
      })
    }
    if (googleEnabled) {
      for (const g of googleFonts) {
        if (!subsetOk(g.subsets, subset)) continue
        list.push({ family: g.family, label: g.family, source: 'google', subsets: g.subsets })
      }
    }
    return list
  }, [fonts, googleFonts, googleEnabled, subset, lang])

  const filtered = items.filter((i) => matches(i.family, q) || matches(i.label, q))
  const favSet = new Set(favorites)
  const favItems = filtered.filter((i) => favSet.has(i.family))
  const restItems = filtered.filter((i) => !favSet.has(i.family)).slice(0, 240)

  function pick(item: FontItem) {
    setFontFamily(editor, item.family)
    setSelection({ fontFamily: item.family })
    setOpen(false)
    const ensure =
      item.source === 'bundled' && item.entry
        ? ensureBundledFont(item.entry)
        : ensureGoogleFont(item.family)
    ensure.then(() => markLoaded(item.family)).catch((err) => {
      console.error('Failed to load font', item.family, err)
    })
  }

  const card = (item: FontItem) => (
    <FontCard
      key={item.source + '-' + item.family}
      item={item}
      active={item.family === current}
      fav={favSet.has(item.family)}
      onPick={() => pick(item)}
      onFav={() => toggleFavorite(item.family)}
    />
  )

  return (
    <div className="fontpicker">
      <button
        type="button"
        className="font-trigger"
        style={{ fontFamily: `'${current}', 'Vazirmatn', sans-serif` }}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(true)}
      >
        <span className="font-trigger-name">{current}</span>
        <span className="font-trigger-caret">
          <CaretDown size={14} />
        </span>
      </button>

      {open &&
        createPortal(
          <div className="fontmodal-overlay" onClick={() => setOpen(false)}>
            <div className="fontmodal" onClick={(e) => e.stopPropagation()}>
              <header className="fontmodal-h">
                <span>{t('text.font')}</span>
                <button
                  type="button"
                  className="fontmodal-close"
                  onClick={() => setOpen(false)}
                  aria-label={t('export.close')}
                >
                  <X size={16} weight="bold" />
                </button>
              </header>
              <div className="fontmodal-top">
                <input
                  className="field"
                  placeholder={t('font.search')}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <div className="fontmodal-filters">
                  <Seg<Subset>
                    options={[
                      { value: 'all', label: t('font.all') },
                      { value: 'arabic', label: t('font.persian'), title: 'Persian / Arabic' },
                      { value: 'latin', label: t('font.latin'), title: 'English / Latin' }
                    ]}
                    value={subset}
                    onChange={setSubset}
                  />
                  <label className="gf-toggle">
                    <span>{t('font.google')}</span>
                    <Switch checked={googleEnabled} onChange={setGoogleEnabled} />
                  </label>
                </div>
              </div>

              <div className="font-grid">
                {favItems.length > 0 && (
                  <>
                    <div className="font-grid-label">★ {t('font.favorites')}</div>
                    {favItems.map(card)}
                  </>
                )}
                <div className="font-grid-label">{t('font.all2')}</div>
                {restItems.map(card)}
                {filtered.length === 0 && <div className="font-empty">{t('font.empty')}</div>}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
