# EduVise — Antigravity Master Prompt
> Bu prompt Google Antigravity 2.0 Desktop App veya CLI'a yapıştırılarak kullanılır.
> Agent sistemi projeyi sıfırdan, tam çalışır halde inşa eder.

---

## 🎯 GÖREV

Sen bir senior full-stack yazılım mühendisisin. Aşağıda tanımlanan **EduVise** platformunu — Udemy benzeri bir kurs pazaryeri + AI destekli kişisel öğrenme danışmanı — sıfırdan, production-ready, tam çalışır şekilde inşa edeceksin.

**Teknoloji Stack:**
- Frontend: React 18 + Vite + TailwindCSS + React Query + Zustand + React Router v6
- Backend: Python 3.11 + FastAPI + SQLAlchemy + Alembic + Pydantic v2
- Veritabanı: SQLite (geliştirme) / PostgreSQL ready yapı
- AI: Anthropic Claude API (claude-sonnet-4-20250514)
- Auth: JWT (access + refresh token)
- Dosya Upload: Lokal + S3-ready yapı
- Video: HTML5 player (harici CDN veya lokal)

---

## 📁 PROJE YAPISI

Şu klasör yapısını oluştur:

```
eduvise/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── course.py
│   │   │   ├── assessment.py
│   │   │   ├── roadmap.py
│   │   │   └── enrollment.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── course.py
│   │   │   ├── assessment.py
│   │   │   └── roadmap.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── courses.py
│   │   │   ├── assessments.py
│   │   │   ├── roadmap.py
│   │   │   ├── ai.py
│   │   │   └── instructor.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── ai_engine.py
│   │   │   └── knowledge_graph.py
│   │   └── core/
│   │       ├── __init__.py
│   │       ├── security.py
│   │       └── dependencies.py
│   ├── alembic/
│   ├── requirements.txt
│   ├── .env.example
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── marketplace/
│   │   │   │   └── Marketplace.jsx
│   │   │   ├── course/
│   │   │   │   ├── CourseDetail.jsx
│   │   │   │   └── VideoLesson.jsx
│   │   │   ├── assessment/
│   │   │   │   └── DiagnosticAssessment.jsx
│   │   │   ├── roadmap/
│   │   │   │   └── LearningRoadmap.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   └── InstructorDashboard.jsx
│   │   │   ├── report/
│   │   │   │   └── CounselingReport.jsx
│   │   │   └── instructor/
│   │   │       └── CourseManager.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Progress.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── course/
│   │   │   │   ├── CourseCard.jsx
│   │   │   │   └── CourseFilters.jsx
│   │   │   └── ai/
│   │   │       ├── AIChat.jsx
│   │   │       └── RoadmapGraph.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── courseStore.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useCourse.js
│   │   └── lib/
│   │       ├── api.js
│   │       └── utils.js
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🗄️ VERİTABANI MODELLERİ

### `backend/app/models/user.py`
```python
from sqlalchemy import Column, String, Enum, Boolean, DateTime
from sqlalchemy.dialects.sqlite import JSON
from app.database import Base
import uuid, enum
from datetime import datetime

class UserRole(str, enum.Enum):
    student = "student"
    instructor = "instructor"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### `backend/app/models/course.py`
```python
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
from datetime import datetime

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    instructor_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, nullable=False)
    level = Column(String, default="beginner")  # beginner, intermediate, advanced
    price = Column(Float, default=0.0)
    thumbnail_url = Column(String)
    is_published = Column(Boolean, default=False)
    tags = Column(JSON, default=list)
    topic_map = Column(JSON, default=dict)  # {topic_name: [video_ids]}
    created_at = Column(DateTime, default=datetime.utcnow)
    
    instructor = relationship("User", foreign_keys=[instructor_id])
    sections = relationship("Section", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")

class Section(Base):
    __tablename__ = "sections"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    topic_tag = Column(String)  # hangi konuya ait (AI roadmap için)
    course = relationship("Course", back_populates="sections")
    videos = relationship("Video", back_populates="section", cascade="all, delete-orphan")

class Video(Base):
    __tablename__ = "videos"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id = Column(String, ForeignKey("sections.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    video_url = Column(String, nullable=False)
    duration_seconds = Column(Integer, default=0)
    order_index = Column(Integer, default=0)
    is_preview = Column(Boolean, default=False)
    section = relationship("Section", back_populates="videos")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_videos = Column(JSON, default=list)  # [video_id, ...]
    course = relationship("Course", back_populates="enrollments")
```

### `backend/app/models/assessment.py`
```python
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship
from app.database import Base
import uuid, enum
from datetime import datetime

class AssessmentType(str, enum.Enum):
    diagnostic = "diagnostic"
    module = "module"
    final = "final"

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    topic_tag = Column(String, nullable=False)  # hangi konuya ait
    assessment_type = Column(String, nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # ["A", "B", "C", "D"]
    correct_option_index = Column(Integer, nullable=False)
    explanation = Column(Text)
    difficulty = Column(Integer, default=1)  # 1-3

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    type = Column(String, nullable=False)
    answers = Column(JSON, default=dict)  # {question_id: selected_option_index}
    topic_scores = Column(JSON, default=dict)  # {topic: score 0.0-1.0}
    overall_score = Column(Float)
    ai_analysis = Column(JSON)  # AI'ın ürettiği analiz
    completed_at = Column(DateTime, default=datetime.utcnow)
```

### `backend/app/models/roadmap.py`
```python
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.sqlite import JSON
from app.database import Base
import uuid
from datetime import datetime

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    roadmap_data = Column(JSON)  # AI'ın ürettiği tam roadmap yapısı
    # roadmap_data format:
    # {
    #   "ordered_topics": ["topic1", "topic2", ...],
    #   "nodes": {
    #     "topic_name": {
    #       "status": "completed|active|locked|remedial",
    #       "mastery_score": 0.7,
    #       "video_ids": ["v1","v2"],
    #       "remedial_video_ids": [],
    #       "reason": "AI açıklaması"
    #     }
    #   }
    # }
    recommended_courses = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

## ⚙️ BACKEND — TEMEL DOSYALAR

### `backend/app/database.py`
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### `backend/app/config.py`
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./eduvise.db"
    SECRET_KEY: str = "changeme-in-production-use-random-256bit"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ANTHROPIC_API_KEY: str = ""
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 500

    class Config:
        env_file = ".env"

settings = Settings()
```

### `backend/app/core/security.py`
```python
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode["type"] = "access"
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode["type"] = "refresh"
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
```

### `backend/app/core/dependencies.py`
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id or payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Geçersiz token")
    except Exception:
        raise HTTPException(status_code=401, detail="Geçersiz token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı")
    return user

def require_instructor(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in [UserRole.instructor, UserRole.admin]:
        raise HTTPException(status_code=403, detail="Eğitmen yetkisi gerekli")
    return current_user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin yetkisi gerekli")
    return current_user
```

---

## 🔌 API ENDPOINT'LERİ

### `backend/app/api/auth.py`
Şu endpoint'leri tam implement et:
- `POST /auth/register` — email, full_name, password, role(student/instructor) alır. User oluşturur, access+refresh token döner.
- `POST /auth/login` — email, password alır. Token çifti döner.
- `POST /auth/refresh` — refresh_token alır. Yeni access_token döner.
- `GET /auth/me` — JWT'den mevcut kullanıcı bilgilerini döner.
- `PUT /auth/profile` — full_name, bio, avatar_url günceller.

### `backend/app/api/courses.py`
Şu endpoint'leri tam implement et:
- `GET /courses` — Query params: category, level, search, page, limit. Published kursları döner. Her kurs için instructor bilgisi, enrollment sayısı dahil.
- `GET /courses/{course_id}` — Kurs detayı. Sections, videos (sadece preview veya kayıtlı kullanıcı için tam liste), instructor profili.
- `POST /courses` — Eğitmen kurs oluşturur. [instructor yetkisi gerekli]
- `PUT /courses/{course_id}` — Kurs günceller. [sadece kursun instructoru]
- `DELETE /courses/{course_id}` — Kursu siler. [sadece kursun instructoru]
- `POST /courses/{course_id}/publish` — Kursu yayınlar.
- `POST /courses/{course_id}/enroll` — Öğrenci kursa kaydolur. Ücretsiz kurslar için direkt, ücretli için (şimdilik mock ödeme).
- `GET /courses/{course_id}/progress` — Öğrencinin ilerleme durumu. Tamamlanan videolar, genel yüzde.
- `POST /courses/{course_id}/sections` — Bölüm ekler. [instructor]
- `POST /sections/{section_id}/videos` — Video ekler. Multipart form data: title, description, video_file. [instructor]
- `PUT /videos/{video_id}/complete` — Öğrenci videoyu tamamlandı olarak işaretler.

### `backend/app/api/assessments.py`
Şu endpoint'leri tam implement et:
- `GET /courses/{course_id}/questions` — Eğitmene ait soru listesi. [instructor]
- `POST /courses/{course_id}/questions` — Soru ekler. topic_tag, assessment_type, question_text, options, correct_option_index, explanation, difficulty alır. [instructor]
- `GET /assessments/diagnostic/{course_id}` — Kursa ait tanı sınavı sorularını döner (rastgele 15 soru, tüm topic_tag'lerden dengeli).
- `POST /assessments/diagnostic/submit` — Öğrencinin cevaplarını gönderir. Her topic için skor hesaplar. AI Engine'i çağırır (analiz için). Roadmap oluşturmak için roadmap servisini tetikler. Assessment kaydeder ve AI analizini döner.
- `GET /assessments/module/{section_id}` — Modül sonu sınavı sorularını döner.
- `POST /assessments/module/submit` — Modül sınavı cevaplarını gönderir. Skoru hesaplar. Başarısız olunca roadmap'e remedial video ekler (AI Engine).
- `GET /assessments/final/{course_id}` — Final sınavı sorularını döner.
- `POST /assessments/final/submit` — Final sınavı cevaplarını gönderir. Final raporu üretimini tetikler.

### `backend/app/api/roadmap.py`
Şu endpoint'leri tam implement et:
- `GET /roadmap/{course_id}` — Öğrencinin o kursa ait güncel roadmap'ini döner.
- `GET /roadmap/{course_id}/recommendations` — AI'ın önerdiği tamamlayıcı kurs listesi.
- `PATCH /roadmap/{course_id}/node/{topic}` — Belirli bir topic node'unun durumunu günceller (completed, active, locked).

### `backend/app/api/ai.py`
Şu endpoint'leri tam implement et:
- `POST /ai/chat` — Öğrenci AI danışmanıyla sohbet eder. body: {message, course_id, context}. Claude API'ye öğrencinin roadmap ve ilerleme bilgisini system prompt'a ekleyerek gönderir. Streaming response döner (StreamingResponse).
- `GET /ai/report/{course_id}` — Öğrencinin o kurs için oluşturulmuş danışmanlık raporunu döner.
- `POST /ai/report/{course_id}/generate` — Final sınavı bittikten sonra AI raporu üretir. Tüm assessment geçmişini, topic skorlarını, video tamamlama verisini toplar. Claude'a gönderir. Yapılandırılmış JSON rapor döner.

### `backend/app/api/instructor.py`
- `GET /instructor/courses` — Eğitmenin kursları + istatistikler (kayıt sayısı, ortalama skor).
- `GET /instructor/courses/{course_id}/analytics` — Detaylı analitik: öğrenci sayısı, topic bazlı başarı oranları, video tamamlama oranları.
- `GET /instructor/courses/{course_id}/students` — Kayıtlı öğrenci listesi + bireysel ilerleme.

---

## 🤖 AI ENGINE

### `backend/app/services/ai_engine.py`
Bu servisi tam implement et:

```python
import anthropic
from app.config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

async def analyze_diagnostic_results(topic_scores: dict, course_topics: list) -> dict:
    """
    Tanı sınavı sonuçlarını analiz eder.
    Döndürmesi gereken JSON yapısı:
    {
      "strengths": ["topic1", "topic2"],
      "weaknesses": ["topic3", "topic4"],
      "recommended_order": ["topic3", "topic4", "topic1", "topic2"],
      "skip_topics": ["topic1"],  // 0.85+ skor alanlar
      "summary": "Öğrencinin genel değerlendirmesi (Türkçe)",
      "estimated_hours": 12
    }
    Prompt'ta Claude'a SADECE JSON döndürmesini söyle.
    """

async def generate_roadmap(
    user_id: str,
    course_id: str,
    diagnostic_result: dict,
    course_sections: list,
    db
) -> dict:
    """
    Tanı analizi + kurs bölümlerinden kişisel roadmap üretir.
    Her topic için status (active/locked/skip), video_ids atar.
    LearningRoadmap tablosuna kaydeder.
    """

async def adjust_roadmap_after_module(
    user_id: str,
    course_id: str,
    topic: str,
    score: float,
    db
) -> dict:
    """
    Modül sınavı sonrası roadmap'i günceller.
    score < 0.6 ise: topic'i 'remedial' olarak işaretle, remedial videolar ekle
    score >= 0.6 ise: topic'i 'completed' yap, sonraki topic'i 'active' aç
    """

async def generate_counseling_report(
    user_id: str,
    course_id: str,
    db
) -> dict:
    """
    Final raporu üretir. Tüm assessment geçmişini toplar.
    Claude'a gönderir. Şu yapıda JSON döner:
    {
      "overall_score": 0.78,
      "mastered_skills": ["OOP", "Functions"],
      "weak_areas": ["Recursion"],
      "learning_velocity": "average",
      "study_hours_spent": 14,
      "compared_to_average": "+12%",
      "next_courses": ["Advanced Python", "Data Structures"],
      "detailed_narrative": "Türkçe detaylı rapor metni (3-4 paragraf)",
      "skill_radar": {"OOP": 0.9, "Functions": 0.85, "Recursion": 0.4}
    }
    SADECE JSON döndür.
    """

async def get_ai_chat_response(
    message: str,
    student_context: dict,
    history: list
):
    """
    Streaming AI sohbet yanıtı.
    system_prompt'a öğrencinin roadmap durumu, tamamladığı konular,
    mevcut konusu ve zayıf alanlarını ekle.
    Türkçe, destekleyici ve eğitim odaklı yanıt ver.
    StreamingResponse ile döndür.
    """
```

---

## 🎨 FRONTEND — TASARIM SİSTEMİ

### `frontend/tailwind.config.js`
EduVise'ın tasarım sistemini tam olarak Tailwind'e aktar:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1A56DB", dark: "#003FB1", light: "#DBE1FF" },
        secondary: { DEFAULT: "#006A61", light: "#86F2E4" },
        surface: { DEFAULT: "#F8F9FA", card: "#FFFFFF", border: "#E1E3E4" },
        text: { primary: "#191C1D", secondary: "#434654", muted: "#737686" },
        success: "#006A61",
        warning: "#854F0B",
        error: "#BA1A1A"
      },
      fontFamily: { sans: ["Inter", "sans-serif"], mono: ["JetBrains Mono", "monospace"] },
      borderRadius: { DEFAULT: "4px", md: "6px", lg: "8px", xl: "12px" },
      boxShadow: { card: "0px 4px 12px rgba(0, 0, 0, 0.05)" }
    }
  }
}
```

### `frontend/src/index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📄 FRONTEND SAYFALARI — DETAYLI GEREKSINIMLER

### `Login.jsx` ve `Register.jsx`
- Temiz, minimalist form. Logo üstte.
- Register: Ad Soyad, Email, Şifre, Rol seçimi (Öğrenci / Eğitmen).
- Login başarılı → role'e göre yönlendirme: student→/dashboard, instructor→/instructor.
- Zustand authStore: `{ user, token, setAuth, logout }`.
- Token localStorage'a kaydedilsin. Sayfa yenilemede restore edilsin.

### `Marketplace.jsx`
- Grid layout. Üstte arama bar + kategori filtreleri (tüm, programlama, tasarım, veri bilimi, vb).
- Her kurs kartı: thumbnail, başlık, eğitmen adı, rating yıldızları (mock), fiyat, öğrenci sayısı, "AI Destekli" rozeti (AI olan kurslar için).
- Sayfalama (page, limit).
- Tıklayınca /courses/:id'ye git.

### `CourseDetail.jsx`
- Sol taraf: video önizleme/thumbnail, kurs başlığı, açıklama, eğitmen profil kartı.
- Sağ taraf sticky: fiyat, "Kursa Kayıt Ol" butonu, kurs içeriği accordion (sections + video listesi, kilitli olanlar kilit ikonu ile).
- Kayıtlı kullanıcı için "Öğrenmeye Devam Et" butonu görünür.

### `DiagnosticAssessment.jsx`
- Kurs kaydından hemen sonra otomatik tetiklenir.
- Tam ekran sınav UI. Üstte ilerleme bar (1/15, 2/15...).
- Her soru kartı: soru metni, 4 seçenek (ghost button, seçince primary renge döner).
- "Sonraki Soru" butonu. Son soruda "Sınavı Bitir".
- Submit sonrası loading ekranı ("AI analizin hazırlanıyor...") → sonra LearningRoadmap'e yönlendirme.

### `LearningRoadmap.jsx`
- Sol sidebar: topic node listesi (renk kodlu: teal=tamamlandı, blue=aktif, gray=kilitli, orange=remedial).
- Orta alan: interaktif node grafiği. SVG veya canvas ile basit bağlantılı node haritası.
- Sağ panel: seçili node detayı — konunun adı, mastery skoru, ilgili videolar.
- Üstte genel ilerleme bar.
- "Kurs Önerileri" bölümü: AI'ın önerdiği tamamlayıcı kurslar kartları.

### `VideoLesson.jsx`
- Sol 2/3: HTML5 video player, altında video başlığı ve açıklama.
- Sağ 1/3: Kurs içerik sidebar. Aktif section açık, videolar listeli. Tamamlananlar ✓ işaretli.
- Video bitince otomatik "Tamamlandı" işaretleme API çağrısı.
- Sağ altında küçük AI sohbet widget: "Bu konuyla ilgili soru sor". Streaming yanıtla.

### `StudentDashboard.jsx`
- Üst row: istatistik kartları (Kayıtlı Kurs Sayısı, Tamamlanan Video, Toplam Öğrenme Saati, Aktif Roadmap Sayısı).
- Kayıtlı kurslar grid: her kurs için thumbnail, başlık, ilerleme bar (% tamamlama).
- Sağ panel: "AI Danışmanım" özeti — aktif roadmap'teki sonraki öneri, kısa mesaj.

### `InstructorDashboard.jsx`
- Üst istatistikler: Toplam Kurs, Toplam Öğrenci, Toplam Gelir (mock).
- Kurs listesi tablosu: başlık, durum (taslak/yayında), kayıt sayısı, ortalama tamamlama, Düzenle/Analiz butonları.
- "Yeni Kurs Oluştur" butonu.

### `CourseManager.jsx` (Eğitmen Kurs Yönetimi)
Multi-step wizard:
1. **Temel Bilgiler**: Başlık, açıklama, kategori, seviye, fiyat, thumbnail upload.
2. **İçerik**: Section ekle (drag-drop sıralama). Her section altında Video ekle (dosya upload + başlık + süre). Topic tag ata (AI'ın konuları anlaması için).
3. **Soru Bankası**: Her topic için tanı/modül/final sorularını ekle. Soru metni, 4 seçenek, doğru cevap, açıklama, zorluk.
4. **Yayınla**: Önizleme özeti. "Kursu Yayınla" butonu.

### `CounselingReport.jsx`
- Üstte başlık ve kurs adı.
- Radar chart (recharts kullanarak): topic bazlı mastery skorları.
- Kart grid: Güçlü Konular (yeşil), Gelişim Alanları (turuncu), Öğrenme Hızı, Genel Skor.
- "AI Danışman Değerlendirmesi" bölümü: detailed_narrative metni şık tipografi ile.
- "Sonraki Adımlar" bölümü: önerilen kurslar kartları.

---

## 🔧 BAĞLANTI ve ÇALIŞTIRMA

### `backend/requirements.txt`
```
fastapi==0.115.0
uvicorn[standard]==0.30.0
sqlalchemy==2.0.36
alembic==1.13.3
pydantic==2.9.2
pydantic-settings==2.5.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
anthropic==0.40.0
aiofiles==24.1.0
```

### `backend/.env.example`
```
DATABASE_URL=sqlite:///./eduvise.db
SECRET_KEY=change-this-to-random-256bit-string
ANTHROPIC_API_KEY=your-anthropic-api-key-here
UPLOAD_DIR=./uploads
```

### `backend/run.py`
```python
import uvicorn
from app.main import app
from app.database import Base, engine
from app import models  # tüm modelleri import et

Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

### `backend/app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.config import settings
from app.api import auth, courses, assessments, roadmap, ai, instructor

app = FastAPI(title="EduVise API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(assessments.router, prefix="/assessments", tags=["assessments"])
app.include_router(roadmap.router, prefix="/roadmap", tags=["roadmap"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(instructor.router, prefix="/instructor", tags=["instructor"])
```

### `frontend/package.json` — gerekli paketler:
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.56.2",
    "zustand": "^4.5.5",
    "axios": "^1.7.7",
    "recharts": "^2.12.7",
    "lucide-react": "^0.441.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.11",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "vite": "^5.4.7"
  }
}
```

### `frontend/src/lib/api.js`
Axios instance oluştur. Base URL: `http://localhost:8000`. Authorization header'ı localStorage'dan JWT ile otomatik ekle. 401 alınca localStorage temizle ve /login'e yönlendir.

### `frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
```

---

## ✅ UYGULAMA KURALLARI

1. **Her dosyayı tam yaz** — placeholder veya "// TODO" bırakma. Her fonksiyon çalışır olsun.
2. **Hata yönetimi** — try/catch her API çağrısında. FastAPI'de HTTPException kullan. Frontend'de kullanıcıya hata mesajı göster.
3. **Loading states** — API çağrıları sırasında spinner veya skeleton göster.
4. **Türkçe UI** — tüm buton, başlık, mesaj metinleri Türkçe olsun.
5. **Seed data** — Projeyi çalıştırınca otomatik olarak 1 admin, 1 instructor, 2 öğrenci, 2 örnek kurs (bölümleri ve örnek soruları ile birlikte) oluşturan bir `seed.py` dosyası yaz.
6. **README.md** — Projeyi sıfırdan çalıştırma adımları: virtualenv, pip install, .env kurulumu, python run.py, npm install, npm run dev.

---

## 🚀 ÇALIŞTIRMA SIRASI

Agent tüm dosyaları yazdıktan sonra şu sırayı takip et:

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# .env içine ANTHROPIC_API_KEY'i gir
python seed.py
python run.py
# → http://localhost:8000/docs (Swagger UI)

# Frontend (yeni terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🎁 SEED KULLANICILARI

```
Admin:      admin@eduvise.com / Admin123!
Eğitmen:    egitmen@eduvise.com / Egitmen123!
Öğrenci 1:  ogrenci1@eduvise.com / Ogrenci123!
Öğrenci 2:  ogrenci2@eduvise.com / Ogrenci123!
```

---

*Bu prompt Berkay Binici & Mustafa Buğra Boz — EduVise Bitirme Projesi için hazırlanmıştır.*
*İstanbul Aydın Üniversitesi, Software Development, 2024-2025*
