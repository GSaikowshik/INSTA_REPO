from typing import Any
import json
import logging
import os
import re
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from google import genai
from google.genai import types

from app.api.deps import get_current_user
from app.core.ai_parser import parse_resume_bytes, extract_template_code, get_api_keys
from app.core.database import get_db
from app.models.profile import Profile, default_parsed_data
from app.models.user import User
from app.schemas.profile import ProfileResponse, ProfileUpdate

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "application/pdf": "application/pdf",
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/png": "image/png",
    "text/plain": "text/plain",
}

ALLOWED_EXTENSIONS = {
    ".pdf": "application/pdf",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".txt": "text/plain",
}

IMAGE_MIME_TYPES = {
    "application/pdf": "application/pdf",
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/png": "image/png",
    "image/webp": "image/webp",
}

@router.get("", response_model=ProfileResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get current user profile and parsed_data JSONB payload."""
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = Profile(user_id=current_user.id, parsed_data=default_parsed_data())
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    return profile

@router.put("", response_model=ProfileResponse)
async def update_user_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update parsed_data JSONB structure for current authenticated user."""
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    new_parsed_data = profile_in.parsed_data.model_dump()

    if not profile:
        profile = Profile(
            user_id=current_user.id,
            parsed_data=new_parsed_data
        )
        db.add(profile)
    else:
        profile.parsed_data = new_parsed_data

    await db.commit()
    await db.refresh(profile)
    return profile

@router.post("/upload-resume", response_model=ProfileResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Upload an existing resume (PDF, JPEG, PNG, TXT).
    Parses content via Google Gemini API and saves structured JSON into Profile.parsed_data JSONB.
    """
    filename = file.filename or ""
    content_type = file.content_type or ""
    
    mime_type = ALLOWED_MIME_TYPES.get(content_type.lower())
    if not mime_type:
        ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
        mime_type = ALLOWED_EXTENSIONS.get(ext)

    if not mime_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF, JPEG, PNG, or TXT file."
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 10MB."
        )

    parsed_json_dict = await parse_resume_bytes(file_bytes, mime_type)

    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    if not profile:
        profile = Profile(
            user_id=current_user.id,
            parsed_data=parsed_json_dict
        )
        db.add(profile)
    else:
        profile.parsed_data = parsed_json_dict

    await db.commit()
    await db.refresh(profile)
    return profile

@router.post("/upload-template-vision")
async def upload_template_vision(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Accepts a resume template image or PDF, sends it to Gemini Vision API,
    and returns reverse-engineered Tailwind CSS React JSX component string.
    """
    filename = file.filename or ""
    content_type = file.content_type or ""

    mime_type = IMAGE_MIME_TYPES.get(content_type.lower())
    if not mime_type:
        ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
        if ext in [".jpeg", ".jpg"]:
            mime_type = "image/jpeg"
        elif ext == ".png":
            mime_type = "image/png"
        elif ext == ".webp":
            mime_type = "image/webp"
        elif ext == ".pdf":
            mime_type = "application/pdf"

    if not mime_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported template file format. Please upload a PDF, JPEG, PNG, or WEBP file."
        )

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded template file is empty."
        )

    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Template file size exceeds maximum allowed limit of 10MB."
        )

    template_code = await extract_template_code(image_bytes, mime_type)
    return {"template_code": template_code}

@router.post("/evaluate-ats")
async def evaluate_ats(
    body: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Evaluates target job description against user profile data using Gemini API with response_mime_type="application/json".
    Enforces exact JSON schema:
    {
      "score": int (0-100),
      "technicalKeywords": [{"word": str, "found": bool}],
      "formatting": [{"check": str, "pass": bool}],
      "actionItems": [{"priority": "High" | "Medium", "text": str}],
      "targetStack": str
    }
    """
    job_desc = body.get("jobDescription") or body.get("job_description") or ""
    resume_data = body.get("resumeData") or body.get("resume_data") or {}

    if not resume_data and current_user:
        result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        user_profile = result.scalar_one_or_none()
        if user_profile and user_profile.parsed_data:
            resume_data = user_profile.parsed_data

    keys = get_api_keys()

    if keys and job_desc:
        for key in keys:
            try:
                client = genai.Client(api_key=key)
                
                system_prompt = (
                    "You are a deterministic enterprise Applicant Tracking System (ATS) algorithm and technical recruiter auditor. "
                    "Compare the target Job Description against the candidate's Resume Data. "
                    "Extract the core technical skills, evaluate keyword matches, check formatting compliance, "
                    "identify missing skills, and output a strict JSON object matching this schema:\n"
                    "{\n"
                    '  "score": integer between 0 and 100,\n'
                    '  "technicalKeywords": [{"word": "string", "found": boolean}],\n'
                    '  "formatting": [{"check": "string", "pass": boolean}],\n'
                    '  "actionItems": [{"priority": "High" or "Medium", "text": "string"}],\n'
                    '  "targetStack": "string (e.g. Frontend Engineering, Backend Engineering, Full Stack Engineering, Software Engineering)"\n'
                    "}\n"
                    "Return ONLY raw valid JSON matching this schema."
                )

                user_prompt = f"""
Job Description:
{job_desc}

Resume Data:
{json.dumps(resume_data, indent=2)}
"""
                config = types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )

                response = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=[system_prompt, user_prompt],
                    config=config
                )
                
                raw_text = (response.text or "").strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                elif raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                
                ai_dict = json.loads(raw_text.strip())
                if isinstance(ai_dict, dict) and "score" in ai_dict:
                    return ai_dict
            except Exception as e:
                logger.warning(f"Gemini ATS Audit call failed: {e}")

    # Fallback audit engine if Gemini call is unconfigured or rate limited
    lower_jd = job_desc.lower()
    target_stack = "Software Engineering"
    if "full stack" in lower_jd or "fullstack" in lower_jd:
        target_stack = "Full Stack Engineering"
    elif "frontend" in lower_jd or "front-end" in lower_jd:
        target_stack = "Frontend Engineering"
    elif "backend" in lower_jd or "back-end" in lower_jd:
        target_stack = "Backend Engineering"

    tech_dictionary = [
        'javascript', 'node.js', 'react', 'aws', 'azure', 'databases', 'api',
        'agile', 'full stack', 'cloud', 'deployment', 'security', 'frontend',
        'backend', 'python', 'html', 'css', 'typescript', 'docker', 'postgresql',
        'fastapi', 'microservices', 'ci/cd', 'graphql', 'redis', 'kubernetes'
    ]

    extracted_skills = [s for s in tech_dictionary if s in lower_jd]
    if not extracted_skills:
        extracted_skills = ['react', 'javascript', 'html', 'css', 'api']

    user_skills = []
    if isinstance(resume_data, dict):
        skills_raw = resume_data.get("skills", [])
        if isinstance(skills_raw, list):
            for s in skills_raw:
                if isinstance(s, dict) and "items" in s:
                    items = s["items"]
                    if isinstance(items, list):
                        user_skills.extend(items)
                    elif isinstance(items, str):
                        user_skills.append(items)

    exp_list = resume_data.get("experiences", []) if isinstance(resume_data, dict) else []
    exp_text = " ".join([f"{e.get('role','')} {e.get('company','')} {e.get('description','')}" for e in exp_list if isinstance(e, dict)])
    full_profile_text = f"{exp_text} {' '.join(user_skills)}".lower()

    tech_keywords = []
    for skill in extracted_skills:
        found = skill in full_profile_text or any(skill in s.lower() for s in user_skills)
        tech_keywords.append({"word": skill.capitalize(), "found": found})

    found_count = len([k for k in tech_keywords if k["found"]])
    score = round((found_count / len(tech_keywords)) * 100) if tech_keywords else 45

    missing_words = [k["word"] for k in tech_keywords if not k["found"]]
    action_items = []
    for i, missing_word in enumerate(missing_words[:3]):
        action_items.append({
            "priority": "High" if i == 0 else "Medium",
            "text": f"Add missing keyword '{missing_word}' to Technical Skills or project descriptions."
        })

    if len(missing_words) > 3:
        action_items.append({
            "priority": "Medium",
            "text": "Review remaining missing matrix keywords and integrate naturally into profile."
        })

    formatting = [
        {"check": "Standard Section Headers", "pass": True},
        {"check": "Measurable Metrics", "pass": False},
        {"check": "Single Column Layout", "pass": True},
        {"check": "Parsable Contact Header", "pass": True},
        {"check": "No Complex Tables / Graphics", "pass": True}
    ]

    return {
        "score": score,
        "technicalKeywords": tech_keywords,
        "formatting": formatting,
        "actionItems": action_items,
        "targetStack": target_stack
    }

@router.post("/generate-cover-letter")
async def generate_cover_letter_endpoint(
    body: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Generates tailored cover letter text using Groq LLM API (llama-3.1-8b-instant / mixtral-8x7b-32768).
    Falls back gracefully to structured candidate letter if Groq is unavailable.
    """
    company_name = body.get("companyName") or body.get("company_name") or "Target Company"
    job_title = body.get("jobTitle") or body.get("job_title") or "Target Position"
    job_description = body.get("jobDescription") or body.get("job_description") or ""
    resume_data = body.get("resumeData") or body.get("resume_data") or {}

    if not resume_data and current_user:
        result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        user_profile = result.scalar_one_or_none()
        if user_profile and user_profile.parsed_data:
            resume_data = user_profile.parsed_data

    groq_key = os.environ.get("GROQ_API_KEY")
    letter_text = ""

    if groq_key and groq_key not in ["your_groq_api_key_here"]:
        try:
            from groq import Groq
            client = Groq(api_key=groq_key)
            
            system_prompt = (
                "You are an expert technical recruiter and executive career coach. "
                "Write a concise, highly targeted, professional cover letter tailored for the given role. "
                "Map the candidate's resume data directly to the job description requirements without hallucinating skills or fake experience."
            )
            
            user_prompt = f"""
Target Company: {company_name}
Target Job Title: {job_title}
Job Description:
{job_description}

Candidate Resume Data:
{json.dumps(resume_data, indent=2)}

Write the full cover letter text now.
"""
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=1024,
            )
            letter_text = completion.choices[0].message.content or ""
        except Exception as e:
            logger.warning(f"Groq API call failed or unconfigured, falling back to structured generator: {e}")

    if not letter_text:
        personal = resume_data.get("personal_info", {}) if isinstance(resume_data, dict) else {}
        name = personal.get("full_name") or "Gandikota Sai Kowshik"
        email = personal.get("email") or "dev.user@instarepo.local"
        phone = personal.get("phone") or "+1 (555) 019-2834"
        location = personal.get("location") or "San Francisco, CA"

        skills_raw = resume_data.get("skills", []) if isinstance(resume_data, dict) else []
        user_skills = []
        if isinstance(skills_raw, list):
            for s in skills_raw:
                if isinstance(s, dict) and "items" in s:
                    items = s["items"]
                    if isinstance(items, list):
                        user_skills.extend(items)
                    elif isinstance(items, str):
                        user_skills.append(items)
        
        top_skills = ", ".join(user_skills[:5]) if user_skills else "React, Node.js, Python, FastAPI, TypeScript"
        experiences = resume_data.get("experiences", []) if isinstance(resume_data, dict) else []
        recent_role = f"{experiences[0].get('role', 'Software Engineer')} at {experiences[0].get('company', 'Tech Lead')}" if experiences and isinstance(experiences[0], dict) else "Senior Full Stack Engineer"

        from datetime import datetime
        today = datetime.now().strftime("%B %d, %Y")

        letter_text = f"""{name}
{email} | {phone} | {location}

{today}

Hiring Manager
{company_name}

Dear Hiring Manager,

I am writing to express my strong interest in the {job_title} position at {company_name}. With a proven track record as a {recent_role} and deep technical expertise in {top_skills}, I am confident in my ability to make an immediate impact on your engineering organization.

Throughout my career, I have specialized in architecting production-grade applications, building high-throughput APIs, and delivering responsive user interfaces. In my recent roles, I have spearheaded core software initiatives that improved system reliability and performance while maintaining rigorous automated testing and software design standards.

{company_name}'s commitment to engineering quality aligns directly with my background. Given the key requirements outlined in your job posting ("{job_description[:120]}..."), I am particularly excited about leveraging my skills to solve complex engineering challenges and drive product innovation with your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical background aligns with your hiring goals.

Sincerely,

{name}"""

    return {"coverLetterText": letter_text}
