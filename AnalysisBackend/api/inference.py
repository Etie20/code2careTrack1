from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
from datetime import date
import os
from fastapi import APIRouter
import models.serve

router = APIRouter()
db_config = {
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "password"), 
    "database": os.getenv("DB_NAME", "code2care_datamart"),
    "host": os.getenv("DB_HOST", "localhost"),
}
db_service = models.serve.DatabaseService(db_config)

# Pydantic models (response models)
class FeedbackStats(BaseModel):
    total_feedbacks: int
    average_rating: float
    response_rate: float

class SentimentDistribution(BaseModel):
    sentiment: str
    count: int
    percentage: float

class RecentFeedback(BaseModel):
    feedback_id: int
    patient_name: str
    doctor_name: str
    sentiment: str
    score: float
    feedback_date: date
    theme: str

class ThemeOccurrences(BaseModel):
    theme: str
    count: int

# Startup and shutdown events
@router.on_event("startup")
async def startup():
    await db_service.connect()

@router.on_event("shutdown")
async def shutdown():
    await db_service.close()

# API endpoints
@router.get("/feedback-stats", response_model=FeedbackStats)
async def get_feedback_stats():
    return await db_service.get_feedback_stats()

@router.get("/sentiment-distribution", response_model=List[SentimentDistribution])
async def get_sentiment_distribution():
    return await db_service.get_sentiment_distribution()

@router.get("/recent-feedbacks", response_model=List[RecentFeedback])
async def get_recent_feedbacks(limit: int = 10):
    return await db_service.get_recent_feedbacks(limit)

@router.get("/theme-occurrences", response_model=List[ThemeOccurrences])
async def get_theme_occurrences():
    return await db_service.get_theme_occurrences()