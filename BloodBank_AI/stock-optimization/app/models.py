from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import date
from enum import Enum


class BloodType(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    O_POS = "O+"
    O_NEG = "O-"
    AB_POS = "AB+"
    AB_NEG = "AB-"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class CurrentStock(BaseModel):
    blood_type: BloodType
    current_units: int = Field(ge=0, description="Nombre d'unités actuellement en stock")
    expiring_units: int = Field(ge=0, description="Unités expirant dans les 7 jours")
    storage_location: str


class DemandForecast(BaseModel):
    blood_type: BloodType
    forecast_days: int = Field(ge=1, le=30, description="Horizon de prévision en jours")
    predicted_demand: float = Field(ge=0, description="Demande prévue en unités")
    min_forecast: float = Field(ge=0, description="Borne inférieure de l'intervalle de confiance")
    max_forecast: float = Field(ge=0, description="Borne supérieure de l'intervalle de confiance")
    confidence: float = Field(ge=0, le=1, description="Niveau de confiance")


class OptimizationRequest(BaseModel):
    current_stocks: List[CurrentStock]
    demand_forecasts: List[DemandForecast]
    horizon_days: int = Field(default=7, ge=1, le=30, description="Horizon d'optimisation")
    blood_type_filter: Optional[List[BloodType]] = None


class Recommendation(BaseModel):
    blood_type: BloodType
    current_stock: int
    predicted_demand: float
    safety_stock: int
    recommended_order: int
    projected_stock_after_order: int
    risk_level: RiskLevel
    next_delivery_date: str
    cost_breakdown: Dict[str, float] = Field(default_factory=dict)


class OptimizationResponse(BaseModel):
    recommendations: List[Recommendation]
    total_cost: float
    optimization_status: str
    timestamp: str


class ConfigSettings(BaseModel):
    delivery_cycle_days: int = Field(default=7, ge=1)
    delivery_lead_time_days: int = Field(default=2, ge=0)
    service_level: float = Field(default=0.95, ge=0.5, le=0.99)
    safety_stock_multiplier: float = Field(default=1.65, ge=0)
    wastage_rate: float = Field(default=0.03, ge=0, le=1)
    cost_per_unit: Dict[str, float] = Field(default_factory=lambda: {
        "A+": 150, "A-": 150, "B+": 140, "B-": 140,
        "O+": 130, "O-": 130, "AB+": 160, "AB-": 160
    })
    holding_cost_per_unit: float = Field(default=10, ge=0)
    shortage_cost_per_unit: float = Field(default=500, ge=0)