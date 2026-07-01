import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      })
      // Save user + token in localStorage so user stays logged in
      localStorage.setItem('breakbite_user', JSON.stringify(res.data.data))
      navigate('/menu')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-breakbite-dark text-breakbite-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-breakbite-accent mb-2">
            BreakBite 🍱
          </h1>
          <p className="text-breakbite-cream/70">Welcome back!</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-breakbite-accent/30 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>

          {error && (
            <p className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded text-sm">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-breakbite-dark border border-breakbite-cream/20 rounded px-3 py-2 focus:outline-none focus:border-breakbite-accent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-breakbite-dark border border-breakbite-cream/20 rounded px-3 py-2 focus:outline-none focus:border-breakbite-accent"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-breakbite-accent text-breakbite-dark font-bold py-2 rounded hover:bg-breakbite-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-breakbite-cream/60">
            Don't have an account?{' '}
            <Link to="/signup" className="text-breakbite-accent hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login