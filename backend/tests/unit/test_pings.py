"""
Unit tests for config.pings helpers (no live network / provider calls).
"""

from unittest.mock import MagicMock, patch

from config.pings import DEFAULT_LITELLM_PING_PROMPT, Pings


class TestWithRetries:
    def test_returns_on_first_success(self):
        calls = {"n": 0}

        @Pings.with_retries(retries=3, initial_delay=0)
        def ok():
            calls["n"] += 1
            return "done"

        with patch("config.pings.time.sleep") as sleep:
            assert ok() == "done"

        assert calls["n"] == 1
        sleep.assert_not_called()

    def test_retries_then_succeeds(self):
        calls = {"n": 0}

        @Pings.with_retries(retries=3, initial_delay=0.01)
        def flaky():
            calls["n"] += 1
            if calls["n"] < 3:
                raise RuntimeError("transient")
            return True

        with patch("config.pings.time.sleep") as sleep:
            assert flaky() is True

        assert calls["n"] == 3
        assert sleep.call_count == 2

    def test_returns_false_after_exhausting_retries(self):
        @Pings.with_retries(retries=2, initial_delay=0.01)
        def always_fails():
            raise RuntimeError("nope")

        with patch("config.pings.time.sleep"):
            assert always_fails() is False


class TestPingLitellmApiKey:
    def test_missing_env_returns_false(self, monkeypatch):
        monkeypatch.delenv("TEST_PROVIDER_KEY", raising=False)

        assert (
            Pings._ping_litellm_api_key(
                env_var="TEST_PROVIDER_KEY",
                model="test/model",
                provider_name="TestProvider",
            )
            is False
        )

    def test_successful_completion_returns_true(self, monkeypatch):
        monkeypatch.setenv("TEST_PROVIDER_KEY", "sk-test")

        response = MagicMock()
        response.choices = [MagicMock()]
        response.choices[0].message.content = "OK from model"

        with patch("config.pings.litellm.completion", return_value=response) as completion:
            result = Pings._ping_litellm_api_key(
                env_var="TEST_PROVIDER_KEY",
                model="test/model",
                provider_name="TestProvider",
            )

        assert result is True
        completion.assert_called_once_with(
            model="test/model",
            messages=[{"role": "user", "content": DEFAULT_LITELLM_PING_PROMPT}],
            api_key="sk-test",
        )

    def test_completion_error_returns_false(self, monkeypatch):
        monkeypatch.setenv("TEST_PROVIDER_KEY", "sk-test")

        with patch("config.pings.litellm.completion", side_effect=RuntimeError("boom")):
            result = Pings._ping_litellm_api_key(
                env_var="TEST_PROVIDER_KEY",
                model="test/model",
                provider_name="TestProvider",
            )

        assert result is False


class TestPingSupabaseConnection:
    def test_missing_env_returns_false(self, monkeypatch):
        monkeypatch.delenv("SUPABASE_URL", raising=False)
        monkeypatch.delenv("SUPABASE_PUBLISHABLE_KEY", raising=False)
        monkeypatch.delenv("SUPABASE_ANON_KEY", raising=False)

        with patch("config.pings.time.sleep"):
            assert Pings.ping_supabase_connection() is False

    def test_accepted_status_codes_return_true(self, monkeypatch):
        monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
        monkeypatch.setenv("SUPABASE_PUBLISHABLE_KEY", "publishable-key")
        monkeypatch.delenv("SUPABASE_ANON_KEY", raising=False)

        response = MagicMock()
        response.status_code = 200

        with patch("config.pings.time.sleep"), patch(
            "config.pings.requests.get", return_value=response
        ) as get:
            assert Pings.ping_supabase_connection() is True

        get.assert_called_once()
        args, kwargs = get.call_args
        assert args[0] == "https://example.supabase.co/rest/v1/"
        assert kwargs["timeout"] == 5
        assert kwargs["headers"]["apikey"] == "publishable-key"
