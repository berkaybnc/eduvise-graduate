from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.user import UserRead

class ForumReplyBase(BaseModel):
    content: str

class ForumReplyCreate(ForumReplyBase):
    pass

class ForumReplyRead(ForumReplyBase):
    id: str
    topic_id: str
    user_id: Optional[str] = None
    is_ai: bool
    is_accepted: bool
    created_at: datetime
    user: Optional[UserRead] = None
    
    class Config:
        from_attributes = True

class ForumTopicBase(BaseModel):
    title: str
    content: str

class ForumTopicCreate(ForumTopicBase):
    pass

class ForumTopicRead(ForumTopicBase):
    id: str
    course_id: str
    user_id: str
    is_resolved: bool
    created_at: datetime
    updated_at: datetime
    user: Optional[UserRead] = None
    replies: List[ForumReplyRead] = []
    
    class Config:
        from_attributes = True

class ForumTopicList(ForumTopicBase):
    id: str
    course_id: str
    user_id: str
    is_resolved: bool
    created_at: datetime
    updated_at: datetime
    user: Optional[UserRead] = None
    reply_count: int = 0
    
    class Config:
        from_attributes = True
