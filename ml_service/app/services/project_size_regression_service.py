# app/services/project_size_regression_service.py
# Service layer containing the specific business logic for the project size regression model.

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from app.schemas.project_size_regression import TrainingRequest, PredictionRequest
from app.utils.data_preprocessing import convert_to_dataframe, separate_features_target, encode_categorical_features
from app.utils.reporter import Reporter
from app.utils.plotter import Plotter
from app.models.model_manager import save_model_artifacts, load_model_artifacts

class ProjectSizeRegressionService:
    """
    This service class encapsulates all logic for training and predicting
    project sizes. It uses the generic utilities for common tasks.
    """
    def __init__(self):
        # Instantiate the generic utilities
        self.reporter = Reporter()
        self.plotter = Plotter()
        # Define model-specific configurations
        self.model_name = "project_size_regression"
        self.target_column = "project_size"

    def train_model(self, training_payload: TrainingRequest) -> dict:
        """
        Trains the regression model, saves it, and generates all evaluation outputs.
        """
        # 1. Convert request data to a DataFrame using the generic utility
        df = convert_to_dataframe(training_payload.data)

        # 2. Preprocess data for training
        X, y = separate_features_target(df, self.target_column)
        X_processed = encode_categorical_features(X)
        feature_columns = X_processed.columns.tolist()

        # 3. Train the RandomForestRegressor model
        model = RandomForestRegressor(n_estimators=100, random_state=42, oob_score=True)
        model.fit(X_processed, y)

        # 4. Save the model and columns using the generic model manager
        save_model_artifacts(model=model, columns=feature_columns, model_name=self.model_name)

        # 5. Evaluate the model on the training data
        predictions_array = model.predict(X_processed)
        predictions = pd.Series(predictions_array, index=y.index)
        
        metrics = {
            "Mean Squared Error": mean_squared_error(y, predictions),
            "R2 Score": r2_score(y, predictions),
            "Out-of-Bag Score": model.oob_score_
        }

        # 6. Save a detailed report using the generic reporter
        report_path = self.reporter.save_report(
            model_name=self.model_name,
            metrics=metrics,
            model_params=model.get_params(),
            data_summary={"shape": tuple(df.shape), "description": df.describe().to_dict()}
        )

        # 7. Generate and save plots using the generic plotter
        plot_paths = []
        plot_paths.append(self.plotter.plot_residuals(
            y, predictions, model_name=self.model_name,
            title='Actual vs. Predicted Project Size',
            xlabel='Actual Size (MB)',
            ylabel='Predicted Size (MB)'
        ))
        
        importances = pd.Series(model.feature_importances_, index=feature_columns)
        plot_paths.append(self.plotter.plot_feature_importance(
            importances, model_name=self.model_name,
            title='Feature Importance',
            xlabel='Importance',
            ylabel='Feature'
        ))
        
        return {
            "message": "Model trained successfully!",
            "report_path": report_path,
            "plot_paths": plot_paths
        }

    def predict(self, prediction_payload: PredictionRequest) -> dict:
        """
        Makes predictions on new data using the saved model.
        """
        # 1. Load the model and feature columns using the generic model manager
        model, feature_columns = load_model_artifacts(self.model_name)
        if model is None:
            raise RuntimeError(f"Model '{self.model_name}' not found. Please train the model first.")

        # 2. Convert request data to DataFrame
        df = convert_to_dataframe(prediction_payload.data)
        
        # 3. Preprocess data for prediction, ensuring columns match training
        X_pred = encode_categorical_features(df, training_columns=feature_columns)

        # 4. Make predictions
        predictions = model.predict(X_pred)

        return {"predictions": predictions.tolist()}
