import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { JsonLd } from '@/components/JsonLd'
import { DesignMotion } from '@/components/theme/DesignMotion'
import { Motion } from '@/ui/client/Motion'
import { AvFooter, AvHeader } from '@/ui/shell'
import { ThemeScripts } from '@/components/theme/ThemeScripts'
import { getSettings, getPluginSettings } from '@/lib/data'
import { crawlersBlocked, trackingAllowed } from '@/lib/env'
import { organizationSchema } from '@/lib/schema'
import { SITE_URL } from '@/lib/urls'
import './theme.css'
import './cms.css'
import './design.css'
import '@/ui/ui.css'
import '@/ui/dark.css'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.siteName, template: s.titleTemplate || '%s - AI Vastra' },
    description: s.defaultDescription || undefined,
    robots: crawlersBlocked(s) ? { index: false, follow: false } : undefined,
    alternates: { types: { 'application/rss+xml': `${SITE_URL}/feed/`, 'application/atom+xml': `${SITE_URL}/feed/atom/` } },
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const s = await getSettings()
  const ps: any = await getPluginSettings()
  return (
    <html lang={(s as any).siteLanguage || 'en'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <JsonLd data={organizationSchema(s)} />
        {s.facebookUrl && <meta property="article:publisher" content={s.facebookUrl} />}
      </head>
      <body suppressHydrationWarning>
        <DesignMotion />
        <Motion />
        <AvHeader />
        <main id="main">{children}</main>
        <AvFooter />
        {trackingAllowed && s.headScripts && <div hidden dangerouslySetInnerHTML={{ __html: s.headScripts }} />}
        {trackingAllowed && ps?.bodyOpenScripts && <div hidden dangerouslySetInnerHTML={{ __html: ps.bodyOpenScripts }} />}
        {trackingAllowed && ps?.headerScripts && <div hidden dangerouslySetInnerHTML={{ __html: ps.headerScripts }} />}
        {trackingAllowed && ps?.footerScripts && <div hidden dangerouslySetInnerHTML={{ __html: ps.footerScripts }} />}
        {trackingAllowed && s.bodyScripts && <div hidden dangerouslySetInnerHTML={{ __html: s.bodyScripts }} />}
        <ThemeScripts />
      </body>
    </html>
  )
}
