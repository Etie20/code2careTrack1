# Tests

## Unit tests
Run `pytest` to execute unit tests.

## Performance tests
Install `locust` and run:

```bash
locust -f ../tests/performance/locustfile.py --host=http://localhost:8000
```

The provided locust file sends messages to `/chat` to measure throughput of the
Mistral model with RAG integration.

## Postman
Import `tests/postman/chat_collection.json` in Postman to validate the API manually.