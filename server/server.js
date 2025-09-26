// server/server.js - FULL STACK VERSION

console.log('🔧 DEBUGGING PORT ISSUE:');
console.log('🔧 process.env.PORT:', process.env.PORT);
console.log('🔧 process.argv:', process.argv);
console.log('🔧 All PORT-related env vars:', Object.keys(process.env).filter(key => key.toLowerCase().includes('port')));
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tableRoutes = require('./routes/tables');
require('dotenv').config();

const app = express();

// Security middleware - Updated for React static files
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

// Serve React static files FIRST
app.use(express.static(path.join(__dirname, '../build')));

// CORS configuration - Updated for full-stack
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow same origin in production
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
console.log('Registering API routes...');
app.use('/api/auth', authRoutes);
console.log('Auth routes registered');
app.use('/api/users', userRoutes);
console.log('User routes registered');
app.use('/api/tables', tableRoutes);
console.log('Table routes registered');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    frontend: 'served'
  });
});

// API info endpoint
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

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;
    
  res.status(500).json({
    success: false,
    error: message
  });
});

// React catch-all handler - MUST BE LAST
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Full-stack server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`React app: http://0.0.0.0:${PORT}/`);
  console.log(`API endpoints: http://0.0.0.0:${PORT}/api`);
  console.log('Rate limiting: DISABLED');
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`CORS enabled for: http://localhost:3000`);
  }
  
  // Test if table service is working
  console.log('Server started successfully. Testing table service...');
  const TableService = require('./services/tableService');
  const tables = TableService.getActiveTables();
  console.log(`TableService is working: ${tables.length} tables available`);
});