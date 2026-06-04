const express = require('express');
const router = express.Router();
const c = require('../controllers/conflictController');
const { protect } = require('../middlewares/authMiddleware');

// Protected conflicts routes (require valid JWT token)
router.get('/conflicts', protect, c.getAllConflicts);
router.post('/conflicts', protect, c.createConflict);
router.delete('/conflicts/:id', protect, c.deleteConflict);

module.exports = router;
