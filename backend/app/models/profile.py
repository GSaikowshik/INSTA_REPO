import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any
from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User

def default_parsed_data() -> dict[str, Any]:
    return {
        "personal_info": {
            "full_name": "",
            "title": "",
            "email": "",
            "phone": "",
            "location": "",
            "summary": "",
            "github_url": "",
            "linkedin_url": "",
            "website_url": ""
        },
        "experiences": [],
        "education": [],
        "skills": [],
        "projects": []
    }

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    
    # Crucial JSONB column holding strictly structured resume / portfolio data
    parsed_data: Mapped[dict[str, Any]] = mapped_column(
        JSONB, nullable=False, default=default_parsed_data
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationship back to User
    user: Mapped["User"] = relationship("User", back_populates="profile")
