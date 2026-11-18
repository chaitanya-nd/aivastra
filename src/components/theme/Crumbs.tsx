import { getPluginSettings } from '@/lib/data'

/**
 * Theme breadcrumb trail (.inrpg-breadcrumbs) driven by Plugin settings → Breadcrumbs:
 * separator, home label / visibility, link the current item, hide everywhere.
 */
export async function Crumbs({ items, home = false }: { items: { label: string; url: string }[]; home?: boolean }) {
  const ps: any = await getPluginSettings()
  if (ps?.bcHide) return null
  const sep = ps?.bcSeparator && ps.bcSeparator !== 'arrow' ? ps.bcSeparator : null
  const all = [...(home && ps?.bcShowHome !== false ? [{ label: ps?.bcHomeLabel || 'Home', url: '/' }] : []), ...items]
  return (
    <div className="inrpg-breadcrumbs" style={sep ? { backgroundImage: 'none', paddingLeft: 0 } : undefined}>
      {all.map((c, i) => {
        const last = i === all.length - 1
        const href = c.url === '/' ? '/' : `${c.url.replace(/\/$/, '')}/`
        return (
          <span key={i}>
            {last && !ps?.bcLinkCurrent ? <span aria-current="page">{c.label}</span> : <a href={href}>{c.label}</a>}
            {!last && (sep ? <span className="saparator" style={{ backgroundImage: 'none', fontSize: 'inherit', padding: '0 8px', lineHeight: 'inherit' }}> {sep} </span> : <span className="saparator"> &gt; </span>)}
          </span>
        )
      })}
    </div>
  )
}
