// api/get-behavior-logs.js — GET endpoint to retrieve recent behavior logs
import pool from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });

  try {
    const url = new URL(req.url, "https://dummy");
    const playerId = url.searchParams.get("playerId");

    let query = `
      SELECT id, player_id, player_name, player_nickname, mouse_events, position_history, behavior_sequence,
             session_time, created_at
      FROM behavior_logs
    `;
    const params = [];
    if (playerId) {
      query += ` WHERE player_id = $1`;
      params.push(playerId);
    }
    query += ` ORDER BY created_at DESC LIMIT 100;`;

    const result = await pool.query(query, params);

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("get-behavior-logs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
