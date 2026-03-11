"""
Application settings with env validation. Fails fast at startup if required vars are missing.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str  # Required; set in .env (e.g. postgresql://user:pass@host:5432/dbname)


settings = Settings()
