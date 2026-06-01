from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import os, uuid, aiofiles
from app.database import get_db
from app.config import settings
from app.models.course import Course, Section, Video, Enrollment, Review, Attachment
from app.models.user import User
from app.models.notification import Notification
from app.core.notifications import manager
from app.schemas.course import CourseCreate, CourseRead, CourseUpdate, SectionCreate, VideoCreate, ReviewCreate, ReviewRead, AttachmentRead
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

@router.put("/{course_id}", response_model=CourseRead)
def update_course(course_id: str, course_update: CourseUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    for field, value in course_update.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course

@router.delete("/{course_id}")
def delete_course(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    db.delete(course)
    db.commit()
    return {"message": "Kurs silindi"}

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(require_instructor)
):
    allowed_video = {"mp4", "mov", "avi", "mkv", "webm"}
    allowed_doc = {"pdf", "zip", "docx", "pptx", "xlsx"}
    allowed_image = {"jpg", "jpeg", "png", "webp", "gif"}
    ext = (file.filename or "").rsplit(".", 1)[-1].lower()
    if ext not in allowed_video | allowed_doc | allowed_image:
        raise HTTPException(status_code=400, detail="Desteklenmeyen dosya türü")
    unique_name = f"{uuid.uuid4()}.{ext}"
    save_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    async with aiofiles.open(save_path, "wb") as f:
        while chunk := await file.read(1024 * 1024):  # 1MB chunks
            await f.write(chunk)
    file_type = "video" if ext in allowed_video else ("image" if ext in allowed_image else "document")
    return {"url": f"/uploads/{unique_name}", "filename": file.filename, "type": file_type}

@router.post("/{course_id}/enroll")
def enroll_course(course_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    
    enrollment = db.query(Enrollment).filter_by(user_id=current_user.id, course_id=course_id).first()
    if enrollment:
        raise HTTPException(status_code=400, detail="Zaten kayıtlısınız")
        
    new_enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
    db.add(new_enrollment)
    
    # Notify instructor
    if course.instructor_id != current_user.id:
        notif = Notification(
            user_id=course.instructor_id,
            title="Yeni Öğrenci",
            message=f"{current_user.full_name} isimli öğrenci {course.title} kursunuza kayıt oldu.",
            type="enrollment"
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        background_tasks.add_task(manager.send_personal_message, {
            "id": notif.id,
            "title": notif.title,
            "message": notif.message,
            "is_read": notif.is_read,
            "type": notif.type,
            "created_at": notif.created_at.isoformat()
        }, course.instructor_id)
    else:
        db.commit()

    return {"message": "Kayıt başarılı"}

@router.post("/{course_id}/sections", response_model=dict)
def add_section(course_id: str, section: SectionCreate, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    new_section = Section(**section.model_dump(), course_id=course_id)
    db.add(new_section)
    db.commit()
    db.refresh(new_section)
    return {"id": new_section.id, "title": new_section.title, "order_index": new_section.order_index, "course_id": new_section.course_id}

@router.post("/sections/{section_id}/videos", response_model=dict)
def add_video(section_id: str, video: VideoCreate, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    new_video = Video(**video.model_dump(), section_id=section_id)
    db.add(new_video)
    db.commit()
    db.refresh(new_video)
    return {"id": new_video.id, "title": new_video.title, "video_url": new_video.video_url, "section_id": new_video.section_id, "is_preview": new_video.is_preview}

@router.put("/sections/{section_id}")
def update_section(section_id: str, section_update: dict, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Bölüm bulunamadı")
    if "title" in section_update:
        section.title = section_update["title"]
    db.commit()
    return {"message": "Bölüm güncellendi"}

@router.delete("/sections/{section_id}")
def delete_section(section_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    section = db.query(Section).filter(Section.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Bölüm bulunamadı")
    db.delete(section)
    db.commit()
    return {"message": "Bölüm silindi"}

@router.put("/videos/{video_id}")
def update_video(video_id: str, video_update: dict, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video bulunamadı")
    for key, value in video_update.items():
        if hasattr(video, key):
            setattr(video, key, value)
    db.commit()
    db.refresh(video)
    return {"message": "Video güncellendi", "id": video.id, "title": video.title, "video_url": video.video_url, "is_preview": video.is_preview}

@router.delete("/videos/{video_id}")
def delete_video(video_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video bulunamadı")
    db.delete(video)
    db.commit()
    return {"message": "Video silindi"}

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

@router.post("/{course_id}/reviews", response_model=ReviewRead)
def add_review(course_id: str, review: ReviewCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
        
    new_review = Review(
        course_id=course_id,
        user_id=current_user.id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    
    # Notify instructor
    if course.instructor_id != current_user.id:
        notif = Notification(
            user_id=course.instructor_id,
            title="Yeni Değerlendirme",
            message=f"{current_user.full_name}, {course.title} kursunuz için {review.rating} yıldız verdi.",
            type="review"
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        db.refresh(new_review)
        background_tasks.add_task(manager.send_personal_message, {
            "id": notif.id,
            "title": notif.title,
            "message": notif.message,
            "is_read": notif.is_read,
            "type": notif.type,
            "created_at": notif.created_at.isoformat()
        }, course.instructor_id)
    else:
        db.commit()
        db.refresh(new_review)
        
    return new_review

@router.get("/{course_id}/reviews", response_model=List[ReviewRead])
def get_reviews(course_id: str, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.course_id == course_id).all()
    return reviews


