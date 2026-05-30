import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.ai import KnowledgeState, LearningRoadmap, DiagnosticAttempt, DiagnosticResponse

def generate_diagnostic_questions(topic: str, db: Session):
    # Mock behavior: return a list of questions for the topic
    # In reality, this would use NetworkX to traverse prerequisites and find appropriate concepts
    return [
        {"id": 1, "text": f"What is a core concept in {topic}?", "options": [
            {"id": 1, "text": "Option A"},
            {"id": 2, "text": "Option B"},
            {"id": 3, "text": "Option C"},
            {"id": 4, "text": "Option D"}
        ]}
    ]

def submit_diagnostic_answers(user_id: int, attempt_id: int, responses: list, db: Session):
    # Analyze responses, calculate mastery score
    # Return a gap analysis
    return {"status": "analyzed", "gaps_detected": 1}

def generate_roadmap(user_id: int, goal_topic: str, db: Session):
    # Topological sort mock
    roadmap_data = {
        "nodes": [
            {"id": "1", "type": "masteredNode", "data": {"label": "Data Structures"}, "position": {"x": 0, "y": 0}},
            {"id": "2", "type": "gapNode", "data": {"label": "Probability Basics"}, "position": {"x": 200, "y": 0}},
            {"id": "3", "type": "activeNode", "data": {"label": "Algorithm Analysis"}, "position": {"x": 400, "y": 0}}
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2"},
            {"id": "e2-3", "source": "2", "target": "3"}
        ]
    }
    
    roadmap = LearningRoadmap(
        user_id=user_id,
        goal_topic=goal_topic,
        roadmap_json=json.dumps(roadmap_data),
    )
    db.add(roadmap)
    db.commit()
    return roadmap_data

def get_counseling_report(user_id: int, db: Session):
    # Mock initial vs final knowledge states
    return {
        "radarData": [
            {"subject": "Algorithm", "A": 120, "B": 110, "fullMark": 150},
            {"subject": "Data Structs", "A": 98, "B": 130, "fullMark": 150},
            {"subject": "Backend", "A": 86, "B": 130, "fullMark": 150},
            {"subject": "Frontend", "A": 99, "B": 100, "fullMark": 150},
            {"subject": "Testing", "A": 85, "B": 90, "fullMark": 150},
            {"subject": "Sys Design", "A": 65, "B": 85, "fullMark": 150},
        ]
    }
