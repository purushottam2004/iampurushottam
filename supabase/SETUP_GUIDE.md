# Supabase Setup Guide

Local Supabase (Postgres + Auth + Studio) for this template.

For the full project flow, see the root [SETUP_GUIDE.md](../SETUP_GUIDE.md).

## Prerequisites

- Docker daemon running
- Python ≥ 3.13
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

## Steps

From the [`supabase/`](./) directory:

```bash
# 1. Virtualenv + seed dependencies
python -m venv .venv

# macOS / Linux
source .venv/bin/activate
# Windows
# .venv\Scripts\activate

pip install -r requirements.txt

# 2. Start stack, write .env, seed data
python setup.py
```

[`setup.py`](./setup.py) will:

1. Start local containers (`supabase start`)
2. Read credentials via `supabase status -o env`
3. Write [`.env`](./.env.example) in this folder (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`)
4. Run [`seed.py`](./seed.py)

### Useful flags

```bash
python setup.py --skip-seed   # start + write .env only
python setup.py --help
```

### SQL vs Python seeds

- **SQL** — files in [`seeds/`](./seeds/) run on `supabase db reset` (`config.toml` `[db.seed]` uses `./seeds/*.sql`).
- **Python** — [`seed.py`](./seed.py) auto-discovers `python_seeds/*.py` whose name **starts with `_`** and **contains `_seed_`**, sorted by filename. Payloads live in `python_seeds/data/_00N_data_*.py`.
  - Committed example: `_001_seed_users.py`
  - Local scratch: `_local_seed_experiments.py` (gitignored)
  - Binary fixtures (journal intro photo): `python_seeds/data/photos/` — uploaded to the public `photos` bucket by `_002_seed_journal.py`

```bash
python seed.py
python python_seeds/_001_seed_users.py   # one script
python unseed.py --all                   # wipe app tables, then seed.py again
```

Default password is `password123` (see `python_seeds/data/_001_data_users.py`). E2E login specs use `test@example.com` / that password. Locally the journal owner is `seed_user@gmail.com`, stored as `site_settings.owner_id` by `_002_seed_journal.py`. On a hosted project, change that row in Studio to your real user uuid — do not edit the migration. Sample posts, about/intro copy, and contact buttons (`whatsapp_phone`, `contact_email`) also come from `_002_seed_journal.py` (HTML bodies). The homepage intro photo is `python_seeds/data/photos/waterfall_short_high_smile.jpg`, uploaded to `photos/intro/waterfall_short_high_smile.jpg`; the intro HTML `src` is filled with that object's public URL for the current `SUPABASE_URL`.

### Python tests

Tests live under [`python_tests/`](./python_tests/) (not `tests/`, so they stay distinct from SQL).

```bash
uv run pytest python_tests/unit
uv run pytest python_tests/integration   # needs local Supabase; skips if it is down
```

## What you get

| Service | Typical local URL |
| --- | --- |
| API | `http://127.0.0.1:54321` |
| Studio | `http://127.0.0.1:54323` |
| DB | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

Use the keys in `.env` when configuring [backend](../backend/SETUP_GUIDE.md) and [frontend](../frontend/SETUP_GUIDE.md).

### Photos bucket

Migration `20260914145106_photos_storage_bucket.sql` creates a public Storage bucket named `photos` (images only, 50 MiB max). Upload from Studio → Storage → `photos`, or while signed in as the site owner.

Public URL for a file at path `<path>`:

```
{SUPABASE_URL}/storage/v1/object/public/photos/<path>
```

`SUPABASE_URL` is in [`.env`](./.env.example). Local example: `http://127.0.0.1:54321/storage/v1/object/public/photos/hero.jpg`. In JS: `supabase.storage.from('photos').getPublicUrl('hero.jpg').data.publicUrl`.

Contribution rules: [CONTRIBUTING.md](./CONTRIBUTING.md).
