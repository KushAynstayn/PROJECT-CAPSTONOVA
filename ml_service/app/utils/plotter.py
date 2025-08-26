# app/utils/plotter.py
# A generic utility for creating and saving model evaluation plots.

import os
import time
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from app.config import STATIC_DIR

class Plotter:
    """
    A reusable class for generating and saving various types of plots.
    This utility is model-agnostic.
    """
    def __init__(self):
        """Initializes the Plotter with a standard theme."""
        sns.set_theme(style="whitegrid")

    def _get_filepath(self, model_name: str, chart_type: str) -> str:
        """
        Generates a unique, timestamped filepath for a plot to prevent overwrites.

        Args:
            model_name (str): The name of the model, used for file naming.
            chart_type (str): A descriptive name for the chart (e.g., 'residual_plot').

        Returns:
            str: The full path where the plot image will be saved.
        """
        timestamp = int(time.time())
        filename = f"{model_name}__{timestamp}-{chart_type}.png"
        return os.path.join(STATIC_DIR, filename)

    def plot_residuals(self, y_true: pd.Series, y_pred: pd.Series, model_name: str, title: str, xlabel: str, ylabel: str) -> str:
        """
        Generates and saves a scatter plot of actual vs. predicted values,
        a standard plot for evaluating regression models.

        Args:
            y_true (pd.Series): The actual target values.
            y_pred (pd.Series): The predicted values from the model.
            model_name (str): The name of the model for file naming.
            title (str): The title for the plot.
            xlabel (str): The label for the x-axis.
            ylabel (str): The label for the y-axis.

        Returns:
            str: The path to the saved plot image.
        """
        filepath = self._get_filepath(model_name, "residuals")
        plt.figure(figsize=(10, 6))
        
        sns.scatterplot(x=y_true, y=y_pred, alpha=0.7)
        
        # Add a diagonal line representing perfect predictions (y_true = y_pred)
        p1 = max(y_true.max(), y_pred.max())
        p2 = min(y_true.min(), y_pred.min())
        plt.plot([p1, p2], [p1, p2], 'r--')
        
        plt.title(title, fontsize=16)
        plt.xlabel(xlabel, fontsize=12)
        plt.ylabel(ylabel, fontsize=12)
        
        plt.savefig(filepath)
        plt.close() # Close the plot to free up memory
        print(f"Plot saved to {filepath}")
        return filepath

    def plot_feature_importance(self, importances: pd.Series, model_name: str, title: str, xlabel: str, ylabel: str) -> str:
        """
        Generates and saves a horizontal bar plot of feature importances.

        Args:
            importances (pd.Series): A pandas Series with feature names as the index
                                     and their importance scores as values.
            model_name (str): The name of the model for file naming.
            title (str): The title for the plot.
            xlabel (str): The label for the x-axis.
            ylabel (str): The label for the y-axis.

        Returns:
            str: The path to the saved plot image.
        """
        filepath = self._get_filepath(model_name, "feature_importance")
        plt.figure(figsize=(12, 8))
        
        # Sort values to display the most important features at the top
        importances.sort_values(ascending=True).plot(kind='barh')
        
        plt.title(title, fontsize=16)
        plt.xlabel(xlabel, fontsize=12)
        plt.ylabel(ylabel, fontsize=12)
        plt.tight_layout() # Adjust layout to prevent labels from being cut off
        
        plt.savefig(filepath)
        plt.close()
        print(f"Plot saved to {filepath}")
        return filepath
