from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "student"

class UserCreate(UserBase):
    password: str
    
    # 5.1 Student & 6.1 Teacher registration fields
    age: Optional[str] = None
    education_level: Optional[str] = None
    interests: Optional[List[str]] = []
    hobbies: Optional[List[str]] = []
    career_goals: Optional[List[str]] = []
    bio: Optional[str] = None
    experience_level: Optional[str] = None

class UserRead(UserBase):
    id: str
    interests: List[str] = []
    hobbies: List[str] = []
    career_goals: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
