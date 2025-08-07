import asyncpg
from typing import List, Dict, Any
from datetime import date
from fastapi import HTTPException


class DatabaseService:
    def __init__(self, db_config: dict):
        self.db_config = db_config
        self.pool = None

    async def connect(self):
        try:
            self.pool = await asyncpg.create_pool(
                **self.db_config,
                min_size=1,  # Minimum connections
                max_size=3,  # Maximum connections
                command_timeout=60,  # 30 seconds timeout
                server_settings={
                    'application_name': 'your_app_name'
                }
            )
        except asyncpg.PostgresError as e:
            print(f"PostgreSQL connection error: {e}")
            raise

    async def close(self):
        """Close the connection pool"""
        if self.pool:
            await self.pool.close()

    async def get_feedback_stats(self) -> Dict[str, Any]:
        """Get feedback statistics"""
        async with self.pool.acquire() as conn:
            try:    
                total = await conn.fetchval("SELECT COUNT(DISTINCT fact_id) FROM f_analysis_feedback")
                avg_score = await conn.fetchval("SELECT AVG(sentiment_id) FROM f_analysis_feedback")
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

    async def get_sentiment_distribution(self) -> List[Dict[str, Any]]:
        """Get sentiment distribution"""
        async with self.pool.acquire() as conn:
            try:
                total = await conn.fetchval("SELECT COUNT(DISTINCT fact_id) FROM f_analysis_feedback")
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

    async def get_recent_feedbacks(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent feedbacks"""
        async with self.pool.acquire() as conn:
            try:
                query = """
                    SELECT 
                        f.fact_id as feedback_id,
                        p.full_name as patient_name,
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

    async def get_theme_occurrences(self) -> List[Dict[str, Any]]:
        """Get theme occurrences"""
        async with self.pool.acquire() as conn:
            try:
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