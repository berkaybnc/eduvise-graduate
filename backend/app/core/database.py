from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# --- PostgreSQL Engine (Users, Purchases, Enrollments, Reviews) ---
postgres_engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
PostgresSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=postgres_engine)
PostgresBase = declarative_base()

# --- SQLite Engine (Courses, Questions, AI Knowledge Graph) ---
sqlite_engine = create_engine(
    settings.SQLITE_URL, connect_args={"check_same_thread": False}
)
SqliteSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sqlite_engine)
SqliteBase = declarative_base()

def get_postgres_db():
    db = PostgresSessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_sqlite_db():
    db = SqliteSessionLocal()
    try:
        yield db
    finally:
        db.close()
