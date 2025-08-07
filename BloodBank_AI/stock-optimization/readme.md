# Module d'Optimisation des Stocks - Banque du Sang
## Vue d'ensemble
Ce module Python fournit une solution d'optimisation des stocks pour la banque du sang de l'Hôpital Général de Douala. Il utilise la programmation linéaire pour déterminer les quantités optimales à commander pour chaque groupe sanguin, en tenant compte des contraintes opérationnelles et des coûts.
## Fonctionnalités
### 🎯 Optimisation Intelligente
- Calcul automatique des stocks de sécurité basé sur les prévisions et le niveau de service
- Optimisation multi-objectifs (minimisation des coûts de commande, stockage et pénurie)
- Prise en compte des cycles de livraison et délais
### 📊 Gestion Complète des Contraintes
- Durée de conservation et unités proches de l'expiration
- Taux de perte (wastage rate) configurable
- Niveaux de service personnalisables (90% à 99%)
### 🔄 API REST Complète
- Endpoints pour l'optimisation en temps réel
- Configuration dynamique des paramètres
- Mode simulation pour tests et validation
## Architecture
```
app/ 
├── main.py # API FastAPI et routes
├── models.py # Schémas Pydantic pour validation 
├── optimizer.py # Logique d'optimisation (PuLP) 
└── config.py # Gestion de la configuration 
tests/
config.yaml # Paramètres de configuration 
requirements.txt # Dépendances Python 
Dockerfile # Conteneurisation 
docker-compose.yml # Orchestration
```
## Installation et Démarrage
### 🚀 Démarrage Rapide avec Docker
```
# Cloner le repository
git clone https://github.com/Etie20/code2careTrack1.git
cd BloodBank_AI

# Construire et lancer avec Docker Compose
docker-compose up --build

# L'API sera disponible sur http://localhost:8000
```
### 🛠️ Installation Locale
```
# Créer un environnement virtuel
python -m venv ai_venv
# source venv/bin/activate  # Linux/Mac
venv\Scripts\activate   # Windows

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur de développement
 cd .\BloodBank_AI\stock-optimization\
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
## Utilisation de l'API
### 📋 Documentation Interactive
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
### 🔧 Endpoints Principaux
#### 1. Optimisation des Stocks
```
POST /api/inventory/optimize
```
Exemple de requête:
```
{
  "current_stocks": [
    {
      "blood_type": "A+",
      "current_units": 185,
      "expiring_units": 12,
      "storage_location": "Réfrigérateur 1"
    },
    {
      "blood_type": "O+",
      "current_units": 245,
      "expiring_units": 15,
      "storage_location": "Réfrigérateur 3"
    }
  ],
  "demand_forecasts": [
    {
      "blood_type": "A+",
      "forecast_days": 7,
      "predicted_demand": 200.0,
      "min_forecast": 180.0,
      "max_forecast": 230.0,
      "confidence": 0.90
    },
    {
      "blood_type": "O+",
      "forecast_days": 7,
      "predicted_demand": 180.0,
      "min_forecast": 160.0,
      "max_forecast": 210.0,
      "confidence": 0.90
    }
  ],
  "horizon_days": 7
}
```
Réponse:
```
{
  "recommendations": [
    {
      "blood_type": "A+",
      "current_stock": 185,
      "predicted_demand": 200.0,
      "safety_stock": 25,
      "recommended_order": 45,
      "projected_stock_after_order": 18,
      "risk_level": "medium",
      "next_delivery_date": "2025-08-15",
      "cost_breakdown": {
        "order_cost": 6750.0,
        "holding_cost": 180.0,
        "total_cost": 6930.0
      }
    }
  ],
  "total_cost": 15450.0,
  "optimization_status": "Optimal",
  "timestamp": "2025-08-07T14:30:00"
}
```
#### 2. Récupération des Paramètres
```
GET /api/inventory/parameters
```
#### 3. Mise à Jour des Paramètres
```
POST /api/inventory/parameters
```
Exemple:
```
{
  "service_level": 0.98,
  "delivery_cycle_days": 5,
  "cost_per_unit": {
    "A+": 160,
    "O-": 140
  }
}
```
#### 4. Simulation avec Données Factices
```
GET /api/inventory/simulate
```
## Configuration
### 📝 Paramètres Principaux
### 🔧 Coûts par Groupe Sanguin
```
cost_per_unit:
  A+: 150€    A-: 150€
  B+: 140€    B-: 140€
  O+: 130€    O-: 130€
  AB+: 160€   AB-: 160€
```
## Algorithme d'Optimisation
### 📐 Calcul du Stock de Sécurité
```
SS = Z × σD × √L
```
- Z: Z-score du niveau de service (ex: 1.65 pour 95%) - σD: Écart-type de la demande ≈ (max_forecast - min_forecast) / 4 - L: Délai de livraison en jours
### 🎯 Fonction Objectif
Minimiser:
```
Σ(Coût_commande × Quantité) + 
Σ(Coût_stockage × Niveau_stock) + 
Σ(Coût_pénurie × Pénurie)
```
### ⚖️ Contraintes
- Conservation des stocks: Stock(t) = Stock(t-1) + Commande(t-1) - Demande(t) - Perte(t)
- Stock minimum: Stock(t) ≥ Stock_sécurité
- Non-négativité: Commande(t) ≥ 0
## Tests et Validation
### 🧪 Tests Unitaires
```
# Installer pytest
pip install pytest pytest-cov

# Lancer les tests
pytest tests/ -v --cov=app

# Tests avec couverture
pytest tests/ --cov=app --cov-report=html
```
### 📊 Tests d'Intégration
```
# Test complet avec simulation
curl -X GET "http://localhost:8000/api/inventory/simulate"

# Test d'optimisation avec données réelles
curl -X POST "http://localhost:8000/api/inventory/optimize" \
  -H "Content-Type: application/json" \
  -d @test_data.json
```
## Intégration avec l'Écosystème Existant
### 🔗 API Externes
Le module peut être intégré avec: - API de Stock: Récupération automatique des niveaux actuels - Moteur de Prévision: Import des prédictions de demande - Système ERP: Export des commandes optimisées
### 📱 Front-End Next.js/React
```
// Exemple d'appel depuis React
const optimizeInventory = async (data) => {
  const response = await fetch('/api/inventory/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```
## Déploiement Production
### ☸️ Kubernetes
```
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blood-inventory-optimizer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: blood-inventory-optimizer
  template:
    spec:
      containers:
      - name: api
        image: blood-inventory-optimizer:latest
        ports:
        - containerPort: 8000
        env:
        - name: CONFIG_FILE
          value: "/config/config.yaml"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```
### 📈 Monitoring
- Health Checks: /health endpoint
- Metrics: Intégration Prometheus/Grafana
- Logging: Structured logging avec rotation
## Extensions Futures
### 🚀 Améliorations Prévues
- Machine Learning: Intégration de modèles d'apprentissage par renforcement
- Multi-sites: Optimisation inter-hôpitaux
- Prévisions Avancées: Prise en compte de la saisonnalité et événements
- Interface Utilisateur: Dashboard de monitoring en temps réel
### 🔌 Points d'Extension
```
# Exemple d'extension pour algorithme personnalisé
class CustomOptimizer(BloodInventoryOptimizer):
    def optimize_with_ml(self, data):
        # Logique d'apprentissage par renforcement
        pass
```
## Support et Contact
### 📞 Support Technique
- Email: support@hospital-douala.cm
- Documentation: Wiki interne
- Issues: Système de ticketing
### 🔄 Mise à Jour
```
# Mise à jour en rolling deployment
docker-compose pull
docker-compose up -d --no-deps blood-inventory-api
```
## Licence
© 2025 Hôpital Général de Douala - Tous droits réservés

## Annexes
### 📋 Codes de Statut API
- 200: Succès
- 400: Erreur de validation des données
- 500: Erreur serveur (optimisation échouée)
### 🩸 Groupes Sanguins Supportés
A+, A-, B+, B-, O+, O-, AB+, AB-
### 📊 Métriques de Performance
- Temps de réponse moyen: < 2 secondes
- Précision d'optimisation: > 95%
- Disponibilité cible: 99.9%
