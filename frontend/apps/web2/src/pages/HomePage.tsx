import { Button } from '@repo/ui'
import { useAuth } from '../auth/useAuth'
import { HelloButton } from '../components/HelloButton'

export function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Web2</h1>
          <p style={{ margin: '0.35rem 0 0', color: '#555' }}>
            Signed in as <strong>{user?.email}</strong>
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => void signOut()}>
          Sign out
        </Button>
      </header>

      <section>
        <h2>Backend</h2>
        <p>Call the authenticated <code>/api/v1/hello</code> endpoint.</p>
        <HelloButton />
      </section>
    </main>
  )
}
