/**
 * Seed local dev data.
 *  - Real content sample from the WordPress export (seed/wp-sample.json):
 *    14 posts, 6 guides, 6 cases, 3 updates, 1 review, legal pages, 6 redirects, categories.
 *  - Hand-built pages (home, about, pricing, contact, blog …) using the page-builder blocks.
 *  - Generated placeholder images (the WP media library is intentionally NOT imported yet).
 *
 *   pnpm seed          # only if the DB is empty
 *   pnpm seed:reset    # wipe everything, then seed
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const sample = JSON.parse(fs.readFileSync(path.join(here, '../seed/wp-sample.json'), 'utf8'))
const RESET = process.argv.includes('--reset')
const ctx = { disableRevalidate: true }

const COLLECTIONS = [
  'form-submissions', 'forms', 'redirects', 'posts', 'guides', 'cases', 'updates', 'reviews',
  'pages', 'categories', 'tags', 'section-categories', 'media', 'users',
] as const

async function main() {
  const payload = await getPayload({ config })
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  if (RESET) {
    for (const c of COLLECTIONS) {
      await payload.delete({ collection: c as any, where: { id: { exists: true } }, context: ctx, overrideAccess: true } as any)
    }
    log('wiped all collections')
  } else if ((await payload.count({ collection: 'users' })).totalDocs > 0) {
    log('database already has data — run `pnpm seed:reset` to start over')
    process.exit(0)
  }

  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const lex = (html: string) => {
    const cleaned = (html || '')
      .replace(/\[\/?[a-z_]+[^\]]*\]/gi, '')
      .replace(/<h1/g, '<h2').replace(/<\/h1>/g, '</h2>')
      .replace(/<h[56]/g, '<h4').replace(/<\/h[56]>/g, '</h4>')
    const withTags = /<[a-z][\s\S]*>/i.test(cleaned) ? cleaned : `<p>${cleaned}</p>`
    return convertHTMLToLexical({ editorConfig, html: withTags, JSDOM }) as any
  }
  const text = (s: string) => lex(`<p>${s}</p>`)

  // ───────────────────────── users ─────────────────────────
  const mkUser = (email: string, name: string, role: string) =>
    payload.create({ collection: 'users', data: { email, name, role, password: 'Admin123!' } as any, context: ctx })
  const admin = await mkUser('admin@aivastra.test', 'AI Vastra Admin', 'admin')
  await mkUser('seo@aivastra.test', 'SEO Manager', 'seo')
  await mkUser('editor@aivastra.test', 'Content Editor', 'editor')
  log('users: admin@ / seo@ / editor@ aivastra.test  (password Admin123!)')

  // ───────────────────────── media (generated) ─────────────────────────
  const palette = [['#5b3df5', '#8a6bff'], ['#0ea5e9', '#6366f1'], ['#f43f5e', '#f59e0b'], ['#10b981', '#06b6d4']]
  const media: any[] = []
  for (const [i, [a, b]] of palette.entries()) {
    const label = ['AI Catalogue', 'Virtual Try-On', 'Fashion Models', 'D2C Growth'][i]
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><text x="800" y="470" font-family="sans-serif" font-size="96" font-weight="700" fill="#fff" text-anchor="middle">${label}</text></svg>`
    const data = await sharp(Buffer.from(svg)).png().toBuffer()
    media.push(
      await payload.create({
        collection: 'media',
        data: { alt: `${label} placeholder` },
        file: { data, mimetype: 'image/png', name: `placeholder-${i + 1}.png`, size: data.length },
        context: ctx,
      }),
    )
  }
  log(`media: ${media.length} placeholder images`)

  // ───────────────────────── taxonomies ─────────────────────────
  const catIds: Record<string, number> = {}
  for (const c of sample.categories.filter((c: any) => c.slug !== 'uncategorized')) {
    const doc = await payload.create({ collection: 'categories', data: { name: c.name, slug: c.slug }, context: ctx })
    catIds[c.slug] = doc.id as number
  }
  const tagIds: Record<string, number> = {}
  const secIds: Record<string, number> = {}
  const sectionNames: [string, string][] = [['guide', 'Getting Started'], ['guide', 'Platform Guides'], ['guide', 'Best Practices'], ['update', 'Product Updates'], ['case', 'Fashion Brands']]
  for (const [kind, name] of sectionNames) {
    const doc = await payload.create({ collection: 'section-categories', data: { name, kind, slug: `${kind}-${name.toLowerCase().replace(/\W+/g, '-')}` } as any, context: ctx })
    secIds[`${kind}:${name}`] = doc.id as number
  }

  // ───────────────────────── forms ─────────────────────────
  const contactForm = await payload.create({
    collection: 'forms',
    data: {
      title: 'Contact form',
      submitButtonLabel: 'Send message',
      confirmationType: 'message',
      confirmationMessage: text('Thanks! Our team will get back to you within one business day.'),
      fields: [
        { blockType: 'text', name: 'name', label: 'Your name', required: true, width: 100 },
        { blockType: 'email', name: 'email', label: 'Work email', required: true, width: 100 },
        { blockType: 'text', name: 'company', label: 'Company', width: 100 },
        { blockType: 'textarea', name: 'message', label: 'How can we help?', required: true, width: 100 },
      ],
      emails: [],
    } as any,
    context: ctx,
  })

  // ───────────────────────── posts (real WP sample) ─────────────────────────
  const catSlugs = Object.keys(catIds)
  const sampleFaq = [
    { question: 'How long does it take to generate an AI catalogue?', answer: 'Most catalogues are generated in minutes once product images are uploaded.' },
    { question: 'Do I need a photoshoot?', answer: 'No. Upload a flat-lay or mannequin shot and AI Vastra renders models, backgrounds and poses.' },
    { question: 'Can I export for marketplaces?', answer: 'Yes. Export sized for Amazon, Myntra, Flipkart and Shopify.' },
  ]
  for (const [i, p] of sample.posts.entries()) {
    const own = p.terms.filter((t: any) => t.tax === 'category' && catIds[t.slug]).map((t: any) => catIds[t.slug])
    const cats = own.length ? own : [catIds[catSlugs[i % catSlugs.length]]]
    const tagList: number[] = []
    for (const t of p.terms.filter((t: any) => t.tax === 'post_tag')) {
      tagIds[t.slug] ??= (await payload.create({ collection: 'tags', data: { name: t.name, slug: t.slug }, context: ctx })).id as number
      tagList.push(tagIds[t.slug])
    }
    await payload.create({
      collection: 'posts',
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || undefined,
        content: lex(p.html),
        categories: cats,
        primaryCategory: cats[0],
        tags: tagList,
        author: admin.id,
        featuredImage: media[i % media.length].id,
        publishedAt: new Date(p.date.replace(' ', 'T') + 'Z').toISOString(),
        faqTitle: p.faq.length || i < 3 ? 'Frequently asked questions' : undefined,
        faq: p.faq.length ? p.faq : i < 3 ? sampleFaq : [],
        meta: {
          title: p.metaTitle || undefined,
          description: p.metaDescription || (p.excerpt ? p.excerpt.slice(0, 155) : undefined),
          focusKeyword: p.focusKeyword || undefined,
        },
        _status: 'published',
      } as any,
      context: ctx,
    })
  }
  log(`posts: ${sample.posts.length} (real) · categories: ${catSlugs.length}`)

  // ───────────────────────── guides / cases / updates / reviews ─────────────────────────
  const guideCats = ['Getting Started', 'Getting Started', 'Platform Guides', 'Platform Guides', 'Best Practices', 'Best Practices']
  for (const [i, g] of sample.guides.entries())
    await payload.create({ collection: 'guides', data: { title: g.title, slug: g.slug, excerpt: g.excerpt || undefined, content: lex(g.html), category: secIds[`guide:${guideCats[i]}`], order: i, featuredImage: media[i % 4].id, meta: { description: `${g.title} — step-by-step AI Vastra guide.` }, _status: 'published' } as any, context: ctx })
  for (const [i, c] of sample.cases.entries())
    await payload.create({ collection: 'cases', data: { title: c.title, slug: c.slug, client: ['Rangoli Silks', 'Urban Weave', 'Kurti House'][i % 3], excerpt: c.excerpt || `How ${c.title.toLowerCase()} changed catalogue operations.`, content: lex(c.html), category: secIds['case:Fashion Brands'], metrics: [{ value: '10×', label: 'Faster catalogue production' }, { value: '-70%', label: 'Photoshoot cost' }, { value: '+34%', label: 'Conversion' }], featuredImage: media[(i + 1) % 4].id, _status: 'published' } as any, context: ctx })
  for (const [i, u] of sample.updates.entries())
    await payload.create({ collection: 'updates', data: { title: u.title, slug: u.slug, content: lex(u.html), category: secIds['update:Product Updates'], version: `v2.${i + 1}`, releaseDate: new Date(Date.now() - i * 864e5 * 21).toISOString(), _status: 'published' } as any, context: ctx })
  for (const r of sample.reviews)
    await payload.create({ collection: 'reviews', data: { title: r.title, slug: r.slug, reviewer: 'Priya S.', reviewerRole: 'Founder, Saree Studio', rating: 5, platform: 'shopify', body: 'AI Vastra cut our catalogue turnaround from weeks to hours.', _status: 'published' } as any, context: ctx })
  log(`guides ${sample.guides.length} · cases ${sample.cases.length} · updates ${sample.updates.length} · reviews ${sample.reviews.length}`)

  // ───────────────────────── pages ─────────────────────────
  const pageIds: Record<string, number> = {}
  const mkPage = async (slug: string, title: string, data: Record<string, any> = {}) => {
    const doc = await payload.create({
      collection: 'pages',
      data: { title, slug, _status: 'published', publishedAt: new Date().toISOString(), ...data } as any,
      context: ctx,
    })
    pageIds[slug] = doc.id as number
    return doc
  }
  const cta = (label: string, url: string) => ({ type: 'custom', url, label })
  const faqItems = sampleFaq

  await mkPage('home', 'Home', {
    meta: { title: 'AI Vastra — AI catalogue photography & virtual try-on for fashion', description: 'Create studio-quality fashion catalogues and virtual try-on experiences with AI — no photoshoot required.' },
    layout: [
      { blockType: 'hero', eyebrow: 'AI catalogue creation', heading: 'Studio-quality fashion catalogues, without the photoshoot', subheading: 'Upload a garment, pick a model, background and pose — get marketplace-ready images in minutes.', image: media[0].id, buttons: [{ link: cta('Book a demo', '/contact/'), style: 'primary' }, { link: cta('See pricing', '/pricing/'), style: 'secondary' }] },
      { blockType: 'featureGrid', eyebrow: 'Why teams choose AI Vastra', heading: 'Built for fashion catalogue teams', columns: '3', items: [{ title: '10× faster', content: 'Go from flat-lay to full catalogue in minutes.' }, { title: 'Consistent look', content: 'Same models, lighting and backgrounds across every SKU.' }, { title: 'Marketplace ready', content: 'Export for Amazon, Myntra, Flipkart, Shopify.' }] },
      { blockType: 'steps', heading: 'How it works', steps: [{ title: 'Upload', content: 'Add your garment photos.' }, { title: 'Choose', content: 'Pick model, pose and background.' }, { title: 'Generate', content: 'AI renders catalogue-ready images.' }, { title: 'Publish', content: 'Export to your store or marketplace.' }] },
      { blockType: 'tabs', heading: 'Every category, covered', tabs: [{ label: 'Sarees', heading: 'Saree drops, shoot-ready', content: 'Realistic draping across fabrics.', image: media[2].id, cta: cta('Explore sarees', '/sarees/') }, { label: 'Kurtis', heading: 'Kurti catalogues, fast', content: 'Consistent fit and styling.', image: media[1].id, cta: cta('Explore kurtis', '/kurtis/') }, { label: 'Lehengas', heading: 'Bridal-ready visuals', content: 'Rich embroidery detail preserved.', image: media[0].id, cta: cta('Explore lehengas', '/lehengas/') }] },
      { blockType: 'testimonials', heading: 'Loved by fashion brands', items: [{ quote: 'We cut catalogue turnaround from weeks to hours.', name: 'Priya S.', role: 'Founder, Saree Studio' }, { quote: 'The consistency across SKUs is unreal.', name: 'Arjun M.', role: 'Head of E-commerce, Urban Weave' }, { quote: 'Our returns dropped after adding try-on.', name: 'Neha K.', role: 'D2C Lead, Kurti House' }] },
      { blockType: 'postFeed', heading: 'Latest from the blog', source: 'posts', limit: 3, paginate: false },
      { blockType: 'faq', eyebrow: 'FAQ', heading: 'Questions, answered', items: faqItems },
      { blockType: 'cta', heading: 'Ready to retire the photoshoot?', text: 'Book a 20-minute demo with our team.', cta: cta('Book a demo', '/contact/'), tone: 'dark' },
    ],
  })
  await mkPage('about-us', 'About Us', {
    meta: { description: 'AI Vastra builds AI catalogue photography and virtual try-on for fashion brands.' },
    layout: [
      { blockType: 'hero', heading: 'We build the AI studio for fashion', subheading: 'AI Vastra helps fashion brands create catalogues and try-on experiences at the speed of e-commerce.', align: 'center' },
      { blockType: 'imageText', heading: 'Our mission', body: 'Make professional fashion imagery accessible to every brand — from a single boutique to a national retailer.', image: media[3].id, imagePosition: 'right', bullets: [{ text: 'Built with fashion creatives' }, { text: 'Designed for Indian ethnic wear' }, { text: 'Privacy-first' }] },
      { blockType: 'faq', items: faqItems },
    ],
  })
  await mkPage('pricing', 'Pricing', {
    meta: { description: 'Simple, credit-based pricing for AI catalogue generation and virtual try-on.' },
    layout: [
      { blockType: 'pricing', heading: 'Simple, credit-based pricing', subheading: 'Start free. Scale when you are ready.', plans: [
        { name: 'Starter', price: '₹4,999', period: '/month', description: 'For boutiques', features: [{ text: '100 credits' }, { text: 'All backgrounds' }, { text: 'Email support' }], cta: cta('Start free trial', '/contact/') },
        { name: 'Growth', price: '₹14,999', period: '/month', description: 'For D2C brands', highlighted: true, features: [{ text: '500 credits' }, { text: 'Custom models' }, { text: 'Priority support' }], cta: cta('Book a demo', '/contact/') },
        { name: 'Enterprise', price: 'Custom', period: '', description: 'For retailers', features: [{ text: 'Unlimited credits' }, { text: 'API + SSO' }, { text: 'Dedicated manager' }], cta: cta('Talk to sales', '/contact/') },
      ] },
      { blockType: 'faq', items: faqItems },
    ],
  })
  await mkPage('contact', 'Contact Us', {
    showFooterForm: false,
    meta: { description: 'Talk to the AI Vastra team about catalogues and virtual try-on.' },
    layout: [{ blockType: 'contactForm', heading: 'Talk to us', text: 'Tell us about your catalogue needs.', form: contactForm.id, details: [{ label: 'Email', value: 'hello@aivastra.test', href: 'mailto:hello@aivastra.test' }, { label: 'Hours', value: 'Mon–Fri, 10am–6pm IST' }] }],
  })
  await mkPage('blog', 'Blogs', {
    meta: { title: 'AI fashion blog — catalogues, try-on & e-commerce | AI Vastra', description: 'Guides and insights on AI catalogue photography, virtual try-on and fashion e-commerce.' },
    layout: [
      { blockType: 'hero', heading: 'The AI Vastra blog', subheading: 'Playbooks for AI-powered fashion catalogues.', align: 'center' },
      { blockType: 'postFeed', source: 'posts', limit: 6, paginate: true },
    ],
  })
  await mkPage('virtual-try-on', 'Virtual Try-On', {
    layout: [
      { blockType: 'hero', eyebrow: 'Virtual try-on', heading: 'Let shoppers see it on a model like them', image: media[1].id, buttons: [{ link: cta('Book a demo', '/contact/'), style: 'primary' }] },
      { blockType: 'featureGrid', heading: 'Why try-on', columns: '3', items: [{ title: 'Fewer returns', content: 'Fit confidence at purchase.' }, { title: 'Higher conversion', content: 'Engaging product pages.' }, { title: 'Easy install', content: 'Shopify app or JS snippet.' }] },
    ],
  })
  await mkPage('catalogue-showcase', 'Catalogue Showcase', {
    layout: [{ blockType: 'hero', heading: 'Catalogue showcase', align: 'center' }, { blockType: 'postFeed', heading: 'Case studies', source: 'cases', limit: 6, paginate: false }],
  })
  await mkPage('case-studies', 'Case Studies', {
    layout: [{ blockType: 'hero', heading: 'Case studies', align: 'center' }, { blockType: 'postFeed', source: 'cases', limit: 9, paginate: true }],
  })
  for (const [slug, title, intro] of [['sarees', 'Launch Every Saree Drop Looking Shoot-Ready', 'Realistic drape, zari and weave detail.'], ['kurtis', 'Keep Every Kurti Launch Catalogue-Ready, Always', 'Consistent fit across sizes.'], ['lehengas', 'Make Every Lehenga Look Bridal-Shoot Ready', 'Heavy embroidery, rendered faithfully.']] as const)
    await mkPage(slug, title, { layout: [{ blockType: 'hero', heading: title, subheading: intro, image: media[2].id, buttons: [{ link: cta('Book a demo', '/contact/'), style: 'primary' }] }, { blockType: 'faq', items: faqItems }, { blockType: 'cta', heading: 'See your range in AI', cta: cta('Get started', '/contact/'), tone: 'brand' }] })
  const docs = await mkPage('documentations', 'Documentations', { layout: [{ blockType: 'hero', heading: 'Documentation', subheading: 'Guides and release notes.' }, { blockType: 'postFeed', heading: 'Guides', source: 'guides', limit: 12, paginate: false }] })
  await mkPage('getting-started', 'Getting Started', { parent: docs.id, layout: [{ blockType: 'hero', heading: 'Getting started' }, { blockType: 'postFeed', source: 'guides', limit: 6, paginate: false }] })
  await mkPage('product-updates', 'Product Updates', { parent: docs.id, layout: [{ blockType: 'hero', heading: 'Product updates' }, { blockType: 'postFeed', source: 'updates', limit: 12, paginate: false }] })
  for (const p of sample.pages)
    await mkPage(p.slug, p.title, { content: lex(p.html), showFooterForm: false, meta: { description: `${p.title} for AI Vastra.` } })
  log(`pages: ${Object.keys(pageIds).length}`)

  // ───────────────────────── redirects (real, from EPS plugin) ─────────────────────────
  const seen = new Set<string>()
  for (const r of sample.redirects) {
    if (seen.has(r.from)) continue
    seen.add(r.from)
    await payload.create({ collection: 'redirects', data: { from: r.from, type: r.type, to: { type: 'custom', url: r.toSlug === 'home' ? '/' : `/${r.toSlug}/` } } as any, context: ctx })
  }

  // ───────────────────────── globals ─────────────────────────
  const ref = (slug: string, label: string) => ({ link: { type: 'reference', reference: { relationTo: 'pages', value: pageIds[slug] }, label } })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'AI Vastra',
      tagline: 'AI catalogue photography & virtual try-on for fashion.',
      titleTemplate: '%s | AI Vastra',
      defaultDescription: 'Studio-quality fashion catalogues and virtual try-on, powered by AI.',
      defaultOgImage: media[0].id,
      blockIndexing: false, // local testing; MUST be true on staging until launch
      legalName: 'AI Vastra',
      email: 'hello@aivastra.test',
      socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/company/aivastra' }],
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: [
        { ...ref('catalogue-showcase', 'Catalogues'), children: [{ ...ref('sarees', 'Sarees'), description: 'Saree catalogue AI' }, { ...ref('kurtis', 'Kurtis') }, { ...ref('lehengas', 'Lehengas') }] },
        ref('virtual-try-on', 'Virtual Try-On'),
        ref('pricing', 'Pricing'),
        { ...ref('blog', 'Resources'), children: [ref('blog', 'Blog'), ref('case-studies', 'Case studies'), ref('documentations', 'Documentation')] },
        ref('about-us', 'About'),
      ],
      headerButton: { type: 'reference', reference: { relationTo: 'pages', value: pageIds.contact }, label: 'Book a demo' },
      footerColumns: [
        { title: 'Product', links: [ref('catalogue-showcase', 'Catalogues'), ref('virtual-try-on', 'Virtual Try-On'), ref('pricing', 'Pricing')] },
        { title: 'Company', links: [ref('about-us', 'About'), ref('contact', 'Contact'), ref('case-studies', 'Case studies')] },
        { title: 'Resources', links: [ref('blog', 'Blog'), ref('documentations', 'Docs'), { link: { type: 'custom', url: '/feed/', label: 'RSS' } }] },
      ],
      legalLinks: [ref('privacy-policy', 'Privacy'), ref('terms', 'Terms')],
    } as any,
    context: ctx,
  })
  await payload.updateGlobal({
    slug: 'global-content',
    data: { footerTopLeftTitle: 'Ready to transform your catalogue?', footerTopLeftContent: 'Tell us about your range and we will show you what AI Vastra can do.', footerTopRightTitle: 'Get in touch', footerTopForm: contactForm.id } as any,
    context: ctx,
  })

  log('done ✔  admin → http://localhost:3100/admin  (admin@aivastra.test / Admin123!)')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
