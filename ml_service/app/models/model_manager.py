# app/models/model_manager.py
# Handles saving and loading of trained models and their associated artifacts.

import os
import joblib
import json
from typing import Any, List, Tuple, Dict
from app.config import SAVED_MODELS_DIR

def save_model_artifacts(model: Any, columns: List[str], model_name: str):
    """
    Saves the trained model and its feature columns to disk, organized by model name.

    Args:
        model (Any): The trained scikit-learn compatible model object.
        columns (List[str]): The list of feature columns used for training.
        model_name (str): The unique name for the model (e.g., 'project_size_regression').
    """
    # Define paths for the model and columns files based on the model_name
    model_path = os.path.join(SAVED_MODELS_DIR, f"{model_name}.joblib")
    columns_path = os.path.join(SAVED_MODELS_DIR, f"{model_name}_columns.json")
    
    try:
        # Save the model object using joblib for efficient serialization
        joblib.dump(model, model_path)
        print(f"Model '{model_name}' saved to {model_path}")
        
        # Save the list of feature columns as a JSON file
        joblib.dump(columns, columns_path)
        print(f"Model columns for '{model_name}' saved to {columns_path}")
        
    except Exception as e:
        print(f"Error saving model '{model_name}': {e}")
        # Re-raise the exception to be handled by the calling service
        raise

def load_model_artifacts(model_name: str) -> Tuple[Any, List[str]]:
    """
    Loads a trained model and its feature columns from disk.

    Args:
        model_name (str): The name of the model to load.

    Returns:
        A tuple containing the loaded model object and the list of feature columns.
        Returns (None, []) if the model or columns file cannot be found.
    """
    # Define paths based on the model_name
    model_path = os.path.join(SAVED_MODELS_DIR, f"{model_name}.joblib")
    columns_path = os.path.join(SAVED_MODELS_DIR, f"{model_name}_columns.json")

    # Check if both the model and columns files exist before attempting to load
    if not os.path.exists(model_path) or not os.path.exists(columns_path):
        print(f"Model or columns file for '{model_name}' not found.")
        return None, []
        
    try:
        # Load the model and columns from their respective files
        model = joblib.load(model_path)
        columns = joblib.load(columns_path)
        print(f"Model '{model_name}' loaded from {model_path}")
        return model, columns
    except Exception as e:
        print(f"Error loading model '{model_name}': {e}")
        return None, []


def save_json_artifact(data: Dict[str, Any], model_name: str) -> str:
    """
    Saves a JSON artifact to disk.

    Args:
        data (Dict[str, Any]): The dictionary to save as JSON.
        model_name (str): The name of the model for file naming.

    Returns:
        str: The path to the saved JSON file.
    """
    artifact_path = os.path.join(SAVED_MODELS_DIR, f"{model_name}_rules.json")
    try:
        with open(artifact_path, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"JSON artifact for '{model_name}' saved to {artifact_path}")
        return artifact_path
    except IOError as e:
        print(f"Error saving JSON artifact for '{model_name}': {e}")
        raise


def load_json_artifact(model_name: str) -> Dict[str, Any]:
    """
    Loads a JSON artifact from disk.

    Args:
        model_name (str): The name of the model to load.

    Returns:
        Dict[str, Any]: The loaded dictionary from the JSON file.
    """
    artifact_path = os.path.join(SAVED_MODELS_DIR, f"{model_name}_rules.json")
    if not os.path.exists(artifact_path):
        print(f"JSON artifact for '{model_name}' not found.")
        return {}
    try:
        with open(artifact_path, 'r') as f:
            data = json.load(f)
        print(f"JSON artifact for '{model_name}' loaded from {artifact_path}")
        return data
    except (IOError, json.JSONDecodeError) as e:
        print(f"Error loading JSON artifact for '{model_name}': {e}")
        return {}