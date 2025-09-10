"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiCall } from "@/lib/api";

// Interface for a single suggestion, based on your backend controller's response
interface Suggestion {
  suggestion_id: number;
  title: string;
  suggestion_text: string;
  submission_date: string;
  is_archived: boolean;
}

const AdviserSuggestionLog = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Fetch suggestions from the API endpoint
        const data = await apiCall("/adviser/suggestions");
        // Filter out archived suggestions for the dashboard view
        setSuggestions(data.filter((s: Suggestion) => !s.is_archived));
      } catch (err: any) {
        setError(err.message || "Failed to fetch suggestions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading suggestions...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (suggestions.length === 0) {
    return (
      <p className="text-center text-gray-500">No active suggestions found.</p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-2">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.suggestion_id} className="w-full shadow-md">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-md font-semibold text-gray-800 leading-tight">
              {suggestion.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <CardDescription className="text-sm text-gray-700">
              {suggestion.suggestion_text}
            </CardDescription>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(suggestion.submission_date).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdviserSuggestionLog;
