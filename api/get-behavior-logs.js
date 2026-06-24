// api/get-behavior-logs.js — GET endpoint to retrieve recent behavior logs
import sql from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });

  try {
    const url = new URL(req.url, "https://dummy");
    const playerId = url.searchParams.get("playerId");

    const rows = await sql`
      SELECT player_id, mouse_events, position_history, behavior_sequence,
             session_time, created_at
      FROM behavior_logs
      ${playerId ? sql`WHERE player_id = ${playerId}` : sql``}
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    return res.status(200).json(rows);
  } catch (err) {
    console.error("get-behavior-logs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
