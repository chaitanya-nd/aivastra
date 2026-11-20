import { STROKE } from './nav-icons'

/** Inline stroke icon from the admin icon set. */
export function Ic({ n, className }: { n: string; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={STROKE[n]} /></svg>
}
