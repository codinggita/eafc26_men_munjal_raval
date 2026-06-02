const { protect, authorize } = require('./authMiddleware');

// ─── Role-based Shorthand Middleware ───────────────────────────────────────────
// Cleaner way to protect routes by role without repeating authorize() everywhere

/**
 * Only allow admin users
 * Usage: router.get('/users', adminOnly, controller)
 */
const adminOnly = [protect, authorize('admin')];

/**
 * Allow both admin and analyst
 * Usage: router.post('/conflicts', analystOrAdmin, controller)
 */
const analystOrAdmin = [protect, authorize('admin', 'analyst')];

/**
 * Allow any authenticated user (any role)
 * Usage: router.get('/profile', authRequired, controller)
 */
const authRequired = [protect];

/**
 * Dynamic role check — pass roles as arguments
 * Usage: router.delete('/item', requireRole('admin', 'analyst'), controller)
 */
const requireRole = (...roles) => [protect, authorize(...roles)];

module.exports = { adminOnly, analystOrAdmin, authRequired, requireRole };
