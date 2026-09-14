"""Unit tests for unseed.py CLI and wipe helpers."""

import sys
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

import unseed


def test_resolve_table_name_aliases():
    names = ["posts", "site_content", "content_revisions", "site_settings", "photos", "users"]
    assert unseed.resolve_table_name("users", names) == "users"
    assert unseed.resolve_table_name("public.users", names) == "users"
    assert unseed.resolve_table_name(" USERS ", names) == "users"
    assert unseed.resolve_table_name("posts", names) == "posts"
    assert unseed.resolve_table_name("public.site_content", names) == "site_content"
    assert unseed.resolve_table_name("content_revisions", names) == "content_revisions"
    assert unseed.resolve_table_name("photos", names) == "photos"


def test_resolve_table_name_unknown_exits_2():
    with pytest.raises(SystemExit) as exc_info:
        unseed.resolve_table_name("orgs", ["users"])
    assert exc_info.value.code == 2


def test_parse_args_all_and_table_name(monkeypatch):
    monkeypatch.setattr(sys, "argv", ["unseed.py", "--all"])
    args = unseed.parse_args()
    assert args.all is True
    assert args.table_name is None

    monkeypatch.setattr(sys, "argv", ["unseed.py", "--table-name", "users"])
    args = unseed.parse_args()
    assert args.table_name == "users"


def test_main_rejects_all_and_table_name_together(monkeypatch):
    monkeypatch.setattr(sys, "argv", ["unseed.py", "--all", "--table-name", "users"])
    with pytest.raises(SystemExit) as exc_info:
        unseed.main()
    assert exc_info.value.code == 2


def test_make_steps_includes_journal_then_users():
    names = [name for name, _fn in unseed.make_steps(MagicMock())]
    assert names == [
        "posts",
        "site_content",
        "content_revisions",
        "site_settings",
        "photos",
        "users",
    ]


def test_wipe_posts_and_site_content():
    supabase = MagicMock()
    posts_result = SimpleNamespace(data=[{"slug": "a"}])
    content_result = SimpleNamespace(data=[{"key": "about"}])
    settings_result = SimpleNamespace(data=[{"key": "owner_id"}])
    revisions_result = SimpleNamespace(data=[{"id": "r1"}])
    posts_table = MagicMock()
    posts_table.delete.return_value.neq.return_value.execute.return_value = posts_result
    content_table = MagicMock()
    content_table.delete.return_value.neq.return_value.execute.return_value = content_result
    settings_table = MagicMock()
    settings_table.delete.return_value.neq.return_value.execute.return_value = settings_result
    revisions_table = MagicMock()
    revisions_table.delete.return_value.neq.return_value.execute.return_value = revisions_result

    def table(name: str):
        if name == "posts":
            return posts_table
        if name == "site_content":
            return content_table
        if name == "site_settings":
            return settings_table
        if name == "content_revisions":
            return revisions_table
        raise AssertionError(name)

    supabase.table.side_effect = table
    unseed.wipe_posts(supabase)
    unseed.wipe_site_content(supabase)
    unseed.wipe_site_settings(supabase)
    unseed.wipe_content_revisions(supabase)
    posts_table.delete.return_value.neq.assert_called_with("slug", "")
    content_table.delete.return_value.neq.assert_called_with("key", "")
    settings_table.delete.return_value.neq.assert_called_with("key", "")
    revisions_table.delete.return_value.neq.assert_called_with("entity", "")


def test_wipe_photos_removes_seed_object():
    supabase = MagicMock()
    unseed.wipe_photos(supabase)
    supabase.storage.from_.assert_called_with("photos")
    supabase.storage.from_.return_value.remove.assert_called_with(
        ["intro/waterfall_short_high_smile.jpg"]
    )


def test_run_step_reraises():
    with pytest.raises(RuntimeError, match="boom"):
        unseed.run_step("users", lambda: (_ for _ in ()).throw(RuntimeError("boom")))


def test_wipe_users_deletes_via_auth_admin():
    supabase = MagicMock()
    supabase.table.return_value.select.return_value.limit.return_value.execute.side_effect = [
        SimpleNamespace(data=[{"id": "u1"}, {"id": "u2"}]),
        SimpleNamespace(data=[]),
    ]

    unseed.wipe_users(supabase)

    assert supabase.auth.admin.delete_user.call_args_list == [
        (("u1",),),
        (("u2",),),
    ]
