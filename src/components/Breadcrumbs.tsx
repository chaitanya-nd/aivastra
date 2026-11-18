import Link from 'next/link'
import { breadcrumbSchema } from '@/lib/schema'
import { withTrailingSlash } from '@/lib/urls'
import { getPluginSettings } from '@/lib/data'
import { JsonLd } from './JsonLd'

export type Crumb = { name: string; path: string }

export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ps = await getPluginSettings()
  if (ps?.bcHide) return null
  const all = [...(ps?.bcShowHome === false ? [] : [{ name: ps?.bcHomeLabel || 'Home', path: '/' }]), ...items]
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <JsonLd data={breadcrumbSchema(all)} />
      <ol>
        {all.map((c, i) => (
          <li key={c.path + i}>
            {i < all.length - 1 || ps?.bcLinkCurrent ? <Link href={withTrailingSlash(c.path)}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
