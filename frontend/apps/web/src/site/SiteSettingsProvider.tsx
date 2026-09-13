import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { getSiteOwnerId } from '../lib/settings'
import { SiteSettingsContext, type SiteSettingsContextValue } from './siteSettingsContext'

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    void getSiteOwnerId()
      .then((id) => {
        if (mounted) setOwnerId(id)
      })
      .catch(() => {
        if (mounted) setOwnerId(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo<SiteSettingsContextValue>(
    () => ({ ownerId, loading }),
    [ownerId, loading],
  )

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}
