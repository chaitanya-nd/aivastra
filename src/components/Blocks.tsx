import Link from 'next/link'
import { findMany } from '@/lib/data'
import { withTrailingSlash } from '@/lib/urls'
import { CMSLink } from './CMSLink'
import { Faq } from './Faq'
import { FormRenderer } from './FormRenderer'
import { Media } from './Media'
import { Pagination } from './Pagination'
import { PostCard } from './PostCard'
import { RichText } from './RichText'
import { Tabs } from './Tabs'

type B = Record<string, any>

const Head = ({ eyebrow, heading, sub }: { eyebrow?: string; heading?: string; sub?: string }) =>
  heading || eyebrow ? (
    <header className="sec-head">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {heading && <h2>{heading}</h2>}
      {sub && <p className="sub">{sub}</p>}
    </header>
  ) : null

async function PostFeedBlock({ b, page, basePath }: { b: B; page: number; basePath: string }) {
  const where: B = {}
  if (b.source === 'posts' && b.category && typeof b.category === 'object') where.categories = { in: [b.category.id] }
  const res = await findMany(b.source, { where, limit: b.limit || 9, page: b.paginate ? page : 1 })
  const base = b.source === 'posts' ? 'posts' : b.source
  return (
    <section className="container sec">
      <Head heading={b.heading} />
      <div className="grid g3">
        {res.docs.map((d: any) => (
          <PostCard key={d.id} doc={d} collection={base} />
        ))}
      </div>
      {res.docs.length === 0 && <p>Nothing here yet.</p>}
      {b.paginate && <Pagination page={res.page || 1} totalPages={res.totalPages} basePath={basePath} />}
    </section>
  )
}

export async function Blocks({ blocks, page = 1, basePath = '/' }: { blocks?: B[] | null; page?: number; basePath?: string }) {
  if (!blocks?.length) return null
  return (
    <>
      {await Promise.all(
        blocks.map(async (b, i) => {
          const key = b.id || i
          switch (b.blockType) {
            case 'hero':
              return (
                <section key={key} className={`hero ${b.align === 'center' ? 'center' : ''}`}>
                  <div className="container two">
                    <div>
                      {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
                      <h1>{b.heading}</h1>
                      {b.subheading && <p className="lead">{b.subheading}</p>}
                      <div className="btns">
                        {(b.buttons || []).map((x: B) => (
                          <CMSLink key={x.id} link={x.link} className={`btn ${x.style || 'primary'}`} />
                        ))}
                      </div>
                    </div>
                    {b.image ? <Media media={b.image} size="hero" priority /> : b.imageUrl ? <img src={b.imageUrl} alt={b.heading || ''} /> : null}
                  </div>
                </section>
              )
            case 'richText':
              return (
                <section key={key} className={`container sec ${b.width === 'wide' ? '' : 'narrow'}`}>
                  <RichText data={b.content} />
                </section>
              )
            case 'imageText':
              return (
                <section key={key} className="container sec">
                  <div className={`two imgtext ${b.imagePosition === 'left' ? 'rev' : ''}`}>
                    <div>
                      <Head eyebrow={b.eyebrow} heading={b.heading} sub={b.body} />
                      {b.bullets?.length > 0 && (
                        <ul className="ticks">{b.bullets.map((x: B) => <li key={x.id}>{x.text}</li>)}</ul>
                      )}
                      <CMSLink link={b.cta} className="btn primary" />
                    </div>
                    <Media media={b.image} size="card" />
                  </div>
                </section>
              )
            case 'featureGrid':
              return (
                <section key={key} className="container sec">
                  <Head eyebrow={b.eyebrow} heading={b.heading} sub={b.subheading} />
                  <div className={`grid g${b.columns || 3}`}>
                    {(b.items || []).map((x: B) => (
                      <div key={x.id} className="feature">
                        {x.image ? <Media media={x.image} size="thumbnail" /> : x.imageUrl ? <img src={x.imageUrl} alt="" loading="lazy" /> : null}
                        <h3>{x.title}</h3>
                        <p>{x.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )
            case 'steps':
              return (
                <section key={key} className="container sec">
                  <Head heading={b.heading} sub={b.subheading} />
                  <ol className="steps">
                    {(b.steps || []).map((x: B) => (
                      <li key={x.id}>
                        <h3>{x.title}</h3>
                        <p>{x.content}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              )
            case 'tabs':
              return (
                <section key={key} className="container sec">
                  <Head heading={b.heading} />
                  <Tabs
                    tabs={(b.tabs || []).map((t: B) => ({
                      id: t.id,
                      label: t.label,
                      node: (
                        <div className="two imgtext">
                          <div>
                            {t.heading && <h3>{t.heading}</h3>}
                            <p>{t.content}</p>
                            <CMSLink link={t.cta} className="btn primary" />
                          </div>
                          <Media media={t.image} size="card" />
                        </div>
                      ),
                    }))}
                  />
                </section>
              )
            case 'faq':
              return <Faq key={key} eyebrow={b.eyebrow} title={b.heading} items={b.items} />
            case 'testimonials':
              return (
                <section key={key} className="container sec">
                  <Head heading={b.heading} />
                  <div className="grid g3">
                    {(b.items || []).map((x: B) => (
                      <blockquote key={x.id} className="quote">
                        <p>“{x.quote}”</p>
                        <footer>
                          <strong>{x.name}</strong>
                          {x.role && <span>{x.role}</span>}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </section>
              )
            case 'pricing':
              return (
                <section key={key} className="container sec">
                  <Head heading={b.heading} sub={b.subheading} />
                  <div className="grid g3">
                    {(b.plans || []).map((p: B) => (
                      <div key={p.id} className={`plan ${p.highlighted ? 'hl' : ''}`}>
                        <h3>{p.name}</h3>
                        <p className="price">
                          {p.price}
                          <small>{p.period}</small>
                        </p>
                        <p>{p.description}</p>
                        <ul className="ticks">{(p.features || []).map((f: B) => <li key={f.id}>{f.text}</li>)}</ul>
                        <CMSLink link={p.cta} className="btn primary" />
                      </div>
                    ))}
                  </div>
                </section>
              )
            case 'cta':
              return (
                <section key={key} className={`cta ${b.tone || 'dark'}`}>
                  <div className="container center">
                    <h2>{b.heading}</h2>
                    <p>{b.text}</p>
                    <CMSLink link={b.cta} className="btn light" />
                  </div>
                </section>
              )
            case 'html':
              return <section key={key} className="wp-html" dangerouslySetInnerHTML={{ __html: b.html }} />
            case 'postFeed':
              return <PostFeedBlock key={key} b={b} page={page} basePath={basePath} />
            case 'contactForm':
              return (
                <section key={key} className="container sec two">
                  <div>
                    <Head heading={b.heading} sub={b.text} />
                    <dl className="details">
                      {(b.details || []).map((d: B) => (
                        <div key={d.id}>
                          <dt>{d.label}</dt>
                          <dd>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <FormRenderer form={b.form} />
                </section>
              )
            default:
              return null
          }
        }),
      )}
    </>
  )
}

export { Link, withTrailingSlash }
