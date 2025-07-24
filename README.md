#  Projet CODE2CARE (Team Enligthen Innovation)
# Track1

---

##  **1. Objectif métier principal**

> Concevoir un système intégré permettant aux établissements de santé de :

* recueillir les feedbacks des patients via plusieurs modes (texte, voix, emojis, étoiles),
* analyser automatiquement les sentiments exprimés et les thèmes abordés,
* envoyer des rappels multilingues de rendez-vous ou de médication,
* avec accessibilité pour tous (langues locales, zones à faible connectivité).

---

##  **2. Exigences métier fonctionnelles**

| ID  | Exigence                                                                               |
| --- | -------------------------------------------------------------------------------------- |
| F1  | Le patient doit pouvoir soumettre un feedback en texte, emoji, étoile ou voix          |
| F2  | Le patient peut recevoir des rappels de rendez-vous et de prise de médicaments         |
| F3  | Les rappels doivent être envoyés par SMS, notification, ou message vocal               |
| F4  | L'application doit permettre la reconnaissance vocale et la synthèse vocale            |
| F5  | Le système doit supporter plusieurs langues : Français, Anglais, Douala, Bassa, Ewondo |
| F6  | Le personnel médical (ou l’admin) peut consulter les feedbacks et statistiques         |
| F7  | Chaque feedback est analysé pour extraire le **sentiment** (positif, neutre, négatif)  |
| F8  | Chaque feedback est catégorisé par **thème** : accueil, délai, soins, hygiène…         |
| F9  | L'utilisateur doit pouvoir s'authentifier dans l’application mobile (patient ou staff) |
| F10 | Le patient doit pouvoir sélectionner sa langue préférée à l'inscription                |

---

##  **3. Contraintes techniques (liées au métier)**

| ID | Contrainte                                                                                                                   |
| -- | ---------------------------------------------------------------------------------------------------------------------------- |
| C1 | Le système doit fonctionner dans des zones à **faible bande passante (2G/3G)**                                               |
| C2 | Le système doit fonctionner **offline temporairement** avec synchronisation différée                                         |
| C3 | L’envoi de rappels doit respecter les **préférences de langue et de canal** du patient                                       |
| C4 | Le système doit être conforme aux normes de **confidentialité des données de santé** (ex. RGPD, anonymisation des feedbacks) |
| C5 | Le système ne doit pas dépendre uniquement d’un accès à Internet haut débit                                                  |
| C6 | Les messages vocaux ou écrits doivent être **traduisibles dans les langues locales**                                         |
| C7 | Les feedbacks ne doivent pas être modifiables par l’utilisateur une fois soumis                                              |
| C8 | Les rappels doivent être programmés automatiquement **à partir des prescriptions ou RDV médicaux**                           |

---

##  **4. Règles de gestion**

| ID | Règle de gestion                                                              |
| -- | ----------------------------------------------------------------------------- |
| R1 | Un patient ne peut recevoir un rappel que s’il est enregistré dans le système |
| R2 | Un feedback est toujours associé à un patient identifié                       |
| R3 | Un rappel de type `appointment` peut être lié à un médecin                    |
| R4 | Les feedbacks vocaux sont convertis en texte pour l’analyse sémantique        |
| R5 | Chaque patient ne peut avoir qu’**une seule langue préférée**                 |
| R6 | Un même patient peut recevoir plusieurs rappels dans la journée               |
| R7 | Un même patient peut soumettre plusieurs feedbacks                            |

---

##  **5. Exigences non fonctionnelles**

| ID  | Exigence                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------- |
| NF1 | Le système doit être utilisable sur Android et Web                                                       |
| NF2 | L’interface doit être accessible à des patients peu alphabétisés (emoji, voix)                           |
| NF3 | Le traitement des feedbacks (analyse NLP) doit se faire en < 10 secondes                                 |
| NF4 | Les notifications doivent être livrées au moins 90 % du temps                                            |
| NF5 | Le backend doit être **modulaire** pour faciliter l’intégration future (ex : ajout de nouvelles langues) |
| NF6 | Le système doit pouvoir évoluer jusqu'à **plusieurs milliers d’utilisateurs**                            |
| NF7 | Les données doivent être sauvegardées quotidiennement                                                    |
| NF8 | Le système doit répondre à des pannes de connectivité sans perte d’information                           |

---

##  **6. Indicateurs de réussite du projet (KPIs)**

| KPI                           | Objectif cible               |
| ----------------------------- | ---------------------------- |
| Taux de feedback journalier   | ≥ 60 % des patients          |
| Délai moyen d’analyse NLP     | ≤ 5 secondes                 |
| Taux de livraison des rappels | ≥ 90 %                       |
| Satisfaction utilisateur      | ≥ 80 % (via auto-évaluation) |
| Disponibilité du système      | ≥ 99 %                       |

---

##  **7. Description**

Ce projet est une application complète regroupant :

- Un **backend principal en Spring Boot** pour la gestion métier et l’API REST sécurisée.
- Un **frontend Angular** pour l’interface utilisateur moderne et responsive.
- Un **backend d’analyse en FastAPI**, dédié aux traitements analytiques et aux calculs spécifiques (IA, NLP ou statistiques selon le domaine).

Le tout est organisé dans un **monorepo** pour une meilleure cohérence, un versioning unique et une intégration continue simplifiée.

---

## **8. Technologies utilisées**

| Technologie | Rôle | Version |
|-------------|------|---------|
| **Spring Boot** | Backend principal (API REST, logique métier, sécurité JWT) | 3.x |
| **Angular** | Frontend SPA | 20.x |
| **FastAPI** | Backend d’analyse | 0.110+ |
| **PostgreSQL** | Base de données relationnelle | 12.x |
| **Docker / Docker Compose** | Conteneurisation et orchestration locale | latest |
| **Gradle** | Build et gestion des dépendances Spring Boot | 8.14 |
| **Node.js & npm** | Build et gestion Angular | 20.x |
| **Git / GitHub Actions** | Versioning et CI/CD | - |

##  **9. Modèle Logique de Données (MLD)**

<img width="536" height="524" alt="Screenshot 2025-07-18 204631" src="https://github.com/user-attachments/assets/d406e913-dfda-48de-9606-36481d6d5d64" />

---

##  **10. Structure du monorepo**

###  Architecture Onion (Hexagonal / Clean Architecture)

L’architecture **Onion (ou Clean Architecture)** adoptée dans ce projet Spring Boot se base sur les principes suivants :

- **Core Domain au centre** :  
  Contient la logique métier pure (entités, modèles, interfaces de repository).

- **Application** :  
  Contient les cas d’usage, la logique applicative orchestrant les entités et repositories.

- **Infrastructure** :  
  Implémentation technique des interfaces (ex: JPA repositories, clients externes, configuration DB, Contrôleurs REST exposant les API à Angular).

📌 **Avantages :**

- Couplage réduit entre l’extérieur et le cœur métier
- Facilite les tests unitaires et l’évolutivité
- Chaque dépendance pointe vers l’intérieur (domain) sans inverser la logique métier

```bash
/code2careTrack1
│
├── track1Backend/ # Application Spring Boot
│ ├── src/
│ ├──
│    └── auth
|        └── application
|        └── domain
|        └── infrastructure
│ ├── build.gradle.kts
│ └── ...
│
├── dashboard/ # Le Dashbord Angular
│ ├── src/
│ ├── angular.json
│ └── ...
│
├── feedback/ # Application Angular pour le recensement des feedback
│ ├── src/
│ ├── angular.json
│ └── ...
├── AnalysisBackend/ # Application FastAPI
│ ├── api/
│ ├── main.py
```
---

## 🖼 **11. Aperçu du frontend**

![Capture d’écran 2025-07-18 203854](https://github.com/user-attachments/assets/28df3d22-aeae-49ef-a986-5fe0f0f3127c)
![Capture d’écran 2025-07-18 203846](https://github.com/user-attachments/assets/9c7c6f54-31c4-4715-9a1f-3fe7a41cd696)
![Capture d’écran 2025-07-18 203835](https://github.com/user-attachments/assets/4f6ecfd1-19e1-4d66-b8b8-ae36bd4fc313)
![Capture d’écran 2025-07-18 200624](https://github.com/user-attachments/assets/bec557c9-0fe0-447c-8600-292d6400b608)


---
##  **12. Lancer le projet**

### Prérequis

- Docker et Docker Compose installés
- Node.js v20+ et npm installés localement
- Gradle installé
- Python 3.10+ avec pip (pour FastAPI)

### Commandes principales

```bash
# Cloner le projet
git clone https://github.com/gfriedtod/code2careTrack1
cd code2careTrack1

# Lancer tous les services via docker-compose
docker-compose up --build

# Pour lancer l'application feedback
cd feedback
npm install
ng serve

# Pour lancer l'application dashboard
cd dashboard
npm install
ng serve

# Pour lancer Spring Boot en local
cd track1Backend
./gradlew build --refresh-dependencies 
./gradlew bootRun

# Pour lancer FastAPI en local
cd AnalysisBackend
pip install -r requirements.txt

# Pour lancer FastAPI en local (rappel multilingue)
uvicorn AnalysisBackend.scheduler.task:app --reload --port 8001

# Ou depuis la racine du projet :

# Si vous rencontrez une erreur d'import, essayez :
# PYTHONPATH=. uvicorn AnalysisBackend.scheduler.task:app --reload --port 8001

# Tester l'API REST de rappel (exemple avec curl)
curl -X POST http://localhost:8001/compose \
     -H "Content-Type: application/json" \
     -d '{"reminder_type":"medication","language":"DLA","name":"Mbappe","time":"20:00"}'

### Configuration des variables d’environnement (SMS Twilio)

Pour activer l’envoi de SMS, définissez les variables suivantes :

- `TWILIO_ACCOUNT_SID` : SID du compte Twilio
- `TWILIO_AUTH_TOKEN` : Token d’authentification Twilio
- `TWILIO_FROM_NUMBER` : Numéro d’expéditeur Twilio (ex: +237XXXXXXXXX)

Vous pouvez les définir dans un fichier `.env` à la racine du projet ou dans votre environnement système.
```


---

# Chat Backend avec FastAPI et LangChain [Track2]

Un service de conversation minimal est disponible dans `chat_backend/`.
Il s'appuie sur LangChain pour conserver le contexte de la conversation en
mémoire volatile et interroge un module RAG interne avant d'utiliser le modèle
Mistral pour générer la réponse.
Les communications doivent être sécurisées via TLS/SSL (par ex. au niveau du
proxy) pour respecter la confidentialité des échanges.

### Lancer en local

```bash
pip install -r requirements.txt
uvicorn chat_backend.main:app --reload --port 8000
```

### Déploiement Docker

```bash
docker build -t chat-backend .
#docker run -e API_KEY=mysecret -p 8000:8000 chat-backend
docker run -e API_KEY=mysecret -e RAG_API_URL=http://rag:9000/query \
  -p 8000:8000 chat-backend

```

Consultez `docs/api.md` pour la documentation des endpoints.
