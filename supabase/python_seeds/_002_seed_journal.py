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


def _upload_intro_photo(supabase) -> str:
    photo = journal_data.INTRO_PHOTO_FILE
    if not photo.is_file():
        raise FileNotFoundError(f"Intro photo missing: {photo}")

    supabase.storage.from_(journal_data.INTRO_PHOTO_BUCKET).upload(
        journal_data.INTRO_PHOTO_OBJECT_PATH,
        photo,
        {
            "content-type": journal_data.INTRO_PHOTO_CONTENT_TYPE,
            "upsert": "true",
        },
    )
    public_url = supabase.storage.from_(journal_data.INTRO_PHOTO_BUCKET).get_public_url(
        journal_data.INTRO_PHOTO_OBJECT_PATH
    )
    print(
        f"  Uploaded {photo.name} → "
        f"{journal_data.INTRO_PHOTO_BUCKET}/{journal_data.INTRO_PHOTO_OBJECT_PATH}"
    )
    return public_url


def seed_journal():
    supabase = get_supabase_admin_client()
    print(f"Connecting to Supabase at: {SUPABASE_URL}")
    print("Seeding journal content...\n")

    supabase.table("site_settings").upsert(
        [
            {"key": journal_data.OWNER_SETTING_KEY, "value": journal_data.SITE_OWNER_ID},
            {"key": journal_data.WHATSAPP_PHONE_KEY, "value": journal_data.WHATSAPP_PHONE},
            {"key": journal_data.CONTACT_EMAIL_KEY, "value": journal_data.CONTACT_EMAIL},
            {"key": journal_data.LINKEDIN_URL_KEY, "value": journal_data.LINKEDIN_URL},
        ],
        on_conflict="key",
    ).execute()
    print("  Upserted site_settings owner_id, whatsapp_phone, contact_email, linkedin_url")

    intro_photo_url = _upload_intro_photo(supabase)
    content_rows = [
        {"key": "home_intro", "body": journal_data.home_intro_body(intro_photo_url)},
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
            "kind": post.get("kind", "writing"),
        }
        for post in journal_data.POSTS
    ]
    supabase.table("posts").upsert(post_rows, on_conflict="id").execute()
    print(f"  Upserted {len(post_rows)} post(s)")

    print("\nJournal seeding complete!")


if __name__ == "__main__":
    seed_journal()
