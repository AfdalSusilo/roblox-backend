// api/get-gui-logs.js — GET endpoint to retrieve recent GUI logs (for monitoring UI)
import sql from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });

  try {
    const url = new URL(req.url, "https://dummy");
    const playerId = url.searchParams.get("playerId");

    let query = `
      SELECT player_id, ui_element, input_data, created_at
      FROM gui_logs
    `;
    let params = [];
    if (playerId) {
      query += ` WHERE player_id = $1`;
      params.push(playerId);
    }
    query += ` ORDER BY created_at DESC LIMIT 100;`;

    const rows = await sql(query, params);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("get-gui-logs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
