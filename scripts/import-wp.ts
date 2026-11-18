/**
 * Import the full WordPress export (seed/wp-full.json, produced by scripts/extract-wp.py)
 * into the local Payload database. No media is copied: featured/inline images keep
 * pointing at https://aivastra.com/wp-content/uploads/… until R2 storage exists.
 *
 *   pnpm import:wp       (wipes the DB first)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'
import { slugify } from '../src/lib/slug'
import defs from '../src/acf/definitions.json'

const san = (n: string) => n.replace(/[^A-Za-z0-9_]/g, '_')
const TPL: Record<string, string> = { default: 'default', 'template-parts/category.php': 'category', 'template-parts/about-page-template.php': 'about', 'template-parts/pricing-page.php': 'pricing', 'template-parts/template-contact.php': 'contact', 'template-parts/virtual-try-on.php': 'virtual-try-on', 'template-parts/ai-showcase-page.php': 'ai-showcase', 'template-parts/shopify-page.php': 'shopify', 'template-parts/market-places.php': 'market-places', 'template-parts/case-studies-page-template.php': 'case-studies', 'template-parts/guide-page-template.php': 'guide', 'template-parts/update-page-template.php': 'update', 'template-parts/template-document.php': 'document' }

const here = path.dirname(fileURLToPath(import.meta.url))
const WP = JSON.parse(fs.readFileSync(path.join(here, '../seed/wp-full.json'), 'utf8'))
const ctx = { disableRevalidate: true }
const ORIGIN = 'https://aivastra.com'

type WpItem = {
  id: number; type: string; status: string; title: string; slug: string; date: string; modified: string
  excerpt: string; html: string; parent: number; menuOrder: number; author: number; terms: string[]; meta: Record<string, string>
}
const items: WpItem[] = WP.items

const COLLECTIONS = ['form-submissions', 'forms', 'redirects', 'posts', 'guides', 'cases', 'updates', 'reviews', 'pages', 'categories', 'tags', 'section-categories', 'media', 'users']

// ───────────── helpers ─────────────
const decode = (s: string) => new JSDOM(`<body>${s || ''}</body>`).window.document.body.textContent?.replace(/ /g, ' ').trim() ?? ''
const fixUrl = (u: string) => {
  if (!u) return u
  if (u.startsWith('/')) return ORIGIN + u
  return u.replace(/^https?:\/\/(?:new\.|www\.)?aivastra\.(?:com|local)/, ORIGIN)
}
const attachmentUrl = (id?: string) => {
  const a = id && WP.attachments[id]
  return a?.file ? `${ORIGIN}/wp-content/uploads/${a.file}` : undefined
}
const attachmentAlt = (id?: string) => (id && WP.attachments[id]?.alt) || ''
const iso = (d: string) => (d && !d.startsWith('0000') ? new Date(d.replace(' ', 'T') + 'Z').toISOString() : undefined)
/** Internal links → site-relative, so they follow whichever domain the site runs on. */
const relinks = (h: string) =>
  h
    .replace(/(href=["'])https?:\/\/(?:new\.|www\.)?aivastra\.(?:com|local)(?=["'])/gi, '$1/') // bare domain → "/"
    .replace(/(href=["'])https?:\/\/(?:new\.|www\.)?aivastra\.(?:com|local)(?=\/|[#?])/gi, '$1')
const fixAssets = (h: string) => h.replace(/https?:\/\/(?:new\.|www\.)?aivastra\.(?:com|local)(?=\/wp-content)/g, ORIGIN)
type Def = { name: string; type: string; templates?: string[]; fields?: Def[] }
/** Read one ACF field (and nested repeaters) out of flat WordPress meta. */
function acfValue(m: Record<string, string>, def: Def, key: string): any {
  const v = m[key]
  switch (def.type) {
    case 'repeater': {
      const rows: any[] = []
      for (let i = 0; i < Number(v || 0); i++) {
        const row: Record<string, any> = {}
        for (const sub of def.fields ?? []) row[san(sub.name)] = acfValue(m, sub, `${key}_${i}_${sub.name}`)
        rows.push(row)
      }
      return rows
    }
    case 'gallery': {
      // serialized PHP list of attachment ids: a:2:{i:0;s:4:"2920";i:1;s:4:"2919";}
      const ids = [...(v || '').matchAll(/s:\d+:"(\d+)"/g)].map((m) => m[1])
      return ids.map((id) => ({ url: attachmentUrl(id), alt: attachmentAlt(id) })).filter((x) => x.url)
    }
    case 'image':
    case 'file':
      return /^\d+$/.test(v || '') ? attachmentUrl(v) : v ? fixAssets(v) : undefined
    case 'link': {
      if (!v) return undefined
      const g = (k: string) => new RegExp(`"${k}";s:\\d+:"([^"]*)"`).exec(v)?.[1]
      return { url: g('url') ? relinks(`href="${g('url')}"`).slice(6, -1) : undefined, title: g('title'), target: g('target') }
    }
    default:
      return v ? fixAssets(relinks(v)) : undefined
  }
}
const randId = () => Math.random().toString(36).slice(2, 12)

/** Rank Math "%title% %sep% %sitename%"-style variables → plain text; drop if anything is left unresolved. */
function expand(tpl: string | undefined, it: WpItem): string | undefined {
  if (!tpl) return undefined
  const out = decode(tpl)
    .replace(/%title%/g, decode(it.title))
    .replace(/%sitename%/g, 'AI Vastra')
    .replace(/%sep%/g, '-')
    .replace(/%excerpt%/g, decode(it.excerpt))
    .replace(/%page%/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return /%[a-z_]+%/i.test(out) || !out ? undefined : out
}

async function main() {
  const payload = await getPayload({ config })
  const log = (m: string) => payload.logger.info(`[import] ${m}`)

  for (const c of COLLECTIONS) {
    await payload.delete({ collection: c as any, where: { id: { exists: true } }, context: ctx, overrideAccess: true } as any)
  }
  log('wiped')

  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const toLex = (html: string) => convertHTMLToLexical({ editorConfig, html, JSDOM }) as any
  const emptyDoc = () => toLex('<p></p>')

  /** HTML → Lexical, turning every <img> into an externalImage block. */
  const lex = (raw: string) => {
    let html = relinks(raw || '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
      .replace(/\[\/?[a-z_]+[^\]]*\]/gi, '')
      .replace(/<h1/gi, '<h2').replace(/<\/h1>/gi, '</h2>')
      .replace(/<h[56]/gi, '<h4').replace(/<\/h[56]>/gi, '</h4>')
      .replace(/<\/?figure[^>]*>/gi, '')
    const rootChildren: any[] = []
    const parts = html.split(/(<img\b[^>]*>)/gi)
    let doc: any
    for (const part of parts) {
      if (/^<img\b/i.test(part)) {
        const src = /\bsrc=["']([^"']+)["']/i.exec(part)?.[1] || /\bdata-src=["']([^"']+)["']/i.exec(part)?.[1]
        if (!src || src.startsWith('data:')) continue
        const alt = /\balt=["']([^"']*)["']/i.exec(part)?.[1] || ''
        rootChildren.push({ type: 'block', version: 2, format: '', fields: { id: randId(), blockName: '', blockType: 'externalImage', url: fixUrl(src), alt: decode(alt) } })
      } else {
        const cleaned = part.replace(/<a\b[^>]*>\s*<\/a>/gi, '').replace(/<p>\s*<\/p>/gi, '').replace(/<\/?(p|div|span|a)>\s*$/i, (m) => (/^<\//.test(m) ? '' : m))
        if (!cleaned.replace(/<[^>]*>/g, '').trim()) continue
        const body = /<[a-z][\s\S]*>/i.test(cleaned) ? cleaned : `<p>${cleaned}</p>`
        const l = toLex(body)
        doc ??= l
        rootChildren.push(...l.root.children)
      }
    }
    if (!doc) doc = emptyDoc()
    doc.root.children = rootChildren.length ? rootChildren : emptyDoc().root.children
    return doc
  }
  const plain = (s: string) => ({ ...emptyDoc(), ...lex(`<p>${s}</p>`) })

  // ───────────── users ─────────────
  const mk = (email: string, name: string, role: string) => payload.create({ collection: 'users', data: { email, name, role, password: 'Admin123!' } as any, context: ctx })
  const admin = await mk('admin@aivastra.test', 'AI Vastra Admin', 'admin')
  await mk('seo@aivastra.test', 'SEO Manager', 'seo')
  await mk('editor@aivastra.test', 'Content Editor', 'editor')
  const authorByWp = new Map<number, number>()
  for (const u of WP.users) {
    const doc = await mk(`author${u.id}@aivastra.test`, u.name || 'AI Vastra', 'editor')
    authorByWp.set(u.id, doc.id as number)
  }

  // ───────────── taxonomies ─────────────
  type Term = { id: string; tax: string; name: string; slug: string; parent: string; description: string }
  const terms: Term[] = WP.terms
  const ttToPayload = new Map<string, { collection: string; id: number }>()
  const termKind: Record<string, string> = { guide_category: 'guide', case_category: 'case', update_category: 'update' }
  const mkTerms = async (taxonomy: string, collection: string, extra?: (t: Term) => object) => {
    const list = terms.filter((t) => t.tax === taxonomy)
    // parents first
    for (const t of [...list].sort((a, b) => Number(a.parent !== '0') - Number(b.parent !== '0'))) {
      const parent = t.parent !== '0' ? ttToPayload.get(t.parent)?.id : undefined
      const doc = await payload.create({
        collection: collection as any,
        data: { name: decode(t.name), slug: t.slug, description: decode(t.description) || undefined, ...(collection === 'categories' ? { parent } : {}), ...(extra?.(t) ?? {}) } as any,
        context: ctx,
      })
      ttToPayload.set(t.id, { collection, id: doc.id as number })
    }
  }
  await mkTerms('category', 'categories')
  await mkTerms('post_tag', 'tags')
  for (const tax of Object.keys(termKind)) await mkTerms(tax, 'section-categories', () => ({ kind: termKind[tax] }))
  log(`terms: ${ttToPayload.size}`)

  const termsOf = (it: WpItem, collection: string) => it.terms.map((t) => ttToPayload.get(t)).filter((x) => x?.collection === collection).map((x) => x!.id)

  // ───────────── shared item mapping ─────────────
  const faqOf = (m: Record<string, string>) => {
    const n = Number(m.accordion_list || 0)
    const out: { question: string; answer: string }[] = []
    for (let i = 0; i < n; i++) {
      const q = m[`accordion_list_${i}_accordion_question`], a = m[`accordion_list_${i}_accordion_answer`]
      if (q && a) out.push({ question: decode(q), answer: decode(a) })
    }
    return out
  }
  const seoOf = (it: WpItem) => {
    const m = it.meta
    const robots = m.rank_math_robots || ''
    return {
      title: expand(m.rank_math_title, it),
      description: expand(m.rank_math_description, it),
      focusKeyword: m.rank_math_focus_keyword || undefined,
      noindex: /noindex/.test(robots),
      nofollow: /nofollow/.test(robots),
      customSchema: m.saswp_custom_schema_field || m.schema || undefined,
    }
  }
  const base = (it: WpItem) => ({
    title: decode(it.title) || it.slug,
    slug: it.slug || slugify(decode(it.title)),
    publishedAt: iso(it.date),
    modifiedAt: iso(it.modified),
    meta: seoOf(it),
    _status: it.status === 'publish' ? 'published' : 'draft',
  })
  const cover = (it: WpItem) => ({ featuredImageUrl: attachmentUrl(it.meta._thumbnail_id), featuredImageAlt: attachmentAlt(it.meta._thumbnail_id) || undefined })
  const faqTitle = (it: WpItem) => (faqOf(it.meta).length ? it.meta.accordion_title || it.meta.category_accordion_title || 'Frequently asked questions' : undefined)

  /** create with slug-collision retry */
  const create = async (collection: string, data: any, draft: boolean) => {
    for (let n = 0; n < 4; n++) {
      try {
        return await payload.create({ collection: collection as any, data: n ? { ...data, slug: `${data.slug}-${n + 1}` } : data, draft, context: ctx })
      } catch (e: any) {
        if (!/slug|unique|already/i.test(JSON.stringify(e?.data ?? e?.message ?? ''))) throw e
      }
    }
    throw new Error(`slug collision: ${data.slug}`)
  }

  const wpToPayload = new Map<number, { collection: string; id: number; slug: string }>()
  const failures: string[] = []
  const safe = async (label: string, fn: () => Promise<any>) => {
    try { return await fn() } catch (e: any) { failures.push(`${label}: ${e?.data?.errors ? JSON.stringify(e.data.errors) : e.message}`) }
  }

  // ───────────── posts ─────────────
  let n = 0
  for (const it of items.filter((i) => i.type === 'post')) {
    await safe(`post ${it.id} ${it.slug}`, async () => {
      const cats = termsOf(it, 'categories')
      const primaryTt = it.meta.rank_math_primary_category
      const doc = await create('posts', {
        ...base(it),
        excerpt: decode(it.excerpt) || undefined,
        content: lex(it.html),
        ...cover(it),
        categories: cats,
        primaryCategory: cats.includes(Number(ttToPayload.get(primaryTt)?.id)) ? ttToPayload.get(primaryTt)?.id : cats[0],
        tags: termsOf(it, 'tags'),
        author: authorByWp.get(it.author) ?? admin.id,
        faqTitle: faqTitle(it),
        faq: faqOf(it.meta),
      }, it.status !== 'publish')
      wpToPayload.set(it.id, { collection: 'posts', id: doc.id as number, slug: doc.slug as string })
      n++
    })
  }
  log(`posts: ${n}`)

  // ───────────── guides / cases / updates / reviews ─────────────
  const cpt: Record<string, { c: string; cat: string }> = { guide: { c: 'guides', cat: 'section-categories' }, case: { c: 'cases', cat: 'section-categories' }, update: { c: 'updates', cat: 'section-categories' }, review: { c: 'reviews', cat: '' } }
  for (const it of items.filter((i) => cpt[i.type])) {
    await safe(`${it.type} ${it.id}`, async () => {
      const { c } = cpt[it.type]
      const category = termsOf(it, 'section-categories')[0]
      const extra =
        it.type === 'guide' ? { category, order: it.menuOrder, excerpt: decode(it.excerpt) || undefined, content: lex(it.html), ...cover(it), faqTitle: faqTitle(it), faq: faqOf(it.meta) }
        : it.type === 'case' ? { studyParagraph: it.meta.case_studies_paragraph || undefined, studyTop: Array.from({ length: Number(it.meta.case_studies_top || 0) }, (_, i) => ({ title: it.meta[`case_studies_top_${i}_case_studies_title`] || ' ', subtitle: it.meta[`case_studies_top_${i}_case_studies_subtitle`] || undefined })), category, excerpt: decode(it.excerpt) || undefined, content: lex(it.html), ...cover(it), faqTitle: faqTitle(it), faq: faqOf(it.meta) }
        : it.type === 'update' ? { category, excerpt: decode(it.excerpt) || undefined, content: lex(it.html), ...cover(it), version: it.meta.version || undefined, releaseDate: iso(it.date) }
        : { body: decode(it.html) || decode(it.title), content: lex(it.html), platform: 'self', madeForYouItems: Array.from({ length: Number(it.meta.shopify_made_for_you_if_items || 0) }, (_, i) => ({ star: attachmentUrl(it.meta[`shopify_made_for_you_if_items_${i}_shopify_made_star_img`]), text: fixAssets(relinks(it.meta[`shopify_made_for_you_if_items_${i}_shopify_made_for_you_if_item_contet`] || '')) || undefined, profile: attachmentUrl(it.meta[`shopify_made_for_you_if_items_${i}_profile_img`]), author: it.meta[`shopify_made_for_you_if_items_${i}_review_content`] || undefined })) }
      const doc = await create(c, { ...base(it), ...extra }, it.status !== 'publish')
      wpToPayload.set(it.id, { collection: c, id: doc.id as number, slug: doc.slug as string })
    })
  }
  log('guides/cases/updates/reviews done')

  // ───────────── pages ─────────────
  const FEED_BY_TEMPLATE: Record<string, { source: string; paginate: boolean }> = {
    'template-parts/case-studies-page-template.php': { source: 'cases', paginate: true },
    'template-parts/guide-page-template.php': { source: 'guides', paginate: false },
    'template-parts/template-document.php': { source: 'guides', paginate: false },
    'template-parts/update-page-template.php': { source: 'updates', paginate: false },
  }
  const pageLayout = (it: WpItem) => {
    const m = it.meta
    const blocks: any[] = []
    const title = m.about_banner_title || m.banner_top_title || decode(it.title)
    const sub = m.about_banner_content || m.description || m.sub_title || m.genaral_page_banner_left_content || ''
    blocks.push({ blockType: 'hero', heading: decode(title) || decode(it.title), subheading: decode(sub) || undefined, imageUrl: attachmentUrl(m.genaral_page_banner_right_image || m.banner_image) })

    const taken = new Set<string>()
    // raw HTML sections (ACF wysiwyg/text fields), in field order
    for (const [k, v] of Object.entries(m)) {
      if (k.startsWith('rank_math') || k.startsWith('accordion_list_') || k === 'schema' || k === 'saswp_custom_schema_field' || k.startsWith('_')) continue
      if (typeof v === 'string' && v.length > 120 && /<(div|section|ul|p|h\d|table)\b/i.test(v) && !/application\/ld\+json/.test(v)) {
        blocks.push({ blockType: 'html', label: k, html: relinks(v).replace(/(src=["'])\/(?!\/)/g, `$1${ORIGIN}/`) })
        taken.add(k)
      }
    }
    // ACF repeaters (K = count, children K_N_field) → feature grids
    for (const [k, v] of Object.entries(m)) {
      if (!/^\d+$/.test(v || '') || Number(v) < 1 || k === 'accordion_list' || k.startsWith('social_media') || /_\d+_/.test(k)) continue
      const rows: any[] = []
      for (let i = 0; i < Number(v); i++) {
        const fields = Object.entries(m).filter(([kk]) => kk.startsWith(`${k}_${i}_`) && !/_\d+_/.test(kk.slice(`${k}_${i}_`.length)))
        const strings = fields.map(([kk, vv]) => ({ key: kk, val: vv })).filter((f) => f.val && !/^\d+$/.test(f.val))
        const imgField = fields.find(([kk, vv]) => /image|img|logo|icon/.test(kk) && /^\d+$/.test(vv || ''))
        if (strings.length || imgField) rows.push({ title: decode(strings[0]?.val || '') || ' ', content: decode(strings.slice(1).map((s) => s.val).join('\n')) || undefined, imageUrl: imgField ? attachmentUrl(imgField[1]) : undefined })
      }
      if (rows.length) {
        const stem = k.replace(/_(list|items?)$/, '')
        blocks.push({ blockType: 'featureGrid', heading: decode(m[`${stem}_title`] || '') || undefined, eyebrow: decode(m[`${stem}_sub_title`] || '') || undefined, columns: rows.length % 4 === 0 ? '4' : '3', items: rows })
      }
    }
    const faq = faqOf(m)
    if (faq.length) blocks.push({ blockType: 'faq', eyebrow: decode(m.category_accordion_eyebrow || '') || undefined, heading: decode(m.category_accordion_title || m.accordion_title || '') || 'Frequently asked questions', items: faq })
    const feed = FEED_BY_TEMPLATE[m._wp_page_template || ''] ?? (it.slug === 'blog' ? { source: 'posts', paginate: true } : undefined)
    if (feed) blocks.push({ blockType: 'postFeed', source: feed.source, limit: feed.source === 'posts' ? 9 : 12, paginate: feed.paginate })
    return blocks
  }

  const pageItems = items.filter((i) => i.type === 'page')
  const byId = new Map(pageItems.map((p) => [p.id, p]))
  const depth = (p: WpItem): number => (p.parent && byId.get(p.parent) ? 1 + depth(byId.get(p.parent)!) : 0)
  for (const it of [...pageItems].sort((a, b) => depth(a) - depth(b))) {
    await safe(`page ${it.id} ${it.slug}`, async () => {
      const parent = it.parent ? wpToPayload.get(it.parent)?.id : undefined
      const legacy = Object.fromEntries(Object.entries(it.meta).filter(([k]) => !k.startsWith('rank_math')))
      const rawTpl = it.meta._wp_page_template
      const template = String(it.id) === String(WP.site.page_on_front) ? 'front-page' : String(it.id) === String(WP.site.page_for_posts) ? 'blog' : (TPL[rawTpl || 'default'] ?? 'default')
      const acf: Record<string, any> = {}
      for (const g of defs.groups as { fields: Def[] }[])
        for (const f of g.fields) if (f.templates?.includes(template)) acf[san(f.name)] = acfValue(it.meta, f, f.name)
      const doc = await create('pages', {
        ...base(it),
        template,
        acf,
        slug: it.slug || slugify(decode(it.title)),
        parent,
        layout: pageLayout(it),
        content: it.html.trim() ? lex(it.html) : undefined,
        legacyTemplate: it.meta._wp_page_template || undefined,
        legacyFields: legacy,
        showFooterForm: !['contact'].includes(it.slug),
      }, it.status !== 'publish')
      wpToPayload.set(it.id, { collection: 'pages', id: doc.id as number, slug: doc.slug as string })
    })
  }
  log(`pages: ${pageItems.length}`)

  // ───────────── forms ─────────────
  const O = WP.acfOptions
  const form = await payload.create({
    collection: 'forms',
    data: {
      title: 'Contact form',
      submitButtonLabel: 'Submit',
      confirmationType: 'message',
      confirmationMessage: plain('Thanks! Our team will get back to you shortly.'),
      fields: [
        { blockType: 'text', name: 'name', label: 'Name', required: true, width: 100 },
        { blockType: 'email', name: 'email', label: 'Email', required: true, width: 100 },
        { blockType: 'text', name: 'phone', label: 'Phone', width: 100 },
        { blockType: 'textarea', name: 'message', label: 'Message', required: true, width: 100 },
      ],
      emails: process.env.FORM_NOTIFY_TO ? [{ emailTo: process.env.FORM_NOTIFY_TO, subject: 'New AI Vastra website enquiry', message: plain('{{*:table}}') }] : [],
    } as any,
    context: ctx,
  })
  const newsletter = await payload.create({
    collection: 'forms',
    data: {
      title: 'Newsletter',
      submitButtonLabel: 'Subscribe',
      mailchimpSync: true,
      confirmationType: 'message',
      confirmationMessage: plain('Thanks for subscribing!'),
      fields: [{ blockType: 'email', name: 'email', label: 'Email', required: true, width: 100 }],
      emails: [],
    } as any,
    context: ctx,
  })

  // ───────────── redirects ─────────────
  const seen = new Set<string>()
  for (const r of WP.redirects) {
    const from = '/' + String(r.from).trim().replace(/^\/+|\/+$/g, '')
    if (seen.has(from)) continue
    seen.add(from)
    const target = r.toId ? wpToPayload.get(r.toId) : undefined
    await safe(`redirect ${from}`, () =>
      payload.create({
        collection: 'redirects',
        data: { from, type: r.type, to: target ? { type: 'reference', reference: { relationTo: target.collection, value: target.id } } : { type: 'custom', url: r.toUrl || '/' } } as any,
        context: ctx,
      }),
    )
  }

  // ───────────── navigation ─────────────
  const linkOf = (mi: any) => {
    const t = mi.type === 'post_type' ? wpToPayload.get(mi.objectId) : undefined
    const label = decode(mi.title) || (t ? decode(byId.get(mi.objectId)?.title || t.slug) : mi.url || '')
    if (t) return { type: 'reference', reference: { relationTo: t.collection, value: t.id }, label }
    const url = fixUrl(mi.url || '#').replace(ORIGIN, '') || '/'
    return { type: 'custom', url, label }
  }
  const menu = (slug: string) => (WP.menus[slug]?.items ?? []) as any[]
  const main = menu('main-menu')
  const topLevel = main.filter((i) => !i.parent)
  const headerItems = topLevel.slice(0, -1).map((i) => ({ link: linkOf(i), children: main.filter((c) => c.parent === i.id).map((c) => ({ link: linkOf(c) })) }))
  const lastItem = topLevel.at(-1)
  const col = (title: string, slug: string) => ({ title, links: menu(slug).map((i) => ({ link: linkOf(i) })) })
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: headerItems,
      headerButton: lastItem ? linkOf(lastItem) : undefined,
      footerColumns: [col('Solutions', 'solutions-menu'), col('Categories', 'categories'), col('Marketplaces', 'marketplaces'), col('Company', 'company'), col('Resources', 'resources')].filter((c) => c.links.length),
      legalLinks: ['privacy-policy', 'terms'].map((s) => [...wpToPayload.values()].find((v) => v.collection === 'pages' && v.slug === s)).filter(Boolean).map((v) => ({ link: { type: 'reference', reference: { relationTo: 'pages', value: v!.id }, label: v!.slug === 'terms' ? 'Terms of Service' : 'Privacy Policy' } })),
    } as any,
    context: ctx,
  })

  // ───────────── settings / global content ─────────────
  const socials = Array.from({ length: Number(O.social_media || 0) }, (_, i) => O[`social_media_${i}_social_media_link`]).filter(Boolean).map((url) => ({ platform: /facebook/.test(url) ? 'facebook' : /instagram/.test(url) ? 'instagram' : /youtube/.test(url) ? 'youtube' : /linkedin/.test(url) ? 'linkedin' : 'other', url }))
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'AI Vastra',
      tagline: decode(WP.site.blogdescription) || 'AI catalogue photography & virtual try-on for fashion.',
      titleTemplate: '%s - AI Vastra',
      email: O.mail_text, phone: O.phone_text,
      address: [O.head_title && `${O.head_title}: ${decode(O.head_content)}`, O.corporate_title && `${O.corporate_title}: ${decode(O.corporate_content)}`].filter(Boolean).join('\n'),
      socials,
      blockIndexing: false, // local only; set TRUE on staging
    } as any,
    context: ctx,
  })
  const gc: Record<string, any> = { contactForm: form.id, newsletterForm: newsletter.id }
  for (const f of (defs as any).globalContent as Def[]) gc[san(f.name)] = acfValue(O, f, f.name)
  await payload.updateGlobal({ slug: 'global-content', data: gc as any, context: ctx })

  console.log('\n──────── import report ────────')
  for (const c of ['pages', 'posts', 'guides', 'cases', 'updates', 'reviews', 'categories', 'tags', 'section-categories', 'redirects']) {
    console.log(c.padEnd(20), (await payload.count({ collection: c as any })).totalDocs)
  }
  console.log(`failures: ${failures.length}`)
  failures.slice(0, 15).forEach((f) => console.log(' ✗', f.slice(0, 220)))
  process.exit(failures.length ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
