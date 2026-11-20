/** Rank Math-style content analysis. Pure functions, shared by the live editor panel. */
export type Test = { id: string; group: 'Basic SEO' | 'Additional' | 'Title readability' | 'Content readability'; ok: boolean; weight: number; text: string }
export type Input = {
  keyword: string
  seoTitle: string
  description: string
  slug: string
  url: string
  html: string
  showToc: boolean
  siteHost: string
}

export const stripHtml = (h: string) => h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim()
const has = (hay: string, kw: string) => Boolean(kw) && ` ${norm(hay)} `.includes(` ${norm(kw)} `)
const slugHas = (slug: string, kw: string) => Boolean(kw) && slug.toLowerCase().includes(norm(kw).replace(/\s+/g, '-'))
const count = (hay: string, kw: string) => (kw ? (` ${norm(hay)} `.split(` ${norm(kw)} `).length - 1) : 0)

export function links(html: string, siteHost: string) {
  let internal = 0, external = 0
  for (const m of html.matchAll(/<a\b[^>]*\bhref=["']([^"'#][^"']*)["']/gi)) {
    const href = m[1].trim()
    if (/^(mailto|tel|javascript):/i.test(href)) continue
    if (href.startsWith('/') || !/^https?:/i.test(href)) { internal++; continue }
    try {
      const h = new URL(href).host.replace(/^www\./, '')
      if (h === siteHost.replace(/^www\./, '') || h === 'aivastra.com') internal++
      else external++
    } catch { external++ }
  }
  return { internal, external }
}

const syllables = (w: string) => {
  const x = w.toLowerCase().replace(/[^a-z]/g, '')
  if (!x) return 0
  if (x.length <= 3) return 1
  return Math.max(1, (x.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g) || []).length)
}
/** Flesch reading ease, long-sentence share and passive-voice share (Yoast/Rank Math readability). */
export function readability(text: string) {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9“"'])/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length > 2)
  const words = text.split(/\s+/).filter((w) => /[a-z]/i.test(w))
  if (!sentences.length || !words.length) return { flesch: 0, longShare: 0, passiveShare: 0, sentences: 0 }
  const syl = words.reduce((a, w) => a + syllables(w), 0)
  const flesch = Math.round(206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syl / words.length))
  const longShare = Math.round((sentences.filter((x) => x.split(/\s+/).length > 20).length / sentences.length) * 100)
  const passive = /\b(am|is|are|was|were|be|been|being)\s+(\w+ly\s+)?\w+(ed|en)\b/i
  const passiveShare = Math.round((sentences.filter((x) => passive.test(x)).length / sentences.length) * 100)
  return { flesch: Math.max(0, Math.min(100, flesch)), longShare, passiveShare, sentences: sentences.length }
}

export function analyze(i: Input): { tests: Test[]; score: number; words: number; density: number; flesch: number } {
  const kw = i.keyword.trim()
  const text = stripHtml(i.html)
  const words = text ? text.split(/\s+/).length : 0
  const first = text.split(/\s+/).slice(0, Math.max(30, Math.round(words * 0.1))).join(' ')
  const heads = [...i.html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi)].map((m) => stripHtml(m[1]))
  const alts = [...i.html.matchAll(/<img\b[^>]*\balt=["']([^"']*)["']/gi)].map((m) => m[1])
  const imgs = (i.html.match(/<img\b/gi) || []).length + (i.html.match(/<(iframe|video)\b/gi) || []).length
  const paras = [...i.html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripHtml(m[1]).split(/\s+/).filter(Boolean).length)
  const kwCount = count(text, kw)
  const kwWords = kw ? kw.split(/\s+/).length : 1
  const density = words ? +((kwCount * kwWords * 100) / words).toFixed(2) : 0
  const l = links(i.html, i.siteHost)
  const titlePos = kw ? norm(i.seoTitle).indexOf(norm(kw)) : -1
  const rd = readability(text)
  const t: Test[] = [
    { id: 'kw-title', group: 'Basic SEO', weight: 10, ok: has(i.seoTitle, kw), text: has(i.seoTitle, kw) ? 'Focus keyword is in the SEO title.' : 'Add the focus keyword to the SEO title.' },
    { id: 'kw-desc', group: 'Basic SEO', weight: 8, ok: has(i.description, kw), text: has(i.description, kw) ? 'Focus keyword is in the meta description.' : 'Add the focus keyword to the meta description.' },
    { id: 'kw-url', group: 'Basic SEO', weight: 7, ok: slugHas(i.slug, kw), text: slugHas(i.slug, kw) ? 'Focus keyword is in the URL.' : 'Use the focus keyword in the URL slug.' },
    { id: 'kw-start', group: 'Basic SEO', weight: 7, ok: has(first, kw), text: has(first, kw) ? 'Focus keyword appears at the beginning of the content.' : 'Use the focus keyword in the first 10% of the content.' },
    { id: 'kw-content', group: 'Basic SEO', weight: 8, ok: kwCount > 0, text: kwCount > 0 ? `Focus keyword found ${kwCount} time${kwCount === 1 ? '' : 's'} in the content.` : 'Focus keyword does not appear in the content.' },
    { id: 'length', group: 'Basic SEO', weight: 10, ok: words >= 600, text: words >= 600 ? `Content is ${words} words long. Good.` : `Content is ${words} words. Aim for at least 600.` },
    { id: 'kw-heading', group: 'Additional', weight: 5, ok: heads.some((h) => has(h, kw)), text: heads.some((h) => has(h, kw)) ? 'Focus keyword is in a subheading.' : 'Use the focus keyword in at least one H2–H4.' },
    { id: 'kw-alt', group: 'Additional', weight: 4, ok: alts.some((a) => has(a, kw)), text: alts.some((a) => has(a, kw)) ? 'An image alt text contains the focus keyword.' : 'Add the focus keyword to an image alt text.' },
    { id: 'density', group: 'Additional', weight: 6, ok: density >= 0.5 && density <= 2.5, text: `Keyword density is ${density}%${density < 0.5 ? ' — too low, aim for 0.5–2.5%.' : density > 2.5 ? ' — too high, risk of keyword stuffing.' : '.'}` },
    { id: 'url-len', group: 'Additional', weight: 3, ok: i.url.length <= 75, text: i.url.length <= 75 ? `URL is ${i.url.length} characters.` : `URL is ${i.url.length} characters — keep it under 75.` },
    { id: 'ext-links', group: 'Additional', weight: 4, ok: l.external > 0, text: l.external ? `${l.external} external link${l.external === 1 ? '' : 's'}.` : 'Link out to at least one external resource.' },
    { id: 'int-links', group: 'Additional', weight: 6, ok: l.internal > 0, text: l.internal ? `${l.internal} internal link${l.internal === 1 ? '' : 's'}.` : 'Add internal links to related content.' },
    { id: 'title-start', group: 'Title readability', weight: 4, ok: titlePos >= 0 && titlePos <= norm(i.seoTitle).length / 2, text: titlePos >= 0 && titlePos <= norm(i.seoTitle).length / 2 ? 'Focus keyword is near the beginning of the title.' : 'Move the focus keyword towards the start of the title.' },
    { id: 'title-num', group: 'Title readability', weight: 2, ok: /\d/.test(i.seoTitle), text: /\d/.test(i.seoTitle) ? 'Title contains a number.' : 'Titles with a number tend to get more clicks.' },
    { id: 'title-len', group: 'Title readability', weight: 4, ok: i.seoTitle.length >= 30 && i.seoTitle.length <= 60, text: `SEO title is ${i.seoTitle.length} characters${i.seoTitle.length > 60 ? ' — Google may cut it (aim for 30–60).' : i.seoTitle.length < 30 ? ' — a bit short (aim for 30–60).' : '.'}` },
    { id: 'desc-len', group: 'Title readability', weight: 4, ok: i.description.length >= 120 && i.description.length <= 160, text: `Meta description is ${i.description.length} characters${i.description.length === 0 ? ' — write one.' : i.description.length > 160 ? ' — may be cut (aim for 120–160).' : i.description.length < 120 ? ' — a bit short (aim for 120–160).' : '.'}` },
    { id: 'toc', group: 'Content readability', weight: 2, ok: i.showToc && heads.length >= 2, text: i.showToc && heads.length >= 2 ? 'Table of contents is shown.' : 'Use subheadings and a table of contents for long content.' },
    { id: 'paras', group: 'Content readability', weight: 3, ok: paras.length > 0 && paras.every((n) => n <= 120), text: paras.some((n) => n > 120) ? 'Some paragraphs are longer than 120 words — break them up.' : 'Paragraphs are a readable length.' },
    { id: 'flesch', group: 'Content readability', weight: 3, ok: rd.flesch >= 50, text: `Flesch reading ease is ${rd.flesch}${rd.flesch >= 60 ? ' — easy to read.' : rd.flesch >= 50 ? ' — fairly readable.' : ' — hard to read; use shorter sentences and simpler words.'}` },
    { id: 'sentences', group: 'Content readability', weight: 2, ok: rd.longShare <= 25, text: `${rd.longShare}% of sentences are longer than 20 words${rd.longShare > 25 ? ' — aim for 25% or less.' : '.'}` },
    { id: 'passive', group: 'Content readability', weight: 2, ok: rd.passiveShare <= 10, text: `${rd.passiveShare}% of sentences use the passive voice${rd.passiveShare > 10 ? ' — aim for 10% or less.' : '.'}` },
    { id: 'media', group: 'Content readability', weight: 3, ok: imgs > 0, text: imgs ? `Content has ${imgs} image${imgs === 1 ? '' : 's'} / video${imgs === 1 ? '' : 's'}.` : 'Add images or video to the content.' },
  ]
  const tests = kw ? t : t.filter((x) => !x.id.startsWith('kw') && x.id !== 'density' && x.id !== 'title-start')
  const total = tests.reduce((a, x) => a + x.weight, 0)
  const score = kw ? Math.round((tests.filter((x) => x.ok).reduce((a, x) => a + x.weight, 0) / total) * 100) : 0
  return { tests, score, words, density, flesch: rd.flesch }
}

export const keywordCount = (html: string, kw: string) => count(stripHtml(html), kw)
