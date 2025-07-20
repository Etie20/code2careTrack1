from fastapi import FastAPI
from api.inference import router as inference_router
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from models.serve import DatabaseService
from api.inference import router as inference_router

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