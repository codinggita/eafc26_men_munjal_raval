const mongoose = require('mongoose');

// ─── War Economic Impact Conflict Schema ───────────────────────────────────────
// Based on war_economic_impact_dataset.json flat structure
const conflictSchema = new mongoose.Schema(
  {
    // ── Identity Fields ────────────────────────────────────────────────────────
    Conflict_Name: {
      type: String,
      required: [true, 'Conflict name is required'],
      trim: true,
      index: true,
    },
    Conflict_Type: {
      type: String,
      trim: true,
      index: true,
    },
    Region: {
      type: String,
      trim: true,
      index: true,
    },
    Start_Year: {
      type: String,
      trim: true,
      index: true,
    },
    End_Year: {
      type: String,
      trim: true,
    },
    Status: {
      type: String,
      trim: true,
      index: true,
    },
    Primary_Country: {
      type: String,
      trim: true,
      index: true,
    },

    // ── Unemployment Fields ────────────────────────────────────────────────────
    'Pre_War_Unemployment_%': { type: Number, default: 0 },
    'During_War_Unemployment_%': { type: Number, default: 0 },
    Unemployment_Spike_Percentage_Points: { type: Number, default: 0 },
    Most_Affected_Sector: { type: String, trim: true, index: true },
    'Youth_Unemployment_Change_%': { type: Number, default: 0 },

    // ── Poverty Fields ────────────────────────────────────────────────────────
    'Pre_War_Poverty_Rate_%': { type: Number, default: 0 },
    'During_War_Poverty_Rate_%': { type: Number, default: 0 },
    'Extreme_Poverty_Rate_%': { type: Number, default: 0 },
    'Food_Insecurity_Rate_%': { type: Number, default: 0 },
    Households_Fallen_Into_Poverty_Estimate: { type: Number, default: 0 },

    // ── Economic Fields ───────────────────────────────────────────────────────
    'GDP_Change_%': { type: Number, default: 0 },
    'Inflation_Rate_%': { type: Number, default: 0, index: true },
    'Currency_Devaluation_%': { type: Number, default: 0 },
    Cost_of_War_USD: { type: Number, default: 0 },
    Estimated_Reconstruction_Cost_USD: { type: Number, default: 0 },

    // ── Informal Economy Fields ───────────────────────────────────────────────
    'Informal_Economy_Size_Pre_War_%': { type: Number, default: 0 },
    'Informal_Economy_Size_During_War_%': { type: Number, default: 0 },

    // ── Black Market Fields ───────────────────────────────────────────────────
    Black_Market_Activity_Level: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Dominant', 'N/A'],
      default: 'N/A',
      index: true,
    },
    Primary_Black_Market_Goods: { type: String, trim: true },
    'Currency_Black_Market_Rate_Gap_%': { type: Number, default: 0 },
    War_Profiteering_Documented: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No',
    },

    // ── Soft Delete ───────────────────────────────────────────────────────────
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false, // allow extra fields from dataset
  }
);

// ─── Text Index for Search ─────────────────────────────────────────────────────
conflictSchema.index({
  Conflict_Name: 'text',
  Primary_Country: 'text',
  Region: 'text',
  Conflict_Type: 'text',
  Most_Affected_Sector: 'text',
  Primary_Black_Market_Goods: 'text',
});

module.exports = mongoose.model('Conflict', conflictSchema);
