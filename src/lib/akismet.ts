import { SITE_URL } from './urls'

/** Akismet spam check (AKISMET_API_KEY). Returns null when not configured or unreachable, so comments never get stuck. */
export async function akismetIsSpam(c: { ip: string; userAgent: string; referrer?: string; permalink: string; name: string; email: string; url?: string; content: string }): Promise<boolean | null> {
  const key = process.env.AKISMET_API_KEY
  if (!key) return null
  try {
    const body = new URLSearchParams({ blog: SITE_URL, user_ip: c.ip, user_agent: c.userAgent, referrer: c.referrer || '', permalink: c.permalink, comment_type: 'comment', comment_author: c.name, comment_author_email: c.email, comment_author_url: c.url || '', comment_content: c.content, blog_lang: 'en', blog_charset: 'UTF-8' })
    const r = await fetch(`https://${key}.rest.akismet.com/1.1/comment-check`, { method: 'POST', body, signal: AbortSignal.timeout(5000) })
    const t = (await r.text()).trim()
    return t === 'true' ? true : t === 'false' ? false : null
  } catch { return null }
}
