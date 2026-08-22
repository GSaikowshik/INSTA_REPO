import uuid
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.portfolio import PortfolioModel
from app.schemas.portfolio import PortfolioSaveRequest, PortfolioResponse

router = APIRouter()

@router.post("", response_model=PortfolioResponse)
@router.post("/", response_model=PortfolioResponse)
async def save_or_update_portfolio(
    payload: PortfolioSaveRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Saves a new portfolio or updates an existing portfolio if payload.id is provided.
    """
    if payload.id:
        result = await db.execute(
            select(PortfolioModel).where(PortfolioModel.id == payload.id, PortfolioModel.user_id == current_user.id)
        )
        existing = result.scalar_one_or_none()
        if existing:
            existing.title = payload.title or existing.title
            existing.theme_config = payload.theme_config or existing.theme_config
            if payload.content is not None:
                existing.content = payload.content
            await db.commit()
            await db.refresh(existing)
            return existing

    new_portfolio = PortfolioModel(
        id=payload.id or uuid.uuid4(),
        user_id=current_user.id,
        title=payload.title or "Untitled Portfolio",
        theme_config=payload.theme_config or {},
        content=payload.content or {}
    )
    db.add(new_portfolio)
    await db.commit()
    await db.refresh(new_portfolio)
    return new_portfolio


@router.get("", response_model=List[PortfolioResponse])
@router.get("/", response_model=List[PortfolioResponse])
async def list_portfolios(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns a list of all saved portfolios for the current_user, ordered by updated_at descending.
    """
    result = await db.execute(
        select(PortfolioModel)
        .where(PortfolioModel.user_id == current_user.id)
        .order_by(desc(PortfolioModel.updated_at))
    )
    return result.scalars().all()


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(
    portfolio_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves a single saved portfolio configuration by ID.
    """
    result = await db.execute(
        select(PortfolioModel).where(PortfolioModel.id == portfolio_id, PortfolioModel.user_id == current_user.id)
    )
    portfolio = result.scalar_one_or_none()
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found."
        )
    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    portfolio_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Deletes a saved portfolio by ID.
    """
    result = await db.execute(
        select(PortfolioModel).where(PortfolioModel.id == portfolio_id, PortfolioModel.user_id == current_user.id)
    )
    portfolio = result.scalar_one_or_none()
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found."
        )
    await db.delete(portfolio)
    await db.commit()
    return None
