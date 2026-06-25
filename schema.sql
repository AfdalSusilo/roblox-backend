-- ============================================================
-- DDL for Roblox Data Collection Backend
-- PostgreSQL (Neon Serverless)
-- Run this in the Neon SQL Editor before deploying
-- ============================================================

-- Table 1: GUI input logs
CREATE TABLE IF NOT EXISTS gui_logs (
    id              BIGSERIAL       PRIMARY KEY,
    player_id       TEXT            NOT NULL,
    player_name     TEXT,
    player_nickname TEXT,
    ui_element      TEXT            NOT NULL,
    input_data      TEXT            NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Index for player lookups
CREATE INDEX IF NOT EXISTS idx_gui_logs_player_id ON gui_logs (player_id);

-- Index for time-range queries
CREATE INDEX IF NOT EXISTS idx_gui_logs_created_at ON gui_logs (created_at);


-- Table 2: Player behavior logs
CREATE TABLE IF NOT EXISTS behavior_logs (
    id                BIGSERIAL       PRIMARY KEY,
    player_id         TEXT            NOT NULL,
    mouse_events      JSONB           DEFAULT '[]',
    position_history  JSONB           DEFAULT '[]',
    behavior_sequence JSONB           DEFAULT '[]',
    session_time      DOUBLE PRECISION DEFAULT 0,
    created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Index for player lookups
CREATE INDEX IF NOT EXISTS idx_behavior_logs_player_id ON behavior_logs (player_id);

-- Index for time-range queries
CREATE INDEX IF NOT EXISTS idx_behavior_logs_created_at ON behavior_logs (created_at);
