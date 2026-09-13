"""
Seed journal site_content and posts from python_seeds/data/_002_data_journal.py.
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from python_seeds.client import SUPABASE_URL, get_supabase_admin_client
from python_seeds.data import journal as journal_data


def seed_journal():
    supabase = get_supabase_admin_client()
    print(f"Connecting to Supabase at: {SUPABASE_URL}")
    print("Seeding journal content...\n")

    supabase.table("site_settings").upsert(
        {"key": journal_data.OWNER_SETTING_KEY, "value": journal_data.SITE_OWNER_ID},
        on_conflict="key",
    ).execute()
    print("  Upserted site_settings owner_id")

    content_rows = [
        {"key": "home_intro", "body": journal_data.HOME_INTRO},
        {"key": "about", "body": journal_data.ABOUT_BODY},
    ]
    supabase.table("site_content").upsert(content_rows, on_conflict="key").execute()
    print(f"  Upserted {len(content_rows)} site_content row(s)")

    post_rows = [
        {
            "id": post["id"],
            "slug": post["slug"],
            "title": post["title"],
            "body": post["body"],
            "excerpt": post["excerpt"],
            "published": post["published"],
            "published_at": post["published_at"],
        }
        for post in journal_data.POSTS
    ]
    supabase.table("posts").upsert(post_rows, on_conflict="id").execute()
    print(f"  Upserted {len(post_rows)} post(s)")

    print("\nJournal seeding complete!")


if __name__ == "__main__":
    seed_journal()
