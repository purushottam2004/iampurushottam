"""
Unit tests for FastAPI app factory.
"""

from app import create_app


class TestCreateApp:
    def test_creates_fastapi_app_with_expected_routes(self):
        application = create_app()
        paths = set(application.openapi()["paths"])

        assert "/" in paths
        assert "/api/v1/hello" in paths
        assert "/api/v1/health" in paths

    def test_root_handler_message(self):
        application = create_app()
        root = application.openapi()["paths"]["/"]["get"]
        assert root["operationId"] == "read_root__get"
