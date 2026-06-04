const express = require('express');
const router  = express.Router();
const s = require('../controllers/searchController');

router.get('/',            s.globalSearch);
router.get('/conflicts',   s.searchConflicts);
router.get('/economic',    s.searchEconomic);
router.get('/sector',      s.searchSector);
router.get('/black-market',s.searchBlackMarket);

module.exports = router;
