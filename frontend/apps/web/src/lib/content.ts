import { supabase } from './supabaseClient'

export type SiteContentKey = 'home_intro' | 'about'

export async function getSiteContent(key: SiteContentKey): Promise<string> {
  const { data, error } = await supabase.from('site_content').select('body').eq('key', key).maybeSingle()
  if (error) {
    throw new Error(error.message)
  }
  return data?.body ?? ''
}

export async function saveSiteContent(key: SiteContentKey, body: string): Promise<void> {
  const { error } = await supabase.from('site_content').upsert({ key, body }, { onConflict: 'key' })
  if (error) {
    throw new Error(error.message)
  }
}
