const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  specialization: user.specialization,
  department: user.department,
  phone: user.phone,
  wardAssigned: user.wardAssigned,
  isActive: user.isActive
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });

  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials or account inactive' });
  }

  const isMatch = await bcrypt.compare(password || '', user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    token: generateToken(user),
    user: toPublicUser(user)
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wardAssigned');
  res.json({ user: toPublicUser(user) });
});

exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'specialization', 'department'];
  const updates = {};

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  res.json({ user: toPublicUser(user) });
});
