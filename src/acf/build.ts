import type { Field } from 'payload'
import defs from './definitions.json'

/**
 * Admin fields generated from the original ACF field groups (src/acf/definitions.json,
 * produced by scripts/gen-acf.py). Editors get the same fields as in WordPress, shown
 * only for the page template they belong to — like ACF "location rules".
 * Image fields are URL text fields until media storage exists.
 */
type Def = {
  name: string
  label: string
  type: string
  instructions?: string
  choices?: Record<string, string>
  templates?: string[]
  fields?: Def[]
}

export const TEMPLATES = [...(defs.templates as string[]), 'blog']

export const TEMPLATE_LABELS: Record<string, string> = {
  default: 'Default page',
  blog: 'Blog index (posts page)',
  'front-page': 'Front page (home)',
  category: 'Category landing',
  about: 'About',
  pricing: 'Pricing',
  contact: 'Contact',
  'virtual-try-on': 'Virtual try-on',
  'ai-showcase': 'AI catalogue showcase',
  shopify: 'Shopify app',
  'market-places': 'Marketplaces',
  'case-studies': 'Case studies listing',
  guide: 'Getting started (guides listing)',
  update: 'Product updates listing',
  document: 'Documentation',
}

/** ACF names may contain "-", which Payload field names can't. */
export const san = (n: string) => n.replace(/[^A-Za-z0-9_]/g, '_')

const label = (d: Def) => d.label || d.name

function toField(d: Def, topLevel: boolean): Field {
  const base = {
    name: san(d.name),
    label: label(d),
    admin: {
      description: d.instructions,
      ...(topLevel && d.templates
        ? { condition: (data: any) => d.templates!.includes(data?.template ?? 'default') }
        : {}),
    },
  }
  switch (d.type) {
    case 'textarea':
      return { ...base, type: 'textarea' }
    case 'wysiwyg':
      // Theme markup lives in these fields (classes and all) — edit as HTML.
      return { ...base, type: 'code', admin: { ...base.admin, language: 'html', components: { Field: '/components/admin/WpEditor#WpEditor' } } }
    case 'number':
      return { ...base, type: 'number' }
    case 'select':
      return {
        ...base,
        type: 'select',
        options: Object.entries(d.choices ?? {}).map(([value, l]) => ({ label: String(l), value })),
      }
    case 'link':
      return {
        ...base,
        type: 'group',
        fields: [
          { name: 'url', type: 'text' },
          { name: 'title', type: 'text' },
          { name: 'target', type: 'text' },
        ],
      }
    case 'image':
    case 'file':
      return { ...base, type: 'text', admin: { ...base.admin, description: [d.instructions, 'Image URL'].filter(Boolean).join(' — ') } }
    case 'gallery':
      return {
        ...base,
        type: 'array',
        dbName: `acf_${san(d.name)}`.slice(0, 40),
        labels: { singular: 'Image', plural: 'Images' },
        fields: [
          { name: 'url', type: 'text', required: true, label: 'Image URL' },
          { name: 'alt', type: 'text' },
        ],
      }
    case 'repeater': {
      const sub = (d.fields ?? []).map((f) => toField(f, false))
      return {
        ...base,
        type: 'array',
        // keep generated table names short (Postgres identifier limit)
        dbName: `acf_${san(d.name)}`.slice(0, 40),
        labels: { singular: label(d), plural: label(d) },
        fields: sub,
      }
    }
    default:
      return { ...base, type: 'text' }
  }
}

export const acfGroupFields: Field[] = defs.groups.map((g) => ({
  type: 'collapsible',
  label: g.title,
  admin: {
    initCollapsed: false,
    condition: (data: any) => {
      const t = data?.template ?? 'default'
      return (g.fields as Def[]).some((f) => f.templates?.includes(t))
    },
  },
  fields: (g.fields as Def[]).map((f) => toField(f, true)),
}))

/** ACF options page ("Global Content": header, footer, contact details, socials). */
export const globalContentFields: Field[] = ((defs as any).globalContent as Def[]).map((f) => toField(f, false))
