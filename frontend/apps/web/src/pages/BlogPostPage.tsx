import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HtmlBody, HtmlMarkup } from '../components/HtmlBody'
import { formatPostDate } from '../lib/dates'
import { deletePost, getPostBySlug, updatePost, type Post } from '../lib/posts'
import type { PostSection } from '../site/sections'
import { useIsOwner } from '../site/useIsOwner'

export function BlogPostPage({ section }: { section: PostSection }) {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isOwner: owner } = useIsOwner()
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!slug) return
    let mounted = true

    void getPostBySlug(slug, section.kind)
      .then((next) => {
        if (!mounted) return
        setPost(next)
        if (next) {
          setTitle(next.title)
          setBody(next.body)
        }
      })
      .catch((err: unknown) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Could not load this piece.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [slug, section.kind])

  async function handleSave() {
    if (!post) return
    setSaving(true)
    setError(null)
    try {
      const next = await updatePost(post.id, { title, body })
      setPost(next)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublishToggle() {
    if (!post) return
    setSaving(true)
    setError(null)
    try {
      const next = await updatePost(post.id, {
        published: !post.published,
        published_at: post.published ? post.published_at : (post.published_at ?? new Date().toISOString()),
      })
      setPost(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update publish state.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!post) return
    if (!window.confirm('Delete this piece?')) return
    setSaving(true)
    try {
      await deletePost(post.id)
      navigate(section.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main>
        <p className="quiet">Loading…</p>
      </main>
    )
  }

  if (!post) {
    return (
      <main>
        <h1 className="page-title">Not available</h1>
        <p className="quiet">This piece is not available.</p>
      </main>
    )
  }

  return (
    <main>
      {editing ? (
        <label className="field">
          Title (HTML)
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
      ) : (
        <HtmlMarkup as="h1" className="page-title html-title" source={post.title} />
      )}
      <p className="post-meta">
        {formatPostDate(post.published_at)}
        {!post.published && ' · Draft'}
      </p>
      {error && <p className="error">{error}</p>}
      {editing ? (
        <>
          <label className="field">
            Body (HTML)
            <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={16} />
          </label>
          <p className="quiet field-hint">HTML is rendered as stored, including iframes.</p>
        </>
      ) : (
        <HtmlBody source={post.body} />
      )}
      {owner && (
        <p className="page-actions">
          {editing ? (
            <>
              <button type="button" className="text-action" onClick={() => void handleSave()} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                className="text-action"
                onClick={() => {
                  setTitle(post.title)
                  setBody(post.body)
                  setEditing(false)
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="text-action" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
          <button type="button" className="text-action" onClick={() => void handlePublishToggle()} disabled={saving}>
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
          <button type="button" className="text-action" onClick={() => void handleDelete()} disabled={saving}>
            Delete
          </button>
        </p>
      )}
    </main>
  )
}
