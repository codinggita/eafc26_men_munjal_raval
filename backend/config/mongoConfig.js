// ─── MongoDB Connection Configuration ─────────────────────────────────────────
// Centralized Mongoose connection options
// Import and spread into mongoose.connect() calls

const mongoOptions = {
  useNewUrlParser:    true,
  useUnifiedTopology: true,

  // Connection pool
  maxPoolSize:        10,   // max simultaneous connections
  minPoolSize:        2,    // keep at least 2 connections alive
  serverSelectionTimeoutMS: 5000,   // timeout after 5s if no server found
  socketTimeoutMS:    45000,        // close socket after 45s of inactivity
  connectTimeoutMS:   10000,        // timeout if initial connect takes >10s

  // Write concern — ensure writes are acknowledged
  writeConcern: { w: 'majority' },
};

/**
 * Get the MongoDB URI based on environment
 * @returns {string} MongoDB connection string
 */
const getMongoURI = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  return uri;
};

/**
 * Get database name from the URI
 * @returns {string}
 */
const getDBName = () => {
  const uri = getMongoURI();
  const parts = uri.split('/');
  return parts[parts.length - 1].split('?')[0] || 'war_economic_impact';
};

module.exports = { mongoOptions, getMongoURI, getDBName };
