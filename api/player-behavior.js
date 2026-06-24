// api/player-behavior.js — POST endpoint: record player behavior data
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
    const { playerId, playerName, playerNickname, mouseEvents, positionHistory, behaviorSequence, sessionTime } =
      req.body ?? {};

    // ----- validate required fields -----
    if (!playerId) {
      return res.status(400).json({
        error: "Missing required field: playerId",
      });
    }

    await sql`
      INSERT INTO behavior_logs
        (player_id, player_name, player_nickname, mouse_events, position_history, behavior_sequence, session_time, created_at)
      VALUES (
        ${playerId},
        ${playerName || null},
        ${playerNickname || null},
        ${JSON.stringify(mouseEvents ?? [])},
        ${JSON.stringify(positionHistory ?? [])},
        ${JSON.stringify(behaviorSequence ?? [])},
        ${sessionTime ?? 0},
        NOW()
      )
    `;

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("player-behavior error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
