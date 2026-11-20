import type { CollectionConfig, Field } from 'payload'
import { contentAccess, notifyReview, workflowBeforeChange, workflowFields } from '@/access/content'
import { slugField } from '@/fields/slug'
import { publishedAtField } from '@/fields/publishedAt'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { slugChangeRedirect } from '@/hooks/slugRedirect'
import { getPath, SITE_URL } from '@/lib/urls'
import { bustLinkIndex, countLinks, incomingMap, pathById } from '@/lib/linkIndex'
import { notifyOnPublish } from '@/hooks/publishNotify'
import { storeSeoScore } from '@/hooks/seoScore'
import { pingIndexNow } from '@/hooks/indexNow'

/**
 * Shared shape of every public content type: drafts + autosave + scheduled
 * publish, version history, live preview, slug-redirects, on-demand ISR.
 */
export function contentCollection(opts: {
  slug: string
  labels: { singular: string; plural: string }
  defaultColumns?: string[]
  fields: Field[]
  hooks?: CollectionConfig['hooks']
  extra?: Partial<CollectionConfig>
}): CollectionConfig {
  const { slug, labels, fields, hooks, extra } = opts
  return {
    slug,
    labels,
    admin: {
      useAsTitle: 'title',
      group: 'Content',
      components: { beforeListTable: ['/components/admin/wp/ListTop#ListTop'] },
      defaultColumns: opts.defaultColumns ?? ['title', 'slug', '_status', 'updatedAt'],
      livePreview: {
        url: ({ data }) => `${SITE_URL}/api/preview?path=${encodeURIComponent(getPath(slug, data as any))}`,
      },
      preview: (doc) => `${SITE_URL}/api/preview?path=${encodeURIComponent(getPath(slug, doc as any))}`,
    },
    access: contentAccess(slug),
    trash: true,
    versions: {
      maxPerDoc: 25,
      drafts: { autosave: { interval: 1500 }, schedulePublish: true },
    },
    defaultPopulate: { title: true, slug: true } as any,
    hooks: {
      ...hooks,
      beforeChange: [
        ({ data, operation, context }) => {
          if (operation === 'update' && !context?.keepModified) data.modifiedAt = new Date().toISOString()
          return data
        },
        workflowBeforeChange(slug),
        storeSeoScore(slug),
        ...(hooks?.beforeChange ?? []),
      ],
      afterChange: [
        slugChangeRedirect(slug),
        revalidateAfterChange(slug),
        ({ doc }) => { bustLinkIndex(); return doc },
        notifyOnPublish(slug),
        pingIndexNow(slug),
        notifyReview(slug),
        ...(hooks?.afterChange ?? []),
      ],
      afterDelete: [revalidateAfterDelete(slug), () => bustLinkIndex(), ...(hooks?.afterDelete ?? [])],
    },
    fields: [
      { type: 'ui', name: 'publishBox', admin: { position: 'sidebar', components: { Field: '/components/admin/wp/PublishBox#PublishBox' } } },
      { type: 'ui', name: 'editTop', admin: { components: { Field: '/components/admin/wp/EditTop#EditTop' } } },
      { name: 'title', type: 'text', required: true, admin: { placeholder: 'Add title', components: { Cell: '/components/admin/wp/TitleCell#TitleCell' } } },
      slugField('title', true, slug),
      ...fields,
      publishedAtField,
      {
        name: 'modifiedAt',
        type: 'date',
        admin: { position: 'sidebar', readOnly: true, components: { Field: '/components/admin/wp/Hidden#Hidden' } },
      },
      ...linkStatFields(slug),
      ...workflowFields(slug),
      { name: 'seoScore', type: 'number', label: 'SEO score', index: true, admin: { readOnly: true, position: 'sidebar', components: { Field: '/components/admin/wp/Hidden#Hidden', Cell: '/components/admin/wp/SeoScoreCell#SeoScoreCell' } } },
    ],
    ...extra,
  }
}

/** Rank Math "Link counter": internal / external links in the body and incoming links from other content (computed, not stored). */
function linkStatFields(slug: string): Field[] {
  const out = (k: 'internal' | 'external'): Field => ({
    name: `${k}Links`, type: 'number', virtual: true, label: k === 'internal' ? 'Internal links' : 'External links',
    admin: { readOnly: true, position: 'sidebar', disableListColumn: true, disableListFilter: true, components: { Field: '/components/admin/wp/Hidden#Hidden' } },
    hooks: { afterRead: [({ data }) => countLinks(String(data?.contentHtml || ''))[k]] },
  })
  return [
    // One sortless "Links" column (Rank Math link counter): internal · external · incoming
    { name: 'links', type: 'ui', label: 'Links', admin: { components: { Field: '/components/admin/wp/Hidden#Hidden', Cell: '/components/admin/wp/LinksCell#LinksCell' } } },
    out('internal'),
    out('external'),
    {
      name: 'incomingLinks', type: 'number', virtual: true, label: 'Incoming links',
      admin: { readOnly: true, position: 'sidebar', disableListColumn: true, disableListFilter: true, components: { Field: '/components/admin/wp/Hidden#Hidden' } },
      hooks: { afterRead: [async ({ data, req }) => {
        const map = await incomingMap(req.payload)
        const path = data?.slug ? `${getPath(slug, data as any).replace(/\/+$/, '')}/`.toLowerCase() : pathById.get(`${slug}:${data?.id}`)
        return path ? (map.get(path) ?? 0) : 0
      }] },
    },
  ]
}
