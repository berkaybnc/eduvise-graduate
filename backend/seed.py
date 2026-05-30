from app.database import SessionLocal, Base, engine
from app.models.user import User, UserRole
from app.models.course import Course, Section, Video
from app.core.security import hash_password

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    admin = User(email="admin@eduvise.com", full_name="Admin", hashed_password=hash_password("Admin123!"), role=UserRole.admin)
    instructor = User(email="egitmen@eduvise.com", full_name="Eğitmen", hashed_password=hash_password("Egitmen123!"), role=UserRole.instructor)
    student1 = User(email="ogrenci1@eduvise.com", full_name="Öğrenci 1", hashed_password=hash_password("Ogrenci123!"), role=UserRole.student)
    student2 = User(email="ogrenci2@eduvise.com", full_name="Öğrenci 2", hashed_password=hash_password("Ogrenci123!"), role=UserRole.student)
    
    db.add_all([admin, instructor, student1, student2])
    db.commit()
    db.refresh(instructor)
    
    c1 = Course(instructor_id=instructor.id, title="Python 101", category="Programming", is_published=True)
    db.add(c1)
    db.commit()
    
    s1 = Section(course_id=c1.id, title="Giriş", topic_tag="Basics")
    db.add(s1)
    db.commit()
    
    v1 = Video(section_id=s1.id, title="Python Nedir?", video_url="https://example.com/video1.mp4")
    db.add(v1)
    db.commit()
    
    print("Seed data created successfully.")
    db.close()

if __name__ == "__main__":
    seed_db()
