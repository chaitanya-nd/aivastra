import { bodyOf, hasBody } from '@/lib/body'
import { RichText } from '@/components/RichText'
import { CustomSchema } from '@/components/CustomSchema'
import { JsonLd } from '@/components/JsonLd'
import { LivePreview } from '@/components/LivePreview'
import { Comments } from '@/components/Comments'
import { findMany, getSettings, isDraft, getPluginSettings } from '@/lib/data'
import { type Heading, extractHeadings } from '@/lib/richtext'
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { getPath, SITE_URL } from '@/lib/urls'
import { FooterFormBand } from '../Footer'
import { ArtCards, ArtCover, ArtHero } from './Article'
import { Accordion, FormBlock, excerptOf, strip, THEME_URL, texturize } from '../util'

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')

function Share({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  return (
    <div className="share-buttons">
      <a className="copy-btn" data-link={url} href="">Copy</a>
      <a className="twitter" target="_blank" rel="noopener" href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}>Twitter</a>
      <a className="facebook" target="_blank" rel="noopener" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}>Facebook</a>
      <a className="linkedin" target="_blank" rel="noopener" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}>LinkedIn</a>
    </div>
  )
}

/** LuckyWP-compatible markup so the theme's .lwptoc styles apply. */
export async function LwpToc({ headings }: { headings: Heading[] }) {
  const ps: any = await getPluginSettings()
  if (ps?.tocEnabled === false) return null
  const depth = Number(ps?.tocDepth || 4)
  const hs = headings.filter((h) => h.level <= depth)
  if (hs.length < (ps?.tocMinHeadings ?? 2)) return null
  const numbered = ps?.tocNumbered !== false
  return (
    <div className="lwptoc lwptoc-autoWidth lwptoc-baseItems lwptoc-light lwptoc-notInherit" data-smooth-scroll="1">
      <div className="lwptoc_i">
        <div className="lwptoc_header"><b className="lwptoc_title">{ps?.tocTitle || 'Contents'}</b></div>
        <div className="lwptoc_items lwptoc_items-visible">
          <div className="lwptoc_itemWrap">
            {hs.map((h, i) => (
              <div className="lwptoc_item" key={h.id} style={h.level > 2 ? { marginLeft: (h.level - 2) * 16 } : undefined}>
                <a href={`#${h.id}`}>{numbered && <><span className="lwptoc_item_number">{i + 1}</span> </>}<span className="lwptoc_item_label">{h.text}</span></a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** single.php */
const BACK: Record<string, [string, string]> = { posts: ['Blog', '/blog'], updates: ['Product Updates', '/documentations/product-updates'], reviews: ['Reviews', '/review'] }

/** single.php — blog posts, and (like WordPress falling back to single.php) product updates and reviews. */
export async function SinglePost({ doc, gc, collection = 'posts' }: { doc: any; gc: any; collection?: string }) {
  const [settings, draft, latest] = await Promise.all([getSettings(), isDraft(), findMany('posts', { limit: 3, depth: 1 })])
  const path = getPath(collection, doc)
  const [backLabel, backHref] = BACK[collection] ?? BACK.posts
  const url = `${SITE_URL}${path}/`
  const cat = (doc.primaryCategory && typeof doc.primaryCategory === 'object' && doc.primaryCategory) || (doc.categories ?? []).find((c: any) => typeof c === 'object') || (doc.category && typeof doc.category === 'object' ? doc.category : null)
  const author = doc.author && typeof doc.author === 'object' ? doc.author : null
  const tags = (doc.tags ?? []).filter((t: any) => typeof t === 'object')
  const headings = doc.showToc === false ? [] : extractHeadings(bodyOf(doc))
  const faq = (doc.faq ?? []) as { question: string; answer: string }[]
  return (
    <>
      {draft && <LivePreview />}
      <JsonLd data={articleSchema(doc, path, settings, collection === 'posts' ? 'BlogPosting' : 'Article')} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: backLabel, path: backHref }, ...(cat && collection === 'posts' ? [{ name: cat.name, path: getPath('categories', cat) }] : []), { name: doc.title, path }])} />
      {faq.length > 0 && <JsonLd data={faqSchema(faq)} />}
      <CustomSchema html={doc.meta?.customSchema} />

      <div className="av-art av-art-post">
        <ArtHero
          crumbs={<div className="av-art-back"><a href={`${backHref}/`}>← {backLabel}</a></div>}
          pill={cat?.name}
          title={texturize(doc.title)}
          meta={<><span>Posted on {fmt(doc.publishedAt || doc.releaseDate)}</span><span>Updated on {fmt(doc.modifiedAt || doc.updatedAt)}</span></>}
          aside={<div className="av-art-share"><Share url={url} title={doc.title} /></div>}
        />
        <ArtCover src={doc.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`} alt={doc.featuredImageAlt || doc.title} />
        <main id="page-content" className="av-art-main">
          <div className="av-art-wrap av-art-grid av-art-grid-3">
            <aside className="av-art-side">
              <LwpToc headings={headings} />
              <div className="av-art-author">
                <img src={`${THEME_URL}/images/aivastraicon2.webp`} alt="Default Author" />
                <div>
                  <strong>AI Vastra</strong>
                  <span>Product &amp; Research Team</span>
                </div>
                <p>AI Vastra Team shares product updates and insights on AI-powered virtual try-on, garment draping, and retail innovation.</p>
              </div>
            </aside>
            <article id={`post-${doc.id}`} className="av-art-article">
              <div className="av-prose entry-content-body">
                {hasBody(doc) && <RichText data={bodyOf(doc)} className="" />}
                {doc.body && !doc.content && <p>{doc.body}</p>}
              </div>
              <div className="av-art-foot">
                <div>
                  <h5>Tags</h5>
                  <div className="av-art-tags">{tags.map((t: any) => <a key={t.id} href={`/tag/${t.slug}/`}>{t.name}</a>)}</div>
                </div>
                <div>
                  <h5>Share this article</h5>
                  <div className="av-art-share"><Share url={url} title={doc.title} /></div>
                </div>
              </div>
              {collection === 'posts' && <Comments doc={doc} collection={collection} />}
              <Accordion a={{ accordion_list: faq.map((q) => ({ accordion_question: q.question, accordion_answer: q.answer })), category_accordion_title: doc.faqTitle || undefined }} />
            </article>
            <aside className="av-art-side av-art-form">
              <div className="hm-form"><h6>Get In Touch</h6><FormBlock form={gc.contactForm} /></div>
            </aside>
          </div>
        </main>
        <ArtCards title="Read More" items={(latest.docs as any[]).map((p: any) => ({ id: p.id, href: `/${p.slug}/`, img: p.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`, title: p.title, text: excerptOf(p, 18) }))} linkLabel="Read article" action={{ label: 'View More Blogs', href: '/blog/' }} />
      </div>
      <FooterFormBand className="singleblg" title={gc.footer_top_left_title} content={strip(gc.footer_top_left_content)} formTitle={gc.footer_top_right_title} form={gc.contactForm} />
    </>
  )
}
