import os
from fastapi.testclient import TestClient
from chat_backend.main import app

client = TestClient(app)

API_KEY = os.getenv("API_KEY", "secret")

def test_chat_flow():
    res = client.post("/chat", json={"user_id": "u1", "message": "hello"}, headers={"X-API-Key": API_KEY})
    assert res.status_code == 200
    data = res.json()
    assert data["response"].startswith("Mistral:")
    assert "hello" in data["history"][0]

    res = client.get("/history/u1", headers={"X-API-Key": API_KEY})
    assert res.status_code == 200
    history = res.json()["history"]
    assert len(history) >= 2

    res = client.delete("/history/u1", headers={"X-API-Key": API_KEY})
    assert res.status_code == 200