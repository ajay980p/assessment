"""
Application settings with env validation. Fails fast at startup if required vars are missing.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


def _parse_cors_origins(v: str) -> list[str]:
    if not v or not v.strip():
        return []
    return [o.strip() for o in v.split(",") if o.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Required
    DATABASE_URL: str  # e.g. postgresql://user:pass@host:5432/dbname

    # App
    APP_NAME: str = "HRMS Lite API"
    API_VERSION: str = "1.0.0"
    API_PREFIX: str = ""  # e.g. "" or "/api/v1"

    # CORS (comma-separated origins, e.g. "http://localhost:5173,http://127.0.0.1:5173")
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Logging
    LOG_LEVEL: str = "INFO"  # DEBUG, INFO, WARNING, ERROR

    # Optional: debug mode (affects error detail in responses if needed later)
    DEBUG: bool = False

    # DB pool (optional, for production)
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10


settings = Settings()

# Parsed CORS list for middleware
CORS_ORIGINS_LIST: list[str] = _parse_cors_origins(settings.CORS_ORIGINS)
