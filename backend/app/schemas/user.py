from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.student
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    interests: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    interests: Optional[str] = None

class UserRead(UserBase):
    id: str
    is_active: bool
    xp: int = 0
    streak_days: int = 0
    badges: str = "[]"
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    status: Optional[str] = "success"
    email: Optional[str] = None

class UserOTPVerify(BaseModel):
    email: EmailStr
    code: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    password: str

