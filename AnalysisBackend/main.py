from fastapi import FastAPI
from api.inference import router as inference_router
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from models.serve import DatabaseService
from api.inference import router as inference_router
import models.serve

# from scheduler.task import app as celery_app


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

@app.get("/")
def home():
    return {"status": "Backend Server Running"}

# @app.on_event("startup")
# async def startup():
#     # Initialize Celery
#     celery_app.conf.update(task_track_started=True) 

db_config = {
    "user": os.getenv("DB_USER", "postgres.ihnkhvimonixivwphgnt"),
    "password": os.getenv("DB_PASSWORD", "VaIC1Hgvm2kCxZYY"), 
    "database": os.getenv("DB_NAME", "postgres"),
    "host": os.getenv("DB_HOST", "aws-0-eu-north-1.pooler.supabase.com"), 
}
db_service = models.serve.DatabaseService(db_config)

@app.on_event("startup")
async def startup():
    try:
        await db_service.connect()
    except Exception as e:
        raise
    
