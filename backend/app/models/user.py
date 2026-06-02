from sqlalchemy import Column, String, Enum, Boolean, DateTime, Integer
from app.database import Base
import uuid, enum
from datetime import datetime

class UserRole(str, enum.Enum):
    student = "student"
    instructor = "instructor"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    interests = Column(String, nullable=True)
    badges = Column(String, default="[]")  # JSON list of badges: [{"name": "İlk Adım", "icon": "local_fire_department"}]
    xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    last_login_date = Column(String, nullable=True) # YYYY-MM-DD
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
