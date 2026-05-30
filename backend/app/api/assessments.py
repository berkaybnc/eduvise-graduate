from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.assessment import Question, Assessment, AssessmentType
from app.models.user import User
from app.models.course import Course
from app.schemas.assessment import QuestionCreate, QuestionRead, AssessmentSubmit
from app.core.dependencies import get_current_user, require_instructor
from app.services.ai_engine import analyze_diagnostic_results, generate_roadmap

router = APIRouter()

@router.post("/{course_id}/questions", response_model=QuestionRead)
def add_question(course_id: str, question: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    q = Question(**question.model_dump(), course_id=course_id)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q

@router.get("/diagnostic/{course_id}")
def get_diagnostic_questions(course_id: str, db: Session = Depends(get_db)):
    questions = db.query(Question).filter_by(course_id=course_id, assessment_type=AssessmentType.diagnostic).limit(15).all()
    return questions

@router.post("/diagnostic/submit")
async def submit_diagnostic(course_id: str, submit: AssessmentSubmit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Mock grading
    topic_scores = {"Basics": 0.9, "Advanced": 0.4}
    
    course = db.query(Course).filter_by(id=course_id).first()
    
    ai_analysis = await analyze_diagnostic_results(topic_scores, list(topic_scores.keys()))
    
    assessment = Assessment(
        user_id=current_user.id,
        course_id=course_id,
        type=AssessmentType.diagnostic.value,
        answers=submit.answers,
        topic_scores=topic_scores,
        overall_score=0.65,
        ai_analysis=ai_analysis
    )
    db.add(assessment)
    db.commit()
    
    # Generate Roadmap
    await generate_roadmap(current_user.id, course_id, ai_analysis, course.sections if course else [], db)
    
    return {"message": "Tanı sınavı tamamlandı", "ai_analysis": ai_analysis}
