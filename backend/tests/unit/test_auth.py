"""
Unit tests for api.v1.auth helpers and require_supabase_user.
"""

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException

from api.v1.auth import (
    _extract_bearer_token,
    get_supabase_client,
    require_supabase_user,
)


class TestExtractBearerToken:
    def test_none(self):
        assert _extract_bearer_token(None) is None

    def test_empty_and_whitespace(self):
        assert _extract_bearer_token("") is None
        assert _extract_bearer_token("   ") is None

    def test_bearer_prefix(self):
        assert _extract_bearer_token("Bearer abc.def.ghi") == "abc.def.ghi"
        assert _extract_bearer_token("bearer abc.def.ghi") == "abc.def.ghi"
        assert _extract_bearer_token("  BEARER   token-value  ") == "token-value"

    def test_lone_bearer_word_treated_as_raw_token(self):
        # After strip(), "Bearer " becomes "Bearer" and no longer matches the
        # "bearer " prefix, so it is returned as a raw token value.
        assert _extract_bearer_token("Bearer ") == "Bearer"
        assert _extract_bearer_token("Bearer") == "Bearer"

    def test_raw_token_without_prefix(self):
        assert _extract_bearer_token("raw-token") == "raw-token"


class TestGetSupabaseClient:
    def test_missing_url_raises(self, monkeypatch):
        monkeypatch.setattr("api.v1.auth.SUPABASE_URL", "")
        monkeypatch.setattr("api.v1.auth.SUPABASE_SECRET_KEY", "secret")
        with pytest.raises(RuntimeError, match="SUPABASE_URL"):
            get_supabase_client()

    def test_missing_secret_key_raises(self, monkeypatch):
        monkeypatch.setattr("api.v1.auth.SUPABASE_URL", "https://example.supabase.co")
        monkeypatch.setattr("api.v1.auth.SUPABASE_SECRET_KEY", "")
        with pytest.raises(RuntimeError, match="SUPABASE_SECRET_KEY"):
            get_supabase_client()

    def test_creates_client_once(self, monkeypatch):
        monkeypatch.setattr("api.v1.auth.SUPABASE_URL", "https://example.supabase.co")
        monkeypatch.setattr("api.v1.auth.SUPABASE_SECRET_KEY", "secret")

        fake_client = MagicMock(name="supabase_client")
        with patch("api.v1.auth.create_client", return_value=fake_client) as create:
            first = get_supabase_client()
            second = get_supabase_client()

        assert first is fake_client
        assert second is fake_client
        create.assert_called_once_with("https://example.supabase.co", "secret")


class TestRequireSupabaseUser:
    def test_missing_authorization_raises_401(self):
        request = MagicMock()
        with pytest.raises(HTTPException) as exc_info:
            require_supabase_user(request, authorization=None)

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Missing Authorization token"

    def test_invalid_token_raises_401(self):
        request = MagicMock()
        fake_client = MagicMock()
        fake_client.auth.get_user.side_effect = Exception("bad token")

        with patch("api.v1.auth.get_supabase_client", return_value=fake_client):
            with pytest.raises(HTTPException) as exc_info:
                require_supabase_user(request, authorization="Bearer bad.jwt")

        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid or expired token"

    def test_missing_user_on_response_raises_401(self):
        request = MagicMock()
        fake_client = MagicMock()
        fake_client.auth.get_user.return_value = SimpleNamespace(user=None)

        with patch("api.v1.auth.get_supabase_client", return_value=fake_client):
            with pytest.raises(HTTPException) as exc_info:
                require_supabase_user(request, authorization="Bearer good.jwt")

        assert exc_info.value.status_code == 401

    def test_valid_user_object_attached_to_request(self):
        request = MagicMock()
        user = SimpleNamespace(id="user-1", email="a@example.com")
        fake_client = MagicMock()
        fake_client.auth.get_user.return_value = SimpleNamespace(user=user)

        with patch("api.v1.auth.get_supabase_client", return_value=fake_client):
            result = require_supabase_user(request, authorization="Bearer good.jwt")

        assert result is user
        assert request.state.supabase_user is user
        fake_client.auth.get_user.assert_called_once_with("good.jwt")

    def test_valid_user_from_dict_response(self):
        request = MagicMock()
        user = {"id": "user-2", "email": "b@example.com"}
        fake_client = MagicMock()
        fake_client.auth.get_user.return_value = {"user": user}

        with patch("api.v1.auth.get_supabase_client", return_value=fake_client):
            result = require_supabase_user(request, authorization="Bearer good.jwt")

        assert result == user
        assert request.state.supabase_user == user
