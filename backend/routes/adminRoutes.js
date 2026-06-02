const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All admin routes are protected + admin only
router.use(protect, authorize('admin'));

// GET    /api/v1/admin/users           — Get all users (with filter + pagination)
router.get('/users', getAllUsers);

// GET    /api/v1/admin/users/:id       — Get single user
router.get('/users/:id', getUserById);

// PATCH  /api/v1/admin/users/:id/role  — Update user role
router.patch('/users/:id/role', updateUserRole);

// PATCH  /api/v1/admin/users/:id/status — Toggle active/inactive
router.patch('/users/:id/status', toggleUserStatus);

// DELETE /api/v1/admin/users/:id       — Soft delete user
router.delete('/users/:id', deleteUser);

module.exports = router;

