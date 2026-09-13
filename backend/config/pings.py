# pylint: disable=broad-exception-caught
"""
Module Exposes a function to test if all API and SECURE KEYs are work
All Ping Functions should be inside the class 'Pings' and should start with 'ping_'
"""

import os
import functools
import logging
import time

import requests
import litellm
from supabase import create_client

logger = logging.getLogger(__name__)

DEFAULT_LITELLM_PING_PROMPT = "Say OK"

class Pings:

    def with_retries(retries: int = 5, initial_delay: float = 1.0):
        """Decorator to retry a function with exponential backoff."""

        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                delay = initial_delay
                last_exc = None
                for attempt in range(retries):
                    try:
                        return func(*args, **kwargs)
                    except Exception as e:
                        last_exc = e
                        if attempt < retries - 1:
                            logger.warning(
                                "Retry attempt failed",
                                extra={
                                    "function_name": func.__name__,
                                    "attempt": attempt + 1,
                                    "max_retries": retries,
                                    "error": str(e),
                                    "retry_delay_seconds": delay,
                                },
                            )
                            time.sleep(delay)
                            delay = min(delay * 2, 16.0)
                logger.error(
                    "Function failed after all retries",
                    extra={
                        "function_name": func.__name__,
                        "max_retries": retries,
                        "final_error": str(last_exc),
                    },
                )
                return False

            return wrapper

        return decorator

    @staticmethod
    def _ping_litellm_api_key(*, env_var: str, model: str, provider_name: str) -> bool:
        """Ping a LiteLLM-backed provider using the configured API key."""
        api_key = os.getenv(env_var)
        if not api_key:
            logger.warning(
                f"{provider_name} API key is not set",
                extra={
                    "status": "failure",
                    "error": f"{env_var} environment variable is missing",
                },
            )
            return False

        try:
            response = litellm.completion(
                model=model,
                messages=[{"role": "user", "content": DEFAULT_LITELLM_PING_PROMPT}],
                api_key=api_key,
            )
            response_preview = (
                response.choices[0].message.content[:10]
                if response.choices and response.choices[0].message.content
                else None
            )
            logger.info(
                f"{provider_name} API key check passed",
                extra={
                    "status": "success",
                    "response_preview": response_preview,
                },
            )
            return True

        except Exception as e:
            logger.error(
                f"{provider_name} API key check failed",
                extra={
                    "status": "failure",
                    "error": str(e),
                },
            )
            return False

    
    @with_retries(retries=5)
    def ping_gemini_api_key():
        """To Check if Gemini Key works"""
        return Pings._ping_litellm_api_key(
            env_var="GEMINI_API_KEY",
            model="gemini/gemini-2.5-flash",
            provider_name="Gemini",
        )


    @with_retries(retries=5)
    def ping_openai_api_key() -> bool:
        """To Check if OPENAI API KEY works"""
        return Pings._ping_litellm_api_key(
            env_var="OPENAI_API_KEY",
            model="openai/gpt-4.1-mini",
            provider_name="OpenAI",
        )


    @with_retries(retries=5)
    def ping_anthropic_api_key() -> bool:
        """To Check if Anthropic API KEY works"""
        return Pings._ping_litellm_api_key(
            env_var="ANTHROPIC_API_KEY",
            model="anthropic/claude-3-5-sonnet-latest",
            provider_name="Anthropic",
        )


    @with_retries(retries=5)
    def ping_supabase_connection() -> bool:
        """To check if SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY work"""
        supabase_url = os.getenv("SUPABASE_URL")
        publishable_key = os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

        if not supabase_url or not publishable_key:
            logger.warning(
                "Supabase connection details are not set",
                extra={
                    "status": "failure",
                    "error": "SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY environment variables are missing",
                },
            )
            return False

        try:
            headers = {
                "apikey": publishable_key,
                "Authorization": f"Bearer {publishable_key}",
            }

            r = requests.get(f"{supabase_url}/rest/v1/", headers=headers, timeout=5)

            # 401 = key accepted but no resource (EXPECTED)
            if r.status_code in (200, 401, 404):
                logger.info(
                    "Supabase connection check passed",
                    extra={
                        "status": "success",
                        "http_status_code": r.status_code,
                    },
                )
                return True
            raise RuntimeError(f"Unexpected status code: {r.status_code}")

        except Exception as e:
            logger.error(
                "Supabase connection check failed",
                extra={
                    "status": "failure",
                    "error": str(e),
                },
            )
            return False


    @with_retries(retries=5)
    def ping_supabase_secret_key() -> bool:
        """To check if SUPABASE_SECRET_KEY works"""
        supabase_url = os.getenv("SUPABASE_URL")
        secret_key = os.getenv("SUPABASE_SECRET_KEY")

        if not supabase_url or not secret_key:
            logger.warning(
                "Supabase secret key details are not set",
                extra={
                    "status": "failure",
                    "error": "SUPABASE_URL or SUPABASE_SECRET_KEY environment variables are missing",
                },
            )
            return False

        try:
            supabase = create_client(supabase_url, secret_key)

            # Secret key must bypass RLS
            # This query should succeed even if RLS is enabled
            supabase.table("users").select("id").limit(1).execute()
            logger.info(
                "Supabase secret key check passed",
                extra={
                    "status": "success",
                },
            )
            return True

        except Exception as e:
            logger.error(
                "Supabase secret key check failed",
                extra={
                    "status": "failure",
                    "error": str(e),
                },
            )
            raise
