import { Link, navigate } from './nav.jsx'
import { clearSession, getSession } from './api.js'
import logoApp2x from './assets/logo/logo-app-h2x.png'
import logoApp3x from './assets/logo/logo-app-h3x.png'
import './Header.css'

export default function Header({ showSections = true }) {
  const session = getSession()

  function signOut() {
    clearSession()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo" aria-label="Sageant home">
          <img
            src={logoApp2x}
            srcSet={`${logoApp2x} 2x, ${logoApp3x} 3x`}
            height="48"
            alt="Sageant"
          />
        </Link>

        {showSections && (
          <nav className="header-links" aria-label="Sections">
            <a href="/#features">What it does</a>
            <a href="/#how-it-works">How it works</a>
          </nav>
        )}

        <div className="header-actions">
          {session ? (
            <>
              <button type="button" className="btn btn-quiet" onClick={signOut}>
                Sign out
              </button>
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-quiet">
                Sign in
              </Link>
              <Link to="/create-organisation" className="btn btn-primary">
                <span className="label-long">Create your organisation</span>
                <span className="label-short">Get started</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
