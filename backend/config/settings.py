"""
Application settings loaded from environment variables.
"""

import os

from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
# Canonical name is SUPABASE_SECRET_KEY; accept legacy SERVICE_KEY / SERVICE_ROLE_KEY.
SUPABASE_SECRET_KEY = (
    os.getenv("SUPABASE_SECRET_KEY")
    or os.getenv("SUPABASE_SERVICE_KEY")
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or ""
)
# Canonical name is SUPABASE_PUBLISHABLE_KEY; accept legacy ANON_KEY.
SUPABASE_PUBLISHABLE_KEY = (
    os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_ANON_KEY") or ""
)

# PRODUCTION | STAGE | LOCAL
DEPLOYMENT_ENV = os.getenv("DEPLOYMENT_ENV", "LOCAL")
LOGGING_LEVEL = os.getenv("LOGGING_LEVEL", "INFO")
