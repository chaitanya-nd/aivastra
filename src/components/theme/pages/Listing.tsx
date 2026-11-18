import { Crumbs } from '../Crumbs'
import { getClient, findMany } from '@/lib/data'
import { FooterFormBand } from '../Footer'
import { Accordion, THEME_URL, excerptOf, strip } from '../util'

type Kind = 'case' | 'guide' | 'update'
const CFG: Record<Kind, { collection: string; base: string; archive: string; button?: string; words: number }> = {
  case: { collection: 'cases', base: '/case', archive: '/case-category', button: 'View Case Study', words: 10 },
  guide: { collection: 'guides', base: '/guide', archive: '/guide-category', words: 10 },
  update: { collection: 'updates', base: '/updates', archive: '/update-category', words: 18 },
}
const cover = (d: any) => d.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`
const version = (v?: string) => (v ? (/^version/i.test(v) ? v : `Version ${v}`) : '')

/** Cards used by the case-studies / guide / update listings (theme markup: .blog-card). */
export function DocCard({ d, kind }: { d: any; kind: Kind }) {
  const c = CFG[kind]
  const href = `${c.base}/${d.slug}/`
  return (
    <div className="blog-card">
      <div className="card-thumb-holder">
        {kind === 'update' ? <img src={cover(d)} alt={d.title} loading="lazy" /> : <a href={href}><img src={cover(d)} alt={d.title} loading="lazy" /></a>}
      </div>
      <div className="blog-content">
        {kind === 'update' && d.version && <span className="version-badge">{version(d.version)}</span>}
        <h3><a href={href}>{d.title}</a></h3>
        <p>{excerptOf(d, c.words)}</p>
        {c.button && <div className="guide-card-btn"><a href={href}>{c.button}</a></div>}
      </div>
      {kind !== 'update' && <div className="guide-card-link"><a href={href}>link</a></div>}
    </div>
  )
}

/**
 * case-studies / guide / update listing pages, and their category archives (`term`).
 * The theme filtered with ?cat_filter=…; category tabs here link to the static archive pages.
 */
export async function ListingPage({ kind, doc, gc, term }: { kind: Kind; doc?: any; gc: any; term?: any }) {
  const a = doc?.acf ?? {}
  const c = CFG[kind]
  const payload = await getClient()
  const where: any = term ? { category: { equals: term.id } } : {}
  const res = await findMany(c.collection as any, { where, limit: 100, sort: kind === 'guide' ? 'order' : '-publishedAt', depth: 1 })
  const cats = (await payload.find({ collection: 'section-categories', where: { kind: { equals: kind } }, limit: 50, depth: 0, pagination: false })).docs as any[]
  const tabs: any[] = []
  for (const t of cats) {
    const n = await payload.count({ collection: c.collection as any, where: { and: [{ category: { equals: t.id } }, { _status: { equals: 'published' } }] } })
    if (n.totalDocs > 0) tabs.push(t)
  }
  const crumbs = (doc?.breadcrumbs ?? []) as { label: string; url: string }[]

  const heading =
    term ? { title: term.name, body: term.description }
    : kind === 'case' ? { title: strip(a.case_studies_banner_title) || doc?.title, body: strip(a.case_studies_banner_content) }
    : kind === 'guide' ? { title: strip(a.getting_started_title) || doc?.title, body: a.getting_started_content }
    : { title: 'Product Updates', body: 'Everything you need to begin creating professional AI-generated fashion catalogues with AI Vastra.' }
  const footer =
    kind === 'case' ? { title: a.case_studies_footer_top_title, content: strip(a.case_studies_footer_top_content), formTitle: a.case_studies_footer_top_form_title }
    : kind === 'guide' ? { title: a.getting_started_footer_top_title, content: strip(a.getting_started_footer_top_content), formTitle: a.getting_started_footer_form_title }
    : { title: 'Experience the Future of Fashion Visualization', content: 'Create premium fashion catalogues and immersive virtual try-on experiences that help your business grow faster.', formTitle: 'Get In Touch' }
  const topList = (a.case_studies_banner_buttom_list ?? []) as any[]
  // the original prints eyebrow as <h2> and title as <p> on these listings
  const faqA = kind === 'update' ? { ...a, category_accordion_title: 'Frequently Asked Questions', category_accordion_eyebrow: 'AI Vastra helps fashion brands generate high-quality catalogue visuals faster while reducing production effort and maintaining consistent visual quality across collections.' } : { ...a, category_accordion_title: a.category_accordion_eyebrow, category_accordion_eyebrow: strip(a.category_accordion_title) }

  return (
    <>
      <section id="main-heading">
        <div className="container">
          {kind !== 'case' && (
            <Crumbs home items={crumbs.map((b) => ({ label: b.label, url: b.url }))} />
          )}
          <div className="inr-bnr-title"><h1>{heading.title}</h1></div>
          {kind === 'guide' ? (heading.body ? <div className="inr-bnr-content" dangerouslySetInnerHTML={{ __html: heading.body }} /> : null) : heading.body ? <p>{heading.body}</p> : null}
        </div>
      </section>
      <section className="documentation-section">
        <div className="container">
          {topList.length > 0 && (
            <div className="case-studies-top">
              {topList.map((t, i) => (
                <div className="case-studies-top-itm one" key={i}>
                  <h6>{strip(t.case_studies_buttom_title)}</h6>
                  <p dangerouslySetInnerHTML={{ __html: t.case_studies_buttom_content ?? '' }} />
                </div>
              ))}
            </div>
          )}
          {tabs.length > 0 && (
            <div className="ui-filter-toolbar">
              <div className="blog-tabs-row">
                {tabs.map((t) => <a key={t.id} href={`${c.archive}/${t.slug}/`} className={`tab-pill ${term?.id === t.id ? 'active-tab' : ''}`}>{t.name}</a>)}
              </div>
            </div>
          )}
          {res.docs.length ? (
            <div className="blog-grid">{res.docs.map((d: any) => <DocCard key={d.id} d={d} kind={kind} />)}</div>
          ) : (
            <p>No documentation found.</p>
          )}
        </div>
      </section>
      {doc && (
        <div className="page-col-full">
          <section id="page-column">
            <Accordion a={faqA} className="document-page" />
          </section>
        </div>
      )}
      <FooterFormBand className="documentation" title={footer.title ?? gc.footer_top_left_title} content={footer.content ?? strip(gc.footer_top_left_content)} formTitle={footer.formTitle ?? gc.footer_top_right_title} form={gc.contactForm} />
    </>
  )
}
