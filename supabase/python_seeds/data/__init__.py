"""Seed payloads loaded by the numbered python_seeds scripts."""

from . import _001_data_users as user
from . import _002_data_journal as journal

__all__ = [
    "user",
    "journal",
]
