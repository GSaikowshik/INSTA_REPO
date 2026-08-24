import uuid
from datetime import datetime
from typing import Any, Optional, Union
from pydantic import BaseModel, ConfigDict, Field

class PersonalInfoSchema(BaseModel):
    full_name: Optional[str] = ""
    title: Optional[str] = None
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    summary: Optional[str] = None
    photo_url: Optional[str] = None
    github_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""
    website_url: Optional[str] = None

class ExperienceItemSchema(BaseModel):
    id: Optional[str] = None
    company: Optional[str] = ""
    role: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    is_current: Optional[bool] = False
    description: Optional[Union[str, list[str]]] = None
    highlights: Optional[list[str]] = Field(default_factory=list)
    bulletPoints: Optional[list[str]] = Field(default_factory=list)
    bullet_points: Optional[list[str]] = Field(default_factory=list)

class EducationItemSchema(BaseModel):
    id: Optional[str] = None
    institution: Optional[str] = ""
    degree: Optional[str] = ""
    field_of_study: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    gpa: Optional[str] = None

class SkillCategorySchema(BaseModel):
    category: Optional[str] = ""
    items: Optional[list[str]] = Field(default_factory=list)

class ProjectItemSchema(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = ""
    description: Optional[Union[str, list[str]]] = ""
    technologies: Optional[list[str]] = Field(default_factory=list)
    highlights: Optional[list[str]] = Field(default_factory=list)
    bulletPoints: Optional[list[str]] = Field(default_factory=list)
    bullet_points: Optional[list[str]] = Field(default_factory=list)
    repo_url: Optional[str] = None
    live_url: Optional[str] = None

class CertificationItemSchema(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = ""
    issuer: Optional[str] = ""
    date: Optional[str] = ""
    url: Optional[str] = None

class AchievementItemSchema(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = ""
    description: Optional[str] = ""

class LeadershipItemSchema(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = ""
    organization: Optional[str] = ""
    description: Optional[str] = ""

class AdditionalInfoSchema(BaseModel):
    category: Optional[str] = ""
    details: Optional[str] = ""

class ParsedDataSchema(BaseModel):
    personal_info: Optional[PersonalInfoSchema] = Field(default_factory=PersonalInfoSchema)
    experiences: Optional[list[ExperienceItemSchema]] = Field(default_factory=list)
    experience: Optional[list[ExperienceItemSchema]] = Field(default_factory=list)
    education: Optional[list[EducationItemSchema]] = Field(default_factory=list)
    skills: Optional[list[SkillCategorySchema]] = Field(default_factory=list)
    projects: Optional[list[ProjectItemSchema]] = Field(default_factory=list)
    certifications: Optional[list[CertificationItemSchema]] = Field(default_factory=list)
    achievements: Optional[list[Any]] = Field(default_factory=list)
    leadership: Optional[list[Any]] = Field(default_factory=list)
    additional_info: Optional[Union[list[Any], dict[str, Any]]] = Field(default_factory=list)

class ProfileCreate(BaseModel):
    parsed_data: Optional[ParsedDataSchema] = None

class ProfileUpdate(BaseModel):
    parsed_data: ParsedDataSchema

class ProfileResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    parsed_data: dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
