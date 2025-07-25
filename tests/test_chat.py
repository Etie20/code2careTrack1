import os

from dotenv import load_dotenv
from fastapi.testclient import TestClient
from chat_backend.main import app

client = TestClient(app)

load_dotenv()
API_KEY = os.getenv("API_KEY", "secret")

def test_chat_flow():
    res = client.post("/chat", json={"user_id": "u1", "message": "hello"}, headers={"X-API-Key": API_KEY})
    assert res.status_code == 200
    data = res.json()
    # The response should be a non-empty string.  We no longer prefix
    # messages with "Mistral:" now that we call the real inference API.
    assert isinstance(data["response"], str)
    assert data["response"].strip() != ""

    res = client.get("/history/u1", headers={"X-API-Key": API_KEY})
    assert res.status_code == 200
    history = res.json()["history"]
    assert len(history) >= 2

    res = client.delete("/history/u1", headers={"X-API-Key": API_KEY})
    assert res.status_code == 200
