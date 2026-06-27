// api/clear-sessions.js — POST endpoint to clear all database sessions and logs
import pool from "../lib/db.js";

export default async function handler(req, res) {
  // CORS preflight
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
    console.log("Clearing all sessions and logs...");
    await pool.query(`TRUNCATE TABLE gui_logs, behavior_logs RESTART IDENTITY CASCADE;`);
    return res.status(200).json({ success: true, message: "All sessions and logs cleared successfully." });
  } catch (err) {
    console.error("clear-sessions error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
