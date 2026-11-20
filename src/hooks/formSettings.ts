import { outboundAllowed } from '@/lib/env'
import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook } from 'payload'

/** Contact Form 7 "Additional settings": one `name: value` per line. */
export const parseAdditional = (s?: string | null): Record<string, string> =>
  Object.fromEntries(
    String(s ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const i = l.indexOf(':')
        return i < 0 ? [l, 'on'] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      }),
  )
const on = (v?: string) => ['on', 'true', '1', 'yes'].includes(String(v ?? '').toLowerCase())

async function loadForm(req: any, id: any) {
  const formId = typeof id === 'object' ? id?.id : id
  if (!formId) return null
  return (await req.payload.findByID({ collection: 'forms', id: formId, depth: 0, req }).catch(() => null)) as any
}
export const formFlags = async (req: any, id: any) => {
  const form = await loadForm(req, id)
  const a = parseAdditional(form?.additionalSettings)
  return { form, demo: on(a.demo_mode), skipMail: on(a.skip_mail), subscribersOnly: on(a.subscribers_only), store: form?.storeSubmissions !== false }
}

/** subscribers_only: only logged-in users may submit. */
export const guardSubmission: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const f = await formFlags(req, data?.form)
  if (f.subscribersOnly && !req.user) throw new APIError('You must be logged in to send this form.', 403)
  return data
}

/** demo_mode / "Keep submissions" off → do not keep the stored submission. */
export const dropIfNotStored: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const f = await formFlags(req, doc.form)
  if (f.demo || !f.store) await req.payload.delete({ collection: 'form-submissions', id: doc.id, overrideAccess: true, req }).catch(() => {})
  return doc
}

/** formBuilderPlugin beforeEmail: skip_mail / demo_mode send nothing. */
export const beforeEmail = async (emails: any[], params: any) => {
  const f = await formFlags(params.req, params.data?.form)
  if (f.skipMail || f.demo) return []
  // Test/staging deploys must never email real recipients: drop mail, or redirect it to TEST_MAIL_TO.
  if (!outboundAllowed) return process.env.TEST_MAIL_TO ? emails.map((e) => ({ ...e, to: process.env.TEST_MAIL_TO })) : []
  return emails
}
