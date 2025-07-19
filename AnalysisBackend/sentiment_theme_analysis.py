from transformers import pipeline
from googletrans import Translator
import spacy
from spacy.matcher import Matcher
import torch

translator = Translator(service_urls=['translate.google.com'])

# French Sentiment Analysis
sentiment_pipe = pipeline(
    "text-classification",
    model="nlptown/bert-base-multilingual-uncased-sentiment", 
    device="cpu" 
)

theme_pipe = pipeline(
    "zero-shot-classification",
    model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli",
    device="cpu"
)

nlp_fr = spacy.load("fr_core_news_sm")
matcher = Matcher(nlp_fr.vocab)
matcher.add("URGENT", [[{"LEMMA": "sang"}, {"LEMMA": "manque"}]])

def analyze_feedback(text: str, input_lang: str) -> dict:
    """Returns sentiment, themes, and urgency flag."""
    # Translate to French
    if input_lang != "fr":
        try:
            text = translator.translate(text, src=input_lang, dest="fr").text
        except Exception as e:
            print(f"Translation failed: {e}")

    # Detect urgency
    doc = nlp_fr(text)
    is_urgent = bool(matcher(doc))

    # Sentiment Analysis (POS/NEG/NEU)
    sentiment_result = sentiment_pipe(text[:512])  # Trim to model max length
    sentiment_map = {
        "1 star": "negative",
        "2 stars": "negative",
        "3 stars": "neutral",
        "4 stars": "positive",
        "5 stars": "positive"
    }
    sentiment = sentiment_map.get(sentiment_result[0]["label"], "neutral")

    # Theme Classification
    theme_candidates = ["temps d'attente", "attitude du personnel", "hygiène", "consultation", "équipement", "facturation et prix", "disponibilité des médicaments", "infrastructure"]
    themes = theme_pipe(text, candidate_labels=theme_candidates, multi_label=True)
    top_themes = [theme_candidates[i] for i, score in enumerate(themes["scores"]) if score > 0.5]

    return {
        "sentiment": sentiment,
        "themes": top_themes or ["autre"],
        "is_urgent": is_urgent,
        "translated_text": text
    }

if __name__ == "__main__":
    test_cases = [
        ("The doctor was kind and welcoming", "en"),
        ("Les salles d'hospitalisation etaient salles", "fr"),
        ("Il manque des equipement pour la pediatrie", "fr")  # Urgent case
    ]
    
    for text, lang in test_cases:
        print(f"Input: '{text}' ({lang})")
        print("Output:", analyze_feedback(text, lang), "\n")