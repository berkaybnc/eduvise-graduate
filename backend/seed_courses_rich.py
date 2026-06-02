import sys
import os
import uuid

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from app.database import SessionLocal
from app.models.user import User
from app.models.course import Course, Section, Video, Attachment

db = SessionLocal()

instructor_email = "berkay@gmail.com"
instructor = db.query(User).filter_by(email=instructor_email).first()

if not instructor:
    sys.exit("Instructor not found")

# Eski kursları silmiyoruz, üstüne ekliyoruz.

courses_data = [
    {
        "title": "Python ile Veri Bilimi A'dan Z'ye",
        "description": "Numpy, Pandas ve Matplotlib ile verileri analiz etmeyi öğrenin. Sıfırdan ileri seviyeye veri bilimi müfredatı.",
        "price": 299.99,
        "category": "Yazılım",
        "tags": ["Python", "Veri Bilimi", "Pandas", "Makine Öğrenmesi"],
        "is_published": True,
        "thumbnail_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        "sections": [
            {
                "title": "Veri Bilimine Giriş ve Kurulumlar",
                "videos": [
                    {
                        "title": "Neden Veri Bilimi?",
                        "url": "https://www.youtube.com/embed/PPLop4L2eGk",
                        "attachments": [{"name": "veri_bilimi_giris_slayt.pdf", "url": "/uploads/mock.pdf"}]
                    },
                    {
                        "title": "Python ve Anaconda Kurulumu",
                        "url": "https://www.youtube.com/embed/YJC6ldI3hWk",
                        "attachments": [{"name": "kurulum_talimatlari.txt", "url": "/uploads/kurulum.txt"}]
                    }
                ]
            },
            {
                "title": "Pandas ile Veri Manipülasyonu",
                "videos": [
                    {
                        "title": "Pandas DataFrame Nedir?",
                        "url": "https://www.youtube.com/embed/zN2Hua6oIG0",
                        "attachments": [{"name": "dataset_1.csv", "url": "/uploads/dataset_1.csv"}]
                    },
                    {
                        "title": "Veri Filtreleme ve Gruplama",
                        "url": "https://www.youtube.com/embed/txMdrV1pWww",
                        "attachments": [{"name": "pandas_cheatsheet.pdf", "url": "/uploads/pandas_cheatsheet.pdf"}, {"name": "veri_kumesi_2.xlsx", "url": "/uploads/dataset_2.xlsx"}]
                    }
                ]
            }
        ]
    },
    {
        "title": "İleri Seviye React.js ve Modern Web",
        "description": "Modern React, Hooks, Zustand ve TanStack Query ile gelişmiş web uygulamaları geliştirme rehberi.",
        "price": 349.00,
        "category": "Web Geliştirme",
        "tags": ["React", "JavaScript", "Frontend"],
        "is_published": True,
        "thumbnail_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        "sections": [
            {
                "title": "React Temellerini Hatırlamak",
                "videos": [
                    {
                        "title": "Virtual DOM ve Component Yaşam Döngüsü",
                        "url": "https://www.youtube.com/embed/Oioo0IdoEls",
                        "attachments": [{"name": "react_lifecycle.pdf", "url": "/uploads/react_lifecycle.pdf"}]
                    }
                ]
            },
            {
                "title": "State Management (Durum Yönetimi)",
                "videos": [
                    {
                        "title": "Zustand Kurulumu ve Kullanımı",
                        "url": "https://www.youtube.com/embed/_VqCAHqTqA4",
                        "attachments": [{"name": "zustand_ornek_kod.zip", "url": "/uploads/zustand_ornek_kod.zip"}]
                    },
                    {
                        "title": "TanStack Query (React Query)",
                        "url": "https://www.youtube.com/embed/novnyCaa7To",
                        "attachments": [{"name": "react_query_docs.pdf", "url": "/uploads/react_query_docs.pdf"}]
                    }
                ]
            }
        ]
    },
    {
        "title": "Oyun Geliştirme Temelleri (Unity)",
        "description": "Unity ve C# ile ilk oyununuzu baştan sona geliştirin.",
        "price": 0.0,
        "category": "Oyun",
        "tags": ["Unity", "C#", "Oyun"],
        "is_published": True,
        "thumbnail_url": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f",
        "sections": [
            {
                "title": "Unity Arayüzü ve Temel Bileşenler",
                "videos": [
                    {
                        "title": "Editöre Giriş ve Collider",
                        "url": "https://www.youtube.com/embed/Oioo0IdoEls",
                        "attachments": [{"name": "unity_kisayollar.pdf", "url": "/uploads/kisayollar.pdf"}]
                    },
                    {
                        "title": "C# Script Yazmaya Başlangıç",
                        "url": "https://www.youtube.com/embed/Oioo0IdoEls",
                        "attachments": [{"name": "player_movement.cs", "url": "/uploads/player_movement.cs"}]
                    }
                ]
            }
        ]
    },
    {
        "title": "Makine Öğrenmesi Derinlemesine",
        "description": "Scikit-learn ile temel regresyon ve sınıflandırma modelleri.",
        "price": 499.50,
        "category": "Yapay Zeka",
        "tags": ["AI", "Makine Öğrenmesi", "Python"],
        "is_published": True,
        "thumbnail_url": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
        "sections": [
            {
                "title": "Sınıflandırma ve Regresyon Algoritmaları",
                "videos": [
                    {
                        "title": "Doğrusal Regresyon",
                        "url": "https://www.youtube.com/embed/Oioo0IdoEls",
                        "attachments": [{"name": "linear_regression.ipynb", "url": "/uploads/linear.ipynb"}]
                    },
                    {
                        "title": "Lojistik Regresyon",
                        "url": "https://www.youtube.com/embed/Oioo0IdoEls",
                        "attachments": [{"name": "logistic.ipynb", "url": "/uploads/logistic.ipynb"}]
                    }
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
        "thumbnail_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
        "sections": [
            {
                "title": "Flutter'a Giriş ve Widget Mimarisi",
                "videos": [
                    {
                        "title": "Widget Ağacı",
                        "url": "https://www.youtube.com/embed/Oioo0IdoEls",
                        "attachments": [{"name": "flutter_widgets.png", "url": "/uploads/flutter_widgets.png"}]
                    },
                    {
                        "title": "Stateful vs Stateless",
                        "url": "https://www.youtube.com/embed/Oioo0IdoEls",
                        "attachments": [{"name": "state_management_guide.pdf", "url": "/uploads/state.pdf"}]
                    }
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
        is_published=cd["is_published"],
        thumbnail_url=cd.get("thumbnail_url", "")
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
                duration_seconds=850 + (v_idx * 120)
            )
            db.add(new_vid)
            db.flush()
            
            for att in v_data.get("attachments", []):
                new_att = Attachment(
                    id=str(uuid.uuid4()),
                    video_id=new_vid.id,
                    file_name=att["name"],
                    file_url=att["url"]
                )
                db.add(new_att)

db.commit()
print("Zenginleştirilmiş 5 kurs (bölümler, videolar ve pdfler) başarıyla oluşturuldu!")
db.close()
