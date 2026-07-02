import { useT } from '../i18n'
import { Section } from './ui'
import { PresetsSection } from './sections/PresetsSection'
import { CanvasSection } from './sections/CanvasSection'
import { TextSection } from './sections/TextSection'
import { ColorFillSection } from './sections/ColorFillSection'
import { OutlineSection } from './sections/OutlineSection'
import { ShadowSection } from './sections/ShadowSection'
import { BoxSection } from './sections/BoxSection'
import { DropShadowSection } from './sections/DropShadowSection'
import { LayoutSection } from './sections/LayoutSection'

export function Controls() {
  const t = useT()
  return (
    <div className="controls">
      <Section title={t('section.presets')}>
        <PresetsSection />
      </Section>
      <Section title={t('section.canvas')}>
        <CanvasSection />
      </Section>
      <Section title={t('section.text')}>
        <TextSection />
      </Section>
      <Section title={t('section.colorFill')}>
        <ColorFillSection />
      </Section>
      <Section title={t('section.outline')}>
        <OutlineSection />
      </Section>
      <Section title={t('section.textShadow')}>
        <ShadowSection />
      </Section>
      <Section title={t('section.box')}>
        <BoxSection />
      </Section>
      <Section title={t('section.dropShadow')}>
        <DropShadowSection />
      </Section>
      <Section title={t('section.layout')}>
        <LayoutSection />
      </Section>
    </div>
  )
}
