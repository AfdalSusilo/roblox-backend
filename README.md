# Roblox Backend — Vercel Serverless + Neon PostgreSQL

Backend API for Roblox game data collection + AI-powered NPC agents. Deployed on Vercel with Neon PostgreSQL.

## Endpoints

### Data Collection

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/gui-input` | Record player GUI interactions |
| `POST` | `/api/player-behavior` | Record player behavior/movement |
| `GET` | `/api/get-stats` | Aggregate dashboard stats |
| `GET` | `/api/get-gui-logs` | Retrieve recent GUI logs |
| `GET` | `/api/get-behavior-logs` | Retrieve recent behavior logs |

### AI Agent

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai-chat` | AI chat for Roblox NPCs |

## 🤖 AI Agent Chat (Roblox NPC)

Roblox agents can talk to AI via Sumopod (DeepSeek V4 Pro) or OpenRouter (free models). API keys are stored server-side on Vercel — never exposed to Roblox clients.

### Lua Usage

```lua
local HttpService = game:GetService("HttpService")
local BASE_URL = "https://roblox-backend-delta.vercel.app"

local function askAI(messages, provider)
    local payload = HttpService:JSONEncode({
        messages = messages,
        provider = provider or "sumopod"  -- "sumopod" or "openrouter"
    })
    local result = HttpService:PostAsync(BASE_URL .. "/api/ai-chat", payload)
    local data = HttpService:JSONDecode(result)
    return data.reply
end

-- NPC conversation
local reply = askAI({
    {role = "system", content = "Kamu NPC penjaga toko di game Roblox. Bicara bahasa Indonesia."},
    {role = "user", content = "Halo, ada senjata apa hari ini?"}
}, "sumopod")

print("NPC:", reply)
```

### Providers

| Provider | Model | Cost |
|----------|-------|------|
| `sumopod` | deepseek-v4-pro | Free (via OpenClaw) |
| `openrouter` | google/gemma-4-26b-a4b-it:free | Free tier |

## Quick Start

```bash
git clone https://github.com/AfdalSusilo/roblox-backend.git
cd roblox-backend
npm i
cp .env.example .env  # edit with Neon DATABASE_URL
npm run dev            # http://localhost:3000
```

### Deploy to Vercel

1. Import repo at [vercel.com/import](https://vercel.com/import)
2. Add env: `DATABASE_URL` = Neon connection string
3. Deploy → get public URL

### Database Setup

Run `schema.sql` in Neon SQL Editor to create tables.

## Security

- API keys stored server-side (never in Roblox scripts)
- CORS enabled for Roblox `HttpService`
- Certificate pinning on AI API calls
