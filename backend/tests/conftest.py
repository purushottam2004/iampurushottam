"""
Shared fixtures for backend tests.
"""

import pytest

from api.v1.auth import get_supabase_client


@pytest.fixture(autouse=True)
def _clear_supabase_client_cache():
    """Ensure lru_cache on get_supabase_client does not leak across tests."""
    get_supabase_client.cache_clear()
    yield
    get_supabase_client.cache_clear()
