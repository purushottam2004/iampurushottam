import { useState, type CSSProperties, type FormEvent } from 'react'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { Button } from '@repo/ui'
import { getSupabaseClient } from './supabaseClient'

export type LoginFormProps = {
  /** Optional Supabase client override. Defaults to the env-configured client. */
  client?: SupabaseClient
  /** Called after a successful sign-in. */
  onSignedIn?: (user: User) => void
}

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  maxWidth: '320px',
}

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  fontSize: '0.9rem',
  fontWeight: 500,
}

const inputStyle: CSSProperties = {
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid #d0d0d8',
  fontSize: '0.95rem',
  fontWeight: 400,
}

export function LoginForm({ client, onSignedIn }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = client ?? getSupabaseClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data.user) {
        onSignedIn?.(data.user)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error during sign-in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <label style={fieldStyle}>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={inputStyle}
        />
      </label>

      <label style={fieldStyle}>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={inputStyle}
        />
      </label>

      {error && <p style={{ color: '#e5484d', margin: 0 }}>{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
