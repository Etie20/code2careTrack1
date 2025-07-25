from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
from datetime import date
import os
from fastapi import APIRouter
import models.serve
from dotenv import load_dotenv
import logging 

logger = logging.getLogger(__name__)
load_dotenv()

router = APIRouter()
db_config = {
    "user": os.getenv("DB_USER", "postgres.ihnkhvimonixivwphgnt"),
    "password": os.getenv("DB_PASSWORD", "VaIC1Hgvm2kCxZYY"), 
    "database": os.getenv("DB_NAME", "postgres"),
    "host": os.getenv("DB_HOST", "aws-0-eu-north-1.pooler.supabase.com"), 
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
@router.on_event("startup")
async def startup():
    try:
        await db_service.connect()
        logger.info("Database connection established")
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise

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