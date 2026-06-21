import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import MenuItem from './models/MenuItem.js';  
import authRoutes from './routes/authRoutes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hello from BreakBite backend! 🍱',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.use('/api/auth', authRoutes);


// ─── MENU ITEMS API (test) ─────────────────────────────────

// POST /api/menu — add a new menu item
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

// GET /api/menu — fetch all menu items
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