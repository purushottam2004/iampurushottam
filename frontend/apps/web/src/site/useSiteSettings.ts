import { useContext } from 'react'
import { SiteSettingsContext, type SiteSettingsContextValue } from './siteSettingsContext'

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  }
  return ctx
}
