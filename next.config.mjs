import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow opening the dev server from another PC on the LAN.
  allowedDevOrigins: ['192.168.0.198', '192.168.0.*'],
  images: {
    // Media served by Payload locally (/api/media/file/...) and later from R2.
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/**' }],
    remotePatterns: [{ protocol: 'https', hostname: '**.r2.dev' }],
  },
  // WordPress URLs end with `/`. We keep that for public pages in src/proxy.ts (not here,
  // because Next's global trailingSlash would also rewrite Payload's /api and /admin routes).
  skipTrailingSlashRedirect: true,
  // Rank Math sitemap URLs (served by src/app/(frontend)/api/av/sitemap/route.ts)
  async rewrites() {
    return [
      { source: '/sitemap_index.xml', destination: '/api/av/sitemap?file=index' },
      { source: '/sitemap.xml', destination: '/api/av/sitemap?file=index' },
      { source: '/:key([a-z_]+)-sitemap:n([0-9]*).xml', destination: '/api/av/sitemap?key=:key&n=:n' },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
