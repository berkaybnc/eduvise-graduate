from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.course import Course, Section, Video, Enrollment
from app.models.user import User
from app.schemas.course import CourseCreate, CourseRead, CourseUpdate, SectionCreate, VideoCreate
from app.core.dependencies import get_current_user, require_instructor

router = APIRouter()

@router.get("/", response_model=List[CourseRead])
def list_courses(category: str = None, level: str = None, db: Session = Depends(get_db)):
    query = db.query(Course).filter(Course.is_published == True)
    if category:
        query = query.filter(Course.category == category)
    if level:
        query = query.filter(Course.level == level)
    return query.all()

@router.get("/{course_id}", response_model=CourseRead)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    return course

@router.post("/", response_model=CourseRead)
def create_course(course: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    new_course = Course(**course.model_dump(), instructor_id=current_user.id)
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.post("/{course_id}/enroll")
def enroll_course(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    
    enrollment = db.query(Enrollment).filter_by(user_id=current_user.id, course_id=course_id).first()
    if enrollment:
        raise HTTPException(status_code=400, detail="Zaten kayıtlısınız")
        
    new_enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
    db.add(new_enrollment)
    db.commit()
    return {"message": "Kayıt başarılı"}

@router.post("/{course_id}/sections")
def add_section(course_id: str, section: SectionCreate, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    # auth check
    new_section = Section(**section.model_dump(), course_id=course_id)
    db.add(new_section)
    db.commit()
    return new_section

@router.post("/sections/{section_id}/videos")
def add_video(section_id: str, video: VideoCreate, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    new_video = Video(**video.model_dump(), section_id=section_id)
    db.add(new_video)
    db.commit()
    return new_video

@router.put("/videos/{video_id}/complete")
def complete_video(video_id: str, course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    enrollment = db.query(Enrollment).filter_by(user_id=current_user.id, course_id=course_id).first()
    if enrollment:
        completed = list(enrollment.completed_videos)
        if video_id not in completed:
            completed.append(video_id)
            enrollment.completed_videos = completed
            db.commit()
    return {"message": "Video tamamlandı"}
