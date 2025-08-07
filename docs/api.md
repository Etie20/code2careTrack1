# Chat Backend API

## Authentication
All endpoints require an `X-API-Key` header. The key is defined by the `API_KEY` environment variable.

## POST `/chat`
Send a user message and receive a response.
The backend forwards the query to the internal RAG service before generating
the answer with the Mistral model.

- **Body**: `{ "user_id": "string", "message": "string" }`
- **Response**: `{ "response": "string", "history": ["msg1", "msg2", ...] }`

## GET `/history/{user_id}`
Retrieve conversation history for the user.

## DELETE `/history/{user_id}`
Delete stored conversation for GDPR compliance.

All conversation data is kept only in memory and removed when the backend
restarts. This endpoint allows manual removal at any time.