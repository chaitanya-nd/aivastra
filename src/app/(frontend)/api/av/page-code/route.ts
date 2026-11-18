import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

const T = 'src/components/theme/pages'
/** Which source files render each page template (what a developer edits to change the page). */
const MAP: Record<string, { title: string; files: string[] }> = {
  'front-page': { title: 'Home page', files: ['src/ui/pages/Home.tsx'] },
  category: { title: 'Category landing', files: [`${T}/CategoryPage.tsx`] },
  pricing: { title: 'Pricing', files: [`${T}/PricingPage.tsx`] },
  contact: { title: 'Contact', files: [`${T}/ContactPage.tsx`] },
  about: { title: 'About', files: [`${T}/AboutPage.tsx`] },
  'case-studies': { title: 'Case studies listing', files: [`${T}/Listing.tsx`] },
  guide: { title: 'Guides listing', files: [`${T}/Listing.tsx`] },
  update: { title: 'Product updates listing', files: [`${T}/Listing.tsx`] },
  document: { title: 'Documentation', files: [`${T}/DocumentPage.tsx`] },
  shopify: { title: 'Shopify', files: [`${T}/ShopifyPage.tsx`] },
  'market-places': { title: 'Marketplaces', files: [`${T}/MarketplacesPage.tsx`] },
  'virtual-try-on': { title: 'Virtual try-on', files: [`${T}/VirtualTryOnPage.tsx`] },
  'ai-showcase': { title: 'AI showcase', files: [`${T}/ShowcasePage.tsx`] },
  blog: { title: 'Blog index', files: [`${T}/BlogIndex.tsx`] },
  default: { title: 'Default page', files: [`${T}/DefaultPage.tsx`] },
}
const ALWAYS = [
  { label: 'Template router (maps the Template field → component)', file: 'src/lib/templates.tsx' },
  { label: 'Route + SEO (redirects, 404, metadata)', file: 'src/app/(frontend)/[[...slug]]/page.tsx' },
  { label: 'SEO metadata builder (titles, robots, OpenGraph)', file: 'src/lib/seo.ts' },
]

/** Read-only source viewer for the page editor. Source files only; never accepts a path from the client. */
export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new NextResponse(null, { status: 401 })
  const tpl = new URL(req.url).searchParams.get('template') || 'default'
  const m = MAP[tpl] ?? MAP.default
  const list = [...m.files.map((file) => ({ label: `Page component — ${m.title}`, file })), ...ALWAYS]
  const files = await Promise.all(
    list.map(async ({ label, file }) => {
      const abs = path.join(process.cwd(), file)
      try {
        const src = await readFile(abs, 'utf8')
        return { label, file, abs, lines: src.split('\n').length, src: src.length > 120_000 ? src.slice(0, 120_000) + '\n… (truncated)' : src }
      } catch {
        return { label, file, abs, lines: 0, src: null }
      }
    }),
  )
  return NextResponse.json({ template: tpl, title: m.title, files })
}
