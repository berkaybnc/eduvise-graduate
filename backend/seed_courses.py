import sys
import os
import json
import uuid

# Backend projesinin yolunu sys.path'e ekliyoruz ki app modülünü bulabilsin
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from app.database import SessionLocal
from app.models.user import User
from app.models.course import Course, Section, Video

db = SessionLocal()

# Eğitmeni bul
instructor_email = "berkay@gmail.com"
instructor = db.query(User).filter_by(email=instructor_email).first()

if not instructor:
    print("Eğitmen hesabı bulunamadı!")
    sys.exit()

print(f"Eğitmen bulundu: {instructor.full_name} ({instructor.id})")

courses_data = [
    {
        "title": "Python ile Veri Bilimi",
        "description": "Numpy, Pandas ve Matplotlib ile verileri analiz etmeyi öğrenin.",
        "price": 299.99,
        "category": "Yazılım",
        "tags": ["Python", "Veri Bilimi", "Pandas"],
        "is_published": True,
        "sections": [
            {
                "title": "Veri Bilimine Giriş",
                "videos": [
                    {"title": "Kurulum ve Ortam", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
                    {"title": "Pandas Temelleri", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                ]
            }
        ]
    },
    {
        "title": "İleri Seviye React.js",
        "description": "Modern React, Hooks, Zustand ve TanStack Query ile gelişmiş web uygulamaları.",
        "price": 349.00,
        "category": "Web Geliştirme",
        "tags": ["React", "JavaScript", "Frontend"],
        "is_published": True,
        "sections": [
            {
                "title": "State Management",
                "videos": [
                    {"title": "Zustand Nedir?", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"},
                    {"title": "React Query Kullanımı", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                ]
            }
        ]
    },
    {
        "title": "Oyun Geliştirme Temelleri",
        "description": "Unity ve C# ile ilk oyununuzu baştan sona geliştirin.",
        "price": 0.0,
        "category": "Oyun",
        "tags": ["Unity", "C#", "Oyun"],
        "is_published": True,
        "sections": [
            {
                "title": "Unity Arayüzü",
                "videos": [
                    {"title": "Editöre Giriş", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                ]
            }
        ]
    },
    {
        "title": "Makine Öğrenmesi (Yapay Zeka)",
        "description": "Scikit-learn ile temel regresyon ve sınıflandırma modelleri.",
        "price": 499.50,
        "category": "Yapay Zeka",
        "tags": ["AI", "Makine Öğrenmesi", "Python"],
        "is_published": True,
        "sections": [
            {
                "title": "Regresyon",
                "videos": [
                    {"title": "Doğrusal Regresyon", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                ]
            }
        ]
    },
    {
        "title": "Mobil Uygulama Geliştirme (Flutter)",
        "description": "Dart ile hem iOS hem Android için tek kod tabanıyla uygulamalar yapın.",
        "price": 250.00,
        "category": "Mobil",
        "tags": ["Flutter", "Dart", "Mobil"],
        "is_published": True,
        "sections": [
            {
                "title": "Flutter'a Giriş",
                "videos": [
                    {"title": "Widget Ağacı", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                ]
            }
        ]
    }
]

for cd in courses_data:
    new_course = Course(
        id=str(uuid.uuid4()),
        instructor_id=instructor.id,
        title=cd["title"],
        description=cd["description"],
        price=cd["price"],
        category=cd["category"],
        tags=cd["tags"],
        is_published=cd["is_published"]
    )
    db.add(new_course)
    db.flush()
    
    for idx, s_data in enumerate(cd["sections"]):
        new_sec = Section(
            id=str(uuid.uuid4()),
            course_id=new_course.id,
            title=s_data["title"],
            order_index=idx,
            topic_tag=s_data["title"]
        )
        db.add(new_sec)
        db.flush()
        
        for v_idx, v_data in enumerate(s_data["videos"]):
            new_vid = Video(
                id=str(uuid.uuid4()),
                section_id=new_sec.id,
                title=v_data["title"],
                video_url=v_data["url"],
                order_index=v_idx,
                duration_seconds=600
            )
            db.add(new_vid)

db.commit()
print("5 adet eğitim başarıyla eklendi!")
db.close()
