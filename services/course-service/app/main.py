from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.database import engine, Base, get_db
import app.models as models
import app.schemas as schemas

# PostgreSQL tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduVise Course & Knowledge Graph Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "course-service"}

# --- KNOWLEDGE GRAPH API (Madde 12) ---
@app.post("/knowledge-nodes", response_model=schemas.KnowledgeNodeRead)
def create_knowledge_node(node: schemas.KnowledgeNodeCreate, db: Session = Depends(get_db)):
    db_node = models.KnowledgeNode(**node.model_dump())
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

@app.post("/prerequisites")
def add_prerequisite(req: schemas.PrerequisiteCreate, db: Session = Depends(get_db)):
    db_req = models.Prerequisite(**req.model_dump())
    db.add(db_req)
    db.commit()
    return {"msg": "Önkoşul başarıyla eklendi (Knowledge Graph güncellendi)."}

# --- DIAGNOSTIC ASSESSMENT API (Madde 14) ---
@app.get("/diagnostic/{knowledge_node_id}")
def get_diagnostic_questions(knowledge_node_id: str, db: Session = Depends(get_db)):
    questions = db.query(models.DiagnosticQuestion).filter(
        models.DiagnosticQuestion.knowledge_node_id == knowledge_node_id
    ).all()
    return questions

@app.post("/diagnostic/submit")
def submit_diagnostic(student_id: str, knowledge_node_id: str, score: float, db: Session = Depends(get_db)):
    """
    Öğrencinin sınava girdiği ve Knowledge State Vector'ünün (mastery_score) güncellendiği uç (Endpoint).
    """
    knowledge = db.query(models.UserKnowledge).filter(
        models.UserKnowledge.student_id == student_id,
        models.UserKnowledge.knowledge_node_id == knowledge_node_id
    ).first()

    if knowledge:
        knowledge.mastery_score = score
    else:
        knowledge = models.UserKnowledge(
            student_id=student_id,
            knowledge_node_id=knowledge_node_id,
            mastery_score=score
        )
        db.add(knowledge)
    db.commit()
    return {"msg": f"Knowledge State Vector güncellendi. Yeni Hakimiyet (Mastery): {score}%"}

# --- ROADMAP ENGINE LOGIC (Madde 17) ---
@app.get("/roadmap/check-access/{student_id}/{knowledge_node_id}")
def check_module_access(student_id: str, knowledge_node_id: str, db: Session = Depends(get_db)):
    """
    Öğrencinin bir derse/modüle girip giremeyeceğini denetleyen (Prerequisite Block) uç.
    """
    prereqs = db.query(models.Prerequisite).filter(models.Prerequisite.node_id == knowledge_node_id).all()
    
    blocked_by = []
    for p in prereqs:
        student_knowledge = db.query(models.UserKnowledge).filter(
            models.UserKnowledge.student_id == student_id,
            models.UserKnowledge.knowledge_node_id == p.required_node_id
        ).first()
        
        # Eğer önkoşul konusunda kaydı yoksa veya skoru %60'ın altındaysa blokla (Knowledge Gap Detection - Madde 15)
        if not student_knowledge or student_knowledge.mastery_score < 60.0:
            required_node = db.query(models.KnowledgeNode).filter(models.KnowledgeNode.id == p.required_node_id).first()
            blocked_by.append(required_node.topic_name)
            
    if blocked_by:
        return {
            "access_granted": False, 
            "reason": "PREREQUISITE_NOT_COMPLETED", 
            "missing_topics": blocked_by,
            "msg": "AI Engine: Eksik temelleriniz var. İleri seviyeye geçmeden önce bu konuları tamamlamalısınız."
        }
        
    return {"access_granted": True, "msg": "Erişim başarılı. Öğrenmeye devam edebilirsiniz."}
