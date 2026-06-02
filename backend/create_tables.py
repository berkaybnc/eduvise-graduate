from app.database import Base, engine
from app.models.user import User
from app.models.course import Course, Certificate
from app.models.roadmap import LearningRoadmap

Base.metadata.create_all(bind=engine)
print("Tables created successfully.")
