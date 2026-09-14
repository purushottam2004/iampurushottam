import type { ElementType } from 'react'
import { sanitizeHtml } from '../lib/html'

export function HtmlMarkup({
  source,
  as: Tag = 'div',
  className,
}: {
  source: string
  as?: ElementType
  className?: string
}) {
  const html = sanitizeHtml(source)
  if (!html.trim()) {
    return null
  }

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

export function HtmlBody({ source, className }: { source: string; className?: string }) {
  return (
    <HtmlMarkup source={source} className={['html-body', className].filter(Boolean).join(' ')} />
  )
}
