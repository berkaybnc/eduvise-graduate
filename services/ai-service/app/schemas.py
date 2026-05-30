from pydantic import BaseModel
from typing import List, Dict, Any

class StateVector(BaseModel):
    knowledge_node_id: str
    topic_name: str
    mastery_score: float

class RoadmapRequest(BaseModel):
    student_id: str
    interests: List[str]
    career_goals: List[str]
    current_knowledge_state: List[StateVector]

class RoadmapResponse(BaseModel):
    personalized_learning_path: List[Dict[str, Any]]
    recommended_categories: List[str]
    estimated_duration_weeks: int

class QuizResult(BaseModel):
    student_id: str
    knowledge_node_id: str
    score: float
    success_threshold: float = 70.0

class PathAdjustmentResponse(BaseModel):
    action: str # "unlock_next_module", "redirect_to_prerequisite", "assign_extra_exercises"
    recommendation_message: str
