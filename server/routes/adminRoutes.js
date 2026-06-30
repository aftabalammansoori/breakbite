// routes/adminRoutes.js — admin-only endpoints (protected)

import express from 'express';
import { getPrepList, getSlotBookings } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply BOTH middlewares to ALL routes in this file
router.use(protect);
router.use(adminOnly);

router.get('/prep-list/:slotId', getPrepList);
router.get('/bookings/:slotId', getSlotBookings);

export default router;