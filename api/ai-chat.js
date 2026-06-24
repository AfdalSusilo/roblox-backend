// api/ai-chat.js — Roblox AI agent endpoint (proxies to Sumopod/OpenRouter)
// POST body: { messages: [{role,content}], provider: "sumopod"|"openrouter", model?: string }
// API keys stored server-side — never exposed to Roblox

const SUMPOD_URL = "https://ai.sumopod.com/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  try {
    const { messages, provider, model } = req.body ?? {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const apiKey = provider === "openrouter"
      ? (process.env.OPENROUTER_API_KEY || "sk-or-v1-placeholder")
      : (process.env.SUMODOP_API_KEY || "sk-2v1QUxgqJL8p35HVyYoG1A");

    const url = provider === "openrouter" ? OPENROUTER_URL : SUMPOD_URL;

    const selectedModel = model || (
      provider === "openrouter"
        ? "google/gemma-4-26b-a4b-it:free"
        : "deepseek-v4-pro"
    );

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };
    if (provider === "openrouter") {
      headers["HTTP-Referer"] = "https://roblox-backend-delta.vercel.app";
      headers["X-Title"] = "Roblox AI Agent";
    }

    const aiRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: selectedModel,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI API error:", aiRes.status, errText);
      return res.status(502).json({ error: `AI provider error: ${aiRes.status}` });
    }

    const data = await aiRes.json();
    const reply = data.choices?.[0]?.message?.content || "[No response]";

    return res.status(200).json({
      reply,
      model: selectedModel,
      provider,
    });
  } catch (err) {
    console.error("ai-chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
