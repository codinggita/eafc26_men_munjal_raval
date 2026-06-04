const Conflict = require('../models/Conflict');

// GET /search?keyword=...
exports.globalSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ success: false, message: 'keyword is required' });
    const data = await Conflict.find({ $text: { $search: keyword }, isDeleted: false });
    res.json({ success: true, count: data.length, keyword, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /search/conflicts?country=&region=&type=&status=
exports.searchConflicts = async (req, res) => {
  try {
    const { country, region, type, status } = req.query;
    const filter = { isDeleted: false };
    if (country) filter.Primary_Country = new RegExp(country, 'i');
    if (region)  filter.Region = new RegExp(region, 'i');
    if (type)    filter.Conflict_Type = new RegExp(type, 'i');
    if (status)  filter.Status = new RegExp(status, 'i');
    const data = await Conflict.find(filter);
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /search/economic?inflation=&poverty=&gdp=&currency=
exports.searchEconomic = async (req, res) => {
  try {
    const { inflation, poverty, gdp, currency } = req.query;
    const filter = { isDeleted: false };
    if (inflation) filter['Inflation_Rate_%']            = { $gte: parseFloat(inflation) };
    if (poverty)   filter['During_War_Poverty_Rate_%']   = { $gte: parseFloat(poverty) };
    if (gdp)       filter['GDP_Change_%']                = { $lte: parseFloat(gdp) };
    if (currency)  filter['Currency_Devaluation_%']      = { $gte: parseFloat(currency) };
    const data = await Conflict.find(filter);
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /search/sector?name=
exports.searchSector = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ success: false, message: 'name is required' });
    const data = await Conflict.find({ Most_Affected_Sector: new RegExp(name, 'i'), isDeleted: false });
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /search/black-market?goods=
exports.searchBlackMarket = async (req, res) => {
  try {
    const { goods } = req.query;
    if (!goods) return res.status(400).json({ success: false, message: 'goods is required' });
    const data = await Conflict.find({ Primary_Black_Market_Goods: new RegExp(goods, 'i'), isDeleted: false });
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
