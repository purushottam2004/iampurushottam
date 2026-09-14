"""Photos storage bucket is public and available on local Supabase."""

from __future__ import annotations

import pytest

pytestmark = pytest.mark.integration


def test_photos_bucket_is_public(admin_client):
    buckets = admin_client.storage.list_buckets()
    photos = next((bucket for bucket in buckets if bucket.id == "photos"), None)
    assert photos is not None
    assert photos.public is True
    assert photos.name == "photos"
