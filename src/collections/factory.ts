import type { CollectionConfig, Field } from 'payload'
import { canEditContent, publishedOrStaff } from '@/access'
import { slugField } from '@/fields/slug'
import { publishedAtField } from '@/fields/publishedAt'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { slugChangeRedirect } from '@/hooks/slugRedirect'
import { getPath, SITE_URL } from '@/lib/urls'

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
    access: {
      read: publishedOrStaff,
      create: canEditContent,
      update: canEditContent,
      delete: canEditContent,
    },
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
        ...(hooks?.beforeChange ?? []),
      ],
      afterChange: [
        slugChangeRedirect(slug),
        revalidateAfterChange(slug),
        ...(hooks?.afterChange ?? []),
      ],
      afterDelete: [revalidateAfterDelete(slug), ...(hooks?.afterDelete ?? [])],
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
    ],
    ...extra,
  }
}
