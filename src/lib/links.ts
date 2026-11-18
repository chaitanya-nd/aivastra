import { getPath, withTrailingSlash } from './urls'

/** Resolve a CMS link group ({type, reference, url}) to an href. */
export function resolveLink(link: any): { href: string; newTab: boolean } | null {
  if (!link) return null
  const newTab = Boolean(link.newTab)
  if (link.type === 'reference' && link.reference?.value && typeof link.reference.value === 'object') {
    return { href: withTrailingSlash(getPath(link.reference.relationTo, link.reference.value)), newTab }
  }
  if (link.url) return { href: link.url, newTab }
  return null
}
