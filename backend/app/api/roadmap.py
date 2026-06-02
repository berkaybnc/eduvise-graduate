from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.roadmap import LearningRoadmap
from app.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/dashboard/active")
async def get_active_roadmap(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap = db.query(LearningRoadmap).filter_by(user_id=current_user.id).order_by(LearningRoadmap.created_at.desc()).first()
    
    if not roadmap:
        # Eğer yol haritası yoksa, kullanıcının kayıtlı olduğu bir eğitim var mı bakalım.
        from app.models.course import Enrollment
        from app.services.ai_engine import generate_roadmap
        latest_enr = db.query(Enrollment).filter_by(user_id=current_user.id).order_by(Enrollment.enrolled_at.desc()).first()
        if latest_enr and latest_enr.course:
            # Standart (düz) bir roadmap oluştur
            course = latest_enr.course
            ordered_topics = [s.topic_tag or s.title for s in course.sections]
            await generate_roadmap(
                user_id=current_user.id,
                course_id=course.id,
                diagnostic_result={"recommended_order": ordered_topics, "skip_topics": []},
                course_sections=course.sections,
                db=db
            )
            # Tekrar çekelim
            roadmap = db.query(LearningRoadmap).filter_by(user_id=current_user.id).order_by(LearningRoadmap.created_at.desc()).first()
            
    if not roadmap:
        return {"nodes": []}
        
    data = roadmap.roadmap_data
    ordered = data.get("ordered_topics", [])
    nodes_dict = data.get("nodes", {})
    
    result = []
    import uuid
    for idx, topic in enumerate(ordered):
        node = nodes_dict.get(topic, {})
        status = node.get("status", "locked")
        mastery = int(node.get("mastery_score", 0.0) * 100)
        reason = node.get("reason", "")
        
        # map 'remedial' to 'gap' for UI
        if status == "remedial":
            status = "gap"
            
        result.append({
            "id": str(uuid.uuid4()),
            "title": topic,
            "description": node.get("reason", f"{topic} yetkinliklerini ve alt konularını içerir."),
            "status": status,
            "mastery": mastery,
            "estimatedTime": "10 saat",
            "category": "Kariyer Adımı",
            "icon": "play_lesson",
            "aiInsight": reason if status == "active" else None,
            "gapReason": reason if status == "gap" else None,
            "prerequisite": f"Önkoşul: {ordered[idx-1]}" if idx > 0 and status == "locked" else None,
            "course_id": node.get("course_id"),
            "thumbnail": node.get("thumbnail")
        })
            
    return {"nodes": result}

@router.get("/{course_id}")
def get_roadmap(course_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap = db.query(LearningRoadmap).filter_by(user_id=current_user.id, course_id=course_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap bulunamadı")
    return roadmap
