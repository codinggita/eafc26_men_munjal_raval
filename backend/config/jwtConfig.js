const jwt = require('jsonwebtoken');

// ─── JWT Configuration & Helpers ──────────────────────────────────────────────

const JWT_SECRET         = process.env.JWT_SECRET;
const JWT_EXPIRE         = process.env.JWT_EXPIRE         || '7d';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

// ── Generate access token ──────────────────────────────────────────────────────
const generateAccessToken = (userId) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment');
  return jwt.sign({ id: userId, type: 'access' }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// ── Generate refresh token ────────────────────────────────────────────────────
const generateRefreshToken = (userId) => {
  if (!JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not defined in environment');
  return jwt.sign({ id: userId, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
};

// ── Verify access token ───────────────────────────────────────────────────────
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// ── Verify refresh token ──────────────────────────────────────────────────────
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

// ── Decode token without verifying (for inspection only) ─────────────────────
const decodeToken = (token) => {
  return jwt.decode(token);
};

// ── Get token expiry as human-readable string ─────────────────────────────────
const getTokenExpiry = (token) => {
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000).toISOString();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiry,
  JWT_EXPIRE,
  JWT_REFRESH_EXPIRE,
};
