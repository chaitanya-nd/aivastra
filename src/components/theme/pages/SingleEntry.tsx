import { bodyOf, hasBody } from '@/lib/body'
import { RichText } from '@/components/RichText'
import { CustomSchema } from '@/components/CustomSchema'
import { JsonLd } from '@/components/JsonLd'
import { LivePreview } from '@/components/LivePreview'
import { findMany, getSettings, isDraft } from '@/lib/data'
import { extractHeadings } from '@/lib/richtext'
import { withDefaultSchema, articleSchema, breadcrumbSchema } from '@/lib/schema'
import { formatDate } from '@/lib/dates'
import { getPath } from '@/lib/urls'
import { FooterFormBand } from '../Footer'
import { LwpToc } from './SinglePost'
import { Crumbs } from '../Crumbs'
import { THEME_URL, excerptOf, strip, texturize } from '../util'
import { ArtCards, ArtCover, ArtHero } from './Article'

let dateSettings: any = null
const fmt = (d?: string) => formatDate(d, dateSettings)
const cover = (d: any) => d.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`

/** single-guide.php */
export async function SingleGuide({ doc, gc }: { doc: any; gc: any }) {
  const [settings, draft, related] = await Promise.all([getSettings(), isDraft(), findMany('guides', { limit: 3, sort: 'order' })])
  dateSettings = settings
  const path = getPath('guides', doc)
  const headings = extractHeadings(bodyOf(doc))
  return (
    <>
      {draft && <LivePreview />}
      <JsonLd data={articleSchema(withDefaultSchema(doc, 'guides', settings), path, settings, 'Article')} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Documentation', path: '/documentations' }, { name: 'Getting Started', path: '/documentations/getting-started' }, { name: doc.title, path }])} />
      <CustomSchema html={doc.meta?.customSchema} />
      <div className="av-art av-art-guide">
        <ArtHero
          crumbs={<Crumbs items={[{ label: 'Documentation', url: '/documentations' }, { label: 'Getting Started', url: '/documentations/getting-started' }, { label: doc.title, url: path }]} />}
          pill="Guide"
          title={texturize(doc.title)}
          meta={<><span>Posted on {fmt(doc.publishedAt)}</span><span>Updated on {fmt(doc.modifiedAt || doc.updatedAt)}</span></>}
        />
        <main id="page-content" className="av-art-main">
          <div className="av-art-wrap av-art-grid av-art-grid-2">
            <aside className="av-art-side"><LwpToc headings={headings} /></aside>
            <article id={`post-${doc.id}`} className="av-prose entry-content-body">{hasBody(doc) && <RichText data={bodyOf(doc)} className="" autoLink={path} />}</article>
          </div>
        </main>
        <ArtCards title="Related Guides" items={related.docs.map((g: any) => ({ id: g.id, href: `/guide/${g.slug}/`, img: cover(g), title: g.title, text: excerptOf(g, 15) }))} linkLabel="Read guide" />
      </div>
      <FooterFormBand className="singleblg" title={gc.footer_top_left_title} content={strip(gc.footer_top_left_content)} formTitle={gc.footer_top_right_title} form={gc.contactForm} />
    </>
  )
}

/** single-case.php */
export async function SingleCase({ doc, gc }: { doc: any; gc: any }) {
  const [settings, draft, more] = await Promise.all([getSettings(), isDraft(), findMany('cases', { where: { id: { not_equals: doc.id } }, limit: 3, sort: '-publishedAt' })])
  dateSettings = settings
  const path = getPath('cases', doc)
  const headings = extractHeadings(bodyOf(doc))
  const top = (doc.studyTop ?? []) as { id?: string; title: string; subtitle?: string }[]
  return (
    <>
      {draft && <LivePreview />}
      <JsonLd data={articleSchema(withDefaultSchema(doc, 'cases', settings), path, settings, 'Article')} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Case Studies', path: '/case-studies' }, { name: doc.title, path }])} />
      <CustomSchema html={doc.meta?.customSchema} />
      <div className="av-art av-art-case">
        <ArtHero
          crumbs={<Crumbs items={[{ label: 'Case Studies', url: '/case-studies' }, { label: doc.title, url: path }]} />}
          pill="Case study"
          title={texturize(doc.title)}
          lead={doc.studyParagraph}
          aside={top.length > 0 ? (
            <div className="av-art-stats">
              {top.map((t, i) => (
                <div className="av-art-stat" key={t.id ?? i}>
                  {t.title && <h6>{t.title}</h6>}
                  {t.subtitle && <p>{t.subtitle}</p>}
                </div>
              ))}
            </div>
          ) : undefined}
        />
        {doc.featuredImageUrl && <ArtCover src={doc.featuredImageUrl} alt={doc.title} />}
        <main id="page-content" className="av-art-main">
          <div className="av-art-wrap av-art-grid av-art-grid-2">
            <aside className="av-art-side"><LwpToc headings={headings} /></aside>
            <article id={`post-${doc.id}`} className="av-prose entry-content-body">{hasBody(doc) && <RichText data={bodyOf(doc)} className="" autoLink={path} />}</article>
          </div>
        </main>
        <ArtCards title="Explore More Case Studies" items={more.docs.map((c: any) => ({ id: c.id, href: `/case/${c.slug}/`, img: cover(c), title: c.title, text: excerptOf(c, 15) }))} linkLabel="View Case Study" />
      </div>
      <FooterFormBand className="singleblg" title={gc.footer_top_left_title} content={strip(gc.footer_top_left_content)} formTitle={gc.footer_top_right_title} form={gc.contactForm} />
    </>
  )
}
