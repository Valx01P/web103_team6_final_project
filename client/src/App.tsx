import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import StoreProvider from './store/StoreProvider'
import SessionInitializer from './auth/SessionInitializer'
import Protected from './auth/Protected'
import GithubSuccess from './pages/GithubSuccess'
import GithubError from './pages/GithubError'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <StoreProvider>
      <SessionInitializer />
        <main className='font-serif text-white bg-zinc-800 min-h-screen flex flex-col'>
            <Router>
              <Nav />
              <div className='flex-1 flex flex-col'>
                <Routes>

                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/github/success" element={<GithubSuccess />} />
                  <Route path="/auth/github/error" element={<GithubError />} />


                  {/* Protected Routes */}
                  <Route element={<Protected />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Route>

                </Routes>
              </div>
            </Router>
        </main>
      </StoreProvider>
  )
}

export default App
