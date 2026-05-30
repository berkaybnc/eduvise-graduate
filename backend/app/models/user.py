from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import PostgresBase

class UserRole(str, enum.Enum):
    student = "student"
    instructor = "instructor"
    admin = "admin"

class User(PostgresBase):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    instructor_profile = relationship("InstructorProfile", back_populates="user", uselist=False)

class InstructorProfile(PostgresBase):
    __tablename__ = "instructor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    # In SQLite we might use JSON string, but in Postgres we can use ARRAY or just comma-separated strings for MVP
    expertise_areas = Column(String, nullable=True) 
    rating = Column(Float, default=0.0)
    total_students = Column(Integer, default=0)
    total_courses = Column(Integer, default=0)
    verified = Column(Integer, default=0)  # Boolean

    user = relationship("User", back_populates="instructor_profile")
