import type { Plugin } from 'payload'

/**
 * Media storage. `STORAGE_DRIVER=local` (default) keeps files in ./media.
 * For Cloudflare R2 later: `pnpm add @payloadcms/storage-s3`, then return
 *   s3Storage({ collections: { media: true }, bucket, config: { region: 'auto',
 *   endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials } })
 * and remove `staticDir` from the Media collection.
 */
export function storagePlugins(): Plugin[] {
  const driver = process.env.STORAGE_DRIVER || 'local'
  if (driver === 'local') return []
  throw new Error(`STORAGE_DRIVER="${driver}" is not wired yet — see src/storage.ts`)
}
