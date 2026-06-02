const express = require('express');
const router = express.Router();

// ─── Placeholder Admin Routes ──────────────────────────────────────────────────
// Full RBAC implementation coming in next batch (adminController.js)

// GET /api/v1/admin/users
router.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Admin GET all users route working — RBAC + controller coming soon',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// DELETE /api/v1/admin/users/:id
router.delete('/users/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: `✅ Admin DELETE user ${req.params.id} route working — controller coming soon`,
    timestamp: new Date().toISOString(),
  });
});

// PATCH /api/v1/admin/users/:id/role
router.patch('/users/:id/role', (req, res) => {
  res.status(200).json({
    success: true,
    message: `✅ Admin UPDATE role for user ${req.params.id} — controller coming soon`,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
