const asyncHandler = require('../utils/asyncHandler');
const MedicalRecord = require('../models/MedicalRecord');

exports.createRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.create({
    ...req.body,
    doctor: req.user._id
  });

  const saved = await MedicalRecord.findById(record._id)
    .populate('patient', 'name')
    .populate('doctor', 'name specialization')
    .populate('appointment');

  res.status(201).json({ record: saved });
});

exports.getRecordsByPatient = asyncHandler(async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.params.patientId })
    .populate('doctor', 'name specialization')
    .populate('appointment', 'dateTime status reason')
    .sort({ createdAt: -1 });

  if (req.user.role === 'nurse') {
    const limited = records.map((record) => ({
      id: record._id,
      diagnosis: record.diagnosis,
      followUpDate: record.followUpDate,
      doctor: record.doctor,
      createdAt: record.createdAt
    }));
    return res.json({ records: limited });
  }

  res.json({ records });
});

exports.getRecordById = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id)
    .populate('patient', 'name')
    .populate('doctor', 'name specialization')
    .populate('appointment');

  if (!record) {
    return res.status(404).json({ message: 'Medical record not found' });
  }

  res.json({ record });
});

exports.updateRecord = asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);
  if (!record) {
    return res.status(404).json({ message: 'Medical record not found' });
  }

  if (String(record.doctor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the authoring doctor can update this record' });
  }

  ['diagnosis', 'prescription', 'notes', 'followUpDate', 'appointment'].forEach((field) => {
    if (req.body[field] !== undefined) record[field] = req.body[field];
  });

  await record.save();
  res.json({ record });
});
