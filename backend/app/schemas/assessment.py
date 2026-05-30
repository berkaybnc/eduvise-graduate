from pydantic import BaseModel
from typing import List, Dict, Optional
from app.models.assessment import AssessmentType

class QuestionBase(BaseModel):
    topic_tag: str
    assessment_type: AssessmentType
    question_text: str
    options: List[str]
    correct_option_index: int
    explanation: Optional[str] = None
    difficulty: int = 1

class QuestionCreate(QuestionBase):
    pass

class QuestionRead(QuestionBase):
    id: str
    course_id: str
    
    class Config:
        from_attributes = True

class AssessmentSubmit(BaseModel):
    answers: Dict[str, int]  # {question_id: option_index}

class AssessmentRead(BaseModel):
    id: str
    type: AssessmentType
    overall_score: float
    topic_scores: Dict[str, float]
    ai_analysis: Optional[dict] = None
    
    class Config:
        from_attributes = True
