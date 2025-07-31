from  scheduler.celery_app import app
from scheduler.database_service import DBSynchronizer
import asyncio

# Database configurations
SOURCE_DB = {
    "user": "postgres.ypcufzbpbqywbmwskqew",
    "password": "zqNj2KxAgrrMwyUU",
    "database": "postgres",
    "host": "aws-0-eu-north-1.pooler.supabase.com"
}

TARGET_DB = {
    "user": "postgres.ihnkhvimonixivwphgnt",
    "password": "VaIC1Hgvm2kCxZYY",
    "database": "postgres",
    "host": "aws-0-eu-north-1.pooler.supabase.com"
}

@app.task(bind=True)
def periodic_sync(self):
    """Main scheduled sync task"""
    sync = DBSynchronizer()
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(_run_sync(sync))

async def _run_sync(sync: DBSynchronizer):
    """Async sync procedure"""
    source_conn = await sync.connect(SOURCE_DB)
    target_conn = await sync.connect(TARGET_DB)
    
    try:
        # Get new feedbacks since last sync
        feedbacks = await source_conn.fetch(
            "SELECT * FROM feedback WHERE submitted_at > $1",
            sync.last_sync
        )
        
        # Process each feedback
        for fb in feedbacks:
            await sync.sync_single_feedback(fb, source_conn, target_conn)
        
        # Update last sync time if successful
        if feedbacks:
            sync.last_sync = max(fb['submitted_at'] for fb in feedbacks)
            return f"Synced {len(feedbacks)} records"
        return "No new feedbacks"
    
    finally:
        await source_conn.close()
        await target_conn.close()