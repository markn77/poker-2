// server/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tableRoutes = require('./routes/tables');
const pool = require('./config/database');
const TableService = require('./services/tableService');

const app = express();

// Security middleware - CSP disabled to allow React app to load
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS - allow all origins since frontend is served from same domain
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// DEBUG: Log requests in dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tables', tableRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    frontend: 'served'
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    message: 'Poker Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      tables: '/api/tables',
      health: '/health'
    }
  });
});

// Serve React static files - AFTER API routes
app.use(express.static(path.join(__dirname, '../build')));

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : error.message;
  res.status(500).json({ success: false, error: message });
});

// React catch-all - must be LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Start server immediately
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Connect to DB asynchronously
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL database');
    client.release();

    // Initialize tables after DB is ready
    TableService.initializeTables();
    console.log('🔧 Tables initialized');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });