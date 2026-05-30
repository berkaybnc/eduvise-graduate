from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class LearningRoadmapBase(BaseModel):
    roadmap_data: dict
    recommended_courses: List[str] = []

class LearningRoadmapRead(LearningRoadmapBase):
    id: str
    user_id: str
    course_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class NodeUpdate(BaseModel):
    status: str  # "completed", "active", "locked", "remedial"
