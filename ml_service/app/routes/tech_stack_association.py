# app/routes/tech_stack_association.py
# FastAPI endpoints for the Technology Stack Association model.

from fastapi import APIRouter, HTTPException
from app.schemas.tech_stack_association import (
    AssociationTrainingRequest,
    AssociationTrainingResponse,
    AssociationPredictionResponse,
)
from app.services.tech_stack_association_service import TechStackAssociationService

router = APIRouter()
service = TechStackAssociationService()

@router.post("/train", response_model=AssociationTrainingResponse)
async def train_association_model(request: AssociationTrainingRequest):
    """
    Generates and saves technology stack association rules based on project data.
    """
    if not request.data:
        raise HTTPException(status_code=400, detail="No training data provided.")
    try:
        result = service.generate_rules(request)
        return AssociationTrainingResponse(
            message=result['message'],
            artifact_path=result['artifact_path']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during rule generation: {str(e)}")

@router.get("/predict", response_model=AssociationPredictionResponse)
async def predict_associations():
    """
    Retrieves the pre-generated technology stack association rules.
    """
    try:
        result = service.get_associations()
        return AssociationPredictionResponse(associations=result['associations'])
    except RuntimeError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")