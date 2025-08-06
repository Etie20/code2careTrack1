from locust import HttpUser, task, between
import os

API_KEY = os.getenv("API_KEY", "secret")

class ChatUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def chat(self):
        self.client.post(
            "/chat",
            json={"user_id": "perf", "message": "hello"},
            headers={"X-API-Key": API_KEY},
        )