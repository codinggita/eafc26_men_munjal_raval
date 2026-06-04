const express = require('express');
const router  = express.Router();
const c = require('../controllers/conflictController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const admin = [protect, authorize('admin')];
const analyst = [protect, authorize('admin', 'analyst')];

// ─── Advanced / Special Named Routes (MUST be before /:id) ────────────────────
router.get('/top/highest-inflation',  c.getTopHighestInflation);
router.get('/top/highest-poverty',    c.getTopHighestPoverty);
router.get('/ongoing',                c.getOngoing);
router.get('/resolved',               c.getResolved);
router.get('/recent',                 c.getRecent);
router.get('/latest',                 c.getLatest);
router.get('/random',                 c.getRandom);
router.get('/trending',               c.getTrending);
router.get('/high-risk',              c.getHighRisk);
router.get('/economic-collapse',      c.getEconomicCollapse);
router.get('/europe',                 c.getEurope);
router.get('/asia',                   c.getAsia);
router.get('/high-inflation',         c.getHighInflation);
router.get('/high-poverty',           c.getHighPoverty);
router.get('/high-gdp-loss',          c.getHighGdpLoss);
router.get('/summary/ai',             c.getAiSummary);

// ─── Black market high (pagination) ──────────────────────────────────────────
router.get('/black-market/high',      c.getBlackMarketHigh);

// ─── War detail routes ────────────────────────────────────────────────────────
router.get('/war/:name/summary',         c.warSummary);
router.get('/war/:name/economic-impact', c.warEconomicImpact);
router.get('/war/:name/poverty-impact',  c.warPovertyImpact);
router.get('/war/:name/black-market',    c.warBlackMarket);
router.get('/war/:name/reconstruction',  c.warReconstruction);
router.get('/war/:name/currency-crisis', c.warCurrencyCrisis);
router.get('/war/:name/unemployment',    c.warUnemployment);

// ─── Route Parameter Routes ───────────────────────────────────────────────────
router.get('/name/:name',                      c.getByName);
router.get('/type/:type/count',                c.countByType);
router.get('/type/:type',                      c.getByType);
router.get('/region/:region/latest',           c.getRegionLatest);
router.get('/region/:region/oldest',           c.getRegionOldest);
router.get('/region/:region',                  c.getByRegion);
router.get('/status/:status/count',            c.countByStatus);
router.get('/status/:status',                  c.getByStatus);
router.get('/country/:country/history',        c.getCountryHistory);
router.get('/country/:country',                c.getByCountry);
router.get('/start-year/:year',                c.getByStartYear);
router.get('/end-year/:year',                  c.getByEndYear);
router.get('/year/:year',                      c.getByYear);
router.get('/inflation/:rate',                 c.getByInflation);
router.get('/gdp-loss/:percentage',            c.getByGdpLoss);
router.get('/poverty/:rate',                   c.getByPoverty);
router.get('/extreme-poverty/:rate',           c.getByExtremePoverty);
router.get('/food-insecurity/:rate',           c.getByFoodInsecurity);
router.get('/unemployment/:rate',              c.getByUnemployment);
router.get('/youth-unemployment/:rate',        c.getByYouthUnemployment);
router.get('/sector/:sector/highest-gdp-loss', c.sectorHighestGdpLoss);
router.get('/sector/:sector/highest-inflation',c.sectorHighestInflation);
router.get('/sector/:sector',                  c.getBySector);
router.get('/black-market-goods/:goods',       c.getByBlackMarketGoods);
router.get('/black-market/:level',             c.getByBlackMarket);
router.get('/profiteering/:status',            c.getByProfiteering);
router.get('/currency-gap/:gap',               c.getByCurrencyGap);
router.get('/reconstruction-cost/:amount',     c.getByReconstructionCost);
router.get('/cost-of-war/:amount',             c.getByCostOfWar);
router.get('/informal-economy/pre/:value',     c.getByPreInformalEconomy);
router.get('/informal-economy/during/:value',  c.getByDuringInformalEconomy);
router.get('/households/:count',               c.getByHouseholds);

// ─── Basic CRUD ───────────────────────────────────────────────────────────────
router.get('/',    c.getAllConflicts);
router.get('/:id', c.getConflictById);
router.post('/',   ...analyst, c.createConflict);
router.put('/:id', ...analyst, c.replaceConflict);
router.delete('/:id', ...admin, c.deleteConflict);

// ─── PATCH sub-routes ─────────────────────────────────────────────────────────
router.patch('/:id',             ...analyst, c.updateConflict);
router.patch('/:id/status',      ...analyst, c.patchStatus);
router.patch('/:id/inflation',   ...analyst, c.patchInflation);
router.patch('/:id/gdp',         ...analyst, c.patchGdp);
router.patch('/:id/poverty',     ...analyst, c.patchPoverty);
router.patch('/:id/unemployment',...analyst, c.patchUnemployment);
router.patch('/:id/sector',      ...analyst, c.patchSector);

module.exports = router;
