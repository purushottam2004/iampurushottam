"""Unit tests for committed journal seed payloads."""

from python_seeds.data._001_data_users import SEED_USER_ID
from python_seeds.data._002_data_journal import (
    ABOUT_BODY,
    HOME_INTRO,
    OWNER_SETTING_KEY,
    POSTS,
    SITE_OWNER_ID,
    draft_slugs,
    published_slugs,
)


def test_owner_matches_seed_user():
    assert SITE_OWNER_ID == SEED_USER_ID
    assert SITE_OWNER_ID == "00000000-0000-0000-0000-000000000001"
    assert OWNER_SETTING_KEY == "owner_id"


def test_site_copy_is_present():
    assert HOME_INTRO
    assert ABOUT_BODY


def test_sample_posts_include_published_and_draft():
    assert len(POSTS) == 3
    assert published_slugs() == ["why-this-site-exists", "a-short-note-on-tools"]
    assert draft_slugs() == ["desk-notes"]
    for post in POSTS:
        assert post["id"].startswith("00000000-0000-0000-0001-")
        assert post["slug"]
        assert post["title"]
        assert post["body"]
