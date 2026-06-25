// controllers/slotController.js — handles slot-related logic

import Slot from '../models/Slot.js';

// ─── GET ALL SLOTS ────────────────────────────────────────
// @desc   Get all slots (optionally filter by date)
// @route  GET /api/slots
// @access Public
export const getSlots = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;

    const slots = await Slot.find(filter).sort({ time: 1 });
    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── SEED SLOTS FOR A DATE ────────────────────────────────
// @desc   Create today's standard slots (helper for testing)
// @route  POST /api/slots/seed
// @access Public (would be Admin in production)
export const seedSlots = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required (e.g., "2026-06-25")',
      });
    }

    // BreakBite's standard slots: 2 per session, 3 sessions
    const standardSlots = [
      { session: 'tea_morning', time: '11:00' },
      { session: 'tea_morning', time: '11:15' },
      { session: 'lunch',       time: '13:00' },
      { session: 'lunch',       time: '13:30' },
      { session: 'tea_evening', time: '16:00' },
      { session: 'tea_evening', time: '16:15' },
    ];

    // Build slot documents
    const slotsToCreate = standardSlots.map((slot) => ({
      ...slot,
      date,
      maxCapacity: 30,
      currentBookings: 0,
    }));

    // insertMany with ordered:false continues even if some duplicates fail
    const created = await Slot.insertMany(slotsToCreate, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Created ${created.length} slots for ${date}`,
      data: created,
    });
  } catch (error) {
    // Duplicate key errors are OK (slot already exists for that date)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Slots for this date already exist',
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};