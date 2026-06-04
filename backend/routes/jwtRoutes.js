const express = require('express');
const router = express.Router();
const j = require('../controllers/jwtController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/generate-token', j.generateToken);
router.post('/verify-token', j.verifyToken);
router.post('/refresh-token', j.refreshToken);

router.get('/profile', protect, j.getProfile);
router.get('/dashboard', protect, j.getDashboard);
router.get('/admin', protect, authorize('admin'), j.getAdmin);
router.get('/user', protect, authorize('admin', 'analyst', 'user'), j.getUser);
router.delete('/logout', j.logout);

module.exports = router;
