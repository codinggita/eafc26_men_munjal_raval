const Conflict = require('../models/Conflict');

// ─── Helper: build numeric filter ─────────────────────────────────────────────
const numFilter = (field, val, op = 'gte') => ({ [field]: { [`$${op}`]: parseFloat(val) } });

// ─── GET /conflicts ───────────────────────────────────────────────────────────
exports.getAllConflicts = async (req, res) => {
  try {
    const {
      status, region, country, type, sector, blackMarket, profiteering, year,
      startYear, endYear, keyword,
      inflationAbove, inflationBelow, gdpLossAbove, povertyAbove,
      foodInsecurityAbove, currencyGapAbove, warCostAbove, reconstructionAbove,
      minInflation, maxInflation, minGDP, maxGDP, minPoverty, maxPoverty,
      minUnemployment, maxUnemployment,
      sort, page = 1, limit = 10,
    } = req.query;

    const filter = { isDeleted: false };

    if (status)      filter.Status = new RegExp(status, 'i');
    if (region)      filter.Region = new RegExp(region, 'i');
    if (country)     filter.Primary_Country = new RegExp(country, 'i');
    if (type)        filter.Conflict_Type = new RegExp(type, 'i');
    if (sector)      filter.Most_Affected_Sector = new RegExp(sector, 'i');
    if (blackMarket) filter.Black_Market_Activity_Level = new RegExp(blackMarket, 'i');
    if (profiteering) filter.War_Profiteering_Documented = profiteering;
    if (startYear)   filter.Start_Year = startYear;
    if (endYear)     filter.End_Year = endYear;
    if (year)        filter.$or = [{ Start_Year: year }, { End_Year: year }];
    if (keyword)     filter.$text = { $search: keyword };

    if (inflationAbove)     filter['Inflation_Rate_%'] = { $gte: parseFloat(inflationAbove) };
    if (inflationBelow)     filter['Inflation_Rate_%'] = { $lte: parseFloat(inflationBelow) };
    if (gdpLossAbove)       filter['GDP_Change_%'] = { $lte: -parseFloat(gdpLossAbove) };
    if (povertyAbove)       filter['During_War_Poverty_Rate_%'] = { $gte: parseFloat(povertyAbove) };
    if (foodInsecurityAbove) filter['Food_Insecurity_Rate_%'] = { $gte: parseFloat(foodInsecurityAbove) };
    if (currencyGapAbove)   filter['Currency_Black_Market_Rate_Gap_%'] = { $gte: parseFloat(currencyGapAbove) };
    if (warCostAbove)       filter.Cost_of_War_USD = { $gte: parseFloat(warCostAbove) };
    if (reconstructionAbove) filter.Estimated_Reconstruction_Cost_USD = { $gte: parseFloat(reconstructionAbove) };

    if (minInflation || maxInflation) {
      filter['Inflation_Rate_%'] = {};
      if (minInflation) filter['Inflation_Rate_%'].$gte = parseFloat(minInflation);
      if (maxInflation) filter['Inflation_Rate_%'].$lte = parseFloat(maxInflation);
    }
    if (minGDP || maxGDP) {
      filter['GDP_Change_%'] = {};
      if (minGDP) filter['GDP_Change_%'].$gte = parseFloat(minGDP);
      if (maxGDP) filter['GDP_Change_%'].$lte = parseFloat(maxGDP);
    }
    if (minPoverty || maxPoverty) {
      filter['During_War_Poverty_Rate_%'] = {};
      if (minPoverty) filter['During_War_Poverty_Rate_%'].$gte = parseFloat(minPoverty);
      if (maxPoverty) filter['During_War_Poverty_Rate_%'].$lte = parseFloat(maxPoverty);
    }
    if (minUnemployment || maxUnemployment) {
      filter['During_War_Unemployment_%'] = {};
      if (minUnemployment) filter['During_War_Unemployment_%'].$gte = parseFloat(minUnemployment);
      if (maxUnemployment) filter['During_War_Unemployment_%'].$lte = parseFloat(maxUnemployment);
    }

    const sortObj = sort ? { [sort.startsWith('-') ? sort.slice(1) : sort]: sort.startsWith('-') ? -1 : 1 } : { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Conflict.countDocuments(filter);
    const data  = await Conflict.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit));

    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /conflicts/:id ───────────────────────────────────────────────────────
exports.getConflictById = async (req, res) => {
  try {
    const doc = await Conflict.findById(req.params.id);
    if (!doc || doc.isDeleted) return res.status(404).json({ success: false, message: 'Conflict not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /conflicts ──────────────────────────────────────────────────────────
exports.createConflict = async (req, res) => {
  try {
    const doc = await Conflict.create(req.body);
    res.status(201).json({ success: true, message: 'Conflict created', data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── PUT /conflicts/:id ───────────────────────────────────────────────────────
exports.replaceConflict = async (req, res) => {
  try {
    const doc = await Conflict.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Conflict not found' });
    res.json({ success: true, message: 'Conflict replaced', data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── PATCH /conflicts/:id ─────────────────────────────────────────────────────
exports.updateConflict = async (req, res) => {
  try {
    const doc = await Conflict.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Conflict not found' });
    res.json({ success: true, message: 'Conflict updated', data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE /conflicts/:id ────────────────────────────────────────────────────
exports.deleteConflict = async (req, res) => {
  try {
    const doc = await Conflict.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Conflict not found' });
    res.json({ success: true, message: 'Conflict deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH sub-routes ─────────────────────────────────────────────────────────
exports.patchStatus       = async (req, res) => { try { const d = await Conflict.findByIdAndUpdate(req.params.id, { Status: req.body.Status }, { new: true }); res.json({ success: true, data: d }); } catch (e) { res.status(400).json({ success: false, message: e.message }); }};
exports.patchInflation    = async (req, res) => { try { const d = await Conflict.findByIdAndUpdate(req.params.id, { 'Inflation_Rate_%': req.body.Inflation_Rate_percent }, { new: true }); res.json({ success: true, data: d }); } catch (e) { res.status(400).json({ success: false, message: e.message }); }};
exports.patchGdp          = async (req, res) => { try { const d = await Conflict.findByIdAndUpdate(req.params.id, { 'GDP_Change_%': req.body.GDP_Change_percent }, { new: true }); res.json({ success: true, data: d }); } catch (e) { res.status(400).json({ success: false, message: e.message }); }};
exports.patchPoverty      = async (req, res) => { try { const d = await Conflict.findByIdAndUpdate(req.params.id, { 'During_War_Poverty_Rate_%': req.body.During_War_Poverty_Rate_percent }, { new: true }); res.json({ success: true, data: d }); } catch (e) { res.status(400).json({ success: false, message: e.message }); }};
exports.patchUnemployment = async (req, res) => { try { const d = await Conflict.findByIdAndUpdate(req.params.id, { 'During_War_Unemployment_%': req.body.During_War_Unemployment_percent }, { new: true }); res.json({ success: true, data: d }); } catch (e) { res.status(400).json({ success: false, message: e.message }); }};
exports.patchSector       = async (req, res) => { try { const d = await Conflict.findByIdAndUpdate(req.params.id, { Most_Affected_Sector: req.body.Most_Affected_Sector }, { new: true }); res.json({ success: true, data: d }); } catch (e) { res.status(400).json({ success: false, message: e.message }); }};

// ─── Route Parameter handlers ─────────────────────────────────────────────────
const byField = (field, isNum = false) => async (req, res) => {
  try {
    const val = req.params[Object.keys(req.params)[0]];
    const filter = isNum ? { [field]: { $gte: parseFloat(val) }, isDeleted: false } : { [field]: new RegExp(val, 'i'), isDeleted: false };
    const data = await Conflict.find(filter);
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getByName           = byField('Conflict_Name');
exports.getByType           = byField('Conflict_Type');
exports.getByRegion         = byField('Region');
exports.getByStatus         = byField('Status');
exports.getByCountry        = byField('Primary_Country');
exports.getByStartYear      = byField('Start_Year');
exports.getByEndYear        = byField('End_Year');
exports.getBySector         = byField('Most_Affected_Sector');
exports.getByBlackMarket    = byField('Black_Market_Activity_Level');
exports.getByProfiteering   = byField('War_Profiteering_Documented');
exports.getByBlackMarketGoods = byField('Primary_Black_Market_Goods');
exports.getByInflation      = byField('Inflation_Rate_%', true);
exports.getByGdpLoss        = byField('GDP_Change_%', true);
exports.getByPoverty        = byField('During_War_Poverty_Rate_%', true);
exports.getByExtremePoverty = byField('Extreme_Poverty_Rate_%', true);
exports.getByFoodInsecurity = byField('Food_Insecurity_Rate_%', true);
exports.getByUnemployment   = byField('During_War_Unemployment_%', true);
exports.getByYouthUnemployment = byField('Youth_Unemployment_Change_%', true);
exports.getByCurrencyGap    = byField('Currency_Black_Market_Rate_Gap_%', true);
exports.getByReconstructionCost = byField('Estimated_Reconstruction_Cost_USD', true);
exports.getByCostOfWar      = byField('Cost_of_War_USD', true);
exports.getByPreInformalEconomy    = byField('Informal_Economy_Size_Pre_War_%', true);
exports.getByDuringInformalEconomy = byField('Informal_Economy_Size_During_War_%', true);
exports.getByHouseholds     = byField('Households_Fallen_Into_Poverty_Estimate', true);

// ─── By Year ──────────────────────────────────────────────────────────────────
exports.getByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const data = await Conflict.find({ $or: [{ Start_Year: year }, { End_Year: year }], isDeleted: false });
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ─── Region latest / oldest ───────────────────────────────────────────────────
exports.getRegionLatest = async (req, res) => {
  try {
    const data = await Conflict.findOne({ Region: new RegExp(req.params.region, 'i'), isDeleted: false }).sort({ Start_Year: -1 });
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.getRegionOldest = async (req, res) => {
  try {
    const data = await Conflict.findOne({ Region: new RegExp(req.params.region, 'i'), isDeleted: false }).sort({ Start_Year: 1 });
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ─── Country history ──────────────────────────────────────────────────────────
exports.getCountryHistory = async (req, res) => {
  try {
    const data = await Conflict.find({ Primary_Country: new RegExp(req.params.country, 'i'), isDeleted: false }).sort({ Start_Year: 1 });
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ─── Count by type / status ───────────────────────────────────────────────────
exports.countByType   = async (req, res) => { try { const count = await Conflict.countDocuments({ Conflict_Type: new RegExp(req.params.type, 'i'), isDeleted: false }); res.json({ success: true, type: req.params.type, count }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }};
exports.countByStatus = async (req, res) => { try { const count = await Conflict.countDocuments({ Status: new RegExp(req.params.status, 'i'), isDeleted: false }); res.json({ success: true, status: req.params.status, count }); } catch (e) { res.status(500).json({ success: false, message: e.message }); }};

// ─── Sector highest GDP loss / inflation ─────────────────────────────────────
exports.sectorHighestGdpLoss = async (req, res) => {
  try {
    const data = await Conflict.find({ Most_Affected_Sector: new RegExp(req.params.sector, 'i'), isDeleted: false }).sort({ 'GDP_Change_%': 1 }).limit(5);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.sectorHighestInflation = async (req, res) => {
  try {
    const data = await Conflict.find({ Most_Affected_Sector: new RegExp(req.params.sector, 'i'), isDeleted: false }).sort({ 'Inflation_Rate_%': -1 }).limit(5);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ─── War detail routes (/war/:name/...) ───────────────────────────────────────
const getWarDocs = (name) => Conflict.find({ Conflict_Name: new RegExp(name, 'i'), isDeleted: false });

exports.warSummary = async (req, res) => {
  try {
    const data = await getWarDocs(req.params.name);
    const summary = data.map(d => ({ name: d.Conflict_Name, country: d.Primary_Country, region: d.Region, status: d.Status, startYear: d.Start_Year, endYear: d.End_Year, type: d.Conflict_Type }));
    res.json({ success: true, count: data.length, data: summary });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.warEconomicImpact = async (req, res) => {
  try {
    const data = await getWarDocs(req.params.name);
    const result = data.map(d => ({ name: d.Conflict_Name, country: d.Primary_Country, GDP_Change: d['GDP_Change_%'], Inflation: d['Inflation_Rate_%'], Currency_Devaluation: d['Currency_Devaluation_%'], Cost_of_War: d.Cost_of_War_USD, Reconstruction_Cost: d.Estimated_Reconstruction_Cost_USD }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.warPovertyImpact = async (req, res) => {
  try {
    const data = await getWarDocs(req.params.name);
    const result = data.map(d => ({ name: d.Conflict_Name, country: d.Primary_Country, Pre_War_Poverty: d['Pre_War_Poverty_Rate_%'], During_War_Poverty: d['During_War_Poverty_Rate_%'], Extreme_Poverty: d['Extreme_Poverty_Rate_%'], Food_Insecurity: d['Food_Insecurity_Rate_%'], Households_In_Poverty: d.Households_Fallen_Into_Poverty_Estimate }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.warBlackMarket = async (req, res) => {
  try {
    const data = await getWarDocs(req.params.name);
    const result = data.map(d => ({ name: d.Conflict_Name, country: d.Primary_Country, Black_Market_Level: d.Black_Market_Activity_Level, Goods: d.Primary_Black_Market_Goods, Currency_Gap: d['Currency_Black_Market_Rate_Gap_%'], Profiteering: d.War_Profiteering_Documented }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.warReconstruction = async (req, res) => {
  try {
    const data = await getWarDocs(req.params.name);
    const result = data.map(d => ({ name: d.Conflict_Name, country: d.Primary_Country, Cost_of_War_USD: d.Cost_of_War_USD, Reconstruction_Cost_USD: d.Estimated_Reconstruction_Cost_USD }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.warCurrencyCrisis = async (req, res) => {
  try {
    const data = await getWarDocs(req.params.name);
    const result = data.map(d => ({ name: d.Conflict_Name, country: d.Primary_Country, Inflation_Rate: d['Inflation_Rate_%'], Currency_Devaluation: d['Currency_Devaluation_%'], Black_Market_Gap: d['Currency_Black_Market_Rate_Gap_%'] }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
exports.warUnemployment = async (req, res) => {
  try {
    const data = await getWarDocs(req.params.name);
    const result = data.map(d => ({ name: d.Conflict_Name, country: d.Primary_Country, Pre_War_Unemployment: d['Pre_War_Unemployment_%'], During_War_Unemployment: d['During_War_Unemployment_%'], Spike: d.Unemployment_Spike_Percentage_Points, Youth_Change: d['Youth_Unemployment_Change_%'], Sector: d.Most_Affected_Sector }));
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ─── Special/Advanced routes ──────────────────────────────────────────────────
exports.getOngoing  = async (req, res) => { try { const { page=1, limit=10 } = req.query; const skip=(page-1)*limit; const total=await Conflict.countDocuments({ Status:'Ongoing', isDeleted:false }); const data=await Conflict.find({ Status:'Ongoing', isDeleted:false }).skip(+skip).limit(+limit); res.json({ success:true, total, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getResolved = async (req, res) => { try { const { page=1, limit=10 } = req.query; const skip=(page-1)*limit; const total=await Conflict.countDocuments({ Status:'Resolved', isDeleted:false }); const data=await Conflict.find({ Status:'Resolved', isDeleted:false }).skip(+skip).limit(+limit); res.json({ success:true, total, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getRecent   = async (req, res) => { try { const data=await Conflict.find({ isDeleted:false }).sort({ createdAt:-1 }).limit(10); res.json({ success:true, count:data.length, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getLatest   = async (req, res) => { try { const data=await Conflict.find({ isDeleted:false }).sort({ Start_Year:-1 }).limit(10); res.json({ success:true, count:data.length, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getRandom   = async (req, res) => { try { const count=await Conflict.countDocuments({ isDeleted:false }); const r=Math.floor(Math.random()*count); const data=await Conflict.find({ isDeleted:false }).skip(r).limit(1); res.json({ success:true, data:data[0] }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getTrending = async (req, res) => { try { const data=await Conflict.find({ Status:'Ongoing', isDeleted:false }).sort({ 'Inflation_Rate_%':-1 }).limit(5); res.json({ success:true, count:data.length, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getHighRisk = async (req, res) => { try { const data=await Conflict.find({ Black_Market_Activity_Level:{ $in:['High','Dominant'] }, isDeleted:false }); res.json({ success:true, count:data.length, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getEconomicCollapse = async (req, res) => { try { const data=await Conflict.find({ 'GDP_Change_%':{ $lte:-40 }, isDeleted:false }).sort({ 'GDP_Change_%':1 }); res.json({ success:true, count:data.length, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getTopHighestInflation = async (req, res) => { try { const data=await Conflict.find({ isDeleted:false }).sort({ 'Inflation_Rate_%':-1 }).limit(10); res.json({ success:true, count:data.length, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};
exports.getTopHighestPoverty   = async (req, res) => { try { const data=await Conflict.find({ isDeleted:false }).sort({ 'During_War_Poverty_Rate_%':-1 }).limit(10); res.json({ success:true, count:data.length, data }); } catch(e){ res.status(500).json({ success:false, message:e.message }); }};

// ─── Pagination shortcuts ─────────────────────────────────────────────────────
exports.getEurope        = async (req, res) => { req.query.region = 'Europe'; return exports.getAllConflicts(req, res); };
exports.getAsia          = async (req, res) => { req.query.region = 'Asia'; return exports.getAllConflicts(req, res); };
exports.getHighInflation = async (req, res) => { req.query.inflationAbove = '50'; return exports.getAllConflicts(req, res); };
exports.getHighPoverty   = async (req, res) => { req.query.povertyAbove = '30'; return exports.getAllConflicts(req, res); };
exports.getHighGdpLoss   = async (req, res) => { req.query.gdpLossAbove = '30'; return exports.getAllConflicts(req, res); };
exports.getBlackMarketHigh = async (req, res) => { req.query.blackMarket = 'High'; return exports.getAllConflicts(req, res); };

// ─── AI Summary (placeholder) ─────────────────────────────────────────────────
exports.getAiSummary = async (req, res) => {
  try {
    const total = await Conflict.countDocuments({ isDeleted: false });
    const ongoing = await Conflict.countDocuments({ Status: 'Ongoing', isDeleted: false });
    const topInflation = await Conflict.findOne({ isDeleted: false }).sort({ 'Inflation_Rate_%': -1 });
    res.json({ success: true, data: { summary: `The dataset contains ${total} conflict records. ${ongoing} are currently ongoing. The highest inflation recorded is ${topInflation?.['Inflation_Rate_%']}% in ${topInflation?.Conflict_Name} (${topInflation?.Primary_Country}).`, generatedAt: new Date().toISOString() } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
