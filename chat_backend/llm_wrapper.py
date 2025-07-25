"""
HuggingFace-backed language model integration for the medical chatbot.

Uses a remote HuggingFace endpoint if configured, otherwise uses a fallback.
"""

import os
import requests

def detect_language(text):
    """
    Simple heuristic for language detection (French vs English).
    """
    fr = ["é", "è", "à", "ô", "quoi", "diagnostic", "traitement", "maladie"]
    for f in fr:
        if f in text.lower():
            return "fr"
    return "en"

class LLMWrapper:
    def __init__(self, rag_system):
        self.rag_system = rag_system
        self.hf_endpoint = os.environ.get(
            "HF_LLM_ENDPOINT",
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        )
        self.hf_api_key = os.environ.get("HF_API_KEY")

    def generate_response(self, user_message, context, intent, history=None):
        language = detect_language(user_message)

        # New instructions to ensure clarity and empathy in the responses
        instructions = """
        Clinical Mode. Communicate with clarity, empathy, and accessibility for all literacy levels. 
        Use simple, straightforward language without medical jargon. Provide tailored explanations with examples or analogies as needed. 
        Adopt a compassionate and understanding tone. Include a brief check-in for comprehension after delivering information. 
        Avoid engagement tactics, sentiment uplift, or continuation bias. Provide only well-established medical information; do not diagnose or prescribe. 
        For statements with confidence below 8 (on a 1-10 scale), append: "Based on general knowledge; confirm with your doctor." 
        Terminate replies immediately after the information and check-in. 
        Goal: enable patient understanding of diagnoses, treatments, and medications.
        """

        prompt_parts = [instructions, f"Intent: {intent}."]

        if context:
            prompt_parts.append(f"Context: {context}")
        if history:
            prompt_parts.append(f"Conversation history: {history}")

        prompt_parts.append(f"User: {user_message}")
        prompt = "\n".join(prompt_parts)

        # API call to Hugging Face's endpoint
        if self.hf_endpoint and self.hf_api_key:
            try:
                resp = requests.post(
                    self.hf_endpoint,
                    headers={"Authorization": f"Bearer {self.hf_api_key}"},
                    json={"inputs": prompt, "parameters": {"max_new_tokens": 256}},
                    timeout=10,
                )
                resp.raise_for_status()
                return resp.json()["generated_text"]
            except Exception:
                pass

        # Fallback heuristic if no endpoint is available
        if context:
            if language == "fr":
                return (
                    f"Je comprends votre question. Voici des informations générales : {context}. "
                    f"Ces informations sont données à titre indicatif. Consultez un professionnel de santé pour un avis personnalisé."
                )
            else:
                return (
                    f"I understand your question. Here is some general information: {context}. "
                    f"This is for informational purposes only. Consult a healthcare professional for personalized advice."
                )
        else:
            if language == "fr":
                return "Je suis désolé, je ne trouve pas d'informations spécifiques à ce sujet. Consultez un professionnel de santé."
            else:
                return "I'm sorry, I don't have specific information on this topic. Please consult a healthcare professional."
