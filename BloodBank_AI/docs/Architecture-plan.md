# BloodBank AI - Documentation Technique
*(Pour les développeurs, par les développeurs)*

---

## 1. Le Projet en Bref 🩸
Système open-source pour optimiser les stocks de sang dans les hôpitaux africains :
- 🚨 Surveillance temps réel des stocks
- 🔮 Prédictions IA de la demande (92% de précision)
- 📊 Tableau de bord intuitif
- 🌍 Déjà en ligne : [care-bloodbank.vercel.app](https://care-bloodbank.vercel.app/)

---

## 2. Architecture Globale 🏗️
```plantuml
@startuml
!include <C4/C4_Container>

Person(admin, "Administrateur", "Gère les utilisateurs, configurations et audits")
Person(doctor, "Médecin", "Consulte les stocks, soumet des besoins médicaux")
Person(tech, "Technicien", "Enregistre les dons, gère l'inventaire, traite les alertes")

System_Boundary(bloodbank, "BloodBank AI") {
    Container(frontend, "Tableau de Bord", "Next.js 15", "Interface React avec Tailwind CSS\nhttps://care-bloodbank.vercel.app/")
    
    Container(data_ingestion, "API d'Ingestion", "Java Spring Boot", "Module 1: Intégration DHIS2\nWebhooks temps réel")
    
    Container(ai_forecasting, "Service de Prévision", "Python", "Module 2: Modèles STL/ARIMA/XGBoost\nPrécision de 92%")
    
    Container(stock_optimization, "Optimisation Stocks", "Python", "Module 4: Algorithmes SciPy/PuLP\nCalcul des commandes optimales")
    
    ContainerDb(database, "Base de Données", "PostgreSQL", "Schéma fourni (10 tables)\nHébergement Neon.tech")
}

' Relations utilisateurs
Rel(admin, frontend, "Utilise", "HTTPS")
Rel(doctor, frontend, "Consulte prévisions", "HTTPS")
Rel(tech, frontend, "Met à jour inventaire", "HTTPS")

' Relations internes
Rel(frontend, data_ingestion, "API: stocks/alertes", "REST/HTTPS")
Rel(frontend, ai_forecasting, "API: prédictions", "REST/HTTPS")
Rel(frontend, stock_optimization, "API: recommandations", "REST/HTTPS")

Rel(data_ingestion, database, "Persiste données", "JDBC")
Rel(ai_forecasting, database, "Lit données historiques", "SQLAlchemy")
Rel(stock_optimization, database, "Lit stocks/prévisions", "SQLAlchemy")

' Systèmes externes
System_Ext(dhis2, "DHIS2", "Système national d'information sanitaire")
System_Ext(hospital, "Systèmes Hospitaliers", "Systèmes cliniques locaux")

Rel(dhis2, data_ingestion, "Synchronisation données", "API REST")
Rel(hospital, data_ingestion, "Notifications événements", "Webhooks JSON")
@enduml
```

---

## 3. Flux de Données 🔄
![Diagramme Flux de Données](./architecture/data-flow.mermaid)

**Points clés** :
- Données **temps réel** via webhooks
- IA et optimisation **découplées**
- Boucle fermée **données → actions**

---

## 4. Vie d'une Poche de Sang 🩹
![Cycle de Vie Produits Sanguins](./architecture/blood-stock-lifecycle.mermaid)

**Traduction** :
- **Disponible** : Stockée et prête
- **Réservée** : Attribuée à un patient
- **Distribuée** : Utilisée
- **Expirée** : Alerte automatique ⏰

---

## 5. Rôles Utilisateurs 👥
![Diagramme Cas d'Utilisation](./architecture/usecase-diagram.mermaid)

**Permissions** :
- Médecins : Consultation + besoins
- Techniciens : Opérations quotidiennes
- Admin : Super-pouvoirs 🔥

---

## 6. Alerte Stock Critique! 🚨
![Séquence Alertes](./architecture/live-alerts-sequence-diagram.mermaid)

**Code couleurs** :
- 🔴 Rouge : "Plus que 2 poches O+ !"
- 🟡 Jaune : "Expiration dans 3 jours"
- 🟢 Vert : "Tout va bien"

---

## 7. Optimisation Automatique 🤖
![Workflow Optimisation](./architecture/stock-optimisation-workflow.plantuml)

**Exemple de sortie** :
> "Commander 15 poches O+ avant vendredi | 🔴 URGENT"

---

## 8. Déploiement ☁️

![Architecture Technique](./architecture/tech-arch.plantuml)

**Coût total** : **$0** (freemium)
- Frontend : Vercel (Hobby)
- Backend : Render (Free)
- DB : Neon.tech (Free)

---

## 9. Global File Architecture
```puml
BloodBank_AI/
├── database/               # Schéma SQL + migrations
├── data-ingestion-api/     # Clean Architecture (Java/Python)
├── ai-forecasting/         # Notebooks + modèles IA
├── stock-optimization/     # Algorithmes d'optimisation
├── frontend/               # Next.js 15 + shadcn/ui
├── docs/                   # Documentation
│   ├── architecture/       # Diagrammes Mermaid
│   ├── decisions.md        # ADRs (Architectural Decisions)
│   └── deployment.md       # Guide de déploiement
├── docker-compose.yml      # Environnement local
└── .github/workflows/      # CI/CD (build/test/deploy)
```
**Philosophie** :
> "Un dossier = un microservice = zéro dépendance externe"

---
### Points Clés d'Architecture
Indépendance des Modules
Chaque dossier est un projet autonome avec ses propres dépendances

1. Intégration via APIs 

Communication uniquement via :
   * GET `/api/stocks` (Ingestion)
   * POST `/api/forecast` (IA)
   * GET `/api/recommendations` (Optimisation)

2. Déploiement Échelonnable </br>

Les solutions pourront etre deployes ainsi :
* Frontend : Vercel (Next.js)
* Backend : Render/Heroku 
* Base de données : Neon (PostgreSQL gratuit)
* IA : Hugging Face Spaces

3. Envoyer PR avec :

* Code propre ✅
* Tests si possible 🧪
* Bière virtuelle 🍺