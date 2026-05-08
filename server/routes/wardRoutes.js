const express = require('express');
const { body } = require('express-validator');
const {
  admitPatient,
  assignNurse,
  createWard,
  getWardById,
  getWards
} = require('../controllers/wardController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Ward name is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
  ],
  validate,
  createWard
);
router.get('/', authorize('admin', 'nurse'), getWards);
router.get('/:id', authorize('admin', 'nurse'), getWardById);
router.put(
  '/:id/assign-nurse',
  authorize('admin'),
  body('nurseId').isMongoId().withMessage('Nurse is required'),
  validate,
  assignNurse
);
router.put(
  '/:id/admit-patient',
  authorize('admin', 'nurse'),
  body('patientId').isMongoId().withMessage('Patient is required'),
  validate,
  admitPatient
);

module.exports = router;
