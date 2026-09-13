import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { EMPTY_SETTINGS, getSiteSettings, type SiteSettings } from '../lib/settings'
import { SiteSettingsContext, type SiteSettingsContextValue } from './siteSettingsContext'

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    void getSiteSettings()
      .then((next) => {
        if (mounted) setSettings(next)
      })
      .catch(() => {
        if (mounted) setSettings(EMPTY_SETTINGS)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo<SiteSettingsContextValue>(
    () => ({ ...settings, loading }),
    [settings, loading],
  )

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}
