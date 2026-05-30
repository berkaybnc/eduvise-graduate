import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student") # student, teacher, admin
    
    # Madde 5.1 & 6.1 Gereksinimleri
    age = Column(String, nullable=True)
    education_level = Column(String, nullable=True)
    interests = Column(JSON, default=list) # Kariyer/Uzmanlık alanları
    hobbies = Column(JSON, default=list)
    career_goals = Column(JSON, default=list)
    bio = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
