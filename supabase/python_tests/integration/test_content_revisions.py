"""Content revisions snapshot the previous intro / about / post on change."""

from __future__ import annotations

import pytest

from python_seeds.data._002_data_journal import POSTS

pytestmark = pytest.mark.integration

POST_ID = POSTS[0]["id"]


def test_updating_a_post_or_intro_keeps_the_previous_copy(admin_client):
    post = (
        admin_client.table("posts")
        .select("id, title, body")
        .eq("id", POST_ID)
        .single()
        .execute()
        .data
    )
    assert post
    original_title = post["title"]
    original_body = post["body"]

    admin_client.table("posts").update({"title": f"{original_title} (revised)"}).eq(
        "id", POST_ID
    ).execute()

    post_revisions = (
        admin_client.table("content_revisions")
        .select("entity, entity_id, payload")
        .eq("entity", "post")
        .eq("entity_id", POST_ID)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
        .data
        or []
    )
    assert post_revisions
    assert post_revisions[0]["payload"]["title"] == original_title
    assert post_revisions[0]["payload"]["body"] == original_body

    admin_client.table("posts").update({"title": original_title}).eq("id", POST_ID).execute()

    intro = (
        admin_client.table("site_content")
        .select("body")
        .eq("key", "home_intro")
        .single()
        .execute()
        .data
    )
    assert intro
    original_intro = intro["body"]
    admin_client.table("site_content").update({"body": original_intro + "<p>rev</p>"}).eq(
        "key", "home_intro"
    ).execute()

    intro_revisions = (
        admin_client.table("content_revisions")
        .select("entity, entity_id, payload")
        .eq("entity", "site_content")
        .eq("entity_id", "home_intro")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
        .data
        or []
    )
    assert intro_revisions
    assert intro_revisions[0]["payload"]["body"] == original_intro

    admin_client.table("site_content").update({"body": original_intro}).eq(
        "key", "home_intro"
    ).execute()


def test_identical_post_update_does_not_add_a_revision(admin_client):
    post = (
        admin_client.table("posts")
        .select("id, title")
        .eq("id", POST_ID)
        .single()
        .execute()
        .data
    )
    assert post
    before = (
        admin_client.table("content_revisions")
        .select("id")
        .eq("entity", "post")
        .eq("entity_id", POST_ID)
        .execute()
        .data
        or []
    )
    admin_client.table("posts").update({"title": post["title"]}).eq("id", POST_ID).execute()
    after = (
        admin_client.table("content_revisions")
        .select("id")
        .eq("entity", "post")
        .eq("entity_id", POST_ID)
        .execute()
        .data
        or []
    )
    assert len(after) == len(before)
