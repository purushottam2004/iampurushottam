import { useAuth } from '../auth/useAuth'
import { useSiteSettings } from './useSiteSettings'

export function useIsOwner() {
  const { user, loading: authLoading } = useAuth()
  const { ownerId, loading: settingsLoading } = useSiteSettings()

  return {
    isOwner: Boolean(user?.id && ownerId && user.id === ownerId),
    loading: authLoading || settingsLoading,
  }
}
