// api/gui-input.js — POST endpoint: record player GUI interactions (batching on PlayerRemoving)
import pool from "../lib/db.js";

export default async function handler(req, res) {
  // ----- CORS preflight -----
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = req.headers["x-api-key"];
  const expectedKey = process.env.ADMIN_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    let { playerId, playerName, playerNickname, uiElement, inputData, questionId, answerData, timestamp } = req.body ?? {};

    // Map alternative keys sent by Roblox client
    if (!uiElement && questionId) uiElement = questionId;
    if (inputData === undefined && answerData !== undefined) inputData = answerData;

    // ----- validate required fields -----
    if (!playerId || !uiElement || inputData === undefined || inputData === null) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["playerId", "uiElement", "inputData"],
      });
    }

    const ts = timestamp || new Date().toISOString();

    await pool.query(
      `INSERT INTO gui_logs (player_id, player_name, player_nickname, ui_element, input_data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [playerId, playerName || null, playerNickname || null, uiElement, inputData, ts]
    );

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("gui-input error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
