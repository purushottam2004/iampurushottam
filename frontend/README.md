# Frontend

pnpm monorepo with shared packages and Vite React apps under `apps/`.

`web` is the public journal (Home / About / Writing). Intro, about, and post bodies are HTML. Floating WhatsApp and mail buttons read `whatsapp_phone` and `contact_email` from `site_settings`. Vercel SPA rewrites live in [`vercel.json`](../vercel.json) (and copies under `frontend/` / `apps/web/`) so `/about` and `/blog/...` work on refresh.

## Setup

Setup steps live in [SETUP_GUIDE.md](./SETUP_GUIDE.md).

For the full local stack order, see the root [SETUP_GUIDE.md](../SETUP_GUIDE.md). Contribution rules: [CONTRIBUTING.md](./CONTRIBUTING.md).
