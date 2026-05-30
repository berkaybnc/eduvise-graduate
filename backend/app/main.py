from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.config import settings
from app.api.auth import router as auth_router
from app.api.courses import router as courses_router
from app.api.assessments import router as assessments_router
from app.api.roadmap import router as roadmap_router
from app.api.ai import router as ai_router
from app.api.instructor import router as instructor_router

app = FastAPI(title="EduVise API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(courses_router, prefix="/courses", tags=["courses"])
app.include_router(assessments_router, prefix="/assessments", tags=["assessments"])
app.include_router(roadmap_router, prefix="/roadmap", tags=["roadmap"])
app.include_router(ai_router, prefix="/ai", tags=["ai"])
app.include_router(instructor_router, prefix="/instructor", tags=["instructor"])
