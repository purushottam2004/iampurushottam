import { supabase } from './supabaseClient'

export const OWNER_SETTING_KEY = 'owner_id'

export async function getSiteOwnerId(): Promise<string | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', OWNER_SETTING_KEY)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }
  return data?.value ?? null
}
