const asyncHandler = require('../utils/asyncHandler');
const Appointment = require('../models/Appointment');

const populateAppointment = (query) => query
  .populate('patient', 'name phone gender')
  .populate('doctor', 'name specialization department')
  .populate('scheduledBy', 'name role');

exports.createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create({
    ...req.body,
    scheduledBy: req.user._id
  });

  const saved = await populateAppointment(Appointment.findById(appointment._id));
  res.status(201).json({ appointment: saved });
});

exports.getAppointments = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.doctor) filter.doctor = req.query.doctor;
  if (req.query.date) {
    const start = new Date(req.query.date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.dateTime = { $gte: start, $lt: end };
  }

  const appointments = await populateAppointment(
    Appointment.find(filter).sort({ dateTime: 1 })
  );

  res.json({ appointments });
});

exports.getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await populateAppointment(
    Appointment.find({ doctor: req.user._id }).sort({ dateTime: 1 })
  );

  res.json({ appointments });
});

exports.getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await populateAppointment(Appointment.findById(req.params.id));
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  if (req.user.role === 'doctor' && String(appointment.doctor._id) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Access denied: this is not your appointment' });
  }

  res.json({ appointment });
});

exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  if (req.user.role === 'doctor' && String(appointment.doctor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Access denied: this is not your appointment' });
  }

  appointment.status = req.body.status;
  if (req.body.notes !== undefined) appointment.notes = req.body.notes;
  await appointment.save();

  const updated = await populateAppointment(Appointment.findById(appointment._id));
  res.json({ appointment: updated });
});

exports.deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  await appointment.deleteOne();
  res.json({ message: 'Appointment deleted' });
});
