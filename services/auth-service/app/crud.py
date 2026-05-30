from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate
from app.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role,
        age=user.age,
        education_level=user.education_level,
        interests=user.interests,
        hobbies=user.hobbies,
        career_goals=user.career_goals,
        bio=user.bio,
        experience_level=user.experience_level
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
