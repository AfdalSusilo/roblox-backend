// api/get-stats.js — GET endpoint for dashboard stats
import pool from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });

  try {
    const [guiCount, behCount, playerCount, recent] = await Promise.all([
      pool.query(`SELECT COUNT(*) as cnt FROM gui_logs`),
      pool.query(`SELECT COUNT(*) as cnt FROM behavior_logs`),
      pool.query(
        `SELECT COUNT(DISTINCT player_id) as cnt
         FROM (SELECT player_id FROM gui_logs UNION SELECT player_id FROM behavior_logs) t`
      ),
      pool.query(
        `SELECT 'gui' as type, player_id, ui_element as detail, LEFT(input_data, 100) as extra, created_at
         FROM gui_logs
         ORDER BY created_at DESC LIMIT 20`
      ),
    ]);

    return res.status(200).json({
      totalGuiLogs: Number(guiCount.rows[0].cnt),
      totalBehaviorLogs: Number(behCount.rows[0].cnt),
      uniquePlayers: Number(playerCount.rows[0].cnt),
      recentActivity: recent.rows,
    });
  } catch (err) {
    console.error("get-stats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
