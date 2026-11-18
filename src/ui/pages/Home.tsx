import { findMany } from '@/lib/data'
import { excerptOf, THEME_URL, words } from '@/components/theme/util'
import { HeroSlides, HScroll, Toggle } from '../client/Interactive'
import { attr, buttons, inline, load, q, qa, src, tx } from '../html'
import { CtaBand, FaqSection } from '../shell'
import { Words } from '../Words'

const monthYear = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '')
const Btn = ({ b, ghost = false }: { b: { text: string; href: string; newTab: boolean; demo: boolean; img?: string }; ghost?: boolean }) => (
  <a className={`av-btn${ghost ? ' ghost' : ''}`} data-magnetic {...(b.demo ? { 'data-demo': true } : { href: b.href })} {...(b.newTab ? { target: '_blank', rel: 'noopener' } : {})}>
    {b.img && <img src={b.img} alt="" width={22} height={22} />}
    <span>{b.text}</span>
    <i aria-hidden="true">→</i>
  </a>
)
const Rich = ({ html: h, className = '' }: { html: string; className?: string }) => <p className={className} dangerouslySetInnerHTML={{ __html: h }} />

export async function Home({ doc, gc }: { doc: any; gc: any }) {
  const a = doc.acf ?? {}
  const latest = (await findMany('posts', { limit: 3, depth: 1 })).docs as any[]

  // ── hero (3 slides, every one keeps its own eyebrow / h1 / copy / buttons)
  const slides = qa(load(a.home_banner_section), '.hm-banner-sec').map((s) => ({
    eyebrow: tx(q(s, '.banner-sub-headding')),
    title: (q(s, 'h1')?.innerHTML ?? '').split(/<br\s*\/?>|\n/i).map((x) => x.replace(/<[^>]+>/g, '').trim()).filter(Boolean),
    copy: tx(q(s, 'p')),
    btns: buttons(q(s, '.hm-banner-btn-lsting')),
    img: src(q(s, '.hm-banner-sec-cnt-img')),
  }))
  const tiles = [
    { s: 'photoshoots-item1', y: '2026/08', d: 1.4, c: 'a' },
    { s: 'photoshoots-item2', y: '2026/08', d: 0.7, c: 'b' },
    { s: 'catlgue-crtion2', y: '2026/08', d: 1.1, c: 'c' },
    { s: 'photoshoots-item3', y: '2026/08', d: 0.5, c: 'd' },
    { s: 'photoshoots-item4', y: '2026/08', d: 1.6, c: 'e' },
  ]
  // ── logos
  const brand = load(a.home_brand_section)
  const logos = qa(brand, '.hm-brand-sec-img img').map((i) => ({ src: attr(i, 'src'), alt: attr(i, 'alt') }))
  // ── platform
  const cr = load(a.hm_create_ready_section)
  const crBox = q(cr, '.container')
  const crCats = qa(cr, '.hm-create-ready-category').map((c, i) => ({ t: tx(q(c, '.hm-create-ready-title')), k: ['menimg', 'womenimg', 'jewelleryimg'][i], kh: ['menimghover', 'womenuimghover', 'jewelleryimghover'][i] }))
  // ── steps
  const st = load(a.home_steps_section)
  const tabs = qa(st, '.tab-btn').map(tx)
  const panels = qa(st, '.tab-panel').map((p) => ({
    title: tx(q(p, 'h2')),
    sub: inline(q(p, '.steps-cnt')),
    steps: qa(p, '.step-card').map((c) => ({ n: tx(q(c, 'strong')), t: inline(q(c, '.step-top-cnt')), icon: src(q(c, '.step-icon')), img: src(q(c, '.step-top-img')) })),
  }))
  // ── photoshoots
  const ph = load(a.home_photoshoots_section)
  const phC = q(ph, '.hm-photoshoots-content')
  const phImgs = qa(ph, '.photoshoots-item img').map((i) => attr(i, 'src'))
  // ── choose perfect + customers (split)
  const split = (html: string) => {
    const r = load(html)
    const c = q(r, '.hm-choose-perfect-rgt')
    return { title: tx(q(c, 'h2')), copy: inline(c), btn: buttons(q(c, '.hm-choose-perfect-btn'))[0], img: src(q(r, '.hm-choose-perfect-lft')) }
  }
  const cp = split(a.home_choose_perfect_section)
  const cu = split(a.home_customers_section)
  // ── catalogue creation
  const cc = load(a.home_catalogue_creation_section)
  const ccH = q(cc, '.hm-catalogue-creation-cnt')
  const ccItems = qa(cc, '.hm-catlgue-crtion-itm').map((c) => ({ img: src(c), t: tx(q(c, '.hm-catlgue-crtion-itm-title')), d: inline(q(c, '.hm-catlgue-crtion-itm-cnt')) }))
  // ── stats
  const bc = load(a.home_brand_choose_section)
  const bcH = q(bc, '.hm-brand-choose-header')
  const stats = qa(bc, '.hm-brand-choose-card').map((c) => ({ n: tx(q(c, 'h3')), t: tx(q(c, 'h4')), d: inline(c), icon: src(q(c, '.hm-brand-icon')) }))
  // ── results
  const rs = load(a.home_results_section)
  const rsH = q(rs, '.hm-results-header')
  const rsCols = qa(rs, '.hm-results-col').map((c) => qa(c, 'img').map((i) => attr(i, 'src')))
  const rsBtn = buttons(q(rs, '.hm-results-btn'))[0]

  const hero = slides.map((s, n) => (
    <div className="av-hero-txt" key={n}>
      <p className="av-eyebrow"><span className="av-dot" />{s.eyebrow}</p>
      <h1 className="av-mega">
        {s.title.map((l, i) => <span className="av-line" key={i}><span>{l}</span>{i < s.title.length - 1 ? ' ' : ''}</span>)}
      </h1>
      <p className="av-lead">{s.copy}</p>
      <div className="av-btns">{s.btns.map((b, i) => <Btn b={b} ghost={i > 0} key={i} />)}</div>
    </div>
  ))

  return (
    <div className="av-page av-home">
      {/* HERO */}
      <section className="av-hero">
        <div className="av-grid-bg" aria-hidden="true" />
        <div className="av-field" data-field aria-hidden="true">
          {tiles.map((t) => (
            <figure className={`av-tile ${t.c}`} data-depth={t.d} key={t.s}>
              <img src={`https://aivastra.com/wp-content/uploads/${t.y}/${t.s}.webp`} alt="" loading="eager" />
            </figure>
          ))}
        </div>
        <div className="av-wrap av-hero-in">
          <HeroSlides slides={hero} />
          <div className="av-hero-shot" data-parallax="0.05">
            <div className="av-sticker s1">AI</div>
            {slides.map((s, n) => (
              <img key={n} src={s.img} alt="" className="av-hero-img" data-i={n} />
            ))}
          </div>
        </div>
        <a className="av-scroll" href="#brands" aria-label="Scroll"><i /></a>
      </section>

      {/* LOGOS */}
      <section className="av-brands" id="brands">
        <h2 className="av-eyebrow center">{tx(q(brand, 'h2'))}</h2>
        <div className="av-marquee">
          <div className="av-marquee-t">
            {[0, 1].map((k) => (
              <div className="av-marquee-g" key={k} aria-hidden={k === 1}>
                {logos.map((l, i) => <img key={i} src={l.src} alt={k === 0 ? l.alt : ''} width={120} height={100} />)}
                {logos.map((l, i) => <img key={`b${i}`} src={l.src} alt="" width={120} height={100} />)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="av-ink av-platform">
        <div className="av-wrap">
          <Words as="h2" text={tx(q(crBox, 'h2'))} className="av-display" accent={2} />
          <div className="av-platform-row">
            <Rich html={inline(crBox)} className="av-lead light" />
            {buttons(crBox).map((b, i) => <Btn b={b} key={i} />)}
          </div>
          <div className="av-cats">
            {crCats.map((c, i) => (
              <article className="av-cat" data-tilt data-reveal={i * 0.1} key={c.t}>
                <img className="a" src={`${THEME_URL}/images/${c.k}.webp`} alt="" />
                <img className="b" src={`${THEME_URL}/images/${c.kh}.webp`} alt="" />
                <h3>{c.t}</h3>
                <span className="av-cat-n">0{i + 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="av-steps">
        <div className="av-wrap">
          <Toggle
            tabs={tabs}
            panels={panels.map((p, k) => (
              <div key={k}>
                <div className="av-steps-h">
                  <h2 className="av-display sm">{p.title}</h2>
                  <Rich html={p.sub} className="av-lead" />
                </div>
                <div className="av-steps-l">
                  {p.steps.map((s, i) => (
                    <article className="av-step" data-tilt key={i}>
                      <div className="av-step-top">
                        <span className="av-step-n">{s.n}</span>
                        {s.icon && <img src={s.icon} alt="" width={32} height={32} />}
                      </div>
                      <Rich html={s.t} className="av-step-t" />
                      <div className="av-step-img"><img src={s.img} alt="" loading="lazy" /></div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          />
        </div>
      </section>

      {/* PHOTOSHOOTS */}
      <section className="av-photo">
        <div className="av-wrap av-photo-in">
          <div className="av-photo-l">
            <Words as="h2" text={tx(q(phC, 'h2'))} className="av-display sm" accent={3} />
            <p className="av-serif" data-reveal>{tx(q(phC, 'i'))}</p>
            <Rich html={inline(phC)} className="av-lead" />
            {buttons(phC).map((b, i) => <Btn b={b} key={i} />)}
          </div>
          <div className="av-photo-r">
            {[0, 1].map((c) => (
              <div className={`av-photo-c c${c}`} data-parallax={c ? 0.18 : 0.08} key={c}>
                {phImgs.filter((_, i) => i % 2 === c).map((s) => <figure key={s} data-tilt><img src={s} alt="" loading="lazy" /></figure>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHOOSE PERFECT */}
      <section className="av-split">
        <div className="av-wrap av-split-in">
          <figure className="av-split-img" data-reveal><img src={cp.img} alt="" loading="lazy" /><span className="av-sticker s2">AI</span></figure>
          <div className="av-split-t">
            <Words as="h2" text={cp.title} className="av-display sm" accent={3} />
            <Rich html={cp.copy} className="av-lead" />
            {cp.btn && <Btn b={cp.btn} />}
          </div>
        </div>
      </section>

      {/* CATALOGUE CREATION — pinned horizontal scroll */}
      <section className="av-ink av-cc">
        <HScroll>
          <div className="av-cc-intro">
            <Words as="h2" text={tx(q(ccH, 'h2'))} className="av-display sm" accent={2} />
            <p className="av-serif">{tx(q(ccH, 'i'))}</p>
            <Rich html={inline(ccH)} className="av-lead light" />
          </div>
          {ccItems.map((c, i) => (
            <article className="av-cc-card" key={i}>
              <figure><img src={c.img} alt="" loading="lazy" /></figure>
              <span className="av-cc-n">0{i + 1}</span>
              <h3>{c.t}</h3>
              <Rich html={c.d} />
            </article>
          ))}
        </HScroll>
      </section>

      {/* STATS */}
      <section className="av-stats">
        <div className="av-wrap">
          <Words as="h2" text={tx(q(bcH, 'h2'))} className="av-display sm" accent={2} />
          <Rich html={inline(bcH)} className="av-lead" />
          <div className="av-stats-g">
            {stats.map((s, i) => (
              <article className="av-stat" data-tilt data-reveal={i * 0.1} key={i}>
                <div className="av-stat-top">
                  <b data-count className="av-stat-n">{s.n}</b>
                  {s.icon && <img src={s.icon} alt="" width={34} height={47} />}
                </div>
                <h3>{s.t}</h3>
                <Rich html={s.d} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMERS */}
      <section className="av-split rev">
        <div className="av-wrap av-split-in">
          <div className="av-split-t">
            <Words as="h2" text={cu.title} className="av-display sm" accent={3} />
            <Rich html={cu.copy} className="av-lead" />
            {cu.btn && <Btn b={cu.btn} />}
          </div>
          <figure className="av-split-img" data-reveal><img src={cu.img} alt="" loading="lazy" /><span className="av-sticker s3">AI</span></figure>
        </div>
      </section>

      {/* RESULTS */}
      <section className="av-ink av-results">
        <div className="av-wrap">
          <Words as="h2" text={tx(q(rsH, 'h2'))} className="av-display" accent={2} />
          <Rich html={inline(rsH)} className="av-lead light" />
        </div>
        <div className="av-masonry">
          {rsCols.map((col, i) => (
            <div className="av-masonry-c" data-drift={i % 2 ? -0 : 0} data-parallax={0.06 + (i % 3) * 0.06} key={i}>
              {col.map((s) => <figure key={s} data-tilt><img src={s} alt="" loading="lazy" /></figure>)}
            </div>
          ))}
        </div>
        <div className="av-center">{rsBtn && <Btn b={rsBtn} />}</div>
      </section>

      {/* BLOG */}
      <section className="av-blog">
        <div className="av-wrap">
          <div className="av-blog-h">
            <h2 className="av-display sm" data-reveal>{a.home_blog_title}</h2>
            <p className="av-lead" data-reveal="0.1">{a.home_blog_sub_title}</p>
          </div>
          <div className="av-blog-g">
            {latest.length === 0 && <p>No posts found.</p>}
            {latest.map((p, i) => {
              const cat = Array.isArray(p.categories) ? p.categories.find((c: any) => typeof c === 'object') : null
              const href = `/${p.slug}/`
              return (
                <article className="av-post" data-tilt data-reveal={i * 0.08} key={p.id}>
                  <a href={href} className="av-post-img"><img src={p.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`} alt={p.title} loading="lazy" /></a>
                  <div className="av-post-b">
                    <div className="av-meta"><span>{cat?.name ?? 'Blog'}</span><span>|</span><span>{monthYear(p.publishedAt)}</span></div>
                    <h3><a href={href}>{words(p.title, 8)}</a></h3>
                    <p>{excerptOf(p, 10)}</p>
                    <a href={href} className="av-more">Learn More <i>→</i></a>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="av-center"><a href="/blog/" className="av-btn ghost" data-magnetic><span>View More Blogs</span><i>→</i></a></div>
        </div>
      </section>

      <FaqSection a={a} />
      <CtaBand title={gc.footer_form_left_title} content={gc.footer_form_left_content} formTitle={gc.footer_form_right_title} form={gc.contactForm} />
    </div>
  )
}
