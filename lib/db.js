// lib/db.js — Neon serverless PostgreSQL client (singleton per cold start)
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default sql;
