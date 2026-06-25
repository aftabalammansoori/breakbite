// controllers/bookingController.js — handles booking creation

import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import MenuItem from '../models/MenuItem.js';

// ─── HELPER: generate a friendly token like "BB-A47" ───────
const generateToken = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // skip I, O for clarity
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(Math.random() * 90 + 10); // 10-99
  return `BB-${letter}${number}`;
};

// ─── CREATE A BOOKING ────────────────────────────────────────
// @desc   Student books a slot with items
// @route  POST /api/bookings
// @access Public (would be protected with JWT in production)
export const createBooking = async (req, res) => {
  try {
    const { userId, slotId, items } = req.body;

    // ─── 1. Basic validation ───────────────────────────────
    if (!userId || !slotId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'userId, slotId, and at least one item are required',
      });
    }

    // ─── 2. Fetch all menu items in one DB call (efficient) ──
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },           // get all matching IDs at once
      isAvailable: true,
    });

    if (menuItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        error: 'One or more items are unavailable or invalid',
      });
    }

    // ─── 3. Build items with snapshot prices + calculate total ──
    const bookingItems = items.map((item) => {
      const menuItem = menuItems.find(
        (m) => m._id.toString() === item.menuItemId
      );
      return {
        menuItemId: menuItem._id,
        quantity: item.quantity,
        priceAtBooking: menuItem.price,    // snapshot today's price
      };
    });

    const totalAmount = bookingItems.reduce(
      (sum, item) => sum + item.priceAtBooking * item.quantity,
      0
    );

    // ─── 4. Atomically check capacity AND increment ──────────
    const updatedSlot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        $expr: { $lt: ['$currentBookings', '$maxCapacity'] }, // only if capacity left
      },
      { $inc: { currentBookings: 1 } },                       // atomic +1
      { new: true }                                            // return updated doc
    );

    if (!updatedSlot) {
      return res.status(400).json({
        success: false,
        error: 'Slot is full or does not exist',
      });
    }

    // ─── 5. Generate unique token (retry if collision) ──────
    let token;
    let attempts = 0;
    while (attempts < 5) {
      token = generateToken();
      const exists = await Booking.findOne({ token });
      if (!exists) break;
      attempts++;
    }

    // ─── 6. Save the booking ────────────────────────────────
    const booking = await Booking.create({
      userId,
      slotId,
      items: bookingItems,
      totalAmount,
      token,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── GET BOOKINGS FOR A USER ────────────────────────────────
// @desc   Fetch all bookings for a specific user
// @route  GET /api/bookings/user/:userId
// @access Public (would be protected with JWT)
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('slotId')            // include slot details
      .populate('items.menuItemId')  // include menu item details
      .sort({ createdAt: -1 });      // newest first

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};