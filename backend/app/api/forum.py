from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models.forum import ForumTopic, ForumReply
from app.models.course import Course
from app.models.user import User
from app.schemas.forum import ForumTopicCreate, ForumTopicRead, ForumTopicList, ForumReplyCreate, ForumReplyRead
from app.core.dependencies import get_current_user
from app.services.ai_engine import generate_forum_reply
import asyncio

router = APIRouter()

async def process_ai_reply(topic_id: str, title: str, content: str, course_title: str):
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        reply_content = await generate_forum_reply(title, content, course_title)
        reply = ForumReply(
            topic_id=topic_id,
            user_id=None,
            content=reply_content,
            is_ai=True
        )
        db.add(reply)
        db.commit()
    finally:
        db.close()

@router.get("/{course_id}", response_model=List[ForumTopicList])
def list_topics(course_id: str, db: Session = Depends(get_db)):
    topics = db.query(ForumTopic).filter(ForumTopic.course_id == course_id).options(joinedload(ForumTopic.user)).order_by(ForumTopic.created_at.desc()).all()
    
    result = []
    for t in topics:
        reply_count = db.query(func.count(ForumReply.id)).filter(ForumReply.topic_id == t.id).scalar()
        result.append({
            "id": t.id,
            "course_id": t.course_id,
            "user_id": t.user_id,
            "title": t.title,
            "content": t.content,
            "is_resolved": t.is_resolved,
            "created_at": t.created_at,
            "updated_at": t.updated_at,
            "user": t.user,
            "reply_count": reply_count
        })
    return result

@router.post("/{course_id}", response_model=ForumTopicRead)
def create_topic(course_id: str, topic: ForumTopicCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
        
    new_topic = ForumTopic(
        course_id=course_id,
        user_id=current_user.id,
        title=topic.title,
        content=topic.content
    )
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)
    
    # AI'dan anında cevap alması için arka plan görevi başlat
    background_tasks.add_task(process_ai_reply, new_topic.id, new_topic.title, new_topic.content, course.title)
    
    # current_user nesnesini döndürmek için (pydantic modelinde var)
    new_topic.user = current_user
    new_topic.replies = []
    return new_topic

@router.get("/topics/{topic_id}", response_model=ForumTopicRead)
def get_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).options(
        joinedload(ForumTopic.user),
        joinedload(ForumTopic.replies).joinedload(ForumReply.user)
    ).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Konu bulunamadı")
    return topic

@router.post("/topics/{topic_id}/reply", response_model=ForumReplyRead)
def reply_topic(topic_id: str, reply: ForumReplyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Konu bulunamadı")
        
    new_reply = ForumReply(
        topic_id=topic_id,
        user_id=current_user.id,
        content=reply.content,
        is_ai=False
    )
    db.add(new_reply)
    
    # Gamification
    if current_user.role == "student":
        current_user.xp = (current_user.xp or 0) + 5
        
    db.commit()
    db.refresh(new_reply)
    new_reply.user = current_user
    return new_reply

@router.put("/topics/{topic_id}/resolve")
def resolve_topic(topic_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    topic = db.query(ForumTopic).filter(ForumTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Konu bulunamadı")
        
    course = db.query(Course).filter(Course.id == topic.course_id).first()
    
    if topic.user_id != current_user.id and current_user.id != course.instructor_id:
        raise HTTPException(status_code=403, detail="Buna yetkiniz yok")
        
    topic.is_resolved = True
    
    # Eğer öğenci kendi sorusunu çözüldü yapıyorsa ekstra ödül verilebilir
    if topic.user_id == current_user.id:
        current_user.xp = (current_user.xp or 0) + 10
        
    db.commit()
    return {"message": "Konu çözüldü olarak işaretlendi."}
