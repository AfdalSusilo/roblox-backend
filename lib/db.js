// lib/db.js — Standard PostgreSQL client via pg Pool (Supabase-compatible)
import pg from "pg";

const { Pool } = pg;

// Singleton pool — reused across warm invocations on Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase requires SSL in production
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 1, // Vercel serverless: keep connection count low
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

export default pool;
