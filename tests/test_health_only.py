import os
import pytest
from fastapi.testclient import TestClient
from chat_backend.main import app


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c


def test_health_endpoint_only(client):
    res = client.get('/health')
    assert res.status_code == 200
    data = res.json()
    assert data['status'] == 'healthy'
