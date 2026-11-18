/**
 * URL slug. Keeps WordPress-style percent-encoded UTF-8 (e.g. "%e2%82%b9" for ₹)
 * untouched so legacy URLs that Google already indexed keep matching.
 */
export const slugify = (v: string): string =>
  v
    .split(/(%[0-9a-fA-F]{2})/)
    .map((part) =>
      /^%[0-9a-fA-F]{2}$/.test(part)
        ? part.toLowerCase()
        : part
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/&/g, ' and ')
            .replace(/[^a-z0-9]+/g, '-'),
    )
    .join('')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

export const formatSlug = (val: string): string => slugify(val)
