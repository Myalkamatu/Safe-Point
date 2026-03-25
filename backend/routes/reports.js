const express = require('express');
const router = express.Router();
const { createReport, getReports, getReport, updateStatus } = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, authorize('citizen'), upload.single('image'), createReport);
router.get('/', auth, getReports);
router.get('/:id', auth, getReport);
router.put('/:id/status', auth, authorize('officer', 'super'), updateStatus);

module.exports = router;
