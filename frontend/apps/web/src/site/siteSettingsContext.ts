import { createContext } from 'react'
import type { SiteSettings } from '../lib/settings'

export type SiteSettingsContextValue = SiteSettings & {
  loading: boolean
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null)
