# Frontend

pnpm monorepo with shared packages and Vite React apps under `apps/`.

`web` is the public journal (Home / About / Writing / Projects). Intro, about, post titles, and post bodies are HTML rendered as stored (including iframes); only the site owner can write that HTML. Previous copies of intro, about, and posts are stored in `content_revisions` on each real change. Floating WhatsApp, LinkedIn, and mail buttons read `whatsapp_phone`, `linkedin_url`, and `contact_email` from `site_settings`. Vercel SPA rewrites live in [`vercel.json`](../vercel.json) (and copies under `frontend/` / `apps/web/`) so `/about`, `/blog/...`, and `/projects/...` work on refresh.

## Setup

Setup steps live in [SETUP_GUIDE.md](./SETUP_GUIDE.md).

For the full local stack order, see the root [SETUP_GUIDE.md](../SETUP_GUIDE.md). Contribution rules: [CONTRIBUTING.md](./CONTRIBUTING.md).
