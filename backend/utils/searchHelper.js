// ─── Search Helper Utility ─────────────────────────────────────────────────────
// Case-insensitive regex search builder for MongoDB queries
// Supports single field, multi-field, and text-index search

/**
 * Build a case-insensitive regex search for a single field
 * @param {string} field - MongoDB field name
 * @param {string} value - search term
 * @returns {object} MongoDB query condition
 *
 * Usage: Conflict.find(searchField('name', 'ukraine'))
 */
const searchField = (field, value) => ({
  [field]: { $regex: value.trim(), $options: 'i' },
});

/**
 * Build OR search across multiple fields
 * @param {string[]} fields - array of field names to search
 * @param {string} value    - search term
 * @returns {object} MongoDB $or query
 *
 * Usage: User.find(searchMultipleFields(['name','email'], 'john'))
 */
const searchMultipleFields = (fields, value) => ({
  $or: fields.map((field) => ({
    [field]: { $regex: value.trim(), $options: 'i' },
  })),
});

/**
 * Build MongoDB $text search query (requires text index on collection)
 * @param {string} value - search phrase
 * @returns {object} MongoDB $text query
 *
 * Usage: Conflict.find(textSearch('ukraine war'))
 * Requires: conflictSchema.index({ name: 'text', description: 'text' })
 */
const textSearch = (value) => ({
  $text: { $search: value.trim() },
});

/**
 * Resolve which search strategy to use based on query params
 * Prefers text search if 'search' param is present, else regex
 * @param {object} query - req.query
 * @param {string[]} regexFields - fields to search with regex as fallback
 * @returns {object|null} search condition or null if no search term
 */
const resolveSearch = (query, regexFields = []) => {
  const { search, q } = query;
  const term = (search || q || '').trim();

  if (!term) return null;

  // Use regex multi-field search if regexFields provided
  if (regexFields.length > 0) {
    return searchMultipleFields(regexFields, term);
  }

  // Fallback to text index search
  return textSearch(term);
};

module.exports = { searchField, searchMultipleFields, textSearch, resolveSearch };
