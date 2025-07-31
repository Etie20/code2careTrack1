import asyncio
import logging
import os
from datetime import datetime

import deep_translator.google
from huggingface_hub import InferenceClient
from tenacity import retry, stop_after_attempt, wait_exponential

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

import re

def detect_language(text: str) -> str:
    """Détecte la langue basée sur des mots-clés communs"""
    text = text.lower()

    # Liste de mots fréquents dans chaque langue
    french_keywords = ["le", "la", "les", "un", "une", "des", "est", "que", "pour", "dans"]
    english_keywords = ["the", "a", "an", "is", "and", "to", "for", "in", "of", "with"]

    fr_count = sum(1 for word in french_keywords if re.search(rf"\b{word}\b", text))
    en_count = sum(1 for word in english_keywords if re.search(rf"\b{word}\b", text))

    if fr_count > en_count:
        return "fr"
    elif en_count > fr_count:
        return "en"
    else:
        # Défaut basé sur les caractères spéciaux
        return "fr" if re.search(r"\b(je|tu|il|elle|on|nous|vous|ils|elles)\b", text) else "en"

class LLMWrapper:
    """
    A wrapper class for the Hugging Face Inference API.
    Handles different versions of the model based on date.
    """
    def __init__(self, api_key: str, model_name: str = "mistralai/Mistral-7B-Instruct-v0.2"):
        if not api_key:
            raise ValueError("Hugging Face API key is required.")
        self.model_name = model_name
        self.inference_client = InferenceClient(token=api_key)
        self.version = "2025-07-31"  # Default version
        logger.info(f"Initializing InferenceClient with model: {self.model_name}")
        logger.info(f"LLMWrapper initialized with version {self.version}")

    def set_version(self, version_date: str):
        """Sets the version of the LLM logic to use."""
        self.version = version_date
        logger.info(f"LLM version set to {self.version}")

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def _blocking_generate(self, full_prompt: str) -> str:
        """
        Private method to make a blocking call to the inference client.
        Wrapped with tenacity for retry logic.
        """
        logger.info("Generating response with `chat.completions.create` method.")
        try:
            # The new, correct way to call the API using the chat completions endpoint
            completion = self.inference_client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": full_prompt}],
                max_tokens=512,  # Use max_tokens instead of max_new_tokens
                temperature=0.7,
                top_p=0.95,
            )
            # Extract the response content from the message object
            response_text = completion.choices[0].message.content
            return response_text.strip()

        except Exception as e:
            logger.error(f"Internal error calling the InferenceClient: {e}", exc_info=True)
            # Re-raise the exception to trigger the retry mechanism
            raise

    def generate_response(self, user_message: str, context: str, intent: str, history: list = None, explanation_level: str = 'simple') -> str:
        """
        Generates a response based on the selected version.
        """
        logger.info(f"Executing generate_response version: {self.version}, arguments received: user_message={user_message}, context={context}, intent={intent}, history={history}, explanation_level={explanation_level}")
        user_lang = detect_language(user_message)
        if self.version == "2025-07-31":
            # This logic remains untouched, as requested.
            prompt_template = f"""
            **Context (medical information):**
            {context}
            
            **User's Question (in {user_lang.upper()}):**
            {user_message}
            
            **Instructions:**
            - Respond exclusively in the SAME LANGUAGE as the user's question
            - Provide a '{explanation_level}' explanation
            - Medical intent: {intent}
            - Don't bring to the user the translation. Talk to him in his language and tone.
            - Key considerations:
              * Use simple terms if 'simple' explanation level
              * Include relevant medical details from context
              * Maintain professional but approachable tone
            """
            full_prompt = prompt_template.format(
                context=context,
                user_message=user_message,
                explanation_level=explanation_level,
                intent=intent
            )

            logger.info(f"Generating response for intent: {intent}")
            try:
                # Call the updated private method
                # return await asyncio.to_thread(self._blocking_generate, full_prompt)
                return self._blocking_generate(full_prompt)
            except Exception as e:
                logger.error(f"Failed to generate response after multiple retries: {e}")
                return "Je suis désolé, une erreur technique est survenue lors de la génération de la réponse."
        else:
            logger.warning(f"Version {self.version} is not implemented. Using default response.")
            return "This version is not supported."
