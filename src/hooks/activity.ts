import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Config, GlobalAfterChangeHook, PayloadRequest } from 'payload'

const SKIP = new Set(['activity-log', 'indexing-log', 'rank-snapshots', 'not-found-log', 'payload-jobs', 'payload-kv', 'payload-locked-documents', 'payload-preferences', 'payload-migrations', 'form-submissions'])
let lastPrune = 0

async function write(req: PayloadRequest, data: Record<string, any>) {
  const user: any = req.user
  if (!user || req.context?.skipActivity) return // only actions taken by a signed-in person
  try {
    await req.payload.create({
      collection: 'activity-log', overrideAccess: true, req, context: { skipActivity: true },
      data: { ...data, user: user.collection === 'users' ? user.id : undefined, userEmail: user.email, ip: (req.headers?.get?.('x-forwarded-for') || '').split(',')[0].trim() || undefined },
    })
    if (Date.now() - lastPrune > 6 * 3600_000) {
      lastPrune = Date.now()
      void req.payload.delete({ collection: 'activity-log', where: { createdAt: { less_than: new Date(Date.now() - 180 * 86400_000).toISOString() } }, overrideAccess: true }).catch(() => {})
    }
  } catch { /* audit logging never blocks a save */ }
}

const title = (doc: any) => doc?.title || doc?.name || doc?.filename || doc?.email || doc?.from || (doc?.id != null ? `#${doc.id}` : '')

const afterChange = (slug: string, label: string): CollectionAfterChangeHook => async ({ doc, previousDoc, operation, req }) => {
  let action = operation === 'create' ? 'create' : 'update'
  if (doc?.deletedAt && !previousDoc?.deletedAt) action = 'trash'
  else if (!doc?.deletedAt && previousDoc?.deletedAt) action = 'restore'
  else if (doc?._status === 'published' && previousDoc?._status !== 'published') action = 'publish'
  else if (doc?._status === 'draft' && previousDoc?._status === 'published') action = 'unpublish'
  // autosaves of drafts are noise
  if (action === 'update' && doc?._status === 'draft' && req.query?.autosave === 'true') return doc
  await write(req, { action, target: slug, targetId: String(doc?.id ?? ''), summary: `${action[0].toUpperCase()}${action.slice(1)} ${label} “${title(doc)}”` })
  return doc
}
const afterDelete = (slug: string, label: string): CollectionAfterDeleteHook => async ({ doc, req }) => {
  await write(req, { action: 'delete', target: slug, targetId: String(doc?.id ?? ''), summary: `Deleted ${label} “${title(doc)}”` })
  return doc
}
const globalChange = (slug: string, label: string): GlobalAfterChangeHook => async ({ doc, req }) => {
  await write(req, { action: 'settings', target: slug, summary: `Changed ${label}` })
  return doc
}

/** Adds audit hooks to every collection and global. */
export const activityPlugin = (config: Config): Config => ({
  ...config,
  collections: (config.collections ?? []).map((c) => {
    if (SKIP.has(c.slug)) return c
    const label = String((c.labels?.singular as string) || c.slug).toLowerCase()
    const extra: any = c.slug === 'users' ? { afterLogin: [async ({ req, user }: any) => { await write({ ...req, user } as any, { action: 'login', target: 'users', targetId: String(user?.id), summary: `Logged in` }) }] } : {}
    return { ...c, hooks: { ...c.hooks, ...Object.fromEntries(Object.entries(extra).map(([k, v]: any) => [k, [...((c.hooks as any)?.[k] ?? []), ...v]])), afterChange: [...(c.hooks?.afterChange ?? []), afterChange(c.slug, label)], afterDelete: [...(c.hooks?.afterDelete ?? []), afterDelete(c.slug, label)] } }
  }),
  globals: (config.globals ?? []).map((g) => ({ ...g, hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), globalChange(g.slug, String((g.label as string) || g.slug))] } })),
})
