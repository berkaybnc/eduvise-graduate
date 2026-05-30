from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import SqliteBase

class Concept(SqliteBase):
    __tablename__ = "concepts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String)
    description = Column(String)

class ConceptPrerequisite(SqliteBase):
    __tablename__ = "concept_prerequisites"

    concept_id = Column(Integer, ForeignKey("concepts.id"), primary_key=True)
    prerequisite_id = Column(Integer, ForeignKey("concepts.id"), primary_key=True)

class CourseConcept(SqliteBase):
    __tablename__ = "course_concepts"

    course_id = Column(Integer, ForeignKey("courses.id"), primary_key=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"), primary_key=True)

class Question(SqliteBase):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"))
    question_text = Column(String)
    difficulty = Column(String) # 'easy', 'medium', 'hard'
    question_type = Column(String) # 'diagnostic', 'formative'

    options = relationship("Option", back_populates="question")

class Option(SqliteBase):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    option_text = Column(String)
    is_correct = Column(Integer, default=0) # boolean

    question = relationship("Question", back_populates="options")

class KnowledgeState(SqliteBase):
    __tablename__ = "knowledge_states"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    concept_id = Column(Integer, ForeignKey("concepts.id"))
    mastery_score = Column(Float, default=0.0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class LearningRoadmap(SqliteBase):
    __tablename__ = "learning_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    goal_topic = Column(String)
    roadmap_json = Column(String) # JSON string
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())
