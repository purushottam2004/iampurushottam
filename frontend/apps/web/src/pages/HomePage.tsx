import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentEditor } from '../components/ContentEditor'
import { HtmlBody } from '../components/HtmlBody'
import { PostList } from '../components/PostList'
import { getSiteContent, saveSiteContent } from '../lib/content'
import { listPosts, type Post } from '../lib/posts'
import { useIsOwner } from '../site/useIsOwner'

const HOME_POST_LIMIT = 5

export function HomePage() {
  const { isOwner: owner } = useIsOwner()
  const [intro, setIntro] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    void Promise.all([getSiteContent('home_intro'), listPosts()])
      .then(([nextIntro, nextPosts]) => {
        if (!mounted) return
        setIntro(nextIntro)
        setPosts(nextPosts)
      })
      .catch((err: unknown) => {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Could not load writing.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [owner])

  const visible = posts.slice(0, HOME_POST_LIMIT)

  return (
    <main>
      <h1 className="lead-heading">Writing</h1>
      {intro && <HtmlBody source={intro} className="intro" />}
      {owner && (
        <ContentEditor
          value={intro}
          label="Edit intro"
          rows={8}
          onSave={async (next) => {
            await saveSiteContent('home_intro', next)
            setIntro(next)
          }}
        />
      )}
      {loading && <p className="quiet">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <PostList posts={visible} />}
      {posts.length > HOME_POST_LIMIT && (
        <Link className="all-writing" to="/blog">
          All writing
        </Link>
      )}
    </main>
  )
}
