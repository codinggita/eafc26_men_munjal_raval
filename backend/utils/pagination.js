// ─── Reusable Pagination Utility ──────────────────────────────────────────────
// Use this anywhere you need consistent pagination logic
// Avoids repeating page/limit/skip calculation across controllers

/**
 * Parse and validate pagination params from request query
 * @param {object} query - req.query
 * @returns {{ page, limit, skip }}
 */
const getPaginationParams = (query) => {
  let page  = parseInt(query.page,  10) || 1;
  let limit = parseInt(query.limit, 10) || 10;

  // Safety boundaries
  if (page  < 1)   page  = 1;
  if (limit < 1)   limit = 1;
  if (limit > 100) limit = 100;  // max 100 per page

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build pagination metadata object
 * @param {number} total  - total matching documents
 * @param {number} page   - current page
 * @param {number} limit  - items per page
 * @returns {object} meta
 */
const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

/**
 * Complete pagination helper — combines both functions
 * @param {object} query  - req.query
 * @param {number} total  - total documents count
 * @returns {{ page, limit, skip, meta }}
 */
const paginate = (query, total) => {
  const { page, limit, skip } = getPaginationParams(query);
  const meta = buildPaginationMeta(total, page, limit);
  return { page, limit, skip, meta };
};

module.exports = { getPaginationParams, buildPaginationMeta, paginate };
