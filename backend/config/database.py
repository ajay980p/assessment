import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from config.settings import settings

logger = logging.getLogger(__name__)
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

if "postgresql" in DATABASE_URL:
    logger.info("Database: PostgreSQL")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
