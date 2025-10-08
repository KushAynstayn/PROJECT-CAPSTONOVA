"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
// Import the new function and remove unused imports
import { apiCall, ApiError, apiCallForBlob } from "@/lib/api";

const TrainSuggestionsCard = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrain = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await apiCall(
        "/ml-service/train-suggestions",
        "POST",
        {}
      );
      setResult(JSON.stringify(response, null, 2));
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(`Error ${err.status}: ${err.message}`);
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">Train Suggestions Model</p>
        <Button onClick={handleTrain} variant="outline" disabled={isLoading}>
          {isLoading ? "Training..." : "Train"}
        </Button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Success Response:</h3>
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-md">
          <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">
            Error:
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};

const TrainAssociationCard = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrain = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await apiCall("/ml-service/train-association", "GET");
      setResult(JSON.stringify(response, null, 2));
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(`Error ${err.status}: ${err.message}`);
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">Train Association Model</p>
        <Button onClick={handleTrain} variant="outline" disabled={isLoading}>
          {isLoading ? "Training..." : "Train"}
        </Button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Success Response:</h3>
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-md">
          <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">
            Error:
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};

const TrainProjectSizeRegressionCard = () => {
  const [plotUrl, setPlotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // This function now uses the proper apiCallForBlob from our lib
  const fetchPlot = async (plotType: "residuals" | "feature_importance") => {
    const imageBlob = await apiCallForBlob(
      `/ml-service/project-size/plot?plot_type=${plotType}`
    );
    return URL.createObjectURL(imageBlob);
  };

  const handleTrain = async () => {
    setIsLoading(true);
    setPlotUrl(null);
    setError(null);
    try {
      await apiCall("/ml-service/project-size/train", "POST", {});

      // Once training is successful, fetch only the feature importance plot
      const featureImportancePlotUrl = await fetchPlot("feature_importance");

      setPlotUrl(featureImportancePlotUrl);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(`Error ${err.status}: ${err.message}`);
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">
          Train Project Size Regression Model
        </p>
        <Button onClick={handleTrain} variant="outline" disabled={isLoading}>
          {isLoading ? "Training..." : "Train"}
        </Button>
      </div>
      {plotUrl && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Generated Plot:</h3>
          <div className="flex justify-center">
            <img
              src={plotUrl}
              alt="Feature Importance Plot"
              className="max-w-full h-auto rounded-md"
            />
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded-md">
          <h3 className="font-semibold mb-2 text-red-800 dark:text-red-200">
            Error:
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};

const ViewMlService = () => {
  return (
    <div>
      <TrainSuggestionsCard />
      <TrainAssociationCard />
      <TrainProjectSizeRegressionCard />
    </div>
  );
};

export default ViewMlService;
