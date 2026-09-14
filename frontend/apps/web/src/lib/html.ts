import DOMPurify from 'dompurify'

export function sanitizeHtml(source: string): string {
  return DOMPurify.sanitize(source, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['style'],
  })
}

export function plainTextFromHtml(source: string): string {
  return source.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
