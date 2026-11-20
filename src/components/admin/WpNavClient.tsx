'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { STROKE } from './nav-icons'

export type Sub = { label: string; href: string; exact?: boolean; external?: boolean; noActive?: boolean }
export type MenuItem = { type?: 'sep'; label?: string; icon?: string; href?: string; exact?: boolean; sub?: Sub[]; badge?: number }

export function WpNavClient({ items }: { items: MenuItem[] }) {
  const path = usePathname() || ''
  const on = (href: string, exact?: boolean) => (exact ? path === href : path === href || path.startsWith(`${href}/`))
  return (
    <aside className="wpnav" aria-label="Main menu">
      <ul>
        {items.map((it, i) => {
          if (it.type === 'sep') return <li className="wpnav-sep" key={`s${i}`}>{it.label ? <span>{it.label}</span> : null}</li>
          const subs = it.sub ?? []
          const active = it.exact ? path === it.href : subs.some((s) => !s.external && !s.noActive && on(s.href, s.exact)) || (!subs.some((s) => s.noActive && s.href === it.href) && on(it.href!))
          return (
            <li key={it.label} className={`wpnav-i${active ? ' is-active' : ''}${subs.length ? ' has-sub' : ''}`}>
              <Link href={it.href!} className="wpnav-a">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={STROKE[it.icon!] ?? STROKE.page} /></svg>
                <span>{it.label}</span>
                {it.badge ? <b className="wpn-badge">{it.badge}</b> : null}
              </Link>
              {subs.length > 0 && (
                <ul className="wpnav-sub">
                  <li className="wpnav-sub-h">{it.label}</li>
                  {subs.map((s) => {
                    const cur = !s.external && !s.noActive && on(s.href, s.exact) && !subs.some((o) => o !== s && !o.external && o.href.length > s.href.length && on(o.href, o.exact))
                    return (
                      <li key={s.label} className={cur ? 'is-current' : ''}>
                        {s.external ? <a href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a> : <Link href={s.href}>{s.label}</Link>}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
