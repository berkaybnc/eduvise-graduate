from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: str
    duration_seconds: int = 0
    order_index: int = 0
    is_preview: bool = False

class VideoCreate(VideoBase):
    pass

class VideoRead(VideoBase):
    id: str
    section_id: str
    
    class Config:
        from_attributes = True

class SectionBase(BaseModel):
    title: str
    order_index: int = 0
    topic_tag: Optional[str] = None

class SectionCreate(SectionBase):
    pass

class SectionRead(SectionBase):
    id: str
    course_id: str
    videos: List[VideoRead] = []
    
    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    level: str = "beginner"
    price: float = 0.0
    thumbnail_url: Optional[str] = None
    tags: List[str] = []
    topic_map: Dict[str, List[str]] = {}

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    price: Optional[float] = None
    thumbnail_url: Optional[str] = None
    is_published: Optional[bool] = None

class CourseRead(CourseBase):
    id: str
    instructor_id: str
    is_published: bool
    created_at: datetime
    sections: List[SectionRead] = []
    
    class Config:
        from_attributes = True

class CourseListRead(CourseBase):
    id: str
    instructor_id: str
    is_published: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
