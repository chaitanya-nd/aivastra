import { createHash } from 'node:crypto'

/** IndexNow key: the one saved in Plugin settings, or a stable key derived from PAYLOAD_SECRET (works before settings are ever saved). */
export const indexNowKey = (ps?: { indexNowKey?: string | null } | null) =>
  ps?.indexNowKey || createHash('sha256').update(`indexnow:${process.env.PAYLOAD_SECRET || ''}`).digest('hex').slice(0, 32)
