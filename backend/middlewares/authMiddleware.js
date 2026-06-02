const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect Middleware — Verify JWT Token ─────────────────────────────────────
// Use this on any route that requires login
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please login.',
        timestamp: new Date().toISOString(),
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token payload
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid. User no longer exists.',
        timestamp: new Date().toISOString(),
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact admin.',
        timestamp: new Date().toISOString(),
      });
    }

    // Attach user to request object for use in controllers
    req.user = user;
    next();
  } catch (error) {
    next(error); // handles JsonWebTokenError & TokenExpiredError via errorMiddleware
  }
};

// ─── Authorize Middleware — Role-Based Access Control (RBAC) ──────────────────
// Usage: authorize('admin') or authorize('admin', 'analyst')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized for this action.`,
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
