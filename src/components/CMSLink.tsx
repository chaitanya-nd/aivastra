import Link from 'next/link'
import type { ReactNode } from 'react'
import { resolveLink } from '@/lib/links'

export function CMSLink({ link, children, className }: { link: any; children?: ReactNode; className?: string }) {
  const r = resolveLink(link)
  if (!r) return null
  const label = children ?? link.label
  if (r.newTab || /^https?:\/\//.test(r.href) || r.href.startsWith('mailto:'))
    return (
      <a href={r.href} className={className} {...(r.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {label}
      </a>
    )
  return (
    <Link href={r.href} className={className}>
      {label}
    </Link>
  )
}
