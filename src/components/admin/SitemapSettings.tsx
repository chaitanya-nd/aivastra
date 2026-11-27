import type { AdminViewServerProps } from 'payload'
import { userCan } from '@/access'
import { crawlersBlocked } from '@/lib/env'
import { sitemapReport } from '@/lib/sitemap'
import { SITE_URL } from '@/lib/urls'
import { ToolView } from './ToolView'
import { SitemapSettingsForm } from './SitemapSettingsForm'

/** Rank Math → Sitemap Settings: sitemap index status, every sitemap file, and all sitemap options in one place. */
export async function SitemapSettings(props: AdminViewServerProps) {
  const { payload, user } = props.initPageResult.req
  const [ps, settings]: any[] = await Promise.all([
    payload.findGlobal({ slug: 'plugin-settings' as any, depth: 0, overrideAccess: true }),
    payload.findGlobal({ slug: 'site-settings' as any, depth: 0, overrideAccess: true }),
  ])
  const report = await sitemapReport(settings, ps)
  const authors = await payload.count({ collection: 'users', where: { slug: { exists: true } }, overrideAccess: true })
  const canEdit = (await userCan(payload, user, 'manage_options')) && (await userCan(payload, user, 'edit_theme_options'))
  return (
    <ToolView props={props}>
      <SitemapSettingsForm
        siteUrl={SITE_URL}
        blocked={crawlersBlocked(settings)}
        canEdit={canEdit}
        plugin={{
          sitemapEnabled: ps?.sitemapEnabled !== false,
          sitemapMaxLinks: Number(ps?.sitemapMaxLinks) || 200,
          sitemapImages: ps?.sitemapImages !== false,
          sitemapExcludePosts: ps?.sitemapExcludePosts || '',
          sitemapExcludeTerms: ps?.sitemapExcludeTerms || '',
          sitemapAuthors: ps?.sitemapAuthors === true,
          sitemapSectionTerms: ps?.sitemapSectionTerms === true,
          authorArchives: ps?.authorArchives !== false,
          newsSitemap: Boolean(ps?.newsSitemap),
          newsPublicationName: ps?.newsPublicationName || 'AI Vastra',
          videoSitemap: Boolean(ps?.videoSitemap),
        }}
        typeIncluded={Object.fromEntries(['posts', 'pages', 'guides', 'cases', 'updates', 'reviews', 'categories', 'tags'].map((k) => [k, settings?.[k]?.inSitemap !== false]))}
        typeNoindex={Object.fromEntries(['posts', 'pages', 'guides', 'cases', 'updates', 'reviews', 'categories', 'tags'].map((k) => [k, (settings?.[k]?.robots ?? []).includes('noindex')]))}
        report={report}
        authorCount={authors.totalDocs}
      />
    </ToolView>
  )
}
