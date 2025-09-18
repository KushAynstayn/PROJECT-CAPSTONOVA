# app/services/suggestion_service.py
# Service layer for handling Cohere API interactions and suggestions.

import cohere
import os
import joblib
import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity
from app.schemas.suggestion import VectorizeAndSaveRequest, SuggestionInput
from app.config import COHERE_API_KEY, SAVED_MODELS_DIR

class SuggestionService:
    """
    Service to handle vectorization, storage, and AI-powered suggestions
    using the Cohere API.
    """
    def __init__(self):
        if not COHERE_API_KEY:
            raise ValueError("COHERE_API_KEY is not set in environment variables.")
        self.cohere_client = cohere.Client(COHERE_API_KEY)
        self.model_name = "cohere_suggestions"
        self.vector_artifact_path = os.path.join(SAVED_MODELS_DIR, f"{self.model_name}_vectors.joblib")
        self.data_artifact_path = os.path.join(SAVED_MODELS_DIR, f"{self.model_name}_data.joblib")

    def vectorize_and_save(self, payload: VectorizeAndSaveRequest) -> str:
        """
        Vectorizes a list of titles and suggestions using Cohere and saves them to disk.
        """
        if not payload.data:
            raise ValueError("No data provided for vectorization.")

        texts = [item.title + " " + item.suggestion_text for item in payload.data]
        
        # Cohere API call for embeddings
        response = self.cohere_client.embed(
            texts=texts,
            model='embed-english-v3.0',
            input_type='search_document'
        )
        vectors = np.array(response.embeddings)
        
        # Save the vectors and original data
        joblib.dump(vectors, self.vector_artifact_path)
        joblib.dump([item.model_dump() for item in payload.data], self.data_artifact_path)

        return f"Successfully vectorized and saved {len(texts)} data points."

    def get_ai_suggestions(self, payload: SuggestionInput) -> Dict[str, Any]:
        """
        Finds similar suggestions from the saved vectors and uses them as context for Cohere chat.
        """
        # Load saved vectors and data
        if not os.path.exists(self.vector_artifact_path) or not os.path.exists(self.data_artifact_path):
            raise RuntimeError("Vectorized data not found. Please vectorize and save data first.")
        
        vectors = joblib.load(self.vector_artifact_path)
        data = joblib.load(self.data_artifact_path)

        # Vectorize the user's query
        query_vector_response = self.cohere_client.embed(
            texts=[payload.query_text],
            model='embed-english-v3.0',
            input_type='search_query'
        )
        query_vector = np.array(query_vector_response.embeddings).reshape(1, -1)

        # Calculate cosine similarity and find the most similar matches
        similarities = cosine_similarity(query_vector, vectors)[0]
        top_indices = similarities.argsort()[-3:][::-1] # Get top 3 most similar

        # Build context from similar projects
        similar_projects = [data[i] for i in top_indices]
        context_string = "Here are some similar projects:\n\n"
        for proj in similar_projects:
            context_string += f"Title: {proj['title']}\nSuggestion: {proj['suggestion_text']}\n\n"
        
        # Use Cohere Chat to generate a response based on the context
        chat_response = self.cohere_client.chat(
            message=f"Based on the following context, can you provide a detailed suggestion for a new project related to '{payload.query_text}'? The suggestion should be in a chat-like format. The response should be a list of titles and suggestions.\n\nContext:\n{context_string}",
            model="command-a-03-2025", # Updated model to a newer version as requested
            chat_history=[
                {"role": "user", "text": payload.query_text},
            ],
        )

        return {
            "ai_response": chat_response.text,
            "similar_projects": similar_projects
        }