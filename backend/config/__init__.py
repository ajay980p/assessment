"""Config package: settings, database."""
from config.settings import settings, CORS_ORIGINS_LIST
from config.database import engine, Base, SessionLocal, get_db

__all__ = [
    "settings",
    "CORS_ORIGINS_LIST",
    "engine",
    "Base",
    "SessionLocal",
    "get_db",
]
