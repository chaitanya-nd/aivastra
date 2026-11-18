import type { Metadata } from 'next'
import { crawlersBlocked } from './env'
import { snippet } from './richtext'
import { absoluteUrl, getPath, SITE_URL } from './urls'

type AnyDoc = Record<string, any>

const mediaUrl = (m: any, size?: string): string | undefined => {
  if (!m || typeof m !== 'object') return undefined
  const u = (size && m.sizes?.[size]?.url) || m.url
  if (!u) return undefined
  return u.startsWith('http') ? u : `${SITE_URL}${u}`
}
export { mediaUrl }

const SEP_DEFAULT = '-'
/** Rank Math-style template variables. */
export function applyVars(tpl: string, ctx: Record<string, string | undefined>) {
  return tpl
    .replace(/%([a-z_]+)%/g, (_, k) => ctx[k] ?? '')
    .replace(/\s+/g, ' ')
    .replace(/^\s*[-–—·•|»~]\s+|\s+[-–—·•|»~]\s*$/g, '')
    .trim()
}
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '')

/** Next.js Metadata from the CMS SEO fields + site defaults (Rank Math equivalent). */
export function buildMetadata(opts: {
  collection: string
  doc: AnyDoc
  settings: AnyDoc
  path?: string
  type?: 'website' | 'article'
}): Metadata {
  const { collection, doc, settings } = opts
  const meta = doc.meta ?? {}
  const path = opts.path ?? getPath(collection, doc)
  const rawTitle: string = meta.title || doc.title || doc.name || settings.siteName
  const tcfg = settings[collection] ?? {}
  const vars: Record<string, string | undefined> = {
    title: doc.title || doc.name || settings.siteName,
    sitename: settings.siteName,
    sitedesc: settings.tagline,
    sep: settings.separator || SEP_DEFAULT,
    excerpt: doc.excerpt || undefined,
    category: doc.primaryCategory?.name || doc.categories?.[0]?.name,
    date: fmtDate(doc.publishedAt),
    modified: fmtDate(doc.updatedAt),
    name: doc.author?.name,
    term: doc.name,
    term_description: doc.description,
    page: '',
    currentyear: String(new Date().getFullYear()),
  }
  // Rank Math behaviour: a custom SEO title is used exactly as typed; otherwise the per-type "Title" template, then the fallback template.
  const isHome = collection === 'pages' && doc.slug === 'home'
  const tpl = tcfg.title || (settings.titleTemplate ? settings.titleTemplate.replace('%s', '%title%') : '%title% %sep% %sitename%')
  const title = isHome && settings.homeTitle ? { absolute: settings.homeTitle } : meta.title ? { absolute: rawTitle } : { absolute: applyVars(tpl, vars) || rawTitle }
  const description: string | undefined =
    (isHome && settings.homeDescription) || meta.description || (tcfg.description ? applyVars(tcfg.description, vars) || undefined : undefined) || doc.excerpt || (['guides', 'cases', 'updates', 'reviews'].includes(collection) ? snippet(doc) : undefined) || doc.description || settings.defaultDescription || undefined
  const image =
    mediaUrl(meta.image, 'og') ||
    mediaUrl(doc.featuredImage, 'og') ||
    doc.featuredImageUrl ||
    mediaUrl(settings.defaultOgImage, 'og')
  const canonical = meta.canonicalUrl || absoluteUrl(path)
  const typeRobots: string[] = [...(tcfg.robots ?? []), ...(settings.robotsGlobal ?? [])]
  const noindex = Boolean(meta.noindex) || typeRobots.includes('noindex') || crawlersBlocked(settings)

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    robots: {
      index: !noindex,
      follow: !(meta.nofollow || typeRobots.includes('nofollow') || crawlersBlocked(settings)),
      ...(typeRobots.includes('noarchive') ? { noarchive: true } : {}),
      ...(typeRobots.includes('nosnippet') ? { nosnippet: true } : {}),
      ...(typeRobots.includes('noimageindex') ? { noimageindex: true } : {}),
    },
    openGraph: {
      type: opts.type ?? 'website',
      url: canonical,
      siteName: settings.siteName,
      title: meta.ogTitle || rawTitle,
      description: meta.ogDescription || description,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      ...(opts.type === 'article'
        ? { publishedTime: doc.publishedAt, modifiedTime: doc.updatedAt }
        : {}),
    },
    twitter: {
      card: image ? ((settings.twitterCard as any) || 'summary_large_image') : 'summary',
      title: meta.ogTitle || rawTitle,
      description: meta.ogDescription || description,
      images: image ? [image] : undefined,
      site: settings.twitterHandle || undefined,
    },
  }
}
