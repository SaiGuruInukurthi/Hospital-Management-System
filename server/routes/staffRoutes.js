const express = require('express');
const { body } = require('express-validator');
const {
  createStaff,
  deleteStaff,
  getDoctors,
  getStaff,
  getStaffById,
  toggleStaffStatus
} = require('../controllers/staffController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.get('/doctors', authorize('admin', 'nurse'), getDoctors);
router.post(
  '/',
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['doctor', 'nurse']).withMessage('Role must be doctor or nurse')
  ],
  validate,
  createStaff
);
router.get('/', authorize('admin'), getStaff);
router.get('/:id', authorize('admin'), getStaffById);
router.put('/:id/status', authorize('admin'), toggleStaffStatus);
router.delete('/:id', authorize('admin'), deleteStaff);

module.exports = router;
