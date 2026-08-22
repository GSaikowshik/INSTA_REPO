import uuid
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict

class PortfolioSaveRequest(BaseModel):
    id: Optional[uuid.UUID] = None
    title: str = "Untitled Portfolio"
    theme_config: Dict[str, Any] = {}
    content: Optional[Dict[str, Any]] = None

class PortfolioResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    theme_config: Dict[str, Any]
    content: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
