import { supabase } from './supabaseClient'

export const OWNER_SETTING_KEY = 'owner_id'
export const WHATSAPP_PHONE_KEY = 'whatsapp_phone'
export const CONTACT_EMAIL_KEY = 'contact_email'
export const LINKEDIN_URL_KEY = 'linkedin_url'

export type SiteSettings = {
  ownerId: string | null
  whatsappPhone: string | null
  contactEmail: string | null
  linkedinUrl: string | null
}

export const EMPTY_SETTINGS: SiteSettings = {
  ownerId: null,
  whatsappPhone: null,
  contactEmail: null,
  linkedinUrl: null,
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', [OWNER_SETTING_KEY, WHATSAPP_PHONE_KEY, CONTACT_EMAIL_KEY, LINKEDIN_URL_KEY])

  if (error) {
    throw new Error(error.message)
  }

  const byKey = new Map((data ?? []).map((row) => [row.key, row.value]))
  return {
    ownerId: byKey.get(OWNER_SETTING_KEY) ?? null,
    whatsappPhone: byKey.get(WHATSAPP_PHONE_KEY) ?? null,
    contactEmail: byKey.get(CONTACT_EMAIL_KEY) ?? null,
    linkedinUrl: byKey.get(LINKEDIN_URL_KEY) ?? null,
  }
}

export function whatsappChatUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}`
}

export function mailtoUrl(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed.includes('@')) return null
  return `mailto:${trimmed}`
}

export function linkedinHref(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    const host = url.hostname.replace(/^www\./, '')
    if (host !== 'linkedin.com') return null
    return trimmed
  } catch {
    return null
  }
}
