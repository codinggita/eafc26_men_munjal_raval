const Conflict = require('../models/Conflict');

exports.getOverview = async (req, res) => {
  try {
    const total    = await Conflict.countDocuments({ isDeleted: false });
    const ongoing  = await Conflict.countDocuments({ Status: 'Ongoing',  isDeleted: false });
    const resolved = await Conflict.countDocuments({ Status: 'Resolved', isDeleted: false });
    const agg = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, avgInflation: { $avg: '$Inflation_Rate_%' }, avgGdpChange: { $avg: '$GDP_Change_%' }, avgPoverty: { $avg: '$During_War_Poverty_Rate_%' }, totalWarCost: { $sum: '$Cost_of_War_USD' } } }
    ]);
    res.json({ success: true, data: { total, ongoing, resolved, ...agg[0] } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getTotalConflicts = async (req, res) => {
  try {
    const count = await Conflict.countDocuments({ isDeleted: false });
    res.json({ success: true, total: count });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getOngoingConflicts = async (req, res) => {
  try {
    const count = await Conflict.countDocuments({ Status: 'Ongoing', isDeleted: false });
    res.json({ success: true, ongoing: count });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getResolvedConflicts = async (req, res) => {
  try {
    const count = await Conflict.countDocuments({ Status: 'Resolved', isDeleted: false });
    res.json({ success: true, resolved: count });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getHighestInflation = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ 'Inflation_Rate_%': -1 }).limit(5).select('Conflict_Name Primary_Country Inflation_Rate_%');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getLowestGdp = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ 'GDP_Change_%': 1 }).limit(5).select('Conflict_Name Primary_Country GDP_Change_%');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getHighestPoverty = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ 'During_War_Poverty_Rate_%': -1 }).limit(5).select('Conflict_Name Primary_Country During_War_Poverty_Rate_%');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getHighestFoodInsecurity = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ 'Food_Insecurity_Rate_%': -1 }).limit(5).select('Conflict_Name Primary_Country Food_Insecurity_Rate_%');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getHighestCurrencyGap = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ 'Currency_Black_Market_Rate_Gap_%': -1 }).limit(5).select('Conflict_Name Primary_Country Currency_Black_Market_Rate_Gap_%');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getHighestWarCost = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ Cost_of_War_USD: -1 }).limit(5).select('Conflict_Name Primary_Country Cost_of_War_USD');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getHighestReconstructionCost = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ Estimated_Reconstruction_Cost_USD: -1 }).limit(5).select('Conflict_Name Primary_Country Estimated_Reconstruction_Cost_USD');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getStatsByRegion = async (req, res) => {
  try {
    const data = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$Region', count: { $sum: 1 }, avgInflation: { $avg: '$Inflation_Rate_%' }, avgGdpChange: { $avg: '$GDP_Change_%' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getStatsByYear = async (req, res) => {
  try {
    const data = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$Start_Year', count: { $sum: 1 }, avgInflation: { $avg: '$Inflation_Rate_%' } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getStatsByConflictType = async (req, res) => {
  try {
    const data = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$Conflict_Type', count: { $sum: 1 }, avgInflation: { $avg: '$Inflation_Rate_%' }, avgGdpChange: { $avg: '$GDP_Change_%' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getInflationByRegion = async (req, res) => {
  try {
    const data = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$Region', avgInflation: { $avg: '$Inflation_Rate_%' } } },
      { $sort: { avgInflation: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getTopGdpLoss = async (req, res) => {
  try {
    const data = await Conflict.find({ isDeleted: false }).sort({ 'GDP_Change_%': 1 }).limit(5).select('Conflict_Name Primary_Country GDP_Change_%');
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getBlackMarketSummary = async (req, res) => {
  try {
    const data = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$Black_Market_Activity_Level', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getEconomicOverview = async (req, res) => {
  try {
    const total = await Conflict.countDocuments({ isDeleted: false });
    const agg = await Conflict.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, avgInflation: { $avg: '$Inflation_Rate_%' }, avgGdpChange: { $avg: '$GDP_Change_%' }, avgPoverty: { $avg: '$During_War_Poverty_Rate_%' }, totalWarCost: { $sum: '$Cost_of_War_USD' }, totalReconstructionCost: { $sum: '$Estimated_Reconstruction_Cost_USD' } } }
    ]);
    res.json({ success: true, data: { total, ...(agg[0] || {}) } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
