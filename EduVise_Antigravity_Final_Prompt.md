# EduVise — Antigravity Final Prompt

---

## 🎯 PROJENİN TANIMI

**EduVise = Udemy benzeri eğitim marketplace + AI Danışman katmanı**

### Marketplace Katmanı (Udemy gibi):
- Eğitmenler kayıt olup kurs oluşturabilir, video yükleyebilir
- Öğrenciler kursları listeler, filtreler, satın alır
- Video player ile ders izlenir, ilerleme takip edilir
- Eğitmen profili, müfredat accordion, öğrenci yorumları

### AI Danışman Katmanı (EduVise'ı farklı kılan):
Öğrenci "New Goal" butonuna basar → hedefini girer → AI tanı sınavı oluşturur
→ sonuçları analiz eder → kişisel roadmap üretir → roadmap'teki her adımda
platformdaki gerçek kursları önerir → öğrenci ilerledikçe roadmap güncellenir
→ kurs bitince AI danışmanlık raporu üretilir.

---

## 🎨 DESIGN SYSTEM (KESİNLİKLE UYGULANACAK)

### Renkler
```css
--primary:             #1A56DB;   /* butonlar, aktif state, progress */
--primary-dark:        #003FB1;   /* hover state */
--secondary:           #006A61;   /* AI önerileri, başarı, teal */
--secondary-container: #86F2E4;   /* teal açık bg */
--background:          #F8F9FA;   /* global arka plan */
--surface:             #FFFFFF;   /* kartlar */
--surface-low:         #F3F4F5;   /* iç card bg */
--border:              #E5E7EB;   /* 1px card border */
--text-primary:        #191C1D;
--text-secondary:      #434654;
--text-muted:          #737686;
--error:               #BA1A1A;   /* gap node, uyarı */
--error-container:     #FFDAD6;
```

### Tipografi — Inter (Google Fonts)
```
headline-lg:  32px / SemiBold 600 / lh:40px / ls:-0.02em
headline-md:  20px / SemiBold 600 / lh:28px / ls:-0.01em
body-lg:      18px / Regular 400 / lh:28px
body-md:      16px / Regular 400 / lh:24px
body-sm:      14px / Regular 400 / lh:20px
label-md:     14px / Medium 500  / lh:16px
label-sm:     12px / Medium 500  / lh:14px / ls:0.02em
mono:         JetBrains Mono 14px
```

### Layout
```
Sidebar:           260px sabit genişlik, #E7E8E9 arka plan
Max content width: 1200px
Spacing base:      4px  (xs:4 sm:8 md:16 lg:24 xl:40)
```

### Border Radius
```
Buton / input:  4px
Kart / modal:   8px
Badge / chip:   9999px
Graph nodes:    50% (circle veya rounded square)
```

### Gölge & Derinlik
- Gölge yerine `1px solid #E5E7EB` border kullan
- Sadece modal/dropdown: `0px 4px 12px rgba(0,0,0,0.05)`
- Kart hiyerarşisi: white card → #F8F9FA background

### Component Kuralları
- **Sidebar active:** Sol `2px` primary blue dikey çizgi + `#F3F4F6` bg, mavi ikon+label
- **Progress bar:** 8px yükseklik, fully rounded, mavi fill, gri track
- **Ghost button (quiz):** Sadece border → seçilince `#EFF4FF` bg + `#1A56DB` border
- **Radar chart:** Teal fill `rgba(13,148,136,0.2)` + solid teal stroke / gri initial polygon
- **Graph nodes:** Circle; mastered=teal border+check; active=mavi fill; gap=kırmızı dashed+uyarı; upcoming=gri

---

## 📱 TÜM EKRANLAR (Tasarıma Birebir)

---

### EKRAN 1: Dashboard `/dashboard`

**Sidebar (260px):**
- Logo: "EduVise" bold + "Adaptive Learning" muted
- Nav: Dashboard (aktif), Roadmap, Courses, Reports
- Alt: Profile, Settings, Help, "Upgrade to Pro" mavi buton

**Top Bar:**
- Arama: "Search knowledge base..."
- Sağ: Zil (kırmızı bildirim noktası), AI ikonu, Ayar, Avatar
- "Support" text link + **"+ New Goal" primary mavi buton** ← önemli

**İçerik (üst — 2 sütun):**
- **Sol — Welcome Card (mavi gradient bg, beyaz metin):**
  "Welcome back, Alex." (headline-lg)
  "Your AI roadmap has been updated. Resume where you left off."
  "Continue Learning →" beyaz outline buton
- **Sağ — Critical Gap Card (beyaz kart, 1px border):**
  "⚡ CRITICAL GAP DETECTED" label (sarı/turuncu ikon, uppercase, muted)
  "Probability Basics" (headline-md, bold)
  "Recent quiz shows 34% drop. Address before proceeding."
  "Review Now" — outline mavi buton

**Orta (2 sütun):**
- **Sol — Knowledge State Card:**
  Başlık: "Knowledge State" + üç nokta menü sağda
  Hexagonal radar chart — 6 eksen: Algorithm, Data Structs, Backend, Frontend, Testing, Sys Design
  Mavi polygon (current), hafif fill
- **Sağ — Skill Progress:**
  "SKILL PROGRESS" label-sm uppercase muted
  Her satır: konu + yüzde (mavi) + 8px progress bar
  (Algorithm 78%, Data Structures 91% teal, Backend 45%, Frontend 62%)
  Alt kart: "🔥 Current Streak / 12 Days"

**Alt — Active Curriculum:**
- "Active Curriculum" başlık
- 3 kurs kartı: thumbnail + badge (REQUIRED kırmızı, TRENDING turuncu, ELECTIVE mor) + başlık + eğitmen + öğrenci sayısı

---

### EKRAN 2: Course Marketplace `/courses`

**Top Bar:**
- Sol: 📚 "Course Marketplace" başlık (bold, sidebar dışında)
- Arama: "Search courses, skills, or instructors..."
- Sağ: Zil, AI ikonu, Support, "**+ New Goal**" butonu, Avatar

**İçerik (2 sütun — sol filtre + sağ grid):**

**Sol Filtre Paneli (beyaz kart):**
- "Ratings" bölümü:
  - ☑ ★★★★☆ 4.5 & up (checked, mavi checkbox)
  - ☑ ★★★★☆ 4.0 & up
- "Duration" bölümü:
  - ○ 0-2 Hours
  - ○ 3-6 Hours
  - ○ 7-15 Hours

**Üst Filtre Bar (grid üstü):**
- "Explore Courses" başlık (headline-lg)
- "Discover top-rated technical courses curated by AI to match your learning goals." (body-md muted)
- Filter chips: Sort by [Most Popular ▾] | Category ▾ | Level ▾ | Price ▾
- Sağda: "Showing 326 results." label-sm muted

**Kurs Grid (3 sütun):**
Her kurs kartı:
- Thumbnail (16:9, 8px radius üst)
- Badge: REQUIRED (kırmızı) / NEW (yeşil) / BESTSELLER (turuncu) — sol üst
- Başlık (label-md bold, 2 satır max)
- Eğitmen adı (body-sm muted)
- ★ rating + (sayı reviews) sarı
- Süre (body-sm muted, sağa hizalı)
- Fiyat: **$49.99** bold

---

### EKRAN 3: Course Detail `/courses/:id`

**Top Bar:**
- Sol: 📖 "Course Detail" başlık
- Arama, Zil, AI, Support, "New Goal" butonu, Avatar

**Hero Bölümü (üst, beyaz kart):**
- Sol: Kurs thumbnail (büyük, 16:9)
- Sağ: 
  - "Advanced" badge (mavi pill) + ★ 4.9 (11k reviews)
  - "Advanced Graph Theory" — headline-lg bold
  - Açıklama — body-md muted
  - Eğitmen satırı: avatar + "Dr. Sarah Chen / Lead AI researcher, EduVise"
  - "Enroll Now →" primary mavi buton (tam genişlik)

**Alt (2 sütun — sol içerik + sağ sticky kart):**

**Sol — Course Curriculum:**
- "Course Curriculum" başlık + "12 lessons • 2h 55m" sağda
- Accordion bölümler:
  - **Module 1: Introduction to Graphs** ▾ (açık)
    - ▶ 1.1 What is a Graph? — 05:00
    - 🔒 1.2 Terminology & Notation — 08:00
  - **Module 2: Traversal Algorithms** › (kapalı)
  - **Module 3: Shortest Path Problems** › (kapalı)
- "About the Instructor": avatar + isim + "4.9 rating · 12k students"
- "Student Reviews": yıldız + yorum kartları

**Sağ — Sticky Purchase Card (beyaz, 1px border, 8px radius):**
- "**$89.99**" büyük bold + ~~$129.99~~ üstü çizili + "30% OFF" kırmızı badge
- "**Enroll Now**" — tam genişlik primary mavi buton
- "30 Day Money-Back Guarantee" — body-sm muted, ortalı
- "What you will learn:" listesi:
  - ✓ Implement Dijkstra's Algorithm from scratch
  - ✓ Master A* Search heuristics
  - ✓ Analyze Network Flow and Bipartite Matching

---

### EKRAN 4: Video Lesson `/learn/:courseId/:lessonId`

**Top Bar (koyu — #1E2029 bg, beyaz metin):**
- Sol: EduVise logo (beyaz) + "AI Adaptive Learning"
- Sağ: Zil, AI ikonu, Support, "**New Goal**" butonu, Avatar

**2 sütun layout:**

**Sol (%68) — Ana İçerik:**
- Video Player (16:9, koyu bg, ortada ▶ play butonu)
- "MODULE 3 · 12:46 min" — label-sm muted
- "Dijkstra's Algorithm Explained" — headline-md bold
- Açıklama — body-md muted
- **AI Learning Assistant Card (açık teal bg, teal sol border):**
  - 🤖 "AI Learning Assistant" başlık (teal)
  - "Based on your progress, focus on **Priority Queues** before continuing. This will ensure mastery of Dijkstra's implementation."
  - "Review Priority Queues →" teal link

**Sağ (%32) — Course Content Panel (beyaz, 1px sol border):**
- "Course Content" başlık + "%65" progress sağda (mavi)
- Bölümler accordion:
  - **Graph Traversals** ▾ (açık)
    - ✅ Breadth-First Search (BFS) — 8:00 (yeşil check, tamamlandı)
    - ✅ Depth-First Search (DFS) — 10:15
  - **Shortest Paths** ▾ (açık)
    - 🔵 **Dijkstra's Algorithm Explained** — 12:46 (aktif, mavi bg)
    - ○ Bellman-Ford Algorithm — locked
    - ○ A* Search — 13:10

**Alt sol — "Upgrade to Pro" mavi buton** (sidebar altında)

---

### EKRAN 5: Diagnostic Assessment `/assessment/diagnostic`

**Top Bar (tam genişlik, beyaz, 1px border alt):**
- Sol: "✕ Exit" + "|" ayraç + "Diagnostic: Logic & Ethics"
- Sağ: "🤖 AI Analyzing..." mavi badge + "⏱ 14:59" sayaç

**İki sütun:**

**Sol (%70) — Soru Kartı (white, 1px border, 8px radius):**
- "QUESTION 12 OF 30" — label-sm uppercase muted
- Soru metni — headline-md bold (2-3 satır)
- `<hr>` divider
- 4 seçenek — ghost button, tam genişlik, 4px radius:
  - Default: beyaz bg, `#E5E7EB` border
  - **Seçili:** `#EFF4FF` bg + `#1A56DB` border + mavi dolu radio
- Alt: "Skip" text link sol + "Submit Answer" primary buton sağ

**Sağ (%30) — 2 kart:**
- **Cognitive Tip** (beyaz, 1px border):
  "💡 COGNITIVE TIP" teal uppercase
  İpucu metni — body-sm
  "Review [Konu] →" teal link
- **Progress** (beyaz, 1px border):
  "Progress" + "40%" sağda mavi
  8px mavi progress bar (fully rounded)

---

### EKRAN 6: Roadmap `/roadmap`

**Top Bar:**
- Arama: "Search knowledge graph..."
- Sağ: Zil, AI ikonu, Ayar, "U" avatar

**Sol Panel (%72) — Knowledge Graph Canvas (#F3F4F5 bg):**
- Zoom +/- kontrolleri sağ alt (beyaz kart, 1px border)
- Node tipleri (rounded square, ~64x64px):
  - **Mastered:** beyaz bg, `#1A56DB` border, teal ✓ ikonu, label alt
  - **Active/Current:** `#1A56DB` bg, beyaz ikon (network), label alt, hafif gölge
  - **Gap:** beyaz bg, `#BA1A1A` dashed border, kırmızı ⚠ ikonu, kırmızı label
  - **Upcoming:** gri bg, gri border, gri ikon
- Node'lar arası: `1px` bağlantı çizgileri (solid veya dashed)

**Sağ Panel (%28, beyaz, 1px sol border):**
- "● CURRENT FOCUS" — mavi nokta + uppercase muted
- Modül adı — headline-lg bold
- Açıklama — body-md muted
- **AI Insight Card** (açık teal bg, teal sol border 2px):
  "🤖 AI Insight" teal başlık
  Analiz metni (**bold** vurgular ile)
- **2 stat kutu yan yana** (1px border, 8px radius):
  "⏱ EST. TIME · 4h 30m" | "📈 DIFFICULTY · High"
- **Module Progress:** "25%" + mavi progress bar
- **Prerequisites:**
  - ✅ "Data Structures — Mastered · Oct 12"
  - ✅ "Discrete Mathematics — Mastered · Oct 20"
  - ⚠ **"Probability Basics"** kırmızı — "Skill gap detected" + "Review Module →" link
- **"Continue Learning →"** tam genişlik primary mavi buton

---

### EKRAN 7: Reports `/reports`

**İçerik:**
- "● Fall Semester Complete" yeşil badge
- "[İsim]'s Learning Journey - Semester Report" — headline-lg
- Alt başlık muted

**Üst (2 sütun):**

**Sol — Skill Gap Analysis Card (beyaz, 1px border):**
- Başlık + Legend: □ Initial State (gri) / ■ Current Mastery (teal)
- Hexagonal radar chart:
  - Gri iç polygon: initial state
  - Teal dış polygon: `rgba(13,148,136,0.2)` fill + solid teal stroke
  - 6 eksen: Data Structs, Algorithm, Sys Design, Testing, Frontend, Backend

**Sağ — 2 kart:**
- **Mastery Stats (beyaz):**
  2 büyük stat yan yana:
  - "92%" primary blue bold + "Increase in Coding Fluency"
  - "85%" teal bold + "Overall Completion Rate"
- **Competency Checklist (beyaz):**
  "12/15 Core" badge
  - ✅ **Advanced Graph Algorithms** — "Mastered Dijkstra's and A*"
  - ✅ **React State Management** — "Proficient with Context API and Redux Toolkit"
  - ✅ **RESTful API Design**
  - ○ Microservices Architecture — "In progress. Focus on inter-service communication."

**Alt — Recommended Next Steps:**
- 3 kurs kartı (thumbnail placeholder + category badge + başlık + açıklama):
  - "AI Alignment" (mavi) — AI Ethics III
  - "Practical App" (turuncu) — Real-world Project Seminar
  - "Infrastructure" (yeşil) — Cloud Deployment Ops

---

## 🏗️ MİMARİ

```
[React Frontend]  ←→  [Python FastAPI Backend]  ←→  [AI Engine (Python)]
                                ↓
                   [PostgreSQL + SQLite + Redis]
```

---

## 🔧 TECHNOLOGY STACK

### Frontend
- **Vite + React 18 + React Router v6**
- **Zustand** — auth, roadmap, course state
- **Axios** — API, JWT interceptor
- **Recharts** — radar chart, bar chart, progress
- **React Flow** — roadmap knowledge graph
- **Tailwind CSS** — design system renkleri config'e ekle
- **Lucide React** — stroke ikonlar (2px)
- **React Player** — video player

### Backend
- **FastAPI + Uvicorn**
- **SQLAlchemy + Alembic** migration
- **Pydantic v2**
- **python-jose** JWT + **passlib[bcrypt]**
- **NetworkX** — knowledge graph algoritmaları
- **NumPy + Pandas + Scikit-learn** — AI engine
- **aioredis** — async cache

### Veritabanı
- **PostgreSQL** — users, enrollments, purchases, reviews
- **SQLite** — courses, modules, questions, knowledge graph
- **Redis** — session + roadmap cache

---

## 📊 VERİTABANI ŞEMASI

```sql
-- KULLANICILAR
users (id, email, password_hash, full_name,
       role ENUM('student','instructor','admin'),
       avatar_url, bio, created_at)

instructor_profiles (id, user_id, expertise_areas[],
                     rating, total_students, total_courses, verified)

-- KURSLAR
courses (id, instructor_id, title, description, category,
         level ENUM('beginner','intermediate','advanced'),
         thumbnail_url, price, currency,
         is_published, rating, enrollment_count, created_at)

sections  (id, course_id, title, order_index)
lessons   (id, section_id, title, video_url,
           duration_seconds, is_preview, order_index)

-- AI KAVRAM HARİTASI
concepts              (id, name, category, description)
concept_prerequisites (concept_id, prerequisite_id)
course_concepts       (course_id, concept_id)  -- hangi kurs hangi kavramı öğretiyor

-- SORU BANKASI
questions (id, concept_id, question_text,
           difficulty ENUM('easy','medium','hard'),
           question_type ENUM('diagnostic','formative'))
options   (id, question_id, option_text, is_correct)

-- ÖĞRENCİ İLERLEMESİ
enrollments     (id, user_id, course_id, enrolled_at, progress_percent, completed_at)
lesson_progress (id, user_id, lesson_id, watched_seconds, completed, last_watched_at)
purchases       (id, user_id, course_id, amount, currency, purchased_at)

-- AI DANIŞMAN
knowledge_states    (id, user_id, concept_id, mastery_score FLOAT, updated_at)
diagnostic_attempts (id, user_id, goal_topic, score, completed_at)
diagnostic_responses(id, attempt_id, question_id, selected_option_id, is_correct)
learning_roadmaps   (id, user_id, goal_topic, roadmap_json, generated_at, last_updated)
counseling_reports  (id, user_id, report_json, generated_at)

-- SOSYAL
reviews (id, user_id, course_id, rating INT, comment, created_at)
```

---

## 🌐 API ENDPOINTLERİ

```
# AUTH
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me

# MARKETPLACE
GET    /api/courses                     filtre: category, level, price, rating, q
GET    /api/courses/:id
GET    /api/courses/:id/sections
POST   /api/courses                     eğitmen kurs oluştur
PUT    /api/courses/:id
POST   /api/courses/:id/publish

# ÖĞRENCİ
POST   /api/enrollments                 kursa kayıt
POST   /api/purchases                   kurs satın al
GET    /api/enrollments/me
GET    /api/lessons/:id
POST   /api/lessons/:id/progress        izleme ilerlemesi

# AI DANIŞMAN
GET    /api/ai/diagnostic?topic=        tanı soruları üret
POST   /api/ai/diagnostic/submit        cevapları gönder → analiz
POST   /api/ai/roadmap/generate         roadmap oluştur
GET    /api/ai/roadmap/:userId
PUT    /api/ai/roadmap/:id              quiz sonrası güncelle
GET    /api/ai/report/:userId
GET    /api/ai/recommend?conceptId=     kavrama göre kurs öner

# EĞİTMEN
GET    /api/instructor/courses
GET    /api/instructor/analytics
POST   /api/instructor/lessons
```

---

## 🧠 AI DANIŞMAN AKIŞI

```
1. "New Goal" butonuna bas → hedef gir (ör. "Backend Developer olmak istiyorum")

2. TANI SINAVI
   → NetworkX ile hedefe gerekli kavramları belirle
   → Her kavramdan zorluk dengeli sorular seç (15-20 soru)
   → Öğrenciye sun (Diagnostic Assessment ekranı)

3. ANALİZ
   → Her soruyu concept_id ile eşleştir
   → concept başına mastery_score hesapla (0.0–1.0)
   → Mastery < 0.6 = "gap" | 0.6–0.8 = "weak" | > 0.8 = "mastered"
   → knowledge_states tablosuna kaydet

4. ROADMAP ÜRETME
   → Topological sort ile öğrenme sırası belirle
   → Her adım için course_concepts üzerinden gerçek kurs eşleştir
   → learning_roadmaps tablosuna kaydet

5. DİNAMİK GÜNCELLEME
   → Öğrenci kurs/ders tamamlayınca mastery_score güncelle
   → Roadmap'i yeniden hesapla, yeni öneriler üret
   → Dashboard "Critical Gap Detected" kartını güncelle

6. DANIŞMANLIK RAPORU
   → Initial vs final knowledge state karşılaştır
   → Radar chart verisi üret (Reports ekranı)
   → Mastered kavramlar + önerilen sonraki adımlar
```

---

## 📁 KLASÖR YAPISI

```
eduvise/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Courses.jsx              marketplace
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── Learn.jsx                video player
│   │   │   ├── DiagnosticAssessment.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── CreateCourse.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── TopBar.jsx
│   │   │   ├── charts/
│   │   │   │   ├── RadarChart.jsx       recharts, teal fill, reusable
│   │   │   │   └── ProgressBar.jsx     8px, rounded, mavi
│   │   │   ├── roadmap/
│   │   │   │   ├── KnowledgeGraph.jsx  React Flow canvas
│   │   │   │   ├── MasteredNode.jsx
│   │   │   │   ├── ActiveNode.jsx
│   │   │   │   └── GapNode.jsx
│   │   │   ├── assessment/
│   │   │   │   └── QuestionCard.jsx
│   │   │   └── course/
│   │   │       ├── CourseCard.jsx
│   │   │       ├── CurriculumAccordion.jsx
│   │   │       └── VideoPlayer.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── roadmapStore.js
│   │   │   └── courseStore.js
│   │   ├── api/
│   │   │   ├── axios.js               base instance + JWT interceptor
│   │   │   ├── auth.js
│   │   │   ├── courses.js
│   │   │   └── ai.js
│   │   └── App.jsx
│   ├── tailwind.config.js             design system renkleri burada
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── courses.py
│   │   │   ├── lessons.py
│   │   │   ├── ai_advisor.py
│   │   │   └── instructor.py
│   │   ├── models/                    SQLAlchemy ORM
│   │   ├── schemas/                   Pydantic
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── roadmap_service.py     NetworkX
│   │   │   ├── diagnostic_service.py
│   │   │   └── report_service.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py            JWT
│   │   │   └── database.py
│   │   └── utils/
│   └── requirements.txt
│
└── docker-compose.yml
```

---

## 🚀 BAŞLANGIÇ TALİMATI

**İkisi paralel ilerleyecek:**

### Frontend
1. `npm create vite@latest eduvise-frontend -- --template react`
2. Tailwind kur → `tailwind.config.js`'e yukarıdaki CSS değişkenlerini ekle
3. Sidebar + TopBar layout'u oluştur
4. Sayfa sırası (mock data ile başla):
   - Dashboard → Courses → CourseDetail → Learn → DiagnosticAssessment → Roadmap → Reports
5. API hazır olunca mock'ları swap et

### Backend
1. FastAPI + PostgreSQL + Alembic kur
2. SQLAlchemy modelleri yaz
3. JWT auth endpoint'leri
4. Course CRUD endpoint'leri
5. AI Advisor servisini yaz (NetworkX + diagnostic logic)
6. Docker Compose ile ayağa kaldır

---

## ⚠️ KRİTİK NOTLAR

- **`tailwind.config.js`'e tüm design system renklerini ekle** — hardcoded hex kullanma
- **`<RadarChart />`** tek bileşen olarak yaz, hem Dashboard hem Reports'ta props ile kullanılacak
- **React Flow node'ları** ayrı custom component: `MasteredNode`, `ActiveNode`, `GapNode`
- **`course_concepts` tablosu** AI öneri sisteminin temeli — her kurs eklendiğinde doldurulmalı
- **Video Player** için React Player kullan
- **"New Goal" butonu** top bar'da her zaman görünür — AI danışman akışını tetikler
- **AI servisi** başlangıçta backend içinde yaz, ileride ayrı container'a taşınabilir

---

*EduVise — Udemy benzeri eğitim platformu + AI Danışman*
*Frontend: React + Tailwind + Recharts + React Flow*
*Backend: Python FastAPI + PostgreSQL + NetworkX*
