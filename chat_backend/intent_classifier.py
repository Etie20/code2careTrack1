"""
Dynamic intent classifier for medical chatbot queries.

Loads training examples from a CSV file and classifies input into:
diagnosis, treatment, medication, general_info, emergency, appointment, tests.
Supports French and English. Optimized for CPU.
"""

import os
import pickle
from pathlib import Path

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from dotenv import load_dotenv
import logging

from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Paths
# BASE_DIR = Path(__file__).parent.parent
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_PATH = os.path.join(BASE_DIR, "intent_model.pkl")
# VECTORIZER_PATH = os.path.join(BASE_DIR, "intent_vectorizer.pkl")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "intent_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "intent_vectorizer.pkl")

# DEFAULT_CSV_PATH = BASE_DIR / "Repo" / "AnalysisBackend" / "utils" / "intent_dataset.csv"
# CSV_PATH = os.getenv("INTENT_DATASET_PATH", str(DEFAULT_CSV_PATH))
def train_intent_classifier():
    """Train and save the classifier model from CSV examples."""
    # Construct an absolute path to the CSV file
    # Goes up one level from chat_backend, then into AnalysisBackend/utils
    default_csv_path = os.path.join(BASE_DIR, '..', 'AnalysisBackend', 'utils', 'intent_dataset.csv')
    CSV_PATH = os.getenv("INTENT_DATASET_PATH", default_csv_path)
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(
            f"Training data not found at: {CSV_PATH}\n"
            f"Current working directory: {os.getcwd()}\n"
            f"Resolved path: {os.path.abspath(CSV_PATH)}"
        )

    logger.info(f"Chargement du jeu de données depuis : {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    if "text" not in df.columns or "intent" not in df.columns:
        raise ValueError("CSV must contain 'text' and 'intent' columns")

    # texts = df["text"].astype(str).tolist()
    # labels = df["intent"].astype(str).tolist()

    X_train, X_test, y_train, y_test = train_test_split(df['text'], df['intent'], test_size=0.2, random_state=42)

    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    # X = vectorizer.fit_transform(texts)
    model = LogisticRegression(max_iter=300)
    # model.fit(X, labels)
    model.fit(X_train_vec, y_train)

    logger.info(f"Précision du modèle : {accuracy_score(y_test, model.predict(X_test_vec))}")

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    with open(VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)


class IntentClassifier:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load_model()

    def load_model(self):
        logger.info("Tentative de chargement du modèle d'intention et du vectoriseur.")
        try:
            with open(MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
            with open(VECTORIZER_PATH, 'rb') as f:
                self.vectorizer = pickle.load(f)
            logger.info("Modèle et vectoriseur chargés avec succès depuis les fichiers .pkl.")
        except FileNotFoundError:
            logger.warning("Fichiers .pkl non trouvés. Lancement de l'entraînement du modèle.")
            try:
                train_intent_classifier()
                with open(MODEL_PATH, 'rb') as f:
                    self.model = pickle.load(f)
                with open(VECTORIZER_PATH, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                logger.info("Modèle et vectoriseur chargés après entraînement.")
            except FileNotFoundError as e:
                logger.error(f"Training data missing: {e}. Falling back to default intent.")
                self.model = None
                self.vectorizer = None

    def classify_intent(self, text: str) -> str:
        if not self.model or not self.vectorizer:
            logger.error("Le modèle d'intention ou le vectoriseur n'est pas chargé.")
            return "général(generated)"

        text_vec = self.vectorizer.transform([text])
        intent = self.model.predict(text_vec)[0]
        logger.info(f"Texte: '{text}' -> Intention prédite: '{intent}'")
        return intent


# CLI test mode
if __name__ == "__main__":
    classifier = IntentClassifier()
    # sample_text = "À quel moment prendre du paracétamol ?"
    sample_text = "Do I need to take paracetamol with food ?"
    print(f"Message: {sample_text}")
    print(f"Predicted intent: {classifier.classify_intent(sample_text)}")
