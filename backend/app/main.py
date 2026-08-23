import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import engine, Base
import app.models

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Insta Repo API - Centralized professional identity repository parsing resumes and generating portfolios, cover letters, and GitHub profiles."
)

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        # Safely create tables if they don't exist on startup
        await conn.run_sync(Base.metadata.create_all)

# CORS Middleware setup
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

raw_origins = [
    frontend_url,
    "https://instarepo.me",
    "https://www.instarepo.me",
    "http://localhost:3000",
    "http://localhost:5173",
]
origins = list(set([o.rstrip("/") for o in raw_origins if o and o.strip()]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Standardize the Path in main.py:
UPLOAD_DIR = os.path.abspath(os.path.join(os.getcwd(), "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount the directory before API router inclusion
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
@app.get("/health", tags=["Health"])
def health_check():
    """Lightweight public health check endpoint for uptime ping services."""
    return {"status": "alive", "message": "InstaRepo backend is running.", "project": settings.PROJECT_NAME}
