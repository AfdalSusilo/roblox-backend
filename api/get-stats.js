// api/get-stats.js — GET endpoint for dashboard stats
import sql from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });

  try {
    const [guiCount, behCount, playerCount, recent] = await Promise.all([
      sql`SELECT COUNT(*) as cnt FROM gui_logs`,
      sql`SELECT COUNT(*) as cnt FROM behavior_logs`,
      sql`SELECT COUNT(DISTINCT player_id) as cnt FROM (SELECT player_id FROM gui_logs UNION SELECT player_id FROM behavior_logs) t`,
      sql`
        SELECT 'gui' as type, player_id, ui_element as detail, LEFT(input_data, 100) as extra, created_at
        FROM gui_logs
        ORDER BY created_at DESC LIMIT 20
      `,
    ]);

    return res.status(200).json({
      totalGuiLogs: Number(guiCount[0].cnt),
      totalBehaviorLogs: Number(behCount[0].cnt),
      uniquePlayers: Number(playerCount[0].cnt),
      recentActivity: recent,
    });
  } catch (err) {
    console.error("get-stats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
