const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 1 },
  nurses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  description: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Ward', WardSchema);
