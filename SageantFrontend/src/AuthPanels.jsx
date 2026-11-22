const check = <path d="M4 10.5l4 4 8-9" />
const alert = (
  <>
    <path d="M10 5v6" />
    <path d="M10 14.5v.01" />
  </>
)

function Mark({ kind }) {
  return (
    <span className={`mini-mark mini-${kind}`}>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        {kind === 'warn' ? alert : check}
      </svg>
    </span>
  )
}

// Sign-in panel: a small taste of what is waiting behind the login.
export function SignInPanel() {
  return (
    <>
      <h2 className="split-title">Sign in to the hub your shop runs on.</h2>
      <p className="split-lead">
        Orders, stock, customers and every agent step, in one place. You only see the
        organisation you belong to.
      </p>

      <div className="mini" aria-label="Example of an agent run">
        <div className="mini-head">
          <span>Today's run</span>
          <span className="mini-live">
            <i /> Agents working
          </span>
        </div>
        <ul>
          <li style={{ '--i': 0 }}>
            <Mark kind="done" /> 20 orders loaded from Shopify
          </li>
          <li style={{ '--i': 1 }}>
            <Mark kind="done" /> Stock checked for every item
          </li>
          <li style={{ '--i': 2 }}>
            <Mark kind="warn" /> 3 orders have a shortage
          </li>
        </ul>
      </div>
    </>
  )
}

function initialsOf(name) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ''
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

// Sign-up panel: the organisation card, filling in as the user types.
export function OrgCardPreview({ name, website, email, logoUrl }) {
  const initials = initialsOf(name)
  return (
    <>
      <h2 className="split-title">Meet your organisation.</h2>
      <p className="split-lead">It takes shape as you fill in the form.</p>

      <div className="org-card" aria-label="Preview of your organisation">
        <span className="org-card-tag">Preview</span>
        <div className="org-card-top">
          <div className={`org-tile${logoUrl ? ' has-logo' : ''}`}>
            {logoUrl ? <img src={logoUrl} alt="" /> : <span>{initials || 'Org'}</span>}
          </div>
          <p className={`org-name${name.trim() ? '' : ' is-empty'}`}>
            {name.trim() || 'Your organisation'}
          </p>
        </div>
        <dl className="org-rows">
          <div>
            <dt>Website</dt>
            <dd className={website ? '' : 'is-empty'}>{website || 'Not added'}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd className={email ? '' : 'is-empty'}>{email || 'Not added'}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>You</dd>
          </div>
        </dl>
      </div>
    </>
  )
}
