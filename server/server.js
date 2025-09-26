// server/server.js - Full-stack Railway-ready version
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tableRoutes = require('./routes/tables');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
    },
  },
}));

// Serve React static files
app.use(express.static(path.join(__dirname, '../build')));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-frontend-service.railway.app' // <-- Update with your frontend URL
    : 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// DEBUG: Log all requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
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

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;
  res.status(500).json({ success: false, error: message });
});

// React catch-all handler
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Server port
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Full-stack server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`React app: http://0.0.0.0:${PORT}/`);
  console.log(`API endpoints: http://0.0.0.0:${PORT}/api`);
  
  // Test table service
  const TableService = require('./services/tableService');
  const tables = TableService.getActiveTables();
  console.log(`TableService is working: ${tables.length} tables available`);
});
