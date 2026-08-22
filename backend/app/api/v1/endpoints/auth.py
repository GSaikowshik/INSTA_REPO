from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.profile import Profile, default_parsed_data
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserResponse, UserUpdateRequest

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Register a new user and initialize an associated Profile with parsed_data JSONB."""
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    user = User(
        email=user_in.email.lower(),
        hashed_password=hash_password(user_in.password),
        is_active=True
    )
    db.add(user)
    await db.flush()  # Populate user.id

    # Create associated profile record with structured JSONB default
    profile = Profile(
        user_id=user.id,
        parsed_data=default_parsed_data()
    )
    db.add(profile)

    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """OAuth2 compatible token login, get an access token for future requests."""
    result = await db.execute(select(User).where(User.email == form_data.username.lower()))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """Fetch profile info of current logged-in user."""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_me(
    user_in: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update current logged-in user email/name and sync with profile JSONB."""
    if user_in.email and user_in.email.lower() != current_user.email:
        result = await db.execute(select(User).where(User.email == user_in.email.lower()))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )
        current_user.email = user_in.email.lower()

    if user_in.name is not None and hasattr(current_user, "name"):
        setattr(current_user, "name", user_in.name)

    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    user_profile = result.scalar_one_or_none()
    if user_profile:
        parsed = dict(user_profile.parsed_data or {})
        personal = dict(parsed.get("personal_info") or {})
        if user_in.name is not None:
            personal["full_name"] = user_in.name
        if user_in.email is not None:
            personal["email"] = user_in.email.lower()
        if user_in.title is not None:
            personal["title"] = user_in.title
        if user_in.bio is not None:
            personal["summary"] = user_in.bio
        if user_in.github_url is not None:
            personal["github_url"] = user_in.github_url
        if user_in.linkedin_url is not None:
            personal["linkedin_url"] = user_in.linkedin_url
        if user_in.website_url is not None:
            personal["website_url"] = user_in.website_url
        if user_in.photo_url is not None:
            personal["photo_url"] = user_in.photo_url

        parsed["personal_info"] = personal
        user_profile.parsed_data = parsed

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user

