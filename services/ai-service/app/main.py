from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import app.schemas as schemas
from typing import List

app = FastAPI(title="EduVise AI Engine Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.post("/ai/generate-roadmap", response_model=schemas.RoadmapResponse)
def generate_roadmap(req: schemas.RoadmapRequest):
    """
    Madde 16: Personalized Roadmap Generation.
    Öğrencinin anlık bilgisini (Knowledge State Vector) alıp ona özel harita çizer.
    """
    # Gerçek AI modeli veya LLM entegrasyonu buraya gelecek.
    # Şimdilik Mock bir AI algoritması simüle ediyoruz.
    
    critical_gaps = [state for state in req.current_knowledge_state if state.mastery_score < 60.0]
    
    path = []
    # 1. Önce eksikleri (Knowledge Gaps) kapat (Madde 15)
    for gap in critical_gaps:
        path.append({
            "step": len(path) + 1,
            "topic": gap.topic_name,
            "action": "REVIEW_REQUIRED",
            "reason": f"Hakimiyet seviyesi çok düşük ({gap.mastery_score}%)"
        })
        
    # 2. Sonra hedeflere göre yeni rotalar öner
    for goal in req.career_goals:
        path.append({
            "step": len(path) + 1,
            "topic": f"Advanced {goal}",
            "action": "LEARN_NEW",
            "reason": "Kariyer hedeflerinize uygun sıradaki modül."
        })
        
    return schemas.RoadmapResponse(
        personalized_learning_path=path,
        recommended_categories=req.interests,
        estimated_duration_weeks=len(path) * 2
    )

@app.post("/ai/dynamic-path-adjustment", response_model=schemas.PathAdjustmentResponse)
def adjust_learning_path(result: schemas.QuizResult):
    """
    Madde 18: Dynamic Path Adjustment & Adaptive Decision Engine.
    Mini quiz (Formative Assessment) sonucu değerlendirilir.
    """
    if result.score < result.success_threshold:
        return schemas.PathAdjustmentResponse(
            action="redirect_to_prerequisite",
            recommendation_message="AI Analizi: Bu konuda eksikleriniz var. Bir sonraki modüle geçmek yerine, sistemi sizin için bir alt seviyedeki önkoşul videosuna yönlendiriyorum."
        )
    else:
        return schemas.PathAdjustmentResponse(
            action="unlock_next_module",
            recommendation_message="AI Analizi: Harika! Konuyu kavradınız, sıradaki zorlaştırılmış modülün kilidi açıldı."
        )
