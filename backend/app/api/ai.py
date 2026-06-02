from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.models.course import Course
from fastapi import HTTPException, APIRouter
from app.services.ai_engine import generate_counseling_report, get_ai_chat_response, generate_diagnostic_questions, generate_global_counseling_report

router = APIRouter()

@router.post("/chat")
async def chat_with_ai(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    message = payload.get("message", "")
    course_title = payload.get("course_title", "Bilinmiyor")
    video_title = payload.get("video_title", "Bilinmiyor")
    response = await get_ai_chat_response(message, {"course_title": course_title, "video_title": video_title}, [])
    return {"reply": response}

@router.post("/report/{course_id}/generate")
async def generate_report(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = await generate_counseling_report(current_user.id, course_id, db)
    return report

@router.get("/report/global")
async def get_global_report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = await generate_global_counseling_report(current_user.id, db)
    return report

@router.get("/diagnostic-questions/{course_id}")
async def get_diagnostic_questions(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    
    questions = await generate_diagnostic_questions(course.title, course.category, course.sections)
    return questions
