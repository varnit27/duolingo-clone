"""
Database engine + session setup.

SQLite file lives at backend/app.db by default. Override with the
DATABASE_URL env var if you want to point elsewhere.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# check_same_thread=False is needed because FastAPI can hit the
# connection from more than one thread with SQLite.
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session per-request and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
