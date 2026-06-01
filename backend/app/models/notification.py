from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from app.database import Base
import uuid
from datetime import datetime

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    type = Column(String, nullable=False) # e.g., "enrollment", "review", "system"
    created_at = Column(DateTime, default=datetime.utcnow)
