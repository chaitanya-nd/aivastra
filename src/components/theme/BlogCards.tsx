import { excerptOf, THEME_URL, words } from './util'

const monthYear = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '')
const catOf = (p: any) => (Array.isArray(p.categories) ? p.categories.find((c: any) => typeof c === 'object') : null)

/** content-blog-card.php */
export function BlogCard({ p }: { p: any }) {
  const href = `/${p.slug}/`
  return (
    <article className="blog-card">
      <div className="card-thumb-holder">
        <a href={href}><img src={p.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`} alt={p.title} loading="lazy" /></a>
      </div>
      <div className="card-content-area">
        <div className="card-meta-line">
          <span className="card-category-tag">{catOf(p)?.name ?? 'AI Technology'}</span>
          <span className="card-meta-divider">|</span>
          <span className="card-date-tag">{monthYear(p.publishedAt)}</span>
        </div>
        <div className="card-title-text"><a href={href}>{p.title}</a></div>
        <p className="card-excerpt-text">{excerptOf(p, 10)}</p>
        <div className="card-action-row"><a className="card-learn-more-link" href={href}>Learn More</a></div>
      </div>
    </article>
  )
}

/** The "hm-blog-blk" 3-up used on the home page and at the end of every post. */
export function LatestPosts({ posts, excerptWords = 10 }: { posts: any[]; excerptWords?: number }) {
  return (
    <div className="hm-blog-blk">
      {posts.length === 0 && <p>No posts found.</p>}
      {posts.map((p) => {
        const href = `/${p.slug}/`
        return (
          <div className="hmblg-item" key={p.id}>
            <div className="hmblg-post-img"><a href={href}><img src={p.featuredImageUrl || `${THEME_URL}/images/newdefault-img.jpg`} alt={p.title} /></a></div>
            <div className="hmblgcnt">
              <div className="blog-meta">
                <span className="gradient-text">{catOf(p)?.name ?? 'Blog'}</span>
                <span>|</span>
                <span className="gradient-date">{monthYear(p.publishedAt)}</span>
              </div>
              <h3><a href={href}>{words(p.title, 8)}</a></h3>
              <p>{excerptOf(p, excerptWords)}</p>
              <div className="hmpost_btn"><a href={href}>Learn More</a></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
