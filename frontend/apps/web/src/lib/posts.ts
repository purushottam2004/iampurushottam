import type { PostKind } from '../site/sections'
import { plainTextFromHtml } from './html'
import { supabase } from './supabaseClient'

export type Post = {
  id: string
  slug: string
  title: string
  body: string
  excerpt: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  kind: PostKind
}

export type PostDraft = {
  slug: string
  title: string
  body: string
  published: boolean
  kind: PostKind
}

export function slugFromTitle(title: string): string {
  return plainTextFromHtml(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function excerptFromBody(body: string): string {
  const plain = body.replace(/[#*_`>[\]]/g, '').replace(/\s+/g, ' ').trim()
  if (plain.length <= 160) return plain
  return `${plain.slice(0, 157).trimEnd()}…`
}

function throwIfError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message)
  }
}

export async function listPosts(kind: PostKind): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('kind', kind)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  throwIfError(error)
  return (data ?? []) as Post[]
}

export async function getPostBySlug(slug: string, kind: PostKind): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('kind', kind)
    .maybeSingle()
  throwIfError(error)
  return (data as Post | null) ?? null
}

export async function createPost(draft: PostDraft): Promise<Post> {
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('posts')
    .insert({
      slug: draft.slug,
      title: draft.title,
      body: draft.body,
      excerpt: excerptFromBody(draft.body),
      published: draft.published,
      published_at: draft.published ? now : null,
      kind: draft.kind,
    })
    .select('*')
    .single()

  throwIfError(error)
  return data as Post
}

export async function updatePost(
  id: string,
  patch: Partial<Pick<Post, 'slug' | 'title' | 'body' | 'published' | 'published_at'>>,
): Promise<Post> {
  const next: Record<string, unknown> = { ...patch }
  if (patch.body !== undefined) {
    next.excerpt = excerptFromBody(patch.body)
  }

  const { data, error } = await supabase.from('posts').update(next).eq('id', id).select('*').single()
  throwIfError(error)
  return data as Post
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  throwIfError(error)
}
