const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required in server/.env before seeding.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const email = 'admin@hospital.com';
  const existing = await User.findOne({ email });

  if (!existing) {
    const hashed = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'Super Admin',
      email,
      password: hashed,
      role: 'admin'
    });
  }

  console.log('Admin ready: admin@hospital.com / Admin@123');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
