import { useEffect, useState } from 'react'

// Keep in sync with the `@media (max-width: 900px)` breakpoint in src/styles/index.css.
const QUERY = '(max-width: 900px)'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
