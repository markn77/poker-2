const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'poker_db',
    password: 'YOUR_PASSWORD', // replace with your Postgres password
    port: 5432,
});

module.exports = pool;
