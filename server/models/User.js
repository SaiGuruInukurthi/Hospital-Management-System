const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'nurse'], required: true },
  specialization: { type: String, trim: true },
  department: { type: String, trim: true },
  wardAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' },
  phone: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
