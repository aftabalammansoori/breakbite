import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

function Signup() {
  const [name, setName] = useState('')
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
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        role: 'student',
      })
      localStorage.setItem('breakbite_user', JSON.stringify(res.data.data))
      navigate('/menu')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-breakbite-dark text-breakbite-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-breakbite-accent mb-2">
            BreakBite 🍱
          </h1>
          <p className="text-breakbite-cream/70">Skip the queue.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="border border-breakbite-accent/30 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded text-sm"
            >
              {error}
            </motion.p>
          )}

          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full bg-breakbite-dark border border-breakbite-cream/20 rounded px-3 py-2 focus:outline-none focus:border-breakbite-accent transition-colors"
              placeholder="Aftab Mansoori"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-breakbite-dark border border-breakbite-cream/20 rounded px-3 py-2 focus:outline-none focus:border-breakbite-accent transition-colors"
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
              className="w-full bg-breakbite-dark border border-breakbite-cream/20 rounded px-3 py-2 focus:outline-none focus:border-breakbite-accent transition-colors"
              placeholder="Min 6 characters"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-breakbite-accent text-breakbite-dark font-bold py-2 rounded hover:bg-breakbite-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>

          <p className="text-center text-sm text-breakbite-cream/60">
            Already have an account?{' '}
            <Link to="/login" className="text-breakbite-accent hover:underline">
              Login
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default Signup