import pytest
import numpy as np
from app.models import *
from app.optimizer import BloodInventoryOptimizer
from app.config import config


class TestBloodInventoryOptimizer:
    @pytest.fixture
    def optimizer(self):
        return BloodInventoryOptimizer()

    @pytest.fixture
    def sample_forecast(self):
        return DemandForecast(
            blood_type=BloodType.A_POS,
            forecast_days=7,
            predicted_demand=200.0,
            min_forecast=180.0,
            max_forecast=230.0,
            confidence=0.90
        )

    @pytest.fixture
    def sample_stock(self):
        return CurrentStock(
            blood_type=BloodType.A_POS,
            current_units=185,
            expiring_units=12,
            storage_location="Réfrigérateur 1"
        )

    def test_calculate_safety_stock(self, optimizer, sample_forecast):
        """Test du calcul du stock de sécurité"""
        safety_stock = optimizer.calculate_safety_stock(sample_forecast)

        # Vérifications de base
        assert safety_stock > 0
        assert isinstance(safety_stock, int)

        # Le stock de sécurité devrait augmenter avec l'incertitude
        forecast_high_uncertainty = DemandForecast(
            blood_type=BloodType.A_POS,
            forecast_days=7,
            predicted_demand=200.0,
            min_forecast=100.0,  # Plus d'incertitude
            max_forecast=300.0,
            confidence=0.90
        )
        safety_stock_high = optimizer.calculate_safety_stock(forecast_high_uncertainty)
        assert safety_stock_high > safety_stock

    def test_project_stock_without_order(self, optimizer):
        """Test de la projection du stock sans commande"""
        projected = optimizer.project_stock_without_order(
            current_stock=100,
            predicted_demand=50.0,
            expiring_units=5
        )
        # Vérifications de base
        assert projected >= 0
        assert isinstance(projected, int)

        # Cas où le stock devient négatif
        projected_negative = optimizer.project_stock_without_order(
            current_stock=10,
            predicted_demand=100.0,
            expiring_units=5
        )
        assert projected_negative == 0  # Ne peut pas être négatif

    def test_calculate_required_quantity(self, optimizer):
        """Test du calcul de la quantité requise"""
        required = optimizer.calculate_required_quantity(
            current_stock=100,
            safety_stock=20,
            predicted_demand=50.0,
            expiring_units=5
        )
        assert required >= 0
        assert isinstance(required, int)

    def test_determine_risk_level(self, optimizer):
        """Test de la détermination du niveau de risque"""
        safety_stock = 50
        # Risque élevé
        risk_high = optimizer.determine_risk_level(30, safety_stock)
        assert risk_high == RiskLevel.HIGH
        # Risque moyen
        risk_medium = optimizer.determine_risk_level(45, safety_stock)
        assert risk_medium == RiskLevel.MEDIUM
        # Risque faible
        risk_low = optimizer.determine_risk_level(80, safety_stock)
        assert risk_low == RiskLevel.LOW

    def test_optimize_orders_basic(self, optimizer):
        """Test de base pour l'optimisation des commandes"""
        stocks = [
            CurrentStock(
                blood_type=BloodType.A_POS,
                current_units=50,
                expiring_units=5,
                storage_location="Réfrigérateur 1"
            )
        ]
        forecasts = [
            DemandForecast(
                blood_type=BloodType.A_POS,
                forecast_days=7,
                predicted_demand=100.0,
                min_forecast=90.0,
                max_forecast=110.0,
                confidence=0.90
            )
        ]
        result = optimizer.optimize_orders(stocks, forecasts, 7)
        # Vérifications de base
        assert "recommendations" in result
        assert "total_cost" in result
        assert "optimization_status" in result
        assert len(result["recommendations"]) == 1
        recommendation = result["recommendations"][0]
        assert recommendation.blood_type == BloodType.A_POS
        assert recommendation.recommended_order >= 0

    def test_simulate_with_dummy_data(self, optimizer):
        """Test de la fonction de simulation"""
        result = optimizer.simulate_with_dummy_data()
        # Vérifications
        assert "recommendations" in result
        assert "total_cost" in result
        assert len(result["recommendations"]) == 8  # Tous les groupes sanguins
        # Vérifier que toutes les recommandations sont valides
        for rec in result["recommendations"]:
            assert rec.current_stock >= 0
            assert rec.predicted_demand >= 0
            assert rec.safety_stock >= 0
            assert rec.recommended_order >= 0
            assert rec.risk_level in [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH]