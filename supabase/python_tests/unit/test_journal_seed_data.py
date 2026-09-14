"""Unit tests for committed journal seed payloads."""

from python_seeds.data._001_data_users import SEED_USER_ID
from python_seeds.data._002_data_journal import (
    ABOUT_BODY,
    CONTACT_EMAIL,
    CONTACT_EMAIL_KEY,
    HOME_INTRO,
    INTRO_PHOTO_FILE,
    INTRO_PHOTO_OBJECT_PATH,
    INTRO_PHOTO_URL_PLACEHOLDER,
    LINKEDIN_URL,
    LINKEDIN_URL_KEY,
    OWNER_SETTING_KEY,
    POSTS,
    SITE_OWNER_ID,
    WHATSAPP_PHONE,
    WHATSAPP_PHONE_KEY,
    draft_slugs,
    home_intro_body,
    published_slugs,
)


def test_owner_matches_seed_user():
    assert SITE_OWNER_ID == SEED_USER_ID
    assert SITE_OWNER_ID == "00000000-0000-0000-0000-000000000001"
    assert OWNER_SETTING_KEY == "owner_id"
    assert WHATSAPP_PHONE_KEY == "whatsapp_phone"
    assert CONTACT_EMAIL_KEY == "contact_email"
    assert LINKEDIN_URL_KEY == "linkedin_url"
    assert WHATSAPP_PHONE == "15555550100"
    assert CONTACT_EMAIL == "hello@example.com"
    assert LINKEDIN_URL == "https://www.linkedin.com/in/purushottam-dafure-b4063924b/"


def test_site_copy_is_present():
    assert HOME_INTRO
    assert ABOUT_BODY
    assert "Welcome, glad you're here." in HOME_INTRO
    assert INTRO_PHOTO_URL_PLACEHOLDER in HOME_INTRO
    assert INTRO_PHOTO_OBJECT_PATH not in HOME_INTRO
    assert INTRO_PHOTO_FILE.is_file()


def test_home_intro_body_injects_photo_url():
    url = "http://127.0.0.1:54321/storage/v1/object/public/photos/intro/waterfall_short_high_smile.jpg"
    body = home_intro_body(url)
    assert url in body
    assert INTRO_PHOTO_URL_PLACEHOLDER not in body
    assert 'alt="Purushottam"' in body


def test_sample_posts_include_published_and_draft():
    assert len(POSTS) == 4
    assert published_slugs() == [
        "why-this-site-exists",
        "a-short-note-on-tools",
        "full-stack-web-template",
    ]
    assert draft_slugs() == ["desk-notes"]
    assert {post["kind"] for post in POSTS} == {"writing", "project"}
    template = next(post for post in POSTS if post["slug"] == "full-stack-web-template")
    assert template["kind"] == "project"
    assert "https://github.com/purushottam2004/full-stack-web-template" in template["body"]
    for post in POSTS:
        assert post["id"].startswith("00000000-0000-0000-0001-")
        assert post["slug"]
        assert post["title"]
        assert post["body"]
        assert post["kind"] in {"writing", "project"}
