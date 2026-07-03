import type { ComponentType } from 'react'
import { TextSection } from './TextSection'
import { ColorFillSection } from './ColorFillSection'
import { OutlineSection } from './OutlineSection'
import { ShadowSection } from './ShadowSection'
import { DropShadowSection } from './DropShadowSection'
import { BoxSection } from './BoxSection'
import { LayoutSection } from './LayoutSection'
import { CanvasSection } from './CanvasSection'
import { PresetsSection } from './PresetsSection'

export interface SectionDef {
  key: string
  titleKey: string
  Component: ComponentType
}

// Order: text, layout, color, background box, text shadow, layer shadow, then
// the rest (outline, canvas, presets). Shared by the desktop sidebar and the
// mobile menu.
export const SECTIONS: SectionDef[] = [
  { key: 'text', titleKey: 'section.text', Component: TextSection },
  { key: 'layout', titleKey: 'section.layout', Component: LayoutSection },
  { key: 'colorFill', titleKey: 'section.colorFill', Component: ColorFillSection },
  { key: 'box', titleKey: 'section.box', Component: BoxSection },
  { key: 'textShadow', titleKey: 'section.textShadow', Component: ShadowSection },
  { key: 'dropShadow', titleKey: 'section.dropShadow', Component: DropShadowSection },
  { key: 'outline', titleKey: 'section.outline', Component: OutlineSection },
  { key: 'canvas', titleKey: 'section.canvas', Component: CanvasSection },
  { key: 'presets', titleKey: 'section.presets', Component: PresetsSection }
]
