export type PostKind = 'writing' | 'project'

export type PostSection = {
  kind: PostKind
  title: string
  path: string
  allLabel: string
}

export const WRITING: PostSection = {
  kind: 'writing',
  title: 'Writing',
  path: '/blog',
  allLabel: 'All writing',
}

export const PROJECTS: PostSection = {
  kind: 'project',
  title: 'Projects',
  path: '/projects',
  allLabel: 'All projects',
}
