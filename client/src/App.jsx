import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // STATE: holds the menu items fetched from backend (starts empty)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // EFFECT: fetch menu when page first loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then((response) => {
        console.log('Menu received:', response.data)
        setMenu(response.data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching menu:', err)
        setError('Failed to load menu')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-breakbite-dark text-breakbite-cream">
      {/* HEADER */}
      <div className="text-center py-12">
        <h1 className="text-6xl font-bold text-breakbite-accent mb-2">
          BreakBite 🍱
        </h1>
        <p className="text-xl">Skip the queue. Pre-book your slot.</p>
      </div>

      {/* MENU SECTION */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Today's Menu
        </h2>

        {/* LOADING STATE */}
        {loading && (
          <p className="text-center text-breakbite-cream/60">
            Loading menu...
          </p>
        )}

        {/* ERROR STATE */}
        {error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* MENU ITEMS — split into Lunch & Tea sections */}
        {!loading && !error && (
          <>
            {/* LUNCH SECTION */}
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
                      <div className="flex gap-2 text-xs">
                        <span className="bg-breakbite-cream/10 px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* TEA SECTION */}
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
                      <div className="flex gap-2 text-xs">
                        <span className="bg-breakbite-cream/10 px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </div>
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

export default App