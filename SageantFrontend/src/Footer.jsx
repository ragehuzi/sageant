import { Link } from './nav.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/" className="footer-brand" aria-label="Sageant home">
          <img src="/favicon.png" alt="" width="40" height="40" />
          <span>Sageant</span>
        </Link>
        <nav aria-label="Account">
          <Link to="/signin">Sign in</Link>
          <Link to="/create-organisation">Create your organisation</Link>
        </nav>
        <small>© 2026 Sageant</small>
      </div>
    </footer>
  )
}
