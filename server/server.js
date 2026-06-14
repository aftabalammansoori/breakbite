// server.js — entry point of our backend

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// MIDDLEWARE (runs on every request before reaching routes)
app.use(cors());              // Allow requests from React frontend
app.use(express.json());      // Parse incoming JSON bodies

// HEALTH CHECK ROUTE — confirms server is alive
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hello from BreakBite backend! 🍱',
    timestamp: new Date().toISOString()
  });
});

// Get port from .env, fallback to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`✅ BreakBite server running on http://localhost:${PORT}`);
});