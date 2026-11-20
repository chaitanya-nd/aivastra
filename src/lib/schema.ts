import { absoluteUrl, SITE_URL } from './urls'
import { mediaUrl } from './seo'

type A = Record<string, any>

export const organizationSchema = (s: A) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': s.orgType || 'Organization',
      '@id': `${SITE_URL}/#organization`,
      ...localBusiness(s),
      name: s.siteName,
      legalName: s.legalName || undefined,
      url: `${SITE_URL}/`,
      logo: mediaUrl(s.logo) ,
      email: s.email || undefined,
      telephone: s.phone || undefined,
      sameAs: [...(s.facebookUrl ? [s.facebookUrl] : []), ...(s.socials || []).map((x: A) => x.url)].filter((u, i, a) => u && a.indexOf(u) === i),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: s.siteName,
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search/?s={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
})

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
})

export const faqSchema = (items: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: { '@type': 'Answer', text: q.answer },
  })),
})

const ARTICLE_TYPES = ['Article', 'BlogPosting', 'NewsArticle', 'WebPage']
const clean = (o: A): A => JSON.parse(JSON.stringify(o, (_, v) => (v === '' || v === null || (Array.isArray(v) && !v.length) ? undefined : v)))

/** Article JSON-LD, plus the Rank Math-style "Schema details" type (HowTo, Product, …) when one is selected. */
export const articleSchema = (doc: A, path: string, s: A, type = 'BlogPosting') => {
  const chosen = doc.meta?.schemaType
  const url = absoluteUrl(path)
  const image = mediaUrl(doc.meta?.image) || mediaUrl(doc.featuredImage) || doc.featuredImageUrl || undefined
  const author = doc.author && typeof doc.author === 'object'
    ? { '@type': 'Person', name: doc.author.name, ...(doc.author.slug ? { url: absoluteUrl(`/author/${doc.author.slug}/`) } : {}), ...(doc.author.jobTitle ? { jobTitle: doc.author.jobTitle } : {}) }
    : { '@id': `${SITE_URL}/#organization` }
  const article = {
    '@type': ARTICLE_TYPES.includes(chosen) ? chosen : type,
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: doc.meta?.title || doc.title,
    description: doc.meta?.description || doc.excerpt || undefined,
    image,
    datePublished: doc.publishedAt || doc.createdAt,
    dateModified: doc.modifiedAt || doc.updatedAt,
    author,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    ...(doc.meta?.focusKeyword ? { keywords: [doc.meta.focusKeyword, ...String(doc.meta.secondaryKeywords || '').split(',').map((k: string) => k.trim()).filter(Boolean)].join(', ') } : {}),
  }
  const extra = typedSchema(doc, url, image)
  void s
  return { '@context': 'https://schema.org', '@graph': [clean(article), ...(extra ? [clean(extra)] : [])] }
}

/** Schema builder output for the non-article types (fields in SEO → Schema → Schema details). */
export function typedSchema(doc: A, url: string, image?: string): A | null {
  const t = doc.meta?.schemaType
  const d: A = doc.meta?.schemaData || {}
  const name = d.name || doc.meta?.title || doc.title
  const description = d.description || doc.meta?.description || doc.excerpt || undefined
  const offer = d.price ? { '@type': 'Offer', price: d.price, priceCurrency: d.currency || 'INR', availability: d.availability ? `https://schema.org/${d.availability}` : undefined, url } : undefined
  const rating = d.ratingValue ? { '@type': 'AggregateRating', ratingValue: d.ratingValue, reviewCount: d.reviewCount || 1, bestRating: 5 } : undefined
  const base = { '@id': `${url}#${String(t).toLowerCase()}`, name, description, url, image }
  switch (t) {
    case 'HowTo':
      return { '@type': 'HowTo', ...base, totalTime: d.totalTime, step: (d.steps || []).map((st: A, i: number) => ({ '@type': 'HowToStep', position: i + 1, name: st.name, text: st.text || st.name, image: st.image })) }
    case 'Product':
      return { '@type': 'Product', ...base, brand: d.brand ? { '@type': 'Brand', name: d.brand } : undefined, sku: d.sku, offers: offer, aggregateRating: rating }
    case 'SoftwareApplication':
      return { '@type': 'SoftwareApplication', ...base, applicationCategory: d.applicationCategory || 'BusinessApplication', operatingSystem: d.operatingSystem || 'Web', offers: offer, aggregateRating: rating }
    case 'Course':
      return { '@type': 'Course', ...base, provider: { '@type': 'Organization', name: d.provider || 'AI Vastra', sameAs: SITE_URL }, offers: offer, aggregateRating: rating }
    case 'Event':
      return { '@type': 'Event', ...base, startDate: d.startDate, endDate: d.endDate, eventAttendanceMode: d.eventMode ? `https://schema.org/${d.eventMode}` : undefined, location: d.location ? (/^https?:/.test(d.location) ? { '@type': 'VirtualLocation', url: d.location } : { '@type': 'Place', name: d.location }) : undefined, offers: offer, organizer: { '@id': `${SITE_URL}/#organization` } }
    case 'VideoObject':
      return { '@type': 'VideoObject', ...base, contentUrl: d.videoUrl, embedUrl: d.videoUrl, thumbnailUrl: d.thumbnailUrl || image, uploadDate: d.uploadDate || doc.publishedAt, duration: d.duration }
    default:
      return null
  }
}

/** Local SEO: structured address, geo, opening hours, price range (only what is filled in). */
function localBusiness(s: A): A {
  const a = s.localAddress || {}
  const hasAddr = a.street || a.locality || a.postalCode
  const out: A = {}
  if (hasAddr) out.address = { '@type': 'PostalAddress', streetAddress: a.street || undefined, addressLocality: a.locality || undefined, addressRegion: a.region || undefined, postalCode: a.postalCode || undefined, addressCountry: a.country || undefined }
  else if (s.address) out.address = String(s.address)
  if (s.geoLat != null && s.geoLng != null) out.geo = { '@type': 'GeoCoordinates', latitude: s.geoLat, longitude: s.geoLng }
  if (s.priceRange) out.priceRange = s.priceRange
  const hours = (s.openingHours || []).filter((h: A) => h.days?.length && h.opens && h.closes)
  if (hours.length) out.openingHoursSpecification = hours.map((h: A) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes }))
  if (s.foundingYear) out.foundingDate = String(s.foundingYear)
  return out
}

const TYPE_KEY: Record<string, string> = { posts: 'posts', pages: 'pages', guides: 'guides', cases: 'cases', updates: 'updates', reviews: 'reviews' }
/** Titles & Meta → Post types → Schema Type: the default when a document leaves its schema on "Automatic". */
export function withDefaultSchema(doc: A, collection: string, s: A): A {
  const chosen = doc?.meta?.schemaType
  if (chosen && chosen !== 'auto') return doc
  const def = s?.[TYPE_KEY[collection] ?? '']?.schemaType
  return def && def !== 'auto' ? { ...doc, meta: { ...(doc.meta || {}), schemaType: def } } : doc
}
