import { bodyOf, hasBody } from '@/lib/body'
import { RichText } from '@/components/RichText'
import { CustomSchema } from '@/components/CustomSchema'
import { JsonLd } from '@/components/JsonLd'
import { LivePreview } from '@/components/LivePreview'
import { Comments } from '@/components/Comments'
import { cookies } from 'next/headers'
import { adjacentPosts, getSettings, isDraft, getPluginSettings, readMorePosts } from '@/lib/data'
import { tokenMatches, unlockCookie } from '@/lib/postPassword'
import { BodyClass } from '../BodyClass'
import { type Heading, extractHeadings } from '@/lib/richtext'
import { withDefaultSchema, articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema'
import { formatDate } from '@/lib/dates'
import { getPath, SITE_URL } from '@/lib/urls'
import { FooterFormBand } from '../Footer'
import { ArtCards, ArtCover, ArtHero } from './Article'
import { Accordion, FormBlock, excerptOf, strip, THEME_URL, texturize } from '../util'

let dateSettings: any = null
const fmt = (d?: string) => formatDate(d, dateSettings)

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
        <div className="lwptoc_header">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" style={{ opacity: 0.85 }}>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="16" y2="12"/>
            <line x1="3" y1="18" x2="19" y2="18"/>
          </svg>
          <b className="lwptoc_title">{ps?.tocTitle || 'Table of Contents'}</b>
        </div>
        <div className="lwptoc_items lwptoc_items-visible">
          <div className="lwptoc_itemWrap">
            {hs.map((h, i) => (
              <div className={`lwptoc_item lwptoc_level_${h.level}`} key={h.id} style={h.level > 2 ? { paddingLeft: (h.level - 2) * 12 } : undefined}>
                <a href={`#${h.id}`}>
                  {numbered && <span className="lwptoc_item_number">{i + 1}.</span>}
                  <span className="lwptoc_item_label">{h.text}</span>
                </a>
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
/** <!--nextpage--> (wp_link_pages): the body split into numbered pages /slug/, /slug/2/, … */
export const bodyParts = (doc: any): string[] | null => {
  const h = typeof doc?.contentHtml === 'string' ? doc.contentHtml : ''
  if (!h.includes('<!--nextpage-->')) return null
  return h.split(/<!--nextpage-->/).map((x: string) => x.replace(/^\s*<\/p>|<p>\s*$/g, '').trim()).filter(Boolean)
}

export async function SinglePost({ doc, gc, collection = 'posts', part = 1 }: { doc: any; gc: any; collection?: string; part?: number }) {
  const [settings, draft, ps] = await Promise.all([getSettings(), isDraft(), getPluginSettings()])
  dateSettings = settings
  const [readMore, adjacent] = await Promise.all([readMorePosts(doc, (ps as any)?.relatedMode), collection === 'posts' && (ps as any)?.showPrevNext ? adjacentPosts(doc) : Promise.resolve(null)])
  // WordPress password-protected post: content stays hidden until the visitor enters the password.
  const jar = collection === 'posts' && doc.visibility === 'password' && !draft ? await cookies() : null
  const locked = Boolean(jar) && !tokenMatches(jar!.get(unlockCookie(doc.id))?.value, doc.id, doc.postPassword || '')
  const wrongPassword = locked && jar!.get('avpp_err')?.value === String(doc.id)
  const path = getPath(collection, doc)
  const [backLabel, backHref] = BACK[collection] ?? BACK.posts
  const url = `${SITE_URL}${path}/`
  const cat = (doc.primaryCategory && typeof doc.primaryCategory === 'object' && doc.primaryCategory) || (doc.categories ?? []).find((c: any) => typeof c === 'object') || (doc.category && typeof doc.category === 'object' ? doc.category : null)
  const author = doc.author && typeof doc.author === 'object' ? doc.author : null
  const tags = (doc.tags ?? []).filter((t: any) => typeof t === 'object')
  const parts = bodyParts(doc)
  const headings = doc.showToc === false ? [] : extractHeadings(parts ? parts[Math.min(part, parts.length) - 1] : bodyOf(doc))
  const faq = (doc.faq ?? []) as { question: string; answer: string }[]

  // Estimated reading time
  const bodyText = typeof doc.body === 'string' ? doc.body : JSON.stringify(bodyOf(doc))
  const wordCount = (bodyText.match(/\b\w+\b/g) || []).length
  const readTime = Math.max(2, Math.ceil(wordCount / 220))

  return (
    <>
      {collection === 'posts' && <BodyClass classes={`format-${doc.format || 'standard'}${doc.sticky ? ' sticky' : ''}${doc.visibility === 'password' ? ' post-password-required' : ''}`} />}
      {draft && <LivePreview />}
      <JsonLd data={articleSchema(withDefaultSchema(doc, collection, settings), path, settings, collection === 'posts' ? 'BlogPosting' : 'Article')} />
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: backLabel, path: backHref }, ...(cat && collection === 'posts' ? [{ name: cat.name, path: getPath('categories', cat) }] : []), { name: doc.title, path }])} />
      {faq.length > 0 && !locked && <JsonLd data={faqSchema(faq)} />}
      <CustomSchema html={doc.meta?.customSchema} />

      <div className="av-art av-art-post">
        <ArtHero
          crumbs={<div className="av-art-back"><a href={`${backHref}/`}>← Back to {backLabel}</a></div>}
          pill={cat?.name}
          title={texturize(`${doc.visibility === 'password' ? 'Protected: ' : doc.visibility === 'private' ? 'Private: ' : ''}${doc.title}`)}
          meta={
            <>
              <span className="av-art-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {fmt(doc.publishedAt || doc.releaseDate)}
              </span>
              <span className="av-art-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {readTime} min read
              </span>
              {(doc.modifiedAt || doc.updatedAt) && (
                <span className="av-art-meta-item">
                  Updated {fmt(doc.modifiedAt || doc.updatedAt)}
                </span>
              )}
            </>
          }
          aside={<div className="av-art-share"><Share url={url} title={doc.title} /></div>}
        />
        <ArtCover src={doc.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`} alt={doc.featuredImageAlt || doc.title} />
        <main id="page-content" className="av-art-main">
          <div className={`av-art-wrap av-art-grid ${headings.length > 0 ? 'av-art-grid-2' : 'av-art-grid-1'}`}>
            {headings.length > 0 && (
              <aside className="av-art-side">
                <LwpToc headings={headings} />
                <div className="av-art-author">
                  <div className="av-art-author-top">
                    <img src="/brand/aivastra-icon-black.png" alt={author?.name || 'AI Vastra'} />
                    <div>
                      <strong>{author?.name || 'AI Vastra Team'}</strong>
                      <span>{author?.role || 'Product & Research'}</span>
                    </div>
                  </div>
                  <p>{author?.bio || 'Retail insights on AI fashion catalogues, virtual try-on technology, and automated visual merchandising.'}</p>
                </div>
                <div className="av-art-side-share">
                  <span className="av-art-side-share-title">Share Article</span>
                  <Share url={url} title={doc.title} />
                </div>
              </aside>
            )}
            <article id={`post-${doc.id}`} className="av-art-article">
              <div className="av-prose entry-content-body">
                {locked ? (
                  <form className="post-password-form" action="/api/av/unlock" method="post">
                    <p>This content is password protected. To view it please enter your password below:</p>
                    {wrongPassword && <p className="post-password-error" role="alert">The password you entered is incorrect.</p>}
                    <input type="hidden" name="id" value={String(doc.id)} />
                    <p><label>Password: <input name="post_password" type="password" required /></label> <input type="submit" value="Enter" /></p>
                  </form>
                ) : (
                  <>
                    {parts ? <RichText data={parts[Math.min(part, parts.length) - 1]} className="" autoLink={path} /> : hasBody(doc) && <RichText data={bodyOf(doc)} className="" autoLink={path} />}
                    {parts && (
                      <nav className="page-links" aria-label="Pages">
                        <span>Pages:</span>
                        {parts.map((_, i) => (i + 1 === part ? <span key={i} className="post-page-numbers current" aria-current="page">{i + 1}</span> : <a key={i} className="post-page-numbers" href={`${path.replace(/\/$/, '')}/${i > 0 ? `${i + 1}/` : ''}`}>{i + 1}</a>))}
                      </nav>
                    )}
                    {doc.body && !doc.content && <p>{doc.body}</p>}
                  </>
                )}
              </div>
              <div className="av-art-foot">
                {tags.length > 0 && (
                  <div className="av-art-foot-sec">
                    <h5>Tags</h5>
                    <div className="av-art-tags">{tags.map((t: any) => <a key={t.id} href={`/tag/${t.slug}/`}>#{t.name}</a>)}</div>
                  </div>
                )}
                <div className="av-art-foot-sec">
                  <h5>Share this article</h5>
                  <div className="av-art-share"><Share url={url} title={doc.title} /></div>
                </div>
              </div>
              {adjacent && (adjacent.prev || adjacent.next) && (
                <nav className="post-navigation av-art-adjacent" aria-label="Posts">
                  {adjacent.prev ? <a rel="prev" href={`/${adjacent.prev.slug}/`}><small>Previous</small>{adjacent.prev.title}</a> : <span />}
                  {adjacent.next ? <a rel="next" href={`/${adjacent.next.slug}/`}><small>Next</small>{adjacent.next.title}</a> : <span />}
                </nav>
              )}
              {collection === 'posts' && !locked && <Comments doc={doc} collection={collection} />}
              {!locked && faq.length > 0 && (
                <Accordion a={{ accordion_list: faq.map((q) => ({ accordion_question: q.question, accordion_answer: q.answer })), category_accordion_title: doc.faqTitle || 'Frequently Asked Questions' }} />
              )}
            </article>
          </div>
        </main>
        <ArtCards title="Read More" items={(readMore as any[]).map((p: any) => ({ id: p.id, href: `/${p.slug}/`, img: p.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`, title: p.title, text: excerptOf(p, 18) }))} linkLabel="Read article" action={{ label: 'View More Blogs', href: '/blog/' }} />
      </div>
      <FooterFormBand className="singleblg" title={gc.footer_top_left_title} content={strip(gc.footer_top_left_content)} formTitle={gc.footer_top_right_title} form={gc.contactForm} />
    </>
  )
}
