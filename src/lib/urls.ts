/**
 * Single source of truth for public URLs. Mirrors the WordPress permalink
 * structure (/%postname%/, plus CPT bases) so rankings carry over.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100').replace(
  /\/$/,
  '',
)

export type RoutableCollection =
  | 'pages'
  | 'posts'
  | 'guides'
  | 'cases'
  | 'updates'
  | 'reviews'
  | 'categories'
  | 'tags'
  | 'section-categories'

type Doc = {
  slug?: string | null
  kind?: string | null
  breadcrumbs?: { url?: string | null }[] | null
}

export const COLLECTION_BASE: Record<string, string> = {
  guides: '/guide',
  cases: '/case',
  updates: '/updates',
  reviews: '/review',
  categories: '/category',
  tags: '/tag',
}

const SECTION_BASE: Record<string, string> = {
  guide: '/guide-category',
  case: '/case-category',
  update: '/update-category',
}

/**
 * URL of a page's last nested-docs breadcrumb. In the admin, form data can hold `breadcrumbs` as a
 * row count or object instead of an array, so never assume `.at` exists.
 */
export function lastCrumbUrl(doc: { breadcrumbs?: unknown } | null | undefined): string | undefined {
  const b = doc?.breadcrumbs
  if (!Array.isArray(b) || b.length === 0) return undefined
  const url = (b[b.length - 1] as { url?: unknown } | null)?.url
  return typeof url === 'string' && url ? url : undefined
}

export function getPath(collection: string, doc: Doc | null | undefined): string {
  if (!doc?.slug) return '/'
  switch (collection) {
    case 'pages': {
      if (doc.slug === 'home') return '/'
      return lastCrumbUrl(doc) || `/${doc.slug}`
    }
    case 'posts':
      return `/${doc.slug}`
    case 'section-categories':
      return `${SECTION_BASE[doc.kind || 'guide'] || '/guide-category'}/${doc.slug}`
    default:
      return `${COLLECTION_BASE[collection] || ''}/${doc.slug}`
  }
}

export const absoluteUrl = (path: string): string => `${SITE_URL}${withTrailingSlash(path)}`

export const withTrailingSlash = (path: string) =>
  path === '/' || path.endsWith('/') ? path : `${path}/`
