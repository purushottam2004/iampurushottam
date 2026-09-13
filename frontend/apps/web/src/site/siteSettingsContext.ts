import { createContext } from 'react'

export type SiteSettingsContextValue = {
  ownerId: string | null
  loading: boolean
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null)
