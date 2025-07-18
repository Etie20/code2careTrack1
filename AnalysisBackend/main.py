from fastapi import FastAPI
from app.api.inference import router as inference_router

app = FastAPI()
app.include_router(inference_router, prefix="/api/v1")


@app.get("/")
def home():
    return {"status": "Backend Server Running"}