const mongoose = require('mongoose');

// ─── Economic Impact Sub-Schema ────────────────────────────────────────────────
const economicImpactSchema = new mongoose.Schema(
  {
    gdpLossBillionUSD: { type: Number, default: 0 },
    infrastructureDamageUSD: { type: Number, default: 0 },
    displacedPeople: { type: Number, default: 0 },
    unemploymentRatePercent: { type: Number, default: 0 },
    inflationRatePercent: { type: Number, default: 0 },
    tradeDisruptionUSD: { type: Number, default: 0 },
    aidReceivedUSD: { type: Number, default: 0 },
  },
  { _id: false }
);

// ─── Casualties Sub-Schema ─────────────────────────────────────────────────────
const casualtiesSchema = new mongoose.Schema(
  {
    military: { type: Number, default: 0 },
    civilian: { type: Number, default: 0 },
    wounded: { type: Number, default: 0 },
    missing: { type: Number, default: 0 },
  },
  { _id: false }
);

// ─── Main Conflict Schema ──────────────────────────────────────────────────────
const conflictSchema = new mongoose.Schema(
  {
    conflictId: {
      type: String,
      required: [true, 'Conflict ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Conflict name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: ['Civil War', 'Interstate War', 'Proxy War', 'Insurgency', 'Terrorism', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Frozen', 'Escalating'],
      default: 'Active',
      index: true,
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
    },
    durationDays: {
      type: Number,
      default: 0,
    },
    casualties: {
      type: casualtiesSchema,
      default: () => ({}),
    },
    economicImpact: {
      type: economicImpactSchema,
      default: () => ({}),
    },
    involvedParties: {
      type: [String],
      default: [],
    },
    weaponsUsed: {
      type: [String],
      default: [],
    },
    internationalSanctions: {
      type: Boolean,
      default: false,
    },
    peaceAgreements: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,       // adds createdAt & updatedAt automatically
    versionKey: false,
  }
);

// ─── Index for text-based search ───────────────────────────────────────────────
conflictSchema.index({ name: 'text', description: 'text', country: 'text' });

// ─── Virtual: total casualties ─────────────────────────────────────────────────
conflictSchema.virtual('totalCasualties').get(function () {
  const c = this.casualties;
  return (c.military || 0) + (c.civilian || 0) + (c.wounded || 0) + (c.missing || 0);
});

// ─── Pre-save: auto-calculate duration ────────────────────────────────────────
conflictSchema.pre('save', function (next) {
  if (this.startDate) {
    const end = this.endDate || new Date();
    this.durationDays = Math.floor((end - this.startDate) / (1000 * 60 * 60 * 24));
  }
  next();
});

module.exports = mongoose.model('Conflict', conflictSchema);
