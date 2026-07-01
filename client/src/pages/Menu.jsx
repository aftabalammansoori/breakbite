import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Menu() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem('breakbite_user') || 'null')

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/menu')
      .then((response) => {
        setMenu(response.data.data)
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load menu')
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('breakbite_user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-breakbite-dark text-breakbite-cream">
      {/* HEADER */}
      <div className="border-b border-breakbite-accent/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-breakbite-accent">
            BreakBite 🍱
          </h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-breakbite-accent hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-breakbite-accent hover:underline"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* MENU */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Today's Menu</h2>

        {loading && (
          <p className="text-center text-breakbite-cream/60">Loading menu...</p>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-4 text-breakbite-accent">
                🍛 Lunch
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu
                  .filter((item) => item.category === 'lunch')
                  .map((item) => (
                    <div
                      key={item._id}
                      className="border border-breakbite-accent/30 rounded-lg p-4 hover:border-breakbite-accent transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold">{item.name}</h4>
                        <span className="text-breakbite-accent font-bold text-lg">
                          ₹{item.price}
                        </span>
                      </div>
                      <span className="bg-breakbite-cream/10 px-2 py-1 rounded text-xs">
                        {item.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-breakbite-accent">
                ☕ Tea Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu
                  .filter((item) => item.category === 'tea')
                  .map((item) => (
                    <div
                      key={item._id}
                      className="border border-breakbite-accent/30 rounded-lg p-4 hover:border-breakbite-accent transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold">{item.name}</h4>
                        <span className="text-breakbite-accent font-bold text-lg">
                          ₹{item.price}
                        </span>
                      </div>
                      <span className="bg-breakbite-cream/10 px-2 py-1 rounded text-xs">
                        {item.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Menu