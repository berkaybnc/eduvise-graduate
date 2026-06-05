import google.generativeai as genai
import json
from app.config import settings
from app.models.roadmap import LearningRoadmap
from app.models.course import Enrollment, Course
from sqlalchemy.orm import Session
import uuid

# Gemini API Key configuration
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

async def analyze_diagnostic_results(topic_scores: dict, course_topics: list) -> dict:
    prompt = f"""
    Sen bir AI Öğrenme Asistanısın. Öğrencinin test skorlarını analiz edip JSON dönmelisin.
    Konular: {course_topics}
    Öğrenci Skorları (0-1 arası): {topic_scores}
    Lütfen güçlü alanları (>0.85), zayıf alanları (<0.60) bul. Zayıf alanları öğrenme sırasının en başına koyarak recommended_order belirle.
    SADECE aşağıdaki formatta geçerli bir JSON döndür, açıklama yapma:
    {{
      "strengths": ["topic1"],
      "weaknesses": ["topic2"],
      "recommended_order": ["topic2", "topic1"],
      "skip_topics": ["topic1"],
      "summary": "Öğrencinin genel değerlendirmesi (Türkçe)",
      "estimated_hours": 12
    }}
    """
    try:
        if not settings.GEMINI_API_KEY:
            # Mock if no key
            return {
                "strengths": [], "weaknesses": [], "recommended_order": course_topics,
                "skip_topics": [], "summary": "AI API Key bulunamadı, varsayılan sıra.", "estimated_hours": 10
            }
            
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sadece JSON çıktısı üret.")
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"AI Engine Error: {e}")
        return {
            "strengths": [], "weaknesses": [], "recommended_order": course_topics,
            "skip_topics": [], "summary": "Analiz yapılamadı.", "estimated_hours": 10
        }

async def generate_roadmap(user_id: str, course_id: str, diagnostic_result: dict, course_sections: list, db: Session) -> dict:
    ordered_topics = diagnostic_result.get("recommended_order", [])
    skip_topics = diagnostic_result.get("skip_topics", [])
    
    nodes = {}
    is_first = True
    
    for section in course_sections:
        topic = section.topic_tag or section.title
        status = "locked"
        if topic in skip_topics:
            status = "completed"
        elif is_first and status != "completed":
            status = "active"
            is_first = False
            
        nodes[topic] = {
            "status": status,
            "mastery_score": 0.0,
            "video_ids": [v.id for v in section.videos],
            "remedial_video_ids": [],
            "reason": "Başlangıç durumu"
        }
    
    roadmap_data = {
        "ordered_topics": ordered_topics if ordered_topics else [s.topic_tag for s in course_sections],
        "nodes": nodes
    }
    
    roadmap = LearningRoadmap(
        user_id=user_id,
        course_id=course_id,
        roadmap_data=roadmap_data
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    return roadmap_data

async def adjust_roadmap_after_module(user_id: str, course_id: str, topic: str, score: float, db: Session) -> dict:
    roadmap = db.query(LearningRoadmap).filter_by(user_id=user_id, course_id=course_id).first()
    if not roadmap:
        return {}
        
    data = roadmap.roadmap_data
    nodes = data.get("nodes", {})
    if topic in nodes:
        nodes[topic]["mastery_score"] = score
        if score < 0.6:
            nodes[topic]["status"] = "remedial"
            nodes[topic]["reason"] = "Modül sınavı skoru düşük, eksikler tekrar edilmeli."
        else:
            nodes[topic]["status"] = "completed"
            nodes[topic]["reason"] = "Başarıyla tamamlandı."
            # find next topic and unlock
            ordered = data.get("ordered_topics", [])
            try:
                idx = ordered.index(topic)
                if idx + 1 < len(ordered):
                    next_t = ordered[idx+1]
                    if nodes.get(next_t, {}).get("status") == "locked":
                        nodes[next_t]["status"] = "active"
            except ValueError:
                pass
                
    roadmap.roadmap_data = data
    db.commit()
    return data

async def generate_counseling_report(user_id: str, course_id: str, db: Session) -> dict:
    prompt = """
    Sen bir AI Eğitsel Danışmansın. Öğrencinin dönem sonu raporunu oluştur.
    Lütfen SADECE şu formattaki bir JSON döndür:
    {
      "overall_score": 0.78,
      "mastered_skills": ["OOP"],
      "weak_areas": ["Recursion"],
      "learning_velocity": "average",
      "study_hours_spent": 14,
      "compared_to_average": "+12%",
      "next_courses": ["Advanced Python"],
      "detailed_narrative": "Türkçe detaylı rapor metni",
      "skill_radar": {"OOP": 0.9, "Recursion": 0.4}
    }
    """
    try:
        if not settings.GEMINI_API_KEY:
            return {
                "overall_score": 0.8, "mastered_skills": ["Temel Kavramlar"], "weak_areas": [],
                "learning_velocity": "fast", "study_hours_spent": 10, "compared_to_average": "+5%",
                "next_courses": [], "detailed_narrative": "Harika bir gelişim gösterdiniz.",
                "skill_radar": {"Temel Kavramlar": 0.8}
            }
            
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sadece JSON çıktısı üret.")
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"AI Report Error: {e}")
        return {"overall_score": 0.0, "detailed_narrative": "Analiz başarısız."}

async def get_ai_chat_response(message: str, student_context: dict, history: list):
    course_title = student_context.get("course_title", "Bilinmeyen Kurs")
    video_title = student_context.get("video_title", "Bilinmeyen Video")
    
    prompt = f"""
    Sen EduVise platformunda bir 'Yapay Zeka Öğrenme Asistanı'sın.
    Şu anda öğrenci '{course_title}' kursunda '{video_title}' adlı videoyu izliyor.
    Amacın öğrencinin sorduğu soruya bu bağlamda yardımcı olmak, gerekirse konuyu daha basit bir dille açıklamak veya pratik yapması için sorular sormaktır.
    
    Öğrencinin mesajı: {message}
    """
    try:
        if not settings.GEMINI_API_KEY:
            return f"AI Asistan (Mock): '{video_title}' konusuyla ilgili size şöyle yardımcı olabilirim: ..."
            
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sen yardımsever ve teşvik edici bir eğitim asistanısın.")
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"Chat AI Error: {e}")
        return "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin."

async def generate_diagnostic_questions(course_title: str, course_category: str, course_sections: list) -> dict:
    section_titles = [s.title for s in course_sections] if course_sections else []
    prompt = f"""
    Sen uzman bir eğitim danışmanısın. Aşağıda verilen kursa kayıt olmak isteyen bir öğrenci için 3 adet çoktan seçmeli 'Önkoşul Seviye Tespit Sınavı' (Prerequisite Diagnostic Test) hazırlamalısın.
    Kurs Adı: {course_title}
    Kategori: {course_category}
    Bölümler: {section_titles}
    
    ÖNEMLİ: Sorular kursun İÇERİĞİNİ değil, bu kursu ANLAYABİLMEK İÇİN BİLİNMESİ GEREKEN ÖNKOŞUL temel bilgileri ölçmelidir.
    Ayrıca öğrenci eğer bu testi geçemezse ona sunulacak bir "Önkoşul Yol Haritası" metni (prerequisite_roadmap) oluşturmalısın. Bu metin, öğrenciye bu kursu almadan önce hangi konuları öğrenmesi gerektiğini tavsiye eden teşvik edici bir mesaj olmalıdır.
    
    Lütfen SADECE aşağıdaki formatta bir JSON objesi döndür. Herhangi bir ekstra açıklama ekleme:
    {{
      "questions": [
        {{
          "id": 1,
          "question": "Önkoşul bilgi sorusu 1",
          "options": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
          "correct": 0
        }}
      ],
      "prerequisite_roadmap": "Bu eğitime katılmadan önce şu temel konuları öğrenmeniz faydalı olacaktır: 1. Konu A, 2. Konu B..."
    }}
    "correct" alanı 0 ile 3 arasında doğru şıkkın indeksini (0-indexed) belirtmelidir.
    """
    
    try:
        if not settings.GEMINI_API_KEY:
            cat_lower = course_category.lower()
            
            if "web" in cat_lower or "frontend" in cat_lower:
                questions = [
                    {
                        "id": 1,
                        "question": "Aşağıdakilerden hangisi bir HTML belgesinin ana yapısal etiketlerinden biridir?",
                        "options": ["<style>", "<body>", "<script>", "<meta>"],
                        "correct": 1
                    },
                    {
                        "id": 2,
                        "question": "CSS'de bir elementin arka plan rengini değiştirmek için hangi özellik kullanılır?",
                        "options": ["color", "bg-color", "background-color", "fill"],
                        "correct": 2
                    },
                    {
                        "id": 3,
                        "question": "JavaScript'te bir değişken tanımlamak için aşağıdakilerden hangisi kullanılmaz?",
                        "options": ["var", "let", "const", "def"],
                        "correct": 3
                    }
                ]
                roadmap_msg = f"{course_title} eğitimine başlamadan önce temel HTML, CSS ve JavaScript mantığını gözden geçirmeniz faydalı olacaktır."
            
            elif "yapay zeka" in cat_lower or "makine" in cat_lower or "ai" in cat_lower:
                questions = [
                    {
                        "id": 1,
                        "question": "Python'da veri analizi için en yaygın kullanılan kütüphane aşağıdakilerden hangisidir?",
                        "options": ["Django", "Flask", "Pandas", "Requests"],
                        "correct": 2
                    },
                    {
                        "id": 2,
                        "question": "Makine öğrenmesinde 'Overfitting' (Aşırı Öğrenme) ne anlama gelir?",
                        "options": ["Modelin eğitim verisini ezberleyip yeni verilerde başarısız olması", "Modelin çok hızlı eğitilmesi", "Modelin yetersiz veri ile eğitilmesi", "Modelin çok az parametreye sahip olması"],
                        "correct": 0
                    },
                    {
                        "id": 3,
                        "question": "Aşağıdakilerden hangisi bir sınıflandırma (classification) algoritmasıdır?",
                        "options": ["K-Means", "Doğrusal Regresyon", "PCA", "Lojistik Regresyon"],
                        "correct": 3
                    }
                ]
                roadmap_msg = f"{course_title} eğitimine başlamadan önce temel Python programlama ve istatistik kavramlarını tekrar etmeniz önerilir."
                
            elif "oyun" in cat_lower or "unity" in cat_lower:
                questions = [
                    {
                        "id": 1,
                        "question": "3D oyun motorlarında nesnelerin uzaydaki pozisyonunu, dönüşünü ve boyutunu tutan bileşen (component) nedir?",
                        "options": ["Rigidbody", "Collider", "Transform", "Mesh Renderer"],
                        "correct": 2
                    },
                    {
                        "id": 2,
                        "question": "Aşağıdakilerden hangisi oyun geliştirmede sıklıkla kullanılan bir programlama dilidir?",
                        "options": ["HTML", "C#", "SQL", "PHP"],
                        "correct": 1
                    },
                    {
                        "id": 3,
                        "question": "Oyun motorlarında fiziksel çarpışmaları algılamak için hangi bileşen kullanılır?",
                        "options": ["Camera", "Light", "Collider", "Material"],
                        "correct": 2
                    }
                ]
                roadmap_msg = f"Oyun geliştirme süreçlerine dalmadan önce temel C# programlama yapısını ve vektör matematiğini kavramanız hızınızı artıracaktır."
            
            elif "mobil" in cat_lower or "flutter" in cat_lower:
                questions = [
                    {
                        "id": 1,
                        "question": "Mobil uygulama geliştirmede 'State' kavramı neyi ifade eder?",
                        "options": ["Uygulamanın veritabanını", "Arayüzün o anki durumunu ve verilerini", "Sunucu bağlantısını", "Telefonun batarya durumunu"],
                        "correct": 1
                    },
                    {
                        "id": 2,
                        "question": "Aşağıdakilerden hangisi nesne yönelimli programlamanın (OOP) temel prensiplerinden biri değildir?",
                        "options": ["Kalıtım (Inheritance)", "Çok biçimlilik (Polymorphism)", "Kapsülleme (Encapsulation)", "Senkronizasyon (Synchronization)"],
                        "correct": 3
                    },
                    {
                        "id": 3,
                        "question": "Cross-platform (çapraz platform) mobil geliştirme ne anlama gelir?",
                        "options": ["Sadece iOS için uygulama geliştirmek", "Tek bir kod tabanı ile hem iOS hem Android uygulaması üretebilmek", "Uygulamayı sunucu olmadan çalıştırmak", "Sadece tabletler için uygulama yapmak"],
                        "correct": 1
                    }
                ]
                roadmap_msg = "Mobil uygulamalar geliştirmeye başlamadan önce Nesne Yönelimli Programlama (OOP) mantığına aşina olmalısınız."
                
            else: # Genel Yazılım / Diğer
                questions = [
                    {
                        "id": 1,
                        "question": "Bir programlama dilinde kod bloklarını tekrarlı olarak çalıştırmak için hangi yapı kullanılır?",
                        "options": ["If-Else koşulu", "Döngüler (Loops)", "Değişkenler (Variables)", "Diziler (Arrays)"],
                        "correct": 1
                    },
                    {
                        "id": 2,
                        "question": "Aşağıdakilerden hangisi bir versiyon kontrol sistemidir?",
                        "options": ["Git", "Docker", "Node.js", "MySQL"],
                        "correct": 0
                    },
                    {
                        "id": 3,
                        "question": "Bir fonksiyonun kendi kendini çağırmasına (tekrar etmesine) ne ad verilir?",
                        "options": ["Iteration", "Recursion", "Overloading", "Inheritance"],
                        "correct": 1
                    }
                ]
                roadmap_msg = f"{course_title} eğitimini almadan önce programlamaya giriş mantığını ve temel veri yapılarını bilmeniz gerekmektedir."

            return {
                "questions": questions,
                "prerequisite_roadmap": roadmap_msg
            }
            
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sadece JSON çıktısı üret.")
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"AI Diagnostic Q Error: {e}")
        return {
            "questions": [
                {
                    "id": 1,
                    "question": f"{course_title} önkoşulu nedir?",
                    "options": ["A", "B", "C", "D"],
                    "correct": 0
                }
            ],
            "prerequisite_roadmap": "API Hatası, varsayılan uyarı."
        }

async def generate_global_counseling_report(user_id: str, db: Session) -> dict:
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user_id).all()
    
    if not enrollments:
        return {
            "has_data": False,
            "message": "Henüz hiçbir kursa kayıtlı değilsiniz. Analiz için eğitimlere başlamanız gerekmektedir."
        }

    course_details = []
    total_videos = 0
    total_completed = 0
    all_tags = []

    for enr in enrollments:
        c = enr.course
        if not c: continue
        
        comp = enr.completed_videos or []
        total_completed += len(comp)
        
        c_vids = 0
        for sec in c.sections:
            c_vids += len(sec.videos)
        total_videos += c_vids
        
        if c.tags:
            all_tags.extend(c.tags)
            
        course_details.append(f"{c.title} (İlerleme: {len(comp)}/{c_vids})")

    overall_completion = int((total_completed / total_videos) * 100) if total_videos > 0 else 0
    unique_tags = list(set(all_tags))
    
    prompt = f"""
    Sen uzman bir AI Eğitim Danışmanısın. Öğrencinin kayıtlı olduğu kursları ve tamamlanma oranlarını inceleyerek, Frontend tarafında görselleştirilecek bir JSON Raporu oluşturmalısın.
    
    Öğrencinin Kursları: {', '.join(course_details)}
    Genel Tamamlanma Oranı: %{overall_completion}
    Öğrencinin İlgilendiği Konular (Etiketler): {', '.join(unique_tags)}
    
    Lütfen SADECE aşağıdaki yapıda, ekstra açıklama olmadan geçerli bir JSON döndür:
    {{
      "has_data": true,
      "stats": {{
        "coding_fluency": 88,
        "completion_rate": {overall_completion}
      }},
      "skills": [
        {{ "name": "Algoritmalar", "initial": 30, "current": 80, "color": "#1A56DB" }},
        {{ "name": "Konu 2", "initial": 20, "current": 60, "color": "#10B981" }}
      ],
      "competencies": [
        {{ "label": "Temel Python", "detail": "Değişkenler ve döngüler anlaşıldı.", "done": true }},
        {{ "label": "API Tasarımı", "detail": "Geliştirilmesi gerekiyor.", "done": false }}
      ],
      "recommendations": [
        {{ "tag": "AI", "color": "text-primary bg-primary/10 border-primary/20", "title": "İleri Yapay Zeka", "desc": "Bu kursu almanı öneririm.", "icon": "psychology" }}
      ],
      "detailed_narrative": "Buraya öğrencinin gidişatını, güçlü yanlarını ve motivasyonunu anlatan, cesaretlendirici, 3-4 paragraflık, **bold** kelimeler içeren Markdown formatında Türkçe bir açıklama yaz."
    }}
    
    Kurallar:
    1. 'skills' kısmında EN AZ 3, en fazla 6 adet yetkinlik/konu olsun. İlk (initial) seviye ile mevcut (current) seviye arasında mantıklı bir gelişim yaz. Renkler hex formatında olsun (Örn: #F59E0B).
    2. 'competencies' kısmında öğrencinin kurslarına göre 4-5 adet hedef belirle.
    3. 'recommendations' kısmında öğrenciye uygun 3 adet yeni eğitim önerisi yaz.
    4. 'detailed_narrative' kısmı öğrencinin anlayacağı samimi bir dilde olmalı.
    5. SADECE JSON ver.
    """
    
    try:
        if not settings.GEMINI_API_KEY:
            return {
                "has_data": True,
                "stats": {
                    "coding_fluency": 75,
                    "completion_rate": overall_completion
                },
                "skills": [
                    { "name": unique_tags[0] if len(unique_tags) > 0 else "Veri Bilimi", "initial": 20, "current": 70, "color": "#1A56DB" },
                    { "name": unique_tags[1] if len(unique_tags) > 1 else "Python", "initial": 40, "current": 85, "color": "#10B981" },
                    { "name": "Problem Çözme", "initial": 30, "current": 75, "color": "#F59E0B" }
                ],
                "competencies": [
                    { "label": "Temel Eğitimi Tamamlama", "detail": "Başlangıç seviyesi konuları bitirildi.", "done": True },
                    { "label": "İleri Seviye Proje", "detail": "Henüz pratik proje yapılmadı.", "done": False }
                ],
                "recommendations": [
                    { "tag": "Pratik", "color": "text-primary bg-primary/10 border-primary/20", "title": "Proje Odaklı Öğrenme", "desc": "Öğrendiklerinizi uygulamak için mini projeler yapın.", "icon": "build" }
                ],
                "detailed_narrative": "Öğrenme yolculuğunuzda şu ana kadar **harika bir ilerleme** kaydettiniz. Başlangıç seviyesindeki konuları kavramanız, ileriki aşamalarda çok işinize yarayacaktır. Gelecek adımlarda daha çok pratik yaparak becerilerinizi pekiştirebilirsiniz!"
            }
            
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sadece JSON çıktısı üret.")
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Global Report AI Error: {e}")
        return {
            "has_data": False,
            "message": "Rapor oluşturulurken bir hata meydana geldi."
        }

async def generate_field_diagnostic_questions(field: str) -> dict:
    import os
    import json
    
    file_path = os.path.join(os.path.dirname(__file__), 'questions.json')
    
    questions = []
    roadmap_msg = f"{field} alanındaki kariyerinize başlamadan önce bu kapsamlı sınav ile temel yetkinliklerinizi ölçüyoruz."
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        field_lower = field.lower()
        if "frontend" in field_lower or "web" in field_lower:
            questions = data.get("frontend", [])
        elif "siber" in field_lower or "cyber" in field_lower:
            questions = data.get("siber", [])
        elif "backend" in field_lower or "sunucu" in field_lower:
            questions = data.get("backend", [])
        else:
            questions = data.get("default", [])
            
    except Exception as e:
        print(f"Soru dosyası okuma hatası: {e}")
        questions = [
             {
                "id": 1,
                "question": f"{field} alanı ile ilgili temel kavram aşağıdakilerden hangisidir?",
                "options": ["A", "B", "C", "D"],
                "correct": 0,
                "category": "Genel",
                "difficulty": "Orta"
            }
        ]

    return {
        "questions": questions,
        "prerequisite_roadmap": roadmap_msg
    }

async def generate_global_roadmap(user_id: str, target_field: str, diagnostic_result: dict, all_courses: list, db: Session) -> dict:
    ordered_topics = []
    nodes = {}
    
    is_first = True
    
    relevant_courses = [c for c in all_courses if target_field.lower() in c.category.lower() or target_field.lower() in c.title.lower()]
    
    if not relevant_courses:
        relevant_courses = all_courses[:3]
        
    for course in relevant_courses:
        topic = course.title
        ordered_topics.append(topic)
        
        status = "active" if is_first else "locked"
        is_first = False
            
        nodes[topic] = {
            "status": status,
            "mastery_score": 0.0,
            "video_ids": [], 
            "remedial_video_ids": [],
            "reason": f"{target_field} alanı için önerilen kurs",
            "course_id": course.id,
            "thumbnail": course.thumbnail_url
        }
    
    roadmap_data = {
        "ordered_topics": ordered_topics,
        "nodes": nodes
    }
    
    roadmap = LearningRoadmap(
        user_id=user_id,
        course_id=None,
        target_field=target_field,
        roadmap_data=roadmap_data
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    return roadmap_data

async def generate_final_exam_questions(course_title: str, course_description: str) -> dict:
    prompt = f"""
    Sen uzman bir eğitimcisin. Aşağıda detayları verilen kursu başarıyla bitiren bir öğrencinin, 
    bu kurstaki konuları öğrenip öğrenmediğini ölçmek için 10 soruluk bir 'Bitirme Sınavı' (Final Exam) hazırlamalısın.
    
    Kurs Adı: {course_title}
    Kurs Açıklaması: {course_description}
    
    ÖNEMLİ: Sorular, öğrencinin kursu başarıyla tamamladığını ispatlaması için ortalamanın üzerinde (Orta-Zor seviye) olmalıdır. 
    Lütfen SADECE aşağıdaki formatta bir JSON objesi döndür. Ekstra açıklama yapma:
    {{
      "questions": [
        {{
          "id": 1,
          "question": "Soru metni...",
          "options": ["A", "B", "C", "D"],
          "correct": 0
        }}
      ]
    }}
    "correct" alanı 0 ile 3 arasında doğru şıkkın indeksini belirtmelidir. Tam 10 soru üret.
    """
    try:
        if not settings.GEMINI_API_KEY:
            questions = []
            for i in range(1, 11):
                questions.append({
                    "id": i,
                    "question": f"{course_title} ile ilgili Bitirme Sorusu {i}",
                    "options": ["Doğru Cevap", "Yanlış 1", "Yanlış 2", "Yanlış 3"],
                    "correct": 0
                })
            return {"questions": questions}

        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sadece JSON çıktısı üret.")
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"AI Final Exam Q Error: {e}")
        return {"questions": []}

async def generate_forum_reply(title: str, content: str, course_title: str) -> str:
    prompt = f"""
    Sen EduVise platformunda bir 'Yapay Zeka Öğrenme Asistanı'sın.
    Şu anda '{course_title}' adlı kursun Topluluk Forumundayız.
    Öğrencinin sorduğu soruya bu bağlamda en iyi cevabı ver.
    Cevabın kibar, eğitici ve doğrudan konuya yönelik olmalı. Gerekirse kod veya örneklerle açıkla.
    
    Öğrencinin Başlığı: {title}
    Öğrencinin Sorusu: {content}
    """
    try:
        if not settings.GEMINI_API_KEY:
            return f"Merhaba! {course_title} kursundaki bu konuya şöyle yardımcı olabilirim... (Mock AI Yanıtı)"
            
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sen yardımsever ve teşvik edici bir eğitim asistanısın.")
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"Forum AI Error: {e}")
        return "Şu anda yanıt veremiyorum. Eğitmenler en kısa sürede dönüş yapacaktır."

async def generate_instructor_insights(stats_data: dict) -> str:
    prompt = f"""
    Sen EduVise platformunda uzman bir Eğitim Danışmanı ve Veri Analisti AI'sın.
    Bir eğitmen, kurslarının performansını artırmak için senden analiz ve tavsiyeler istiyor.
    Aşağıda eğitmenin kurslarına ait özet veriler (öğrenci sayıları, puanlar, gelirler, vs.) bulunmaktadır:
    
    Veri: {json.dumps(stats_data, ensure_ascii=False)}
    
    Lütfen eğitmene hitaben, samimi ve profesyonel bir dille (Türkçe) Markdown formatında bir rapor hazırla.
    Raporun içinde şunlar yer almalı:
    1. Öne Çıkan Başarılar (Eğitmenin neyi iyi yaptığı)
    2. Gelişim Alanları (Hangi kurslarda düşüş var veya neresi iyileştirilebilir)
    3. Stratejik Tavsiyeler (Geliri veya öğrenci memnuniyetini artırmak için spesifik ve uygulanabilir öneriler)
    """
    try:
        if not settings.GEMINI_API_KEY:
            return "### AI Asistanınız Diyor ki\n\n(Mock Veri) Kurslarınız harika gidiyor! Gelirinizi artırmak için daha fazla kurs eklemeyi düşünebilirsiniz."
            
        model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="Sen profesyonel bir veri analisti ve eğitim danışmanısın. Raporlarını Markdown formatında yaz.")
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"Instructor Insights AI Error: {e}")
        return "Şu anda veri analizi yapılamıyor. Lütfen daha sonra tekrar deneyin."
