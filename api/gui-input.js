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

    await sql`
      INSERT INTO gui_logs (player_id, player_name, player_nickname, ui_element, input_data, created_at)
      VALUES (${playerId}, ${playerName || null}, ${playerNickname || null}, ${uiElement}, ${inputData}, ${ts})
    `;

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("gui-input error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
