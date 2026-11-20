import { NextResponse } from 'next/server'
import { userCan } from '@/access/caps'
import { brokenReport, runBrokenLinkScan } from '@/lib/brokenLinks'
import { getClient } from '@/lib/data'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** Start a broken-link scan (SEO tools permission). The scan runs in the background; the report page polls GET. */
export async function POST(req: Request) {
  const payload = await getClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!(await userCan(payload, user, 'manage_seo_tools'))) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  void runBrokenLinkScan(payload, new URL(req.url).origin)
  return NextResponse.json({ started: true })
}
export async function GET(req: Request) {
  const payload = await getClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!(await userCan(payload, user, 'manage_seo_tools'))) return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  return NextResponse.json(brokenReport())
}
