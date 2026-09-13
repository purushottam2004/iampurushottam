# E2E test list

Tracked Playwright specs under `tests/`. How to run them: [README.md](./README.md).

Recorder specs live in gitignored `video_test/` folders and are not listed here.

Credentials: [`tests/helpers/auth.ts`](./tests/helpers/auth.ts) (defaults match `supabase/python_seeds/data/_001_data_users.py`).

## Journal (`--project=web`)

| File | What it covers |
| --- | --- |
| [`tests/web-smoke.spec.ts`](./tests/web-smoke.spec.ts) | Public home loads; published posts show; drafts stay hidden; About and a post page render; WhatsApp and mail contact buttons point at seeded site_settings. |
| [`tests/web-login.spec.ts`](./tests/web-login.spec.ts) | Header login modal; wrong password stays open; `test@example.com` has no edit chrome; owner sees New / drafts; intro HTML renders. |

## Browser check (`npm run test:browser`)

Separate config (`playwright.browser-check.config.ts`). Does not start the journal app.

| File | What it covers |
| --- | --- |
| [`tests/browser-check.spec.ts`](./tests/browser-check.spec.ts) | Opens one headed Chromium window so you can check window-manager / Hyprland rules. |
