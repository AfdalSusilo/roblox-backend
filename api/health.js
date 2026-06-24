// api/health.js — no-DB health check
export default function handler(req, res) {
  return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}
