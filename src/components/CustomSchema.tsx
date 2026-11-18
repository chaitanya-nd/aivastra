import { JsonLd } from './JsonLd'

/** Renders raw `<script type="application/ld+json">…</script>` strings kept from the old Schema plugin. */
export function CustomSchema({ html }: { html?: string | null }) {
  if (!html) return null
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
  const raw = blocks.length ? blocks : [html]
  return (
    <>
      {raw.map((r, i) => {
        try {
          return <JsonLd key={i} data={JSON.parse(r)} />
        } catch {
          return null
        }
      })}
    </>
  )
}
