const Conflict = require('../models/Conflict');

// ─── GET /compare ─────────────────────────────────────────────────────────────
exports.compareConflicts = async (req, res) => {
  try {
    const { conflict1, conflict2 } = req.query;
    if (!conflict1 || !conflict2) {
      return res.status(400).json({
        success: false,
        message: 'Both conflict1 and conflict2 query parameters are required.'
      });
    }

    const getConflictStats = async (name) => {
      const matches = await Conflict.find({
        Conflict_Name: new RegExp(name, 'i'),
        isDeleted: false
      });

      if (matches.length === 0) {
        return {
          name,
          recordCount: 0,
          avgInflation: 0,
          avgGDPChange: 0,
          avgPoverty: 0,
          avgUnemploymentSpike: 0,
          totalWarCostUSD: 0
        };
      }

      const count = matches.length;
      const sumInflation = matches.reduce((acc, curr) => acc + (curr['Inflation_Rate_%'] || 0), 0);
      const sumGDP = matches.reduce((acc, curr) => acc + (curr['GDP_Change_%'] || 0), 0);
      const sumPoverty = matches.reduce((acc, curr) => acc + (curr['During_War_Poverty_Rate_%'] || 0), 0);
      const sumUnemploymentSpike = matches.reduce((acc, curr) => acc + (curr.Unemployment_Spike_Percentage_Points || 0), 0);
      const totalCost = matches.reduce((acc, curr) => acc + (curr.Cost_of_War_USD || 0), 0);

      return {
        name: matches[0].Conflict_Name,
        recordCount: count,
        avgInflation: parseFloat((sumInflation / count).toFixed(2)),
        avgGDPChange: parseFloat((sumGDP / count).toFixed(2)),
        avgPoverty: parseFloat((sumPoverty / count).toFixed(2)),
        avgUnemploymentSpike: parseFloat((sumUnemploymentSpike / count).toFixed(2)),
        totalWarCostUSD: totalCost
      };
    };

    const data1 = await getConflictStats(conflict1);
    const data2 = await getConflictStats(conflict2);

    res.json({
      success: true,
      message: 'Comparison fetched successfully',
      data: {
        conflict1: data1,
        conflict2: data2
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─── Region Stubs ──────────────────────────────────────────────────────────────
exports.createRegion = (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Region created successfully',
    data: { id: 'region_' + Math.random().toString(36).substr(2, 9), name: req.body.name || 'Europe', description: req.body.description || 'Mock region' }
  });
};

exports.deleteRegion = (req, res) => {
  res.json({
    success: true,
    message: `Region with ID ${req.params.regionId} deleted successfully`
  });
};

// ─── Country Stubs ─────────────────────────────────────────────────────────────
exports.createCountry = (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Country created successfully',
    data: { id: 'country_' + Math.random().toString(36).substr(2, 9), name: req.body.name || 'Germany', region: req.body.region || 'Europe' }
  });
};

exports.replaceCountry = (req, res) => {
  res.json({
    success: true,
    message: `Country with ID ${req.params.countryId} replaced successfully`,
    data: { id: req.params.countryId, ...req.body }
  });
};

exports.deleteCountry = (req, res) => {
  res.json({
    success: true,
    message: `Country with ID ${req.params.countryId} deleted successfully`
  });
};

// ─── Generic Record Stub Builder ──────────────────────────────────────────────
const buildStubs = (recordName) => ({
  create: (req, res) => {
    res.status(201).json({
      success: true,
      message: `${recordName} record created successfully`,
      data: { id: 'rec_' + Math.random().toString(36).substr(2, 9), ...req.body }
    });
  },
  replace: (req, res) => {
    res.json({
      success: true,
      message: `${recordName} record replaced successfully`,
      data: { id: req.params.recordId, ...req.body }
    });
  },
  delete: (req, res) => {
    res.json({
      success: true,
      message: `${recordName} record with ID ${req.params.recordId} deleted successfully`
    });
  }
});

// Expose CRUD stubs for all record types
exports.economicRecords = buildStubs('Economic');
exports.povertyRecords = buildStubs('Poverty');
exports.inflationRecords = buildStubs('Inflation');
exports.blackMarketRecords = buildStubs('Black Market');
exports.warCostRecords = buildStubs('War Cost');
exports.reconstructionRecords = buildStubs('Reconstruction');
exports.unemploymentRecords = buildStubs('Unemployment');
