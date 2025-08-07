import numpy as np
from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus, value
from typing import List, Dict, Tuple
from datetime import datetime, timedelta

from .models import *
from .config import config


class BloodInventoryOptimizer:
    """Optimiseur des commandes de sang utilisant la programmation linéaire."""

    def __init__(self):
        self.config = config

    def calculate_safety_stock(self, forecast: DemandForecast) -> int:
        """
        Calcule le stock de sécurité en utilisant la formule
        SS = Z × σD × √L, où σD est approximé par (max_forecast - min_forecast) / 4.
        """
        sigma_d = (forecast.max_forecast - forecast.min_forecast) / 4
        z_score = self.config.get_z_score()
        lead_time_factor = np.sqrt(self.config.settings.delivery_lead_time_days)
        safety_stock = z_score * sigma_d * lead_time_factor
        return max(1, int(np.ceil(safety_stock)))

    def project_stock_without_order(self, current_stock: int, predicted_demand: float, expiring_units: int) -> int:
        """Projette le stock sans nouvelle commande."""
        usable_stock = max(0, current_stock - expiring_units)
        projected = usable_stock - (1 + self.config.settings.wastage_rate) * predicted_demand
        return max(0, int(projected))

    def calculate_required_quantity(self, current_stock: int, safety_stock: int,
                                    predicted_demand: float, expiring_units: int) -> int:
        """Calcule la quantité requise pour maintenir le stock de sécurité."""
        projected_stock = self.project_stock_without_order(
            current_stock, predicted_demand, expiring_units
        )
        required = safety_stock + predicted_demand - projected_stock
        return max(0, int(np.ceil(required)))

    def determine_risk_level(self, projected_stock: int, safety_stock: int) -> RiskLevel:
        """Détermine le niveau de risque basé sur le stock projeté."""
        if projected_stock < safety_stock * 0.8:
            return RiskLevel.HIGH
        elif projected_stock < safety_stock * 1.2:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW

    def optimize_orders(self, stocks: List[CurrentStock], forecasts: List[DemandForecast], horizon_days: int) -> Dict:
        """
        Optimise les commandes en utilisant la programmation linéaire. Retourne un
        dictionnaire contenant les recommandations et le coût total.
        """
        prob = LpProblem("BloodInventoryOptimization", LpMinimize)

        stock_dict = {s.blood_type: s for s in stocks}
        forecast_dict = {f.blood_type: f for f in forecasts}
        blood_types = list(set([s.blood_type for s in stocks]))
        periods = range(1, (horizon_days // self.config.settings.delivery_cycle_days) + 2)

        order_vars = {}
        inventory_vars = {}
        shortage_vars = {}

        for bt in blood_types:
            for t in periods:
                order_vars[(bt, t)] = LpVariable(f"order_{bt}_{t}", lowBound=0, cat='Integer')
                inventory_vars[(bt, t)] = LpVariable(f"inventory_{bt}_{t}", lowBound=0)
                shortage_vars[(bt, t)] = LpVariable(f"shortage_{bt}_{t}", lowBound=0)

        total_cost = 0
        for bt in blood_types:
            unit_cost = self.config.settings.cost_per_unit.get(bt.value, 150)
            for t in periods:
                total_cost += unit_cost * order_vars[(bt, t)]
                total_cost += self.config.settings.holding_cost_per_unit * inventory_vars[(bt, t)]
                total_cost += self.config.settings.shortage_cost_per_unit * shortage_vars[(bt, t)]
        prob += total_cost

        for bt in blood_types:
            if bt not in stock_dict or bt not in forecast_dict:
                continue
            current_stock_val = stock_dict[bt].current_units - stock_dict[bt].expiring_units
            demand = forecast_dict[bt].predicted_demand
            safety_stock = self.calculate_safety_stock(forecast_dict[bt])
            for t in periods:
                if t == 1:
                    prob += (inventory_vars[(bt, t)] ==
                             current_stock_val + order_vars[(bt, t)] -
                             demand * (1 + self.config.settings.wastage_rate) +
                             shortage_vars[(bt, t)])
                else:
                    prob += (inventory_vars[(bt, t)] ==
                             inventory_vars[(bt, t-1)] + order_vars[(bt, t)] -
                             demand * (1 + self.config.settings.wastage_rate) +
                             shortage_vars[(bt, t)])
                prob += inventory_vars[(bt, t)] >= safety_stock - shortage_vars[(bt, t)]

        prob.solve()

        recommendations = []
        total_optimization_cost = 0
        for bt in blood_types:
            if bt not in stock_dict or bt not in forecast_dict:
                continue
            stock = stock_dict[bt]
            forecast = forecast_dict[bt]
            safety_stock = self.calculate_safety_stock(forecast)
            recommended_order = sum(
                int(value(order_vars[(bt, t)])) if value(order_vars[(bt, t)]) else 0
                for t in periods
            )
            projected_stock = (stock.current_units - stock.expiring_units +
                               recommended_order -
                               int(forecast.predicted_demand * (1 + self.config.settings.wastage_rate)))
            unit_cost = self.config.settings.cost_per_unit.get(bt.value, 150)
            order_cost = recommended_order * unit_cost
            holding_cost = projected_stock * self.config.settings.holding_cost_per_unit
            cost_breakdown = {
                "order_cost": order_cost,
                "holding_cost": holding_cost,
                "total_cost": order_cost + holding_cost
            }
            total_optimization_cost += cost_breakdown["total_cost"]
            next_delivery = datetime.now() + timedelta(days=self.config.settings.delivery_lead_time_days)
            risk_level = self.determine_risk_level(projected_stock, safety_stock)
            recommendation = Recommendation(
                blood_type=bt,
                current_stock=stock.current_units,
                predicted_demand=forecast.predicted_demand,
                safety_stock=safety_stock,
                recommended_order=recommended_order,
                projected_stock_after_order=projected_stock,
                risk_level=risk_level,
                next_delivery_date=next_delivery.strftime("%Y-%m-%d"),
                cost_breakdown=cost_breakdown
            )
            recommendations.append(recommendation)
        return {
            "recommendations": recommendations,
            "total_cost": total_optimization_cost,
            "optimization_status": LpStatus[prob.status],
            "solver_used": "PuLP"
        }

    def simulate_with_dummy_data(self) -> Dict:
        """Fonction de simulation avec des données factices pour tester le module."""
        dummy_stocks = [
            CurrentStock(blood_type=BloodType.A_POS, current_units=185, expiring_units=12, storage_location="Réfrigérateur 1"),
            CurrentStock(blood_type=BloodType.A_NEG, current_units=45, expiring_units=3, storage_location="Réfrigérateur 1"),
            CurrentStock(blood_type=BloodType.B_POS, current_units=120, expiring_units=8, storage_location="Réfrigérateur 2"),
            CurrentStock(blood_type=BloodType.B_NEG, current_units=25, expiring_units=1, storage_location="Réfrigérateur 2"),
            CurrentStock(blood_type=BloodType.O_POS, current_units=245, expiring_units=15, storage_location="Réfrigérateur 3"),
            CurrentStock(blood_type=BloodType.O_NEG, current_units=35, expiring_units=2, storage_location="Réfrigérateur 3"),
            CurrentStock(blood_type=BloodType.AB_POS, current_units=18, expiring_units=1, storage_location="Réfrigérateur 4"),
            CurrentStock(blood_type=BloodType.AB_NEG, current_units=8, expiring_units=0, storage_location="Réfrigérateur 4"),
        ]
        dummy_forecasts = [
            DemandForecast(blood_type=BloodType.A_POS, forecast_days=7, predicted_demand=200.0, min_forecast=180.0, max_forecast=230.0, confidence=0.90),
            DemandForecast(blood_type=BloodType.A_NEG, forecast_days=7, predicted_demand=50.0, min_forecast=40.0, max_forecast=65.0, confidence=0.90),
            DemandForecast(blood_type=BloodType.B_POS, forecast_days=7, predicted_demand=130.0, min_forecast=115.0, max_forecast=150.0, confidence=0.90),
            DemandForecast(blood_type=BloodType.B_NEG, forecast_days=7, predicted_demand=30.0, min_forecast=25.0, max_forecast=40.0, confidence=0.90),
            DemandForecast(blood_type=BloodType.O_POS, forecast_days=7, predicted_demand=180.0, min_forecast=160.0, max_forecast=210.0, confidence=0.90),
            DemandForecast(blood_type=BloodType.O_NEG, forecast_days=7, predicted_demand=40.0, min_forecast=35.0, max_forecast=50.0, confidence=0.90),
            DemandForecast(blood_type=BloodType.AB_POS, forecast_days=7, predicted_demand=22.0, min_forecast=18.0, max_forecast=28.0, confidence=0.90),
            DemandForecast(blood_type=BloodType.AB_NEG, forecast_days=7, predicted_demand=12.0, min_forecast=10.0, max_forecast=15.0, confidence=0.90),
        ]
        return self.optimize_orders(dummy_stocks, dummy_forecasts, 7)