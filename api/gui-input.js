// api/gui-input.js — POST endpoint: record player GUI interactions
import sql from "../lib/db.js";

export default async function handler(req, res) {
  // ----- CORS preflight -----
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { playerId, uiElement, inputData, timestamp } = req.body ?? {};

    // ----- validate required fields -----
    if (!playerId || !uiElement || inputData === undefined || inputData === null) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["playerId", "uiElement", "inputData"],
      });
    }

    const ts = timestamp || new Date().toISOString();

    await sql`
      INSERT INTO gui_logs (player_id, ui_element, input_data, created_at)
      VALUES (${playerId}, ${uiElement}, ${inputData}, ${ts})
    `;

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("gui-input error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
