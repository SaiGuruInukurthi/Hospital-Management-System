const express = require('express');
const { adminStats, doctorStats, nurseStats } = require('../controllers/statsController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), adminStats);
router.get('/doctor', authorize('doctor'), doctorStats);
router.get('/nurse', authorize('nurse'), nurseStats);

module.exports = router;
