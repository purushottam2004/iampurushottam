"""Seed / unseed smoke against a running local Supabase.

Skipped automatically when the stack is down. Wipes public.users via
`unseed.py --all`, then restores committed seed users afterward.
"""

from __future__ import annotations

import pytest

from python_seeds.client import get_auth_user_id_by_email
from python_seeds.data._001_data_users import SEED_USERS
from python_seeds.data._002_data_journal import (
    CONTACT_EMAIL,
    CONTACT_EMAIL_KEY,
    INTRO_PHOTO_BUCKET,
    INTRO_PHOTO_OBJECT_PATH,
    LINKEDIN_URL,
    LINKEDIN_URL_KEY,
    OWNER_SETTING_KEY,
    POSTS,
    SITE_OWNER_ID,
    WHATSAPP_PHONE,
    WHATSAPP_PHONE_KEY,
    published_slugs,
)
from python_tests.integration.conftest import run_script

pytestmark = pytest.mark.integration


def _auth_and_profile(admin_client, email: str, user_id: str) -> dict:
    auth_id = get_auth_user_id_by_email(admin_client, email)
    assert auth_id == user_id
    profile = (
        admin_client.table("users")
        .select("id, username, display_name")
        .eq("id", user_id)
        .execute()
    )
    assert profile.data, f"missing public.users row for {email}"
    return profile.data[0]


def test_seed_is_idempotent_then_unseed_clears_users(admin_client):
    run_script("seed.py")
    posts = admin_client.table("posts").select("slug, published").execute().data or []
    assert {row["slug"] for row in posts} == {post["slug"] for post in POSTS}
    assert {row["slug"] for row in posts if row["published"]} == set(published_slugs())
    settings = (
        admin_client.table("site_settings")
        .select("key, value")
        .execute()
        .data
        or []
    )
    assert {row["key"]: row["value"] for row in settings} == {
        OWNER_SETTING_KEY: SITE_OWNER_ID,
        WHATSAPP_PHONE_KEY: WHATSAPP_PHONE,
        CONTACT_EMAIL_KEY: CONTACT_EMAIL,
        LINKEDIN_URL_KEY: LINKEDIN_URL,
    }
    intro = (
        admin_client.table("site_content")
        .select("body")
        .eq("key", "home_intro")
        .single()
        .execute()
        .data
    )
    assert intro and "Welcome, glad you're here." in intro["body"]
    assert f"/storage/v1/object/public/{INTRO_PHOTO_BUCKET}/{INTRO_PHOTO_OBJECT_PATH}" in intro[
        "body"
    ]
    listed = admin_client.storage.from_(INTRO_PHOTO_BUCKET).list("intro")
    assert any(item.get("name") == "waterfall_short_high_smile.jpg" for item in listed)

    first_ids = {}
    for user in SEED_USERS:
        row = _auth_and_profile(admin_client, user["email"], user["id"])
        assert row["username"] == user["profile"]["username"]
        assert row["display_name"] == user["profile"]["display_name"]
        first_ids[user["email"]] = row["id"]

    run_script("seed.py")
    for user in SEED_USERS:
        row = _auth_and_profile(admin_client, user["email"], user["id"])
        assert row["id"] == first_ids[user["email"]]

    try:
        run_script("unseed.py", "--all")
        remaining = admin_client.table("users").select("id").execute().data or []
        assert remaining == []
        assert (admin_client.table("posts").select("id").execute().data or []) == []
        assert (admin_client.table("site_content").select("key").execute().data or []) == []
        assert (admin_client.table("site_settings").select("key").execute().data or []) == []
        listed_after = admin_client.storage.from_(INTRO_PHOTO_BUCKET).list("intro")
        assert not any(
            item.get("name") == "waterfall_short_high_smile.jpg" for item in listed_after
        )
        for user in SEED_USERS:
            assert get_auth_user_id_by_email(admin_client, user["email"]) is None
    finally:
        run_script("seed.py")
