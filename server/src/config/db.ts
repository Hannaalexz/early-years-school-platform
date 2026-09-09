import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const checkDbConnection = async (): Promise<boolean> => {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log(`✅ Connected to PostgreSQL [${res.rows[0].db_name}] at ${res.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    return false;
  }
};

export default pool;
