from pydantic import BaseModel
from typing import List, Optional

class SectionBase(BaseModel):
    title: str
    order_index: int

class LessonBase(BaseModel):
    title: str
    video_url: str
    duration_seconds: int
    is_preview: bool = False
    order_index: int

class CourseBase(BaseModel):
    title: str
    description: str
    category: str
    level: str
    thumbnail_url: Optional[str] = None
    price: float
    currency: str = "USD"

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    instructor_id: int
    is_published: bool
    rating: float
    enrollment_count: int

    class Config:
        from_attributes = True
