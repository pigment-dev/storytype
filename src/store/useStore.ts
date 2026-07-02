import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FontEntry, GoogleFontMeta } from '../types'

export type Lang = 'fa' | 'en'

/** Current selection's inline style, reflected into the toolbar. */
export interface SelectionStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  italic: boolean
  underline: boolean
  strike: boolean
  color: string
  strokeWidth: number
  strokeColor: string
  shadowEnabled: boolean
  shadowColor: string
  shadowAlpha: number
  shadowBlur: number
  shadowX: number
  shadowY: number
}

/** Whole-stage (block-level) styling. */
export interface BlockStyle {
  textAlign: 'start' | 'center' | 'end' | 'justify'
  lineHeight: number
  letterSpacing: number
  direction: 'auto' | 'rtl' | 'ltr'
  boxEnabled: boolean
  boxColor: string
  boxAlpha: number
  boxPadding: number
  boxRadius: number
  borderWidth: number
  borderColor: string
  dropEnabled: boolean
  dropColor: string
  dropAlpha: number
  dropBlur: number
  dropX: number
  dropY: number
  gradientEnabled: boolean
  gradientFrom: string
  gradientTo: string
  gradientAngle: number
}

export type StageBg = 'checker' | 'dark' | 'light' | 'custom'

export interface StageStyle {
  bg: StageBg
  color: string
}

export interface ExportSettings {
  scale: number
}

interface BaseDefaults {
  fontFamily: string
  fontSize: number
  color: string
}

interface AppState {
  lang: Lang
  fonts: FontEntry[]
  googleFonts: GoogleFontMeta[]
  googleEnabled: boolean
  favorites: string[]
  loaded: Record<string, boolean>
  fontsReady: boolean
  base: BaseDefaults
  selection: SelectionStyle
  block: BlockStyle
  stage: StageStyle
  export: ExportSettings
  setLang: (l: Lang) => void
  setFonts: (f: FontEntry[]) => void
  setGoogleFonts: (f: GoogleFontMeta[]) => void
  setGoogleEnabled: (v: boolean) => void
  toggleFavorite: (family: string) => void
  markLoaded: (family: string) => void
  setFontsReady: (v: boolean) => void
  setBase: (patch: Partial<BaseDefaults>) => void
  setSelection: (patch: Partial<SelectionStyle>) => void
  setBlock: (patch: Partial<BlockStyle>) => void
  setStage: (patch: Partial<StageStyle>) => void
  setExport: (patch: Partial<ExportSettings>) => void
  resetStyles: () => void
}

export const DEFAULT_SELECTION: SelectionStyle = {
  fontFamily: 'Vazirmatn',
  fontSize: 72,
  fontWeight: 700,
  italic: false,
  underline: false,
  strike: false,
  color: '#ffffff',
  strokeWidth: 0,
  strokeColor: '#000000',
  shadowEnabled: false,
  shadowColor: '#000000',
  shadowAlpha: 0.5,
  shadowBlur: 6,
  shadowX: 0,
  shadowY: 4
}

export const DEFAULT_BLOCK: BlockStyle = {
  textAlign: 'center',
  lineHeight: 1.25,
  letterSpacing: 0,
  direction: 'auto',
  boxEnabled: false,
  boxColor: '#000000',
  boxAlpha: 0.45,
  boxPadding: 24,
  boxRadius: 18,
  borderWidth: 0,
  borderColor: '#ffffff',
  dropEnabled: false,
  dropColor: '#000000',
  dropAlpha: 0.55,
  dropBlur: 12,
  dropX: 0,
  dropY: 10,
  gradientEnabled: false,
  gradientFrom: '#ff5f6d',
  gradientTo: '#ffc371',
  gradientAngle: 90
}

const DEFAULT_STAGE: StageStyle = { bg: 'dark', color: '#111318' }

const DEFAULT_BASE: BaseDefaults = {
  fontFamily: 'Vazirmatn',
  fontSize: 72,
  color: '#ffffff'
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: 'fa',
      fonts: [],
      googleFonts: [],
      googleEnabled: false,
      favorites: [],
      loaded: {},
      fontsReady: false,
      base: { ...DEFAULT_BASE },
      selection: { ...DEFAULT_SELECTION },
      block: { ...DEFAULT_BLOCK },
      stage: { ...DEFAULT_STAGE },
      export: { scale: 4 },

      setLang: (lang) => set({ lang }),
      setFonts: (fonts) => set({ fonts }),
      setGoogleFonts: (googleFonts) => set({ googleFonts }),
      setGoogleEnabled: (googleEnabled) => set({ googleEnabled }),
      toggleFavorite: (family) =>
        set((s) => ({
          favorites: s.favorites.includes(family)
            ? s.favorites.filter((f) => f !== family)
            : [...s.favorites, family]
        })),
      markLoaded: (family) => set((s) => ({ loaded: { ...s.loaded, [family]: true } })),
      setFontsReady: (fontsReady) => set({ fontsReady }),
      setBase: (patch) => set((s) => ({ base: { ...s.base, ...patch } })),
      setSelection: (patch) => set((s) => ({ selection: { ...s.selection, ...patch } })),
      setBlock: (patch) => set((s) => ({ block: { ...s.block, ...patch } })),
      setStage: (patch) => set((s) => ({ stage: { ...s.stage, ...patch } })),
      setExport: (patch) => set((s) => ({ export: { ...s.export, ...patch } })),
      resetStyles: () =>
        set({ selection: { ...DEFAULT_SELECTION }, block: { ...DEFAULT_BLOCK } })
    }),
    {
      name: 'storytype:settings',
      partialize: (s) => ({
        lang: s.lang,
        googleEnabled: s.googleEnabled,
        favorites: s.favorites,
        base: s.base,
        block: s.block,
        stage: s.stage,
        export: s.export
      })
    }
  )
)
