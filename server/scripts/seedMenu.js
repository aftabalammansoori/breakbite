// scripts/seedMenu.js — populates the menu with locked v1 items
// Run with: npm run seed:menu

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';

dotenv.config();

const menuData = [
  // LUNCH — Thalis
  { name: 'Veg Thali',       price: 50, category: 'lunch', type: 'thali' },
  { name: 'Special Thali',   price: 70, category: 'lunch', type: 'thali' },

  // TEA — Snacks
  { name: 'Samosa',          price: 15, category: 'tea', type: 'snack' },
  { name: 'Kachori',         price: 20, category: 'tea', type: 'snack' },
  { name: 'Chips (Small)',   price: 10, category: 'tea', type: 'snack' },
  { name: 'Chips (Large)',   price: 30, category: 'tea', type: 'snack' },
  { name: 'Biscuits (Small)',price: 10, category: 'tea', type: 'snack' },
  { name: 'Biscuits (Large)',price: 30, category: 'tea', type: 'snack' },

  // TEA — Beverages
  { name: 'Tea',             price: 15, category: 'tea', type: 'beverage' },
  { name: 'Coffee',          price: 20, category: 'tea', type: 'beverage' },
  { name: 'Cold Coffee',     price: 25, category: 'tea', type: 'beverage' },
];

const seedMenu = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    console.log('🗑️  Clearing existing menu items...');
    await MenuItem.deleteMany({});
    console.log('✅ Cleared');

    console.log(`🌱 Seeding ${menuData.length} menu items...`);
    const inserted = await MenuItem.insertMany(menuData);
    console.log(`✅ Inserted ${inserted.length} items:\n`);

    // Pretty print
    inserted.forEach((item) => {
      const icon = item.category === 'lunch' ? '🍛' : (item.type === 'beverage' ? '☕' : '🥟');
      console.log(`   ${icon}  ${item.name.padEnd(20)} ₹${item.price}`);
    });

    console.log('\n🎉 Menu seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedMenu();