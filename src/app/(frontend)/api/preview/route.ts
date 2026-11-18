import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getClient } from '@/lib/data'

/** Enables Next.js draft mode for logged-in CMS users, then redirects to the page. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') || '/'
  if (!path.startsWith('/')) return new Response('Bad path', { status: 400 })
  const payload = await getClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('You are not allowed to preview drafts.', { status: 403 })
  ;(await draftMode()).enable()
  redirect(path)
}
