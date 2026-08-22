import uuid
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeResponse

router = APIRouter()

@router.post("", response_model=ResumeResponse)
@router.post("/", response_model=ResumeResponse)
async def save_or_update_resume(
    payload: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Saves a new resume or updates an existing resume if payload.id is provided.
    """
    if payload.id:
        result = await db.execute(
            select(Resume).where(Resume.id == payload.id, Resume.user_id == current_user.id)
        )
        existing_resume = result.scalar_one_or_none()
        if existing_resume:
            existing_resume.title = payload.title or existing_resume.title
            existing_resume.content = payload.content
            await db.commit()
            await db.refresh(existing_resume)
            return existing_resume

    new_resume = Resume(
        id=payload.id or uuid.uuid4(),
        user_id=current_user.id,
        title=payload.title or "Untitled Resume",
        content=payload.content
    )
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    return new_resume


@router.get("", response_model=List[ResumeResponse])
@router.get("/", response_model=List[ResumeResponse])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns a list of all saved resumes for the current_user, ordered by updated_at descending.
    """
    result = await db.execute(
        select(Resume)
        .where(Resume.user_id == current_user.id)
        .order_by(desc(Resume.updated_at))
    )
    return result.scalars().all()


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves a single saved resume by ID.
    """
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found."
        )
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Deletes a saved resume by ID.
    """
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found."
        )
    await db.delete(resume)
    await db.commit()
    return None
