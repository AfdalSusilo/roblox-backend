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

  const apiKey = req.headers["x-api-key"];
  const expectedKey = process.env.ADMIN_API_KEY;
  if (expectedKey && apiKey !== expectedKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { id, playerId, playerName, playerNickname, mouseEvents, positionHistory, behaviorSequence, sessionTime } =
      req.body ?? {};

    // ----- validate required fields -----
    if (!playerId) {
      return res.status(400).json({
        error: "Missing required field: playerId",
      });
    }

    let sequenceArray = behaviorSequence ?? [];
    if (typeof sequenceArray === "string") {
      sequenceArray = [sequenceArray];
    }

    if (id) {
      // Real-time update of existing session (Delta Append)
      await sql`
        UPDATE behavior_logs
        SET behavior_sequence = COALESCE(behavior_sequence, '[]'::jsonb) || ${JSON.stringify(sequenceArray)}::jsonb,
            session_time = ${sessionTime ?? 0},
            mouse_events = COALESCE(mouse_events, '[]'::jsonb) || ${JSON.stringify(mouseEvents ?? [])}::jsonb,
            position_history = COALESCE(position_history, '[]'::jsonb) || ${JSON.stringify(positionHistory ?? [])}::jsonb,
            created_at = NOW()
        WHERE id = ${id}
      `;
      return res.status(200).json({ success: true, id });
    } else {
      // Insert new session and return its id
      const result = await sql`
        INSERT INTO behavior_logs
          (player_id, player_name, player_nickname, mouse_events, position_history, behavior_sequence, session_time, created_at)
        VALUES (
          ${playerId},
          ${playerName || null},
          ${playerNickname || null},
          ${JSON.stringify(mouseEvents ?? [])},
          ${JSON.stringify(positionHistory ?? [])},
          ${JSON.stringify(sequenceArray)},
          ${sessionTime ?? 0},
          NOW()
        )
        RETURNING id
      `;
      return res.status(201).json({ success: true, id: result[0].id });
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("player-behavior error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
