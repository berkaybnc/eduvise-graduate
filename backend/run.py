import uvicorn
from app.main import app
from app.database import Base, engine
from app import models  # import models to bind metadata

Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
