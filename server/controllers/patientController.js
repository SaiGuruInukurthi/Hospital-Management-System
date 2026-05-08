const asyncHandler = require('../utils/asyncHandler');
const Patient = require('../models/Patient');

exports.createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create({
    ...req.body,
    registeredBy: req.user._id
  });

  res.status(201).json({ patient });
});

exports.getPatients = asyncHandler(async (req, res) => {
  const search = req.query.search || '';
  const query = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const patients = await Patient.find(query)
    .populate('registeredBy', 'name role')
    .populate('ward', 'name')
    .sort({ createdAt: -1 });

  res.json({ patients });
});

exports.getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate('registeredBy', 'name role')
    .populate('ward', 'name capacity');

  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  res.json({ patient });
});

exports.updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  res.json({ patient });
});

exports.deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  await patient.deleteOne();
  res.json({ message: 'Patient deleted' });
});
