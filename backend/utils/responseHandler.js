// ─── Standardized API Response Handler ────────────────────────────────────────
// All APIs return consistent format:
// { success, message, data, meta, timestamp }

const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'Something went wrong', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors }),
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

// ─── Paginated Response Helper ────────────────────────────────────────────────
// Automatically builds pagination meta from query params and total count
const sendPaginated = (res, message = 'Data fetched', data = [], total = 0, page = 1, limit = 10) => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

// ─── Async Handler Wrapper ─────────────────────────────────────────────────────
// Wraps async route handlers to remove repetitive try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { sendSuccess, sendError, sendPaginated, asyncHandler };
