import { createHash } from 'node:crypto'
import type { CollectionAfterChangeHook } from 'payload'
import { outboundAllowed } from '@/lib/env'
import { parseAdditional } from './formSettings'

/**
 * Form submissions → Mailchimp audience (replaces the old Mailchimp plugin).
 * Only runs for forms with "Subscribe to Mailchimp" ticked AND when MAILCHIMP_API_KEY / MAILCHIMP_LIST_ID
 * are set. Never blocks or fails the submission.
 */
export const syncToMailchimp: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' || !outboundAllowed) return doc // never subscribe real people from a test deploy
  const key = process.env.MAILCHIMP_API_KEY
  const ps: any = await req.payload.findGlobal({ slug: 'plugin-settings', depth: 0, req }).catch(() => ({}))
  const list = ps?.mcAudienceId || process.env.MAILCHIMP_LIST_ID
  if (!key || !list) return doc
  try {
    const formId = typeof doc.form === 'object' ? doc.form?.id : doc.form
    const form = await req.payload.findByID({ collection: 'forms', id: formId, depth: 0, req })
    if (!(form as any)?.mailchimpSync) return doc
    if (['on', 'true'].includes(parseAdditional((form as any).additionalSettings).demo_mode)) return doc
    const data = Object.fromEntries(((doc.submissionData ?? []) as { field: string; value: string }[]).map((f) => [f.field, f.value]))
    const email = String(data.email ?? '').trim().toLowerCase()
    if (!email) return doc
    const dc = key.split('-')[1] // API keys look like "xxxxxxxx-us21"
    const [fname, ...rest] = String(data.name ?? '').trim().split(/\s+/)
    const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${list}/members/${createHash('md5').update(email).digest('hex')}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`anystring:${key}`).toString('base64')}` },
      body: JSON.stringify({ email_address: email, status_if_new: ps?.mcDoubleOptIn ? 'pending' : 'subscribed', tags: String(ps?.mcTags || '').split(',').map((t: string) => t.trim()).filter(Boolean), merge_fields: fname ? { FNAME: fname, LNAME: rest.join(' ') } : undefined }),
    })
    if (!res.ok) req.payload.logger.warn(`Mailchimp sync failed (${res.status}): ${(await res.text()).slice(0, 200)}`)
  } catch (err) {
    req.payload.logger.error({ err }, 'Mailchimp sync error')
  }
  return doc
}
