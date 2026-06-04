require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const connectDB          = require('./config/db');
const corsOptions        = require('./config/corsConfig');
const { generalLimiter } = require('./config/rateLimit');
const errorMiddleware    = require('./middlewares/errorMiddleware');
const loggerMiddleware   = require('./middlewares/loggerMiddleware');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');

// Route imports
const authRoutes      = require('./routes/authRoutes');
const conflictRoutes  = require('./routes/conflictRoutes');
const statsRoutes     = require('./routes/statsRoutes');
const adminRoutes     = require('./routes/adminRoutes');
const userRoutes      = require('./routes/userRoutes');
const searchRoutes     = require('./routes/searchRoutes');
const miscRoutes       = require('./routes/miscRoutes');
const jwtRoutes        = require('./routes/jwtRoutes');
const protectedRoutes  = require('./routes/protectedRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Parsing Middlewares ───────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
// app.use(morgan('dev')); // Disabled for clean terminal
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Request Logger ────────────────────────────────────────────────────────────
// app.use(loggerMiddleware); // Disabled for clean terminal

// ─── Global Rate Limiter ───────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Health & Version Handlers ──────────────────────────────────────────────────
const healthHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'War Economic Impact API is healthy',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
};

const versionHandler = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API version info',
    data: {
      version: '1.0.0',
      name: 'War Economic Impact API',
      environment: process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString(),
  });
};

// Route health/version at both root and api/v1 paths
app.get('/api/v1/health', healthHandler);
app.get('/health', healthHandler);
app.get('/api/v1/version', versionHandler);
app.get('/version', versionHandler);

// ─── Explicit OPTIONS Handlers (to satisfy user route requirements) ──────────────────
app.options('/api/v1/conflicts', (req, res) => {
  res.setHeader('Allow', 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS');
  res.status(200).send();
});
app.options('/api/v1/conflicts/:id', (req, res) => {
  res.setHeader('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.status(200).send();
});
app.options('/api/v1/auth/login', (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.status(200).send();
});
app.options('/api/v1/admin/conflicts', (req, res) => {
  res.setHeader('Allow', 'GET, POST, DELETE, PATCH, OPTIONS');
  res.status(200).send();
});
app.options('/api/v1/search', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(200).send();
});
app.options('/api/v1/jwt/profile', (req, res) => {
  res.setHeader('Allow', 'GET, OPTIONS');
  res.status(200).send();
});
app.options('/api/v1/health', (req, res) => {
  res.setHeader('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).send();
});
app.options('/health', (req, res) => {
  res.setHeader('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).send();
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/conflicts', conflictRoutes);
app.use('/api/v1/stats',     statsRoutes);
app.use('/api/v1/admin',     adminRoutes);
app.use('/api/v1/users',     userRoutes);
app.use('/api/v1/search',    searchRoutes);
app.use('/api/v1/jwt',       jwtRoutes);
app.use('/api/v1/protected', protectedRoutes);
app.use('/api/v1',           miscRoutes); // Register comparison and stubs under /api/v1

// ─── 404 Handler ────────────────────────────────────────────────────────────────
app.use('*', notFoundMiddleware);

// ─── Global Error Middleware ───────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ──────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
};

startServer();
