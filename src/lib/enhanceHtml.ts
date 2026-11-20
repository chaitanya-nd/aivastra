/**
 * Render-time HTML polish for post bodies (WordPress does the same in the_content):
 *  - oEmbed: a paragraph containing only a YouTube / Vimeo / X / Loom / Spotify URL becomes an embed
 *  - images: lazy loading, async decoding, and an alt text from the file name when it is missing
 */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const frame = (src: string, title: string, ratio = '16 / 9') =>
  `<figure class="wp-block-embed av-embed" style="aspect-ratio:${ratio}"><iframe src="${esc(src)}" title="${esc(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" style="width:100%;height:100%;border:0"></iframe></figure>`

function embedFor(url: string): string | null {
  let m: RegExpMatchArray | null
  if ((m = url.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/i))) return frame(`https://www.youtube-nocookie.com/embed/${m[1]}`, 'YouTube video')
  if ((m = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/i))) return frame(`https://player.vimeo.com/video/${m[1]}`, 'Vimeo video')
  if ((m = url.match(/^https?:\/\/(?:www\.)?loom\.com\/share\/([\w]+)/i))) return frame(`https://www.loom.com/embed/${m[1]}`, 'Loom video')
  if ((m = url.match(/^https?:\/\/open\.spotify\.com\/(track|album|playlist|episode|show)\/([\w]+)/i))) return frame(`https://open.spotify.com/embed/${m[1]}/${m[2]}`, 'Spotify', m[1] === 'track' || m[1] === 'episode' ? '5 / 1' : '4 / 3')
  if (/^https?:\/\/(?:www\.)?(?:twitter|x)\.com\/\w+\/status\/\d+/i.test(url))
    return `<figure class="wp-block-embed av-embed-tweet"><blockquote class="twitter-tweet" data-dnt="true"><a href="${esc(url.replace('://x.com', '://twitter.com'))}">${esc(url)}</a></blockquote><script async src="https://platform.twitter.com/widgets.js"></script></figure>`
  return null
}

const altFromFile = (src: string) => {
  const f = decodeURIComponent(src.split(/[?#]/)[0].split('/').pop() || '').replace(/\.[a-z0-9]+$/i, '').replace(/-\d+x\d+$/, '')
  return f.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function enhanceHtml(html: string): string {
  if (!html) return html
  let out = html.replace(/<p[^>]*>\s*(?:<a[^>]*>)?\s*(https?:\/\/[^\s<]+?)\s*(?:<\/a>)?\s*<\/p>/gi, (all, url: string) => embedFor(url.replace(/&amp;/g, '&')) ?? all)
  out = out.replace(/<img\b([^>]*)>/gi, (tag, attrs: string) => {
    let a = attrs
    if (!/\sloading=/i.test(a)) a += ' loading="lazy"'
    if (!/\sdecoding=/i.test(a)) a += ' decoding="async"'
    const alt = a.match(/\salt=["']([^"']*)["']/i)
    if (!alt || !alt[1].trim()) {
      const src = a.match(/\ssrc=["']([^"']+)["']/i)?.[1]
      const text = src ? esc(altFromFile(src)) : ''
      a = alt ? a.replace(/\salt=["'][^"']*["']/i, ` alt="${text}"`) : `${a} alt="${text}"`
    }
    return `<img${a}>`
  })
  return out
}
