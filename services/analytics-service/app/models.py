import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, JSON, Integer
from app.database import Base

# Madde 20: AI Learning Analytics
class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, index=True)
    module_id = Column(String)
    action_type = Column(String) # watch_video, complete_quiz, fail_topic
    watch_time_seconds = Column(Integer, default=0)
    score = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Madde 26: Monetization & Revenue
class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String, index=True)
    instructor_id = Column(String, index=True)
    student_id = Column(String)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="TRY")
    timestamp = Column(DateTime, default=datetime.utcnow)
