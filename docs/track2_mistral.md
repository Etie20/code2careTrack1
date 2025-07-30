# Chatbot Track 2 – LLM Integration and RAG Pipeline

Ce document décrit l’implémentation du composant LLM (modèle de langage) pour le chatbot d’éducation patient du Douala General Hospital (DGH) — Track 2. Il présente l’architecture, la configuration, le pipeline de génération augmentée par récupération (RAG), la gestion multi-langue, le respect du RGPD, ainsi que les tests et points d’évaluation.

---

## 1. Architecture et Flux général

- **Backend** : FastAPI (`chat_backend/`)
- **Gestion contexte** : ConversationBufferMemory (LangChain si dispo, fallback maison sinon)
- **RAG** : TF-IDF sur clinical_summaries.csv (diagnosis + summary_text, pas d’info nominative)
- **LLM** :
    - Appel d’un endpoint Hugging Face (`HF_LLM_ENDPOINT`) pour un modèle type Mistral (local ou distant)
    - Fallback heuristique si non dispo

- **Sécurité** :
    - RGPD : historique uniquement en mémoire volatile, suppression possible à tout moment
    - Authentification : header X-API-Key obligatoire
    - Middleware HTTPSRedirect

---

## 2. Variables d’environnement

```
API_KEY=your_api_key
CLINICAL_SUMMARIES_CSV=../AnalysisBackend/utils/clinical_summaries.csv
HF_LLM_ENDPOINT=https://api-inference.huggingface.co/models/xxx/mistral-7b-instruct-v0.2
HF_API_KEY=hf_xxxxx (optionnel)
```

---

## 3. Pipeline de traitement

### a) Entrée utilisateur
- Message texte (FR/EN), éventuellement transcrit depuis la voix
- Détection de la langue (heuristique)

### b) Classification d’intention
- Utilisation de `intent_classifier.py` pour détecter : diagnosis, treatment, medication, general

### c) Récupération de contexte
- Récupération via RAG (`rag.py`): top-3 extraits du corpus cliniques (TF-IDF cosine similarity)

### d) Génération de la réponse
- Construction d’un prompt :
    - instructions (simple/clair/empathique, sans jargon, adapté à la langue)
    - intention détectée
    - contexte RAG
    - historique de conversation (concaténé, multi-tours)
    - question utilisateur

Exemple de prompt FR :
```
Explique en termes simples, empathiques et rassurants, sans jargon médical.
Intent: diagnostic.
Context: Paludisme. Test positif indiquant la présence de Plasmodium...
Historique :
User: Que signifie mon diagnostic ?
AI: Le paludisme est une maladie causée...
User: Dois-je prendre des médicaments ?
```

### e) Génération avec LLM
- **Si endpoint HF configuré** : envoi du prompt, récupération du champ `generated_text`
- **Sinon** : génération heuristique basée sur le contexte et la langue (ex : “Je comprends votre question... consultez un professionnel de santé”)

### f) Sortie
- Réponse adaptée, texte uniquement, historique mis à jour
- Pas de stockage persistant, suppression via `/history/{user_id}`

---

## 4. Respect du RGPD

- Jamais de stockage en base des messages : tout est en RAM, supprimé à la demande ou au redémarrage
- Aucune info nominative/identifiante traitée côté RAG ou LLM
- Middleware HTTPSRedirect pour forcer le chiffrement des échanges (TLS/SSL)
- Authentification systématique par clé API

---

## 5. Évaluation et tests

- Tests unitaires dans `tests/test_chat.py` : vérifient l’enchaînement des messages, la génération de réponse, la gestion/suppression de l’historique
- Pour une vraie évaluation médicale, comparer des réponses générées à celles d’un clinicien (structure type : grille d’évaluation, checklist, questionnaire patient)
- Mesures : clarté, empathie, absence de jargon, adéquation médicale
- Possibilité de calcul de métriques textuelles type BLEU/ROUGE.  Un
  exemple de script se trouve dans `tests/metrics/evaluate_bleu_rouge.py`.
  Cet outil utilise NLTK pour calculer des scores BLEU et ROUGE‑L sur
  des réponses générées.

---

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
- Ce présent fichier : `docs/track2_mistral.md`

---

## 8. Pour aller plus loin

- Intégration d’un vrai moteur vectoriel (FAISS, Pinecone) si ressources dispo
- Ajout d’une vraie détection de langue (ex : langdetect, fasttext)
- Déploiement d’un endpoint HuggingFace privé avec Mistral/LLaMA adapté
- Validation clinique avec retour d’un panel de médecins
