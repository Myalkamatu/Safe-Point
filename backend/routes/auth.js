const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, updateSettings } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/settings', auth, updateSettings);

module.exports = router;
