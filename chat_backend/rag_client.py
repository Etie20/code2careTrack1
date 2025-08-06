import os
import requests

RAG_API_URL = os.getenv("RAG_API_URL", "http://localhost:9000/query")


def query_rag(query: str) -> str:
    """Return additional context from the RAG module."""
    try:
        response = requests.post(RAG_API_URL, json={"query": query}, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data.get("content", "")
    except Exception:
        # Fail silently and return empty context
        return ""