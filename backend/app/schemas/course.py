from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class AttachmentBase(BaseModel):
    file_name: str
    file_url: str

class AttachmentRead(AttachmentBase):
    id: str
    video_id: str
    
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewRead(ReviewBase):
    id: str
    course_id: str
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: str
    duration_seconds: int = 0
    order_index: int = 0
    is_preview: bool = False

class VideoCreate(VideoBase):
    doc_url: Optional[str] = None
    doc_name: Optional[str] = None

class VideoRead(VideoBase):
    id: str
    section_id: str
    attachments: List[AttachmentRead] = []
    
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
    reviews: List[ReviewRead] = []
    
    class Config:
        from_attributes = True

class CourseListRead(CourseBase):
    id: str
    instructor_id: str
    is_published: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class EnrolledCourseRead(BaseModel):
    course: CourseRead
    completed_videos: List[str]
    enrolled_at: datetime

class CodingExerciseBase(BaseModel):
    title: str
    description: str
    language: str = "python"
    initial_code: str = ""
    test_code: str = ""
    solution_code: str = ""

class CodingExerciseCreate(CodingExerciseBase):
    pass

class CodingExerciseRead(CodingExerciseBase):
    id: str
    course_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

