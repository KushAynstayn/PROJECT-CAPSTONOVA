# app/schemas/suggestion.py
# Pydantic models for the Cohere AI powered suggestion feature.

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ProjectSuggestionDataPoint(BaseModel):
    """Defines the structure of a single project suggestion."""
    title: str
    suggestion_text: str

class VectorizeAndSaveRequest(BaseModel):
    """The request body for vectorizing and saving data."""
    data: List[ProjectSuggestionDataPoint]

class SuggestionInput(BaseModel):
    """Defines the structure for a new chat-like suggestion."""
    query_text: str

class SuggestedProject(BaseModel):
    """Defines the structure of a single suggested project from Cohere."""
    title: str
    suggestion_text: str

class SuggestionResponse(BaseModel):
    """The response body for an AI-powered suggestion."""
    ai_response: str
    similar_projects: List[SuggestedProject]

# New schemas for the Capstone Idea Generator
class CapstoneIdeaRequest(BaseModel):
    platform: str
    field: str
    additional_note: Optional[str] = None

class CapstoneIdeaResponse(BaseModel):
    ai_response: str