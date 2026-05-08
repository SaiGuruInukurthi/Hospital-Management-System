const express = require('express');
const { body } = require('express-validator');
const {
  createRecord,
  getRecordById,
  getRecordsByPatient,
  updateRecord
} = require('../controllers/medicalRecordController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('doctor'),
  [
    body('patient').isMongoId().withMessage('Patient is required'),
    body('diagnosis').notEmpty().withMessage('Diagnosis is required')
  ],
  validate,
  createRecord
);
router.get('/patient/:patientId', authorize('admin', 'doctor', 'nurse'), getRecordsByPatient);
router.get('/:id', authorize('admin', 'doctor'), getRecordById);
router.put('/:id', authorize('doctor'), updateRecord);

module.exports = router;
