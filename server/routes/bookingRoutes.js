// routes/bookingRoutes.js — booking endpoints

import express from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);                  // POST /api/bookings
router.get('/user/:userId', getUserBookings);     // GET /api/bookings/user/:userId

export default router;