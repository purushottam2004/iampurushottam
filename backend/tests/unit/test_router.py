"""
Unit tests for api.v1.router endpoint handlers.
"""

from http import HTTPStatus
from types import SimpleNamespace
from unittest.mock import MagicMock

from api.v1.router import health, hello


class TestHello:
    def test_hello_with_user_object(self):
        request = MagicMock()
        request.state.supabase_user = SimpleNamespace(id="u-1", email="user@example.com")

        assert hello(request) == {
            "message": "hello",
            "authenticated": True,
            "user": {"id": "u-1", "email": "user@example.com"},
        }

    def test_hello_with_user_dict(self):
        request = MagicMock()
        request.state.supabase_user = {"id": "u-2", "email": "dict@example.com"}

        assert hello(request) == {
            "message": "hello",
            "authenticated": True,
            "user": {"id": "u-2", "email": "dict@example.com"},
        }

    def test_hello_with_missing_user(self):
        request = MagicMock()
        request.state.supabase_user = None

        assert hello(request) == {
            "message": "hello",
            "authenticated": True,
            "user": {"id": None, "email": None},
        }


class TestHealth:
    def test_health_returns_ok(self):
        assert health(MagicMock()) == HTTPStatus.OK
