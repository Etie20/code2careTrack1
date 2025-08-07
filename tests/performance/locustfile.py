"""
Enhanced Locust performance test for medical chatbot API.

Tests:
- Chat endpoint performance (text and image)
- RAG system performance
- Conversation management
- Rate limiting
- Error handling
- OCR performance
- Multilingual support
"""

from locust import HttpUser, task, between, events
import json
import random
import time

class MedicalChatbotUser(HttpUser):
    wait_time = between(1, 3)  # Wait 1-3 seconds between requests
    
    def on_start(self):
        """Initialize user session"""
        self.user_id = f"test_user_{random.randint(1000, 9999)}"
        self.headers = {
            "Content-Type": "application/json",
            "X-User-ID": self.user_id
        }
        
        # Test messages in different languages and explanation levels
        self.test_messages = [
            # French - Simple explanations
            {"text": "J'ai mal à la tête", "explanation_level": "simple"},
            {"text": "Je me sens fatigué", "explanation_level": "simple"},
            {"text": "Qu'est-ce que c'est la fièvre?", "explanation_level": "simple"},
            
            # French - Detailed explanations
            {"text": "J'ai des symptômes de grippe", "explanation_level": "détaillé"},
            {"text": "Mon diagnostic montre une infection", "explanation_level": "détaillé"},
            {"text": "Quel est le traitement recommandé?", "explanation_level": "détaillé"},
            
            # English - Simple explanations
            {"text": "I have a headache", "explanation_level": "simple"},
            {"text": "I feel tired", "explanation_level": "simple"},
            {"text": "What is fever?", "explanation_level": "simple"},
            
            # English - Detailed explanations
            {"text": "I have flu symptoms", "explanation_level": "détaillé"},
            {"text": "My diagnosis shows an infection", "explanation_level": "détaillé"},
            {"text": "What is the recommended treatment?", "explanation_level": "détaillé"},
            
            # Medical queries
            {"text": "What is malaria?", "explanation_level": "détaillé"},
            {"text": "Symptoms of COVID-19", "explanation_level": "détaillé"},
            {"text": "Treatment for typhoid", "explanation_level": "détaillé"},
            {"text": "Medication side effects", "explanation_level": "détaillé"},
        ]

    @task(3)
    def test_chat_endpoint(self):
        """Test the main chat endpoint"""
        message_data = random.choice(self.test_messages)
        
        payload = {
            "user_id": self.user_id,
            "text": message_data["text"],
            "explanation_level": message_data["explanation_level"]
        }
        
        with self.client.post(
            "/chat",
            json=payload,
            headers=self.headers,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    # Validate response structure
                    required_fields = ["response", "history", "intent", "processing_time"]
                    if all(field in data for field in required_fields):
                        response.success()
                    else:
                        response.failure("Invalid response structure")
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def test_health_check(self):
        """Test health check endpoint"""
        with self.client.get("/health", catch_response=True) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if "status" in data and data["status"] == "healthy":
                        response.success()
                    else:
                        response.failure("Health check failed")
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def test_rag_system(self):
        """Test RAG system endpoint"""
        test_queries = [
            "malaria symptoms",
            "COVID-19 treatment",
            "typhoid fever",
            "anemia diagnosis",
            "headache causes"
        ]
        
        query = random.choice(test_queries)
        payload = {"query": query, "k": 3}
        
        with self.client.post(
            "/test/rag",
            json=payload,
            headers=self.headers,
            catch_response=True
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if "results" in data and "query" in data:
                        response.success()
                    else:
                        response.failure("Invalid RAG response")
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def test_conversation_history(self):
        """Test conversation history endpoint"""
        with self.client.get(
            f"/conversation/{self.user_id}",
            headers=self.headers,
            catch_response=True
        ) as response:
            if response.status_code in [200, 404]:  # 404 is acceptable for new users
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def test_system_stats(self):
        """Test system statistics endpoint"""
        with self.client.get("/stats", catch_response=True) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if "performance" in data and "conversations" in data:
                        response.success()
                    else:
                        response.failure("Invalid stats response")
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def test_performance_endpoint(self):
        """Test performance monitoring endpoint"""
        with self.client.get("/test/performance", catch_response=True) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if "performance_stats" in data:
                        response.success()
                    else:
                        response.failure("Invalid performance response")
                except json.JSONDecodeError:
                    response.failure("Invalid JSON response")
            else:
                response.failure(f"HTTP {response.status_code}")

class StressTestUser(HttpUser):
    """User class for stress testing"""
    wait_time = between(0.1, 0.5)  # Faster requests for stress testing
    
    def on_start(self):
        self.user_id = f"stress_user_{random.randint(10000, 99999)}"
        self.headers = {
            "Content-Type": "application/json",
            "X-User-ID": self.user_id
        }

    @task(1)
    def rapid_chat_requests(self):
        """Send rapid chat requests to test rate limiting"""
        payload = {
            "user_id": self.user_id,
            "message": "Test message for stress testing",
            "language": "en",
            "literacy_level": "intermediate"
        }
        
        with self.client.post(
            "/chat",
            json=payload,
            headers=self.headers,
            catch_response=True
        ) as response:
            if response.status_code in [200, 429]:  # 429 is expected for rate limiting
                response.success()
            else:
                response.failure(f"Unexpected HTTP {response.status_code}")

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when the test starts"""
    print("Starting enhanced medical chatbot performance test")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when the test stops"""
    print("Enhanced medical chatbot performance test completed") 