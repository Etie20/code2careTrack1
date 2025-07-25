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

---

# Chatbot Track 2 – LLM Integration and RAG Pipeline

## 1. Architecture et Flux général

- **Backend** : FastAPI (`chat_backend/`)
- **Gestion contexte** : ConversationBufferMemory (LangChain si dispo, fallback maison sinon)
- **RAG** : TF-IDF sur clinical_summaries.csv (diagnosis + summary_text, pas d’info nominative)
- **LLM** :
  - Appel d’un endpoint Hugging Face (`HF_LLM_ENDPOINT`) pour un modèle type Mistral (local ou distant)
  - Fallback heuristique si non dispo

- **Sécurité** :
  - RGPD : historique uniquement en mémoire volatile, suppression possible à tout moment
  - Authentification : header X-API-Key obligatoire
  - Middleware HTTPSRedirect

## 2. Variables d’environnement

```API_KEY=your_api_key  
CLINICAL_SUMMARIES_CSV=../AnalysisBackend/utils/clinical_summaries.csv  
HF_LLM_ENDPOINT=https://api-inference.huggingface.co/models/xxx/mistral-7b-instruct-v0.2  
HF_API_KEY=hf_xxxxx (optionnel)
```

## 3. Pipeline de traitement

### a) Entrée utilisateur
- Message texte (FR/EN), éventuellement transcrit depuis la voix
- Détection de la langue (heuristique)

### b) Classification d’intention
- Utilisation de `intent_classifier.py` pour détecter : diagnosis, treatment, medication, general

### c) Récupération de contexte
- Récupération via RAG (`rag.py`): top-3 extraits du corpus cliniques (TF-IDF cosine similarity)

### d) Génération de la réponse
- Construction d’un prompt :  
    - instructions (simple/clair/empathique, sans jargon, adapté à la langue)  
    - intention détectée  
    - contexte RAG  
    - historique de conversation (concaténé, multi-tours)  
    - question utilisateur

Exemple de prompt FR :  
Explique en termes simples, empathiques et rassurants, sans jargon médical.  
Intent: diagnostic.  
Context: Paludisme. Test positif indiquant la présence de Plasmodium...  
Historique :  
User: Que signifie mon diagnostic ?  
AI: Le paludisme est une maladie causée...  
User: Dois-je prendre des médicaments ?


### e) Génération avec LLM
- **Si endpoint HF configuré** : envoi du prompt, récupération du champ `generated_text`
- **Sinon** : génération heuristique basée sur le contexte et la langue (ex : “Je comprends votre question... consultez un professionnel de santé”)

### f) Sortie
- Réponse adaptée, texte uniquement, historique mis à jour
- Pas de stockage persistant, suppression via `/history/{user_id}`

## 4. Respect du RGPD

- Jamais de stockage en base des messages : tout est en RAM, supprimé à la demande ou au redémarrage  
- Aucune info nominative/identifiante traitée côté RAG ou LLM  
- Middleware HTTPSRedirect pour forcer le chiffrement des échanges (TLS/SSL)  
- Authentification systématique par clé API  

## 5. Tests et Évaluations

- Tests unitaires dans `tests/test_chat.py` : vérifient l’enchaînement des messages, la génération de réponse, la gestion/suppression de l’historique  
- Pour une vraie évaluation médicale, comparer des réponses générées à celles d’un clinicien (structure type : grille d’évaluation, checklist, questionnaire patient)  
- Mesures : clarté, empathie, absence de jargon, adéquation médicale  
- Possibilité de calcul de métriques textuelles type BLEU/ROUGE. Un  
  exemple de script se trouve dans `tests/metrics/evaluate_bleu_rouge.py`.  
  Cet outil utilise NLTK pour calculer des scores BLEU et ROUGE-L sur  
  des réponses générées.  

## 6. Exemples de prompts optimisés

Lors de la construction du prompt envoyé au modèle Mistral, il est important d’être explicite sur la tâche, le ton et le niveau de langage. Quelques exemples :

- **Diagnostic (FR)** :

  Explique en termes simples, empathiques et rassurants, sans jargon médical.  
  Intent : diagnostic.  
  Contexte : La fièvre typhoïde est causée par la bactérie Salmonella typhi...  
  Le patient présente des douleurs abdominales.  
  Conversation précédente :  
  Utilisateur : J'ai reçu un diagnostic de fièvre typhoïde.  
  IA : La fièvre typhoïde est une infection bactérienne qui peut causer...  
  Utilisateur : Quels sont les traitements ?

  Ce prompt guide le modèle pour qu’il reste clair, empathique et rassurant en utilisant le contexte récupéré et l’historique.

- **Traitement (EN)** :

  Explain in simple, empathetic and reassuring terms, without medical jargon.  
  Intent: treatment.  
  Context: The common cold is usually self-limiting. Rest, hydration and  
  over-the-counter medication such as acetaminophen can help relieve  
  symptoms.  
  Conversation history:  
  User: How do I treat a cold?

  L’instruction rappelle au modèle d’adapter la réponse à un patient non spécialiste et d’employer un langage clair.

---

## 7. Fichiers/fonctions clés créés

- `chat_backend/intent_classifier.py`
- `chat_backend/llm_wrapper.py`
- (modif. à `main.py` pour remplacer l’appel direct au modèle factice)
- Ce présent fichier : `docs/track2_mistral.md`

---

## 8. Pour aller plus loin

- Intégration d’un vrai moteur vectoriel (FAISS, Pinecone) si ressources dispo  
- Ajout d’une vraie détection de langue (ex : langdetect, fasttext)  
- Déploiement d’un endpoint HuggingFace privé avec Mistral/LLaMA adapté  
- Validation clinique avec retour d’un panel de médecins

---

## 9. Lancer le projet

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
```

Variables utiles :
MODEL_NAME : nom du modèle Hugging Face (par ex. mistralai/Mistral-7B-Instruct-v0.2)  
DOCS_PATH : chemin vers les fichiers médicaux à indexer

Lancer le Chat Backend avec FastAPI et LangChain

```bash
pip install -r requirements.txt
cp .env.example .env  # puis renseignez vos clés dans ce fichier
uvicorn chat_backend.main:app --reload --port 8000
```

### Déploiement Docker

```bash
docker build -t chat-backend .
docker run --env-file .env -p 8000:8000 chat-backend
```

Track 2 - RAG Service  
La récupération de contexte utilise un service dédié dans rag_backend/. Lancez ce service via :

```bash
uvicorn rag_backend.main:app --reload --port 9000
```

Cela permet de finaliser l'intégration avec tous les services requis et tests.