# Medical Chatbot API Documentation

## Overview

The Medical Chatbot API provides a comprehensive interface for medical information retrieval and conversation management. The API supports both text and image inputs, multilingual responses, and GDPR-compliant conversation management.

## Base URL

```
http://localhost:8000
```
## Architecture 
Code2Care/
├── Repo/
│   ├── chat_backend/
│   │   └── intent_classifier 1.py
│   └── AnalysisBackend/
│       └── utils/
│           └── intent_dataset.csv
## Authentication

All endpoints require an API key passed in the `X-API-Key` header:

```
X-API-Key: your_api_key_here
```

## Modèle LLM utilisé

Le backend utilise le modèle **Qwen/Qwen3-Coder-480B-A35B-Instruct** via l'API Hugging Face.

### Pourquoi ce modèle ?
- Excellente prise en charge du **français** et d'autres langues
- Réponses **pertinentes et concises** dans un contexte médical
- Capacité à suivre des instructions complexes (ton, niveau d'explication, etc.)

### Configuration (dans `.env`)
```env
HF_MODEL_NAME=Qwen/Qwen3-Coder-480B-A35B-Instruct

## Endpoints

### 1. Health Check

**GET** `/health`

Check the overall health status of the system.

**Response:**
```json
{
  "status": "healthy",
  "rag_system": "RAG System: Operational with X documents loaded",
  "performance": {
    "total_requests": 0,
    "average_response_time": 0,
    "error_count": 0,
    "ocr_requests": 0,
    "text_requests": 0
  }
}
```

### 2. System Status

**GET** `/status`

Get detailed system status and performance metrics.

**Response:**
```json
{
  "status": "RAG System: Operational with X documents loaded. Performance: {...}",
  "performance": {
    "total_requests": 0,
    "average_response_time": 0,
    "error_count": 0,
    "ocr_requests": 0,
    "text_requests": 0
  },
  "active_conversations": 0
}
```

### 3. Chat

**POST** `/chat`

Send a message to the chatbot. Supports both text and image inputs.

**Request Body:**
```json
{
  "user_id": "string",
  "text": "string (optional)",
  "image": "file (optional)",
  "explanation_level": ["simple", "détaillé"]
}
```

**Notes:**
- Either `text` or `image` must be provided, not both
- `explanation_level` defaults to "simple"
- Image files are processed using OCR to extract text

**Response:**
```json
{
  "response": "string",
  "history": ["string"],
  "intent": "string",
  "processing_time": 0.123
}
```

**Example Requests:**

Text message:
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "text": "J'ai mal à la tête",
    "explanation_level": "simple"
  }'
```

Image message:
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "X-API-Key: your_key" \
  -F "user_id=user123" \
  -F "image=@medical_report.jpg" \
  -F "explanation_level=détaillé"
```

### 4. Get Conversation History

**GET** `/history/{user_id}`

Retrieve the conversation history for a specific user.

**Response:**
```json
{
  "history": ["string"],
  "message_count": 5,
  "user_id": "user123",
  "conversation_active": true
}
```

### 5. Delete Conversation History

**DELETE** `/history/{user_id}`

Delete the conversation history for a specific user (GDPR compliance).

**Response:**
```json
{
  "status": "deleted",
  "user_id": "user123",
  "message": "Conversation successfully deleted"
}
```

### 6. System Statistics

**GET** `/stats`

Get comprehensive system statistics and performance metrics.

**Response:**
```json
{
  "performance": {
    "total_requests": 0,
    "average_response_time": 0,
    "error_count": 0,
    "ocr_requests": 0,
    "text_requests": 0
  },
  "active_conversations": 0,
  "rag_system": "RAG System: Operational with X documents loaded. Performance: {...}"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "No text or image provided"
}
```

### 404 Not Found
```json
{
  "detail": "Conversation not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error: Error description"
}
```

## Performance Headers

All responses include performance headers:

- `X-Process-Time`: Processing time in seconds

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are configurable and enforced per user.

## GDPR Compliance

- All conversation data is stored in volatile memory only
- Conversations are automatically cleaned up after 50 messages
- Users can manually delete their conversation history
- No persistent storage of sensitive medical information

## Multilingual Support

The API automatically detects the language of input messages and responds in the same language:
- French (fr)
- English (en)

## Image Processing

Supported image formats:
- JPEG
- PNG
- BMP
- TIFF

OCR processing extracts text from medical documents, prescriptions, and handwritten notes.

## Testing

### Load Testing

Use the provided Locust file for performance testing:

```bash
locust -f tests/performance/locustfile.py --host=http://localhost:8000
```

### Unit Testing

Run the test suite:

```bash
pytest tests/test_chat.py -v
```

## Environment Variables

Required environment variables:

- `API_KEY`: API authentication key
- `HF_API_KEY`: Hugging Face API key for LLM access
- `HF_LLM_ENDPOINT`: Hugging Face model endpoint
- `CLINICAL_SUMMARIES_CSV`: Path to clinical data CSV file

## Performance Metrics

The API tracks the following metrics:

- Total requests processed
- Average response time
- Error count
- OCR request count
- Text request count
- Cache hit/miss ratios
- RAG system performance

## Security Considerations

- All endpoints require API key authentication
- Input validation prevents malicious content
- Medical content safety checks
- GDPR-compliant data handling
- No persistent storage of sensitive data 