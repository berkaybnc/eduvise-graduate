from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.notification import Notification
from app.core.notifications import manager
from app.core.security import decode_token
from app.core.dependencies import get_current_user
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    is_read: bool
    type: str
    created_at: datetime

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).limit(50).all()
    return notifications

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Bildirim bulunamadı")
    notification.is_read = True
    db.commit()
    return {"message": "Okundu"}

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str):
    # Verify token
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            await websocket.close(code=1008)
            return
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive, listen for pings/messages from client
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
