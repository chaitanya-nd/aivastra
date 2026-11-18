import type { Field } from 'payload'

/** Post/page body as WordPress-style HTML (Visual / Text editor). The old Lexical `content` stays as a hidden fallback for untouched legacy docs. */
export const bodyFields = (label: string | false = false): Field[] => [
  {
    name: 'contentHtml',
    type: 'code',
    label,
    admin: { language: 'html', components: { Field: '/components/admin/WpEditor#WpEditor' } },
  },
  { name: 'content', type: 'richText', admin: { hidden: true, disableListColumn: true, disableListFilter: true } },
]
