const express = require('express');
const router = express.Router();
const { getOfficers, createOfficer, toggleDuty, assignAgency } = require('../controllers/officerController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('super'), getOfficers);
router.post('/', auth, authorize('super'), createOfficer);
router.put('/:id/duty', auth, authorize('officer', 'super'), toggleDuty);
router.put('/:id/assign', auth, authorize('super'), assignAgency);

module.exports = router;
