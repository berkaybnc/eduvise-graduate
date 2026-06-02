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
from app.services.ai_engine import generate_instructor_insights

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
    
    total_students = db.query(func.count(func.distinct(Enrollment.user_id))).filter(Enrollment.course_id.in_([c.id for c in courses])).scalar() or 0
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
    total_students = db.query(func.count(func.distinct(Enrollment.user_id))).filter(Enrollment.course_id.in_(course_ids)).scalar() or 0
    
    # Revenue (price * enrollments) - simplistic calculation
    # For more accuracy, we'd sum up actual transaction values. Here we multiply current price * total enrollments for each course.
    monthly_revenue = 0.0
    course_performance = []
    
    for c in courses:
        students = db.query(func.count(func.distinct(Enrollment.user_id))).filter(Enrollment.course_id == c.id).scalar() or 0
        revenue = students * c.price
        monthly_revenue += revenue
        
        # Rating
        course_reviews = db.query(Review).filter(Review.course_id == c.id).all()
        avg_rating = sum(r.rating for r in course_reviews) / len(course_reviews) if course_reviews else 0.0
        
        # Progress roughly simulated (since real completion calculation per user requires complex queries)
        # We can just return students count and revenue per course
        course_performance.append({
            "id": c.id,
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

@router.get("/courses/{course_id}/students")
def get_course_students(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    course = db.query(Course).filter(Course.id == course_id, Course.instructor_id == current_user.id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı veya size ait değil.")
        
    enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
    
    from app.models.assessment import Assessment
    
    total_videos = sum(len(sec.videos) for sec in course.sections)
    
    result = []
    for enr in enrollments:
        user = db.query(User).filter(User.id == enr.user_id).first()
        if not user:
            continue
            
        completed_count = len(enr.completed_videos) if enr.completed_videos else 0
        progress = int((completed_count / total_videos) * 100) if total_videos > 0 else 0
        
        # Get AI diagnostic results for radar chart
        diagnostics = db.query(Assessment).filter(Assessment.user_id == user.id, Assessment.type == "diagnostic").order_by(Assessment.completed_at.desc()).first()
        topic_scores = diagnostics.topic_scores if diagnostics and diagnostics.topic_scores else {}
        
        # Map to radar format
        radar_data = []
        for k, v in topic_scores.items():
            radar_data.append({"subject": k, "A": int(v * 100), "fullMark": 100})
            
        # Get final exam score
        finals = db.query(Assessment).filter(Assessment.user_id == user.id, Assessment.course_id == course_id, Assessment.type == "final").all()
        best_final = max([a.overall_score for a in finals]) * 100 if finals else None
        
        result.append({
            "id": user.id,
            "name": user.full_name,
            "avatar_url": user.avatar_url,
            "email": user.email,
            "progress": progress,
            "enrolled_at": enr.enrolled_at,
            "last_active": user.last_login_date,
            "radar_data": radar_data,
            "final_score": best_final
        })
        
    return result

@router.get("/ai-insights")
async def get_ai_insights(db: Session = Depends(get_db), current_user: User = Depends(require_instructor)):
    # Re-use the logic from get_instructor_stats to gather data
    courses = db.query(Course).filter(Course.instructor_id == current_user.id).all()
    course_ids = [c.id for c in courses]
    
    if not course_ids:
        return {"report": "Analiz edilecek kurs verisi bulunamadı."}
    
    active_courses = len([c for c in courses if c.is_published])
    total_students = db.query(func.count(func.distinct(Enrollment.user_id))).filter(Enrollment.course_id.in_(course_ids)).scalar() or 0
    
    monthly_revenue = 0.0
    course_performance = []
    
    for c in courses:
        students = db.query(func.count(func.distinct(Enrollment.user_id))).filter(Enrollment.course_id == c.id).scalar() or 0
        revenue = students * c.price
        monthly_revenue += revenue
        
        course_reviews = db.query(Review).filter(Review.course_id == c.id).all()
        avg_rating = sum(r.rating for r in course_reviews) / len(course_reviews) if course_reviews else 0.0
        
        course_performance.append({
            "name": c.title,
            "students": students,
            "rating": round(avg_rating, 1),
            "revenue_try": revenue
        })
    
    all_reviews = db.query(Review).filter(Review.course_id.in_(course_ids)).all()
    average_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 0.0
    
    stats_data = {
        "instructor_name": current_user.full_name,
        "total_students": total_students,
        "average_rating": round(average_rating, 1),
        "total_revenue_try": monthly_revenue,
        "active_courses": active_courses,
        "course_performance": sorted(course_performance, key=lambda x: x["students"], reverse=True)
    }
    
    report = await generate_instructor_insights(stats_data)
    
    return {"report": report}
