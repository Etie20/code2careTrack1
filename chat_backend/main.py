from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File, Request, Body
# from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
# from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request

from langsmith.utils import get_api_key
from pydantic import BaseModel, field_validator, ValidationInfo, Field
from typing import Dict, Optional
import os
import time
import asyncio
import logging
from contextlib import asynccontextmanager
from logging.handlers import RotatingFileHandler

# logging.basicConfig(filename='app.log', level=logging.ERROR)
from dotenv import load_dotenv
from langchain.memory import ConversationBufferMemory
from PIL import Image
import pytesseract
import tempfile

from .intent_classifier import IntentClassifier
from .llm_wrapper import LLMWrapper
from .rag_system import RAGSystem

# from types import SimpleNamespace

# --- Configuration du Logger (inchangée) ---
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

if not logger.handlers:
    file_handler = RotatingFileHandler(
        "app.log",
        maxBytes=10*1024*1024,
        backupCount=5
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ))
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter('%(levelname)s - %(message)s'))
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

# --- Chargement des variables d'environnement (inchangé) ---
load_dotenv()
API_KEY = os.getenv("API_KEY", "secret")
AUTH_ENABLED = os.getenv("AUTH_ENABLED", "true").lower() == "true"
# Performance monitoring
performance_stats = {
    'total_requests': 0,
    'average_response_time': 0.000,
    'error_count': 0,
    'ocr_requests': 0,
    'text_requests': 0
}

# --- Modèle Pydantic ---

class Message(BaseModel):
    user_id: str
    text: Optional[str] = Field(None, alias="message")
    image: Optional[UploadFile] = File(None)
    explanation_level: Optional[str] = "simple"

    @field_validator("text", "image", mode="before")
    @classmethod
    def check_inputs(cls, value, info: ValidationInfo):
        values = info.data
        field_name = info.field_name
        if field_name == "image" and value is not None and (values is None or values.get("text") is None):
            raise ValueError("Cannot provide image without text")
        return value

    @field_validator("explanation_level")
    @classmethod
    def validate_explanation_level(cls, value):
        if value not in ["simple", "detailed"]:
            raise ValueError("explanation_level must be 'simple' or 'detailed'")
        return value

# --- Lifespan Manager pour une initialisation unique ---

class AppState:
    """Container for application state objects."""
    rag_system: RAGSystem
    llm_wrapper: LLMWrapper
    intent_classifier: IntentClassifier
    memory_store: dict[str, ConversationBufferMemory]
    performance_stats: dict[str, int]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and clean up resources."""
    logger.info("--- Démarrage de l'application ---")
    _initialize_state(app)
    yield
    print("Arrêt de l'application...")
    if hasattr(app.state, "memory_store"):
        app.state.memory_store.clear()
    # if hasattr(app.state, "rag_system"):
    #     app.state.rag_system.clear_cache()
    print("Ressources nettoyées.")

app: FastAPI = FastAPI(
    title="Code2Care Chat API",
    version="1.1",
    description="Advanced medical chatbot with RAG, multilingual support, and performance optimization.",
    lifespan=lifespan,
)
def _initialize_state(app: FastAPI) -> None:
    """Populate ``app.state`` with core components."""

    logger.info("Initialisation du système RAG...")
    app.state.rag_system = RAGSystem()
    logger.info("Système RAG initialisé.")

    logger.info("Initialisation du LLMWrapper...")
    HF_API_KEY = os.getenv("HF_API_KEY")
    if not HF_API_KEY:
        logger.error("HUGGINGFACE_API_KEY environment variable is not set!")
    app.state.llm_wrapper = LLMWrapper(api_key=HF_API_KEY)
    logger.info("LLMWrapper initialisé.")

    logger.info("Initialisation de l'IntentClassifier...")
    app.state.intent_classifier = IntentClassifier()
    logger.info("IntentClassifier initialisé.")

    app.state.memory_store = {}
    logger.info("Magasin de mémoire en mémoire initialisé.")

    app.state.performance_stats = {
        'total_requests': 0, 'average_response_time': 0.0, 'error_count': 0,
        'ocr_requests': 0, 'text_requests': 0
    }
    logger.info("Statistiques de performance initialisées.")







# Add to FastAPI app
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"}
    )


# memory_store: Dict[str, ConversationBufferMemory] = {}
# rag_system = RAGSystem()
# llm_wrapper = LLMWrapper(rag_system)
#
# logger.info(f"Démarrage de l'application. Authentification activée : {AUTH_ENABLED}")
#
# logger.info(f"Démarrage de l'application. Authentification activée : {AUTH_ENABLED}")



# # --- Initialisation des composants au démarrage ---
# try:
#     logger.info("Initialisation du système RAG...")
#     rag_system = RAGSystem()
#     logger.info("Système RAG initialisé.")
#
#     logger.info("Initialisation du LLMWrapper...")
#     llm_wrapper = LLMWrapper(rag_system)
#     logger.info("LLMWrapper initialisé.")
#
#     # logger.info("Initialisation de l'IntentClassifier...")
#     # intent_classifier = IntentClassifier()
#     # logger.info("IntentClassifier initialisé.")
#
#     # logger.info("Initialisation du ConversationManager...")
#     # conversation_manager = ConversationManager()
#     # logger.info("ConversationManager initialisé.")
#
# except Exception as e:
#     logger.critical(f"Échec critique lors de l'initialisation d'un composant : {e}", exc_info=True)
#     # L'application ne devrait pas continuer si un composant essentiel échoue
#     raise



# Dépendance pour la clé API
async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    if AUTH_ENABLED:
        # Allow Hugging Face-style keys if they start with 'hf_'
        if not x_api_key or (x_api_key != API_KEY and not x_api_key.startswith('hf_')):
            logger.warning(f"Unauthorized access attempt. Key provided: '{x_api_key}'")
            raise HTTPException(status_code=401, detail="Invalid API Key")
    return None


@app.middleware("http")
async def performance_middleware(request: Request, call_next):
    """Performance monitoring middleware"""
    start_time = time.time()
    performance_stats['total_requests'] += 1

    response = await call_next(request)

    process_time = time.time() - start_time
    total = performance_stats['total_requests']
    performance_stats['average_response_time'] = round(
        (
                performance_stats['average_response_time'] * (total - 1)
                + process_time
        )
        / total,
        4,
        )

    response.headers["X-Process-Time"] = str(process_time)
    return response

# @app.on_event("shutdown")
# async def shutdown_event(request: Request):
#     """Cleanup resources on shutdown"""
#     print("Shutting down application...")
#     request.app.state.memory_store.clear()
#     request.app.state.rag_system.clear_cache()
#     print("Resources cleaned up.")

@app.get("/health")
async def health_check(request: Request):
    """Health check endpoint"""
    return {
        "status": "healthy",
        "rag_system": request.app.state.rag_system.check_status(),
        "performance": request.app.state.performance_stats
    }

@app.get("/status")
def check_status(request: Request):
    return {
        "status": request.app.state.rag_system.check_status(),
        "performance": request.app.state.performance_stats,
        "active_conversations": len(request.app.state.memory_store)
    }

@app.post("/chat", dependencies=[Depends(verify_api_key)])
async def chat(request: Request, message: Message):
    start_time = time.time()
    logger.info(f"Requête reçue pour l'utilisateur : {message.user_id}")

    # Accès aux composants via request.app.state
    llm_wrapper = request.app.state.llm_wrapper
    rag_system = request.app.state.rag_system
    intent_classifier = request.app.state.intent_classifier
    memory_store = request.app.state.memory_store
    performance_stats = request.app.state.performance_stats


    try:
        user_message = message.text or ""
        if message.image:
            image_data = await message.image.read()
            with tempfile.NamedTemporaryFile(delete=False) as tmp:
                tmp.write(image_data)
                tmp_path = tmp.name
            try:
                image = Image.open(tmp_path)
                ocr_text = pytesseract.image_to_string(image)
                user_message = f"{user_message}\nExtracted from image: {ocr_text}" if user_message else ocr_text
                performance_stats['ocr_requests'] += 1
            except Exception as e:
                logger.error(f"OCR failed for user {message.user_id}: {e}")
                performance_stats['error_count'] += 1
                raise HTTPException(
                    status_code=400,
                    detail=f"OCR processing failed. Please ensure the image is clear and contains text."
                )
            finally:
                os.remove(tmp_path)
        else:
            performance_stats['text_requests'] += 1

        if not user_message.strip():
            raise HTTPException(status_code=400, detail="No valid text provided")

        memory = memory_store.setdefault(message.user_id, ConversationBufferMemory(memory_key="chat_history", return_messages=True))
        memory.chat_memory.add_user_message(user_message)

        intent = intent_classifier.classify_intent(user_message)
        # intent = llm_wrapper.classify_intent(user_message)
        # intent = classify_intent(user_message)
        print(f"Intent detected: {intent}")
        rag_context = rag_system.search(user_message, k=3)
        # rag_context, detected_lang = rag_system.search(user_message, k=3)

        history_messages = [m.content for m in memory.chat_memory.messages]
        history_str = "\n".join(history_messages[:-1]) if len(history_messages) > 1 else ""

        logger.info(f"Type de llm_wrapper : {type(llm_wrapper)}")
        logger.info(f"generate_response existe : {hasattr(llm_wrapper, 'generate_response')}")

        try:
            response = llm_wrapper.generate_response(
                user_message,
                rag_context,
                intent,
                history_str or None,
                message.explanation_level
            )
        except TypeError as e:
            logger.error(f"Erreur dans generate_response : {e}", exc_info=True)
            raise

        memory.chat_memory.add_ai_message(response)
        history = [m.content for m in memory.chat_memory.messages]

        await cleanup_old_conversations(request)

        return {
            "response": response,
            "history": history,
            "intent": intent,
            "processing_time": time.time() - start_time
        }
    except HTTPException as e:
        performance_stats['error_count'] += 1
        raise e
    except Exception as e:
        logging.error(f"Erreur dans /chat at {e.__traceback__.tb_lineno}: {str(e)}", exc_info=True)
        performance_stats['error_count'] += 1
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def cleanup_old_conversations(request: Request):
    """Clean up old conversations for GDPR compliance"""
    current_time = time.time()
    expired_users = []

    for user_id, memory in request.app.state.memory_store.items():
        if len(memory.chat_memory.messages) > 50:
            expired_users.append(user_id)

    for user_id in expired_users:
        del request.app.state.memory_store[user_id]

@app.get("/history/{user_id}", dependencies=[Depends(verify_api_key)])
def get_history(request: Request, user_id: str):
    memory = request.app.state.memory_store.get(user_id)
    if not memory:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = [m.content for m in memory.chat_memory.messages]
    return {
        "history": messages,
        "message_count": len(messages),
        "user_id": user_id,
        "conversation_active": True
    }

@app.delete("/history/{user_id}", dependencies=[Depends(verify_api_key)])
def delete_history(request: Request, user_id: str):
    if user_id in request.app.state.memory_store:
        del request.app.state.memory_store[user_id]
        return {"status": "deleted", "user_id": user_id, "message": "Conversation successfully deleted"}
    else:
        return {"status": "not_found", "user_id": user_id, "message": "No conversation found for this user"}

@app.get("/stats")
async def get_stats(request: Request):
    """Get system statistics"""
    return {
        "performance": performance_stats,
        "active_conversations": len(request.app.state.memory_store),
        "rag_system": request.app.state.rag_system.check_status()
    }
