import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { SITE_NAME } from '../site/constants'
import { useIsOwner } from '../site/useIsOwner'
import { LoginModal } from './LoginModal'

export function SiteHeader() {
  const { user, loading, signOut } = useAuth()
  const { isOwner } = useIsOwner()
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <header className="site-header">
      <Link className="site-name" to="/">
        {SITE_NAME}
      </Link>
      <nav className="site-nav" aria-label="Site">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/blog">Writing</NavLink>
        {isOwner && <NavLink to="/blog/new">New</NavLink>}
        {!loading && user && (
          <button type="button" className="text-action" onClick={() => void signOut()}>
            Sign out
          </button>
        )}
        {!loading && !user && (
          <button type="button" className="text-action" onClick={() => setLoginOpen(true)}>
            Login
          </button>
        )}
      </nav>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  )
}
