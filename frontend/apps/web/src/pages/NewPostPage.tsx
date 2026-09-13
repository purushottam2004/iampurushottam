import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { createPost, slugFromTitle } from '../lib/posts'
import { useIsOwner } from '../site/useIsOwner'

export function NewPostPage() {
  const { isOwner: owner, loading } = useIsOwner()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [body, setBody] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resolvedSlug = slugTouched ? slug : slugFromTitle(title)

  if (!loading && !owner) {
    return <Navigate to="/blog" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const post = await createPost({
        title: title.trim(),
        slug: resolvedSlug.trim() || slugFromTitle(title),
        body,
        published,
      })
      navigate(`/blog/${post.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create this piece.')
      setSaving(false)
    }
  }

  return (
    <main>
      <h1 className="page-title">New post</h1>
      <form onSubmit={(event) => void handleSubmit(event)}>
        <label className="field">
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label className="field">
          Slug
          <input
            value={resolvedSlug}
            onChange={(event) => {
              setSlugTouched(true)
              setSlug(event.target.value)
            }}
            required
          />
        </label>
        <label className="field">
          Body
          <textarea value={body} onChange={(event) => setBody(event.target.value)} required />
        </label>
        <label className="field" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
          Publish now
        </label>
        {error && <p className="error">{error}</p>}
        <p className="page-actions">
          <button type="submit" className="text-action" disabled={saving}>
            {saving ? 'Saving…' : published ? 'Publish' : 'Save draft'}
          </button>
        </p>
      </form>
    </main>
  )
}
