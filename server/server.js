// server/server.js - NO RATE LIMITING VERSION
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tableRoutes = require('./routes/tables');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-frontend.vercel.app'
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

// Routes
console.log('Registering routes...');
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
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Poker Platform API',
    version: '1.0.0',
    status: 'running'
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

// 404 handler - must be last
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
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