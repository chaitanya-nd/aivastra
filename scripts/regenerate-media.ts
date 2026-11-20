/**
 * Regenerate Thumbnails: re-process every locally stored image so new / changed image sizes are created.
 *   pnpm media:regenerate            all images
 *   pnpm media:regenerate 120 121    only these ids
 * Remote items (externalUrl, imported from the old site) are skipped — they have no local file yet.
 */
import fs from 'node:fs'
import path from 'node:path'
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const ids = process.argv.slice(2)
const res = await payload.find({ collection: 'media', where: ids.length ? { id: { in: ids } } : { mimeType: { like: 'image/' } }, pagination: false, limit: 100000, depth: 0, overrideAccess: true })
let done = 0, skipped = 0
for (const m of res.docs as any[]) {
  const file = m.filename ? path.resolve('media', m.filename) : ''
  if (m.externalUrl || !file || !fs.existsSync(file)) { skipped++; continue }
  await payload.update({ collection: 'media', id: m.id, filePath: file, overwriteExistingFiles: true, data: {}, overrideAccess: true, context: { disableRevalidate: true } })
  done++
  if (done % 25 === 0) console.log(`${done} regenerated…`)
}
console.log(`Regenerated ${done}, skipped ${skipped} (remote or missing file).`)
process.exit(0)
