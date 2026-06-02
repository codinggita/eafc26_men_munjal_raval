const rateLimit = require('express-rate-limit');

// ─── General API Rate Limiter ──────────────────────────────────────────────────
// Applied globally to all routes in server.js
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes window
  max: 100,                   // max 100 requests per IP per window
  standardHeaders: true,      // return RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    timestamp: new Date().toISOString(),
  },
});

// ─── Strict Limiter for Auth Routes ───────────────────────────────────────────
// Applied specifically to /api/v1/auth/* (login, register)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes window
  max: 10,                    // max 10 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 10 minutes.',
    timestamp: new Date().toISOString(),
  },
});

module.exports = { generalLimiter, authLimiter };
