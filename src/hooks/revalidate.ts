import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getPath } from '@/lib/urls'

/**
 * On-demand ISR: publishing/unpublishing/editing in the admin refreshes the live
 * page, archives, sitemap and llms.txt immediately. No-ops outside a Next
 * request (seed scripts, migrations).
 */
const safe = (fn: () => void) => {
  try {
    fn()
  } catch {
    /* not inside a Next.js request (e.g. seed script) */
  }
}

const refresh = (collection: string, doc: any) => {
  safe(() => {
    revalidatePath(getPath(collection, doc))
    revalidatePath(getPath(collection, doc).replace(/\/$/, '') + '/')
    revalidateTag(collection, 'max')
    revalidateTag('sitemap', 'max')
    revalidatePath('/sitemap.xml')
    revalidatePath('/llms.txt')
    if (collection === 'posts' || collection === 'categories' || collection === 'tags') {
      revalidatePath('/blog')
      revalidatePath('/')
    }
  })
}

export const revalidateAfterChange =
  (collection: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    if (doc?._status === 'published' || previousDoc?._status === 'published' || !('_status' in doc)) {
      refresh(collection, doc)
      if (previousDoc?.slug && previousDoc.slug !== doc.slug) refresh(collection, previousDoc)
    }
    return doc
  }

export const revalidateAfterDelete =
  (collection: string): CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    if (!context?.disableRevalidate) refresh(collection, doc)
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (!context?.disableRevalidate) {
      safe(() => {
        revalidateTag(tag, 'max')
        revalidateTag('globals', 'max')
        revalidatePath('/', 'layout')
      })
    }
    return doc
  }
