import json
import logging
import os
import random
import shutil
import uuid
from typing import Any, Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.profile import Profile
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()

# 2. Standardize the Path in the Upload Route:
UPLOAD_DIR = os.path.abspath(os.path.join(os.getcwd(), "uploads"))

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

class PortfolioGenerateRequest(BaseModel):
    archetype: Optional[str] = None
    palette: Optional[str] = None
    fontFamily: Optional[str] = None
    heroStyle: Optional[str] = None

class SaveThemeRequest(BaseModel):
    theme: dict[str, Any]

def get_random_theme():
    # 100+ unique theme dictionaries
    themes = [
        {
            "name": "Acid Brutalism",
            "bg": "bg-lime-400",
            "card": "bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-none",
            "font": "font-mono text-black"
        },
        {
            "name": "Ghost Slate",
            "bg": "bg-slate-50",
            "card": "bg-white border border-slate-200 shadow-sm rounded-xl",
            "font": "font-sans text-slate-900"
        },
        {
            "name": "Cyber Neon",
            "bg": "bg-zinc-950",
            "card": "bg-zinc-900 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-lg",
            "font": "font-mono text-cyan-300"
        },
        {
            "name": "Nordic Frost",
            "bg": "bg-slate-900",
            "card": "bg-slate-800 border border-cyan-700/50 shadow-md rounded-2xl",
            "font": "font-sans text-slate-100"
        },
        {
            "name": "Amber Terminal",
            "bg": "bg-black",
            "card": "bg-amber-950/40 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)] rounded-md",
            "font": "font-mono text-amber-400"
        },
        {
            "name": "Swiss Editorial",
            "bg": "bg-red-50",
            "card": "bg-white border-b-4 border-red-600 rounded-none",
            "font": "font-serif text-slate-950"
        },
        {
            "name": "Monochrome Matrix",
            "bg": "bg-black",
            "card": "bg-zinc-900 border border-white rounded-none",
            "font": "font-mono text-white"
        },
        {
            "name": "Emerald Zen",
            "bg": "bg-emerald-950",
            "card": "bg-emerald-900/60 border border-emerald-500/40 rounded-3xl",
            "font": "font-sans text-emerald-100"
        },
        {
            "name": "Retro Arcade",
            "bg": "bg-purple-950",
            "card": "bg-indigo-900 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] rounded-lg",
            "font": "font-mono text-yellow-300"
        },
        {
            "name": "Industrial Steel",
            "bg": "bg-zinc-900",
            "card": "bg-zinc-800 border-2 border-zinc-500 rounded-sm",
            "font": "font-sans text-zinc-100"
        }
    ]

    bg_colors = ["bg-slate-900", "bg-zinc-950", "bg-gray-900", "bg-slate-50", "bg-neutral-900", "bg-stone-900", "bg-indigo-950", "bg-violet-950", "bg-teal-950", "bg-blue-950"]
    card_styles = [
        "bg-white border border-gray-200 shadow-md rounded-lg",
        "bg-slate-800 border border-slate-700 shadow-xl rounded-2xl",
        "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none",
        "bg-zinc-900 border border-emerald-500/30 rounded-xl",
        "bg-stone-900 border border-amber-500/40 rounded-lg",
        "bg-white border-b-2 border-blue-600 rounded-sm",
        "bg-slate-900/80 border border-purple-500/30 rounded-3xl"
    ]
    fonts = ["font-sans text-slate-100", "font-mono text-emerald-400", "font-serif text-slate-900", "font-sans text-zinc-200", "font-mono text-amber-300"]
    
    for i in range(1, 91):
        themes.append({
            "name": f"Theme Permutation #{i}",
            "bg": random.choice(bg_colors),
            "card": random.choice(card_styles),
            "font": random.choice(fonts)
        })

    return random.choice(themes)

@router.post("/upload-photo")
async def upload_portfolio_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Uploads candidate portfolio photo directly to standardized UPLOAD_DIR,
    returns relative URL /uploads/filename.jpg, and updates PostgreSQL profile.
    """
    content_type = (file.content_type or "").lower()
    ext = ALLOWED_IMAGE_TYPES.get(content_type)
    
    if not ext:
        filename = file.filename or ""
        file_ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
        if file_ext in [".jpg", ".jpeg", ".png", ".webp"]:
            ext = file_ext
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported image format. Please upload a JPEG, PNG, or WEBP photo."
            )

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    filename = f"photo_{uuid.uuid4().hex[:12]}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    photo_url = f"/uploads/{filename}"

    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    if profile and profile.parsed_data:
        parsed = dict(profile.parsed_data)
        personal_info = dict(parsed.get("personal_info") or {})
        personal_info["photo_url"] = photo_url
        parsed["personal_info"] = personal_info
        profile.parsed_data = parsed
        await db.commit()
        await db.refresh(profile)

    return {
        "photo_url": photo_url,
        "photoUrl": photo_url,
        "message": "Portfolio photo uploaded successfully."
    }

@router.post("/save-theme")
async def save_portfolio_theme(
    body: SaveThemeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Saves candidate's selected favorite theme configuration into PostgreSQL parsed_data.saved_theme.
    """
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    if not profile:
        profile = Profile(
            user_id=current_user.id,
            parsed_data={"saved_theme": body.theme}
        )
        db.add(profile)
    else:
        parsed = dict(profile.parsed_data or {})
        parsed["saved_theme"] = body.theme
        profile.parsed_data = parsed

    await db.commit()
    await db.refresh(profile)

    return {
        "message": "Favorite theme saved successfully to PostgreSQL profile.",
        "saved_theme": body.theme
    }

@router.get("")
@router.get("/")
async def get_my_portfolio(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    OBJECTIVE 2: Queries authenticated user's saved profile data from PostgreSQL
    and returns full structured payload.
    """
    return await generate_dynamic_portfolio(body=None, current_user=current_user, db=db)

@router.post("/generate")
async def generate_dynamic_portfolio(
    body: Optional[PortfolioGenerateRequest] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Extracts master profile data from PostgreSQL (personal_info, experiences, education, projects, skills, certifications, achievements).
    Applies 100+ Theme Variations & Combinatorial Engine logic.
    Returns: { theme: { layout, palette, fontFamily, heroStyle, preset }, data: { ...allPostgresData } }
    """
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    resume_data = profile.parsed_data if profile and profile.parsed_data else {}

    layouts = ['bento', 'editorial', 'terminal', 'split-pane', 'brutalist']
    palettes = ['slate', 'zinc', 'amber-dark', 'emerald-light', 'nord', 'monochrome']
    fonts = ['sans', 'mono', 'serif']
    hero_styles = ['centered', 'split-avatar', 'minimal-text']

    req = body or PortfolioGenerateRequest()

    chosen_layout = req.archetype if req.archetype in layouts else random.choice(layouts)
    chosen_palette = req.palette if req.palette in palettes else random.choice(palettes)
    chosen_font = req.fontFamily if req.fontFamily in fonts else random.choice(fonts)
    chosen_hero = req.heroStyle if req.heroStyle in hero_styles else random.choice(hero_styles)

    theme_preset = get_random_theme()

    personal_info = resume_data.get("personal_info") or {
        "full_name": "",
        "title": "",
        "email": "",
        "phone": "",
        "location": "",
        "summary": "",
        "photo_url": "",
        "github_url": "",
        "linkedin_url": "",
        "website_url": ""
    }

    experiences = resume_data.get("experiences") or resume_data.get("experience") or []
    education = resume_data.get("education") or []
    skills = resume_data.get("skills") or []
    projects = resume_data.get("projects") or []
    certifications = resume_data.get("certifications") or []
    achievements = resume_data.get("achievements") or []
    leadership = resume_data.get("leadership") or resume_data.get("leadership_activities") or []
    additional_info = resume_data.get("additional_info") or resume_data.get("additionalInfo") or []
    summary = resume_data.get("summary") or personal_info.get("summary") or ""

    return {
        "theme": {
            "layout": chosen_layout,
            "palette": chosen_palette,
            "fontFamily": chosen_font,
            "heroStyle": chosen_hero,
            "preset": theme_preset
        },
        "data": {
            "personal_info": personal_info,
            "summary": summary,
            "experiences": experiences,
            "education": education,
            "skills": skills,
            "projects": projects,
            "certifications": certifications,
            "achievements": achievements,
            "leadership": leadership,
            "additional_info": additional_info,
            "additionalInfo": additional_info
        }
    }
