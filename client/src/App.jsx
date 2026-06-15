import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // STATE: holds the message from backend (starts as "Loading...")
  const [backendMessage, setBackendMessage] = useState('Loading...')

  // EFFECT: runs once when the page first loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/health')
      .then((response) => {
        console.log('Backend response:', response.data)
        setBackendMessage(response.data.message)
      })
      .catch((error) => {
        console.error('Error fetching from backend:', error)
        setBackendMessage('⚠️ Backend not reachable')
      })
  }, []) // empty array = run once on mount

  return (
    <div className="min-h-screen flex items-center justify-center bg-breakbite-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-breakbite-accent mb-4">
          BreakBite 🍱
        </h1>
        <p className="text-xl text-breakbite-cream mb-8">
          Skip the queue. Pre-book your slot.
        </p>

        {/* Backend connection status box */}
        <div className="mt-12 p-6 border border-breakbite-accent rounded-lg max-w-md mx-auto">
          <p className="text-sm text-breakbite-cream/60 mb-2">
            Backend says:
          </p>
          <p className="text-lg text-breakbite-cream font-medium">
            {backendMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App