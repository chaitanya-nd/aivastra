import { commentSettings, commentsOpen, listComments } from '@/lib/comments'
import { getSettings } from '@/lib/data'
import { getPath } from '@/lib/urls'
import { CommentsClient } from './CommentsClient'

/** WordPress comments_template(): the list + form for one document. Renders nothing when comments are off and there are none. */
export async function Comments({ doc, collection }: { doc: any; collection: string }) {
  const s = await commentSettings()
  const open = commentsOpen(doc, s)
  const first = await listComments(collection, doc.id, 1)
  const ss: any = await getSettings()
  const pp = ss?.privacyPolicyPage && typeof ss.privacyPolicyPage === 'object' ? `${getPath('pages', ss.privacyPolicyPage).replace(/\/$/, '')}/` : null
  if (!open && first.comments.length === 0) return null
  return <CommentsClient collection={collection} id={doc.id} open={open} initial={first} settings={{ threaded: s.threaded, depth: s.depth, requireNameEmail: s.requireNameEmail, loggedInOnly: s.loggedInOnly, order: s.order, privacyUrl: pp }} />
}
