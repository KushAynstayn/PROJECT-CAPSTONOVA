# app/routes/suggestion.py
# FastAPI endpoints for Cohere AI powered suggestions.

from fastapi import APIRouter, HTTPException, Depends
from app.schemas.suggestion import CapstoneIdeaRequest, CapstoneIdeaResponse, VectorizeAndSaveRequest, SuggestionInput, SuggestedProject, SuggestionResponse
from app.services.suggestion_service import SuggestionService
from typing import List

router = APIRouter()
service = SuggestionService()

@router.post("/vectorize-and-save")
async def vectorize_and_save_data(request: VectorizeAndSaveRequest):
    """
    Vectorizes a provided dataset using Cohere and saves it for later use.
    This endpoint is intended to be called by Laravel.
    """
    if not request.data:
        raise HTTPException(status_code=400, detail="No data provided for vectorization.")
    try:
        message = service.vectorize_and_save(request)
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during vectorization: {str(e)}")

@router.post("/suggest", response_model=SuggestionResponse)
async def get_suggestion(request: SuggestionInput):
    """
    Receives a chat-like suggestion, finds similar projects, and uses Cohere to
    generate a new AI-powered suggestion based on context.
    """
    if not request.query_text:
        raise HTTPException(status_code=400, detail="No query text provided for suggestion.")
    try:
        result = service.get_ai_suggestions(request)
        
        # Format the similar projects into the response schema
        formatted_projects = [SuggestedProject(title=p['title'], suggestion_text=p['suggestion_text']) for p in result['similar_projects']]
        
        return SuggestionResponse(
            ai_response=result['ai_response'],
            similar_projects=formatted_projects
        )
    except RuntimeError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating suggestions: {str(e)}")

# New route for generating capstone ideas
@router.post("/generate-idea", response_model=CapstoneIdeaResponse)
async def generate_idea(request: CapstoneIdeaRequest):
    """
    Generates a capstone project idea based on a specified platform, field,
    and an optional additional note, returning a conversational text response.
    """
    if not request.platform or not request.field:
        raise HTTPException(status_code=400, detail="Platform and field are required.")
    
    try:
        result = service.generate_capstone_idea(request)
        return CapstoneIdeaResponse(ai_response=result['ai_response'])
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")