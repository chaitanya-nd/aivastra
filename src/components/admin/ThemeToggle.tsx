'use client'

import { useTheme } from '@payloadcms/ui'

const SUN = 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3m0 16v3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M1 12h3m16 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1'
const MOON = 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z'

/** Dark / light switch for the admin. Persists through Payload's own theme cookie. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Ic = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  return (
    <div className="wpt" role="group" aria-label="Colour theme">
      <button type="button" className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')} title="Light mode" aria-pressed={theme === 'light'}><Ic d={SUN} /></button>
      <button type="button" className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')} title="Dark mode" aria-pressed={theme === 'dark'}><Ic d={MOON} /></button>
    </div>
  )
}
