import { useEffect, useRef, useState } from 'react'
import { AuthShell, Field, Notice, PasswordInput, Tips } from './AuthParts.jsx'
import { OrgCardPreview } from './AuthPanels.jsx'
import { Link, navigate } from './nav.jsx'
import { getSession, signup } from './api.js'

// Same rules as the API: png, jpg or webp, up to 2 MB.
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_LOGO = 2 * 1024 * 1024

const STEPS = ['Organisation', 'Your account', 'Review']

// Helpful notes shown under the form on phones, one set per step.
const STEP_TIPS = {
  1: [
    'Your name and logo appear across Sageant.',
    'No logo yet? You can add one later.',
  ],
  2: [
    'Use an email you check often. It is how you sign in.',
    'Longer passwords with letters and numbers are safer.',
  ],
  3: [
    'You can connect Shopify, WhatsApp and email after you sign in.',
    'Your password is stored hashed, never in plain text.',
  ],
}

// Let people type "myshop.com"; the API wants a full address.
function cleanWebsite(value) {
  const v = value.trim()
  if (!v) return ''
  return /^https?:\/\//i.test(v) ? v : `https://${v}`
}

function isValidWebsite(value) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.hostname.includes('.')
  } catch {
    return false
  }
}

// 0 to 4, shown as a small bar under the password field.
function passwordScore(pw) {
  if (pw.length < 8) return 0
  let score = 1
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++
  return score
}
const SCORE_LABEL = ['Too short', 'Okay', 'Good', 'Strong', 'Very strong']

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (getSession()) navigate('/dashboard', { replace: true })
  }, [])

  // Show the chosen logo in the preview, and free the memory when it changes.
  useEffect(() => {
    if (!logo) {
      setLogoUrl('')
      return
    }
    const url = URL.createObjectURL(logo)
    setLogoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [logo])

  function onLogoChange(e) {
    const file = e.target.files?.[0] ?? null
    setError('')
    if (file && !LOGO_TYPES.includes(file.type)) {
      setError('The logo must be a png, jpg or webp image.')
      e.target.value = ''
      return
    }
    if (file && file.size > MAX_LOGO) {
      setError('The logo must be 2 MB or smaller.')
      e.target.value = ''
      return
    }
    setLogo(file)
  }

  function removeLogo() {
    setLogo(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function validate(forStep) {
    if (forStep === 1) {
      if (!name.trim()) return 'Enter your organisation name.'
      if (!isValidWebsite(cleanWebsite(website))) return 'Enter a valid website, like myshop.com.'
    }
    if (forStep === 2) {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Enter a valid email address.'
      if (password.length < 8) return 'Your password must be at least 8 characters.'
    }
    return ''
  }

  function goTo(next) {
    setError('')
    setStep(next)
  }

  async function onSubmit(e) {
    e.preventDefault()
    const problem = validate(step)
    if (problem) return setError(problem)

    // Steps 1 and 2 just move on; step 3 creates the organisation.
    if (step < 3) return goTo(step + 1)

    setError('')
    setLoading(true)
    try {
      const result = await signup({
        email: email.trim(),
        password,
        name: name.trim(),
        website: cleanWebsite(website),
        logo,
      })
      // The API returns a message only when the logo upload failed.
      navigate(`/signin?created=1${result?.message ? '&note=logo' : ''}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const score = passwordScore(password)
  const site = cleanWebsite(website).replace(/^https?:\/\//i, '')

  return (
    <AuthShell
      panel={
        <OrgCardPreview name={name} website={site} email={email.trim()} logoUrl={logoUrl} />
      }
      note="A preview only. Nothing is saved until you create your organisation."
    >
      <h1>Create your organisation</h1>
      <p className="form-sub">
        Already registered? <Link to="/signin">Sign in</Link>
      </p>

      <ol className="steps-bar" aria-label="Progress">
        {STEPS.map((label, i) => {
          const n = i + 1
          const state = n < step ? 'is-done' : n === step ? 'is-current' : ''
          return (
            <li key={label} className={state} aria-current={n === step ? 'step' : undefined}>
              <span className="steps-line" />
              <span className="steps-label">
                {n}. {label}
              </span>
            </li>
          )
        })}
      </ol>

      <form onSubmit={onSubmit} noValidate>
        <div className="form-step" key={step}>
          {step === 1 && (
            <>
              <Field label="Organisation name">
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="organization"
                    placeholder="For example, Noor Textiles"
                    maxLength={150}
                    autoFocus
                    required
                  />
                )}
              </Field>

              <Field label="Website" optional>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="url"
                    inputMode="url"
                    placeholder="yourshop.com"
                    maxLength={255}
                  />
                )}
              </Field>

              <div className="field">
                <div className="logo-row">
                  <span className="field-label">
                    Logo <span className="field-optional">(optional)</span>
                  </span>
                  <input
                    ref={fileRef}
                    id="logo-input"
                    className="visually-hidden"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                    onChange={onLogoChange}
                  />
                  <div className="logo-actions">
                    <label htmlFor="logo-input" className="btn btn-outline btn-small">
                      {logo ? 'Change logo' : 'Upload logo'}
                    </label>
                    {logo && (
                      <button type="button" className="link-button" onClick={removeLogo}>
                        Remove
                      </button>
                    )}
                  </div>
                  {logoUrl && (
                    <div className="logo-thumb has-logo" aria-hidden="true">
                      <img src={logoUrl} alt="" />
                    </div>
                  )}
                </div>
                <p className="field-hint">
                  {logo ? logo.name : 'PNG, JPG or WebP, up to 2 MB. Square works best.'}
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
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
                    maxLength={150}
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
                    autoComplete="new-password"
                    maxLength={100}
                    required
                  />
                )}
              </Field>

              <div className="meter" aria-live="polite">
                <div className={`meter-bars level-${score}`}>
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span>{password ? SCORE_LABEL[score] : 'At least 8 characters.'}</span>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="review-intro">Check your details, then create your organisation.</p>
              <dl className="review">
                <div>
                  <dt>Organisation</dt>
                  <dd>{name.trim()}</dd>
                </div>
                <div>
                  <dt>Website</dt>
                  <dd>{site || 'Not added'}</dd>
                </div>
                <div>
                  <dt>Logo</dt>
                  <dd>{logo ? logo.name : 'Not added'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{email.trim()}</dd>
                </div>
                <div>
                  <dt>Password</dt>
                  <dd>{'•'.repeat(Math.min(password.length, 12))}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        <Notice kind="error">{error}</Notice>

        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-outline btn-large"
              onClick={() => goTo(step - 1)}
              disabled={loading}
            >
              Back
            </button>
          )}
          <button type="submit" className="btn btn-primary btn-large form-submit" disabled={loading}>
            {step < 3 ? 'Continue' : loading ? 'Creating…' : 'Create your organisation'}
          </button>
        </div>
      </form>

      <Tips items={STEP_TIPS[step]} />
    </AuthShell>
  )
}
