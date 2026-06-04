const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, forgotPassword, resetPassword, refreshToken, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// POST /api/v1/auth/register
router.post('/register', register);

// POST /api/v1/auth/login
router.post('/login', login);

// POST /api/v1/auth/logout  (protected)
router.post('/logout', protect, logout);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', resetPassword);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', refreshToken);

// GET /api/v1/auth/me  (protected)
router.get('/me', protect, getMe);

// DELETE /api/v1/auth/account (protected)
router.delete('/account', protect, deleteAccount);

module.exports = router;
