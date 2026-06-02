const Conflict = require('../models/Conflict');

// ─── Conflict Service Layer ────────────────────────────────────────────────────
// Business logic lives here, controllers just call these functions
// Keeps controllers thin and services reusable

// ── Build dynamic filter from query params ─────────────────────────────────────
const buildFilter = (query) => {
  const { status, region, country, type, search, startYear, endYear } = query;

  const filter = { isDeleted: false };

  if (status)  filter.status  = status;
  if (region)  filter.region  = { $regex: region, $options: 'i' };
  if (country) filter.country = { $regex: country, $options: 'i' };
  if (type)    filter.type    = type;

  // Full-text search (requires text index on Conflict model)
  if (search) filter.$text = { $search: search };

  // Filter by start year range
  if (startYear || endYear) {
    filter.startDate = {};
    if (startYear) filter.startDate.$gte = new Date(`${startYear}-01-01`);
    if (endYear)   filter.startDate.$lte = new Date(`${endYear}-12-31`);
  }

  return filter;
};

// ── Fetch paginated conflicts ──────────────────────────────────────────────────
const fetchConflicts = async ({ filter, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

  const [conflicts, total] = await Promise.all([
    Conflict.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Conflict.countDocuments(filter),
  ]);

  return { conflicts, total };
};

// ── Check if conflictId already exists ────────────────────────────────────────
const conflictIdExists = async (conflictId) => {
  return await Conflict.findOne({ conflictId });
};

// ── Get conflicts summary stats (used in overview aggregation) ─────────────────
const getConflictSummary = async () => {
  return await Conflict.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        total:    { $sum: 1 },
        active:   { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
        totalGDP: { $sum: '$economicImpact.gdpLossBillionUSD' },
        totalDisplaced: { $sum: '$economicImpact.displacedPeople' },
      },
    },
  ]);
};

// ── Get top N most impactful conflicts by GDP loss ────────────────────────────
const getTopByGDPLoss = async (n = 5) => {
  return await Conflict.find({ isDeleted: false })
    .sort({ 'economicImpact.gdpLossBillionUSD': -1 })
    .limit(n)
    .select('name country region economicImpact.gdpLossBillionUSD status');
};

// ── Get conflicts by multiple countries ───────────────────────────────────────
const getConflictsByCountries = async (countries = []) => {
  return await Conflict.find({
    country: { $in: countries },
    isDeleted: false,
  });
};

module.exports = {
  buildFilter,
  fetchConflicts,
  conflictIdExists,
  getConflictSummary,
  getTopByGDPLoss,
  getConflictsByCountries,
};
