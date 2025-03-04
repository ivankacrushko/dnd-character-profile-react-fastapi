from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#DATABASE_URL = 'postgresql://myuser:mypassword@dnd-character-profile-react-fastapi-db-1:5432/dnd-character-view'
DATABASE_URL = 'postgresql://postgres:latitude410@localhost:5432/dnd-character-view'

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()