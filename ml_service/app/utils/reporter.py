# app/utils/reporter.py
# A generic utility for saving structured JSON reports for training runs.

import json
import os
from typing import Dict, Any
from app.config import STATIC_DIR

class Reporter:
    """
    A reusable class to generate and save JSON reports.
    This utility is model-agnostic.
    """
    def save_report(self, model_name: str, metrics: Dict[str, Any], model_params: Dict[str, Any], data_summary: Dict[str, Any]) -> str:
        """
        Saves a JSON report with training results. Overwrites any existing report
        for the same model name.

        Args:
            model_name (str): The name of the model, used for file naming.
            metrics (dict): A dictionary of performance metrics (e.g., {'MSE': 0.5, 'R2': 0.9}).
            model_params (dict): Parameters of the trained model.
            data_summary (dict): A summary of the training data (e.g., shape, description).

        Returns:
            str: The full path to the saved report file.
        """
        # Define the report path based on the model name
        report_path = os.path.join(STATIC_DIR, f"{model_name}-report.json")
        
        # Structure the content of the report
        report_content = {
            "model_name": model_name,
            "performance_metrics": metrics,
            "model_parameters": model_params,
            "training_data_summary": data_summary
        }
        
        try:
            # Write the report content to a JSON file with pretty printing
            with open(report_path, 'w') as f:
                json.dump(report_content, f, indent=4)
            print(f"Report for '{model_name}' saved successfully to {report_path}")
        except IOError as e:
            print(f"Error saving report for '{model_name}': {e}")
            raise # Propagate the error to the service layer
            
        return report_path
