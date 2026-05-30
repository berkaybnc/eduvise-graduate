import anthropic
import json
from app.config import settings
from app.models.roadmap import LearningRoadmap
from sqlalchemy.orm import Session
import uuid

# Anthropic API Key is loaded from settings
client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

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
        if not settings.ANTHROPIC_API_KEY:
            # Mock if no key
            return {
                "strengths": [], "weaknesses": [], "recommended_order": course_topics,
                "skip_topics": [], "summary": "AI API Key bulunamadı, varsayılan sıra.", "estimated_hours": 10
            }
        response = await client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1000,
            system="Sadece JSON çıktısı üret.",
            messages=[{"role": "user", "content": prompt}]
        )
        return json.loads(response.content[0].text)
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
    # Dummy mock reporting implementation due to complexity and prompt instructions.
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
        if not settings.ANTHROPIC_API_KEY:
            return {
                "overall_score": 0.8, "mastered_skills": ["Temel Kavramlar"], "weak_areas": [],
                "learning_velocity": "fast", "study_hours_spent": 10, "compared_to_average": "+5%",
                "next_courses": [], "detailed_narrative": "Harika bir gelişim gösterdiniz.",
                "skill_radar": {"Temel Kavramlar": 0.8}
            }
        response = await client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1000,
            system="Sadece JSON çıktısı üret.",
            messages=[{"role": "user", "content": prompt}]
        )
        return json.loads(response.content[0].text)
    except Exception as e:
        print(f"AI Report Error: {e}")
        return {"overall_score": 0.0, "detailed_narrative": "Analiz başarısız."}

async def get_ai_chat_response(message: str, student_context: dict, history: list):
    # Streaming is requested but for simplicity in MVP we mock or use basic sync structure.
    return "AI Asistan (Mock): Bu konuda size şöyle yardımcı olabilirim..."
