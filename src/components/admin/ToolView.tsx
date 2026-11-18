import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import type { ReactNode } from 'react'

/** Shared shell for custom admin tool screens. */
export function ToolView({ props, children }: { props: AdminViewServerProps; children: ReactNode }) {
  const { initPageResult, params, searchParams } = props
  const { req } = initPageResult
  return (
    <DefaultTemplate i18n={req.i18n} locale={initPageResult.locale} params={params} payload={req.payload} permissions={initPageResult.permissions} searchParams={searchParams} user={req.user || undefined} visibleEntities={initPageResult.visibleEntities}>
      <Gutter><div className="wpd">{children}</div></Gutter>
    </DefaultTemplate>
  )
}
