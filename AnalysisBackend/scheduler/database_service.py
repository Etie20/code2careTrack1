import asyncpg
from datetime import datetime
from typing import List, Dict, Optional
from .sentiment_theme_analysis import analyze_feedback

class DBSynchronizer:
    def __init__(self):
        self.last_sync = datetime.min

    async def connect(self, config: dict):
        return await asyncpg.connect(**config)

    async def analyze_feedback_themes(self, text: str, language: str) -> List[int]:
        """YOUR CUSTOM THEME DETECTION LOGIC"""
        themes = []
        text = text.lower()
        themes = analyze_feedback(text, language)
        # if "wait" in text or "attente" in text:
        #     themes.append(1)  # temps d'attente
        # if "staff" in text or "personnel" in text:
        #     themes.append(2)  # attitude du personnel
        # if "clean" in text or "hygiène" in text:
        #     themes.append(3)  # hygiène
        return themes['themes'] or [9]  # default to consultation

    async def sync_single_feedback(self, feedback: Dict, source_conn, target_conn):
        """Process and sync a single feedback record"""
        try:
            # Get patient data
            patient = await source_conn.fetchrow(
                "SELECT * FROM patient WHERE id = $1", 
                feedback['patient_id']
            )
        
            # Insert/update dimensional patient
            patient_id = await target_conn.fetchval("""
                INSERT INTO d_patient (patient_id, full_name, language)
                VALUES ($1, $2, $3)
                ON CONFLICT (patient_id) DO UPDATE
                SET language = EXCLUDED.language
                RETURNING patient_id
            """,
            patient['id'],
            patient['full_name'], 
            patient['preferred_language'], 
            )
            
            # Rest of your sync logic...
            themes = await self.analyze_feedback_themes(feedback.get('feedback_text', ''), feedback.get('language', 'fr'))
            # await target_conn.execute("""              
            #         INSERT INTO d_time (
            #             date_id
            #         ) VALUES ($1)
            #     """, feedback['submitted_at'].date()
            #     )
            date_id = await target_conn.fetchval("""
                INSERT INTO d_time (
                        date_id
                    ) VALUES ($1)
                ON CONFLICT (date_id)  DO UPDATE
                SET quarter = 2
                RETURNING date_id
            """,
            feedback['submitted_at'].date() 
            )
            feedbacks = await target_conn.fetchrow(
                "SELECT * FROM f_analysis_feedback WHERE fact_id = $1", 
                feedback['id']
            )
            # print (feedbacks)
            if feedbacks is None :
                for theme_id in themes:
                    await target_conn.execute("""              
                        INSERT INTO f_analysis_feedback (
                            fact_id, date_id, patient_id, theme_id,
                            sentiment_id, sentiment_score, feedback_count
                        ) VALUES ($1, $2, $3, $4, $5, $6, 1)
                    """, 
                    feedback['id'],
                    date_id,
                    patient_id,
                    theme_id,
                    feedback.get('star_rating'),
                    self._map_sentiment(feedback.get('star_rating'))
                    )    

        except Exception as e:
            print(f"Error processing feedback {feedback.get('id')}: {str(e)}")
            raise

    def _map_sentiment(self, rating: Optional[int]) -> int:
        return {
            5: 100, 4: 80, 3: 60, 2: 40, 1: 20
        }.get(rating, 3)  # default to neutral