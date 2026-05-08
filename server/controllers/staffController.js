const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

exports.createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role, specialization, department, phone, wardAssigned } = req.body;

  if (!['doctor', 'nurse'].includes(role)) {
    return res.status(400).json({ message: 'Staff role must be doctor or nurse' });
  }

  const existing = await User.findOne({ email: String(email || '').toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    specialization,
    department,
    phone,
    wardAssigned: role === 'nurse' ? wardAssigned : undefined
  });

  const staff = await User.findById(user._id).select('-password').populate('wardAssigned');
  res.status(201).json({ staff });
});

exports.getStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: { $in: ['doctor', 'nurse'] } })
    .select('-password')
    .populate('wardAssigned')
    .sort({ createdAt: -1 });

  res.json({ staff });
});

exports.getDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor', isActive: true })
    .select('-password')
    .sort({ name: 1 });

  res.json({ doctors });
});

exports.getStaffById = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id).select('-password').populate('wardAssigned');
  if (!staff || !['doctor', 'nurse'].includes(staff.role)) {
    return res.status(404).json({ message: 'Staff member not found' });
  }

  res.json({ staff });
});

exports.toggleStaffStatus = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);
  if (!staff || !['doctor', 'nurse'].includes(staff.role)) {
    return res.status(404).json({ message: 'Staff member not found' });
  }

  staff.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : !staff.isActive;
  await staff.save();

  const updated = await User.findById(staff._id).select('-password').populate('wardAssigned');
  res.json({ staff: updated });
});

exports.deleteStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);
  if (!staff || !['doctor', 'nurse'].includes(staff.role)) {
    return res.status(404).json({ message: 'Staff member not found' });
  }

  await staff.deleteOne();
  res.json({ message: 'Staff member deleted' });
});
