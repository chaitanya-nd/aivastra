import { absoluteUrl, SITE_URL } from './urls'
import { mediaUrl } from './seo'

type A = Record<string, any>

export const organizationSchema = (s: A) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
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

export const articleSchema = (doc: A, path: string, s: A, type = 'BlogPosting') => ({
  '@context': 'https://schema.org',
  '@type': doc.meta?.schemaType && !['auto', 'none', 'FAQPage'].includes(doc.meta.schemaType) ? doc.meta.schemaType : type,
  mainEntityOfPage: absoluteUrl(path),
  headline: doc.meta?.title || doc.title,
  description: doc.meta?.description || doc.excerpt || undefined,
  image: mediaUrl(doc.meta?.image) || mediaUrl(doc.featuredImage) || doc.featuredImageUrl || undefined,
  datePublished: doc.publishedAt || doc.createdAt,
  dateModified: doc.modifiedAt || doc.updatedAt,
  author: doc.author && typeof doc.author === 'object' ? { '@type': 'Person', name: doc.author.name } : { '@id': `${SITE_URL}/#organization` },
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  ...(s ? {} : {}),
})
