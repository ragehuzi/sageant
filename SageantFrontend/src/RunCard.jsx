import './RunCard.css'

// Drawn icons: one stroke weight, no emoji.
const paths = {
  check: <path d="M4 10.5l4 4 8-9" />,
  alert: (
    <>
      <path d="M10 5v6" />
      <path d="M10 14.5v.01" />
    </>
  ),
  chat: <path d="M4 5.5h12v8H9l-3.5 3v-3H4z" />,
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="run-icon">
      {paths[name]}
    </svg>
  )
}

// A still, illustrative mock of the agent run log. Numbers are examples.
export default function RunCard() {
  return (
    <figure className="run-wrap" aria-label="Example of a Sageant agent run">
      <div className="run">
        <div className="run-head">
          <span className="run-title">Today's run</span>
          <span className="run-status">
            <span className="run-dot" /> Agents working
          </span>
        </div>

        <div className="run-hero">
          <span className="run-number">20</span>
          <span className="run-number-label">new orders received</span>
        </div>

        <ol className="run-steps">
          <li className="run-step" style={{ '--i': 0 }}>
            <span className="run-mark is-done">
              <Icon name="check" />
            </span>
            <span className="run-step-text">Orders loaded from Shopify</span>
          </li>
          <li className="run-step" style={{ '--i': 1 }}>
            <span className="run-mark is-done">
              <Icon name="check" />
            </span>
            <span className="run-step-text">Stock checked for every item</span>
          </li>
          <li className="run-step" style={{ '--i': 2 }}>
            <span className="run-mark is-warn">
              <Icon name="alert" />
            </span>
            <span className="run-step-text">3 orders have a shortage</span>
          </li>
          <li className="run-step" style={{ '--i': 3 }}>
            <span className="run-mark is-wait">
              <Icon name="chat" />
            </span>
            <span className="run-step-text">Customers waiting to be told</span>
          </li>
        </ol>

        <div className="run-filler" aria-hidden="true">
          <span style={{ width: '62%' }} />
          <span style={{ width: '44%' }} />
        </div>
      </div>

      <div className="approve" style={{ '--i': 4 }}>
        <p className="approve-title">Approve 3 customer messages?</p>
        <p className="approve-text">A delay notice for the orders with a shortage.</p>
        <div className="approve-actions">
          <button type="button" className="btn btn-primary btn-small" tabIndex={-1}>
            Approve
          </button>
          <span className="approve-note">Nothing is sent until you say so.</span>
        </div>
      </div>
    </figure>
  )
}
