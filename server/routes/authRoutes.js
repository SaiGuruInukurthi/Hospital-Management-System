const express = require('express');
const { body } = require('express-validator');
const { login, getMe, updateMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
