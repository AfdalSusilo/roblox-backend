// api/get-gui-logs.js — GET endpoint to retrieve recent GUI logs (for monitoring UI)
import sql from "../lib/db.js";

export default async function handler(req, res) {
  // ----- CORS preflight -----
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    const { playerId } = req.query;

    const rows = await sql`
      SELECT player_id, ui_element, input_data, created_at
      FROM gui_logs
      ${playerId ? sql`WHERE player_id = ${playerId}` : sql``}
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    return res.status(200).json(rows);
  } catch (err) {
    console.error("get-gui-logs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

