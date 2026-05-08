const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  diagnosis: { type: String, required: true, trim: true },
  prescription: { type: String, trim: true },
  notes: { type: String, trim: true },
  followUpDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
