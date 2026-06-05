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
async def get_diagnostic_questions(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")

    questions = db.query(Question).filter_by(course_id=course_id, assessment_type=AssessmentType.diagnostic).limit(15).all()
    
    # Check if there are no questions or if they are just the mock data ("A", "B", "C", "D")
    is_mock = len(questions) > 0 and questions[0].options == ["A", "B", "C", "D"]
    
    if len(questions) < 3 or is_mock:
        from app.services.ai_engine import generate_diagnostic_questions
        data = await generate_diagnostic_questions(course.title, course.category, course.sections)
        # Return dynamically generated questions
        return data.get("questions", [])
        
    return [{"id": q.id, "question": q.question_text, "options": q.options, "correct": q.correct_option_index} for q in questions]

@router.get("/diagnostic/field/{field_name}")
async def get_field_diagnostic(field_name: str):
    from app.services.ai_engine import generate_field_diagnostic_questions
    data = await generate_field_diagnostic_questions(field_name)
    return data

@router.post("/diagnostic/submit")
async def submit_diagnostic(submit: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # submit dict can contain field_name and answers
    field_name = submit.get("field_name", "Yazılım")
    answers = submit.get("answers", [])
    
    # Mock grading
    topic_scores = {"Basics": 0.9, "Advanced": 0.4}
    overall_score = 0.65
    if len(answers) > 0:
        correct = sum([1 for a in answers if a.get("selected") == a.get("correct")])
        overall_score = correct / len(answers)
        topic_scores = { "Genel Bilgi": overall_score, "İleri Seviye": overall_score * 0.8 }
    
    # Analyze results
    ai_analysis = await analyze_diagnostic_results(topic_scores, list(topic_scores.keys()))
    
    assessment = Assessment(
        user_id=current_user.id,
        course_id=None,
        type=AssessmentType.diagnostic.value,
        answers=answers,
        topic_scores=topic_scores,
        overall_score=overall_score,
        ai_analysis=ai_analysis
    )
    db.add(assessment)
    current_user.xp = (current_user.xp or 0) + 50
    db.commit()
    
    # Generate Global Roadmap
    all_courses = db.query(Course).filter(Course.is_published == True).all()
    from app.services.ai_engine import generate_global_roadmap
    await generate_global_roadmap(current_user.id, field_name, ai_analysis, all_courses, db)
    
    return {"message": "Tanı sınavı tamamlandı", "ai_analysis": ai_analysis}

@router.get("/{course_id}/final")
async def get_final_exam(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
        
    questions = db.query(Question).filter_by(course_id=course_id, assessment_type=AssessmentType.final.value).all()
    
    if len(questions) < 10:
        # DB'de 10 soru yoksa AI ile anlık üret
        from app.services.ai_engine import generate_final_exam_questions
        data = await generate_final_exam_questions(course.title, course.description or "")
        return data.get("questions", [])
        
    return [{"id": q.id, "question": q.question_text, "options": q.options, "correct": q.correct_option_index} for q in questions[:10]]

@router.post("/{course_id}/final/submit")
def submit_final_exam(course_id: str, submit: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    answers = submit.get("answers", [])
    if len(answers) == 0:
        overall_score = 0
    else:
        correct = sum([1 for a in answers if str(a.get("selected")) == str(a.get("correct"))])
        overall_score = correct / len(answers)
        
    assessment = Assessment(
        user_id=current_user.id,
        course_id=course_id,
        type=AssessmentType.final.value,
        answers=answers,
        overall_score=overall_score
    )
    db.add(assessment)
    
    if overall_score >= 0.8:
        current_user.xp = (current_user.xp or 0) + 100
    else:
        current_user.xp = (current_user.xp or 0) + 20
        
    db.commit()
    return {"message": "Sınav tamamlandı", "score": overall_score * 100}

@router.get("/{course_id}/final/status")
def get_final_exam_status(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Öğrencinin en yüksek puanını bul
    assessments = db.query(Assessment).filter_by(
        user_id=current_user.id,
        course_id=course_id,
        type=AssessmentType.final.value
    ).all()
    
    if not assessments:
        return {"has_passed": False, "best_score": 0}
        
    best_score = max([a.overall_score or 0 for a in assessments])
    return {"has_passed": best_score >= 0.8, "best_score": best_score * 100}
