from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, Any

from .models import *
from .optimizer import BloodInventoryOptimizer
from .config import config

# Crée l'application FastAPI avec des métadonnées de base
app = FastAPI(
    title="Blood Inventory Optimization API",
    description="API pour l'optimisation des stocks de la banque du sang",
    version="1.0.0"
)

# Configuration CORS pour permettre l'intégration avec le front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À adapter selon l'environnement
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialise l'optimiseur de stock
optimizer = BloodInventoryOptimizer()


@app.get("/", summary="Point d'entrée de l'API")
async def root():
    """
    Retourne une réponse simple indiquant que l'API est active.
    """
    return {
        "message": "Blood Inventory Optimization API",
        "version": "1.0.0",
        "status": "running"
    }


@app.post(
    "/api/inventory/optimize",
    response_model=OptimizationResponse,
    summary="Optimise les commandes de sang",
    description="Calcule les quantités optimales à commander pour chaque groupe sanguin"
)
async def optimize_inventory(request: OptimizationRequest):
    """
    Optimise les commandes de sang en fonction du stock actuel et des prévisions de demande.

    - **current_stocks**: État actuel des stocks par groupe sanguin
    - **demand_forecasts**: Prévisions de demande avec intervalles de confiance
    - **horizon_days**: Horizon d'optimisation (défaut: 7 jours)
    - **blood_type_filter**: Filtrage optionnel par groupes sanguins
    """
    try:
        # Filtrage optionnel par type sanguin
        stocks = request.current_stocks
        forecasts = request.demand_forecasts

        if request.blood_type_filter:
            stocks = [s for s in stocks if s.blood_type in request.blood_type_filter]
            forecasts = [f for f in forecasts if f.blood_type in request.blood_type_filter]

        # Validation: s'assurer qu'on a des données pour tous les types sanguins
        stock_types = {s.blood_type for s in stocks}
        forecast_types = {f.blood_type for f in forecasts}

        if stock_types != forecast_types:
            missing_in_stock = forecast_types - stock_types
            missing_in_forecast = stock_types - forecast_types

            error_msg = ""
            if missing_in_stock:
                error_msg += f"Données de stock manquantes pour: {list(missing_in_stock)}. "
            if missing_in_forecast:
                error_msg += f"Prévisions manquantes pour: {list(missing_in_forecast)}."

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

        # Optimisation
        result = optimizer.optimize_orders(stocks, forecasts, request.horizon_days)

        response = OptimizationResponse(
            recommendations=result["recommendations"],
            total_cost=result["total_cost"],
            optimization_status=result["optimization_status"],
            timestamp=datetime.now().isoformat()
        )

        return response

    except HTTPException:
        # Propagation des exceptions HTTP explicites
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'optimisation: {str(e)}"
        )


@app.get(
    "/api/inventory/parameters",
    response_model=ConfigSettings,
    summary="Récupère les paramètres de configuration",
    description="Retourne tous les paramètres utilisés par l'algorithme d'optimisation"
)
async def get_parameters():
    """
    Retourne les paramètres de configuration actuels:
    - Cycles et délais de livraison
    - Niveaux de service et stocks de sécurité
    - Coûts par groupe sanguin et coûts de stockage/pénurie
    - Taux de perte
    """
    return config.settings


@app.post(
    "/api/inventory/parameters",
    summary="Met à jour les paramètres de configuration",
    description="Permet de modifier les paramètres d'optimisation"
)
async def update_parameters(updates: Dict[str, Any]):
    """
    Met à jour les paramètres de configuration.

    Exemple de mise à jour:

    ```json
    {
        "service_level": 0.98,
        "delivery_cycle_days": 5,
        "cost_per_unit": {
            "A+": 160,
            "O-": 140
        }
    }
    ```
    """
    try:
        config.update_settings(updates)
        return {
            "message": "Paramètres mis à jour avec succès",
            "updated_settings": updates
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de la mise à jour: {str(e)}"
        )


@app.get(
    "/api/inventory/simulate",
    response_model=OptimizationResponse,
    summary="Simulation avec données factices",
    description="Teste le module avec un jeu de données factices"
)
async def simulate():
    """
    Exécute une simulation complète avec des données factices pour tester le fonctionnement du module.
    Utile pour les tests et la validation du système.
    """
    try:
        result = optimizer.simulate_with_dummy_data()
        response = OptimizationResponse(
            recommendations=result["recommendations"],
            total_cost=result["total_cost"],
            optimization_status=result["optimization_status"],
            timestamp=datetime.now().isoformat()
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la simulation: {str(e)}"
        )


@app.get("/health", summary="Vérification de santé de l'API")
async def health_check():
    """
    Point de contrôle pour vérifier que l'API fonctionne correctement.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "optimizer_status": "ready"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)