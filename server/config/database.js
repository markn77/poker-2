// server/database.js - Railway-ready PostgreSQL connection
const { Pool } = require('pg');

// Debug: Log environment variables
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// Create a PostgreSQL pool
const pool = new Pool({
    user: process.env.DB_USER,                 // Railway DB user
    host: process.env.DB_HOST,                 // Railway DB host
    database: process.env.DB_NAME,             // Railway DB name
    password: process.env.DB_PASSWORD,         // Railway DB password
    port: parseInt(process.env.DB_PORT),       // Railway DB public port
    ssl: { rejectUnauthorized: false },        // Required for public Postgres on Railway
    connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

module.exports = pool;
