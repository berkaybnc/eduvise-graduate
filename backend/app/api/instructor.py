from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Dict
from datetime import datetime, timedelta
from app.database import get_db
from app.models.course import Course, Section, Video, Attachment, Enrollment, Review
from app.models.user import User, UserRole
from app.schemas.course import CourseRead
from app.core.dependencies import require_instructor

router = APIRouter()

@router.get("/{instructor_id}/profile")
def get_instructor_profile(instructor_id: str, db: Session = Depends(get_db)):
    instructor = db.query(User).filter(User.id == instructor_id, User.role == UserRole.instructor).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Eğitmen bulunamadı")
        
    courses = db.query(Course).filter(Course.instructor_id == instructor_id, Course.is_published == True).options(
        joinedload(Course.sections).joinedload(Section.videos),
        joinedload(Course.reviews)
    ).all()
    
    total_students = db.query(func.count(Enrollment.id)).filter(Enrollment.course_id.in_([c.id for c in courses])).scalar() or 0
    total_reviews = sum(len(c.reviews) for c in courses)
    avg_rating = sum(sum(r.rating for r in c.reviews) for c in courses) / total_reviews if total_reviews > 0 else 0.0

    return {
        "id": instructor.id,
        "full_name": instructor.full_name,
        "bio": instructor.bio or "Bu eğitmen henüz bir biyografi eklememiş.",
        "avatar_url": instructor.avatar_url,
        "total_students": total_students,
        "total_reviews": total_reviews,
        "average_rating": round(avg_rating, 1),
        "courses": courses
    }

@router.get("/courses", response_model=List[CourseRead])
def get_instructor_courses(db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    courses = (
        db.query(Course)
        .filter(Course.instructor_id == current_user.id)
        .options(
            joinedload(Course.sections).joinedload(Section.videos).joinedload(Video.attachments),
            joinedload(Course.reviews),
        )
        .all()
    )
    return courses

@router.get("/stats")
def get_instructor_stats(db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return {
            "total_students": 0,
            "average_rating": 0.0,
            "monthly_revenue": 0.0,
            "active_courses": 0,
            "course_performance": [],
            "recent_reviews": []
        }
    
    active_courses = len([c for c in courses if c.is_published])
    
    # Students count
    total_students = db.query(func.count(Enrollment.id)).filter(Enrollment.course_id.in_(course_ids)).scalar() or 0
    
    # Revenue (price * enrollments) - simplistic calculation
    # For more accuracy, we'd sum up actual transaction values. Here we multiply current price * total enrollments for each course.
    monthly_revenue = 0.0
    course_performance = []
    
    for c in courses:
        students = db.query(func.count(Enrollment.id)).filter(Enrollment.course_id == c.id).scalar() or 0
        revenue = students * c.price
        monthly_revenue += revenue
        
        # Rating
        course_reviews = db.query(Review).filter(Review.course_id == c.id).all()
        avg_rating = sum(r.rating for r in course_reviews) / len(course_reviews) if course_reviews else 0.0
        
        # Progress roughly simulated (since real completion calculation per user requires complex queries)
        # We can just return students count and revenue per course
        course_performance.append({
            "name": c.title,
            "students": students,
            "rating": round(avg_rating, 1),
            "revenue": f"₺{revenue:,.2f}",
            "progress": 0 # Can be calculated if needed
        })
    
    # Overall average rating
    all_reviews = db.query(Review).filter(Review.course_id.in_(course_ids)).all()
    average_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 0.0
    
    # Recent reviews
    recent_reviews_db = db.query(Review).filter(Review.course_id.in_(course_ids)).order_by(Review.created_at.desc()).limit(5).all()
    recent_reviews = []
    for r in recent_reviews_db:
        # User details might require a join, let's just use user_id or fetch user
        user = db.query(User).filter(User.id == r.user_id).first()
        recent_reviews.append({
            "name": user.full_name if user else "Anonim",
            "stars": r.rating,
            "comment": r.comment or "",
            "time": r.created_at.strftime("%d.%m.%Y")
        })
        
    return {
        "total_students": total_students,
        "average_rating": round(average_rating, 1),
        "monthly_revenue": monthly_revenue,
        "active_courses": active_courses,
        "course_performance": sorted(course_performance, key=lambda x: x["students"], reverse=True),
        "recent_reviews": recent_reviews
    }


