import { useEffect } from 'react'
import { LoginForm } from '@repo/auth'
import { supabase } from '../lib/supabaseClient'

type LoginModalProps = {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  useEffect(() => {
    if (!open) return

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) {
    return null
  }

  function handleSignedIn() {
    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <h2 id="login-title">Sign in</h2>
        <LoginForm client={supabase} onSignedIn={handleSignedIn} className="login-form" />
      </div>
    </div>
  )
}
