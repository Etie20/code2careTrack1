from fastapi import FastAPI
from app.api.inference import router as inference_router
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from AnalysisBackend.models.serve import DatabaseService
from AnalysisBackend.api.inference import router as inference_router

app = FastAPI()
# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(inference_router, prefix="/api/v1")

db_config = {
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres"),
    "database": os.getenv("DB_NAME", "feedback_db"),
    "host": os.getenv("DB_HOST", "localhost")
}

@app.get("/")
def home():
    return {"status": "Backend Server Running"}