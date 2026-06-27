import pg from 'pg';

const { Pool } = pg;

const connectionString = 'postgresql://postgres:Silas45Lovet@db.ggqgtgsbgiylkvcgrgvn.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const schema = `
CREATE TABLE IF NOT EXISTS gui_logs (
    id              BIGSERIAL       PRIMARY KEY,
    player_id       TEXT            NOT NULL,
    player_name     TEXT,
    player_nickname TEXT,
    ui_element      TEXT            NOT NULL,
    input_data      TEXT            NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gui_logs_player_id ON gui_logs (player_id);
CREATE INDEX IF NOT EXISTS idx_gui_logs_created_at ON gui_logs (created_at);

CREATE TABLE IF NOT EXISTS behavior_logs (
    id                BIGSERIAL       PRIMARY KEY,
    player_id         TEXT            NOT NULL,
    mouse_events      JSONB           DEFAULT '[]',
    position_history  JSONB           DEFAULT '[]',
    behavior_sequence JSONB           DEFAULT '[]',
    session_time      DOUBLE PRECISION DEFAULT 0,
    created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_behavior_logs_player_id ON behavior_logs (player_id);
CREATE INDEX IF NOT EXISTS idx_behavior_logs_created_at ON behavior_logs (created_at);
`;

async function migrate() {
  console.log("Starting migration on Supabase...");
  try {
    await pool.query(schema);
    console.log("Migration successful! Tables 'gui_logs' and 'behavior_logs' created.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

migrate();
