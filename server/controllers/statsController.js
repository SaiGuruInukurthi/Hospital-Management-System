const asyncHandler = require('../utils/asyncHandler');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Ward = require('../models/Ward');

const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

exports.adminStats = asyncHandler(async (req, res) => {
  const { start, end } = todayRange();
  const [patients, staff, appointmentsToday, wards] = await Promise.all([
    Patient.countDocuments(),
    User.countDocuments({ role: { $in: ['doctor', 'nurse'] } }),
    Appointment.countDocuments({ dateTime: { $gte: start, $lt: end } }),
    Ward.find().select('name capacity patients')
  ]);

  const occupiedBeds = wards.reduce((total, ward) => total + ward.patients.length, 0);
  const capacity = wards.reduce((total, ward) => total + ward.capacity, 0);

  res.json({ patients, staff, appointmentsToday, wards: wards.length, occupiedBeds, capacity });
});

exports.doctorStats = asyncHandler(async (req, res) => {
  const { start, end } = todayRange();
  const [appointmentsToday, pendingRecords, patientIds] = await Promise.all([
    Appointment.countDocuments({ doctor: req.user._id, dateTime: { $gte: start, $lt: end } }),
    Appointment.countDocuments({ doctor: req.user._id, status: { $in: ['Scheduled', 'In Progress'] } }),
    Appointment.distinct('patient', { doctor: req.user._id })
  ]);

  res.json({ appointmentsToday, pendingRecords, patientCount: patientIds.length });
});

exports.nurseStats = asyncHandler(async (req, res) => {
  const { start, end } = todayRange();
  const [appointmentsToday, registrations, wards, recordsTouched] = await Promise.all([
    Appointment.countDocuments({ scheduledBy: req.user._id, dateTime: { $gte: start, $lt: end } }),
    Patient.countDocuments({ registeredBy: req.user._id }),
    Ward.find({ nurses: req.user._id }).select('name capacity patients'),
    MedicalRecord.countDocuments({})
  ]);

  res.json({ appointmentsToday, registrations, wards, recordsTouched });
});
