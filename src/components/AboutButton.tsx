import { useRef, useState } from 'react'
import { Info, GithubLogo, ArrowSquareOut } from '@phosphor-icons/react'
import { useT } from '../i18n'
import { Popover } from './ui'
import { Logo } from './Logo'

const GITHUB_URL = 'https://github.com/pigment-dev/storytype'
const SITE_URL = 'https://pigment.dev'

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
        <Info size={18} />
      </button>
      <Popover anchorRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <div className="about-pop">
          <div className="about-head">
            <Logo />
            <h2>StoryType</h2>
          </div>
          <p className="about-desc">{t('about.desc')}</p>
          <div className="about-links">
            <a className="about-link" href={SITE_URL} target="_blank" rel="noreferrer">
              Pigment Development
              <ArrowSquareOut size={14} />
            </a>
            <a className="about-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GithubLogo size={16} weight="fill" />
              {t('about.github')}
            </a>
          </div>
          <div className="about-foot">
            <span>{t('about.license')} · MIT</span>
            <span className="dot">·</span>
            <span>v{__APP_VERSION__}</span>
            <span className="dot">·</span>
            <span>build {__BUILD_ID__}</span>
          </div>
        </div>
      </Popover>
    </>
  )
}
