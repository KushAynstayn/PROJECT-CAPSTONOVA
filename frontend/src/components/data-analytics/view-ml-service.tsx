"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
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
      // Extract only the message from the response
      setResult(response.message || "Operation completed successfully.");
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
        <div>
          <p className="font-semibold text-lg">Train Suggestions Model</p>
          <p className="text-sm text-muted-foreground">
            Vectorizes data from the suggestions table to query AI for project
            suggestions based on existing data.
          </p>
        </div>
        <Button
          onClick={handleTrain}
          variant="outline"
          disabled={isLoading}
          className="w-28"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Train"}
        </Button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-800 dark:text-green-300">
              {result}
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
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
      // Extract only the message from the response
      setResult(response.message || "Operation completed successfully.");
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
        <div>
          <p className="font-semibold text-lg">Train Association Model</p>
          <p className="text-sm text-muted-foreground">
            Generates association rules for programming language combinations in
            projects.
          </p>
        </div>
        <Button
          onClick={handleTrain}
          variant="outline"
          disabled={isLoading}
          className="w-28"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Train"}
        </Button>
      </div>
      {result && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-800 dark:text-green-300">
              {result}
            </p>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
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
        <div>
          <p className="font-semibold text-lg">
            Train Project Size Regression Model
          </p>
          <p className="text-sm text-muted-foreground">
            Analyzes the variables that most significantly impact the final
            project size.
          </p>
        </div>
        <Button
          onClick={handleTrain}
          variant="outline"
          disabled={isLoading}
          className="w-28"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Train"}
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
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
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
