# main.py
# FastAPI entry point. Includes the generic model router and mounts the static directory.

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import project_size_regression, tech_stack_association
from app.config import STATIC_DIR
import os

# Ensure the static directory for saving artifacts exists upon startup
os.makedirs(STATIC_DIR, exist_ok=True)

app = FastAPI(
    title="Modular Machine Learning Microservice",
    description="A scalable API for training and using various ML models.",
    version="2.0.0"
)

# Mount the static directory to serve generated plots and reports.
# You can access them at http://127.0.0.1:8000/static/{filename}
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Include the now-generic router. The prefix makes all model routes
# available under /models/ e.g., /models/project_size_regression/train
app.include_router(project_size_regression.router, prefix="/models", tags=["Machine Learning Models"])
app.include_router(tech_stack_association.router, prefix="/data_mining/tech_stack_association", tags=["Technology Stack Association"])

@app.get("/", tags=["Root"])
async def read_root():
    """A simple root endpoint to confirm the service is running."""
    return {"message": "Welcome to the Modular ML Microservice API. Go to /docs for documentation."}
