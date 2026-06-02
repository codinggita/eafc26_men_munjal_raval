const mongoose = require('mongoose');

// ─── Audit Log Schema ──────────────────────────────────────────────────────────
// Tracks who did what and when — stored for all create/update/delete operations
// Helps in auditing, debugging, and history tracking

const auditLogSchema = new mongoose.Schema(
  {
    // Who performed the action
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for system/anonymous actions
    },

    // What action was taken
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE',
        'UPDATE',
        'DELETE',
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'ROLE_CHANGE',
        'STATUS_CHANGE',
        'PASSWORD_CHANGE',
        'SEED',
        'BACKUP',
      ],
    },

    // Which collection was affected
    collection: {
      type: String,
      required: true,
      enum: ['Conflict', 'User', 'System'],
    },

    // ID of the document that was affected
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Summary of what changed
    summary: {
      type: String,
      required: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },

    // IP address of the requester
    ipAddress: {
      type: String,
      default: null,
    },

    // HTTP method used
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'SYSTEM'],
      default: 'SYSTEM',
    },

    // Route accessed
    endpoint: {
      type: String,
      default: null,
    },

    // Was the action successful
    success: {
      type: Boolean,
      default: true,
    },

    // Any additional metadata
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,    // auto createdAt (= when action happened)
    versionKey: false,
  }
);

// Index for fast lookups by user, collection, and action
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ collection: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

// ── Static helper to log an action easily ────────────────────────────────────
auditLogSchema.statics.log = async function ({
  performedBy = null,
  action,
  collection,
  documentId = null,
  summary,
  ipAddress = null,
  method = 'SYSTEM',
  endpoint = null,
  success = true,
  meta = null,
}) {
  try {
    await this.create({
      performedBy, action, collection, documentId,
      summary, ipAddress, method, endpoint, success, meta,
    });
  } catch (err) {
    // Audit logging should never crash the main application
    console.error('[AuditLog] Failed to write audit log:', err.message);
  }
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
