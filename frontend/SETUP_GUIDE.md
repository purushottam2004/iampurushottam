# Frontend Setup Guide

pnpm workspace with Vite + React apps under [`apps/`](./apps/).

For the full project flow, see the root [SETUP_GUIDE.md](../SETUP_GUIDE.md). Prefer finishing [Supabase](../supabase/SETUP_GUIDE.md) and [backend](../backend/SETUP_GUIDE.md) first.

## Prerequisites

- Node.js ≥ 22.13
- pnpm ^11.17

## Steps

From the [`frontend/`](./) directory:

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Environment (shared by all apps)
cp .env.example .env
# or start from the local template:
# cp .env.local.example .env.local
```

Vite loads shared env from this folder first, then `apps/<app>/.env*` (app values win on conflict). See [`apps/web/vite.config.ts`](./apps/web/vite.config.ts).

### Fill env vars

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | From [`supabase/.env`](../supabase/.env.example) → `SUPABASE_URL` (local default `http://127.0.0.1:54321`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | From supabase `.env` → `SUPABASE_PUBLISHABLE_KEY` |
| `VITE_BACKEND_URL` | Optional backend URL if you run FastAPI locally |

Never put `SUPABASE_SECRET_KEY` in frontend env files.

Optional app-specific overrides: [`apps/web/.env.example`](./apps/web/.env.example).

### Run

```bash
pnpm dev                          # journal app
pnpm --filter web run dev         # same, explicit filter
```

Vite typically serves the app on port **5173**.

Browser flows that need the DB belong in **[../e2e/](../e2e/README.md)**. Playwright will build + preview `web` (or reuse `pnpm dev` if it is already up). Contribution rules: [CONTRIBUTING.md](./CONTRIBUTING.md).

### Other scripts

```bash
pnpm build
pnpm lint
```
