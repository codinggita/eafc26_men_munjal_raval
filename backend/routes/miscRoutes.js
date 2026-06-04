const express = require('express');
const router = express.Router();
const m = require('../controllers/miscController');

// Compare route
router.get('/compare', m.compareConflicts);

// Region CRUD
router.post('/regions', m.createRegion);
router.delete('/regions/:regionId', m.deleteRegion);

// Country CRUD
router.post('/countries', m.createCountry);
router.put('/countries/:countryId', m.replaceCountry);
router.delete('/countries/:countryId', m.deleteCountry);

// Record Type CRUD Stubs
router.post('/economic-records', m.economicRecords.create);
router.put('/economic-records/:recordId', m.economicRecords.replace);
router.delete('/economic-records/:recordId', m.economicRecords.delete);

router.post('/poverty-records', m.povertyRecords.create);
router.delete('/poverty-records/:recordId', m.povertyRecords.delete);

router.post('/inflation-records', m.inflationRecords.create);
router.delete('/inflation-records/:recordId', m.inflationRecords.delete);

router.post('/black-market-records', m.blackMarketRecords.create);
router.delete('/black-market-records/:recordId', m.blackMarketRecords.delete);

router.post('/war-cost-records', m.warCostRecords.create);
router.delete('/war-cost-records/:recordId', m.warCostRecords.delete);

router.post('/reconstruction-records', m.reconstructionRecords.create);
router.put('/reconstruction-records/:recordId', m.reconstructionRecords.replace);
router.delete('/reconstruction-records/:recordId', m.reconstructionRecords.delete);

router.post('/unemployment-records', m.unemploymentRecords.create);
router.delete('/unemployment-records/:recordId', m.unemploymentRecords.delete);

module.exports = router;
