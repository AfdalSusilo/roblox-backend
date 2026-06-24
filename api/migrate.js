import sql from "../lib/db.js";

export default async function handler(req, res) {
  try {
    console.log("Altering 'gui_logs' table...");
    await sql`
      ALTER TABLE gui_logs 
      ADD COLUMN IF NOT EXISTS player_name TEXT,
      ADD COLUMN IF NOT EXISTS player_nickname TEXT;
    `;

    console.log("Altering 'behavior_logs' table...");
    await sql`
      ALTER TABLE behavior_logs 
      ADD COLUMN IF NOT EXISTS player_name TEXT,
      ADD COLUMN IF NOT EXISTS player_nickname TEXT;
    `;

    return res.status(200).json({ success: true, message: "Tables altered successfully." });
  } catch (error) {
    console.error("Migration error:", error);
    return res.status(500).json({ error: error.message });
  }
}
