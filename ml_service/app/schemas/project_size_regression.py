# app/schemas/project_size_regression.py
# Pydantic models for request and response validation.

from pydantic import BaseModel
from typing import List, Optional

# --- Request Schemas ---

class TrainingDataPoint(BaseModel):
    """Defines the structure of a single data point for training."""
    submission_year: int
    platform_type: str
    language_count: int
    framework_ratio: float
    project_size: float  # The target variable (Y)

class TrainingRequest(BaseModel):
    """The complete request body for the /train endpoint."""
    data: List[TrainingDataPoint]

class PredictionInput(BaseModel):
    """Defines the structure for a single prediction request."""
    submission_year: int
    platform_type: str
    language_count: int
    framework_ratio: float

class PredictionRequest(BaseModel):
    """The complete request body for the /predict endpoint."""
    data: List[PredictionInput]

# --- Response Schemas ---

class TrainingResponse(BaseModel):
    """The response after a successful training run."""
    message: str
    report_url: str
    plots: List[str]

class PredictionResponse(BaseModel):
    """The response for a prediction request."""
    predictions: List[float]
