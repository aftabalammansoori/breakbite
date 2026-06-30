import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import MenuItem from './models/MenuItem.js';
import authRoutes from './routes/authRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// ─── HEALTH CHECK ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hello from BreakBite backend! 🍱',
    timestamp: new Date().toISOString()
  });
});

// ─── ROUTES ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
// ─── MENU ITEMS API ────────────────────────────────────────
app.post('/api/menu', async (req, res) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ BreakBite server running on http://localhost:${PORT}`);
  });
});