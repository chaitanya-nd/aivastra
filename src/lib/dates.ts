/** Settings → General → Date format + Timezone (WordPress date_i18n). */
export function formatDate(iso: string | null | undefined, s?: { dateFormat?: string | null; timezone?: string | null; siteLanguage?: string | null } | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const timeZone = s?.timezone || 'Asia/Kolkata'
  const locale = s?.siteLanguage || 'en'
  const part = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale.startsWith('en') ? 'en-US' : locale, { timeZone, ...o }).format(d)
  const f = s?.dateFormat || 'MMM d, yyyy'
  const map: Record<string, string> = {
    yyyy: part({ year: 'numeric' }), MMMM: part({ month: 'long' }), MMM: part({ month: 'short' }),
    MM: part({ month: '2-digit' }), dd: part({ day: '2-digit' }), d: part({ day: 'numeric' }),
  }
  return f.replace(/yyyy|MMMM|MMM|MM|dd|d/g, (t) => map[t])
}
