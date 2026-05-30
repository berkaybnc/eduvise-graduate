from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.sqlite import JSON
from app.database import Base
import uuid
from datetime import datetime

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    roadmap_data = Column(JSON)  # AI'ın ürettiği tam roadmap yapısı
    recommended_courses = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
