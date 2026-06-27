import pg from 'pg';

const { Pool } = pg;

const connectionString = 'postgresql://postgres:Silas45Lovet@db.ggqgtgsbgiylkvcgrgvn.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function fixSchema() {
  console.log("Adding player_name and player_nickname columns to behavior_logs...");
  try {
    await pool.query(`
      ALTER TABLE behavior_logs 
      ADD COLUMN IF NOT EXISTS player_name TEXT,
      ADD COLUMN IF NOT EXISTS player_nickname TEXT;
    `);
    console.log("Database schema updated successfully!");
  } catch (error) {
    console.error("Schema update failed:", error);
  } finally {
    await pool.end();
  }
}

fixSchema();
