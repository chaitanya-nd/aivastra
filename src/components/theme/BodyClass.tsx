/**
 * The WordPress theme's CSS is scoped by <body> classes (page-template-shopify-page, single-case, blog, …).
 * Next's layout can't know the page, so each page adds its classes with a tiny inline script that runs
 * while the HTML parses (before first paint — no flash).
 */
export function BodyClass({ classes }: { classes: string }) {
  const list = classes.split(/\s+/).filter(Boolean)
  return <script dangerouslySetInnerHTML={{ __html: `document.body.classList.add(${list.map((c) => JSON.stringify(c)).join(',')})` }} />
}

/** Page-template key → WordPress template file basename (what body_class() used). */
export const TEMPLATE_BODY: Record<string, string> = {
  category: 'category',
  about: 'about-page-template',
  pricing: 'pricing-page',
  contact: 'template-contact',
  'virtual-try-on': 'virtual-try-on',
  'ai-showcase': 'ai-showcase-page',
  shopify: 'shopify-page',
  'market-places': 'market-places',
  'case-studies': 'case-studies-page-template',
  guide: 'guide-page-template',
  update: 'update-page-template',
  document: 'template-document',
}

export const pageBodyClass = (template?: string) =>
  template === 'front-page' ? 'home page' : template === 'blog' ? 'blog' : template && TEMPLATE_BODY[template] ? `page page-template page-template-${TEMPLATE_BODY[template]}` : 'page page-template-default'
