import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings, CORS_ORIGINS_LIST
from config.database import engine, Base
from routers import get_routers

# Configure logging from settings
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database: connected")
    except Exception as e:
        logger.error("Database connection failed: %s", e)
        raise
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for HRMS Lite",
    version=settings.API_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS_LIST if CORS_ORIGINS_LIST else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in get_routers():
    app.include_router(router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {"message": settings.APP_NAME, "version": settings.API_VERSION, "docs": "/docs"}
