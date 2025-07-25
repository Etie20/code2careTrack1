# Chat Backend API

## Authentication
All endpoints require an `X-API-Key` header. The key is defined by the `API_KEY` environment variable.
The service enforces TLS/SSL at the reverse proxy layer for secure transmission and
stores conversation state only in memory to comply with RGPD.  Be sure to set
environment variables (see `.env.example`) before starting the server.

## POST `/chat`
Send a user message and receive a response.  The backend classifies the
intent of the question, retrieves relevant clinical summaries using an
in‑memory retrieval system (RAG) and then generates a final answer with
the configured Hugging Face model (e.g. Mistral) using prompt engineering.

- **Body**: `{ "user_id": "string", "message": "string" }`
- **Response**: `{ "response": "string", "history": ["msg1", "msg2", ...] }`

## GET `/history/{user_id}`
Retrieve conversation history for the user.

## DELETE `/history/{user_id}`
Delete stored conversation for GDPR compliance.

All conversation data is kept only in memory and removed when the backend
restarts. This endpoint allows manual removal at any time.