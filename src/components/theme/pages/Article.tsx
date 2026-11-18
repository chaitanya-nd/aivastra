import type { ReactNode } from 'react'

/** Shared dark "article" building blocks (guide, case study, blog post). Styles: src/ui/dark.css → .av-art */

export function ArtHero({ crumbs, pill, title, meta, lead, aside }: { crumbs?: ReactNode; pill?: string; title: ReactNode; meta?: ReactNode; lead?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="av-art-hero">
      <div className="av-art-wrap">
        {crumbs}
        {pill && <span className="av-art-pill">{pill}</span>}
        <h1>{title}</h1>
        {lead && <p className="av-art-lead">{lead}</p>}
        {meta && <div className="av-art-meta">{meta}</div>}
        {aside}
      </div>
    </header>
  )
}

export function ArtCover({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="av-art-wrap">
      <figure className="av-art-cover"><img src={src} alt={alt} /></figure>
    </div>
  )
}

export function ArtCards({ title, items, linkLabel, action }: { action?: { label: string; href: string }; title: string; items: { id: string | number; href: string; img: string; title: string; text: string }[]; linkLabel?: string }) {
  if (!items.length) return null
  return (
    <section className="av-art-related">
      <div className="av-art-wrap">
        <div className="av-art-related-top"><h2>{title}</h2>{action && <a className="av-art-more" href={action.href}>{action.label}</a>}</div>
        <div className="av-art-cards">
          {items.map((c) => (
            <a className="av-art-card" href={c.href} key={c.id}>
              <span className="av-art-card-img"><img src={c.img} alt={c.title} loading="lazy" /></span>
              <span className="av-art-card-body">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="av-art-card-link">{linkLabel || 'Read more'} <i aria-hidden>→</i></span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
