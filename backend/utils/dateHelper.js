// ─── Date Helper Utilities ─────────────────────────────────────────────────────
// Reusable date formatting and calculation functions used across controllers

/**
 * Format a Date object to readable string
 * @param {Date|string} date
 * @param {string} locale - default 'en-IN'
 * @returns {string} e.g. "15 March 2022"
 */
const formatDate = (date, locale = 'en-IN') => {
  if (!date) return null;
  return new Date(date).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Calculate number of days between two dates
 * @param {Date|string} startDate
 * @param {Date|string} endDate - defaults to today
 * @returns {number} days
 */
const daysBetween = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const diffMs = Math.abs(end - start);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Convert days into human-readable duration
 * @param {number} days
 * @returns {string} e.g. "3 years, 2 months, 5 days"
 */
const daysToReadableDuration = (days) => {
  if (!days || days <= 0) return 'Unknown duration';
  const years  = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const rem    = days % 30;

  const parts = [];
  if (years  > 0) parts.push(`${years} year${years  > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (rem    > 0) parts.push(`${rem} day${rem > 1 ? 's' : ''}`);

  return parts.join(', ') || '0 days';
};

/**
 * Get start and end of a given year
 * @param {number} year
 * @returns {{ start: Date, end: Date }}
 */
const getYearRange = (year) => ({
  start: new Date(`${year}-01-01T00:00:00.000Z`),
  end:   new Date(`${year}-12-31T23:59:59.999Z`),
});

/**
 * Check if a date is in the past
 * @param {Date|string} date
 * @returns {boolean}
 */
const isPast = (date) => new Date(date) < new Date();

/**
 * Get current UTC timestamp as ISO string
 * @returns {string}
 */
const nowISO = () => new Date().toISOString();

module.exports = {
  formatDate,
  daysBetween,
  daysToReadableDuration,
  getYearRange,
  isPast,
  nowISO,
};
