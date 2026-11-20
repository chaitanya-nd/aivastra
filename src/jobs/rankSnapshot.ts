import type { TaskConfig } from 'payload'
import { googleConfig, searchConsoleDaily } from '@/lib/google'

/** Daily Search Console snapshot (Rank Math rank tracker): position / clicks / impressions per query+page. */
export const rankSnapshotTask: TaskConfig<{ input: object; output: { stored: number } }> = {
  slug: 'rankSnapshot',
  label: 'Search Console daily snapshot',
  retries: 2,
  schedule: [{ cron: '0 30 4 * * *', queue: 'daily' }],
  inputSchema: [],
  outputSchema: [{ name: 'stored', type: 'number' }],
  handler: async ({ req }) => {
    const cfg = googleConfig()
    if (!cfg.account || !cfg.gsc) return { output: { stored: 0 } }
    const { date, rows } = await searchConsoleDaily(cfg.gsc)
    const p = req.payload
    await p.delete({ collection: 'rank-snapshots', where: { date: { equals: date } }, overrideAccess: true, req })
    for (const r of rows) {
      await p.create({ collection: 'rank-snapshots', overrideAccess: true, req, data: { date, query: r.keys[0], page: r.keys[1], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position } })
    }
    return { output: { stored: rows.length } }
  },
}
