'use client'

import { useAuth } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import { type Cap, CAPS, DEFAULT_CAPS, LOCKED, type Role } from '@/access/caps'

let shared: Promise<Record<string, Cap[]> | null> | null = null

/** The signed-in user's capabilities (same rules as the server; the server still enforces them). */
export function useCaps(): Set<Cap> | null {
  const { user } = useAuth<any>()
  const [caps, setCaps] = useState<Set<Cap> | null>(null)
  useEffect(() => {
    if (!user) return
    const role = user.role as Role
    if (role === 'admin') return setCaps(new Set(Object.keys(CAPS) as Cap[]))
    shared ??= fetch('/api/globals/role-capabilities?depth=0', { credentials: 'include' }).then((r) => r.json()).then((g) => g?.matrix ?? null).catch(() => null)
    shared.then((m) => setCaps(new Set(LOCKED.includes(role) || !Array.isArray(m?.[role]) ? DEFAULT_CAPS[role] ?? [] : m![role])))
  }, [user])
  return caps
}
