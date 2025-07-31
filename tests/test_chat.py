import os
import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from chat_backend.main import app

pytest.skip("Skipping heavy integration tests", allow_module_level=True)

client = TestClient(app)

load_dotenv()
API_KEY = os.getenv("API_KEY", "secret")

def test_chat_flow():
    """Test basic chat functionality"""
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

def test_enhanced_chat_features():
    """Test enhanced chat features including literacy adaptation and multilingual support"""
    # Test French message
    res = client.post("/chat", json={
        "user_id": "u2", 
        "message": "J'ai mal à la tête", 
        "language": "fr",
        "literacy_level": "basic"
    }, headers={"X-API-Key": API_KEY})
    assert res.status_code == 200
    data = res.json()
    assert "response" in data
    assert "intent" in data
    assert "literacy_level" in data
    assert "language" in data

    # Test English medical query
    res = client.post("/chat", json={
        "user_id": "u3", 
        "message": "What are the symptoms of malaria?", 
        "language": "en",
        "literacy_level": "intermediate"
    }, headers={"X-API-Key": API_KEY})
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] in ["diagnosis", "general"]

def test_health_endpoint():
    """Test health check endpoint"""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "rag_system" in data
    assert "performance" in data

def test_stats_endpoint():
    """Test statistics endpoint"""
    res = client.get("/stats")
    assert res.status_code == 200
    data = res.json()
    assert "performance" in data
    assert "active_conversations" in data
    assert "rag_system" in data
    
@pytest.mark.skip(reason="RAG test endpoint not implemented")
def test_rag_system():
    """Test RAG system functionality"""
    res = client.post("/test/rag", json={"query": "malaria symptoms", "k": 3})
    assert res.status_code == 200
    data = res.json()
    assert "query" in data
    assert "results" in data
    assert "result_count" in data

@pytest.mark.skip(reason="LLM test endpoint not implemented")
def test_llm_system():
    """Test LLM system functionality"""
    res = client.post("/test/llm", json={"message": "What is fever?", "intent": "general"})
    assert res.status_code == 200
    data = res.json()
    assert "input" in data
    assert "intent" in data
    assert "response" in data

@pytest.mark.skip(reason="Performance test endpoint not implemented")
def test_performance_endpoint():
    """Test performance monitoring endpoint"""
    res = client.get("/test/performance")
    assert res.status_code == 200
    data = res.json()
    assert "performance_stats" in data
    assert "active_conversations" in data

def test_input_validation():
    """Test input validation"""
    # Test empty message
    res = client.post("/chat", json={"user_id": "u4", "message": ""}, headers={"X-API-Key": API_KEY})
    assert res.status_code == 400  # Validation error

    # Test very long message
    long_message = "a" * 1001
    res = client.post("/chat", json={"user_id": "u5", "message": long_message}, headers={"X-API-Key": API_KEY})
    assert res.status_code == 400  # Validation error

    # Test short user_id
    res = client.post("/chat", json={"user_id": "u", "message": "hello"}, headers={"X-API-Key": API_KEY})
    assert res.status_code == 400
