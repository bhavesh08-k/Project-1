import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Button from './Button'

export default function LoginModal({ onClose }) {
  const { login } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (name.trim().length < 2) {
      setError('Please enter your name.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }
    login({ name: name.trim(), email: email.trim() })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="login-title">
        <p className="kicker">Demo profile</p>
        <h2 id="login-title">Sign in to NOIRBOX</h2>
        <p className="muted">No passwords. This is a frontend-only mock login stored in your browser.</p>
        <form onSubmit={submit}>
          <input className="field" style={{ margin: '10px 0' }} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error ? <p className="error">{error}</p> : null}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Button type="submit">Continue</Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
