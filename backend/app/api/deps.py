import logging
import uuid
from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.profile import Profile, default_parsed_data
from app.models.user import User

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> User:
    """
    Validates Clerk or local JWT token and returns the authenticated User instance.
    If a valid Clerk user is authenticated but not yet provisioned in PostgreSQL,
    this dependency automatically creates the User and initial Profile record.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    sub: Optional[str] = payload.get("sub")
    if not sub:
        raise credentials_exception

    # 1. Match by clerk_id (e.g. user_2t...)
    result = await db.execute(select(User).where(User.clerk_id == sub))
    user = result.scalar_one_or_none()

    # 2. Match by UUID id (for local legacy users)
    if user is None:
        try:
            user_uuid = uuid.UUID(sub)
            result = await db.execute(select(User).where(User.id == user_uuid))
            user = result.scalar_one_or_none()
        except ValueError:
            user = None

    # 3. Match by email if present in payload
    user_email = payload.get("email") or payload.get("primary_email") or payload.get("email_address")
    if user is None and user_email:
        user_email_clean = str(user_email).lower()
        result = await db.execute(select(User).where(User.email == user_email_clean))
        user = result.scalar_one_or_none()
        if user:
            user.clerk_id = sub
            db.add(user)
            await db.commit()
            await db.refresh(user)

    # 4. Auto-provision user & profile if Clerk authenticated user is missing from DB
    if user is None:
        email = (user_email or f"{sub}@clerk.user").lower()
        logger.info(f"Auto-provisioning missing DB User & Profile for Clerk user sub={sub}")
        
        user = User(
            clerk_id=sub,
            email=email,
            is_active=True
        )
        db.add(user)
        await db.flush()  # Populate user.id

        profile = Profile(
            user_id=user.id,
            parsed_data=default_parsed_data()
        )
        db.add(profile)
        await db.commit()
        await db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )

    return user
