# app/utils/data_preprocessing.py
# Generic, reusable helper functions for data transformation and preparation.

import pandas as pd
from typing import List, Tuple, Any, Optional
from pydantic import BaseModel

def convert_to_dataframe(data: List[BaseModel]) -> pd.DataFrame:
    """
    Converts a list of Pydantic models into a pandas DataFrame.
    This function is generic and works with any list of Pydantic models.

    Args:
        data (List[BaseModel]): A list of Pydantic model instances.

    Returns:
        pd.DataFrame: A pandas DataFrame representing the data.
    """
    # Use a list comprehension with .model_dump() for efficient conversion
    # .model_dump() is the standard method in Pydantic v2+
    if not data:
        return pd.DataFrame()
    return pd.DataFrame([item.model_dump() for item in data])

def separate_features_target(df: pd.DataFrame, target_column: str) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Separates a DataFrame into features (X) and a target variable (y).

    Args:
        df (pd.DataFrame): The input DataFrame.
        target_column (str): The name of the column to be used as the target variable.

    Returns:
        Tuple[pd.DataFrame, pd.Series]: A tuple containing the features DataFrame (X)
                                         and the target Series (y).
    """
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in DataFrame.")
    
    X = df.drop(columns=[target_column])
    y = df[target_column]
    return X, y

def encode_categorical_features(df: pd.DataFrame, training_columns: Optional[List[str]] = None) -> pd.DataFrame:
    """
    Applies one-hot encoding to categorical features in a DataFrame.
    
    If training_columns are provided, it aligns the DataFrame's columns,
    making it suitable for prediction on new data. Otherwise, it fits and
    transforms the data for training.

    Args:
        df (pd.DataFrame): The DataFrame to process.
        training_columns (List[str], optional): The exact list of column names from the
                                                training phase. Defaults to None.

    Returns:
        pd.DataFrame: The processed DataFrame with categorical features encoded.
    """
    # Perform one-hot encoding. This will convert all object/category columns.
    df_processed = pd.get_dummies(df, drop_first=True)

    if training_columns:
        # For prediction: Reindex to match the training set columns exactly.
        # This handles cases where new data has different categories.
        # - New categories in prediction data will be dropped.
        # - Missing categories from training data will be added with a fill_value of 0.
        df_processed = df_processed.reindex(columns=training_columns, fill_value=0)

    return df_processed
