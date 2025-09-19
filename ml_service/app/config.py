# app/config.py
# Central configuration file for paths and settings.

import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Define the base directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Define directories for saved models and static files (outputs)
SAVED_MODELS_DIR = os.path.join(BASE_DIR, 'saved_models')
STATIC_DIR = os.path.join(BASE_DIR, 'static')

# Ensure directories exist
os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

# Cohere API Key from environment variables
COHERE_API_KEY = os.getenv("COHERE_API_KEY")