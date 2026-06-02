const Conflict = require('../models/Conflict');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// ─── @desc    Get dashboard overview stats
// ─── @route   GET /api/v1/stats/overview
// ─── @access  Public
const getOverview = async (req, res, next) => {
  try {
    const stats = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalConflicts:     { $sum: 1 },
          activeConflicts:    { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
          resolvedConflicts:  { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          totalMilitary:      { $sum: '$casualties.military' },
          totalCivilian:      { $sum: '$casualties.civilian' },
          totalWounded:       { $sum: '$casualties.wounded' },
          totalGDPLossBillion: { $sum: '$economicImpact.gdpLossBillionUSD' },
          totalDisplaced:     { $sum: '$economicImpact.displacedPeople' },
          totalAidUSD:        { $sum: '$economicImpact.aidReceivedUSD' },
        },
      },
      {
        $project: {
          _id: 0,
          totalConflicts: 1,
          activeConflicts: 1,
          resolvedConflicts: 1,
          totalCasualties: { $add: ['$totalMilitary', '$totalCivilian', '$totalWounded'] },
          totalGDPLossBillionUSD: '$totalGDPLossBillion',
          totalDisplacedPeople: '$totalDisplaced',
          totalAidReceivedUSD: '$totalAidUSD',
        },
      },
    ]);

    return sendSuccess(res, 200, 'Overview stats fetched successfully', {
      overview: stats[0] || {
        totalConflicts: 0,
        activeConflicts: 0,
        resolvedConflicts: 0,
        totalCasualties: 0,
        totalGDPLossBillionUSD: 0,
        totalDisplacedPeople: 0,
        totalAidReceivedUSD: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get conflicts grouped by region
// ─── @route   GET /api/v1/stats/by-region
// ─── @access  Public
const getStatsByRegion = async (req, res, next) => {
  try {
    const data = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$region',
          count:           { $sum: 1 },
          activeCount:     { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
          totalGDPLoss:    { $sum: '$economicImpact.gdpLossBillionUSD' },
          totalDisplaced:  { $sum: '$economicImpact.displacedPeople' },
          totalCasualties: {
            $sum: {
              $add: ['$casualties.military', '$casualties.civilian', '$casualties.wounded'],
            },
          },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          region: '$_id',
          _id: 0,
          count: 1,
          activeCount: 1,
          totalGDPLossBillionUSD: '$totalGDPLoss',
          totalDisplacedPeople: '$totalDisplaced',
          totalCasualties: 1,
        },
      },
    ]);

    return sendSuccess(res, 200, 'Stats by region fetched successfully', { regions: data });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get conflicts grouped by year
// ─── @route   GET /api/v1/stats/by-year
// ─── @access  Public
const getStatsByYear = async (req, res, next) => {
  try {
    const data = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { $year: '$startDate' },
          count:        { $sum: 1 },
          totalGDPLoss: { $sum: '$economicImpact.gdpLossBillionUSD' },
          totalCasualties: {
            $sum: {
              $add: ['$casualties.military', '$casualties.civilian', '$casualties.wounded'],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          year: '$_id',
          _id: 0,
          count: 1,
          totalGDPLossBillionUSD: '$totalGDPLoss',
          totalCasualties: 1,
        },
      },
    ]);

    return sendSuccess(res, 200, 'Stats by year fetched successfully', { years: data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getStatsByRegion, getStatsByYear };
