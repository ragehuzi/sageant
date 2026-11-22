import { useRoute } from './nav.jsx'
import Landing from './Landing.jsx'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Dashboard from './Dashboard.jsx'
import './mobile.css'

function App() {
  const path = useRoute()

  if (path === '/signin') return <SignIn />
  if (path === '/create-organisation') return <SignUp />
  if (path === '/dashboard') return <Dashboard />
  return <Landing />
}

export default App
