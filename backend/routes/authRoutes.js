const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

// GET /api/v1/auth/me  (protected)
router.get('/me', protect, getMe);

// POST /api/v1/auth/logout  (protected)
router.post('/logout', protect, logout);

module.exports = router;
