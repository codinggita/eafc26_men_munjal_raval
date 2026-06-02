const express = require('express');
const router = express.Router();
const { getOverview, getStatsByRegion, getStatsByYear } = require('../controllers/statsController');

// GET /api/v1/stats/overview
router.get('/overview', getOverview);

// GET /api/v1/stats/by-region
router.get('/by-region', getStatsByRegion);

// GET /api/v1/stats/by-year
router.get('/by-year', getStatsByYear);

module.exports = router;
