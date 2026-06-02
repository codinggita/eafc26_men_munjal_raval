const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, deleteOwnAccount } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// All user routes require login
router.use(protect);

// GET    /api/v1/users/profile         — Get own profile
router.get('/profile', getProfile);

// PUT    /api/v1/users/profile         — Update name, bio, profilePicture
router.put('/profile', updateProfile);

// PUT    /api/v1/users/change-password — Change password
router.put('/change-password', changePassword);

// DELETE /api/v1/users/account         — Soft delete own account
router.delete('/account', deleteOwnAccount);

module.exports = router;
