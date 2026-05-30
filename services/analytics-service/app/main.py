from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
import json

from app.database import engine, Base, get_db
import app.models as models
import app.schemas as schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduVise Analytics & Real-Time Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "analytics-service"}

# --- WEBSOCKET REAL-TIME SİSTEMİ (Madde 28) ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Örnek: "İlerlemeniz güncellendi, AI Raporunuz hazırlandı!"
            await manager.broadcast(f"Real-Time Update: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- TEACHER ANALYTICS & REVENUE (Madde 25 & 26.1) ---
@app.get("/analytics/teacher/{instructor_id}/revenue", response_model=schemas.RevenueReport)
def get_teacher_revenue(instructor_id: str, db: Session = Depends(get_db)):
    """
    Öğretmenin gelir raporunu hesaplar.
    monthly_revenue = (course_sales * teacher_percentage) - platform_commission
    Varsayım: Eğitmen payı %80, Platform komisyonu %20
    """
    total_sales = db.query(models.Transaction).filter(
        models.Transaction.instructor_id == instructor_id
    ).count()

    gross_revenue = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.instructor_id == instructor_id
    ).scalar() or 0.0

    net_revenue = gross_revenue * 0.80 # %20 kesinti

    return schemas.RevenueReport(
        instructor_id=instructor_id,
        total_sales=total_sales,
        gross_revenue=gross_revenue,
        net_revenue=net_revenue
    )

@app.post("/analytics/log-activity")
def log_student_activity(log_data: schemas.ActivityLogCreate, db: Session = Depends(get_db)):
    """Öğrencinin izleme süresi ve quiz skorlarını loglar (Madde 20)"""
    new_log = models.ActivityLog(**log_data.model_dump())
    db.add(new_log)
    db.commit()
    return {"msg": "Aktivite başarıyla loglandı."}
