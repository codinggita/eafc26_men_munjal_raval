const express = require('express');
const router = express.Router();
const s = require('../controllers/statsController');

// Standard stats routes
router.get('/overview',                  s.getOverview);
router.get('/by-region',                 s.getStatsByRegion);
router.get('/by-year',                   s.getStatsByYear);
router.get('/total-conflicts',           s.getTotalConflicts);
router.get('/ongoing-conflicts',         s.getOngoingConflicts);
router.get('/resolved-conflicts',        s.getResolvedConflicts);
router.get('/highest-inflation',         s.getHighestInflation);
router.get('/lowest-gdp',                s.getLowestGdp);
router.get('/highest-poverty',           s.getHighestPoverty);
router.get('/highest-food-insecurity',   s.getHighestFoodInsecurity);
router.get('/highest-currency-gap',      s.getHighestCurrencyGap);
router.get('/highest-war-cost',          s.getHighestWarCost);
router.get('/highest-reconstruction-cost', s.getHighestReconstructionCost);

// Custom summaries / mappings
router.get('/region-summary',            s.getStatsByRegion);
router.get('/conflict-type-summary',     s.getStatsByConflictType);
router.get('/inflation-by-region',       s.getInflationByRegion);
router.get('/top-gdp-loss',              s.getTopGdpLoss);
router.get('/black-market-summary',      s.getBlackMarketSummary);
router.get('/economic-overview',         s.getEconomicOverview);

module.exports = router;
