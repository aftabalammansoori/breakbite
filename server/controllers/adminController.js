// controllers/adminController.js — handles admin dashboard queries

import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import mongoose from 'mongoose';

// ─── GET PREP LIST FOR A SLOT ────────────────────────────────
// @desc   Aggregate booking items grouped by menu item
// @route  GET /api/admin/prep-list/:slotId
// @access Admin only
export const getPrepList = async (req, res) => {
  try {
    const { slotId } = req.params;

    // Validate it's a real Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(slotId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid slot ID',
      });
    }

    // ─── THE AGGREGATION PIPELINE (the magic) ────────────────
    const prepList = await Booking.aggregate([
      // STAGE 1: filter to only this slot's non-cancelled bookings
      {
        $match: {
          slotId: new mongoose.Types.ObjectId(slotId),
          status: { $ne: 'cancelled' },
        },
      },
      // STAGE 2: explode items array — each item becomes its own doc
      {
        $unwind: '$items',
      },
      // STAGE 3: group by menuItemId and sum quantities
      {
        $group: {
          _id: '$items.menuItemId',
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
      // STAGE 4: join with menuitems collection to get names + prices
      {
        $lookup: {
          from: 'menuitems',          // collection name (lowercase + 's')
          localField: '_id',
          foreignField: '_id',
          as: 'menuItem',
        },
      },
      // STAGE 5: $lookup returns array, unwind to get single object
      {
        $unwind: '$menuItem',
      },
      // STAGE 6: reshape the output to be cleaner
      {
        $project: {
          _id: 0,
          menuItemId: '$_id',
          name: '$menuItem.name',
          category: '$menuItem.category',
          totalQuantity: 1,
          unitPrice: '$menuItem.price',
        },
      },
      // STAGE 7: sort by category, then name
      {
        $sort: { category: 1, name: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      slotId,
      count: prepList.length,
      data: prepList,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── GET ALL BOOKINGS FOR A SLOT ────────────────────────────
// @desc   Admin sees individual bookings (not aggregated)
// @route  GET /api/admin/bookings/:slotId
// @access Admin only
export const getSlotBookings = async (req, res) => {
  try {
    const { slotId } = req.params;

    const bookings = await Booking.find({ slotId })
      .populate('userId', 'name email')           // only safe fields
      .populate('items.menuItemId', 'name price')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};