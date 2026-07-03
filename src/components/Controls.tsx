import { useT } from '../i18n'
import { Section } from './ui'
import { SECTIONS } from './sections/registry'

export function Controls() {
  const t = useT()
  return (
    <div className="controls">
      {SECTIONS.map(({ key, titleKey, Component }) => (
        <Section key={key} title={t(titleKey)}>
          <Component />
        </Section>
      ))}
    </div>
  )
}
