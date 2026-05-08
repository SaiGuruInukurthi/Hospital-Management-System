const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  getMyAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('admin', 'nurse'),
  [
    body('patient').isMongoId().withMessage('Patient is required'),
    body('doctor').isMongoId().withMessage('Doctor is required'),
    body('dateTime').isISO8601().withMessage('Appointment date/time is invalid'),
    body('reason').notEmpty().withMessage('Reason is required')
  ],
  validate,
  createAppointment
);
router.get('/', authorize('admin', 'nurse'), getAppointments);
router.get('/my', authorize('doctor'), getMyAppointments);
router.get('/:id', authorize('admin', 'doctor', 'nurse'), getAppointmentById);
router.put(
  '/:id/status',
  authorize('admin', 'doctor', 'nurse'),
  body('status').isIn(['Scheduled', 'In Progress', 'Completed', 'Cancelled']).withMessage('Status is invalid'),
  validate,
  updateAppointmentStatus
);
router.delete('/:id', authorize('admin'), deleteAppointment);

module.exports = router;
