from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.roadmap import LearningRoadmap
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/{course_id}")
def get_roadmap(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap = db.query(LearningRoadmap).filter_by(user_id=current_user.id, course_id=course_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap bulunamadı")
    return roadmap
