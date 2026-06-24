# Roblox Backend — Vercel Serverless + Neon PostgreSQL

Backend API for Roblox game data collection. Deployed on Vercel with Neon PostgreSQL.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/gui-input` | Record player GUI interactions |
| `POST` | `/api/player-behavior` | Record player behavior/movement |
| `GET` | `/api/get-stats` | Aggregate dashboard stats |
| `GET` | `/api/get-gui-logs` | Retrieve recent GUI logs |
| `GET` | `/api/get-behavior-logs` | Retrieve recent behavior logs |

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

- CORS enabled for Roblox `HttpService`
- Environment variables for sensitive config
