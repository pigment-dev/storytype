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

// Order: font first, then fill/color, outline, shadows, box, layout, canvas,
// presets last. Shared by the desktop sidebar and the mobile settings sheet.
export const SECTIONS: SectionDef[] = [
  { key: 'text', titleKey: 'section.text', Component: TextSection },
  { key: 'colorFill', titleKey: 'section.colorFill', Component: ColorFillSection },
  { key: 'outline', titleKey: 'section.outline', Component: OutlineSection },
  { key: 'textShadow', titleKey: 'section.textShadow', Component: ShadowSection },
  { key: 'dropShadow', titleKey: 'section.dropShadow', Component: DropShadowSection },
  { key: 'box', titleKey: 'section.box', Component: BoxSection },
  { key: 'layout', titleKey: 'section.layout', Component: LayoutSection },
  { key: 'canvas', titleKey: 'section.canvas', Component: CanvasSection },
  { key: 'presets', titleKey: 'section.presets', Component: PresetsSection }
]
