import Header from './Header.jsx'
import RunCard from './RunCard.jsx'
import Footer from './Footer.jsx'
import { Link } from './nav.jsx'
import './Landing.css'

const features = [
  {
    title: 'Everything in one place',
    text: 'Orders, stock, customers and messages live in one system instead of five tools and a spreadsheet. Sageant works alongside Shopify. It does not replace it.',
  },
  {
    title: 'Agents do the routine work',
    text: 'Order, inventory, customer and notification agents handle the jobs that cross tools: load the orders, check stock, flag shortages, message the customers.',
  },
  {
    title: 'You make the final call',
    text: 'Agents only use a short list of allowed tools, and sensitive actions wait for your approval. Business rules are plain code, not guesses.',
  },
  {
    title: 'Every step is logged',
    text: 'Each action an agent takes is recorded, with secrets and phone numbers masked, so you can always see what happened and why.',
  },
]

const steps = [
  {
    title: 'Create your organisation',
    text: 'Give your shop a workspace with a name and a password.',
  },
  {
    title: 'Connect your tools',
    text: 'Link Shopify, WhatsApp and your email so Sageant can see the whole picture.',
  },
  {
    title: 'Let the agents work',
    text: 'They handle the routine jobs. You review and approve what matters.',
  },
]

const tools = ['Shopify', 'WhatsApp', 'Email', 'Spreadsheets']

export default function Landing() {
  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1>Run your online shop from one place.</h1>
              <p className="lead">
                Sageant connects Shopify, WhatsApp, email and spreadsheets into one
                system. AI agents do the routine work between them, and your team
                makes the final call.
              </p>
              <div className="hero-actions">
                <Link to="/create-organisation" className="btn btn-primary btn-large">
                  Create your organisation
                </Link>
                <Link to="/signin" className="btn btn-outline btn-large">
                  Sign in
                </Link>
              </div>
              <p className="hero-note">Built for small online shops.</p>
            </div>

            <RunCard />
          </div>
        </section>

        <section className="tools" aria-label="Works with">
          <div className="section-inner tools-inner">
            <p>Works with the tools you already use</p>
            <ul>
              {tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-inner split">
            <div className="split-head">
              <h2>One system. Agents that do the busywork.</h2>
              <p>
                Small shops lose hours moving data between tools. Sageant keeps it in
                one place and lets agents handle the repeat jobs.
              </p>
            </div>
            <dl className="feature-list">
              {features.map((f) => (
                <div className="feature" key={f.title}>
                  <dt>{f.title}</dt>
                  <dd>{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="how-it-works" className="section section-tint">
          <div className="section-inner">
            <h2 className="section-title">How it works</h2>
            <ol className="steps">
              {steps.map((s, i) => (
                <li className="step" key={s.title}>
                  <span className="step-num">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="cta">
          <div className="cta-card">
            <svg className="cta-leaves" viewBox="0 0 480 420" aria-hidden="true">
              <path className="leaf-a" d="M-20 420 C 20 220, 170 60, 420 40 C 430 250, 300 400, -20 420 Z" />
              <path className="leaf-b" d="M180 440 C 200 320, 300 230, 500 220 C 500 340, 400 430, 180 440 Z" />
            </svg>
            <div className="cta-inner">
              <span className="cta-rule" aria-hidden="true" />
              <h2>Start by creating your organisation.</h2>
              <p>Already registered? Sign in and pick up where you left off.</p>
              <div className="hero-actions">
                <Link to="/create-organisation" className="btn btn-primary btn-large">
                  Create your organisation
                </Link>
                <Link to="/signin" className="btn btn-outline btn-large">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
