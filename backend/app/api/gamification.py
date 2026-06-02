from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Get top 20 users by XP, only students
    top_users = db.query(User).filter(User.role == UserRole.student).order_by(User.xp.desc()).limit(20).all()
    
    result = []
    for idx, user in enumerate(top_users):
        import json
        try:
            badges = json.loads(user.badges) if user.badges else []
        except:
            badges = []
            
        result.append({
            "rank": idx + 1,
            "id": user.id,
            "name": user.full_name,
            "avatar_url": user.avatar_url,
            "xp": user.xp or 0,
            "streak_days": user.streak_days or 0,
            "badges": badges
        })
        
    return result
