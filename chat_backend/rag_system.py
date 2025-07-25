"""
Simple Retrieval‑Augmented Generation (RAG) system for the medical chatbot.

This module loads clinical summaries from a CSV file and provides a basic
retrieval mechanism to return relevant snippets given a user query.  The goal
is to supply additional context to the language model without requiring an
external vector database.  It operates entirely in memory to avoid
persistent storage of sensitive data.

CSV Format
----------
The expected CSV should contain at least a ``summary_text`` column with
free‑text descriptions of clinical cases or public medical information.  Any
missing or empty summaries are ignored.  Other columns are not used.

Environment Variables
---------------------
``CLINICAL_SUMMARIES_CSV`` may be set to override the default CSV location.
If not set, the loader attempts to locate the file under
``AnalysisBackend/utils/clinical_summaries.csv`` relative to the project root.

Usage
-----
. code:: python

    from rag_system import RAGSystem
    rag = RAGSystem()  # automatically loads the CSV
    context = rag.search("What is malaria?", k=3)

``search`` returns a single string containing the top ``k`` matching
summaries joined by newlines.  If no matches are found the string will be
empty.
"""

from __future__ import annotations

import csv
import os
import re
from typing import List, Tuple


class RAGSystem:
    """In‑memory retrieval system for clinical summaries."""

    def __init__(self, csv_path: str | None = None) -> None:
        if csv_path is None:
            csv_path = os.environ.get("CLINICAL_SUMMARIES_CSV")
        if csv_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            candidate = os.path.join(base_dir, "AnalysisBackend", "utils", "clinical_summaries.csv")
            if os.path.exists(candidate):
                csv_path = candidate
            else:
                raise FileNotFoundError(
                    "No clinical summaries CSV found. Set CLINICAL_SUMMARIES_CSV or place the file in AnalysisBackend/utils.")

        self.records: List[Tuple[str, set[str]]] = []
        self._word_re = re.compile(r"\b\w+\b", re.UNICODE)
        self._load_csv(csv_path)

    def _load_csv(self, path: str) -> None:
        try:
            with open(path, newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    text = (row.get("summary_text") or "").strip()
                    if not text:
                        continue
                    tokens = set(self._tokenize(text))
                    self.records.append((text, tokens))
        except Exception as exc:
            raise RuntimeError(f"Failed to load clinical summaries from {path}: {exc}")

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in self._word_re.findall(text)]

    @staticmethod
    def _score(query_tokens: set[str], tokens: set[str]) -> int:
        return len(query_tokens & tokens)

    def search(self, query: str, k: int = 3) -> str:
        query_tokens = set(self._tokenize(query))
        if not query_tokens:
            return ""
        scored: List[Tuple[int, str]] = []
        for text, tokens in self.records:
            score = self._score(query_tokens, tokens)
            if score > 0:
                scored.append((score, text))
        if not scored:
            return ""
        scored.sort(key=lambda s: s[0], reverse=True)
        top_texts = [text for _, text in scored[:k]]
        return "\n".join(top_texts)


__all__ = ["RAGSystem"]
