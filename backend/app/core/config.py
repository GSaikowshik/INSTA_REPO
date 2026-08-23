import os
from typing import Optional
from pydantic import ValidationInfo, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Insta Repo API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super_secret_jwt_key_insta_repo_2026_change_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "insta_repo"
    DATABASE_URL: Optional[str] = None

    GEMINI_API_KEY: Optional[str] = None
    GEMINI_API_KEY_BACKUP: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    CLERK_SECRET_KEY: Optional[str] = None
    CLERK_WEBHOOK_SIGNING_SECRET: Optional[str] = None
    CLERK_JWKS_URL: Optional[str] = "https://api.clerk.com/v1/jwks"


    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> str:
        env_db_url = os.getenv("DATABASE_URL")
        db_url = (v if isinstance(v, str) and v.strip() else env_db_url)
        
        if isinstance(db_url, str) and db_url.strip():
            url_str = db_url.strip()
            if url_str.startswith("postgres://"):
                url_str = url_str.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url_str.startswith("postgresql://") and "asyncpg" not in url_str:
                url_str = url_str.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url_str
            
        data = info.data
        user = data.get("POSTGRES_USER", "postgres")
        password = data.get("POSTGRES_PASSWORD", "postgres")
        server = data.get("POSTGRES_SERVER", "localhost")
        port = data.get("POSTGRES_PORT", 5432)
        db = data.get("POSTGRES_DB", "insta_repo")
        return f"postgresql+asyncpg://{user}:{password}@{server}:{port}/{db}"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
