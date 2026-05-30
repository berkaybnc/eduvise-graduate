from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
from datetime import datetime

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, nullable=False)
    level = Column(String, default="beginner")  # beginner, intermediate, advanced
    price = Column(Float, default=0.0)
    thumbnail_url = Column(String)
    is_published = Column(Boolean, default=False)
    tags = Column(JSON, default=list)
    topic_map = Column(JSON, default=dict)  # {topic_name: [video_ids]}
    created_at = Column(DateTime, default=datetime.utcnow)
    
    instructor = relationship("User", foreign_keys=[instructor_id])
    sections = relationship("Section", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")

class Section(Base):
    __tablename__ = "sections"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    topic_tag = Column(String)  # hangi konuya ait (AI roadmap için)
    course = relationship("Course", back_populates="sections")
    videos = relationship("Video", back_populates="section", cascade="all, delete-orphan")

class Video(Base):
    __tablename__ = "videos"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id = Column(String, ForeignKey("sections.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    video_url = Column(String, nullable=False)
    duration_seconds = Column(Integer, default=0)
    order_index = Column(Integer, default=0)
    is_preview = Column(Boolean, default=False)
    section = relationship("Section", back_populates="videos")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_videos = Column(JSON, default=list)  # [video_id, ...]
    course = relationship("Course", back_populates="enrollments")
