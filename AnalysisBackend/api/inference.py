from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
from datetime import date
import os
from fastapi import APIRouter

router = APIRouter()

# Database connection
async def get_db_connection():
    return await asyncpg.connect(
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
        database=os.getenv("DB_NAME", "feedback_db"),
        host=os.getenv("DB_HOST", "localhost")
    )

# models
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

# Feedback statistics
@app.get("/feedback-stats", response_model=FeedbackStats)
async def get_feedback_stats():
    try:
        conn = await get_db_connection()
        total = await conn.fetchval("SELECT COUNT(*) FROM f_analysis_feedback")        
        avg_score = await conn.fetchval("SELECT AVG(sentiment_score) FROM f_analysis_feedback")
        
        total_with_recall = await conn.fetchval(
            "SELECT COUNT(*) FROM f_analysis_feedback WHERE recall_id IS NOT NULL"
        )
        response_rate = (total_with_recall / total) * 100 if total > 0 else 0
        
        return {
            "total_feedbacks": total,
            "average_rating": round(avg_score, 2) if avg_score else 0,
            "response_rate": round(response_rate, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# Sentiment distribution
@app.get("/sentiment-distribution", response_model=List[SentimentDistribution])
async def get_sentiment_distribution():
    try:
        conn = await get_db_connection()
        total = await conn.fetchval("SELECT COUNT(*) FROM f_analysis_feedback")        
        query = """
            SELECT s.sentiment, COUNT(f.sentiment_id) as count
            FROM d_sentiment s
            LEFT JOIN f_analysis_feedback f ON s.sentiment_id = f.sentiment_id
            GROUP BY s.sentiment
            ORDER BY count DESC
        """
        results = await conn.fetch(query)
        
        return [
            {
                "sentiment": r["sentiment"],
                "count": r["count"],
                "percentage": round((r["count"] / total) * 100, 2) if total > 0 else 0
            }
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# Recent feedbacks
@app.get("/recent-feedbacks", response_model=List[RecentFeedback])
async def get_recent_feedbacks(limit: int = 10):
    try:
        conn = await get_db_connection()
        
        query = """
            SELECT 
                f.fact_id as feedback_id,
                p.first_name || ' ' || p.last_name as patient_name,
                d.full_name as doctor_name,
                s.sentiment,
                f.sentiment_score as score,
                t.date_id as feedback_date,
                th.label as theme
            FROM f_analysis_feedback f
            JOIN d_patient p ON f.patient_id = p.patient_id
            JOIN d_doctor d ON f.doctor_id = d.doctor_id
            JOIN d_sentiment s ON f.sentiment_id = s.sentiment_id
            JOIN d_time t ON f.date_id = t.date_id
            JOIN d_theme th ON f.theme_id = th.theme_id
            ORDER BY t.date_id DESC
            LIMIT $1
        """
        results = await conn.fetch(query, limit)
        
        return [
            {
                "feedback_id": r["feedback_id"],
                "patient_name": r["patient_name"],
                "doctor_name": r["doctor_name"],
                "sentiment": r["sentiment"],
                "score": r["score"],
                "feedback_date": r["feedback_date"],
                "theme": r["theme"]
            }
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

#Theme occurrences
@app.get("/theme-occurrences", response_model=List[ThemeOccurrences])
async def get_theme_occurrences():
    try:
        conn = await get_db_connection()
        
        query = """
            SELECT t.label as theme, COUNT(f.theme_id) as count
            FROM d_theme t
            LEFT JOIN f_analysis_feedback f ON t.theme_id = f.theme_id
            GROUP BY t.label
            ORDER BY count DESC
        """
        results = await conn.fetch(query)
        
        return [
            {
                "theme": r["theme"],
                "count": r["count"]
            }
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()
