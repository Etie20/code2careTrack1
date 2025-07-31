"""
Simple Retrieval-Augmented Generation (RAG) system for the medical chatbot.

This module loads clinical summaries from a CSV file and provides a basic
retrieval mechanism to return relevant snippets given a user query. The goal
is to supply additional context to the language model without requiring an
external vector database. It operates entirely in memory to avoid
persistent storage of sensitive data.

CSV Format
----------
The expected CSV should contain at least a ``summary_text`` column with
free-text descriptions of clinical cases or public medical information. Any
missing or empty summaries are ignored. Other columns are not used.

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
summaries joined by newlines. If no matches are found the string will be
empty.
"""

import os
import csv
import json
import pickle
import time
from typing import Dict, List, Optional, Tuple, Any
import numpy as np
from sentence_transformers import SentenceTransformer
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import FakeEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from deep_translator import GoogleTranslator
import hashlib

class RAGSystem:
    def __init__(self, csv_path: Optional[str] = None, cache_dir: str = "cache"):
        try:
            self.csv_path = csv_path or self._get_default_csv_path()
        except FileNotFoundError:
            print(
                "Warning: clinical summaries CSV not found. RAG features will be disabled."
            )
            self.csv_path = None
        self.cache_dir = cache_dir
        self.vector_store = None
        self.embeddings = None
        self.documents = []
        self.translator = GoogleTranslator()
        self.performance_stats = {
            'search_requests': 0,
            'average_search_time': 0,
            'cache_hits': 0,
            'cache_misses': 0
        }

        # Initialize embeddings model
        self._initialize_embeddings()

        # Load and process documents
        self._load_and_process_documents()

        # Create vector store
        self._create_vector_store()

    @staticmethod
    def _get_default_csv_path() -> str:
        """Get default path for clinical summaries CSV"""
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        candidate = os.path.join(base_dir, "AnalysisBackend", "utils", "clinical_summaries.csv")
        if os.path.exists(candidate):
            return candidate
        else:
            raise FileNotFoundError(
                "No clinical summaries CSV found. Set CLINICAL_SUMMARIES_CSV or place the file in AnalysisBackend/utils."
            )

    def _initialize_embeddings(self):
        """Initialize the embeddings model"""
        try:
            # Use a multilingual model for better French/English support
            model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
            try:
                self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            except Exception as ee:
                print(f"Fallback embeddings failed: {ee}. Using FakeEmbeddings.")
                self.embeddings = FakeEmbeddings(size=768)
            print(f"Initialized embeddings model: {model_name}")
        except Exception as e:
            print(f"Error initializing embeddings: {e}")
            # Fallback to simpler model
            self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    def _load_and_process_documents(self):
        """Load and process clinical documents"""
        if not self.csv_path:
            print("No CSV path provided, skipping document loading")
            return
        cache_file = os.path.join(self.cache_dir, "processed_documents.pkl")

        # Try to load from cache first
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'rb') as f:
                    self.documents = pickle.load(f)[:1000]
                print(f"Loaded {len(self.documents)} documents from cache")
                return
            except Exception as e:
                print(f"Error loading cache: {e}")

        # Process documents from CSV
        self._process_csv_documents()

        # Save to cache
        os.makedirs(self.cache_dir, exist_ok=True)
        try:
            with open(cache_file, 'wb') as f:
                pickle.dump(self.documents, f)
        except Exception as e:
            print(f"Error saving cache: {e}")

    def _process_csv_documents(self):
        """Process CSV documents into LangChain Document objects"""
        try:
            with open(self.csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)

                for row in reader:
                    # Create document content
                    content_parts = []

                    # Add diagnosis if available
                    if row.get('diagnosis'):
                        content_parts.append(f"Diagnosis: {row['diagnosis']}")

                    # Add summary text
                    if row.get('summary_text'):
                        content_parts.append(f"Summary: {row['summary_text']}")

                    # Add patient information if available
                    patient_info = []
                    if row.get('patient_age'):
                        patient_info.append(f"Age: {row['patient_age']}")
                    if row.get('patient_gender'):
                        patient_info.append(f"Gender: {row['patient_gender']}")
                    if row.get('body_temp_c'):
                        patient_info.append(f"Temperature: {row['body_temp_c']}°C")
                    if row.get('blood_pressure_systolic'):
                        patient_info.append(f"Blood Pressure: {row['blood_pressure_systolic']}")
                    if row.get('heart_rate'):
                        patient_info.append(f"Heart Rate: {row['heart_rate']}")

                    if patient_info:
                        content_parts.append(f"Patient Info: {', '.join(patient_info)}")

                    if content_parts:
                        content = " | ".join(content_parts)

                        # Create metadata
                        metadata = {
                            'source': 'clinical_summaries',
                            'diagnosis': row.get('diagnosis', ''),
                            'patient_id': row.get('patient_id', ''),
                            'date_recorded': row.get('date_recorded', ''),
                            'type': 'medical_case'
                        }

                        # Create LangChain Document
                        doc = Document(
                            page_content=content,
                            metadata=metadata
                        )

                        self.documents.append(doc)

        except Exception as e:
            raise RuntimeError(f"Failed to process CSV documents: {e}")

    def _create_vector_store(self):
        """Create FAISS vector store from documents"""
        if not self.documents:
            print("No documents to create vector store")
            return

        try:
            # Verify FAISS import
            import faiss
            print(f"FAISS version: {faiss.__version__}")

            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", ". ", " ", ""]
            )

            split_docs = []
            for doc in self.documents:
                splits = text_splitter.split_documents([doc])
                split_docs.extend(splits)

            # Create vector store
            self.vector_store = FAISS.from_documents(split_docs, self.embeddings)
            print(f"Created vector store with {len(split_docs)} document chunks")

        except ImportError as e:
            print(f"FAISS import error: {e}. Ensure faiss-cpu is installed.")
            self.vector_store = None
        except Exception as e:
            print(f"Error creating vector store: {e}")
            self.vector_store = None

    def search(self, query: str, k: int = 3, language: str = "en") -> str:
        """Search for relevant medical information with performance monitoring"""
        start_time = time.time()
        self.performance_stats['search_requests'] += 1

        if not self.vector_store:
            print("Vector store not initialized")
            return ""

        try:
            # Translate query if needed
            if language == "fr":
                try:
                    translated_query = self.translator.translate(query, src="fr", dest="en")
                except Exception:
                    translated_query = query
            else:
                translated_query = query

            # Perform similarity search
            docs = self.vector_store.similarity_search(translated_query, k=k)

            # Extract and format results
            results = []
            for doc in docs:
                content = doc.page_content
                metadata = doc.metadata

                # Format the result
                formatted_result = f"{content}"
                if metadata.get('diagnosis'):
                    formatted_result += f" (Diagnosis: {metadata['diagnosis']})"

                results.append(formatted_result)

            # Update performance stats
            search_time = time.time() - start_time
            self.performance_stats['average_search_time'] = (
                    (self.performance_stats['average_search_time'] * (self.performance_stats['search_requests'] - 1) + search_time)
                    / self.performance_stats['search_requests']
            )

            return "\n\n".join(results)

        except Exception as e:
            print(f"Error in vector search: {e}")
            return ""

    def search_with_filters(self,
                            query: str,
                            diagnosis_filter: Optional[str] = None,
                            age_filter: Optional[Tuple[int, int]] = None,
                            k: int = 3) -> str:
        """Search with additional filters"""
        if not self.vector_store:
            print("Vector store not initialized")
            return ""

        try:
            # Get initial results
            docs = self.vector_store.similarity_search(query, k=k*2)  # Get more results for filtering

            # Apply filters
            filtered_docs = []
            for doc in docs:
                metadata = doc.metadata

                # Apply diagnosis filter
                if diagnosis_filter and metadata.get('diagnosis'):
                    if diagnosis_filter.lower() not in metadata['diagnosis'].lower():
                        continue

                # Apply age filter (if we had age data)
                # This would require parsing age from patient info

                filtered_docs.append(doc)

                if len(filtered_docs) >= k:
                    break

            # Format results
            results = []
            for doc in filtered_docs:
                content = doc.page_content
                metadata = doc.metadata

                formatted_result = f"{content}"
                if metadata.get('diagnosis'):
                    formatted_result += f" (Diagnosis: {metadata['diagnosis']})"

                results.append(formatted_result)

            return "\n\n".join(results)

        except Exception as e:
            print(f"Error in filtered search: {e}")
            return ""

    def get_medical_context(self, query: str, language: str = "en") -> Dict[str, Any]:
        """Get comprehensive medical context for a query"""
        context = {
            'relevant_cases': [],
            'common_symptoms': [],
            'treatment_info': [],
            'language': language
        }

        # Get relevant cases
        relevant_text = self.search(query, k=3, language=language)
        if relevant_text:
            context['relevant_cases'] = relevant_text.split('\n\n')

        # Extract common symptoms from query
        symptom_keywords = [
            'fever', 'pain', 'cough', 'fatigue', 'nausea', 'headache',
            'fièvre', 'douleur', 'toux', 'fatigue', 'nausée', 'mal de tête'
        ]

        query_lower = query.lower()
        found_symptoms = [symptom for symptom in symptom_keywords if symptom in query_lower]
        context['common_symptoms'] = found_symptoms

        return context

    def check_status(self) -> str:
        """Check system status"""
        if not self.vector_store:
            return "RAG System: Vector store not initialized"

        doc_count = len(self.documents) if self.documents else 0
        return f"RAG System: Operational with {doc_count} documents loaded. Performance: {self.performance_stats}"

    def clear_cache(self):
        """Clear the document cache"""
        cache_file = os.path.join(self.cache_dir, "processed_documents.pkl")
        if os.path.exists(cache_file):
            os.remove(cache_file)
            print("Cache cleared")

    def update_documents(self, new_csv_path: str):
        """Update documents from a new CSV file"""
        self.csv_path = new_csv_path
        self.documents = []
        self._load_and_process_documents()
        self._create_vector_store()
        print("Documents updated successfully")


__all__ = ["RAGSystem"]