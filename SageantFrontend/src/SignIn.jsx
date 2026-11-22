import { useEffect, useState } from 'react'
import { AuthShell, Field, Notice, PasswordInput, Tips } from './AuthParts.jsx'
import { SignInPanel } from './AuthPanels.jsx'
import { Link, navigate } from './nav.jsx'
import { getSession, login } from './api.js'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const params = new URLSearchParams(window.location.search)
  const justCreated = params.get('created') === '1'
  const logoFailed = params.get('note') === 'logo'

  // Already signed in: go straight to the dashboard.
  useEffect(() => {
    if (getSession()) navigate('/dashboard', { replace: true })
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <AuthShell
      panel={<SignInPanel />}
      note="The example run above is a sample, not your data."
    >
      <h1>Welcome back</h1>
      <p className="form-sub form-sub--note">Sign in to your organisation.</p>

      {justCreated && (
        <Notice kind="success">
          Your organisation is created. Sign in to continue.
          {logoFailed && ' The logo upload failed, so you can add it later.'}
        </Notice>
      )}

      <form onSubmit={onSubmit} noValidate>
        <Field label="Email">
          {(id) => (
            <input
              id={id}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              placeholder="you@yourshop.com"
              autoFocus
              required
            />
          )}
        </Field>

        <Field label="Password">
          {(id) => (
            <PasswordInput
              id={id}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          )}
        </Field>

        <Notice kind="error">{error}</Notice>

        <button type="submit" className="btn btn-primary btn-large form-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="form-switch">
        New to Sageant? <Link to="/create-organisation">Create your organisation</Link>
      </p>

      <Tips
        items={[
          "Use the email you registered your organisation with.",
          "Passwords are case-sensitive.",
          "On a shared device? Sign out when you are done.",
        ]}
      />
    </AuthShell>
  )
}
