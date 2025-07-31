import os
import time
from huggingface_hub import InferenceClient
import asyncio
from deep_translator import GoogleTranslator
# from .intent_classifier import IntentClassifier
import logging

from chat_backend.intent_classifier import IntentClassifier

# Configuration du logging
logger = logging.getLogger(__name__)


"""
 Simple heuristic for language detection (French vs English).
 """
def detect_language(text):
    fr = ["é", "è", "à", "ô", "quoi", "diagnostic", "traitement", "maladie"]
    for f in fr:
        if f in text.lower():
            return "fr"
    return "en"

class LLMWrapper:
    def __init__(self, rag_system):
        self.rag_system = rag_system
        self.hf_api_key = os.environ.get("HF_API_KEY")

        # Use environment variable if set, otherwise default
        self.model_name = os.environ.get("HF_MODEL_NAME", "distilbert/distilgpt2")

        logger.info(f"Initializing InferenceClient with model: {self.model_name}")
        self.inference_client = InferenceClient(
            model=self.model_name,
            token=self.hf_api_key
        )
        self.classifier = IntentClassifier()

        logger.info(f"Initialisation de l'InferenceClient avec le modèle : {self.model_name}")
        logger.info("Initialisation de LLMWrapper avec la version du 2025-07-30")

        if not self.hf_api_key:
            logger.warning("Clé API Hugging Face (HF_API_KEY) non trouvée. L'accès aux modèles privés ou soumis à des quotas peut échouer.")

        self.inference_client = InferenceClient(
            model=self.model_name,
            token=self.hf_api_key
        )

        # self.inference_client = InferenceClient(
        #     # model="HuggingFaceH4/zephyr-7b-beta",
        #     model="distilbert/distilgpt2", # Modèle plus petit et fiable pour le test
        #     token=self.hf_api_key
        # )
        self.performance_stats = {
            'total_requests': 0,
            'average_response_time': 0.000,
            'cache_hits': 0,
            'cache_misses': 0
        }
        self.response_cache = {}

    def _blocking_generate(self, prompt: str) -> str:
        """
        Cette fonction privée contient l'appel bloquant à l'API.
        Elle sera exécutée dans un thread séparé.
        """
        try:
            response_text = self.inference_client.text_generation(
                prompt,
                max_new_tokens=512,
                do_sample=True,
                temperature=0.7,
                top_p=0.95,
            )
            return response_text
        except Exception as e:
            logger.error(f"Erreur interne lors de l'appel à l'InferenceClient : {e}", exc_info=True)
            return "Je suis désolé, une erreur technique est survenue lors de la génération de la réponse."

    def _generate_raw_response(self, prompt: str, max_tokens: int = 256) -> str:
        start_time = time.time()
        self.performance_stats['total_requests'] += 1

        cache_key = hash(prompt + str(max_tokens))
        if cache_key in self.response_cache:
            self.performance_stats['cache_hits'] += 1
            return self.response_cache[cache_key]

        self.performance_stats['cache_misses'] += 1

        try:
            outputs = self.inference_client.text_generation(
                prompt,
                max_new_tokens=max_tokens
            )
            # outputs = self.inference_client.text_generation(prompt, max_new_tokens=max_tokens)
            if isinstance(outputs, list) and "generated_text" in outputs[0]:
                response_text = outputs[0]["generated_text"]
                self.response_cache[cache_key] = response_text
                response_time = time.time() - start_time
                self.performance_stats['average_response_time'] = round(
                        (self.performance_stats['average_response_time'] * (self.performance_stats['total_requests'] - 1) + response_time)
                        / self.performance_stats['total_requests']
                )
                return outputs
            # if outputs:
            #     response_text = outputs[0]["generated_text"]
            #     self.response_cache[cache_key] = response_text
            #     response_time = time.time() - start_time
            #     self.performance_stats['average_response_time'] = (
            #             (self.performance_stats['average_response_time'] * (self.performance_stats['total_requests'] - 1) + response_time)
            #             / self.performance_stats['total_requests']
            #     )
            #    return response_text
            return ""

        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return ""

    # def classify_intent(self, user_message: str) -> str:
    #     prompt = """
    #     Classify the following message into one of these categories: diagnostic, treatment, medication, general.
    #
    #     Examples:
    #     - Message: 'What is malaria?' Category: diagnostic
    #     - Message: 'How is hypertension treated?' Category: treatment
    #     - Message: 'What is aspirin for?' Category: medication
    #     - Message: 'Can you help me?' Category: general
    #
    #     Now classify this message: '{}'
    #     Category:
    #     """.format(user_message)
    #
    #     response = self._generate_raw_response(prompt, max_tokens=50)
    #     try:
    #         category = response.split("Category: ")[1].strip().lower()
    #         if category in ["diagnostic", "treatment", "medication", "general"]:
    #             return category
    #         return "general"
    #     except:
    #         return "general"

    def classify_intent(self, user_message: str) -> str:
        return self.classifier.classify_intent(user_message)

    def translate_to_english(self, text: str) -> str:
        if self.hf_api_key:
            prompt = f"Translate the following text to English: {text}"
            try:
                outputs = self.inference_client.text_generation(prompt, max_new_tokens=100)
                if outputs:
                    return outputs[0]["generated_text"].strip()
                return text
            except:
                return text
        return text

    async def generate_response(self, user_message: str, context: str, intent: str, history: str, explanation_level: str):
        logger.info("Version de generate_response exécutée : 2025-07-30, arguments reçus : user_message=%s, context=%s, intent=%s, history=%s, explanation_level=%s",
                    user_message, context, intent, history, explanation_level)
        logger.info("Appel de generate_response avec les arguments : user_message=%s, context=%s, intent=%s, history=%s, explanation_level=%s",
                    user_message, context, intent, history, explanation_level)
        prompt = f"""
            <s>[INST] Vous êtes un assistant médical expert. Répondre à la question de l'utilisateur de manière concise et précise.
            Niveau d'explication demandé : {explanation_level}.
    
            Contexte des documents (RAG) :
            {context}
    
            Historique de la conversation :
            {history}
    
            Question de l'utilisateur :
            {user_message} [/INST]
            """

        try:
            logger.info(f"Génération de la réponse pour l'intention : {intent}")

            # Utilisation de la méthode text_generation avec les bons paramètres
            response_text = await asyncio.to_thread(self._blocking_generate, prompt)
            # response_text = self.inference_client.text_generation(
            #     prompt,
            #     max_new_tokens=512,
            #     do_sample=True,
            #     temperature=0.7,
            #     top_p=0.95,
            #     top_k=50,
            #     repetition_penalty=1.2
            # )

            return response_text

        except Exception as e:
            logger.error(f"Erreur lors de la génération de la réponse du LLM : {e}", exc_info=True)
            # Fournir une réponse de secours informative en cas d'échec de l'API
            return "Je suis désolé, je n'ai pas pu générer de réponse pour le moment. Veuillez réessayer plus tard."
