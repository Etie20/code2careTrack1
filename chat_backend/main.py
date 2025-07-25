from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from pydantic import BaseModel, validator
from typing import Dict
import os
from dotenv import load_dotenv

from langchain.memory import ConversationBufferMemory

from .intent_classifier import classify_intent
from .llm_wrapper import LLMWrapper
from .rag_system import RAGSystem

app = FastAPI(title="Chat Backend")
app.add_middleware(HTTPSRedirectMiddleware)

load_dotenv()

API_KEY = os.getenv("API_KEY", "secret")

class Message(BaseModel):
    user_id: str
    message: str

    @validator("message")
    def validate_message(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("message must not be empty")
        return v

# In‑memory store for conversations (per user)
memory_store: Dict[str, ConversationBufferMemory] = {}

# Initialise RAG system and LLM wrapper
rag_system = RAGSystem()
llm_wrapper = LLMWrapper(rag_system)

def get_api_key(x_api_key: str = Header(...)) -> str:
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

@app.post("/chat")
def chat(message: Message, api_key: str = Depends(get_api_key)):
    """
    Receive a user message, retrieve context via RAG and generate a response.
    """
    memory = memory_store.setdefault(message.user_id, ConversationBufferMemory())
    # Store user message in memory
    memory.chat_memory.add_user_message(message.message)
    # Classify intention
    intent = classify_intent(message.message)
    # Retrieve relevant context
    rag_context = rag_system.search(message.message, k=3)
    # Rebuild previous messages as history
    history_messages = [m.content for m in memory.chat_memory.messages]
    history_str = "\n".join(history_messages[:-1]) if len(history_messages) > 1 else ""
    # Generate response via LLM
    response = llm_wrapper.generate_response(
        user_message=message.message,
        context=rag_context,
        intent=intent,
        history=history_str if history_str else None,
    )
    # Store AI response in memory
    memory.chat_memory.add_ai_message(response)
    history = [m.content for m in memory.chat_memory.messages]
    return {"response": response, "history": history}

@app.get("/history/{user_id}")
def get_history(user_id: str, api_key: str = Depends(get_api_key)):
    """
    Return the conversation history for a user.
    """
    memory = memory_store.get(user_id)
    if not memory:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"history": [m.content for m in memory.chat_memory.messages]}

@app.delete("/history/{user_id}")
def delete_history(user_id: str, api_key: str = Depends(get_api_key)):
    """
    Delete the stored conversation for a user (GDPR compliance).
    """
    if user_id in memory_store:
        del memory_store[user_id]
    return {"status": "deleted"}
