import { resolveLink } from '@/lib/links'
import type { ReactNode } from 'react'

type Item = { id?: string | null; link?: any; children?: { id?: string | null; link?: any }[] | null }

/** WordPress-style nav markup (ul.menu > li.menu-item[.menu-item-has-children] > ul.sub-menu), which the theme CSS/JS target. */
export function WpMenu({ items, id, className = 'menu' }: { items: Item[]; id?: string; className?: string }): ReactNode {
  return (
    <ul id={id} className={className}>
      {items.map((it, i) => {
        const l = resolveLink(it.link)
        if (!l) return null
        const kids = (it.children ?? []).map((c) => ({ c, l: resolveLink(c.link) })).filter((x) => x.l)
        return (
          <li key={it.id ?? i} className={`menu-item${kids.length ? ' menu-item-has-children' : ''}`}>
            <a href={l.href} {...(l.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {it.link.label}
            </a>
            {kids.length > 0 && (
              <ul className="sub-menu">
                {kids.map(({ c, l: cl }, j) => (
                  <li key={c.id ?? j} className="menu-item">
                    <a href={cl!.href}>{c.link.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
