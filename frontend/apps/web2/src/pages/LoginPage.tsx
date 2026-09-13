import { Navigate, useLocation } from 'react-router-dom'
import { LoginForm } from '@repo/auth'
import { useAuth } from '../auth/useAuth'
import { supabase } from '../lib/supabaseClient'

export function LoginPage() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  if (loading) {
    return <p style={{ padding: '2rem' }}>Loading…</p>
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Sign in</h1>
      <p>Authentication is required to use this app.</p>
      <div style={{ marginTop: '1.5rem' }}>
        <LoginForm client={supabase} />
      </div>
    </main>
  )
}
