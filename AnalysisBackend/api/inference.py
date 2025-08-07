from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
from datetime import date
import os
from fastapi import APIRouter
import models.serve
import models.blood_predict
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
# @router.on_event("startup")
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
    try:
        return await db_service.get_feedback_stats()
    except Exception as e:
        logger.error(f"Error fetching feedback stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/sentiment-distribution", response_model=List[SentimentDistribution])
async def get_sentiment_distribution():
    try:
        return await db_service.get_sentiment_distribution()
    except Exception as e:
        logger.error(f"Error fetching sentiment distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/recent-feedbacks", response_model=List[RecentFeedback])
async def get_recent_feedbacks(limit: int = 10):
    try:
        return await db_service.get_recent_feedbacks(limit)
    except Exception as e:
        logger.error(f"Error fetching recent feedback: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@router.get("/theme-occurrences", response_model=List[ThemeOccurrences])
async def get_theme_occurrences():
    try:
        return await db_service.get_theme_occurrences()
    except Exception as e:
        logger.error(f"Error fetching theme occurences: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/forecast", response_model=List[ThemeOccurrences])
async def get_theme_occurrences():
    try:
        return await db_service.get_theme_occurrences()
    except Exception as e:
        logger.error(f"Error fetching forecast: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/blood-forecast/")
async def get_forecast(
    days: int = Query(7, gt=0, le=365, description="Number of days to forecast (1-365)"),
    blood_type: Optional[str] = Query(None, regex="^(A|B|AB|O)[+-]$", description="Filter by blood type (e.g. 'A+')")
):    
    if not 1 <= days <= 30:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 30")
    
    try:
        model = models.blood_predict.load_saved_models()
        
        raw_forecasts = models.blood_predict.generate_forecasts(model, forecast_days=days)
        
        # 3. Format results
        forecasts = models.blood_predict.return_forecasts(raw_forecasts)
        
        # 4. Filter by blood type if specified
        if blood_type:
            blood_type = blood_type.upper()
            if blood_type not in forecasts:
                raise HTTPException(status_code=404, detail="Blood type not found")
            return {blood_type: forecasts[blood_type]}
            
        return forecasts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))