import { useEffect, useState } from 'react'
import { ContentEditor } from '../components/ContentEditor'
import { HtmlBody } from '../components/HtmlBody'
import { getSiteContent, saveSiteContent } from '../lib/content'
import { useIsOwner } from '../site/useIsOwner'

export function AboutPage() {
  const { isOwner: owner } = useIsOwner()
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    void getSiteContent('about')
      .then((next) => {
        if (mounted) setBody(next)
      })
      .catch((err: unknown) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Could not load this page.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main>
      <h1 className="page-title">About</h1>
      {loading && <p className="quiet">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !body && !owner && <p className="quiet">Nothing here yet.</p>}
      <HtmlBody source={body} />
      {owner && (
        <ContentEditor
          value={body}
          label="Edit about"
          onSave={async (next) => {
            await saveSiteContent('about', next)
            setBody(next)
          }}
        />
      )}
    </main>
  )
}
