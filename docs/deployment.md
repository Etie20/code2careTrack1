# Deployment Instructions

## Build Docker Image

```bash
docker build -t chat-backend .
```

## Run Container

```bash
docker run -e API_KEY=mysecret -p 8000:8000 chat-backend
```

The service will be available at `http://localhost:8000`.