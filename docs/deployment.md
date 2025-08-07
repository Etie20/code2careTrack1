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

## Environment variables
The chat backend reads several environment variables at startup. You can
define them either on the command line (-e flags) or via a .env file
mounted into the container. The key variables are:

- API_KEY – secret API key required in the X‑API‑Key header.

- HF_API_KEY – your Hugging Face access token to call the inference endpoint.

- HF_LLM_ENDPOINT – the URL of the Hugging Face inference endpoint.
Defaults to the public Mistral 7B instruct endpoint.

- CLINICAL_SUMMARIES_CSV – path to the CSV containing clinical summaries used by the retrieval system. If unset, the backend will look for ```AnalysisBackend/utils/clinical_summaries.csv``` relative to the project root.

See ```.env.example``` at the project root for an example configuration.