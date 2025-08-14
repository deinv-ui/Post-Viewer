import pkg from 'pg';
const { Pool } = pkg;

import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

// Test query
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('🕒 DB Time:', res.rows[0]);
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
  }
})();
