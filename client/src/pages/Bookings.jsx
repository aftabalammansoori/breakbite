import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

function Bookings() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('breakbite_user') || 'null')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  // Data fetched from backend
  const [slots, setSlots] = useState([])
  const [menu, setMenu] = useState([])

  // User's selections
  const [selectedSession, setSelectedSession] = useState('lunch')
  const [selectedSlotId, setSelectedSlotId] = useState(null)
  const [cart, setCart] = useState({}) // { menuItemId: quantity }

  // UI states
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  // ─── Fetch slots + menu on mount ─────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotsRes, menuRes] = await Promise.all([
          axios.get('http://localhost:5000/api/slots'),
          axios.get('http://localhost:5000/api/menu'),
        ])
        setSlots(slotsRes.data.data)
        setMenu(menuRes.data.data)
      } catch (err) {
        setError('Failed to load slots or menu')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ─── Cart helpers ────────────────────────────────────
  const updateQty = (menuItemId, delta) => {
    setCart((prev) => {
      const current = prev[menuItemId] || 0
      const next = Math.max(0, current + delta)
      const updated = { ...prev }
      if (next === 0) delete updated[menuItemId]
      else updated[menuItemId] = next
      return updated
    })
  }

  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find((m) => m._id === id)
    return sum + (item ? item.price * qty : 0)
  }, 0)

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0)

  // ─── Submit booking ──────────────────────────────────
  const handleConfirm = async () => {
    setError('')
    setSubmitting(true)

    try {
      const items = Object.entries(cart).map(([menuItemId, quantity]) => ({
        menuItemId,
        quantity,
      }))

      const res = await axios.post('http://localhost:5000/api/bookings', {
        userId: user._id,
        slotId: selectedSlotId,
        items,
      })

      setConfirmedBooking(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  // Filter slots by session
  const sessionSlots = slots.filter((s) => s.session === selectedSession)

  // Filter menu by session type (lunch = thali, tea sessions = snack/beverage)
  const sessionMenu =
    selectedSession === 'lunch'
      ? menu.filter((m) => m.category === 'lunch')
      : menu.filter((m) => m.category === 'tea')

  // ─── CONFIRMATION SCREEN ─────────────────────────────
  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-breakbite-dark text-breakbite-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            className="text-7xl mb-6"
          >
            ✅
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-2"
          >
            Booking Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-breakbite-cream/70 mb-8"
          >
            Show this token at the canteen counter
          </motion.p>

          {/* THE TOKEN REVEAL — hero moment */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
            className="border-2 border-breakbite-accent rounded-lg p-8 mb-6 bg-breakbite-accent/5"
          >
            <p className="text-sm text-breakbite-cream/60 mb-2">Your Token</p>
            <p className="text-6xl font-bold text-breakbite-accent tracking-widest">
              {confirmedBooking.token}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-breakbite-cream/70 mb-6"
          >
            <p>Total: <span className="font-bold text-breakbite-cream">₹{confirmedBooking.totalAmount}</span></p>
            <p className="text-sm mt-1">Pay at the counter when you collect</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/menu')}
              className="px-6 py-2 border border-breakbite-accent text-breakbite-accent rounded font-medium hover:bg-breakbite-accent/10 transition-colors"
            >
              Back to Menu
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setConfirmedBooking(null)
                setCart({})
                setSelectedSlotId(null)
              }}
              className="px-6 py-2 bg-breakbite-accent text-breakbite-dark rounded font-bold hover:bg-breakbite-accent/90 transition-colors"
            >
              Book Another
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // ─── BOOKING FLOW SCREEN ─────────────────────────────
  return (
    <div className="min-h-screen bg-breakbite-dark text-breakbite-cream">
      {/* Sticky navbar */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-breakbite-dark/80 border-b border-breakbite-accent/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/menu')}
            className="text-2xl font-bold text-breakbite-accent"
          >
            BreakBite 🍱
          </button>
          <span className="text-sm hidden sm:inline">Hi, {user?.name}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-2 text-center"
        >
          Book a Slot
        </motion.h2>
        <p className="text-center text-breakbite-cream/60 mb-8">
          3 steps: session → slot → items
        </p>

        {loading && (
          <p className="text-center text-breakbite-cream/60">Loading…</p>
        )}

        {!loading && (
          <>
            {/* STEP 1: SESSION PICKER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h3 className="text-lg font-bold mb-3">1. Pick a session</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'tea_morning', label: '☕ Tea', time: '11 AM' },
                  { key: 'lunch',       label: '🍛 Lunch', time: '1 PM' },
                  { key: 'tea_evening', label: '☕ Tea', time: '4 PM' },
                ].map((s) => (
                  <motion.button
                    key={s.key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedSession(s.key)
                      setSelectedSlotId(null)
                      setCart({})
                    }}
                    className={`p-4 rounded-lg border transition-colors ${
                      selectedSession === s.key
                        ? 'border-breakbite-accent bg-breakbite-accent/10'
                        : 'border-breakbite-cream/20 hover:border-breakbite-accent/50'
                    }`}
                  >
                    <div className="text-xl mb-1">{s.label}</div>
                    <div className="text-xs text-breakbite-cream/60">{s.time}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* STEP 2: SLOT PICKER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-lg font-bold mb-3">2. Pick a time slot</h3>
              {sessionSlots.length === 0 ? (
                <p className="text-sm text-breakbite-cream/60">
                  No slots seeded for this session yet. Run seed script or use Postman to seed.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sessionSlots.map((slot) => {
                    const available = slot.maxCapacity - slot.currentBookings
                    const isFull = available <= 0
                    return (
                      <motion.button
                        key={slot._id}
                        whileHover={!isFull ? { scale: 1.03 } : {}}
                        whileTap={!isFull ? { scale: 0.97 } : {}}
                        onClick={() => !isFull && setSelectedSlotId(slot._id)}
                        disabled={isFull}
                        className={`p-4 rounded-lg border text-left transition-colors ${
                          selectedSlotId === slot._id
                            ? 'border-breakbite-accent bg-breakbite-accent/10'
                            : isFull
                            ? 'border-breakbite-cream/10 opacity-50 cursor-not-allowed'
                            : 'border-breakbite-cream/20 hover:border-breakbite-accent/50'
                        }`}
                      >
                        <div className="font-bold">{slot.time}</div>
                        <div className="text-xs text-breakbite-cream/60 mt-1">
                          {isFull ? 'FULL ❌' : `${available}/${slot.maxCapacity} left`}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </motion.div>

            {/* STEP 3: MENU ITEMS */}
            <AnimatePresence>
              {selectedSlotId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-24"
                >
                  <h3 className="text-lg font-bold mb-3">3. Choose items</h3>
                  <div className="space-y-2">
                    {sessionMenu.map((item) => {
                      const qty = cart[item._id] || 0
                      return (
                        <div
                          key={item._id}
                          className="flex items-center justify-between border border-breakbite-cream/10 rounded-lg p-3"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-breakbite-accent">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQty(item._id, -1)}
                              disabled={qty === 0}
                              className="w-8 h-8 rounded border border-breakbite-cream/20 disabled:opacity-30"
                            >
                              −
                            </motion.button>
                            <span className="w-8 text-center font-bold">{qty}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQty(item._id, 1)}
                              className="w-8 h-8 rounded border border-breakbite-cream/20 hover:border-breakbite-accent"
                            >
                              +
                            </motion.button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* STICKY BOTTOM CART BAR */}
      <AnimatePresence>
        {totalItems > 0 && selectedSlotId && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-breakbite-dark/90 border-t border-breakbite-accent/30 p-4"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-breakbite-cream/60">
                  {totalItems} item{totalItems > 1 ? 's' : ''}
                </p>
                <p className="text-2xl font-bold text-breakbite-accent">
                  ₹{totalAmount}
                </p>
              </div>
              {error && (
                <p className="text-sm text-red-400 mr-4">{error}</p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                disabled={submitting}
                className="px-6 py-3 bg-breakbite-accent text-breakbite-dark font-bold rounded hover:bg-breakbite-accent/90 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Booking…' : 'Confirm Booking'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Bookings