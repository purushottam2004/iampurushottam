import type { ElementType } from 'react'

export function HtmlMarkup({
  source,
  as: Tag = 'div',
  className,
}: {
  source: string
  as?: ElementType
  className?: string
}) {
  if (!source.trim()) {
    return null
  }

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: source }} />
}

export function HtmlBody({ source, className }: { source: string; className?: string }) {
  return (
    <HtmlMarkup source={source} className={['html-body', className].filter(Boolean).join(' ')} />
  )
}
