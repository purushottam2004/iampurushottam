import { Link } from 'react-router-dom'
import { formatPostDate } from '../lib/dates'
import type { Post } from '../lib/posts'

export function PostList({ posts, basePath }: { posts: Post[]; basePath: string }) {
  if (posts.length === 0) {
    return <p className="quiet">Nothing published yet.</p>
  }

  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id}>
          <time dateTime={post.published_at ?? undefined}>{formatPostDate(post.published_at)}</time>
          <Link
            className="html-title"
            to={`${basePath}/${post.slug}`}
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          {!post.published && <span className="draft-mark">Draft</span>}
        </li>
      ))}
    </ol>
  )
}
