const express = require('express');
const { body } = require('express-validator');
const {
  createPatient,
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient
} = require('../controllers/patientController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('admin', 'nurse'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('dateOfBirth').isISO8601().withMessage('Date of birth must be a valid date'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender is invalid'),
    body('phone').notEmpty().withMessage('Phone is required')
  ],
  validate,
  createPatient
);
router.get('/', authorize('admin', 'doctor', 'nurse'), getPatients);
router.get('/:id', authorize('admin', 'doctor', 'nurse'), getPatientById);
router.put('/:id', authorize('admin', 'nurse'), updatePatient);
router.delete('/:id', authorize('admin'), deletePatient);

module.exports = router;
