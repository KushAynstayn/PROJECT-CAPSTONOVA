# app/schemas/tech_stack_association.py
# Pydantic models for request and response validation for the Technology Stack Association model.

from pydantic import BaseModel, Field
from typing import List, Dict, Any

class TechStackDataPoint(BaseModel):
    """Defines the structure of a single data point for training the association model."""
    project_id: int
    platform_type: str
    languages: List[str]

class AssociationTrainingRequest(BaseModel):
    """The complete request body for the /train endpoint of the association model."""
    data: List[TechStackDataPoint]

class PopularCombination(BaseModel):
    """Describes a popular combination of technologies."""
    if_using: List[str]
    then_add: List[str]
    confidence: float
    lift: float

class PlatformTechStack(BaseModel):
    """Describes the technology stack for a specific platform."""
    core_stack: List[str]
    popular_combinations: List[PopularCombination]

class AssociationPredictionResponse(BaseModel):
    """The structured JSON response for a prediction request."""
    associations: Dict[str, PlatformTechStack]

class AssociationTrainingResponse(BaseModel):
    """The response after a successful training run for the association model."""
    message: str
    artifact_path: str