"""Unit tests for unseed.py CLI and wipe helpers."""

import sys
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

import unseed


def test_resolve_table_name_aliases():
    names = ["posts", "site_content", "site_settings", "users"]
    assert unseed.resolve_table_name("users", names) == "users"
    assert unseed.resolve_table_name("public.users", names) == "users"
    assert unseed.resolve_table_name(" USERS ", names) == "users"
    assert unseed.resolve_table_name("posts", names) == "posts"
    assert unseed.resolve_table_name("public.site_content", names) == "site_content"


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
    assert names == ["posts", "site_content", "site_settings", "users"]


def test_wipe_posts_and_site_content():
    supabase = MagicMock()
    posts_result = SimpleNamespace(data=[{"slug": "a"}])
    content_result = SimpleNamespace(data=[{"key": "about"}])
    settings_result = SimpleNamespace(data=[{"key": "owner_id"}])
    posts_table = MagicMock()
    posts_table.delete.return_value.neq.return_value.execute.return_value = posts_result
    content_table = MagicMock()
    content_table.delete.return_value.neq.return_value.execute.return_value = content_result
    settings_table = MagicMock()
    settings_table.delete.return_value.neq.return_value.execute.return_value = settings_result

    def table(name: str):
        if name == "posts":
            return posts_table
        if name == "site_content":
            return content_table
        if name == "site_settings":
            return settings_table
        raise AssertionError(name)

    supabase.table.side_effect = table
    unseed.wipe_posts(supabase)
    unseed.wipe_site_content(supabase)
    unseed.wipe_site_settings(supabase)
    posts_table.delete.return_value.neq.assert_called_with("slug", "")
    content_table.delete.return_value.neq.assert_called_with("key", "")
    settings_table.delete.return_value.neq.assert_called_with("key", "")


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
