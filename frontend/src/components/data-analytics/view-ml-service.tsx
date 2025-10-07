"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { apiCall, ApiError } from "@/lib/api";

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
  const [plots, setPlots] = useState<{
    residuals?: string;
    feature_importance?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlot = async (plotType: "residuals" | "feature_importance") => {
    const API_BASE = "http://127.0.0.1:8000/api";
    const response = await fetch(
      `${API_BASE}/ml-service/project-size/plot?plot_type=${plotType}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${plotType} plot`);
    }
    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob);
  };

  const handleTrain = async () => {
    setIsLoading(true);
    setPlots({});
    setError(null);
    try {
      await apiCall("/ml-service/project-size/train", "POST", {});

      // Once training is successful, fetch the plots
      const residualsPlotUrl = await fetchPlot("residuals");
      const featureImportancePlotUrl = await fetchPlot("feature_importance");

      setPlots({
        residuals: residualsPlotUrl,
        feature_importance: featureImportancePlotUrl,
      });
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
      {(plots.residuals || plots.feature_importance) && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Generated Plots:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plots.residuals && (
              <img
                src={plots.residuals}
                alt="Residuals Plot"
                className="w-full h-auto rounded-md"
              />
            )}
            {plots.feature_importance && (
              <img
                src={plots.feature_importance}
                alt="Feature Importance Plot"
                className="w-full h-auto rounded-md"
              />
            )}
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
