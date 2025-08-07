import pytest
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


class TestAPI:
    def test_root_endpoint(self):
        """Test du point d'entrée principal"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "status" in data

    def test_health_check(self):
        """Test du health check"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data

    def test_get_parameters(self):
        """Test de récupération des paramètres"""
        response = client.get("/api/inventory/parameters")
        assert response.status_code == 200
        data = response.json()
        # Vérifier la présence des paramètres essentiels
        assert "delivery_cycle_days" in data
        assert "service_level" in data
        assert "cost_per_unit" in data
        assert "wastage_rate" in data

    def test_simulation_endpoint(self):
        """Test de l'endpoint de simulation"""
        response = client.get("/api/inventory/simulate")
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert "total_cost" in data
        assert "optimization_status" in data
        assert "timestamp" in data
        assert len(data["recommendations"]) == 8

    def test_optimize_endpoint_valid_data(self):
        """Test de l'endpoint d'optimisation avec données valides"""
        request_data = {
            "current_stocks": [
                {
                    "blood_type": "A+",
                    "current_units": 100,
                    "expiring_units": 5,
                    "storage_location": "Réfrigérateur 1"
                }
            ],
            "demand_forecasts": [
                {
                    "blood_type": "A+",
                    "forecast_days": 7,
                    "predicted_demand": 50.0,
                    "min_forecast": 45.0,
                    "max_forecast": 55.0,
                    "confidence": 0.90
                }
            ],
            "horizon_days": 7
        }
        response = client.post("/api/inventory/optimize", json=request_data)
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert len(data["recommendations"]) == 1
        assert data["recommendations"][0]["blood_type"] == "A+"

    def test_optimize_endpoint_missing_data(self):
        """Test de l'endpoint d'optimisation avec données manquantes"""
        request_data = {
            "current_stocks": [
                {
                    "blood_type": "A+",
                    "current_units": 100,
                    "expiring_units": 5,
                    "storage_location": "Réfrigérateur 1"
                }
            ],
            "demand_forecasts": [
                {
                    "blood_type": "B+",  # Type sanguin différent
                    "forecast_days": 7,
                    "predicted_demand": 50.0,
                    "min_forecast": 45.0,
                    "max_forecast": 55.0,
                    "confidence": 0.90
                }
            ],
            "horizon_days": 7
        }
        response = client.post("/api/inventory/optimize", json=request_data)
        assert response.status_code == 400

    def test_update_parameters(self):
        """Test de mise à jour des paramètres"""
        updates = {
            "service_level": 0.98,
            "delivery_cycle_days": 5
        }
        response = client.post("/api/inventory/parameters", json=updates)
        assert response.status_code == 200
        # Vérifier que les paramètres ont été mis à jour
        response = client.get("/api/inventory/parameters")
        data = response.json()
        assert data["service_level"] == 0.98
        assert data["delivery_cycle_days"] == 5