import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Integer, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String, index=True)
    instructor_id = Column(String, nullable=False) # Auth Service'den gelen ID
    created_at = Column(DateTime, default=datetime.utcnow)
    
    modules = relationship("Module", back_populates="course")

class Module(Base):
    __tablename__ = "modules"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    order = Column(Integer, default=0)
    
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    module_id = Column(String, ForeignKey("modules.id"))
    title = Column(String, nullable=False)
    video_url = Column(String)
    knowledge_node_id = Column(String, ForeignKey("knowledge_nodes.id")) # Bu ders hangi konuyu öğretiyor?
    
    module = relationship("Module", back_populates="lessons")
    knowledge_node = relationship("KnowledgeNode")

# --- KNOWLEDGE GRAPH SİSTEMİ (Madde 12) ---
class KnowledgeNode(Base):
    __tablename__ = "knowledge_nodes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    topic_name = Column(String, unique=True, nullable=False) # Örn: "Loops", "Variables"
    difficulty_level = Column(Integer, default=1) # 1: Beginner, 5: Expert

class Prerequisite(Base):
    __tablename__ = "prerequisites"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    node_id = Column(String, ForeignKey("knowledge_nodes.id")) # Hangi konu?
    required_node_id = Column(String, ForeignKey("knowledge_nodes.id")) # Hangi konuyu bilmek zorunda?

# --- KNOWLEDGE STATE VECTOR (Madde 14.1) ---
class UserKnowledge(Base):
    __tablename__ = "user_knowledge"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, index=True) # Auth Service'den gelen ID
    knowledge_node_id = Column(String, ForeignKey("knowledge_nodes.id"))
    mastery_score = Column(Float, default=0.0) # 0.0 - 100.0 arası hakimiyet seviyesi
    last_assessed = Column(DateTime, default=datetime.utcnow)

class DiagnosticQuestion(Base):
    __tablename__ = "diagnostic_questions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    knowledge_node_id = Column(String, ForeignKey("knowledge_nodes.id"))
    question_text = Column(String, nullable=False)
    options = Column(JSON, nullable=False) # ["A", "B", "C", "D"]
    correct_option_index = Column(Integer, nullable=False)
