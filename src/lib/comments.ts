import { getClient, getPluginSettings } from '@/lib/data'

export type Settings = {
  enabled: boolean; requireNameEmail: boolean; loggedInOnly: boolean; closeDays: number; threaded: boolean; depth: number
  perPage: number; order: 'asc' | 'desc'; hold: boolean; knownAuto: boolean; maxLinks: number; modWords: string[]; blockWords: string[]
  notify: boolean; notifyEmail: string
}
const list = (s?: string | null) => String(s ?? '').split('\n').map((x) => x.trim().toLowerCase()).filter(Boolean)

export async function commentSettings(): Promise<Settings> {
  const p: any = await getPluginSettings()
  return {
    enabled: p?.commentsEnabled === true,
    requireNameEmail: p?.commentsRequireNameEmail !== false,
    loggedInOnly: p?.commentsLoggedInOnly === true,
    closeDays: p?.commentsClose ? Number(p?.commentsCloseDays) || 0 : 0,
    threaded: p?.commentsThreaded !== false,
    depth: Math.min(10, Math.max(1, Number(p?.commentsDepth) || 3)),
    perPage: Number(p?.commentsPerPage ?? 20) || 0,
    order: p?.commentsOrder === 'desc' ? 'desc' : 'asc',
    hold: p?.commentsHold === true,
    knownAuto: p?.commentsKnownAuto !== false,
    maxLinks: Number(p?.commentsMaxLinks ?? 2),
    modWords: list(p?.commentsModWords),
    blockWords: list(p?.commentsBlockWords),
    notify: p?.commentsNotify !== false,
    notifyEmail: p?.commentsNotifyEmail || '',
  }
}

/** Are comments open for this document? (per-doc override → site default → close-after-N-days) */
export function commentsOpen(doc: any, s: Settings): boolean {
  const mode = doc?.commentsMode || 'default'
  if (mode === 'closed') return false
  if (mode === 'default' && !s.enabled) return false
  if (s.closeDays > 0 && doc?.publishedAt && Date.now() - new Date(doc.publishedAt).getTime() > s.closeDays * 86_400_000) return false
  return true
}

/** WordPress moderation: blocklist → spam; holds → pending; known commenter → approved. */
export async function moderate(input: { content: string; email?: string; name?: string; url?: string; ip?: string }, s: Settings): Promise<'approved' | 'pending' | 'spam'> {
  const hay = `${input.content} ${input.name ?? ''} ${input.email ?? ''} ${input.url ?? ''} ${input.ip ?? ''}`.toLowerCase()
  if (s.blockWords.some((w) => hay.includes(w))) return 'spam'
  const links = (input.content.match(/https?:\/\/|www\./gi) || []).length
  if (s.maxLinks > 0 && links >= s.maxLinks) return 'pending'
  if (s.modWords.some((w) => hay.includes(w))) return 'pending'
  if (s.hold) return 'pending'
  if (s.knownAuto) {
    if (!input.email) return 'pending'
    const payload = await getClient()
    const prev = await payload.count({ collection: 'comments' as any, where: { and: [{ authorEmail: { equals: input.email } }, { status: { equals: 'approved' } }] }, overrideAccess: true })
    return prev.totalDocs > 0 ? 'approved' : 'pending'
  }
  return 'approved'
}

export type PublicComment = { id: number; name: string; url: string | null; content: string; date: string; parent: number | null }
/** Approved comments for a document: one page of top-level comments plus all replies. */
export async function listComments(coll: string, id: string | number, page = 1): Promise<{ page: number; totalPages: number; comments: PublicComment[] }> {
  const payload = await getClient()
  const s = await commentSettings()
  const base: any[] = [{ 'post.value': { equals: id } }, { 'post.relationTo': { equals: coll } }, { status: { equals: 'approved' } }]
  const top = await payload.find({ collection: 'comments' as any, where: { and: [...base, ...(s.threaded ? [{ parent: { exists: false } }] : [])] }, sort: s.order === 'desc' ? '-createdAt' : 'createdAt', limit: s.perPage || 500, page, depth: 0, overrideAccess: true })
  const replies = s.threaded && top.docs.length ? (await payload.find({ collection: 'comments' as any, where: { and: [...base, { parent: { exists: true } }] }, sort: 'createdAt', limit: 1000, pagination: false, depth: 0, overrideAccess: true })).docs : []
  const pick = (d: any): PublicComment => ({ id: d.id, name: d.authorName || 'Anonymous', url: d.authorUrl || null, content: d.content, date: d.createdAt, parent: typeof d.parent === 'object' ? d.parent?.id ?? null : d.parent ?? null })
  return { page, totalPages: top.totalPages, comments: [...top.docs, ...replies].map(pick) }
}
