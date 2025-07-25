"""
Simple intent classifier for medical chatbot queries.

Categorizes user messages into: diagnosis, treatment, medication, general.
Multilingual: French/English. Can be replaced by a real ML model.
"""

def classify_intent(text: str) -> str:
    DIAGNOSIS = [
        "diagnosis", "diagnostic", "maladie", "disease",
        "resultat", "result", "trouble", "de quoi",
        "c'est quoi", "what is", "what’s"
    ]
    TREATMENT = [
        "treatment", "traitement", "soigner", "heal", "cure",
        "prendre", "take", "follow", "protocol"
    ]
    MEDICATION = [
        "medication", "medicament", "drug", "médicament",
        "pilule", "dose", "comprimé", "ordonnance",
        "prescription", "medicine", "pharmacie"
    ]
    txt = text.lower()
    if any(k in txt for k in DIAGNOSIS):
        return "diagnosis"
    if any(k in txt for k in TREATMENT):
        return "treatment"
    if any(k in txt for k in MEDICATION):
        return "medication"
    return "general"
