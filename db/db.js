require('dotenv').config(); // Load environment variables from .env
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,       // PostgreSQL user
    host: process.env.DB_HOST,       // PostgreSQL host
    database: process.env.DB_DATABASE, // PostgreSQL database name
    password: process.env.DB_PASSWORD, // PostgreSQL password
    port: process.env.DB_PORT,       // PostgreSQL port
});

module.exports = pool;
