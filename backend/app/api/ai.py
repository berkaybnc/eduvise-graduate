from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.ai_engine import generate_counseling_report, get_ai_chat_response

router = APIRouter()

@router.post("/chat")
async def chat_with_ai(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    message = payload.get("message", "")
    course_id = payload.get("course_id")
    response = await get_ai_chat_response(message, {"course_id": course_id}, [])
    return {"reply": response}

@router.post("/report/{course_id}/generate")
async def generate_report(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = await generate_counseling_report(current_user.id, course_id, db)
    return report
