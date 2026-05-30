from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str

class CourseCreate(CourseBase):
    pass

class CourseRead(CourseBase):
    id: str
    instructor_id: str
    created_at: datetime
    class Config:
        from_attributes = True

class KnowledgeNodeBase(BaseModel):
    topic_name: str
    difficulty_level: int = 1

class KnowledgeNodeCreate(KnowledgeNodeBase):
    pass

class KnowledgeNodeRead(KnowledgeNodeBase):
    id: str
    class Config:
        from_attributes = True

class PrerequisiteCreate(BaseModel):
    node_id: str
    required_node_id: str

class UserKnowledgeRead(BaseModel):
    student_id: str
    knowledge_node_id: str
    mastery_score: float
    last_assessed: datetime
    class Config:
        from_attributes = True
