import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentEditor } from '../components/ContentEditor'
import { HtmlBody } from '../components/HtmlBody'
import { PostList } from '../components/PostList'
import { getSiteContent, saveSiteContent } from '../lib/content'
import { listPosts, type Post } from '../lib/posts'
import { PROJECTS, WRITING, type PostSection } from '../site/sections'
import { useIsOwner } from '../site/useIsOwner'

const HOME_POST_LIMIT = 5

function PostSection({ section, posts }: { section: PostSection; posts: Post[] }) {
  const visible = posts.slice(0, HOME_POST_LIMIT)
  return (
    <>
      <h1 className="lead-heading">{section.title}</h1>
      <PostList posts={visible} basePath={section.path} />
      {posts.length > HOME_POST_LIMIT && (
        <Link className="all-writing" to={section.path}>
          {section.allLabel}
        </Link>
      )}
    </>
  )
}

export function HomePage() {
  const { isOwner: owner } = useIsOwner()
  const [intro, setIntro] = useState('')
  const [writing, setWriting] = useState<Post[]>([])
  const [projects, setProjects] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    void Promise.all([getSiteContent('home_intro'), listPosts(WRITING.kind), listPosts(PROJECTS.kind)])
      .then(([nextIntro, nextWriting, nextProjects]) => {
        if (!mounted) return
        setIntro(nextIntro)
        setWriting(nextWriting)
        setProjects(nextProjects)
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

  return (
    <main>
      <h1 className="lead-heading">{WRITING.title}</h1>
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
      {!loading && !error && (
        <>
          <PostList posts={writing.slice(0, HOME_POST_LIMIT)} basePath={WRITING.path} />
          {writing.length > HOME_POST_LIMIT && (
            <Link className="all-writing" to={WRITING.path}>
              {WRITING.allLabel}
            </Link>
          )}
          <PostSection section={PROJECTS} posts={projects} />
        </>
      )}
    </main>
  )
}
