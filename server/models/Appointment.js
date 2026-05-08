const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateTime: { type: Date, required: true },
  reason: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  notes: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
