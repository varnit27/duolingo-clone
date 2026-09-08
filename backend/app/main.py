from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.routers import path, lessons, users

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your deployed frontend URL before submitting
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(path.router)
app.include_router(lessons.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "duolingo-clone-api"}
