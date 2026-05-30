from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import SqliteBase

class CourseLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class Course(SqliteBase):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, nullable=False) # Maps to PostgreSQL users.id
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String)
    level = Column(Enum(CourseLevel), default=CourseLevel.beginner)
    thumbnail_url = Column(String)
    price = Column(Float)
    currency = Column(String, default="USD")
    is_published = Column(Integer, default=0) # boolean
    rating = Column(Float, default=0.0)
    enrollment_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sections = relationship("Section", back_populates="course")

class Section(SqliteBase):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    order_index = Column(Integer, default=0)

    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section")

class Lesson(SqliteBase):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"))
    title = Column(String)
    video_url = Column(String)
    duration_seconds = Column(Integer, default=0)
    is_preview = Column(Integer, default=0) # boolean
    order_index = Column(Integer, default=0)

    section = relationship("Section", back_populates="lessons")
