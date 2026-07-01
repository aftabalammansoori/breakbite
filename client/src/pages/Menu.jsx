import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

// Skeleton loader for menu cards
function MenuCardSkeleton() {
  return (
    <div className="border border-breakbite-cream/10 rounded-lg p-4 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-breakbite-cream/10 rounded w-32"></div>
        <div className="h-6 bg-breakbite-cream/10 rounded w-12"></div>
      </div>
      <div className="h-4 bg-breakbite-cream/10 rounded w-16"></div>
    </div>
  )
}

function Menu() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('breakbite_user') || 'null')

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/menu')
      .then((response) => {
        setMenu(response.data.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load menu')
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('breakbite_user')
    navigate('/login')
  }

  // Animation variants for staggered menu cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="min-h-screen bg-breakbite-dark text-breakbite-cream">
      {/* STICKY HEADER with backdrop blur */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 backdrop-blur-md bg-breakbite-dark/80 border-b border-breakbite-accent/20"
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-breakbite-accent">
            BreakBite 🍱
          </h1>
          {user ? (
  <div className="flex items-center gap-3">
    <span className="text-sm hidden sm:inline">Hi, {user.name}</span>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/book')}
      className="text-sm bg-breakbite-accent text-breakbite-dark px-4 py-2 rounded font-bold hover:bg-breakbite-accent/90"
    >
      Book a Slot
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="text-sm text-breakbite-accent hover:underline"
    >
      Logout
    </motion.button>
  </div>
) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="text-sm text-breakbite-accent hover:underline"
            >
              Login
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* MENU */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-center"
        >
          Today's Menu
        </motion.h2>

        {/* SKELETON LOADER while fetching */}
        {loading && (
          <div className="space-y-10">
            <div>
              <div className="h-8 bg-breakbite-cream/10 rounded w-32 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MenuCardSkeleton />
                <MenuCardSkeleton />
              </div>
            </div>
            <div>
              <div className="h-8 bg-breakbite-cream/10 rounded w-32 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MenuCardSkeleton />
                <MenuCardSkeleton />
              </div>
            </div>
          </div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-400"
          >
            {error}
          </motion.p>
        )}

        {!loading && !error && (
          <>
            {/* LUNCH */}
            <div className="mb-10">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-bold mb-4 text-breakbite-accent"
              >
                🍛 Lunch
              </motion.h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {menu
                  .filter((item) => item.category === 'lunch')
                  .map((item) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="border border-breakbite-accent/30 rounded-lg p-4 hover:border-breakbite-accent transition-colors cursor-pointer"
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
                    </motion.div>
                  ))}
              </motion.div>
            </div>

            {/* TEA */}
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-2xl font-bold mb-4 text-breakbite-accent"
              >
                ☕ Tea Time
              </motion.h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {menu
                  .filter((item) => item.category === 'tea')
                  .map((item) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="border border-breakbite-accent/30 rounded-lg p-4 hover:border-breakbite-accent transition-colors cursor-pointer"
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
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Menu