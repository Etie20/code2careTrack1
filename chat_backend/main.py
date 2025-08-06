from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from pydantic import BaseModel, validator
from typing import Dict, List, Optional
import os

from langchain.memory import ConversationBufferMemory
from langchain.llms.base import LLM

from rag_client import query_rag

app = FastAPI(title="Chat Backend")
app.add_middleware(HTTPSRedirectMiddleware)

API_KEY = os.getenv("API_KEY", "secret")

class Message(BaseModel):
    user_id: str
    message: str

    @validator("message")
    def validate_message(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("message must not be empty")
        return v


memory_store: Dict[str, ConversationBufferMemory] = {}



class MistralLLM(LLM):
    def _call(self, prompt: str, stop: Optional[List[str]] = None, **kwargs) -> str:
        # Placeholder for real Mistral inference
        return f"Mistral: {prompt}"

    @property
    def _llm_type(self) -> str:
        return "mistral"

mistral_llm = MistralLLM()

def get_api_key(x_api_key: str = Header(...)) -> str:
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

@app.post("/chat")
def chat(message: Message, api_key: str = Depends(get_api_key)):
    memory = memory_store.setdefault(message.user_id, ConversationBufferMemory())
    memory.chat_memory.add_user_message(message.message)

    rag_context = query_rag(message.message)
    prompt = f"{memory.buffer}\nUser: {message.message}\nContext: {rag_context}"

    response = mistral_llm(prompt)
    memory.chat_memory.add_ai_message(response)
    history = [m.content for m in memory.chat_memory.messages]
    return {"response": response, "history": history}

@app.get("/history/{user_id}")
def get_history(user_id: str, api_key: str = Depends(get_api_key)):
    memory = memory_store.get(user_id)
    if not memory:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"history": [m.content for m in memory.chat_memory.messages]}

@app.delete("/history/{user_id}")
def delete_history(user_id: str, api_key: str = Depends(get_api_key)):
    if user_id in memory_store:
        del memory_store[user_id]
    return {"status": "deleted"}