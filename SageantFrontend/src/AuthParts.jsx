import { useId, useState } from 'react'
import { Link } from './nav.jsx'
import logoApp2x from './assets/logo/logo-app-h2x.png'
import logoApp3x from './assets/logo/logo-app-h3x.png'
import './Auth.css'
import './AuthSplit.css'

// Soft leaf shapes, echoing the leaf in the Sageant logo. Decoration only.
function Leaves() {
  return (
    <svg className="split-leaves" viewBox="0 0 480 420" aria-hidden="true">
      <path className="leaf-a" d="M-20 420 C 20 220, 170 60, 420 40 C 430 250, 300 400, -20 420 Z" />
      <path className="leaf-b" d="M180 440 C 200 320, 300 230, 500 220 C 500 340, 400 430, 180 440 Z" />
    </svg>
  )
}

export function Brand() {
  return (
    <Link to="/" className="split-brand" aria-label="Sageant home">
      <img
        src={logoApp2x}
        srcSet={`${logoApp2x} 2x, ${logoApp3x} 3x`}
        height="48"
        alt="Sageant"
      />
    </Link>
  )
}

// Two columns: a warm brand panel (left) and the form (right).
// On phones the panel shrinks to just the brand bar.
export function AuthShell({ panel, note, children }) {
  return (
    <div className="auth-split">
      <aside className="split-panel">
        <Leaves />
        <Brand />
        <Link to="/" className="split-back-mobile">
          Home
        </Link>
        <div className="split-panel-body">{panel}</div>
        {note && <p className="split-note">{note}</p>}
      </aside>

      <main className="split-main">
        <Link to="/" className="split-back">
          <span aria-hidden="true">←</span> Back to home
        </Link>
        <div className="split-form">{children}</div>
      </main>
    </div>
  )
}

export function Field({ label, hint, optional, children }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </label>
      {children(id)}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}

export function PasswordInput({ id, value, onChange, autoComplete, ...rest }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="password">
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        {...rest}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShown((s) => !s)}
        aria-pressed={shown}
      >
        {shown ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

export function Notice({ kind = 'info', children }) {
  if (!children) return null
  return (
    <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}

// Short helpful notes. Shown on phones, where there is spare room below the form.
export function Tips({ items }) {
  return (
    <aside className="tips" aria-label="Good to know">
      <p className="tips-title">Good to know</p>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </aside>
  )
}
