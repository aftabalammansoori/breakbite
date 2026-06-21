// models/MenuItem.js — schema for canteen menu items

import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ['lunch', 'tea'],
        message: 'Category must be either lunch or tea',
      },
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ['thali', 'snack', 'beverage'],
        message: 'Type must be thali, snack, or beverage',
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;