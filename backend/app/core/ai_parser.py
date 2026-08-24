import asyncio
import json
import logging
import os
import uuid
from typing import Any
from fastapi import HTTPException, status
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.core.config import settings

logger = logging.getLogger(__name__)

# Load primary and backup Gemini API keys
PRIMARY_KEY = os.environ.get("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
BACKUP_KEY = os.environ.get("GEMINI_API_KEY_BACKUP") or getattr(settings, "GEMINI_API_KEY_BACKUP", None)


def get_api_keys() -> list[str]:
    keys = []
    if PRIMARY_KEY and PRIMARY_KEY not in ["your_gemini_api_key_here", "gemini_placeholder"]:
        keys.append(PRIMARY_KEY)
    if BACKUP_KEY and BACKUP_KEY not in ["your_gemini_api_key_here", "gemini_placeholder"] and BACKUP_KEY not in keys:
        keys.append(BACKUP_KEY)
    return keys


PROMPT_TEXT = """
Parse this resume into a strict JSON object with the following keys:
- 'personal_info' (dict with fields: full_name, title, email, phone, location, summary, github_url, linkedin_url, website_url)
- 'experience' (array of dicts with unique string 'id' for each item, plus fields: company, role, start_date, end_date, is_current, bulletPoints (List[str]), highlights (List[str]), description (List[str]))
- 'education' (array of dicts with unique string 'id' for each item, plus fields: institution, degree, field_of_study, start_date, end_date, gpa)
- 'skills' (array of category dicts like {"category": "Programming", "items": ["Python", "JavaScript"]})
- 'projects' (array of dicts with unique string 'id' for each item, plus fields: title, description, highlights (List[str]), bulletPoints (List[str]), technologies, repo_url, live_url)
- 'certifications' (array of dicts with unique string 'id' for each item, plus fields: name, issuer, issue_date, expiration_date, credential_url). IMPORTANT: Aggressively extract any professional credentials, training completions, or virtual internships even if they are under different headers. Explicitly look for and include items like Deep Learning competencies, Cloud certifications, and academy programs (e.g., SmartBridge, Hack2skill) in this array.
- 'achievements' (array of strings representing awards, honors, or publications)

CRITICAL INSTRUCTIONS FOR WORK EXPERIENCE:
For each work experience, extract the descriptive text and break it down into an array of distinct, professional bullet points under the bulletPoints key. Do not return a single block of text.

CRITICAL INSTRUCTIONS FOR PROJECTS:
For each project, extract the descriptive text and break it down into an array of distinct, professional bullet points under the bulletPoints and highlights keys.

Return ONLY raw JSON matching this structure.
"""

VISION_PROMPT_TEXT = """
You are an expert Principal Frontend Engineer. Analyze this resume template image and reverse-engineer its visual layout and CSS styling into a React component.

THE GOLDEN RULE OF DATA INJECTION:
The image provided is STRICTLY A VISUAL WIREFRAME. You MUST NEVER hardcode any names, emails, companies, dates, or bullet points you read from the image. You must assume all text in the image is fake placeholder text.

You MUST replace every single piece of text with dynamic mapping from the `parsed_data` prop. 

REQUIRED DATA MAPPING:
1. Header: Use `{parsed_data?.personal_info?.full_name}`, `{parsed_data?.personal_info?.email}`, `{parsed_data?.personal_info?.phone}`, etc.
2. Experience: You MUST map the array: `{parsed_data?.experience?.map((exp, idx) => ( ... ))}` using `exp.company`, `exp.role`, `exp.start_date`, `exp.end_date`. For the bullets, use `{exp.highlights?.map(h => <li key={h}>{h}</li>)}`.
3. Projects: You MUST map the array: `{parsed_data?.projects?.map((proj, idx) => ( ... ))}` using `proj.title`, `proj.date`, and `proj.description`.
4. Education: You MUST map the array: `{parsed_data?.education?.map((edu, idx) => ( ... ))}` using `edu.institution`, `edu.degree`, etc.
5. Skills: Map the skills dynamically based on how they are structured in `parsed_data.skills`.

If a section exists in `parsed_data` but not in the image, render it using the image's general styling. If the image has a section that does not exist in `parsed_data`, DO NOT render it.

CRITICAL LAYOUT & MAPPING RULES:
1. **Right-Alignment (Flexbox):** For Education and Work Experience, you MUST use `<div className="flex justify-between items-baseline">` to push locations and dates to the far right side of the page, exactly as seen in standard resumes.
2. **Mandatory Bullets:** You MUST wrap the mapped items for `skills`, `experience.highlights` (or descriptions), and `projects.descriptions` inside `<ul className="list-disc pl-5 space-y-1">`. Do not render them as plain paragraphs. 
   - *Example for Skills:* `<li className="font-bold">{category}: <span className="font-normal">{items}</span></li>`
3. **Single Page Enforcement:** Keep the root container at `w-[210mm] h-[297mm]`, use compact margins (`mb-2`, `mt-3`), and small text (`text-[10.5px]`) to ensure it fits on one page.
4. **Token Optimization:** Do NOT generate complex inline SVG icons. If you need icons, use simple text symbols (like • or -) or assume an icon library is not available. Focus entirely on the layout structure and CSS.

FINAL MANDATORY RULE FOR CERTIFICATIONS:
You MUST completely replace your standard certification mapping with this EXACT React code. Do not change a single line of this logic. If you do not use this exact code, the layout will fail:

<div className="mb-2">
  <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">CERTIFICATION</h2>
  {parsed_data?.certifications?.length > 0 && (
    <>
      <ul className="list-none space-y-0.5">
        {parsed_data.certifications.slice(0, 3).map((c, i) => (
          <li key={i} className="text-[10.5px]">
            <span className="font-bold">{c.name || c.title}</span> {c.issuer ? `(${c.issuer})` : ''}
          </li>
        ))}
      </ul>
      {parsed_data.certifications.length > 3 && (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-0.5 list-none">
          {parsed_data.certifications.slice(3).map((c, i) => (
            <li key={i+3} className="text-[10.5px]">
              <span className="font-bold">{c.name || c.title}</span> {c.issuer ? `(${c.issuer})` : ''}
            </li>
          ))}
        </ul>
      )}
    </>
  )}
</div>

Return ONLY the raw, executable JSX code starting with `<div` and ending with `</div>`. Do NOT include import statements, backticks, or markdown formatting (no ```jsx).
"""


async def parse_resume_bytes(file_bytes: bytes, mime_type: str) -> dict[str, Any]:
    """
    Sends resume file bytes (PDF, JPEG, PNG, TXT) directly to Google Gemini 3.6 Flash API to extract structured JSON.
    Uses automatic dual API key failover (429 quota exhaustion) and 503 exponential backoff retries.
    """
    keys = get_api_keys()
    if not keys:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is not configured in backend/.env file."
        )

    if mime_type.startswith("text/"):
        text_content = file_bytes.decode("utf-8", errors="ignore")
        contents = [text_content, PROMPT_TEXT]
    else:
        part = types.Part.from_bytes(data=file_bytes, mime_type=mime_type)
        contents = [part, PROMPT_TEXT]

    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.1
    )

    raw_response_text = ""

    for key_idx, current_key in enumerate(keys):
        active_client = genai.Client(api_key=current_key)
        max_retries = 3
        key_succeeded = False

        for attempt in range(max_retries):
            try:
                response = active_client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=contents,
                    config=config
                )
                raw_response_text = response.text or ""
                key_succeeded = True
                break
            except Exception as e:
                is_429 = getattr(e, 'code', None) == 429 or '429' in str(e) or 'RESOURCE_EXHAUSTED' in str(e)
                if is_429:
                    if key_idx < len(keys) - 1:
                        print(f"Primary API Key quota reached (429). Switching to backup key...")
                        logger.warning("Primary API Key quota reached (429). Switching to backup key...")
                        break
                    else:
                        logger.error(f"All API Keys exhausted quota (429): {e}")
                        raise HTTPException(
                            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="All AI API keys have reached their daily quota. Please try again later."
                        )

                is_503 = getattr(e, 'code', None) == 503 or '503' in str(e) or 'UNAVAILABLE' in str(e) or 'overloaded' in str(e).lower()
                if is_503 and attempt < max_retries - 1:
                    wait_time = 3 + (attempt * 2)
                    print(f"503 Server overloaded. Retrying in {wait_time} seconds...")
                    logger.warning(f"503 Server overloaded. Retrying attempt {attempt + 1}/{max_retries} in {wait_time} seconds...")
                    await asyncio.sleep(wait_time)
                    continue

                if attempt == max_retries - 1 and key_idx < len(keys) - 1:
                    print(f"Key {key_idx + 1} failed after {max_retries} attempts. Switching to backup key...")
                    logger.warning(f"Key {key_idx + 1} failed after {max_retries} attempts. Switching to backup key...")
                    break
                elif attempt == max_retries - 1:
                    logger.error(f"Resume Parsing API failed after retries across all keys: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="The AI parsing servers are currently experiencing extreme demand. Please try uploading your resume again in a few minutes."
                    )

        if key_succeeded:
            break

    print("RAW AI OUTPUT:", raw_response_text)

    if not raw_response_text:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Empty response received from Gemini API."
        )

    # Clean code block backticks if present
    cleaned_text = raw_response_text.strip()
    if cleaned_text.startswith("```json"):
        cleaned_text = cleaned_text[7:]
    elif cleaned_text.startswith("```"):
        cleaned_text = cleaned_text[3:]
    if cleaned_text.endswith("```"):
        cleaned_text = cleaned_text[:-3]
    cleaned_text = cleaned_text.strip()

    try:
        parsed_json = json.loads(cleaned_text)
    except json.JSONDecodeError as err:
        logger.error(f"JSON decoding error: {err}. Output was: {cleaned_text}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gemini API output could not be parsed as valid JSON: {str(err)}"
        )

    # Standardize data structure and assign unique IDs to list items
    personal_info = parsed_json.get("personal_info") or {}
    experiences = parsed_json.get("experience") or parsed_json.get("experiences") or []
    education = parsed_json.get("education") or []
    skills = parsed_json.get("skills") or []
    projects = parsed_json.get("projects") or []
    certifications = parsed_json.get("certifications") or []
    achievements = parsed_json.get("achievements") or []
    leadership = parsed_json.get("leadership") or []
    additional_info = parsed_json.get("additional_info") or []

    for item in experiences:
        if isinstance(item, dict):
            if "id" not in item:
                item["id"] = str(uuid.uuid4())
            
            # Extract bullet points from bulletPoints, highlights, bullet_points, or description
            raw_bullets = item.get("bulletPoints") or item.get("highlights") or item.get("bullet_points") or []
            if not raw_bullets and item.get("description"):
                desc = item["description"]
                if isinstance(desc, list):
                    raw_bullets = desc
                elif isinstance(desc, str):
                    raw_bullets = [b.strip() for b in desc.split("\n") if b.strip()]
            
            if isinstance(raw_bullets, str):
                bullets = [b.strip() for b in raw_bullets.split("\n") if b.strip()]
            elif isinstance(raw_bullets, list):
                bullets = [str(b).strip() for b in raw_bullets if str(b).strip()]
            else:
                bullets = []

            item["bulletPoints"] = bullets
            item["highlights"] = bullets
            item["bullet_points"] = bullets
            item["description"] = bullets

    for item in education:
        if isinstance(item, dict) and "id" not in item:
            item["id"] = str(uuid.uuid4())

    for item in projects:
        if isinstance(item, dict):
            if "id" not in item:
                item["id"] = str(uuid.uuid4())
            
            raw_bullets = item.get("bulletPoints") or item.get("highlights") or item.get("bullet_points") or []
            if not raw_bullets and item.get("description"):
                desc = item["description"]
                if isinstance(desc, list):
                    raw_bullets = desc
                elif isinstance(desc, str):
                    raw_bullets = [b.strip() for b in desc.split("\n") if b.strip()]
            
            if isinstance(raw_bullets, str):
                bullets = [b.strip() for b in raw_bullets.split("\n") if b.strip()]
            elif isinstance(raw_bullets, list):
                bullets = [str(b).strip() for b in raw_bullets if str(b).strip()]
            else:
                bullets = []

            item["bulletPoints"] = bullets
            item["highlights"] = bullets
            item["bullet_points"] = bullets
            if not item.get("description") or isinstance(item.get("description"), list):
                item["description"] = bullets

    for item in certifications:
        if isinstance(item, dict) and "id" not in item:
            item["id"] = str(uuid.uuid4())

    return {
        "personal_info": personal_info,
        "experience": experiences,
        "experiences": experiences,
        "education": education,
        "skills": skills,
        "projects": projects,
        "certifications": certifications,
        "achievements": achievements,
        "leadership": leadership,
        "additional_info": additional_info,
    }


async def extract_template_code(image_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    """
    Reverse-engineers a resume template image or PDF into executable Tailwind CSS React JSX via Gemini 3.6 Flash Vision API.
    Uses automatic dual API key failover (429 quota exhaustion) and 503 exponential backoff retries.
    """
    keys = get_api_keys()
    if not keys:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is not configured in backend/.env file."
        )

    prompt = """
You are an expert Principal Frontend Engineer. Use the uploaded image ONLY to determine fonts, margins, colors, and border styles. 

YOU MUST USE THE EXACT JSX STRUCTURE BELOW. DO NOT INVENT FIELDS. MAP THE DATA EXACTLY AS SHOWN.

<div className="w-[210mm] min-h-[297mm] bg-white text-black p-8 box-border mx-auto overflow-hidden text-[10.5px] leading-snug">
  
  {/* 1. HEADER */}
  <div className="flex justify-between items-start mb-4 border-b pb-2">
    <div>
      <h1 className="text-xl font-bold uppercase">{parsed_data?.personal_info?.full_name || parsed_data?.basics?.name}</h1>
      {parsed_data?.personal_info?.linkedin_url && <div>LinkedIn: {parsed_data?.personal_info?.linkedin_url}</div>}
      {parsed_data?.personal_info?.github_url && <div>GitHub: {parsed_data?.personal_info?.github_url}</div>}
    </div>
    <div className="text-right">
      {parsed_data?.personal_info?.email && <div>Email: {parsed_data?.personal_info?.email}</div>}
      {parsed_data?.personal_info?.phone && <div>Mobile: {parsed_data?.personal_info?.phone}</div>}
    </div>
  </div>

  {/* 2. EDUCATION */}
  {parsed_data?.education?.length > 0 && (
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase border-b border-black mb-1">Education</h2>
      {parsed_data.education.map((edu, i) => (
        <div key={i} className="mb-1">
          <div className="flex justify-between font-bold w-full">
            <span>{edu.institution || edu.school}</span>
            <span>{edu.start_date || edu.startDate} - {edu.end_date || edu.endDate || 'Present'}</span>
          </div>
          <p>{edu.degree || edu.area}</p>
        </div>
      ))}
    </div>
  )}

  {/* 3. SKILLS */}
  {parsed_data?.skills?.length > 0 && (
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase border-b border-black mb-1">Skills Summary</h2>
      <ul className="list-disc pl-5 space-y-0.5">
        {parsed_data.skills.map((skill, i) => (
          <li key={i}>
            <span className="font-bold">{skill.category || skill.name}: </span> 
            {Array.isArray(skill.items || skill.keywords) ? (skill.items || skill.keywords).join(', ') : (skill.items || skill.keywords)}
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* 4. WORK EXPERIENCE */}
  {(parsed_data?.experience?.length > 0 || parsed_data?.work_experience?.length > 0) && (
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase border-b border-black mb-1">Work Experience</h2>
      {(parsed_data.experience || parsed_data.work_experience).map((exp, i) => (
        <div key={i} className="mb-2">
          <div className="flex justify-between font-bold w-full">
            <span>{exp.role || exp.position} | {exp.company || exp.organization}</span>
            <span>{exp.start_date || exp.startDate} - {exp.end_date || exp.endDate || 'Present'}</span>
          </div>
          <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
            {exp.highlights?.map((h, j) => <li key={j}>{h}</li>)}
            {exp.description && !exp.highlights && <li>{exp.description}</li>}
          </ul>
        </div>
      ))}
    </div>
  )}

  {/* 5. PROJECTS */}
  {parsed_data?.projects?.length > 0 && (
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase border-b border-black mb-1">Projects</h2>
      {parsed_data.projects.map((proj, i) => (
        <div key={i} className="mb-2">
          <div className="flex justify-between font-bold w-full">
            <span>{proj.title || proj.name}</span>
            <span>{proj.date || proj.year || ''}</span>
          </div>
          <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
            {proj.highlights?.map((h, j) => <li key={j}>{h}</li>)}
            {proj.description && !proj.highlights && <li>{proj.description}</li>}
          </ul>
        </div>
      ))}
    </div>
  )}

  {/* 6. CERTIFICATIONS */}
  {parsed_data?.certifications?.length > 0 && (
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase border-b border-black mb-1">Certifications</h2>
      <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }} className="list-disc pl-4 mt-0.5">
        {parsed_data.certifications.map((c, i) => (
          <li key={i} className="mb-0.5">
            <span className="font-bold">{c.name || c.title}</span> {c.issuer ? `(${c.issuer})` : ''}
          </li>
        ))}
      </ul>
    </div>
  )}

</div>
"""

    part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)

    config = types.GenerateContentConfig(
        max_output_tokens=8192,
        temperature=0.1
    )

    raw_response_text = ""

    for key_idx, current_key in enumerate(keys):
        active_client = genai.Client(api_key=current_key)
        max_retries = 3
        key_succeeded = False

        for attempt in range(max_retries):
            try:
                response = active_client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=[part, prompt],
                    config=config
                )
                raw_response_text = response.text or ""
                key_succeeded = True
                break
            except Exception as e:
                is_429 = getattr(e, 'code', None) == 429 or '429' in str(e) or 'RESOURCE_EXHAUSTED' in str(e)
                if is_429:
                    if key_idx < len(keys) - 1:
                        print(f"Primary API Key quota reached (429). Switching to backup key...")
                        logger.warning("Primary API Key quota reached (429). Switching to backup key...")
                        break
                    else:
                        logger.error(f"All API Keys exhausted quota (429): {e}")
                        raise HTTPException(
                            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="All AI Vision API keys have reached their daily quota. Please try again later or provide a new key."
                        )

                is_503 = getattr(e, 'code', None) == 503 or '503' in str(e) or 'UNAVAILABLE' in str(e) or 'overloaded' in str(e).lower()
                if is_503 and attempt < max_retries - 1:
                    wait_time = 3 + (attempt * 2)
                    print(f"503 Server overloaded. Retrying in {wait_time} seconds...")
                    logger.warning(f"503 Server overloaded. Retrying attempt {attempt + 1}/{max_retries} in {wait_time} seconds...")
                    await asyncio.sleep(wait_time)
                    continue

                if attempt == max_retries - 1 and key_idx < len(keys) - 1:
                    print(f"Key {key_idx + 1} failed after {max_retries} attempts. Switching to backup key...")
                    logger.warning(f"Key {key_idx + 1} failed after {max_retries} attempts. Switching to backup key...")
                    break
                elif attempt == max_retries - 1:
                    logger.error(f"Vision API failed after retries across all keys: {str(e)}")
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="The AI Vision servers are currently experiencing extreme demand. Please try uploading your template again in a few minutes."
                    )

        if key_succeeded:
            break

    print("RAW VISION AI OUTPUT:", raw_response_text)

    if not raw_response_text:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Empty response received from Gemini Vision API."
        )

    cleaned_code = raw_response_text.strip()
    if cleaned_code.startswith("```jsx"):
        cleaned_code = cleaned_code[6:]
    elif cleaned_code.startswith("```html"):
        cleaned_code = cleaned_code[7:]
    elif cleaned_code.startswith("```"):
        cleaned_code = cleaned_code[3:]
    if cleaned_code.endswith("```"):
        cleaned_code = cleaned_code[:-3]

    cleaned_code = cleaned_code.strip()

    if not cleaned_code.startswith("<div"):
        start_idx = cleaned_code.find("<div")
        if start_idx != -1:
            cleaned_code = cleaned_code[start_idx:]

    if not cleaned_code.endswith("</div>"):
        end_idx = cleaned_code.rfind("</div>")
        if end_idx != -1:
            cleaned_code = cleaned_code[:end_idx + 6]

    return cleaned_code
