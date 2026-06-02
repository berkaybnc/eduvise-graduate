from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.sqlite import JSON
from app.database import Base
import uuid, enum
from datetime import datetime

class AssessmentType(str, enum.Enum):
    diagnostic = "diagnostic"
    module = "module"
    final = "final"

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    topic_tag = Column(String, nullable=False)  # hangi konuya ait
    assessment_type = Column(String, nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # ["A", "B", "C", "D"]
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text)
    difficulty = Column(Integer, default=1)  # 1-3

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=True)
    type = Column(String, nullable=False)
    answers = Column(JSON, default=dict)  # {question_id: selected_option_index}
    topic_scores = Column(JSON, default=dict)  # {topic: score 0.0-1.0}
    overall_score = Column(Float)
    ai_analysis = Column(JSON)  # AI'ın ürettiği analiz
    completed_at = Column(DateTime, default=datetime.utcnow)
