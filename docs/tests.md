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

## Metric evaluation
An example script to compute BLEU and ROUGE‑L scores on generated
responses is provided in tests/metrics/evaluate_bleu_rouge.py. Run it
with a reference text and a candidate text as arguments to obtain
simple quality metrics:
```bash
python tests/metrics/evaluate_bleu_rouge.py "reference answer" "generated answer"
```
This script uses basic tokenization via NLTK. For rigorous evaluation in
a production context, consider libraries such as ```rouge_score``` or
```sacrebleu```, and incorporate domain expert review.
