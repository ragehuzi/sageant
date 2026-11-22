// In dev, VITE_API_URL is empty and Vite proxies /api to the API (see vite.config.js).
// In production it is the full Azure API address (see .env.production).
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const ORG = `${BASE}/api/sageant/organisation`
const SESSION_KEY = 'sageant.session'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// Turn whatever the API sent back into one readable sentence.
function messageFrom(data, status) {
  if (data?.message) return data.message
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0]
    if (first) return first
  }
  if (status === 401) return 'Invalid email or password.'
  if (status === 502 || status === 503 || status === 504) return "Can't reach the server. Make sure the API is running and try again."
  if (status >= 500) return 'Something went wrong on our side. Please try again in a moment.'
  return 'Something went wrong. Please check your details and try again.'
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${ORG}${path}`, options)
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0)
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      /* not JSON, ignore */
    }
  }

  if (!res.ok) {
    if (res.status === 404 && !data) {
      throw new ApiError('The server is not ready for this yet. Please try again later.', 404)
    }
    throw new ApiError(messageFrom(data, res.status), res.status)
  }
  return data
}

// ---------- Session (token kept in this browser only) ----------
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (!session?.token || new Date(session.expiresAt) <= new Date()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* storage blocked: the user just has to sign in again next time */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

// ---------- Calls ----------
export async function login(email, password) {
  const data = await request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  saveSession(data)
  return data
}

// fields: { email, password, name, website?, logo? (File) }
export function signup({ email, password, name, website, logo }) {
  const form = new FormData()
  form.append('email', email)
  form.append('password', password)
  form.append('name', name)
  if (website) form.append('website', website)
  if (logo) form.append('logo', logo)
  return request('/signup', { method: 'POST', body: form })
}

export function me(token) {
  return request('/me', { headers: { Authorization: `Bearer ${token}` } })
}
