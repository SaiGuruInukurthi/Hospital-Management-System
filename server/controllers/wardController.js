const asyncHandler = require('../utils/asyncHandler');
const Ward = require('../models/Ward');
const Patient = require('../models/Patient');
const User = require('../models/User');

exports.createWard = asyncHandler(async (req, res) => {
  const ward = await Ward.create(req.body);
  res.status(201).json({ ward });
});

exports.getWards = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'nurse' ? { nurses: req.user._id } : {};
  const wards = await Ward.find(filter)
    .populate('nurses', 'name email phone')
    .populate('patients', 'name gender phone')
    .sort({ name: 1 });

  res.json({ wards });
});

exports.getWardById = asyncHandler(async (req, res) => {
  const ward = await Ward.findById(req.params.id)
    .populate('nurses', 'name email phone')
    .populate('patients', 'name gender phone');

  if (!ward) {
    return res.status(404).json({ message: 'Ward not found' });
  }

  if (req.user.role === 'nurse' && !ward.nurses.some((nurse) => String(nurse._id) === String(req.user._id))) {
    return res.status(403).json({ message: 'Access denied: ward not assigned' });
  }

  res.json({ ward });
});

exports.assignNurse = asyncHandler(async (req, res) => {
  const { nurseId } = req.body;
  const ward = await Ward.findById(req.params.id);
  const nurse = await User.findOne({ _id: nurseId, role: 'nurse' });

  if (!ward || !nurse) {
    return res.status(404).json({ message: 'Ward or nurse not found' });
  }

  if (!ward.nurses.some((id) => String(id) === String(nurse._id))) {
    ward.nurses.push(nurse._id);
  }

  nurse.wardAssigned = ward._id;
  await Promise.all([ward.save(), nurse.save()]);

  const updated = await Ward.findById(ward._id).populate('nurses', 'name email phone');
  res.json({ ward: updated });
});

exports.admitPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.body;
  const ward = await Ward.findById(req.params.id);
  const patient = await Patient.findById(patientId);

  if (!ward || !patient) {
    return res.status(404).json({ message: 'Ward or patient not found' });
  }

  if (ward.patients.length >= ward.capacity && !ward.patients.some((id) => String(id) === String(patient._id))) {
    return res.status(400).json({ message: 'Ward is at capacity' });
  }

  if (!ward.patients.some((id) => String(id) === String(patient._id))) {
    ward.patients.push(patient._id);
  }

  patient.isAdmitted = true;
  patient.ward = ward._id;
  await Promise.all([ward.save(), patient.save()]);

  const updated = await Ward.findById(ward._id).populate('patients', 'name gender phone');
  res.json({ ward: updated });
});
