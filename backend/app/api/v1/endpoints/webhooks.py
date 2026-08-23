import json
import logging
from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
try:
    from svix.webhooks import Webhook, WebhookVerificationError
    HAS_SVIX = True
except ImportError:
    Webhook = None
    WebhookVerificationError = Exception
    HAS_SVIX = False

from app.core.config import settings
from app.core.database import get_db
from app.models.profile import Profile, default_parsed_data
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/clerk")
async def clerk_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Clerk Webhook endpoint for database synchronization.
    Handles user.created, user.updated, and user.deleted events.
    Verifies Svix signature headers when CLERK_WEBHOOK_SIGNING_SECRET is set.
    """
    payload = await request.body()
    headers = {
        "svix-id": request.headers.get("svix-id", ""),
        "svix-timestamp": request.headers.get("svix-timestamp", ""),
        "svix-signature": request.headers.get("svix-signature", ""),
    }

    if settings.CLERK_WEBHOOK_SIGNING_SECRET:
        if not HAS_SVIX:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="svix library is required for webhook signature verification. Install with 'pip install svix'."
            )
        try:
            wh = Webhook(settings.CLERK_WEBHOOK_SIGNING_SECRET)
            evt = wh.verify(payload, headers)
        except WebhookVerificationError as e:
            logger.error(f"Clerk webhook signature verification failed: {e}")

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Webhook verification failed: {str(e)}"
            )
    else:
        # If signing secret is not configured (development fallback)
        logger.warning("CLERK_WEBHOOK_SIGNING_SECRET is not set. Processing unverified webhook payload.")
        try:
            evt = json.loads(payload.decode("utf-8"))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid JSON payload: {str(e)}"
            )

    event_type = evt.get("type")
    data = evt.get("data", {})
    logger.info(f"Received Clerk webhook event: {event_type}")

    if event_type == "user.created":
        await _handle_user_created(data, db)
    elif event_type == "user.updated":
        await _handle_user_updated(data, db)
    elif event_type == "user.deleted":
        await _handle_user_deleted(data, db)

    return {"status": "success", "event": event_type}


async def _handle_user_created(data: Dict[str, Any], db: AsyncSession) -> None:
    clerk_id = data.get("id")
    email_addresses = data.get("email_addresses", [])
    primary_email = None
    if email_addresses and isinstance(email_addresses, list) and len(email_addresses) > 0:
        primary_email = email_addresses[0].get("email_address")

    first_name = data.get("first_name") or ""
    last_name = data.get("last_name") or ""
    full_name = f"{first_name} {last_name}".strip()

    if not clerk_id or not primary_email:
        logger.warning(f"user.created skipped: missing clerk_id ({clerk_id}) or email ({primary_email})")
        return

    primary_email = primary_email.lower()

    # Check if user exists by clerk_id or email
    stmt = select(User).where((User.clerk_id == clerk_id) | (User.email == primary_email))
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user:
        if not user.clerk_id:
            user.clerk_id = clerk_id
            db.add(user)
    else:
        user = User(
            clerk_id=clerk_id,
            email=primary_email,
            is_active=True
        )
        db.add(user)
        await db.flush()

    # Ensure profile exists
    prof_stmt = select(Profile).where(Profile.user_id == user.id)
    prof_result = await db.execute(prof_stmt)
    profile = prof_result.scalar_one_or_none()

    if not profile:
        parsed = default_parsed_data()
        if full_name:
            parsed["personal_info"]["full_name"] = full_name
        parsed["personal_info"]["email"] = primary_email
        profile = Profile(
            user_id=user.id,
            parsed_data=parsed
        )
        db.add(profile)
    else:
        parsed = dict(profile.parsed_data or {})
        personal = dict(parsed.get("personal_info") or {})
        if full_name and not personal.get("full_name"):
            personal["full_name"] = full_name
        personal["email"] = primary_email
        parsed["personal_info"] = personal
        profile.parsed_data = parsed
        db.add(profile)

    await db.commit()
    logger.info(f"Synced user.created for clerk_id={clerk_id}, email={primary_email}")


async def _handle_user_updated(data: Dict[str, Any], db: AsyncSession) -> None:
    clerk_id = data.get("id")
    email_addresses = data.get("email_addresses", [])
    primary_email = None
    if email_addresses and isinstance(email_addresses, list) and len(email_addresses) > 0:
        primary_email = email_addresses[0].get("email_address")

    first_name = data.get("first_name") or ""
    last_name = data.get("last_name") or ""
    full_name = f"{first_name} {last_name}".strip()

    if not clerk_id:
        logger.warning("user.updated skipped: missing clerk_id")
        return

    stmt = select(User).where(User.clerk_id == clerk_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user and primary_email:
        primary_email = primary_email.lower()
        stmt = select(User).where(User.email == primary_email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

    if user:
        if clerk_id:
            user.clerk_id = clerk_id
        if primary_email:
            user.email = primary_email.lower()
        db.add(user)

        prof_stmt = select(Profile).where(Profile.user_id == user.id)
        prof_result = await db.execute(prof_stmt)
        profile = prof_result.scalar_one_or_none()

        if profile:
            parsed = dict(profile.parsed_data or {})
            personal = dict(parsed.get("personal_info") or {})
            if full_name:
                personal["full_name"] = full_name
            if primary_email:
                personal["email"] = primary_email.lower()
            parsed["personal_info"] = personal
            profile.parsed_data = parsed
            db.add(profile)

        await db.commit()
        logger.info(f"Synced user.updated for clerk_id={clerk_id}")
    else:
        logger.warning(f"user.updated: user not found for clerk_id={clerk_id}")


async def _handle_user_deleted(data: Dict[str, Any], db: AsyncSession) -> None:
    clerk_id = data.get("id")
    if not clerk_id:
        return

    stmt = select(User).where(User.clerk_id == clerk_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user:
        await db.delete(user)
        await db.commit()
        logger.info(f"Synced user.deleted for clerk_id={clerk_id}")
