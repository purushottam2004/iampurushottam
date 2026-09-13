import { sanitizeHtml } from '../lib/html'

export function HtmlBody({ source, className }: { source: string; className?: string }) {
  const html = sanitizeHtml(source)
  if (!html.trim()) {
    return null
  }

  return (
    <div
      className={['html-body', className].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
