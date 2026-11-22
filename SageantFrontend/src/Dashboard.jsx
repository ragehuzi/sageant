import { useEffect, useState } from 'react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { Notice } from './AuthParts.jsx'
import { navigate } from './nav.jsx'
import { clearSession, getSession, me } from './api.js'
import './Auth.css'

// Placeholder home after sign in. It calls /me to prove the token works.
export default function Dashboard() {
  const session = getSession()
  const [org, setOrg] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) {
      navigate('/signin', { replace: true })
      return
    }
    me(session.token)
      .then(setOrg)
      .catch((err) => {
        if (err.status === 401) {
          clearSession()
          navigate('/signin', { replace: true })
        } else {
          setError(err.message)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!session) return null

  // The login response holds the org fields at the top level.
  const shown = org ?? session

  return (
    <>
      <Header showSections={false} />
      <main className="auth">
        <div className="auth-card">
          <h1>Welcome, {shown.name}</h1>
          <p className="auth-intro">Your organisation is signed in and ready.</p>
          <Notice kind="error">{error}</Notice>
          <dl className="facts">
            <div>
              <dt>Currency</dt>
              <dd>{shown.currency}</dd>
            </div>
            <div>
              <dt>Timezone</dt>
              <dd>{shown.timezone}</dd>
            </div>
          </dl>
          <p className="auth-intro">The dashboard is coming next.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
