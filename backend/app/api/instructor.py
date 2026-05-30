from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.course import Course
from app.models.user import User
from app.core.dependencies import require_instructor

router = APIRouter()

@router.get("/courses")
def get_instructor_courses(db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    courses = db.query(Course).filter_by(instructor_id=current_user.id).all()
    return courses
