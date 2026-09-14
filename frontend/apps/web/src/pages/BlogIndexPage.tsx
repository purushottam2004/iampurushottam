import { useEffect, useState } from 'react'
import { PostList } from '../components/PostList'
import { listPosts, type Post } from '../lib/posts'
import type { PostSection } from '../site/sections'
import { useIsOwner } from '../site/useIsOwner'

export function BlogIndexPage({ section }: { section: PostSection }) {
  const { isOwner: owner } = useIsOwner()
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    void listPosts(section.kind)
      .then((next) => {
        if (mounted) setPosts(next)
      })
      .catch((err: unknown) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Could not load writing.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [owner, section.kind])

  return (
    <main>
      <h1 className="page-title">{section.title}</h1>
      {loading && <p className="quiet">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <PostList posts={posts} basePath={section.path} />}
    </main>
  )
}
