/**
 * Load the WordPress Media Library (seed/wp-full.json → attachments) into the `media`
 * collection. No files are copied: each record points at the live
 * https://aivastra.com/wp-content/uploads/… URL until R2 storage exists.
 *
 *   pnpm import:media      (idempotent: skips files already imported)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '@payload-config'
import { getPayload } from 'payload'

const here = path.dirname(fileURLToPath(import.meta.url))
const WP = JSON.parse(fs.readFileSync(path.join(here, '../seed/wp-full.json'), 'utf8'))
const ORIGIN = 'https://aivastra.com'
const MIME: Record<string, string> = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.mp4': 'video/mp4' }

const payload = await getPayload({ config })
const have = new Set((await payload.find({ collection: 'media', limit: 10000, depth: 0, pagination: false, select: { filename: true } })).docs.map((d: any) => d.filename))
let n = 0
for (const [id, a] of Object.entries<any>(WP.attachments)) {
  if (!a.file) continue
  const filename = path.basename(a.file)
  if (have.has(filename)) continue
  have.add(filename)
  const alt = (a.alt || '').trim() || filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
  await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { alt, filename, mimeType: MIME[path.extname(filename).toLowerCase()] || 'application/octet-stream', externalUrl: `${ORIGIN}/wp-content/uploads/${a.file}` } as any,
    context: { disableRevalidate: true },
  })
  n++
}
payload.logger.info(`[import-media] added ${n} records (${have.size} total)`)
process.exit(0)
