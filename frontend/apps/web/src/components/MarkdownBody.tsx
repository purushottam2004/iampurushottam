import Markdown from 'react-markdown'

export function MarkdownBody({ source }: { source: string }) {
  if (!source.trim()) {
    return null
  }

  return (
    <div className="markdown">
      <Markdown>{source}</Markdown>
    </div>
  )
}
