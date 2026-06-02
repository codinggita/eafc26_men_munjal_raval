const express = require('express');
const router = express.Router();
const {
  getAllConflicts,
  getConflictById,
  createConflict,
  updateConflict,
  deleteConflict,
} = require('../controllers/conflictController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// GET  /api/v1/conflicts          — Public (with filter, sort, search, pagination)
router.get('/', getAllConflicts);

// GET  /api/v1/conflicts/:id      — Public
router.get('/:id', getConflictById);

// POST /api/v1/conflicts          — Private (admin, analyst)
router.post('/', protect, authorize('admin', 'analyst'), createConflict);

// PUT  /api/v1/conflicts/:id      — Private (admin, analyst)
router.put('/:id', protect, authorize('admin', 'analyst'), updateConflict);

// DELETE /api/v1/conflicts/:id   — Private (admin only — soft delete)
router.delete('/:id', protect, authorize('admin'), deleteConflict);

module.exports = router;
