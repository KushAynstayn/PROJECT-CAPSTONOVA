# app/routes/project_size_regression.py
# FastAPI endpoints that are now scalable to handle multiple models.

from fastapi import APIRouter, HTTPException, Depends
from app.schemas.project_size_regression import (
    TrainingRequest, 
    TrainingResponse, 
    PredictionRequest, 
    PredictionResponse
)
# Import the specific service class
from app.services.project_size_regression_service import ProjectSizeRegressionService
import os

router = APIRouter()

# A model factory function for Dependency Injection.
# This makes the API scalable: to add a new model, you just need to add
# a new service class and an 'elif' block here.
def get_service(model_name: str):
    """
    Acts as a factory to provide the correct service instance based on the
    model name provided in the URL path.
    """
    if model_name == "project_size_regression":
        return ProjectSizeRegressionService()
    # Example for adding another model in the future:
    # elif model_name == "customer_churn_classifier":
    #     return CustomerChurnClassifierService()
    else:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found.")

@router.post("/{model_name}/train", response_model=TrainingResponse)
async def train(
    model_name: str,
    request: TrainingRequest, 
    service: ProjectSizeRegressionService = Depends(get_service) # The type hint can be a base class if you use one
):
    """
    A generic endpoint to train a specified machine learning model.
    The model to be trained is determined by the `model_name` path parameter.
    """
    if not request.data:
        raise HTTPException(status_code=400, detail="No training data provided.")
    
    try:
        result = service.train_model(request)
        # Construct full URLs for the report and plot artifacts
        base_url = "http://127.0.0.1:8000/static/"
        # Safely construct URLs regardless of OS (handles both / and \)
        report_url = base_url + os.path.basename(result['report_path'])
        plot_urls = [base_url + os.path.basename(path) for path in result['plot_paths']]
        
        return TrainingResponse(
            message=result['message'],
            report_url=report_url,
            plots=plot_urls
        )
    except Exception as e:
        # Catch-all for any unexpected errors during the training process
        raise HTTPException(status_code=500, detail=f"An error occurred during training: {str(e)}")


@router.post("/{model_name}/predict", response_model=PredictionResponse)
async def predict(
    model_name: str,
    request: PredictionRequest,
    service: ProjectSizeRegressionService = Depends(get_service)
):
    """
    A generic endpoint to get predictions from a specified trained model.
    The model to use is determined by the `model_name` path parameter.
    """
    if not request.data:
        raise HTTPException(status_code=400, detail="No data provided for prediction.")
        
    try:
        result = service.predict(request)
        return PredictionResponse(predictions=result['predictions'])
    except RuntimeError as e:
        # Specifically catch RuntimeErrors which we raise for missing models
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Catch-all for any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")
