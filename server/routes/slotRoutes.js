// routes/slotRoutes.js — slot-related URL endpoints

import express from 'express';
import { getSlots, seedSlots } from '../controllers/slotController.js';

const router = express.Router();

router.get('/', getSlots);              // GET /api/slots
router.post('/seed', seedSlots);        // POST /api/slots/seed

export default router;