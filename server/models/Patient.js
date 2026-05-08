const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAdmitted: { type: Boolean, default: false },
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
