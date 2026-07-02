import { useRef, useState } from 'react'
import { useT } from '../i18n'
import { Popover } from './ui'

const GITHUB_URL = 'https://github.com/pigment-dev/storytype'
const DESCRIPTION =
  'Type Persian or English, style it richly, export as a tight transparent PNG for Instagram stories. By Pigment Development.'

export function AboutButton() {
  const t = useT()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="icon-btn"
        title={t('about.title')}
        aria-label={t('about.title')}
        onClick={() => setOpen((o) => !o)}
      >
        ⓘ
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="about-pop">
          <h2>StoryType</h2>
          <p>{DESCRIPTION}</p>
          <dl>
            <dt>{t('about.license')}</dt>
            <dd>MIT</dd>
            <dt>{t('about.github')}</dt>
            <dd>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                {GITHUB_URL.replace('https://', '')}
              </a>
            </dd>
          </dl>
          <div className="about-version">
            v{__APP_VERSION__} · build {__BUILD_ID__}
          </div>
          <a className="about-by" href="https://pigment.dev" target="_blank" rel="noreferrer">
            Pigment Development
          </a>
        </div>
      </Popover>
    </>
  )
}
