import os
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio

from BloodAnalysisBackend.model.database_service import DBSynchronizer

router = APIRouter()
db_sync = DBSynchronizer()

# Database configuration
db_config = {
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "JaAk"), 
    "database": os.getenv("DB_NAME", "postgres"),
    "host": os.getenv("DB_HOST", "localhost"), 
}

class Donor(BaseModel):
    full_name: str
    gender: str
    date_of_birth: str
    blood_type: str
    contact_number: str
    email: str
    occupation: str
    adresse: str
    registration_date: str
    last_donation_date: str
    medical_notes: Optional[str] = None
    
@router.on_event("startup")
async def startup_event():
    await db_sync.connect(db_config)

@router.on_event("shutdown")
async def shutdown_event():
    await db_sync.close()

@router.post("/api/donors", response_model=dict)
async def create_donor(donor: Donor):
    try:
        donor_id = await db_sync.insert_donor(donor.dict())
        return {"message": "Donor created successfully", "donor_id": donor_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
