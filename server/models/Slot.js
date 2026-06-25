// models/Slot.js — time slots students can book

import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: String,                              // "2026-06-25"
      required: [true, 'Date is required'],
    },
    session: {
      type: String,
      required: true,
      enum: {
        values: ['lunch', 'tea_morning', 'tea_evening'],
        message: 'Session must be lunch, tea_morning, or tea_evening',
      },
    },
    time: {
      type: String,                              // "13:00"
      required: [true, 'Time is required'],
    },
    maxCapacity: {
      type: Number,
      default: 30,                               // 30 students per slot
      min: [1, 'Capacity must be at least 1'],
    },
    currentBookings: {
      type: Number,
      default: 0,
      min: [0, 'Current bookings cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: prevents duplicate slots (same date+session+time)
slotSchema.index({ date: 1, session: 1, time: 1 }, { unique: true });

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;