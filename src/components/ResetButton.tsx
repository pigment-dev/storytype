import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { useT } from '../i18n'
import { useResetStyles } from '../hooks/useResetStyles'

/** Desktop toolbar reset (must live inside the Lexical composer to reach the editor). */
export function ResetButton() {
  const t = useT()
  const reset = useResetStyles()
  return (
    <button type="button" className="icon-btn" onClick={reset} title={t('reset')} aria-label={t('reset')}>
      <ArrowCounterClockwise size={18} />
    </button>
  )
}
