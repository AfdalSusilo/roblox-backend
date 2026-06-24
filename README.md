# Roblox Backend – Vercel Serverless + Neon PostgreSQL

A lightweight Node.js backend for logging **Roblox player UI inputs** and **in‑game behavior**. It runs as **Vercel Serverless Functions** and stores everything in a **Neon PostgreSQL** database.

---

## Features
- **POST /api/gui-input** – record GUI interactions (`playerId`, `uiElement`, `inputData`, optional `timestamp`).
- **POST /api/player-behavior** – record mouse events, position history, behavior sequence, session time.
- **GET /api/get‑gui‑logs** – fetch recent GUI logs (filter by `playerId`).
- **GET /api/get‑behavior‑logs** – fetch recent behavior logs (filter by `playerId`).
- **GET /api/get‑stats** – aggregate numbers for the dashboard.
- **Frontend dashboard** (`/`) – real‑time stats, searchable tables, CSV export, dark theme – no external dependencies.
- **CORS** header (`Access-Control-Allow-Origin: *`) for Roblox `HttpService` calls.
- **Neon Serverless client** via `@neondatabase/serverless` (lightweight, works on Vercel Edge).

---

## Quick start (local)
```bash
# Clone the repo (public now)
git clone https://github.com/AfdalSusilo/roblox-backend.git
cd roblox-backend

# Install deps
npm i

# Create a .env file (copy from .env.example) with your Neon URL
cp .env.example .env
# edit .env with your actual DATABASE_URL

# Run locally (Vercel dev emulates serverless)
npm run dev   # opens http://localhost:3000
```

### Deploy to Vercel
1. Go to **https://vercel.com/import** and import the repo `AfdalSusilo/roblox-backend`.
2. Add an environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: the Neon connection string (`postgresql://user:pwd@...`)
3. Click **Deploy**. Vercel will build the Node project and expose the functions under the same domain.
4. After a successful deploy you’ll receive a URL like `https://roblox‑backend‑xxxx.vercel.app`. This URL is the **webhook** you can call from Roblox.

---

## Using the endpoints from Roblox (Lua)
```lua
local HttpService = game:GetService("HttpService")

-- GUI input example
HttpService:PostAsync(
    "https://YOUR_VERCE_URL/api/gui
