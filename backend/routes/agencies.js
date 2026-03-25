const express = require('express');
const router = express.Router();
const { getAgencies, createAgency } = require('../controllers/agencyController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getAgencies);
router.post('/', auth, authorize('super'), createAgency);

module.exports = router;
