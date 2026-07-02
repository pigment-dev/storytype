import { useState } from 'react'
import type { BlockStyle, SelectionStyle, StageStyle } from '../store/useStore'

export interface StylePreset {
  id: string
  name: string
  createdAt: number
  selection: SelectionStyle
  block: BlockStyle
  stage: StageStyle
}

const STORAGE_KEY = 'storytype:presets'

function readPresets(): StylePreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StylePreset[]) : []
  } catch {
    return []
  }
}

function writePresets(presets: StylePreset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

export function usePresets() {
  const [presets, setPresets] = useState<StylePreset[]>(() => readPresets())

  function save(name: string, snapshot: Pick<StylePreset, 'selection' | 'block' | 'stage'>): StylePreset {
    const preset: StylePreset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      createdAt: Date.now(),
      ...snapshot
    }
    setPresets((prev) => {
      const next = [...prev, preset]
      writePresets(next)
      return next
    })
    return preset
  }

  function remove(id: string): void {
    setPresets((prev) => {
      const next = prev.filter((p) => p.id !== id)
      writePresets(next)
      return next
    })
  }

  return { presets, save, remove }
}
